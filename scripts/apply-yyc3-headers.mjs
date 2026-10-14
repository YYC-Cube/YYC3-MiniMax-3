/**
 * @file: apply-yyc3-headers.mjs
 * @description: YYC³ 全局标头/标尾合规引擎 — 基于《YYC3-团队规范-文档闭环.md》v3.1.0 标准化升级
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 *     @created/@updated/@status/@copyright/@license）— 已有描述块的注入缺失字段，无块的生成标准头
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 *
 * 功能（可追溯迭代）：
 *  1. 代码文件（.ts/.tsx/.mjs）：确保 JSDoc 元数据标头（@file/@description/@author/@version/
 *  2. 文档（.md）：确保 YAML frontmatter（file/description/author/version/created/updated/
 *     status/tags/category）+ 品牌标头块引 + 品牌标尾版权
 *  3. 内容变更时自动 updated=today 并递增语义化版本（patch）
 *  4. 规范参考库（--validate-ref）：只读校验合规率，不写入
 *  5. 产出追溯清单 JSON（--registry <path>）
 *
 * 用法：
 *   node scripts/apply-yyc3-headers.mjs --dry-run                 # 预览不写入
 *   node scripts/apply-yyc3-headers.mjs                           # 全局应用
 *   node scripts/apply-yyc3-headers.mjs --validate-ref            # 参考库只读校验
 */

import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TODAY = new Date().toLocaleDateString('sv-SE');
const AUTHOR = 'YanYuCloudCube Team <admin@0379.email>';
const COPYRIGHT = 'Copyright (c) 2025-2026 YYC³ Team';

const MD_REQUIRED = ['file', 'description', 'author', 'version', 'created', 'updated', 'status', 'tags', 'category'];
const CODE_REQUIRED = ['file', 'author', 'version', 'created', 'updated', 'status', 'copyright', 'license'];
const CODE_FIELD_ORDER = ['file', 'description', 'author', 'version', 'created', 'updated', 'status', 'copyright', 'license'];

const BRAND_HEADER_MD = [
  '> ***YanYuCloudCube***',
  '> *言启象限 | 语枢未来*',
  '> ***Words Initiate Quadrants, Language Serves as Core for Future***',
  '> *万象归元于云枢 | 深栈智启新纪元*',
  '> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***',
].join('\n');

const BRAND_FOOTER_MD = [
  '> 「***YanYuCloudCube***」',
  '> 「***<admin@0379.email>***」',
  '> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」',
  '> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」',
  '',
  '**© 2025-2026 YanYuCloudCube™. All Rights Reserved.**',
].join('\n');

const SKIP_DIRS = new Set(['node_modules', 'dist', '.pnpm-store', '.git', '.figma', 'public', 'dist-browser']);
const REFERENCE_LIB_DIR = 'YYC3-团队通用-标准规范';

/* ---------- 工具函数 ---------- */

function walk(dir, exts, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name) || name === REFERENCE_LIB_DIR) continue;
    const full = path.join(dir, name);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) walk(full, exts, out);
    else if (exts.some((e) => name.endsWith(e))) out.push(full);
  }
  return out;
}

function fileCreatedDate(abs) {
  try {
    const st = statSync(abs);
    const d = st.birthtime && st.birthtime.getFullYear() > 2000 ? st.birthtime : st.mtime;
    return d.toLocaleDateString('sv-SE');
  } catch {
    return TODAY;
  }
}

function bumpVersion(v) {
  const m = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(String(v).trim());
  if (!m) return v;
  return `v${m[1]}.${m[2]}.${Number(m[3]) + 1}`;
}

