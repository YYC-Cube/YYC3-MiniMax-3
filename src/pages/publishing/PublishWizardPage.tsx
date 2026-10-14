/**
 * @file: PublishWizardPage.tsx
 * @description: 页面组件：PublishWizardPage
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
  Send,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Film,
} from 'lucide-react';
import { PageId, ViewState, DevModeMeta } from '../../types';
import { EmptyState, LoadingState, ErrorState, NoPermissionState } from '../../components/common/States';

interface PublishWizardPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_PUBLISH: DevModeMeta = {
  apiEndpoint: '/api/v2/publishing/wizard/dispatch',
  confidenceSource: '知遇·伯乐 最佳发布时段推荐算法 + 平台风控限流预警',
  memoryScope: 'project',
  learningSampleSource: '各平台历史发布转化率与不同时间窗口留存关系库',
  driveModePolicy: '敏感词预检通过且授权凭证有效时，支持 L0 全自动定时发布',
  stateSwitchConditions: {
    empty: '当前无任何渲染合格的成品影片可供分发',
    loading: '五大平台元数据自适应编译与敏感词批量预检中',
    error: '第三方开放平台分发网关熔断或频控超标 (RATE_LIMIT)',
    forbidden: '用户无对外正式矩阵账号发布权限',
  },
};

export const PublishWizardPage: React.FC<PublishWizardPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const [step, setStep] = useState<number>(2); // Step 1: Select, 2: Adapt, 3: Schedule
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['douyin', 'channels', 'bilibili']);
  const [titleText, setTitleText] = useState('万古剑尊重生都市，本命飞剑重铸之日，就是世家低头之时！#短剧 #修真 #逆袭');

  if (viewState === 'loading') return <LoadingState message="编译各短视频平台元数据与敏感词预检中..." />;
  if (viewState === 'empty') return <EmptyState title="无可分发成片" actionText="去时间线导出视频" onAction={() => onNavigate('video-exports')} />;
  if (viewState === 'error') return <ErrorState title="平台分发网关超时" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无全网矩阵发布权限" />;

  const platforms = [
    { id: 'douyin', name: '抖音', ratio: '9:16 (1080p)', iconColor: '#00e0b8' },
    { id: 'channels', name: '微信视频号', ratio: '9:16 (1080p)', iconColor: '#22C55E' },
    { id: 'bilibili', name: 'B站', ratio: '16:9 (4K)', iconColor: '#00B4D8' },
    { id: 'kuaishou', name: '快手', ratio: '9:16 (1080p)', iconColor: '#ff7a45' },
    { id: 'xiaohongshu', name: '小红书', ratio: '3:4 (竖屏)', iconColor: '#ff4422' },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header & 3 Steps Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[rgba(255,255,255,0.06)] domain-border-push">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#e8f0f8]">一键多平台分发向导 (Publish Wizard)</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#FF7A5C] border border-[#FF7A5C]/30">
              蚁小二 / 融媒体级
            </span>
          </div>
          <p className="text-xs text-[#8a97a8] mt-1">
            格式自适应 · 敏感词预检 · 知遇·伯乐 最佳时间智能排期
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className={step >= 1 ? 'text-[#00e0b8] font-bold' : 'text-[#5c697a]'}>
            ① 选片
          </span>
          <span className="text-[#5c697a]">→</span>
          <span className={step >= 2 ? 'text-[#00e0b8] font-bold' : 'text-[#5c697a]'}>
            ② 平台适配与文案
          </span>
          <span className="text-[#5c697a]">→</span>
          <span className={step >= 3 ? 'text-[#00e0b8] font-bold' : 'text-[#5c697a]'}>
            ③ 定时排期
          </span>
        </div>
      </div>

      {/* Main Split: Left Configuration, Right Summary Sidebar */}
      <div className="flex gap-4">
        {/* Left Form */}
        <div className="flex-1 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] p-5 space-y-5">
          {/* Platform Multi-Select Chips */}
          <div>
            <span className="text-xs font-bold text-[#e8f0f8] block mb-2">
              选择目标推送矩阵平台 (多选)
            </span>
            <div className="flex flex-wrap gap-2">
              {platforms.map((p) => {
                const isSelected = selectedPlatforms.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedPlatforms((prev) =>
                        prev.includes(p.id) ? prev.filter((i) => i !== p.id) : [...prev, p.id]
                      );
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#152640] border-2 border-[#00e0b8] text-[#e8f0f8] shadow-md'
                        : 'bg-[#0a1628] border border-[rgba(255,255,255,0.06)] text-[#8a97a8]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.iconColor }} />
                    <span>{p.name}</span>
                    <span className="text-[10px] font-mono opacity-70">({p.ratio})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Metadata Editor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#e8f0f8]">
                全网标题与爆款话题 (AI 创想·灵韵 生成)
              </span>
              <button
                type="button"
                className="text-xs text-[#00e0b8] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>换一批爆款标题</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={titleText}
              onChange={(e) => setTitleText(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.08)] text-xs text-[#e8f0f8] font-mono focus:border-[#00e0b8] focus:outline-none"
            />

            <div className="p-2.5 rounded-lg bg-[#0a1628] border border-[rgba(34,197,94,0.3)] flex items-center justify-between text-xs text-[#22C55E]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>敏感词预检通过：0 处广告法禁用词，0 处涉暴涉低俗词汇</span>
              </div>
              <span className="font-mono text-[11px]">合规率 100%</span>
            </div>
          </div>
        </div>

        {/* Right Summary & Time Recommendation Sidebar */}
        <div className="w-80 rounded-xl bg-[#0f1e35] border border-[rgba(255,122,92,0.25)] p-4 space-y-4 shrink-0 flex flex-col justify-between domain-border-push">
          <div className="space-y-4">
            <span className="text-xs font-bold text-[#e8f0f8] block">分发任务预估摘要</span>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-[#8a97a8]">
                <span>推送目标账号:</span>
                <span className="text-[#e8f0f8]">{selectedPlatforms.length} 个</span>
              </div>
              <div className="flex justify-between text-[#8a97a8]">
                <span>格式自适应变体:</span>
                <span className="text-[#00e0b8]">{selectedPlatforms.length} 套规格</span>
              </div>
              <div className="flex justify-between text-[#8a97a8]">
                <span>预计全网并发耗时:</span>
                <span className="text-[#FFB020]">~ 24 秒</span>
              </div>
            </div>

            {/* Agent Best Posting Time Recommendation */}
            <div className="p-3 rounded-lg bg-[#0a1628] border border-[rgba(255,215,0,0.25)] text-xs space-y-1.5">
              <span className="font-bold text-[#FFD700] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>知遇·伯乐 最佳时段建议:</span>
              </span>
              <p className="text-[#8a97a8] text-[11px] leading-relaxed">
                大数据预测：今晚 <strong>20:15</strong> 为短剧黄金吸粉窗口，互动率预期较平时高出 34.6%。
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-[rgba(255,255,255,0.06)]">
            <button
              type="button"
              onClick={() => onNavigate('publish-board')}
              className="w-full py-2.5 rounded-lg bg-[#FF7A5C] hover:bg-[#e06548] text-white font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-orange-950/40 flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>立即加入定时发布队列</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishWizardPage;
