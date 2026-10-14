/**
 * @file: VideoComparePage.tsx
 * @description: 页面组件：VideoComparePage
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import {
  ArrowRight
} from 'lucide-react';
import React, { useState } from 'react';
import { assetService, SNAPSHOT, storyboardService, useApiData } from '../../api';
import { EmptyState, ErrorState, LoadingState, NoPermissionState } from '../../components/common/States';
import Thumb from '../../components/common/Thumb';
import { DevModeMeta, PageId, ViewState } from '../../types';

interface VideoComparePageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_COMPARE: DevModeMeta = {
  apiEndpoint: '/api/v2/editing/versions/diff/sc-101',
  confidenceSource: 'Figma-Style Visual Diff Engine + Frame Hash Matching',
  memoryScope: 'project',
  learningSampleSource: '人工合并与版本回滚历史决策记录',
  driveModePolicy: 'Diff 比对支持逐条采纳与全量快照回滚；合并操作需二次确认',
  stateSwitchConditions: {
    empty: '当前项目仅有单一版本，无可供比对的历史版本',
    loading: '两版本视频帧哈希计算与时间线差异对齐中',
    error: '历史版本母带文件丢失或版本间时间码无法对齐',
    forbidden: '用户无版本合并与历史母带回滚权限',
  },
};

export const VideoComparePage: React.FC<VideoComparePageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { data: shotsData } = useApiData(storyboardService.list, SNAPSHOT.shotList);
  const { data: assetsData } = useApiData(assetService.list, SNAPSHOT.assetList);
  // 对比画面派生：版本 A = S01-01 基准帧，版本 B = S01-04 优化后基准（asset-c02 苏清月 RefCard）
  const versionAThumb = shotsData?.find((s) => s.shotNumber === 'S01-01')?.thumbnailUrl;
  const versionBThumb = assetsData?.find((a) => a.id === 'asset-c02')?.previewUrl;

  if (viewState === 'loading') return <LoadingState message="计算两版本关键帧差异与时间线 Diff..." />;
  if (viewState === 'empty') return <EmptyState title="无差异对比数据" description="两版本视频完全一致，未检测到任何改动。" />;
  if (viewState === 'error') return <ErrorState title="版本对齐引擎异常" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无版本回滚与对比权限" />;

  const diffItems = [
    { id: 1, shot: 'S01-04', type: '修改', desc: '苏清月眼神光重绘，去除柔弱偏色，增加冷峻反光', status: 'modified', color: '#FFB020' },
    { id: 2, shot: 'S01-05', type: '新增', desc: '大厅全景爆碎镜头延长 0.5s，并叠加气浪粒子转场', status: 'added', color: '#22C55E' },
    { id: 3, shot: 'A2-BGM', type: '微调', desc: '卡点重音提前 0.2s，配合水箭凝结节奏', status: 'modified', color: '#FFB020' },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#e8f0f8]">版本对比 / Diff 工作台</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#9d7cd8] border border-[#9d7cd8]/30">
              Figma Version Diff 对标
            </span>
          </div>
          <p className="text-xs text-[#8a97a8] mt-1">
            双轨同步播放 · 差异片段高亮标注 · 支持逐条采纳与无损合并
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('video')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs cursor-pointer shadow-md shadow-teal-950/40"
          >
            <span>合并为 v3.5 新版本</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Split: Left Version A vs Right Version B Viewports */}
      <div className="grid grid-cols-2 gap-4">
        {/* Version A */}
        <div className="rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#e8f0f8]">版本 A: v3.2 (昨天 18:00 导出)</span>
            <span className="font-mono text-[#8a97a8]">18.0s</span>
          </div>
          <div className="aspect-video rounded-lg overflow-hidden bg-[#0a1628] border border-[rgba(255,255,255,0.1)] relative">
            <Thumb src={versionAThumb} label="版本A" className="w-full h-full object-cover" />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-xs text-[#8a97a8] font-mono">
              Version A
            </span>
          </div>
        </div>

        {/* Version B */}
        <div className="rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.3)] p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#00e0b8]">版本 B: v3.4 (AI 宗师优化版)</span>
            <span className="font-mono text-[#00e0b8]">18.5s (+0.5s)</span>
          </div>
          <div className="aspect-video rounded-lg overflow-hidden bg-[#0a1628] border-2 border-[#00e0b8] relative">
            <Thumb src={versionBThumb} label="版本B" className="w-full h-full object-cover" />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#00e0b8] text-xs text-[#0a1628] font-mono font-bold">
              Version B (优化)
            </span>
          </div>
        </div>
      </div>

      {/* Diff Inspector List */}
      <div className="rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] p-4 space-y-3">
        <span className="text-xs font-bold text-[#e8f0f8] block">3 处差异明细 (Diff Changes)</span>
        <div className="space-y-2 text-xs">
          {diffItems.map((diff) => (
            <div
              key={diff.id}
              className="p-3 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.06)] flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span
                  className="px-2 py-0.5 rounded font-mono text-[10px] font-bold"
                  style={{ backgroundColor: `${diff.color}20`, color: diff.color }}
                >
                  {diff.type}
                </span>
                <span className="font-mono font-bold text-[#e8f0f8]">{diff.shot}</span>
                <span className="text-[#8a97a8]">{diff.desc}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-2.5 py-1 rounded bg-[#152640] hover:bg-[#1f3659] text-[#8a97a8] hover:text-white cursor-pointer"
                >
                  保留 A
                </button>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold cursor-pointer"
                >
                  采纳 B
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoComparePage;
