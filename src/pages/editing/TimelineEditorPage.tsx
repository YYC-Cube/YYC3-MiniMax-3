/**
 * @file: TimelineEditorPage.tsx
 * @description: 页面组件：TimelineEditorPage
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import {
  DollarSign,
  FileVideo,
  GitCompare,
  Lock,
  Maximize2,
  Mic,
  Music,
  Pause,
  Play,
  RotateCcw,
  Scissors,
  Share2,
  Sparkles,
  Type,
  Volume2
} from 'lucide-react';
import React, { useState } from 'react';
import { ENDPOINTS, SNAPSHOT, storyboardService, timelineService, useApiData } from '../../api';
import { EmptyState, ErrorState, LoadingState, NoPermissionState } from '../../components/common/States';
import Thumb from '../../components/common/Thumb';
import { DevModeMeta, PageId, ViewState } from '../../types';

interface TimelineEditorPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_TIMELINE: DevModeMeta = {
  apiEndpoint: ENDPOINTS.timeline,
  confidenceSource: '语枢·万物 (情绪曲线卡点匹配) + FFmpeg VideoToolbox 硬件调度',
  memoryScope: 'project',
  learningSampleSource: '导演粗剪分段切片与转场时长参数偏好库',
  driveModePolicy: 'AI 粗剪默认生成预览序列，支持人工无损微调并触发异步硬件转码',
  stateSwitchConditions: {
    empty: '当前时间线无任何视频或音频轨道片段',
    loading: '音视频多轨道波形渲染与时间码微秒级对齐中',
    error: '硬件解码器崩溃或视频源片段帧损坏 (DECODE_ERR)',
    forbidden: '用户无剪辑母带修改与导出渲染权限',
  },
};

export const TimelineEditorPage: React.FC<TimelineEditorPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(3.2); // seconds
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const { data: clipsData, loading } = useApiData(timelineService.clips, SNAPSHOT.timelineClips);
  const clips = clipsData ?? [];
  // 预览大图派生自分镜域（S01-01 基准帧，正片画面代理）
  const { data: shotsData } = useApiData(storyboardService.list, SNAPSHOT.shotList);
  const previewFrame = shotsData?.find((s) => s.shotNumber === 'S01-01')?.thumbnailUrl;
  const [selectedClipId, setSelectedClipId] = useState<string>('v-01');
  const [showAiRoughCut, setShowAiRoughCut] = useState(false);

  if (viewState === 'loading') return <LoadingState message="初始化四轨时间线与硬件视频解码器..." />;
  if (viewState === 'empty') return <EmptyState title="时间线暂无素材" actionText="从分镜导入片段" onAction={() => onNavigate('storyboard')} />;
  if (viewState === 'error') return <ErrorState title="时间线内核崩溃" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无剪辑工作室权限" />;
  if (loading) return <LoadingState message="初始化四轨时间线与硬件视频解码器..." />;

  const selectedClip = clips.find((c) => c.id === selectedClipId) || clips[0];

  const tracks = [
    { id: 'V1', label: 'V1 画面主轨', icon: <FileVideo className="w-3.5 h-3.5 text-[#00e0b8]" />, color: '#00e0b8' },
    { id: 'A1', label: 'A1 配音对白', icon: <Mic className="w-3.5 h-3.5 text-[#00B4D8]" />, color: '#00B4D8' },
    { id: 'A2', label: 'A2 情绪 BGM', icon: <Music className="w-3.5 h-3.5 text-[#9d7cd8]" />, color: '#9d7cd8' },
    { id: 'T1', label: 'T1 智能字幕', icon: <Type className="w-3.5 h-3.5 text-[#FFB020]" />, color: '#FFB020' },
  ];

  const totalDuration = 18.0;

  return (
    <div className="space-y-3 animate-in fade-in duration-200">
      {/* Top Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl bg-[#0f1e35] border border-[rgba(157,124,216,0.25)] domain-border-edit">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-[#e8f0f8]">
              《凌霄剑仙》E01 多轨道剪辑
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#9d7cd8] border border-[#9d7cd8]/30">
              剪映专业版级内核
            </span>
          </div>

          {/* Aspect Ratio Switch */}
          <div className="flex items-center p-0.5 rounded bg-[#0a1628] border border-[rgba(255,255,255,0.08)] text-xs font-mono">
            {(['16:9', '9:16', '1:1'] as const).map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => setAspectRatio(ratio)}
                className={`px-2 py-0.5 rounded cursor-pointer ${aspectRatio === ratio
                  ? 'bg-[#9d7cd8] text-white font-bold'
                  : 'text-[#8a97a8] hover:text-white'
                  }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowAiRoughCut(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(157,124,216,0.15)] hover:bg-[rgba(157,124,216,0.25)] text-[#9d7cd8] border border-[#9d7cd8]/30 text-xs font-bold cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI 智能粗剪 (自动卡点)</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('video-compare')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#152640] text-[#8a97a8] hover:text-white text-xs border border-[rgba(255,255,255,0.08)] cursor-pointer"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>版本 Diff</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('video-exports')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs cursor-pointer shadow-md shadow-teal-950/40"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>渲染导出 (4K/多规格)</span>
          </button>
        </div>
      </div>

      {/* Middle Section: Left Material Drawer (240px) + Center 16:9 Preview + Right Inspector (280px) */}
      <div className="flex gap-3 h-[360px]">
        {/* Left Material Drawer */}
        <div className="w-56 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] p-3 space-y-3 shrink-0 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#e8f0f8] block">素材库与音效</span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                className="p-2 rounded bg-[#152640] text-[#00e0b8] font-medium text-left"
              >
                分镜片段 (5)
              </button>
              <button
                type="button"
                onClick={() => onNavigate('voice')}
                className="p-2 rounded bg-[#0a1628] text-[#8a97a8] hover:text-white text-left"
              >
                角色配音
              </button>
              <button
                type="button"
                onClick={() => onNavigate('music')}
                className="p-2 rounded bg-[#0a1628] text-[#8a97a8] hover:text-white text-left"
              >
                情绪 BGM
              </button>
              <button
                type="button"
                onClick={() => onNavigate('video-ad')}
                className="p-2 rounded bg-[#0a1628] text-[#8a97a8] hover:text-white text-left"
              >
                广告挂件
              </button>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-[#0a1628] text-[10px] text-[#5c697a] font-mono">
            双击轨道片段可进入微调裁剪
          </div>
        </div>

        {/* Center: Video Player Preview (16:9 Aspect Ratio) */}
        <div className="flex-1 rounded-xl bg-[#071222] border border-[rgba(255,255,255,0.08)] flex flex-col justify-between p-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#8a97a8] z-10">
            <span className="font-mono text-[#00e0b8]">预览窗口 · 1080p 60fps</span>
            <span className="font-mono font-bold text-[#e8f0f8]">
              00:{currentTime < 10 ? `0${currentTime.toFixed(2)}` : currentTime.toFixed(2)} / 00:{totalDuration.toFixed(2)}
            </span>
          </div>

          {/* Player Visual Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Thumb
              src={previewFrame}
              label="正片画面"
              className="w-full h-full object-contain"
            />
            {/* Subtitle Overlay */}
            <div className="absolute bottom-12 px-6 py-1.5 rounded-lg bg-black/60 backdrop-blur-xs text-white text-sm font-medium tracking-wide">
              （内心独白）三百年了，这具肉躯终于感应到灵枢。
            </div>
          </div>

          {/* Player Bottom Control Bar */}
          <div className="flex items-center justify-between z-10 bg-[#0f1e35]/90 p-2 rounded-lg border border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg bg-[#00e0b8] text-[#0a1628] font-bold cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setCurrentTime(0)}
                className="p-1.5 rounded-lg bg-[#152640] text-[#8a97a8] hover:text-white cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                className="p-1.5 rounded-lg bg-[#152640] text-[#8a97a8] hover:text-white cursor-pointer"
                title="当前播放头处剪刀分割"
              >
                <Scissors className="w-3.5 h-3.5 text-[#00e0b8]" />
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-[#8a97a8]">
              <span>比例: {aspectRatio}</span>
              <Maximize2 className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
            </div>
          </div>
        </div>

        {/* Right Inspector */}
        <div className="w-72 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] p-3.5 space-y-3 shrink-0 text-xs overflow-y-auto">
          <span className="font-bold text-[#e8f0f8] block">片段属性检查器</span>

          <div className="p-2.5 rounded-lg bg-[#0a1628] space-y-1">
            <span className="font-mono text-[#00e0b8] block">{selectedClip.name}</span>
            <div className="flex justify-between text-[11px] text-[#8a97a8] font-mono">
              <span>时长: {selectedClip.durationSec}s</span>
              <span>入点: {selectedClip.startSec}s</span>
            </div>
          </div>

          {/* Transitions */}
          <div>
            <span className="text-[#8a97a8] block mb-1">转场效果 (Transition):</span>
            <select
              value={selectedClip.transitionType || 'none'}
              className="w-full p-2 rounded bg-[#0a1628] border border-[rgba(255,255,255,0.08)] text-[#e8f0f8] focus:outline-none"
            >
              <option value="none">无转场</option>
              <option value="fade">淡入淡出 (Fade)</option>
              <option value="slide">横向滑动 (Slide)</option>
              <option value="dissolve">交叉叠化 (Dissolve)</option>
            </select>
          </div>

          {/* Audio Volume */}
          <div>
            <span className="text-[#8a97a8] block mb-1">音量包络增益 (0% – 100%):</span>
            <input
              type="range"
              min={0}
              max={100}
              defaultValue={100}
              className="w-full accent-[#00e0b8]"
            />
          </div>

          {/* Ad Placement Hook */}
          <div className="p-2.5 rounded-lg bg-[#0a1628] border border-[rgba(255,122,92,0.2)] text-[11px] space-y-1">
            <span className="font-bold text-[#FF7A5C] flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>商业化植入位 (P25)</span>
            </span>
            <p className="text-[#8a97a8]">
              可在本片段末尾挂载动态品牌贴片或角标。
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Timeline (Core Area, 300px height): Four Tracks */}
      <div className="rounded-xl bg-[#0f1e35] border border-[rgba(157,124,216,0.3)] p-3 space-y-2">
        {/* Timeline Header Ruler */}
        <div className="flex items-center text-[10px] font-mono text-[#5c697a] border-b border-[rgba(255,255,255,0.08)] pb-1">
          <div className="w-28 shrink-0">轨道 / 时间刻度</div>
          <div className="flex-1 flex justify-between">
            <span>00:00</span>
            <span>00:03</span>
            <span>00:06</span>
            <span>00:09</span>
            <span>00:12</span>
            <span>00:15</span>
            <span>00:18</span>
          </div>
        </div>

        {/* 4 Tracks Stream */}
        <div className="space-y-2">
          {tracks.map((trk) => {
            const trackClips = clips.filter((c) => c.trackId === trk.id);

            return (
              <div key={trk.id} className="flex items-center gap-2">
                {/* Track Header (Lock / Hide / Mute) */}
                <div className="w-28 shrink-0 p-2 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    {trk.icon}
                    <span className="font-mono text-[#e8f0f8] truncate">{trk.id}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#5c697a]">
                    <Volume2 className="w-3 h-3 hover:text-white cursor-pointer" />
                    <Lock className="w-3 h-3 hover:text-white cursor-pointer" />
                  </div>
                </div>

                {/* Track Clips Runway */}
                <div className="flex-1 h-10 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.04)] relative overflow-hidden flex items-center px-1">
                  {trackClips.map((clip) => {
                    const leftPct = (clip.startSec / totalDuration) * 100;
                    const widthPct = (clip.durationSec / totalDuration) * 100;
                    const isSelected = selectedClipId === clip.id;

                    return (
                      <div
                        key={clip.id}
                        onClick={() => setSelectedClipId(clip.id)}
                        className={`absolute h-8 rounded px-2 flex items-center justify-between text-[11px] font-medium cursor-pointer transition-all truncate ${isSelected
                          ? 'ring-2 ring-white shadow-md'
                          : 'opacity-90 hover:opacity-100'
                          }`}
                        style={{
                          left: `${leftPct}%`,
                          width: `${Math.max(widthPct, 6)}%`,
                          backgroundColor: `${trk.color}25`,
                          border: `1px solid ${trk.color}60`,
                          color: trk.color,
                        }}
                      >
                        <span className="truncate">{clip.name}</span>
                        {clip.transitionType && clip.transitionType !== 'none' && (
                          <span className="text-[9px] font-mono opacity-80 shrink-0">
                            [{clip.transitionType}]
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimelineEditorPage;
