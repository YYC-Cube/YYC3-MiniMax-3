/**
 * @file: VoiceStudioPage.tsx
 * @description: 页面组件：VoiceStudioPage
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
  Mic2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  Sliders,
  CheckCircle2,
  ArrowRight,
  User,
  Music,
} from 'lucide-react';
import { PageId, ViewState, DevModeMeta } from '../../types';
import { EmptyState, LoadingState, ErrorState, NoPermissionState } from '../../components/common/States';

interface VoiceStudioPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_VOICE: DevModeMeta = {
  apiEndpoint: '/api/v2/production/voice/dubbing/sc-101',
  confidenceSource: 'ElevenLabs 克隆音色拟合度 + 韵律断句置信度',
  memoryScope: 'project',
  learningSampleSource: '导演试听调优音高与语速偏好记录',
  driveModePolicy: '配音生成完毕自动同步推入剪辑域 A1 音频轨道',
  stateSwitchConditions: {
    empty: '当前剧本分镜无任何台词对白文本',
    loading: '神经声码器正在并发合成 14 条角色情感配音音频',
    error: 'TTS 服务音频流断流或断句超时',
    forbidden: '用户无音色克隆与授权使用权限',
  },
};

export const VoiceStudioPage: React.FC<VoiceStudioPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [emotionLevel, setEmotionLevel] = useState(3); // 1-5 (平静到激昂)

  if (viewState === 'loading') return <LoadingState message="TTS 神经声学引擎正在合成角色专属情感音频..." />;
  if (viewState === 'empty') return <EmptyState title="台词列表为空" actionText="去剧本工作台补充对白" onAction={() => onNavigate('script')} />;
  if (viewState === 'error') return <ErrorState title="配音引擎连接超时" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无音色库与配音生成权限" />;

  const dialogues = [
    { id: 1, shot: 'S01-01', character: '叶凌霄', line: '三百年了，这具肉躯终于感应到灵枢。', emotion: '冷峻沉着', timbre: '修真青年原音' },
    { id: 2, shot: 'S01-02', character: '陈浩天', line: '哟，这不是我们苏家的大能人吗？怎么躲在角落里？', emotion: '讥讽狂妄', timbre: '豪门纨绔特音' },
    { id: 3, shot: 'S01-03', character: '叶凌霄', line: '蝼蚁之辈，也敢惊扰本座清修？', emotion: '杀意威严', timbre: '修真青年原音' },
    { id: 4, shot: 'S01-04', character: '苏清月', line: '陈少，这里是苏家年会，请你自重！', emotion: '冷艳斥责', timbre: '高贵女总裁音' },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#e8f0f8]">配音导演台 (Voice Studio)</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#00e0b8] border border-[rgba(0,224,184,0.3)]">
              ElevenLabs 对标
            </span>
          </div>
          <p className="text-xs text-[#8a97a8] mt-1">
            音色克隆 · 情绪五档滑杆 · 语速气口微调 · 直通时间线 A1 轨道
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg bg-[#152640] hover:bg-[#1f3659] text-[#e8f0f8] text-xs border border-[rgba(255,255,255,0.08)] cursor-pointer"
          >
            导入外录干音
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs cursor-pointer shadow-lg shadow-teal-950/40"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI 一键全集配音</span>
          </button>
        </div>
      </div>

      {/* Main 3 Column Split */}
      <div className="flex gap-4">
        {/* Left: Dialogue List */}
        <div className="w-72 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)] p-3 space-y-2.5 shrink-0">
          <span className="text-xs font-bold text-[#e8f0f8] block">分镜台词对白列表</span>
          <div className="space-y-2 text-xs">
            {dialogues.map((d) => (
              <div
                key={d.id}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                  d.id === 1
                    ? 'bg-[#152640] border-[#00e0b8]'
                    : 'bg-[#0a1628] border-[rgba(255,255,255,0.06)] hover:border-[#00e0b8]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1 font-mono text-[10px]">
                  <span className="text-[#00e0b8]">{d.shot} · {d.character}</span>
                  <span className="text-[#FFB020]">{d.emotion}</span>
                </div>
                <p className="text-[#e8f0f8] text-[11px] leading-tight line-clamp-2">
                  {d.line}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Waveform & Emotion Controls */}
        <div className="flex-1 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)] p-5 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#e8f0f8]">当前试听：S01-01 叶凌霄内心独白</span>
              <span className="text-xs font-mono text-[#00e0b8]">时长: 02.8s</span>
            </div>

            {/* Simulated Audio Waveform */}
            <div className="h-28 rounded-xl bg-[#0a1628] border border-[rgba(0,224,184,0.2)] p-4 flex items-center justify-center gap-1 relative overflow-hidden">
              <div className="absolute top-2 left-3 text-[10px] font-mono text-[#5c697a]">
                48kHz · 24-bit PCM
              </div>

              {/* Dynamic Waveform Bars */}
              {Array.from({ length: 48 }).map((_, idx) => {
                const height = Math.sin(idx * 0.3) * 35 + 40;
                return (
                  <div
                    key={idx}
                    className="w-1 rounded-full transition-all duration-150"
                    style={{
                      height: `${height}%`,
                      backgroundColor: idx < 20 ? '#00e0b8' : '#152640',
                    }}
                  />
                );
              })}

              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/10 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#00e0b8] text-[#0a1628] flex items-center justify-center font-bold shadow-lg">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </div>
              </button>
            </div>
          </div>

          {/* Emotion Slider (5 Steps) */}
          <div className="p-4 rounded-xl bg-[#0a1628] border border-[rgba(255,255,255,0.06)] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#e8f0f8]">情绪强度滑杆 (Emotion Arc)</span>
              <span className="font-mono text-[#00e0b8] font-bold">
                Level {emotionLevel}: {['极度平静', '冷峻压抑', '克制暗讽', '凌厉杀意', '狂怒爆发'][emotionLevel - 1]}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={emotionLevel}
              onChange={(e) => setEmotionLevel(Number(e.target.value))}
              className="w-full accent-[#00e0b8] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#5c697a] font-mono">
              <span>平静日常</span>
              <span>戏剧对峙</span>
              <span>巅峰高潮</span>
            </div>
          </div>

          {/* Bottom Actions: Sync to Timeline */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-[#8a97a8]">已锁定 A1 轨道实时卡点</span>
            <button
              type="button"
              onClick={() => onNavigate('video')}
              className="px-4 py-2 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>应用并跳转时间线剪辑</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Character-Timbre Binding */}
        <div className="w-72 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)] p-4 space-y-3 shrink-0">
          <span className="text-xs font-bold text-[#e8f0f8] block">角色音色绑定矩阵</span>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-[#0a1628] border border-[rgba(0,224,184,0.2)]">
              <span className="font-bold text-[#e8f0f8] block">叶凌霄</span>
              <span className="text-[11px] text-[#00e0b8]">修真冷傲青年音 (克隆ID: cl_091)</span>
              <span className="text-[10px] text-[#5c697a] block mt-1">语速: 1.05x · 气口补偿 +15ms</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.06)]">
              <span className="font-bold text-[#e8f0f8] block">苏清月</span>
              <span className="text-[11px] text-[#9d7cd8]">高贵冷艳女总裁音 (克隆ID: cl_114)</span>
              <span className="text-[10px] text-[#5c697a] block mt-1">语速: 1.00x · 气口补偿 +10ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceStudioPage;
