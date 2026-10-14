/**
 * @file: AnalyticsPage.tsx
 * @description: 页面组件：AnalyticsPage
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
  BarChart3,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Filter,
  Eye,
  Share2,
  Inbox,
  Film,
  Zap,
} from 'lucide-react';
import { PageId, ViewState, DevModeMeta } from '../../types';
import MetricCard from '../../components/common/MetricCard';
import { EmptyState, LoadingState, ErrorState, NoPermissionState } from '../../components/common/States';

interface AnalyticsPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_ANALYTICS: DevModeMeta = {
  apiEndpoint: '/api/v2/management/analytics/reflex-insights',
  confidenceSource: '语枢·万物 (运营大数据分析) + 预见·先知 (爆款趋势预测)',
  memoryScope: 'project',
  learningSampleSource: '爆款高完播分镜特征自动回流入库 Few-shot',
  driveModePolicy: '数据洞察一键“转为新选题”直接回流至剧本工作台形成 G5 闭环',
  stateSwitchConditions: {
    empty: '当前剧目刚上线分发，尚未有全网播放与互动数据回流',
    loading: '抖音/视频号/B站多平台 API 播放漏斗数据聚合清洗中',
    error: '第三方数据回流中间件服务故障或 Token 失效',
    forbidden: '用户无运营全网数据看板与商业报表查阅权限',
  },
};

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('7');

  if (viewState === 'loading') return <LoadingState message="拉取全网平台回流数据并计算完播漏斗..." />;
  if (viewState === 'empty') return <EmptyState title="暂无回流数据" description="作品发布后 2 小时将自动同步多端播放数据。" />;
  if (viewState === 'error') return <ErrorState title="数据回流统计异常" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无数据看板查看权限" />;

  const topShots = [
    { rank: 1, shot: 'S01-01', name: '叶凌霄金瞳特写', views: '284.2万', completion: '78.4%', jump: 'storyboard' },
    { rank: 2, shot: 'S01-03', name: '冰魄飞剑凝结', views: '210.5万', completion: '74.2%', jump: 'storyboard' },
    { rank: 3, shot: 'S01-05', name: '大厅全景爆碎', views: '189.0万', completion: '69.1%', jump: 'storyboard' },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#e8f0f8]">运营数据看板 (Analytics & Reflex)</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#00B4D8] border border-[rgba(0,180,216,0.3)]">
              G5 运营反哺生产闭环
            </span>
          </div>
          <p className="text-xs text-[#8a97a8] mt-1">
            全网多端播放漏斗 · 爆款分镜溯源 · AI 洞察一键反哺下季剧本选题
          </p>
        </div>

        {/* Time Filter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 rounded-lg bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] text-xs font-mono">
            {(['7', '30', '90'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded cursor-pointer ${
                  timeRange === r
                    ? 'bg-[#00B4D8] text-[#0a1628] font-bold'
                    : 'text-[#8a97a8] hover:text-white'
                }`}
              >
                近 {r} 天
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 1: 4 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <MetricCard
          label="全网总播放量"
          value="174.7"
          unit="万次"
          change="+32.4%"
          domain="management"
          icon={<Eye className="w-4 h-4" />}
        />
        <MetricCard
          label="平均完播率"
          value="42.8"
          unit="%"
          change="+6.2%"
          domain="management"
          icon={<TrendingUp className="w-4 h-4" />}
          subtext="行业均值 28.5%"
        />
        <MetricCard
          label="互动转化率"
          value="8.9"
          unit="%"
          change="+1.4%"
          domain="management"
          icon={<Share2 className="w-4 h-4" />}
        />
        <MetricCard
          label="预估总商业收益"
          value="¥ 38,400"
          unit="元"
          change="+18.9%"
          domain="management"
          icon={<Zap className="w-4 h-4" />}
        />
      </div>

      {/* Row 2: Main Split: Left Funnel & Top Shots, Right Agent Reflex Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Funnel & Top Shots */}
        <div className="lg:col-span-2 space-y-4">
          {/* Funnel */}
          <div className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] space-y-3">
            <span className="text-xs font-bold text-[#e8f0f8] block">
              短剧完播转化漏斗 (Retention Funnel)
            </span>
            <div className="space-y-2 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex justify-between text-[#8a97a8]">
                  <span>视频曝光 (Impression): 1,747,000</span>
                  <span className="text-[#00e0b8]">100%</span>
                </div>
                <div className="w-full h-2 rounded bg-[#0a1628]">
                  <div className="h-full bg-[#00e0b8] rounded" style={{ width: '100%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[#8a97a8]">
                  <span>3 秒黄金驻留 (Retention 3s): 1,220,000</span>
                  <span className="text-[#00B4D8]">69.8%</span>
                </div>
                <div className="w-full h-2 rounded bg-[#0a1628]">
                  <div className="h-full bg-[#00B4D8] rounded" style={{ width: '69.8%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[#8a97a8]">
                  <span>50% 剧情推进: 910,000</span>
                  <span className="text-[#9d7cd8]">52.1%</span>
                </div>
                <div className="w-full h-2 rounded bg-[#0a1628]">
                  <div className="h-full bg-[#9d7cd8] rounded" style={{ width: '52.1%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[#8a97a8]">
                  <span>100% 完整完播: 748,000</span>
                  <span className="text-[#22C55E]">42.8%</span>
                </div>
                <div className="w-full h-2 rounded bg-[#0a1628]">
                  <div className="h-full bg-[#22C55E] rounded" style={{ width: '42.8%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Top Shots */}
          <div className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] space-y-3">
            <span className="text-xs font-bold text-[#e8f0f8] block">
              爆款镜头 TOP 3 (溯源反向跳转)
            </span>
            <div className="space-y-2 text-xs">
              {topShots.map((ts) => (
                <div
                  key={ts.rank}
                  onClick={() => onNavigate('storyboard')}
                  className="p-2.5 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.06)] hover:border-[#00e0b8] transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#152640] text-[#00e0b8] font-bold font-mono text-xs flex items-center justify-center">
                      {ts.rank}
                    </span>
                    <span className="font-mono font-bold text-[#e8f0f8]">{ts.shot}</span>
                    <span className="text-[#8a97a8]">{ts.name}</span>
                  </div>
                  <div className="flex items-center gap-4 font-mono text-[11px]">
                    <span className="text-[#e8f0f8]">播放: {ts.views}</span>
                    <span className="text-[#22C55E]">完播: {ts.completion}</span>
                    <span className="text-[#00e0b8]">查看分镜 →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Agent Reflex Insights Card */}
        <div className="rounded-xl bg-[#0f1e35] border border-[rgba(0,180,216,0.25)] p-4 space-y-4 domain-border-mgmt flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFD700]" />
              <h3 className="text-xs font-bold text-[#e8f0f8]">
                Agent 洞察与选题反哺建议
              </h3>
            </div>
            <p className="text-xs text-[#8a97a8] leading-relaxed">
              语枢·万物与预见·先知基于本周 174 万次全网播放回流分析：
            </p>

            <div className="p-3 rounded-lg bg-[#0a1628] border border-[rgba(0,224,184,0.2)] text-xs text-[#e8f0f8] space-y-2">
              <div className="font-bold text-[#00e0b8]">建议选题方向：</div>
              <p className="text-[11px] text-[#8a97a8] leading-relaxed">
                “‘冷面剑尊在豪门晚宴当众破界’的冲突前置手法完播率达 78.4%，显著优于传统铺垫。建议下一季在 S01 增加‘女主苏清月与反派家族的股权对赌’剧情。”
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] space-y-2">
            <button
              type="button"
              onClick={() => onNavigate('script')}
              className="w-full py-2.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-teal-950/40"
            >
              <span>一键转为新剧本选题 (闭环回流)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
