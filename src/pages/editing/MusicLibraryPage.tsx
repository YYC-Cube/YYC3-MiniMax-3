/**
 * @file: MusicLibraryPage.tsx
 * @description: 页面组件：MusicLibraryPage
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
  Music2,
  Play,
  Pause,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { PageId, ViewState, DevModeMeta } from '../../types';
import { EmptyState, LoadingState, ErrorState, NoPermissionState } from '../../components/common/States';

interface MusicLibraryPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_MUSIC: DevModeMeta = {
  apiEndpoint: '/api/v2/editing/music/emotions',
  confidenceSource: '语枢·万物 剧本情绪波形曲线匹配度 + Epidemic Sound 授权鉴权',
  memoryScope: 'project',
  learningSampleSource: '高完播率镜头与对应卡点 BGM 搭配索引',
  driveModePolicy: '选中的 BGM 自动灌入时间线 A2 轨道并完成节奏卡点重排',
  stateSwitchConditions: {
    empty: '当前情绪象限下无检索到匹配的免版权 BGM',
    loading: '多轨道音频频谱与节奏 BPM 特征点离线提取中',
    error: '音频 CDN 资源拉取超时或鉴权失效',
    forbidden: '用户无商业商用全渠道音乐授权权限',
  },
};

export const MusicLibraryPage: React.FC<MusicLibraryPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const [activeQuadrant, setActiveQuadrant] = useState('悬疑');
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (viewState === 'loading') return <LoadingState message="加载 BGM 情绪象限坐标与音频波形..." />;
  if (viewState === 'empty') return <EmptyState title="未找到匹配音乐" description="请尝试切换情绪象限或放宽 BPM 限制。" />;
  if (viewState === 'error') return <ErrorState title="音乐库服务连接中断" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无商用音乐库权限" />;

  const musicTracks = [
    {
      id: 'bgm-01',
      title: '暗潮涌动 · 宿命初醒',
      duration: '02m 45s',
      bpm: 124,
      emotion: '悬疑/史诗',
      license: '商用已授权',
      licenseColor: '#22C55E',
      matchScore: 96,
    },
    {
      id: 'bgm-02',
      title: '雷霆万钧 · 剑破苍穹',
      duration: '03m 12s',
      bpm: 148,
      emotion: '激昂/反转',
      license: '商用已授权',
      licenseColor: '#22C55E',
      matchScore: 92,
    },
    {
      id: 'bgm-03',
      title: '月华如水 · 浮生若梦',
      duration: '01m 58s',
      bpm: 82,
      emotion: '温暖/情感',
      license: '需署名',
      licenseColor: '#00B4D8',
      matchScore: 84,
    },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#e8f0f8]">BGM 情绪库 (Music Library)</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#9d7cd8] border border-[#9d7cd8]/30">
              Epidemic Sound 对标
            </span>
          </div>
          <p className="text-xs text-[#8a97a8] mt-1">
            二维情绪象限 · BPM 智能卡点 · 联动 P09 时间线 A2 情绪轨道
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('video')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs cursor-pointer shadow-md shadow-teal-950/40"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>基于剧本情绪曲线 AI 智能选乐</span>
        </button>
      </div>

      {/* 2D Emotion Quadrant Navigation */}
      <div className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(157,124,216,0.2)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Compass className="w-5 h-5 text-[#9d7cd8]" />
          <div>
            <h3 className="text-xs font-bold text-[#e8f0f8]">情绪象限分段 (Emotion Quadrant)</h3>
            <span className="text-[10px] text-[#8a97a8]">横轴：唤醒度 (Arousal) · 纵轴：效价 (Valence)</span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          {(['激昂', '温暖', '悬疑', '悲伤', '欢快'] as const).map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setActiveQuadrant(q)}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                activeQuadrant === q
                  ? 'bg-[#9d7cd8] text-white font-bold shadow-md'
                  : 'bg-[#0a1628] text-[#8a97a8] hover:text-white'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Music Cards List */}
      <div className="space-y-3">
        {musicTracks.map((track) => {
          const isPlaying = playingId === track.id;

          return (
            <div
              key={track.id}
              className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] hover:border-[#9d7cd8] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => setPlayingId(isPlaying ? null : track.id)}
                  className="w-10 h-10 rounded-xl bg-[#152640] hover:bg-[#9d7cd8] hover:text-white text-[#00e0b8] flex items-center justify-center transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-[#e8f0f8]">{track.title}</h4>
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.2 rounded"
                      style={{
                        backgroundColor: `${track.licenseColor}15`,
                        color: track.licenseColor,
                      }}
                    >
                      {track.license}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-[#8a97a8]">
                    <span>时长: {track.duration}</span>
                    <span>BPM: {track.bpm}</span>
                    <span>象限: {track.emotion}</span>
                  </div>
                </div>
              </div>

              {/* Match Score & Action */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-[#8a97a8] block">剧本匹配度</span>
                  <span className="text-base font-bold font-mono text-[#00e0b8]">
                    {track.matchScore}%
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('video')}
                  className="px-3.5 py-2 rounded-lg bg-[#9d7cd8] hover:bg-[#8b65cb] text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>应用到 A2 轨道</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MusicLibraryPage;
