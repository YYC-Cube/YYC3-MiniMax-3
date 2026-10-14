/**
 * @file: CostCenterPage.tsx
 * @description: 页面组件：CostCenterPage
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import React, { useState } from 'react';
import {
  Coins,
  Cpu,
  TrendingDown,
  Sparkles,
  Download,
  Calendar,
  Layers,
  ArrowRight,
  Shield,
  Bot,
} from 'lucide-react';
import { PageId, ViewState, DevModeMeta } from '../../types';
import { AGENTS_LIST } from '../../tokens';
import MetricCard from '../../components/common/MetricCard';
import { EmptyState, LoadingState, ErrorState, NoPermissionState } from '../../components/common/States';

interface CostCenterPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_COST: DevModeMeta = {
  apiEndpoint: '/api/v2/management/cost/ledger',
  confidenceSource: 'DGX NVML GPU 电力/显存计费流 + vLLM Token 计量探针',
  memoryScope: 'global',
  learningSampleSource: '错峰调度历史能效与单集成本最优排期库',
  driveModePolicy: '单集综合成本超过 ¥2.00 警戒线时自动切入 L1 审批模式',
  stateSwitchConditions: {
    empty: '当前计费周期无任何算力与 Token 消耗账单',
    loading: 'DGX 双节点 GPU 实时瓦特电费与 Token 消耗对账汇总中',
    error: '财务计费探针日志聚合超时 (BILLING_STREAM_ERR)',
    forbidden: '用户无企业财务报表与成本中心审计权限',
  },
};

export const CostCenterPage: React.FC<CostCenterPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  if (viewState === 'loading') return <LoadingState message="计算 DGX 集群 GPU 能耗与 8 Agent Token 账单..." />;
  if (viewState === 'empty') return <EmptyState title="暂无账单数据" />;
  if (viewState === 'error') return <ErrorState title="成本对账服务异常" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无成本中心查看权限" />;

  const agentCosts = [
    { name: '创想·灵韵', token: '4.2M', gpuHours: '12.4h', cost: 18.4, color: '#FF7A5C' },
    { name: '格物·宗师', token: '2.8M', gpuHours: '8.2h', cost: 12.8, color: '#C0C0C0' },
    { name: '语枢·万物', token: '3.1M', gpuHours: '4.5h', cost: 9.2, color: '#FF69B4' },
    { name: '元启·天枢', token: '1.9M', gpuHours: '2.1h', cost: 4.8, color: '#00e0b8' },
    { name: '预见·先知', token: '1.2M', gpuHours: '1.8h', cost: 3.6, color: '#00BFFF' },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#e8f0f8]">成本中心 (Cost Center)</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#00e0b8] border border-[rgba(0,224,184,0.3)]">
              North Star: 单集 ≤ ¥2.00
            </span>
          </div>
          <p className="text-xs text-[#8a97a8] mt-1">
            严控 AI 成本黑洞 · 全 Agent 算力透明可见 · DGX 错峰电价自动套利
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#152640] hover:bg-[#1f3659] text-[#e8f0f8] border border-[rgba(255,255,255,0.08)] text-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>导出财务 CSV 账单</span>
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.3)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8a97a8]">
            <span className="font-bold text-[#e8f0f8]">当前单集核算成本</span>
            <span className="text-[10px] font-mono text-[#22C55E]">达标 99.9%</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-[#00e0b8] tabular-nums">
              ¥ 0.0018
            </span>
            <span className="text-xs text-[#8a97a8]">/ 集</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#0a1628]">
            <div className="h-full bg-[#00e0b8] rounded-full" style={{ width: '12%' }} />
          </div>
          <span className="text-[10px] text-[#5c697a] block">极限定价上限 ¥ 2.00</span>
        </div>

        <MetricCard label="本月算力总支出" value="¥ 148.60" unit="元" change="-24.8%" isPositive domain="management" />
        <MetricCard label="日均夜间错峰产能" value="48" unit="集/晚" change="+12 集" isPositive domain="management" />
        <MetricCard label="总 Token 消耗量" value="13.2" unit="M Tokens" domain="management" />
      </div>

      {/* Main Split: Left Agent Cost Breakdown, Right DGX Off-peak Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Agent Cost Breakdown Table */}
        <div className="lg:col-span-2 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] p-4 space-y-3">
          <span className="text-xs font-bold text-[#e8f0f8] block">
            Agent 细分成本核算 (杜绝成本黑洞)
          </span>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#152640] text-[#8a97a8] border-b border-[rgba(255,255,255,0.08)]">
                  <th className="p-2.5">Agent 成员</th>
                  <th className="p-2.5 font-mono">Token 消耗</th>
                  <th className="p-2.5 font-mono">GPU 算力时长</th>
                  <th className="p-2.5 font-mono">核算成本</th>
                  <th className="p-2.5 text-right font-mono">占比</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.04)] font-mono text-xs">
                {agentCosts.map((agent, i) => (
                  <tr key={i} className="hover:bg-[#152640]/50 transition-colors">
                    <td className="p-2.5 font-sans font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: agent.color }} />
                      <span className="text-[#e8f0f8]">{agent.name}</span>
                    </td>
                    <td className="p-2.5 text-[#8a97a8]">{agent.token}</td>
                    <td className="p-2.5 text-[#8a97a8]">{agent.gpuHours}</td>
                    <td className="p-2.5 text-[#00e0b8] font-bold">¥ {agent.cost.toFixed(2)}</td>
                    <td className="p-2.5 text-right text-[#8a97a8]">
                      {((agent.cost / 48.8) * 100).toFixed(0)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: DGX Off-peak Heatmap */}
        <div className="rounded-xl bg-[#0f1e35] border border-[rgba(0,180,216,0.25)] p-4 space-y-3 domain-border-mgmt flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#00B4D8]" />
              <h3 className="text-xs font-bold text-[#e8f0f8]">DGX 错峰调度套利面板</h3>
            </div>
            <p className="text-xs text-[#8a97a8] leading-relaxed">
              谷电时段 (00:00–08:00) 算力成本仅为峰电 32%。建议批量渲染任务排期至夜间执行。
            </p>

            <div className="p-3 rounded-lg bg-[#0a1628] border border-[rgba(0,224,184,0.2)] text-xs text-[#00e0b8] font-mono space-y-1">
              <div className="flex justify-between">
                <span>当前处于: 昼间平电期</span>
                <span>建议排产: 2 任务</span>
              </div>
              <div className="text-[10px] text-[#8a97a8]">夜间预设队列：14 批已就绪</div>
            </div>
          </div>

          <button
            type="button"
            className="w-full py-2 rounded-lg bg-[#00B4D8] hover:bg-[#009bb8] text-[#0a1628] font-bold text-xs transition-colors cursor-pointer"
          >
            一键应用夜间自动错峰排期
          </button>
        </div>
      </div>
    </div>
  );
};

export default CostCenterPage;
