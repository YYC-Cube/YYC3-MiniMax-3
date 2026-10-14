/**
 * @file: VideoAdPage.tsx
 * @description: 页面组件：VideoAdPage
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
  DollarSign,
  ShieldAlert,
  Sparkles,
  Lock,
  ArrowRight,
  TrendingUp,
  Tag,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { PageId, ViewState, DevModeMeta } from '../../types';
import { EmptyState, LoadingState, ErrorState, NoPermissionState } from '../../components/common/States';

interface VideoAdPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_AD: DevModeMeta = {
  apiEndpoint: '/api/v2/editing/monetization/campaigns/sc-101',
  confidenceSource: '广告法合规词库预检 + 各短视频平台商业化流量变现 CPM 算法',
  memoryScope: 'project',
  learningSampleSource: '各行业品牌赞助植入转化率与用户留存折损分析库',
  driveModePolicy: '青少年模式开启时强制熔断所有广告位注入；单集最多允许 2 处植入',
  stateSwitchConditions: {
    empty: '当前剧目未绑定任何商业化赞助品牌或贴片广告',
    loading: '广告法合规敏感词检测与平台变现收益模型测算中',
    error: '商业化计费服务端结算接口超时 (BILLING_TIMEOUT)',
    forbidden: '用户无商业化植入、广告位定价与分发授权权限',
  },
};

export const VideoAdPage: React.FC<VideoAdPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const [minorProtectionActive, setMinorProtectionActive] = useState(false);
  const [adMode, setAdMode] = useState<'贴片' | '植入' | '口播' | '品牌角标'>('品牌角标');

  if (viewState === 'loading') return <LoadingState message="测算广告位商业化 CPM 收益与合规预检中..." />;
  if (viewState === 'empty') return <EmptyState title="暂无商业化配置" actionText="新增品牌植入" />;
  if (viewState === 'error') return <ErrorState title="商业化引擎连接异常" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无商业化广告配置权限" />;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#e8f0f8]">广告与商业化工作台 (Monetization)</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#FF7A5C] border border-[#FF7A5C]/30">
              CPM/CPC 动态变现
            </span>
          </div>
          <p className="text-xs text-[#8a97a8] mt-1">
            品牌贴片 · 剧情道具植入 · 平台收益分流 · 广告法自动合规拦截
          </p>
        </div>

        {/* Red Line: Youth Protection Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMinorProtectionActive(!minorProtectionActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              minorProtectionActive
                ? 'bg-[#ff4422] text-white shadow-lg shadow-red-950/40'
                : 'bg-[#152640] text-[#8a97a8] hover:text-[#ff4422] border border-[rgba(255,68,34,0.3)]'
            }`}
            title="一键开启未成年人保护模式（强制熔断禁用全部广告位）"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>未成年人保护模式：{minorProtectionActive ? '已开启 (全位熔断)' : '未开启'}</span>
          </button>
        </div>
      </div>

      {minorProtectionActive && (
        <div className="p-3 rounded-xl bg-red-950/40 border border-[#ff4422] text-xs text-[#ff4422] flex items-center justify-between animate-in fade-in">
          <span>红线触发：已全面禁用本剧所有剧集商业化广告贴片、口播与角标，确保未成年人内容绿色合规。</span>
        </div>
      )}

      {/* Main Split: Left Placement Options, Right Revenue Projection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left 2 Cols: Ad Configurations */}
        <div className="md:col-span-2 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,255,255,0.06)]">
            <span className="text-xs font-bold text-[#e8f0f8]">商业化植入模式切换</span>
            <div className="flex items-center gap-1.5 text-xs font-mono">
              {(['品牌角标', '贴片', '植入', '口播'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setAdMode(m)}
                  className={`px-2.5 py-1 rounded cursor-pointer ${
                    adMode === m
                      ? 'bg-[#FF7A5C] text-white font-bold'
                      : 'bg-[#0a1628] text-[#8a97a8]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.06)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#e8f0f8]">当前赞助商: 极客修真能量饮品</span>
                <span className="text-[#22C55E] font-mono text-[11px]">合规审查通过 (0 违规词)</span>
              </div>
              <p className="text-[#8a97a8] text-[11px]">
                植入策略：在 S01-01 叶凌霄端杯镜头右上角挂载透明动态呼吸角标（持续 3 秒）。
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Revenue Projection */}
        <div className="rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.15)] p-4 space-y-4">
          <span className="text-xs font-bold text-[#e8f0f8] block">单集商业化收益预估</span>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[#0a1628] space-y-1">
              <span className="text-[#8a97a8] text-[11px] block">预计 CPM 单价</span>
              <span className="text-xl font-bold text-[#00e0b8]">¥ 45.00 / 千次</span>
            </div>
            <div className="p-3 rounded-lg bg-[#0a1628] space-y-1">
              <span className="text-[#8a97a8] text-[11px] block">全网预计分成收益</span>
              <span className="text-xl font-bold text-[#22C55E]">¥ 12,400.00</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('video')}
            className="w-full py-2 rounded-lg bg-[#FF7A5C] hover:bg-[#e06548] text-white font-bold text-xs transition-colors cursor-pointer"
          >
            挂载至时间线轨道
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoAdPage;
