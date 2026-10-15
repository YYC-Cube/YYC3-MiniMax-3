/**
 * @file: VideoExportsPage.tsx
 * @description: 页面组件：VideoExportsPage
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import {
  Download
} from 'lucide-react';
import React, { useState } from 'react';
import { EmptyState, ErrorState, LoadingState, NoPermissionState } from '../../components/common/States';
import { DevModeMeta, PageId, ViewState } from '../../types';

interface VideoExportsPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_EXPORTS: DevModeMeta = {
  apiEndpoint: '/api/v2/editing/exports/tasks',
  confidenceSource: 'FFmpeg VideoToolbox 硬件编码器 + 宗师综合成片校验',
  memoryScope: 'project',
  learningSampleSource: '各平台历史完播率最优转码参数自动沉淀',
  driveModePolicy: '批量导出变体一键并发打包；支持断点续渲与断帧重跑',
  stateSwitchConditions: {
    empty: '当前无任何渲染导出历史与排队任务',
    loading: 'GPU 硬件编码器 (NVENC/VideoToolbox) 正在执行 4K 压制',
    error: 'FFmpeg 渲染管线内存溢出或滤镜链语法错误',
    forbidden: '用户无商业级无水印母带导出权限',
  },
};

export const VideoExportsPage: React.FC<VideoExportsPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const [resolution, setResolution] = useState<'1080p' | '4K' | '720p'>('1080p');
  const [format, setFormat] = useState<'MP4' | 'MOV'>('MP4');

  if (viewState === 'loading') return <LoadingState message="FFmpeg VideoToolbox 硬件编码器正在渲染 4K 母带..." />;
  if (viewState === 'empty') return <EmptyState title="渲染队列为空" actionText="从时间线发起渲染" onAction={() => onNavigate('video')} />;
  if (viewState === 'error') return <ErrorState title="渲染编码服务异常" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无成片母带导出权限" />;

  const tasks = [
    {
      id: 'EXP-101',
      title: '《凌霄剑仙》E01 抖音 9:16 满血竖屏版',
      resolution: '1080×1920 (9:16)',
      bitrate: '18 Mbps · H.264',
      progress: 100,
      status: 'completed',
      duration: '00m 42s',
      hwTag: 'VideoToolbox HW',
      size: '86 MB',
    },
    {
      id: 'EXP-102',
      title: '《凌霄剑仙》E01 B站 16:9 4K 收藏母带',
      resolution: '3840×2160 (16:9)',
      bitrate: '45 Mbps · HEVC',
      progress: 68,
      status: 'rendering',
      duration: '01m 20s',
      hwTag: 'NVENC 硬件加速',
      size: '280 MB',
    },
    {
      id: 'EXP-103',
      title: '《凌霄剑仙》E01 视频号 9:16 社交版',
      resolution: '1080×1920 (9:16)',
      bitrate: '15 Mbps · H.264',
      progress: 100,
      status: 'completed',
      duration: '00m 38s',
      hwTag: 'VideoToolbox HW',
      size: '72 MB',
    },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#e8f0f8]">渲染导出中枢 (Render & Exports)</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#9d7cd8] border border-[#9d7cd8]/30">
              FFmpeg 硬件直通
            </span>
          </div>
          <p className="text-xs text-[#8a97a8] mt-1">
            一键批量导出全网多规格矩阵（抖音竖屏 / B站 4K / 视频号）
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('publish')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs cursor-pointer shadow-lg shadow-teal-950/40"
          >
            <span>直通多平台分发向导 →</span>
          </button>
        </div>
      </div>

      {/* Main Split: Left New Export Config Card (340px) + Right Render Tasks Queue */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Export Config Card */}
        <div className="w-full lg:w-80 rounded-xl bg-[#0f1e35] border border-[rgba(157,124,216,0.2)] p-4 space-y-4 lg:shrink-0 domain-border-edit">
          <span className="text-xs font-bold text-[#e8f0f8] block">新建多规格导出预设</span>

          <div>
            <span className="text-[#8a97a8] text-xs block mb-1">分辨率规格:</span>
            <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
              {(['1080p', '4K', '720p'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setResolution(r)}
                  className={`py-1.5 rounded cursor-pointer ${resolution === r
                      ? 'bg-[#9d7cd8] text-white font-bold'
                      : 'bg-[#0a1628] text-[#8a97a8]'
                    }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[#8a97a8] text-xs block mb-1">视频封装格式:</span>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              {(['MP4', 'MOV'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  className={`py-1.5 rounded cursor-pointer ${format === f
                      ? 'bg-[#9d7cd8] text-white font-bold'
                      : 'bg-[#0a1628] text-[#8a97a8]'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Multi-Platform Variant Button */}
          <div className="p-3 rounded-lg bg-[#0a1628] border border-[rgba(0,224,184,0.2)] space-y-1.5 text-xs">
            <span className="font-bold text-[#00e0b8] block">
              一键生成五大平台自适应变体包:
            </span>
            <p className="text-[#8a97a8] text-[11px] leading-snug">
              抖音 (9:16 1080p) + B站 (16:9 4K) + 视频号 (9:16) + 小红书 (3:4)
            </p>
          </div>

          <button
            type="button"
            className="w-full py-2.5 rounded-lg bg-[#9d7cd8] hover:bg-[#8b65cb] text-white font-bold text-xs transition-colors cursor-pointer shadow-md"
          >
            提交批量转码导出
          </button>
        </div>

        {/* Right: Render Tasks Queue */}
        <div className="flex-1 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] p-4 space-y-3">
          <span className="text-xs font-bold text-[#e8f0f8] block">
            硬件转码导出队列 (FFmpeg Hardware Pipeline)
          </span>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-xl bg-[#0a1628] border border-[rgba(255,255,255,0.06)] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#00e0b8]">
                      {task.id}
                    </span>
                    <h4 className="text-xs font-bold text-[#e8f0f8]">{task.title}</h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#152640] text-[#9d7cd8]">
                      {task.hwTag}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-[#8a97a8]">{task.size}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-[#152640] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${task.status === 'completed' ? 'bg-[#22C55E]' : 'bg-[#00e0b8]'
                        }`}
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#00e0b8] w-12 text-right">
                    {task.progress}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-[#5c697a] pt-1 border-t border-[rgba(255,255,255,0.04)]">
                  <span>{task.resolution} · {task.bitrate}</span>
                  <div className="flex items-center gap-2">
                    {task.status === 'completed' ? (
                      <button
                        type="button"
                        onClick={() => onNavigate('publish')}
                        className="text-[#00e0b8] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>下载并分发</span>
                      </button>
                    ) : (
                      <span className="text-[#FFB020]">压制中...</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoExportsPage;
