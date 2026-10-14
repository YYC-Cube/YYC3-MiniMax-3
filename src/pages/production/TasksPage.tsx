/**
 * @file: TasksPage.tsx
 * @description: 页面组件：TasksPage
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import {
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu
} from 'lucide-react';
import React, { useState } from 'react';
import { ENDPOINTS, SNAPSHOT, taskService, useApiData } from '../../api';
import ConfidenceBadge from '../../components/common/ConfidenceBadge';
import { EmptyState, ErrorState, LoadingState, NoPermissionState } from '../../components/common/States';
import { AGENTS_MAP, DEFAULT_AGENT_ID } from '../../tokens';
import { DevModeMeta, PageId, ViewState } from '../../types';

interface TasksPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
  onOpenCognitionWidget: (agentId: string) => void;
}

export const DEV_META_TASKS: DevModeMeta = {
  apiEndpoint: ENDPOINTS.tasks,
  confidenceSource: 'Celery Flower Worker + ReAct-C Step-by-Step Telemetry',
  memoryScope: 'session',
  learningSampleSource: '长任务重试与人工接管干预日志',
  driveModePolicy: '运行中任务允许实时热切换 L0/L1/L2，提供无感知人机共驾平滑交接',
  stateSwitchConditions: {
    empty: '异步任务调度队列当前为空，无任何待处理或执行中的任务',
    loading: 'Celery Redis Broker 任务心跳轮询与日志流聚合拉取中',
    error: 'RabbitMQ / Redis 消息代理断连 (BROKER_CONNECTION_LOST)',
    forbidden: '用户无任务启停、强制取消与参数热注入权限',
  },
};

export const TasksPage: React.FC<TasksPageProps> = ({
  onNavigate,
  viewState = 'normal',
  onOpenCognitionWidget,
}) => {
  const { data: tasksData, loading } = useApiData(taskService.list, SNAPSHOT.taskList);
  const tasks = tasksData ?? [];
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>('TASK-20250415-091');
  const [filterType, setFilterType] = useState<string>('all');

  if (viewState === 'loading') return <LoadingState message="获取 Celery 任务队列拓扑与 Agent 九步追踪数据..." />;
  if (viewState === 'empty') return <EmptyState title="当前队列为空" description="所有生成与渲染任务均已交付完毕。" />;
  if (viewState === 'error') return <ErrorState title="任务调度中心连接中断" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无任务队列管理权限" />;
  if (loading) return <LoadingState message="获取 Celery 任务队列拓扑与 Agent 九步追踪数据..." />;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header & System Health Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.15)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-[#e8f0f8]">全平台任务监控与九步闭环追踪</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#00e0b8] border border-[rgba(0,224,184,0.3)]">
              Celery Flower / DGX
            </span>
          </div>
          <p className="text-xs text-[#8a97a8] mt-0.5">
            实时观测 8 Agent 九步协同轨迹 · 支持指令热注入、暂停与 100% 人工接管
          </p>
        </div>

        {/* System Health Panel */}
        <div className="flex items-center gap-3 text-xs font-mono bg-[#0a1628] p-2 rounded-lg border border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#00e0b8]" />
            <span className="text-[#8a97a8]">Worker: <strong className="text-[#e8f0f8]">16 并行</strong></span>
          </div>
          <span className="text-[#5c697a]">|</span>
          <div className="flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-[#7B8CFF]" />
            <span className="text-[#8a97a8]">Agent 在线率: <strong className="text-[#22C55E]">100%</strong></span>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)]">
          <span className="text-xs text-[#8a97a8] block">队列总深度</span>
          <span className="text-2xl font-bold font-mono text-[#e8f0f8]">14</span>
          <span className="text-[10px] text-[#5c697a] block mt-1">排队延迟 &lt; 200ms</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)]">
          <span className="text-xs text-[#8a97a8] block">运行中任务</span>
          <span className="text-2xl font-bold font-mono text-[#00e0b8]">4</span>
          <span className="text-[10px] text-[#22C55E] block mt-1">DGX GB10 双卡全负荷</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0f1e35] border border-[rgba(255,68,34,0.25)]">
          <span className="text-xs text-[#ff4422] block">失败待处理</span>
          <span className="text-2xl font-bold font-mono text-[#ff4422]">1</span>
          <span className="text-[10px] text-[#8a97a8] block mt-1">已切入降级保护路径</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)]">
          <span className="text-xs text-[#8a97a8] block">平均耗时 (单集)</span>
          <span className="text-2xl font-bold font-mono text-[#FFB020]">04m 12s</span>
          <span className="text-[10px] text-[#5c697a] block mt-1">符合工业交付标准</span>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#152640] text-[#8a97a8] border-b border-[rgba(255,255,255,0.08)]">
                <th className="p-3 font-semibold">任务 ID</th>
                <th className="p-3 font-semibold">任务类型</th>
                <th className="p-3 font-semibold">所属剧目</th>
                <th className="p-3 font-semibold font-mono">提交时间</th>
                <th className="p-3 font-semibold font-mono">耗时</th>
                <th className="p-3 font-semibold">进度</th>
                <th className="p-3 font-semibold">驾驶模式</th>
                <th className="p-3 font-semibold">置信度</th>
                <th className="p-3 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
              {tasks.map((task) => {
                const isExpanded = expandedTaskId === task.id;

                return (
                  <React.Fragment key={task.id}>
                    <tr
                      onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                      className={`hover:bg-[#152640]/60 transition-colors cursor-pointer ${isExpanded ? 'bg-[#152640]/40' : ''
                        }`}
                    >
                      <td className="p-3 font-mono font-bold text-[#00e0b8] flex items-center gap-1.5">
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-[#8a97a8]" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-[#8a97a8]" />
                        )}
                        <span>{task.id}</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-[#152640] text-[#e8f0f8] font-mono text-[11px]">
                          {task.type}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-[#e8f0f8]">{task.projectName}</td>
                      <td className="p-3 font-mono text-[#8a97a8]">{task.submittedAt}</td>
                      <td className="p-3 font-mono text-[#8a97a8]">{task.duration}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 rounded-full bg-[#0a1628] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#00e0b8] transition-all duration-300"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] text-[#00e0b8]">
                            {task.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#0a1628] text-[#00B4D8] border border-[rgba(0,180,216,0.3)]">
                          {task.driveMode}
                        </span>
                      </td>
                      <td className="p-3">
                        <ConfidenceBadge confidence={task.confidence} size="sm" />
                      </td>
                      <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenCognitionWidget(DEFAULT_AGENT_ID)}
                            className="px-2.5 py-1 rounded bg-[#00e0b8]/15 hover:bg-[#00e0b8]/25 text-[#00e0b8] font-bold text-xs cursor-pointer"
                          >
                            九步轨迹
                          </button>
                          <button
                            type="button"
                            className="px-2 py-1 rounded bg-[#152640] hover:bg-[#ff4422]/20 text-[#8a97a8] hover:text-[#ff4422] text-xs cursor-pointer"
                            title="强行人工接管该任务"
                          >
                            人工接管
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable AgentTrace (ReAct-C 9 Steps) */}
                    {isExpanded && (
                      <tr className="bg-[#0a1628]/80">
                        <td colSpan={9} className="p-4 border-b border-[rgba(255,255,255,0.06)]">
                          <div className="p-3.5 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.25)] space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,255,255,0.06)]">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#00e0b8] animate-pulse" />
                                <span className="text-xs font-bold text-[#e8f0f8]">
                                  ReAct-C 九步实时追踪流（当前停驻: Step {task.currentStep}）
                                </span>
                              </div>
                              <span className="text-[11px] font-mono text-[#8a97a8]">
                                元启·天枢 编排引擎 · 可实时注入干预
                              </span>
                            </div>

                            {/* Horizontal 9 Steps Flow */}
                            <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
                              {task.stepsTrace.map((st) => {
                                const agent = AGENTS_MAP[st.agentId];
                                const isCurrent = st.status === 'running';
                                const isDone = st.status === 'success';

                                return (
                                  <div
                                    key={st.step}
                                    className={`p-2 rounded-lg border text-xs space-y-1 ${isCurrent
                                      ? 'bg-[#152640] border-[#00e0b8] shadow-sm'
                                      : isDone
                                        ? 'bg-[#0a1628] border-[rgba(255,255,255,0.06)]'
                                        : 'bg-[#0a1628]/40 border-transparent opacity-40'
                                      }`}
                                  >
                                    <div className="flex items-center justify-between text-[10px] font-mono">
                                      <span className="text-[#8a97a8]">#{st.step}</span>
                                      {isDone && <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />}
                                      {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#00e0b8] animate-ping" />}
                                    </div>
                                    <span className="font-bold text-[#e8f0f8] block truncate">
                                      {st.name}
                                    </span>
                                    <span className="text-[10px] truncate block" style={{ color: agent?.color }}>
                                      {agent?.name.split('·')[1] || agent?.name}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