function codeDescription(rel) {
  const p = rel.replace(/^src\//, '');
  const base = path.basename(p, path.extname(p));
  if (p.includes('__tests__')) return `单元测试：${base}`;
  if (p.startsWith('pages')) return `页面组件：${base}`;
  if (p.startsWith('components')) return `组件：${base}`;
  if (p.startsWith('api')) return `API 契约层：${base}`;
  if (p.startsWith('data')) return `演示数据层：${base}`;
  if (p.startsWith('tokens')) return `设计令牌基座：${base}`;
  if (p.startsWith('types')) return `类型定义：${base}`;
  if (p === 'vite.config.ts') return 'Vite 构建配置';
  if (p === 'vitest.config.ts') return 'Vitest 测试与覆盖率门禁配置';
  if (p.startsWith('scripts')) return `工程化脚本：${base}`;
  return `模块：${base}`;
}

/**
 * 元数据行排序：序言（描述性文本）在前，其后按 CODE_FIELD_ORDER 规范序排列已知键，
 * 未知键（如 @example）缀于尾部。
 */
function normalizeOrder(block) {
  const lines = block.split('\n');
  const open = lines.findIndex((l) => l.startsWith('/*'));
  const close = lines.findIndex((l) => /^\s*\*\/\s*$/.test(l));
  if (open < 0 || close < 0) return block;
  const inner = lines.slice(open + 1, close);
  const metaIdx = inner.findIndex((l) => /^\s*\*\s*@\w+/.test(l));
  if (metaIdx < 0) return block;
  const prose = inner.slice(0, metaIdx);
  const metas = inner.slice(metaIdx);
  const rank = (l) => {
    const m = /^\s*\*\s*@(\w+)/.exec(l);
    if (!m) return CODE_FIELD_ORDER.length;
    const i = CODE_FIELD_ORDER.indexOf(m[1]);
    return i < 0 ? CODE_FIELD_ORDER.length : i;
  };
  const sorted = [...metas].sort((a, b) => rank(a) - rank(b));
  return [...lines.slice(0, open + 1), ...prose, ...sorted, ...lines.slice(close)].join('\n');
}

/**
 * 元数据块归一：已知键的无冒号行（@file x）转换为冒号格式（@file: x）；
 * 若同键冒号行已存在则丢弃无冒号重复行。未知键（如 @example）保持原样。
 */
function normalizeMetaBlock(block) {
  const lines = block.split('\n');
  const colonKeys = new Set();
  for (const l of lines) {
    const m = /^\s*\*\s*@(\w+):/.exec(l);
    if (m && CODE_FIELD_ORDER.includes(m[1])) colonKeys.add(m[1]);
  }
  const out = [];
  for (const l of lines) {
    const noColon = /^(\s*\*\s*)@(\w+)\s+(.+)$/.exec(l);
    if (noColon && CODE_FIELD_ORDER.includes(noColon[2])) {
      if (colonKeys.has(noColon[2])) continue; // 冒号版已在，丢弃无冒号重复
      out.push(`${noColon[1]}@${noColon[2]}: ${noColon[3]}`);
      colonKeys.add(noColon[2]);
    } else {
      out.push(l);
    }
  }
  return out.join('\n');
}

/* ---------- 代码文件处理 ---------- */

function processCode(abs, rel, dryRun) {
  const original = readFileSync(abs, 'utf8');
  const m = /^\/\*\*[\s\S]*?\*\//.exec(original);
  const stats = { action: 'compliant', changed: false };
  let content = original;

  const created = fileCreatedDate(abs);
  const desc = codeDescription(rel);

  if (!m) {
    // 无 JSDoc 标头：借用紧邻的 // 行注释首句作为描述线索，再生成标准头
    const lineHint = /^\s*\/\/\s*(.+)$/m.exec(original.slice(0, 500));
    const header = [
      '/**',
      ` * @file: ${path.basename(rel)}`,
      ` * @description: ${lineHint ? lineHint[1].trim() : desc}`,
      ` * @author: ${AUTHOR}`,
      ' * @version: v1.0.0',
      ` * @created: ${created}`,
      ` * @updated: ${TODAY}`,
      ' * @status: stable',
      ` * @copyright: ${COPYRIGHT}`,
      ' * @license: MIT',
      ' */',
    ].join('\n');
    content = `${header}\n\n${original}`;
    stats.action = 'header-created';
    stats.changed = true;
  } else {
    const block = m[0];
    const fields = {};
    for (const fm of block.matchAll(/@([a-zA-Z_]+):\s*([^\n]*)/g)) fields[fm[1]] = fm[2].trim();

    const plainLine = block
      .split('\n')
      .map((l) => l.replace(/^\s*\*\s?/, '').trim())
      .find((l) => l && !l.startsWith('@') && l !== '/**' && l !== '*/');

    const insert = [];
    for (const key of CODE_FIELD_ORDER) {
      if (key === 'description') {
        if (!fields.description && (plainLine || desc) && block.includes('@file')) {
          insert.push(` * @description ${plainLine || desc}`);
        }
        continue;
      }
      if (CODE_REQUIRED.includes(key) && !fields[key]) insert.push(` * @${key}: ${key === 'author' ? AUTHOR : key === 'copyright' ? COPYRIGHT : key === 'license' ? 'MIT' : key === 'created' ? created : key === 'version' ? 'v1.0.0' : key === 'status' ? 'stable' : key === 'file' ? path.basename(rel) : TODAY}`);
    }

    let newBlock = block;
    if (insert.length) {
      // 行级插入：置于闭合 */ 行之前，保留其原始缩进
      const blockLines = newBlock.split('\n');
      let pos = blockLines.length - 1;
      while (pos >= 0 && !/^\s*\*\/\s*$/.test(blockLines[pos])) pos--;
      blockLines.splice(pos, 0, ...insert);
      newBlock = blockLines.join('\n');
      stats.action = fields.file ? 'fields-injected' : 'header-upgraded';
      stats.changed = true;
    }
    const insertingFile = insert.some((l) => l.includes('@file'));
    const insertingDesc = insert.some((l) => l.includes('@description'));
    if (!fields.description && !insertingDesc && (plainLine || desc) && (block.includes('@file') || insertingFile)) {
      // 行级插入：置于 @file 行之后
      const blockLines = newBlock.split('\n');
      const fi = blockLines.findIndex((l) => /^\s*\*\s*@file\b/.test(l));
      if (fi >= 0) blockLines.splice(fi + 1, 0, ` * @description: ${plainLine || desc}`);
      newBlock = blockLines.join('\n');
      if (!stats.changed) stats.action = 'fields-injected';
      stats.changed = true;
    }
    if (fields.updated && fields.updated !== TODAY) {
      newBlock = newBlock.replace(`@updated: ${fields.updated}`, `@updated: ${TODAY}`);
      stats.changed = true;
      stats.updatedBumped = true;
    }
    if (fields.version && fields.updated !== TODAY && /^\s*v?\d+\.\d+\.\d+\s*$/.test(fields.version)) {
      newBlock = newBlock.replace(`@version: ${fields.version}`, `@version: ${bumpVersion(fields.version)}`);
      stats.versionBumped = true;
    }
    if (stats.changed) content = original.replace(block, newBlock);
  }

  // 元数据归一（无条件执行）：无冒号键转换/去重 + 排序 + 行首缩进修复 + 描述刷新
  const nm = /^\/\*\*[\s\S]*?\*\//.exec(content);
  if (nm) {
    let normalized = normalizeMetaBlock(nm[0]);
    normalized = normalizeOrder(normalized);
    normalized = normalized
      .split('\n')
      .map((l) => l.replace(/^ {2,}\*/, ' *'))
      .join('\n');
    // 自动生成的描述随分类规则迭代刷新（保持与最新规则一致）
    const curDesc = /@description:\s*(.+)/.exec(normalized);
    if (curDesc && /^(模块|页面组件|组件|API 契约层|演示数据层|设计令牌基座|类型定义|单元测试|工程化脚本)：/.test(curDesc[1])) {
      normalized = normalized.replace(`@description: ${curDesc[1]}`, `@description: ${desc}`);
    }
    if (normalized !== nm[0]) {
      content = content.replace(nm[0], normalized);
      stats.changed = true;
      stats.normalized = true;
      if (stats.action === 'compliant') stats.action = 'meta-normalized';
    }
  }

  if (stats.changed && !dryRun) writeFileSync(abs, content, 'utf8');
  return stats;
}

/* ---------- Markdown 处理 ---------- */

function parseFrontmatter(content) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(content);
  if (!m) return null;
  return { raw: m[0], lines: m[1].split(/\r?\n/), body: content.slice(m[0].length) };
}

