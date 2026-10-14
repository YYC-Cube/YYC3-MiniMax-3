/**
 * @file: AdminAgentsPage.tsx
 * @description: 页面组件：AdminAgentsPage
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import {
  Check,
  Inbox,
  Trash2
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { cognitionService, ENDPOINTS, SNAPSHOT, useApiData } from '../../api';
import AgentAvatar from '../../components/common/AgentAvatar';
import { EmptyState, ErrorState, LoadingState, NoPermissionState } from '../../components/common/States';
import { AGENTS_LIST } from '../../tokens';
import { DevModeMeta, LearningSample, MemoryEntry, PageId, ViewState } from '../../types';

interface AdminAgentsPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
  onOpenCognitionWidget: (agentId: string) => void;
}

export const DEV_META_AGENTS: DevModeMeta = {
  apiEndpoint: ENDPOINTS.learningSamples,
  confidenceSource: 'ReAct-C 全闭环准确率评测矩阵 + Few-shot 增量学习引擎',
  memoryScope: 'global',
  learningSampleSource: 'Learning Inbox 人工终审采纳之 Golden Samples',
  driveModePolicy: '所有进入 Few-shot 库的样本必须经人工审核；Prompt 变更走 90 天留痕',
  stateSwitchConditions: {
    empty: '当前无待审学习样本与自定义提示词版本',
    loading: '向量记忆存储与 8 Agent 准确率时序模型统计中',
    error: 'Milvus / Redis 记忆存储节点通讯异常 (MEM_STORE_OFFLINE)',
    forbidden: '用户无智能体核心 Prompt 发布与记忆遗忘操作权限',
  },
};

export const AdminAgentsPage: React.FC<AdminAgentsPageProps> = ({
  onNavigate,
  viewState = 'normal',
  onOpenCognitionWidget,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'inbox' | 'memory' | 'prompts'>('inbox');
  const { data: samplesData, loading: samplesLoading } = useApiData(cognitionService.learningSamples, SNAPSHOT.learningSamples);
  const { data: memoriesData, loading: memoriesLoading } = useApiData(cognitionService.memories, SNAPSHOT.memories);
  const [samples, setSamples] = useState<LearningSample[]>([]);
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  useEffect(() => {
    if (samplesData) setSamples(samplesData);
  }, [samplesData]);
  useEffect(() => {
    if (memoriesData) setMemories(memoriesData);
  }, [memoriesData]);
  const [canaryRollout, setCanaryRollout] = useState<number>(50); // 10% -> 50% -> 100%

  if (viewState === 'loading') return <LoadingState message="获取 8 Agent 准确率时序与 Learning Inbox 待审样本..." />;
  if (viewState === 'empty') return <EmptyState title="Learning Inbox 当前为空" description="今日所有生产异常与议事厅决策均已人工核准完毕。" />;
  if (viewState === 'error') return <ErrorState title="智能体训练服务异常" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无智能体配置管理权限" />;
  if (samplesLoading || memoriesLoading) return <LoadingState message="获取 8 Agent 准确率时序与 Learning Inbox 待审样本..." />;

  const handleApproveSample = (id: string) => {
    setSamples((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'approved' } : s))
    );
  };

  const handleRejectSample = (id: string) => {
    setSamples((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'rejected' } : s))
    );
  };

  const handleForgetMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#e8f0f8]">智能体训练中心 (Agent Lab)</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#00B4D8] border border-[rgba(0,180,216,0.3)]">
              复利智能 · 越用越准
            </span>
          </div>
          <p className="text-xs text-[#8a97a8] mt-1">
            Learning Inbox 人工审核 · 三层记忆管理（支持合规遗忘）· Prompt 版本灰度发布
          </p>
        </div>

        {/* 4 Tabs Switcher */}
        <div className="flex items-center p-0.5 rounded-lg bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] text-xs font-mono">
          {(['overview', 'inbox', 'memory', 'prompts'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1 rounded cursor-pointer transition-all ${activeTab === t
                ? 'bg-[#00B4D8] text-[#0a1628] font-bold shadow-sm'
                : 'text-[#8a97a8] hover:text-white'
                }`}
            >
              {t === 'overview' ? '健康总览' : t === 'inbox' ? 'Learning Inbox' : t === 'memory' ? '记忆管理' : '提示词工程'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)]">
              <span className="text-xs text-[#8a97a8] block">Agent 平均准确率</span>
              <span className="text-2xl font-bold font-mono text-[#22C55E]">93.8%</span>
              <span className="text-[10px] text-[#22C55E] block mt-1">环比提升 +4.2%</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)]">
              <span className="text-xs text-[#8a97a8] block">人工干预率 (越低越好)</span>
              <span className="text-2xl font-bold font-mono text-[#00e0b8]">2.7%</span>
              <span className="text-[10px] text-[#22C55E] block mt-1">持续平稳下降中</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)]">
              <span className="text-xs text-[#8a97a8] block">本周采纳学习样本</span>
              <span className="text-2xl font-bold font-mono text-[#B57BFF]">89 例</span>
              <span className="text-[10px] text-[#8a97a8] block mt-1">Few-shot 增量入库</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)]">
              <span className="text-xs text-[#8a97a8] block">三层激活记忆条目</span>
              <span className="text-2xl font-bold font-mono text-[#00B4D8]">337 条</span>
              <span className="text-[10px] text-[#8a97a8] block mt-1">全链路毫秒级回溯</span>
            </div>
          </div>

          {/* 8 Agent Health Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {AGENTS_LIST.map((ag) => (
              <div
                key={ag.id}
                onClick={() => onOpenCognitionWidget(ag.id)}
                className="p-3.5 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.06)] hover:border-[#00e0b8] transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <AgentAvatar agentId={ag.id} size="sm" />
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0a1628] text-[#22C55E]">
                    在线 100%
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#e8f0f8] group-hover:text-[#00e0b8] transition-colors">
                    {ag.name}
                  </h4>
                  <span className="text-[10px] text-[#8a97a8]">{ag.role}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#5c697a] pt-1 border-t border-[rgba(255,255,255,0.04)]">
                  <span>时钟: {ag.clockPosition}</span>
                  <span className="text-[#00e0b8]">查看轨迹 →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Learning Inbox (审核入库管线) */}
      {activeTab === 'inbox' && (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-[#0f1e35] border border-[rgba(181,123,255,0.25)] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-[#B57BFF]" />
              <span className="font-bold text-[#e8f0f8]">
                Learning Inbox 待审样本库 (所有样本必须经人类审核才入库)
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#8a97a8]">
              待处理：{samples.filter((s) => s.status === 'pending').length} 项
            </span>
          </div>

          <div className="space-y-3">
            {samples.map((sample) => (
              <div
                key={sample.id}
                className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] space-y-3 hover:border-[#B57BFF] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded bg-[#152640] text-[#B57BFF] font-mono text-xs font-bold">
                      {sample.type}
                    </span>
                    <h4 className="text-xs font-bold text-[#e8f0f8]">
                      来源：{sample.sourceProject} · {sample.sourceShot}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-[#8a97a8]">{sample.timestamp}</span>
                    <span className="text-[#00e0b8]">提交人: {sample.agentName}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.06)] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8a97a8]">专家复核建议：<strong>{sample.recommendation}</strong></span>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-[#ff4422]">初试得分: {(sample.confidenceBefore * 100).toFixed(0)}%</span>
                      <span>→</span>
                      <span className="text-[#22C55E]">入库预期: {(sample.confidenceExpected * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <p className="text-[#e8f0f8] text-[11px] leading-relaxed pt-1">
                    {sample.reviewNote}
                  </p>
                </div>

                {/* Approval Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.06)]">
                  <span className="text-[11px] text-[#5c697a]">
                    入库后将作为该角色/运镜后续推理的 Few-shot 检索锚点
                  </span>

                  <div className="flex items-center gap-2">
                    {sample.status === 'pending' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleRejectSample(sample.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#152640] hover:bg-[#ff4422]/20 text-[#8a97a8] hover:text-[#ff4422] text-xs transition-colors cursor-pointer"
                        >
                          拒绝入库
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApproveSample(sample.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#22C55E] hover:bg-[#1ea750] text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-md"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>人工审核通过 · 入库 Few-shot</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-mono font-bold text-[#22C55E]">
                        ✓ 已正式收录至基座示例库
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Memory Store (记忆管理 · 支持合规遗忘) */}
      {activeTab === 'memory' && (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-[#0f1e35] border border-[rgba(0,180,216,0.25)] flex items-center justify-between text-xs">
            <span className="font-bold text-[#e8f0f8]">
              三层记忆管理 (会话层 / 项目层 / 全局层 · 支持合规遗忘)
            </span>
            <span className="text-[11px] font-mono text-[#00B4D8]">
              已收录 {memories.length} 条有效事实记忆
            </span>
          </div>

          <div className="space-y-2.5">
            {memories.map((mem) => (
              <div
                key={mem.id}
                className="p-3.5 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] flex items-start justify-between gap-4 text-xs hover:border-[#00B4D8] transition-all"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#152640] text-[#00B4D8] font-mono text-[11px] font-bold uppercase">
                      {mem.scope}
                    </span>
                    <span className="text-[#8a97a8] font-mono text-[11px]">
                      分类: {mem.category}
                    </span>
                    <span className="text-[#5c697a] font-mono text-[10px]">
                      已回溯 {mem.usageCount} 次
                    </span>
                  </div>
                  <p className="text-[#e8f0f8] text-xs leading-relaxed">
                    {mem.content}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-[#5c697a] font-mono pt-1">
                    <span>来源: {mem.source}</span>
                    <span>影响镜头: {mem.traceShots.join(', ')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleForgetMemory(mem.id)}
                    className="p-2 rounded-lg bg-[#152640] hover:bg-[#ff4422]/20 text-[#8a97a8] hover:text-[#ff4422] transition-colors cursor-pointer"
                    title="遗忘该条记忆 (合规删除)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Prompt Registry (版本控制 & 灰度发布) */}
      {activeTab === 'prompts' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.15)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#e8f0f8]">
                创想·灵韵 System Prompt 版本管理 (90 天审计追踪)
              </span>
              <span className="text-xs font-mono text-[#00e0b8]">当前生效版本: v4.2.1-prod</span>
            </div>

            <textarea
              rows={4}
              readOnly
              value={`You are 创想·灵韵, the master creative agent of YYC³ AI Family. Output strictly 12-field schema JSON. Keep character face alignment consistent with assigned RefCard.`}
              className="w-full p-3 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.08)] text-xs text-[#00e0b8] font-mono focus:outline-none"
            />

            {/* Canary Rollout Slider (10% -> 50% -> 100%) */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#8a97a8]">新版本灰度放量比例 (Canary Rollout):</span>
                <span className="font-mono font-bold text-[#00e0b8]">{canaryRollout}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={10}
                value={canaryRollout}
                onChange={(e) => setCanaryRollout(Number(e.target.value))}
                className="w-full accent-[#00e0b8] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#5c697a] font-mono">
                <span>10% (小范围测试)</span>
                <span>50% (半数流量)</span>
                <span>100% (全量发布)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAgentsPage;
