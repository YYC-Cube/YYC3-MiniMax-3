/**
 * @file: DashboardPage.tsx
 * @description: 页面组件：DashboardPage
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import {
  ArrowRight,
  Brain,
  ChevronRight,
  Cpu,
  Film,
  Plus,
  Send,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ENDPOINTS, SNAPSHOT, scriptService, useApiData } from '../../api';
import ConfidenceBadge from '../../components/common/ConfidenceBadge';
import GateBadge from '../../components/common/GateBadge';
import MetricCard from '../../components/common/MetricCard';
import { EmptyState, ErrorState, LoadingState, NoPermissionState } from '../../components/common/States';
import Thumb from '../../components/common/Thumb';
import { DriveModeId, GATE_CURRENT_ID, PIPELINE_STAGES } from '../../tokens';
import { DevModeMeta, PageId, ScriptItem, ViewState } from '../../types';

interface DashboardPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
  driveMode: DriveModeId;
  onOpenCounsel: () => void;
}

export const DEV_META_DASHBOARD: DevModeMeta = {
  apiEndpoint: ENDPOINTS.scripts,
  confidenceSource: 'ReAct-C 全局聚合引擎 · Weighted Multi-Agent Mean',
  memoryScope: 'project',
  learningSampleSource: 'Learning Inbox 每日增量入库统计',
  driveModePolicy: '全局 L0/L1/L2 顶层约束联动；L0 模式下超时 5 秒自动确认调度方案',
  stateSwitchConditions: {
    empty: '当前工作空间无任何剧目立项且任务队列为 0',
    loading: 'DGX 节点全链路状态拉取及流水线拓扑重新计算中',
    error: 'DGX 负载监控 API (Prometheus 9090) 超时无应答',
    forbidden: '用户角色为访客 (Guest) 或未分配生产组权限',
  },
};

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  viewState = 'normal',
  driveMode,
  onOpenCounsel,
}) => {
  const { data: scriptsData, loading: scriptsLoading } = useApiData(scriptService.list, SNAPSHOT.scriptList);
  const [activeScripts, setActiveScripts] = useState<ScriptItem[]>([]);
  useEffect(() => {
    if (scriptsData) setActiveScripts(scriptsData);
  }, [scriptsData]);

  if (viewState === 'loading') return <LoadingState message="正在同步 DGX 算力集群与流水线状态..." />;
  if (viewState === 'empty') return <EmptyState title="产线尚未建立任何漫剧剧目" actionText="创建第一部剧目" onAction={() => onNavigate('script')} />;
  if (viewState === 'error') return <ErrorState title="指挥中心与 DGX 节点通讯中断" />;
  if (viewState === 'forbidden') return <NoPermissionState title="暂无工作台访问权限" />;
  if (scriptsLoading) return <LoadingState message="正在同步 DGX 算力集群与流水线状态..." />;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Greeting & Operational Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#e8f0f8] tracking-tight">
              YYC³ AI Family 生产指挥工作台
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#00e0b8] border border-[rgba(0,224,184,0.3)]">
              双 DGX GB10 算力集群就绪
            </span>
          </div>
          <p className="text-xs text-[#8a97a8] mt-1">
            今日全线产出 214 镜头 · 平均置信度 0.91 · 单集核算成本 ¥ 0.0018
          </p>
        </div>

        {/* Global Quick Action CTA */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('script')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-teal-950/40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新建剧本立项</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('family')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#152640] hover:bg-[#1f3659] text-[#e8f0f8] border border-[rgba(0,224,184,0.25)] text-xs font-medium transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Agent 协同大屏</span>
          </button>
        </div>
      </div>

      {/* Row 1: 5 Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <MetricCard
          label="今日生成镜头数"
          value="214"
          unit="镜"
          change="+18.4%"
          domain="production"
          icon={<Film className="w-4 h-4" />}
          subtext="日产标杆 240 镜"
        />
        <MetricCard
          label="待质检镜头"
          value="18"
          unit="镜"
          change="-4 镜"
          domain="production"
          icon={<ShieldCheck className="w-4 h-4" />}
          subtext="格物·宗师 校验中"
        />
        <MetricCard
          label="渲染中任务"
          value="6"
          unit="批"
          domain="editing"
          icon={<Cpu className="w-4 h-4" />}
          subtext="硬件加速 100%"
        />
        <MetricCard
          label="昨日发布全网数"
          value="32"
          unit="条"
          change="+24.1%"
          domain="publishing"
          icon={<Send className="w-4 h-4" />}
          subtext="5 平台矩阵协同"
        />
        <MetricCard
          label="本周 Agent 学习样本"
          value="89"
          unit="例"
          cognitionColor="#B57BFF"
          icon={<Brain className="w-4 h-4" />}
          subtext="Learning Inbox 待审 3"
        />
      </div>

      {/* Row 2: Six-Stage Pipeline Horizontal Overview */}
      <div className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.15)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00e0b8] animate-pulse" />
            <h3 className="text-xs font-bold text-[#e8f0f8] uppercase tracking-wider">
              六阶段流水线实时态势 (Six-Stage Pipeline)
            </h3>
          </div>
          <span className="text-xs text-[#8a97a8] font-mono">
            全链路闭环编排：元启·天枢
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5">
          {PIPELINE_STAGES.map((stg, idx) => {
            const isActive = idx === 2; // stage 3 generating
            const isDone = idx < 2;

            return (
              <div
                key={stg.id}
                onClick={() => onNavigate(stg.route)}
                className={`p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${isActive
                  ? 'bg-[#152640] border-[#00e0b8] shadow-md shadow-teal-950/30'
                  : 'bg-[#0a1628] border-[rgba(255,255,255,0.06)] hover:border-[rgba(0,224,184,0.25)]'
                  }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#00e0b8] animate-pulse" />
                )}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-[#8a97a8]">STAGE {stg.stage}</span>
                  <ConfidenceBadge confidence={0.92} size="sm" showValue={false} />
                </div>
                <h4 className="text-xs font-bold text-[#e8f0f8] mb-1">{stg.name}</h4>
                <p className="text-[10px] text-[#8a97a8] truncate mb-2">{stg.agent}</p>

                <div className="flex items-center justify-between pt-1 border-t border-[rgba(255,255,255,0.06)] text-[10px] font-mono">
                  <span className={isActive ? 'text-[#00e0b8]' : 'text-[#5c697a]'}>
                    {isActive ? '运行中 (8)' : isDone ? '就绪 (12)' : '待排产'}
                  </span>
                  <ChevronRight className="w-3 h-3 text-[#5c697a]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 3: Main Split Section (Left 2/3 Ongoing Projects, Right 1/3 To-dos & Anomalies) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2/3: Ongoing Projects */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#e8f0f8] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e0b8]" />
              进行中的项目 (Active Drama Series)
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('project')}
              className="text-xs text-[#00e0b8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>查看全部剧目</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {activeScripts.map((script) => (
              <div
                key={script.id}
                onClick={() => onNavigate('storyboard')}
                className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)] hover:border-[rgba(0,224,184,0.35)] transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-20 h-14 rounded-lg bg-[#152640] border border-[rgba(255,255,255,0.08)] overflow-hidden shrink-0 relative">
                      <Thumb
                        src={script.characters[0]?.avatar}
                        alt={script.title}
                        label={script.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1 rounded bg-black/80 text-[#00e0b8]">
                        {script.genre}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-bold text-[#e8f0f8] group-hover:text-[#00e0b8] transition-colors">
                          {script.title}
                        </h4>
                        <GateBadge level={script.gateLevel} active={script.gateLevel === GATE_CURRENT_ID} />
                      </div>
                      <p className="text-xs text-[#8a97a8] line-clamp-1 max-w-lg mb-2">
                        {script.synopsis}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-[#5c697a] font-mono">
                        <span>字数: {(script.wordCount / 10000).toFixed(1)}万</span>
                        <span>角色: {script.characterCount}位</span>
                        <span>图谱完备度: {script.loreCompleteness}%</span>
                        <span>活跃: {script.lastEdited}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between shrink-0 gap-2">
                    <ConfidenceBadge confidence={0.93} size="sm" />
                    <span className="text-xs font-mono text-[#00e0b8] font-bold">
                      {script.stage}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1/3: To-do & Anomaly Alerts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#e8f0f8] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4422]" />
              待办与异常拦截 (Action Items)
            </h3>
            <span className="text-xs font-mono text-[#ff4422]">1 处阻塞</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] space-y-3">
            {/* Anomaly 1: Shot S01-04 Quality Gate Block */}
            <div
              onClick={onOpenCounsel}
              className="p-3 rounded-lg bg-[rgba(255,68,34,0.1)] border border-[rgba(255,68,34,0.35)] hover:border-[#ff4422] transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#ff4422]/20 text-[#ff4422] font-bold">
                  门禁拦截 G3
                </span>
                <span className="text-[10px] text-[#8a97a8]">14:22</span>
              </div>
              <h5 className="text-xs font-bold text-[#e8f0f8] group-hover:text-[#ff4422] transition-colors mb-1">
                镜头 S01-04 身份漂移（相似度 64%）
              </h5>
              <p className="text-[11px] text-[#8a97a8] leading-tight mb-2">
                格物·宗师判定面部与 RefCard 差异过大，置信度仅 0.54。
              </p>
              <div className="flex items-center justify-between text-[11px] text-[#00e0b8] font-medium">
                <span>进入议事厅仲裁 →</span>
                <ConfidenceBadge confidence={0.54} size="sm" />
              </div>
            </div>

            {/* To-do 2: Learning Inbox Approval */}
            <div
              onClick={() => onNavigate('admin-agents')}
              className="p-3 rounded-lg bg-[#0a1628] border border-[rgba(181,123,255,0.25)] hover:border-[#B57BFF] transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[rgba(181,123,255,0.15)] text-[#B57BFF] font-bold">
                  学习沉淀
                </span>
                <span className="text-[10px] text-[#8a97a8]">今天 11:40</span>
              </div>
              <h5 className="text-xs font-bold text-[#e8f0f8] group-hover:text-[#B57BFF] transition-colors mb-1">
                Learning Inbox 有 3 条样本待人工复核
              </h5>
              <p className="text-[11px] text-[#8a97a8] leading-tight">
                语枢·万物提交了口型同步音素增强示例，待核准入库。
              </p>
            </div>

            {/* To-do 3: Account Expiration Notice */}
            <div
              onClick={() => onNavigate('publish-accounts')}
              className="p-3 rounded-lg bg-[#0a1628] border border-[rgba(255,176,32,0.2)] hover:border-[#FFB020] transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[rgba(255,176,32,0.15)] text-[#FFB020] font-bold">
                  凭证预警
                </span>
                <span className="text-[10px] text-[#8a97a8]">4 天后到期</span>
              </div>
              <h5 className="text-xs font-bold text-[#e8f0f8] group-hover:text-[#FFB020] transition-colors mb-1">
                快手矩阵号凭证即将到期
              </h5>
              <p className="text-[11px] text-[#8a97a8] leading-tight">
                建议进行扫码一键轮换授权，避免发布任务中断。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Bottom 4 Quick Start Action Buttons (4 Domain Colors Top Bar) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-2">
        <button
          type="button"
          onClick={() => onNavigate('script')}
          className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.15)] hover:border-[#00e0b8] transition-all text-left cursor-pointer group domain-border-prod"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#00e0b8] uppercase">生产域</span>
            <Plus className="w-4 h-4 text-[#00e0b8] group-hover:translate-x-1 transition-transform" />
          </div>
          <h4 className="text-sm font-bold text-[#e8f0f8] mb-1">新建剧本文档</h4>
          <p className="text-xs text-[#8a97a8]">支持 20 万字长文直接导入提取</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('storyboard')}
          className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(157,124,216,0.15)] hover:border-[#9d7cd8] transition-all text-left cursor-pointer group domain-border-edit"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#9d7cd8] uppercase">剪辑域</span>
            <Film className="w-4 h-4 text-[#9d7cd8] group-hover:translate-x-1 transition-transform" />
          </div>
          <h4 className="text-sm font-bold text-[#e8f0f8] mb-1">继续分镜设计</h4>
          <p className="text-xs text-[#8a97a8]">12 字段专业 Schema 与画布流</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('production')}
          className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(0,180,216,0.15)] hover:border-[#00b4d8] transition-all text-left cursor-pointer group domain-border-mgmt"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#00b4d8] uppercase">管理域</span>
            <Cpu className="w-4 h-4 text-[#00b4d8] group-hover:translate-x-1 transition-transform" />
          </div>
          <h4 className="text-sm font-bold text-[#e8f0f8] mb-1">提交批量生成</h4>
          <p className="text-xs text-[#8a97a8]">DGX 硬件直通与泳道看板</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('publish')}
          className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(255,122,92,0.15)] hover:border-[#FF7A5C] transition-all text-left cursor-pointer group domain-border-push"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#FF7A5C] uppercase">推送域</span>
            <Send className="w-4 h-4 text-[#FF7A5C] group-hover:translate-x-1 transition-transform" />
          </div>
          <h4 className="text-sm font-bold text-[#e8f0f8] mb-1">发起多端分发</h4>
          <p className="text-xs text-[#8a97a8]">自适应比例、敏感词预检</p>
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
