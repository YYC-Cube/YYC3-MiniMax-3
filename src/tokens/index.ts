/**
 * YYC³ AI Family · Comic Drama Design Tokens
 * 严格按照规范定义的全局设计基座（Tokens / 变量）
 * @file: index.ts
 * @description: YYC³ AI Family · Comic Drama Design Tokens
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
*/

import { REF_CONSISTENCY_PASS, SYNCNET_PASS } from '../domain/rules';
import type { PageId } from '../types';

export const COLOR_TOKENS = {
  // 基础背景与层级
  bgBase: '#0a1628',
  bgBaseGradient: 'linear-gradient(180deg, #0a1628 0%, #071222 100%)',
  bgMuted: '#0f1e35',
  bgRaised: '#152640',
  bgOverlay: 'rgba(7, 18, 34, 0.85)',
  bgGlass: 'rgba(15, 30, 53, 0.75)',

  // 文本色彩
  textPrimary: '#e8f0f8',
  textSecondary: '#8a97a8',
  textTertiary: '#5c697a',

  // 描边与投影
  border: 'rgba(0, 224, 184, 0.12)',
  borderActive: 'rgba(0, 224, 184, 0.45)',
  borderMuted: 'rgba(255, 255, 255, 0.08)',
  borderDanger: 'rgba(255, 68, 34, 0.35)',
  borderWarning: 'rgba(255, 176, 32, 0.35)',

  // 核心功能主色
  accent: '#00e0b8',
  info: '#00b4d8',
  process: '#9d7cd8',
  warning: '#ff7a45',
  danger: '#ff4422',
  success: '#22C55E',
} as const;

/**
 * 四大功能域色彩映射（全局一致性红线）
 * 仅允许以「顶边 3px 色条 / 16×16 圆角标 / 图表系列」形式出现，禁止大面积铺色！
 */
export const DOMAIN_COLORS = {
  production: {
    id: 'production',
    name: '生产全链路',
    color: '#00e0b8', // 青绿
    label: '生产域',
  },
  editing: {
    id: 'editing',
    name: '剪辑合并',
    color: '#9d7cd8', // 流程紫
    label: '剪辑域',
  },
  management: {
    id: 'management',
    name: '平台管理',
    color: '#00b4d8', // 信息蓝
    label: '管理域',
  },
  publishing: {
    id: 'publishing',
    name: '一键推送',
    color: '#FF7A5C', // 珊瑚红
    label: '推送域',
  },
} as const;

export type DomainType = keyof typeof DOMAIN_COLORS;

/**
 * AI Family 8 成员专属色（视觉平等红线）
 * 头像尺寸一致、亮度一致，仅靠专属色区分角色
 */
export interface AgentSpec {
  id: string;
  name: string;
  codeName: string;
  color: string;
  role: string;
  desc: string;
  clockPosition: string; // 1.5h 间隔时钟环位
  degree: number;
}

export const AGENTS_LIST: AgentSpec[] = [
  {
    id: 'yanqi-qianxing',
    name: '言启·千行',
    codeName: 'yanqi-qianxing',
    color: '#FFD700', // 金色
    role: '意图识别',
    desc: '意图识别、语音转写、语义解析、分发路由',
    clockPosition: '06:00',
    degree: 180,
  },
  {
    id: 'yushu-wanwu',
    name: '语枢·万物',
    codeName: 'yushu-wanwu',
    color: '#FF69B4', // 粉色
    role: '数据分析',
    desc: '数据分析、内容提炼、信息聚合、反哺洞察',
    clockPosition: '07:30',
    degree: 225,
  },
  {
    id: 'yujian-xianzhi',
    name: '预见·先知',
    codeName: 'yujian-xianzhi',
    color: '#00BFFF', // 蓝色
    role: '趋势预测',
    desc: '趋势预测、异常预警、调度规划、掉线预测',
    clockPosition: '09:00',
    degree: 270,
  },
  {
    id: 'zhiyu-bole',
    name: '知遇·伯乐',
    codeName: 'zhiyu-bole',
    color: '#FFFFFF', // 白色
    role: '推荐优化',
    desc: '种子推荐、参数优化、平台推荐、效果匹配',
    clockPosition: '10:30',
    degree: 315,
  },
  {
    id: 'yuanqi-tianshu',
    name: '元启·天枢',
    codeName: 'yuanqi-tianshu',
    color: '#00e0b8', // 青绿
    role: '全局调度',
    desc: '全局调度、六阶段流水编排、任务分发、仲裁主持',
    clockPosition: '12:00',
    degree: 0,
  },
  {
    id: 'zhiyun-shouhu',
    name: '智云·守护',
    codeName: 'zhiyun-shouhu',
    color: '#9d7cd8', // 紫色
    role: '安全防护',
    desc: '异常检测、风险防护、输入过滤、审计脱敏',
    clockPosition: '13:30',
    degree: 45,
  },
  {
    id: 'gewu-zongshi',
    name: '格物·宗师',
    codeName: 'gewu-zongshi',
    color: '#C0C0C0', // 银色
    role: '质量校验',
    desc: '质量评分、标准校验、缺陷识别、复检门禁',
    clockPosition: '15:00',
    degree: 90,
  },
  {
    id: 'chuangxiang-lingyun',
    name: '创想·灵韵',
    codeName: 'chuangxiang-lingyun',
    color: '#FF7A5C', // 珊瑚色
    role: '创意生成',
    desc: '提示词生成、创意优化、分镜创作、剧本改写',
    clockPosition: '16:30',
    degree: 135,
  },
];

