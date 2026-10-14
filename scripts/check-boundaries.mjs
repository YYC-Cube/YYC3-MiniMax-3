#!/usr/bin/env node
/**
 * @file: check-boundaries.mjs
 * @description: YYC³ 零依赖架构边界门禁（PR-9/PR-10）：规则源自《05-架构健康度诊断与迁移计划》第五节，
 *               以 Node 内置模块实现（dependency-cruiser 因沙箱限制不可安装），先对现状校准 0 违规，后续逐步收紧。
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 *
 * 规则清单：
 *  R1 ui-no-cross-page-import  页面之间禁止互相导入（跨页耦合归 navigation/registry）
 *  R2 ui-no-direct-data        mock 数据仅限 api 契约层与 data 域自身消费（__tests__ 豁免）
 *  R3 ui-no-direct-fetch       唯一网络出口 = src/api/client.ts（__tests__ 豁免）
 *  R4 domain-no-react          domain/tokens 纯逻辑域禁止导入 react
 *  R5 no-external-urls-in-src  禁止一切外链 URL 字面量（本地优先；本地资源走 /demo/ 静态资产
 *                              或确定性渐变占位，R5-D 起全域 0 豁免）
 *  R6 no-any-or-ts-ignore      禁止 any（as any/: any/<any>/any[]）与 @ts-ignore/@ts-expect-error
 *  R7 file-header-required     src 下所有 .ts/.tsx 必须含 @file 标头（报告 PR-10「标头 dry-run」）
 *  R8 logic-no-observability   api/domain/tokens/data 纯逻辑层禁止导入 observability
 *                              （遥测走 ApiEventSink 端口注入，组合根 main.tsx 桥接——R6 专项）
 *  R9 pages-snapshot-binding   pages 层 useApiData 调用必须绑定 SNAPSHOT 键位
 *                              （快照降级激活 + 防手写错配污染快照——R12 专项）
 *  D1 dist-chunk-budget        构建产物存在时：最大 .js chunk 原始体积 < 500KB（报告门禁「主 chunk 不回退」）
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const DIST_ASSETS = path.join(ROOT, 'dist', 'assets');

/** 收集 src 下所有 .ts/.tsx 文件（返回相对 src 的 posix 路径，如 'pages/production/TasksPage.tsx'） */
function collectSrcFiles() {
  const out = [];
  const walk = (abs, rel) => {
    for (const name of readdirSync(abs)) {
      const absPath = path.join(abs, name);
      const relPath = rel ? `${rel}/${name}` : name;
      if (statSync(absPath).isDirectory()) walk(absPath, relPath);
      else if (/\.(ts|tsx)$/.test(name)) out.push(relPath);
    }
  };
  walk(SRC, '');
  return out.sort();
}

/** 解析单文件的全部导入说明符（静态 from / 裸导入 / 动态 import()） */
function extractImportSpecifiers(content) {
  const specs = [];
  for (const m of content.matchAll(/from\s+['"]([^'"]+)['"]/g)) specs.push(m[1]);
  for (const m of content.matchAll(/import\s+['"]([^'"]+)['"]/g)) specs.push(m[1]);
  for (const m of content.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g)) specs.push(m[1]);
  return specs;
}

/** 将导入说明符归一为相对 src 的内部路径；外部依赖（npm 包等）返回 null */
function resolveInternal(spec, fromRel) {
  let abs;
  if (spec.startsWith('@/')) abs = path.join(SRC, spec.slice(2));
  else if (spec.startsWith('.')) abs = path.resolve(path.dirname(path.join(SRC, fromRel)), spec);
  else return null;
  const rel = path.relative(SRC, abs).split(path.sep).join('/');
  return rel.startsWith('..') ? null : rel;
}

const violations = [];
const add = (rule, file, message) => violations.push({ rule, file, message });