function fmGet(lines, key) {
  const line = lines.find((l) => new RegExp(`^${key}:`).test(l));
  return line ? line.slice(key.length + 1).trim() : undefined;
}

function fmSet(lines, key, value) {
  const i = lines.findIndex((l) => new RegExp(`^${key}:`).test(l));
  if (i >= 0) lines[i] = `${key}: ${value}`;
  else lines.push(`${key}: ${value}`);
}

function mdDescription(basename, body) {
  // 剥离代码围栏与 HTML 注释，避免误取 shell 注释/代码首行作为描述
  const prose = body.replace(/```[\s\S]*?```/g, '').replace(/<!--[\s\S]*?-->/g, '');
  const h1Html = /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(prose);
  if (h1Html) return h1Html[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const h1 = /^#\s+(.+)$/m.exec(prose);
  if (h1) return h1[1].replace(/[*_`]/g, '').trim();
  const map = {
    'README.md': '项目主入口文档 — 全景介绍与快速开始',
    'CONTRIBUTING.md': '贡献指南 — 开发流程与质量门禁',
    'CODE_OF_CONDUCT.md': '行为准则 — 社区协作公约',
    'SECURITY.md': '安全策略 — 漏洞报告与响应',
    'AGENTS.md': 'AI 协同开发上下文 — 工程结构与约定',
    'CLAUDE.md': 'AI 导师上下文入口（引用 AGENTS.md）',
    'Family-README.md': 'YYC³ AI Family 家族说明文档',
  };
  return map[basename] || `${basename.replace(/\.md$/, '')} 专项文档`;
}

function processMarkdown(abs, rel, dryRun) {
  const original = readFileSync(abs, 'utf8');
  const basename = path.basename(rel);
  const fm = parseFrontmatter(original);
  const stats = { action: 'compliant', changed: false };
  let lines;
  let body;

  if (!fm) {
    lines = [];
    body = original;
    for (const key of MD_REQUIRED) {
      const v =
        key === 'file' ? basename :
          key === 'description' ? mdDescription(basename, body) :
            key === 'author' ? AUTHOR :
              key === 'version' ? 'v1.0.0' :
                key === 'created' ? fileCreatedDate(abs) :
                  key === 'updated' ? TODAY :
                    key === 'status' ? 'stable' :
                      key === 'tags' ? '[文档]' : 'doc';
      fmSet(lines, key, v);
    }
    stats.action = 'frontmatter-created';
    stats.changed = true;
  } else {
    lines = fm.lines;
    body = fm.body;
    const missing = MD_REQUIRED.filter((k) => fmGet(lines, k) === undefined);
    for (const key of missing) {
      const v =
        key === 'file' ? basename :
          key === 'description' ? mdDescription(basename, body) :
            key === 'author' ? AUTHOR :
              key === 'version' ? 'v1.0.0' :
                key === 'created' ? fileCreatedDate(abs) :
                  key === 'status' ? 'stable' :
                    key === 'tags' ? '[文档]' : 'doc';
      fmSet(lines, key, v);
    }
    if (missing.length) {
      stats.action = 'frontmatter-completed';
      stats.changed = true;
    }
  }

  // 品牌标头：正文前部无标准块引则插入
  if (!body.slice(0, 2000).includes('> ***YanYuCloudCube***')) {
    body = `${BRAND_HEADER_MD}\n\n---\n\n${body.replace(/^\s+/, '')}`;
    stats.changed = true;
    stats.headerAdded = true;
    if (stats.action === 'compliant') stats.action = 'brand-header-added';
  }

  // 品牌标尾：无版权尾则追加
  if (!body.includes('> 「***YanYuCloudCube***」')) {
    body = `${body.trimEnd()}\n\n---\n\n${BRAND_FOOTER_MD}\n`;
    stats.changed = true;
    stats.footerAdded = true;
    if (stats.action === 'compliant') stats.action = 'brand-footer-added';
  }

  // 内容有变更 → updated=today + 版本 patch 递增（可追溯迭代）
  if (stats.changed) {
    const curUpdated = fmGet(lines, 'updated');
    if (curUpdated !== TODAY) fmSet(lines, 'updated', TODAY);
    const ver = fmGet(lines, 'version');
    if (ver && /^v\d+\.\d+\.\d+$/.test(ver) && curUpdated !== undefined) fmSet(lines, 'version', bumpVersion(ver));
  }

  const content = `---\n${lines.join('\n')}\n---\n\n${body}`;
  if (stats.changed && !dryRun) writeFileSync(abs, content, 'utf8');
  return stats;
}

/* ---------- 参考库只读校验 ---------- */

function validateReferenceLib() {
  const dir = path.join(ROOT, 'docs', REFERENCE_LIB_DIR);
  let files;
  try {
    files = walk(dir, ['.md']);
  } catch {
    return null;
  }
  let compliant = 0;
  const violations = [];
  for (const f of files) {
    const c = readFileSync(f, 'utf8');
    const ok = c.startsWith('---') && c.includes('> ***YanYuCloudCube***') && c.includes('admin@0379.email');
    if (ok) compliant++;
    else violations.push(path.relative(ROOT, f));
  }
  return { total: files.length, compliant, violations };
}

/* ---------- 主流程 ---------- */

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const validateRef = args.includes('--validate-ref');
  const registryIdx = args.indexOf('--registry');
  const registryPath = registryIdx >= 0 ? path.resolve(args[registryIdx + 1]) : null;

  const registry = { generated_at: new Date().toISOString(), standard: 'YYC3-团队规范-文档闭环 v3.1.0 标准化升级', dry_run: dryRun, code: [], markdown: [] };

  if (validateRef) {
    const ref = validateReferenceLib();
    console.log(`参考库只读校验：${ref.compliant}/${ref.total} 合规`);
    for (const v of ref.violations) console.log(`  ❌ ${v}`);
    registry.reference_library = ref;
  }

  const codeFiles = walk(ROOT, ['.ts', '.tsx', '.mjs']);
  const mdFiles = walk(ROOT, ['.md']);

  for (const abs of codeFiles) {
    const rel = path.relative(ROOT, abs);
    const s = processCode(abs, rel, dryRun);
    registry.code.push({ path: rel, ...s });
    if (s.changed) console.log(`  📄 ${s.action.padEnd(18)} ${rel}`);
  }
  for (const abs of mdFiles) {
    const rel = path.relative(ROOT, abs);
    const s = processMarkdown(abs, rel, dryRun);
    registry.markdown.push({ path: rel, ...s });
    if (s.changed) console.log(`  📚 ${s.action.padEnd(18)} ${rel}`);
  }

  const codeChanged = registry.code.filter((r) => r.changed).length;
  const mdChanged = registry.markdown.filter((r) => r.changed).length;
  console.log(`\n代码：${codeChanged}/${registry.code.length} 个文件补齐标头`);
  console.log(`文档：${mdChanged}/${registry.markdown.length} 个文件补齐标头/标尾`);
  console.log(`模式：${dryRun ? 'DRY-RUN（未写入）' : '已应用'}`);

  if (registryPath && !dryRun) {
    mkdirSync(path.dirname(registryPath), { recursive: true });
    writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf8');
    console.log(`追溯清单：${path.relative(ROOT, registryPath)}`);
  }
}

main();
