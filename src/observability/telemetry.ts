/**
 * @file: telemetry.ts
 * @description: YYC³ 本地可观测性 — 通用事件环形缓冲（无公网 APM，进程内诊断）
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

/**
 * 本地优先遥测契约：
 * - 仅记录通用事件（level/source/message/detail），不含任何指标命名体系
 *   （指标命名以《05-监控告警与Runbook》对齐后另行扩展，禁止虚构）
 * - 环形缓冲容量固定，读取为快照拷贝，写入 O(1)
 * - 纯内存实现：断网、无后端、隐私模式均可用
 */

export type TelemetryLevel = 'error' | 'warn' | 'info';

export interface TelemetryEvent {
  /** 事件时间戳（epoch ms） */
  ts: number;
  level: TelemetryLevel;
  /** 事件来源标识（模块/函数名，如 'useApiData' / 'App'） */
  source: string;
  /** 人读摘要 */
  message: string;
  /** 可选结构化补充（端点、错误码等） */
  detail?: string;
}

/** 环形缓冲容量（条） */
export const TELEMETRY_CAPACITY = 100;

const buffer: TelemetryEvent[] = [];

/** 记录一条事件；超出容量自动淘汰最旧条目 */
export function recordEvent(
  level: TelemetryLevel,
  source: string,
  message: string,
  detail?: string,
): void {
  const event: TelemetryEvent = { ts: Date.now(), level, source, message, ...(detail !== undefined ? { detail } : {}) };
  buffer.push(event);
  if (buffer.length > TELEMETRY_CAPACITY) {
    buffer.splice(0, buffer.length - TELEMETRY_CAPACITY);
  }
}

/** 读取快照（时间正序，最新在末尾）；返回拷贝，外部修改不影响缓冲 */
export function getRecentEvents(): TelemetryEvent[] {
  return [...buffer];
}

/** 清空缓冲（测试与 DevMode 面板手动刷新用） */
export function clearTelemetry(): void {
  buffer.length = 0;
}