/** 全局调度默认智能体（仲裁主持）— 全仓唯一字面量定义点，消费方一律引用本常量 */
export const DEFAULT_AGENT_ID = 'yuanqi-tianshu';

/** 议事厅常驻三角角色锚定（仲裁主持 / 质检方 / 创作方）— 跨文件引用智能体的唯一字面量点 */
export const COUNSEL_ROLE_AGENT_IDS = {
  arbiter: DEFAULT_AGENT_ID,
  quality: 'gewu-zongshi',
  creator: 'chuangxiang-lingyun',
} as const;

export const AGENTS_MAP = AGENTS_LIST.reduce(
  (acc, agent) => {
    acc[agent.id] = agent;
    return acc;
  },
  {} as Record<string, AgentSpec>
);

/**
 * 认知语义色（叠加在四域色之上，用于 Agent 智能层）
 * 只允许以「左侧 3px 认知条 / 16×16 认知圆点 / 图表辅助线」形式出现
 */
export const COGNITION_COLORS = {
  think: '#7B8CFF', // Agent 思考中 / 推理链展示
  confirm: '#22C55E', // 高置信度 / 已学习
  doubt: '#FFB020', // 中置信度 / 待人工确认
  reject: '#FF4422', // 低置信度 / 已拒绝
  learn: '#B57BFF', // 学习沉淀 / 示例入库
  memory: '#00B4D8', // 记忆回溯 / RAG 命中
  degrade: '#5C697A', // 降级路径 / AI 不可用
} as const;

/**
 * 驾驶模式三档色
 */
export const DRIVE_MODES = {
  L0: {
    id: 'L0',
    name: '全自动',
    color: '#00e0b8',
    desc: 'Agent 自主完成，关键决策 5s 内撤销，人工只看结果',
    tag: 'AUTONOMOUS',
  },
  L1: {
    id: 'L1',
    name: '半自动',
    color: '#00B4D8',
    desc: '置信度 < 0.9 自动阻塞，关键节点由人工确认与裁决',
    tag: 'HUMAN-IN-THE-LOOP',
  },
  L2: {
    id: 'L2',
    name: '人工主导',
    color: '#FFB020',
    desc: 'Agent 仅提供方案建议与数据分析，执行权完全归属人类',
    tag: 'HUMAN-DIRECTED',
  },
} as const;

export type DriveModeId = keyof typeof DRIVE_MODES;

/**
 * 置信度阶梯算法与色彩映射
 */
export function getConfidenceMeta(confidence: number) {
  if (confidence >= 0.9) {
    return {
      level: 'high' as const,
      color: '#22C55E',
      label: '高置信',
      tag: 'PASS',
      desc: '建议直接采纳/自动流转',
    };
  }
  if (confidence >= 0.6) {
    return {
      level: 'mid' as const,
      color: '#FFB020',
      label: '中置信',
      tag: 'REVIEW',
      desc: '需人工快速复核',
    };
  }
  return {
    level: 'low' as const,
    color: '#FF4422',
    label: '低置信',
    tag: 'INTERVENE',
    desc: '需人工重构或触发议事厅',
  };
}

/**
 * 六阶段流水线规范
 */
