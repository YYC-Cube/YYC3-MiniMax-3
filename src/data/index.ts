/**
 * @file: index.ts
 * @description: 演示数据 barrel：按域拆分（production/tasks/editing/publishing/cognition/management），统一再导出保持 '../data' 路径稳定
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v2.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

export { MOCK_SCRIPTS, MOCK_SHOTS, MOCK_ASSETS, MOCK_BATCH_ITEMS } from './production';
export { MOCK_TASKS } from './tasks';
export { MOCK_TIMELINE_CLIPS, MOCK_VIDEO_TEMPLATES } from './editing';
export { MOCK_ACCOUNTS, MOCK_PUBLISH_MATRIX } from './publishing';
export { MOCK_LEARNING_SAMPLES, MOCK_MEMORIES } from './cognition';
export { MOCK_COMMENTS } from './management';