const RE_FETCH_CALL = /\bfetch\s*\(/;
const RE_EXTERNAL_URL = /https?:\/\/([^'"\s)/]+)/;
const RE_ANY_OR_TS_IGNORE = /\bas any\b|:\s*any\b|<any>\b|any\[\]|@ts-ignore|@ts-expect-error/;
const RE_REACT_IMPORT = /^react($|[\-/])/;

/** 目录前缀判定：rel 为文件或目录路径，dir 为 src 内目录名（如 'data'） */
const inDir = (rel, dir) => rel === dir || rel.startsWith(`${dir}/`);

for (const rel of collectSrcFiles()) {
  const content = readFileSync(path.join(SRC, rel), 'utf8');
  const inTests = rel.includes('__tests__');

  // R7 文件标头
  if (!content.includes('@file:')) add('R7-file-header-required', rel, '缺少 @file 标头注释');

  // R6 any / ts-ignore
  const anyHit = content.match(RE_ANY_OR_TS_IGNORE);
  if (anyHit) add('R6-no-any-or-ts-ignore', rel, `命中 any/ts-ignore 模式：${anyHit[0]}`);

  // R3 唯一网络出口
  if (!inTests && rel !== 'api/client.ts' && RE_FETCH_CALL.test(content)) {
    add('R3-ui-no-direct-fetch', rel, '检测到 fetch() 直调，请改走 api/client.ts');
  }

  // R9 pages 层 useApiData 必绑 SNAPSHOT 键位（调用点实测均为单行形态；api/hooks 层豁免）
  if (inDir(rel, 'pages') && !inTests) {
    for (const [idx, line] of content.split('\n').entries()) {
      if (line.includes('useApiData(') && !line.includes('SNAPSHOT.')) {
        add('R9-pages-snapshot-binding', rel, `第 ${idx + 1} 行 useApiData 未绑定 SNAPSHOT 键位（离线快照降级不生效）`);
      }
    }
  }

  // R5 外链 URL（全域 0 豁免，测试豁免）
  if (!inTests) {
    for (const m of content.matchAll(new RegExp(RE_EXTERNAL_URL.source, 'g'))) {
      add('R5-no-external-urls-in-src', rel, `外链 URL 字面量被禁止：${m[0]}`);
    }
  }

  // R1/R2/R4 导入边界
  for (const spec of extractImportSpecifiers(content)) {
    const to = resolveInternal(spec, rel);
    if (!to) continue;
    if (inDir(rel, 'pages') && inDir(to, 'pages')) {
      add('R1-ui-no-cross-page-import', rel, `页面互导被禁止：${spec}`);
    }
    if (!inDir(rel, 'api') && !inDir(rel, 'data') && !inTests && inDir(to, 'data')) {
      add('R2-ui-no-direct-data', rel, `UI 层直连 data 域被禁止（请走 api 契约层）：${spec}`);
    }
    if ((inDir(rel, 'domain') || inDir(rel, 'tokens')) && RE_REACT_IMPORT.test(spec)) {
      add('R4-domain-no-react', rel, `纯逻辑域导入 react 被禁止：${spec}`);
    }
    if ((inDir(rel, 'api') || inDir(rel, 'domain') || inDir(rel, 'tokens') || inDir(rel, 'data')) && inDir(to, 'observability')) {
      add('R8-logic-no-observability', rel, `纯逻辑层导入 observability 被禁止（走 ApiEventSink 端口注入）：${spec}`);
    }
  }
}

// D1 构建产物体积预算（dist 不存在时跳过，verify 链中 build 先于本门禁执行）
let distChecked = false;
if (existsSync(DIST_ASSETS)) {
  distChecked = true;
  const BUDGET = 500 * 1024;
  let worst = null;
  for (const name of readdirSync(DIST_ASSETS)) {
    if (!name.endsWith('.js')) continue;
    const buf = readFileSync(path.join(DIST_ASSETS, name));
    if (!worst || buf.length > worst.bytes) worst = { name, bytes: buf.length };
  }
  if (worst) {
    const gzipKB = (gzipSync(readFileSync(path.join(DIST_ASSETS, worst.name))).length / 1024).toFixed(2);
    const sizeKB = (worst.bytes / 1024).toFixed(2);
    if (worst.bytes >= BUDGET) {
      add('D1-dist-chunk-budget', `dist/assets/${worst.name}`, `最大 chunk ${sizeKB}KB 超出 500KB 预算`);
    }
    console.log(`  dist 最大 chunk: ${worst.name} = ${sizeKB}KB (gzip ${gzipKB}KB) — 预算 500KB`);
  }
}

// ---- 报告 ----
if (violations.length > 0) {
  console.error(`\n✗ 架构边界门禁未通过：${violations.length} 处违规\n`);
  for (const v of violations) console.error(`  [${v.rule}] src/${v.file}\n    → ${v.message}`);
  process.exit(1);
}

console.log(`\n✓ 架构边界门禁通过：R1-R9 全部 0 违规${distChecked ? '，D1 chunk 预算达标' : '（dist 未构建，D1 跳过）'}`);
