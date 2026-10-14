/**
 * @file: vitest.config.ts
 * @description: YYC³ 质量门禁 — 单元测试基线
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// YYC³ 质量门禁 — 单元测试基线
// 覆盖范围：纯逻辑层（tokens 设计令牌 / domain 领域规则 / data 演示数据 / api 契约层 / observability 遥测 / navigation 注册表）
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      include: [
        'src/tokens/**',
        'src/domain/**',
        'src/data/**',
        'src/api/**',
        'src/observability/**',
        'src/navigation/**',
      ],
      // 纯 re-export barrel 零可执行逻辑，不计入覆盖率口径
      exclude: ['src/api/index.ts', 'src/data/index.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