export const PIPELINE_STAGES = [
  { id: 'S1', stage: 1, name: '小说立项', agent: '言启·千行 / 元启·天枢', route: 'script' },
  { id: 'S2', stage: 2, name: '剧本分镜', agent: '创想·灵韵 / 语枢·万物', route: 'storyboard' },
  { id: 'S3', stage: 3, name: '图像生成', agent: '创想·灵韵 / 格物·宗师', route: 'production' },
  { id: 'S4', stage: 4, name: '视频合成', agent: '语枢·万物 / 预见·先知', route: 'production' },
  { id: 'S5', stage: 5, name: '成片交付', agent: '格物·宗师 / 智云·守护', route: 'video' },
  { id: 'S6', stage: 6, name: '运营反哺', agent: '知遇·伯乐 / 预见·先知', route: 'analytics' },
] as const satisfies ReadonlyArray<{ id: string; stage: number; name: string; agent: string; route: PageId }>;

/**
 * G0-G5 门禁等级定义
 */
export const GATE_LEVELS = [
  { id: 'G0', name: '立项准入', threshold: '版权确权 100%' },
  { id: 'G1', name: '分镜就绪', threshold: '12 字段完整 & Schema 校验通过' },
  { id: 'G2', name: '资产一致', threshold: `角色一致性 Ref 评分 ≥ ${REF_CONSISTENCY_PASS}%` },
  { id: 'G3', name: '音画合规', threshold: `SyncNet ≥ ${SYNCNET_PASS} & PII 0 泄露` },
  { id: 'G4', name: '成片质检', threshold: '宗师综合质检分 ≥ 85 分' },
  { id: 'G5', name: '发布就绪', threshold: '格式自适应 & 敏感词通过' },
] as const;

/** 当前产线主检门禁（音画合规）— 页面高亮判定的唯一字面量锚点（R13） */
export const GATE_CURRENT_ID = 'G3';

/** 门禁等级派生类型 — G0-G5 单一事实源（UI 组件与领域模型统一引用，禁止重复字面量声明） */
export type GateLevel = (typeof GATE_LEVELS)[number]['id'];

/**
 * ReAct-C 九步闭环引擎步骤
 */
export const REACT_C_STEPS = [
  { step: 1, name: '安全过滤', agentId: 'zhiyun-shouhu', agentName: '智云·守护', desc: '敏感词、版权、合规词库扫描' },
  { step: 2, name: '意图路由', agentId: 'yanqi-qianxing', agentName: '言启·千行', desc: '用户输入语义解析与意图路由' },
  { step: 3, name: 'RAG注入', agentId: 'yushu-wanwu', agentName: '语枢·万物', desc: 'Milvus 向量检索与三层记忆提取' },
  { step: 4, name: '分析预测', agentId: 'yujian-xianzhi', agentName: '预见·先知', desc: '语枢万物+预见先知并行分析' },
  { step: 5, name: '报告润色', agentId: 'chuangxiang-lingyun', agentName: '创想·灵韵', desc: '创意增强与提示词优化' },
  { step: 6, name: '全局决策', agentId: 'yuanqi-tianshu', agentName: '元启·天枢', desc: '统一编排调度并确定执行方案' },
  { step: 7, name: '质量校验', agentId: 'gewu-zongshi', agentName: '格物·宗师', desc: '打分与门禁校验（<80回环Step5）' },
  { step: 8, name: '审计脱敏', agentId: 'zhiyun-shouhu', agentName: '智云·守护', desc: '敏感信息擦除与操作全留痕' },
  { step: 9, name: '画像更新', agentId: 'zhiyu-bole', agentName: '知遇·伯乐', desc: '用户偏好与模型权重推荐更新' },
] as const;

/**
 * Auth 域 Design Token 增量规范（高于业务域的品牌入口层，不破坏四域色红线）
 */
export const AUTH_TOKENS = {
  canvasLeft: '#071222', // 左侧品牌区底色（比 bg-base 更深，制造纵深）
  canvasRight: '#0a1628', // 右侧表单区底色（= bg-base）
  glow1: 'rgba(0, 224, 184, 0.06)', // 品牌区光晕（青绿径向渐变）
  glow2: 'rgba(157, 124, 216, 0.05)', // 品牌区光晕（流程紫径向渐变）
  formCard: '#0f1e35', // 表单卡片底（= bg-muted）
  divider: 'rgba(138, 151, 168, 0.16)', // 分隔线（中性色，避免抢主色）
  oauthBg: '#152640', // 第三方登录按钮底（= bg-raised）
  strengthWeak: '#FF4422', // 密码强度 1/4
  strengthFair: '#FFB020', // 密码强度 2/4
  strengthGood: '#00B4D8', // 密码强度 3/4
  strengthStrong: '#22C55E', // 密码强度 4/4
  // 间距与布局
  splitRatio: '55 : 45',
  formMaxW: 400,
  formMaxWRegister: 440,
  fieldGap: 20,
  cardPad: 32,
} as const;
