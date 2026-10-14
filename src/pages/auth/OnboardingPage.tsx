/**
 * @file: OnboardingPage.tsx
 * @description: 页面组件：OnboardingPage
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import {
  ArrowLeft,
  ArrowRight,
  Cpu,
  HardDrive,
  Layers,
  Smartphone,
  Sparkles,
  Tv
} from 'lucide-react';
import React, { useState } from 'react';
import AuthBrandClock from '../../components/auth/AuthBrandClock';
import AgentAvatar from '../../components/common/AgentAvatar';
import { AGENTS_LIST, AUTH_TOKENS, DEFAULT_AGENT_ID } from '../../tokens';
import { DevModeMeta, PageId, ViewState } from '../../types';

interface OnboardingPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_ONBOARDING: DevModeMeta = {
  apiEndpoint: 'POST /api/auth/onboarding/finalize',
  confidenceSource: '元启·天枢 (多节点资源负载嗅探) + 创想·灵韵 (产出偏好预置模版)',
  memoryScope: 'project',
  learningSampleSource: '新团队初期品类偏好与算力拓扑初始化配置',
  driveModePolicy: '完成向导后自动派生第 1 个演练剧目并无缝进入生产工作台',
  stateSwitchConditions: {
    empty: '向导第 1 步初始欢迎态',
    loading: 'DGX 节点连通性测试与 NAS 挂载卷读写校验中',
    error: '本地 DGX 节点通讯测试失败，提供重试与跳过入口',
    forbidden: '用户已完成初次向导，无需重复配置',
  },
};

export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1); // 1 to 4
  const [contentFormat, setContentFormat] = useState<'vertical' | 'horizontal' | 'both'>('vertical');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['都市', '修真']);
  const [computeMode, setComputeMode] = useState<'dgx' | 'cloud' | 'hybrid'>('dgx');
  const [isFinalizing, setIsFinalizing] = useState(false);

  const genres = ['都市', '古风', '悬疑', '甜宠', '玄幻', '科幻'];

  const toggleGenre = (g: string) => {
    setSelectedGenres((prev) =>
      prev.includes(g) ? prev.filter((i) => i !== g) : [...prev, g]
    );
  };

  const handleFinish = () => {
    setIsFinalizing(true);
    setTimeout(() => {
      onNavigate('dashboard');
    }, 1500);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between p-8 select-none relative overflow-hidden animate-in fade-in duration-200"
      style={{ backgroundColor: AUTH_TOKENS.canvasLeft }}
    >
      {/* Top 4-Segment Progress Bar */}
      <div className="w-full flex flex-col items-center gap-2 pt-2 z-10">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((step) => {
            const isCompleted = currentStep > step;
            const isCurrent = currentStep === step;

            return (
              <div
                key={step}
                className="w-20 h-1 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: isCompleted || isCurrent ? '#00e0b8' : '#152640',
                  boxShadow: isCurrent ? '0 0 8px rgba(0, 224, 184, 0.6)' : undefined,
                }}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-between w-full max-w-2xl px-2 text-xs font-mono text-[#5c697a]">
          <span>步骤 {currentStep} / 4</span>
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="hover:text-white cursor-pointer"
          >
            跳过配置 →
          </button>
        </div>
      </div>

      {/* Main Content Area (Centered, max-w-3xl) */}
      <div className="my-auto w-full max-w-3xl mx-auto z-10">
        {/* ============================================================== */}
        {/* Step 1 · 欢迎                                                 */}
        {/* ============================================================== */}
        {currentStep === 1 && (
          <div className="flex flex-col items-center text-center space-y-6 animate-in zoom-in-95">
            <AuthBrandClock diameter={240} variant="running" activeAgentId={DEFAULT_AGENT_ID} />

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-[#e8f0f8] tracking-tight">
                欢迎加入 YYC³ AI Family
              </h1>
              <p className="text-sm text-[#8a97a8] leading-relaxed max-w-md mx-auto">
                你将拥有 8 个拟人化 AI 伙伴，他们会以 ReAct-C 闭环协同完成从小说到成片的每一步。
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-8 py-3 rounded-xl bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-teal-950/40 flex items-center gap-2"
            >
              <span>开始个性化配置</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* Step 2 · 产出方向偏好                                         */}
        {/* ============================================================== */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-[#e8f0f8]">告诉我们你的漫剧产出方向</h2>
              <p className="text-xs text-[#8a97a8]">我们将预设最匹配的渲染画幅与运镜算法模型</p>
            </div>

            {/* Three Aspect Ratio Options */}
            <div className="grid grid-cols-3 gap-3">
              <div
                onClick={() => setContentFormat('vertical')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${contentFormat === 'vertical'
                    ? 'bg-[#152640] border-[#00e0b8] shadow-lg shadow-teal-950/30'
                    : 'bg-[#0f1e35] border-[rgba(255,255,255,0.06)] hover:border-[#00e0b8]/40'
                  }`}
              >
                <Smartphone className="w-6 h-6 text-[#00e0b8] mb-2" />
                <h3 className="font-bold text-[#e8f0f8] text-xs">竖屏短剧 (9:16)</h3>
                <p className="text-[11px] text-[#8a97a8] mt-1 leading-tight">
                  针对抖音 / 微信视频号 / 快手短剧信息流，黄金 3 秒节奏。
                </p>
              </div>

              <div
                onClick={() => setContentFormat('horizontal')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${contentFormat === 'horizontal'
                    ? 'bg-[#152640] border-[#00e0b8] shadow-lg shadow-teal-950/30'
                    : 'bg-[#0f1e35] border-[rgba(255,255,255,0.06)] hover:border-[#00e0b8]/40'
                  }`}
              >
                <Tv className="w-6 h-6 text-[#00B4D8] mb-2" />
                <h3 className="font-bold text-[#e8f0f8] text-xs">横屏漫剧 (16:9)</h3>
                <p className="text-[11px] text-[#8a97a8] mt-1 leading-tight">
                  针对 B站 / YouTube 影视级叙事长镜头，4K 超清画质。
                </p>
              </div>

              <div
                onClick={() => setContentFormat('both')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${contentFormat === 'both'
                    ? 'bg-[#152640] border-[#00e0b8] shadow-lg shadow-teal-950/30'
                    : 'bg-[#0f1e35] border-[rgba(255,255,255,0.06)] hover:border-[#00e0b8]/40'
                  }`}
              >
                <Layers className="w-6 h-6 text-[#9d7cd8] mb-2" />
                <h3 className="font-bold text-[#e8f0f8] text-xs">两者皆有 (自适应)</h3>
                <p className="text-[11px] text-[#8a97a8] mt-1 leading-tight">
                  支持多画幅并行渲染导出，由知遇·伯乐智能裁剪排布。
                </p>
              </div>
            </div>

            {/* Main Genres Selection */}
            <div className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.06)] space-y-2">
              <span className="text-xs font-bold text-[#e8f0f8] block">主攻漫剧题材 (可多选):</span>
              <div className="flex flex-wrap gap-2">
                {genres.map((g) => {
                  const isSel = selectedGenres.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGenre(g)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${isSel
                          ? 'bg-[#00e0b8] text-[#0a1628] font-bold'
                          : 'bg-[#0a1628] text-[#8a97a8] hover:text-white border border-[rgba(255,255,255,0.08)]'
                        }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.06)]">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 rounded-lg text-[#8a97a8] hover:text-white text-xs inline-flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>上一步</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <span>下一步：连接算力</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* Step 3 · 算力与存储                                           */}
        {/* ============================================================== */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-[#e8f0f8]">连接你的算力与存储中枢</h2>
              <p className="text-xs text-[#8a97a8]">保障单集出片成本 ≤ ¥2.00 与毫秒级文件直读</p>
            </div>

            {/* Compute Selection */}
            <div className="grid grid-cols-3 gap-3">
              <div
                onClick={() => setComputeMode('dgx')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${computeMode === 'dgx'
                    ? 'bg-[#152640] border-[#00e0b8] shadow-lg shadow-teal-950/30'
                    : 'bg-[#0f1e35] border-[rgba(255,255,255,0.06)]'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Cpu className="w-6 h-6 text-[#00e0b8]" />
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                </div>
                <h3 className="font-bold text-[#e8f0f8] text-xs">本地 DGX 集群 (推荐)</h3>
                <p className="text-[11px] text-[#8a97a8] mt-1 leading-tight">
                  yyc3-101 / 102 专有集群，极速 NVENC 硬件直连。
                </p>
              </div>

              <div
                onClick={() => setComputeMode('cloud')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${computeMode === 'cloud'
                    ? 'bg-[#152640] border-[#00e0b8]'
                    : 'bg-[#0f1e35] border-[rgba(255,255,255,0.06)]'
                  }`}
              >
                <Layers className="w-6 h-6 text-[#00B4D8] mb-2" />
                <h3 className="font-bold text-[#e8f0f8] text-xs">弹性云端算力池</h3>
                <p className="text-[11px] text-[#8a97a8] mt-1 leading-tight">
                  按量计费，遇业务爆发自动弹性扩缩容。
                </p>
              </div>

              <div
                onClick={() => setComputeMode('hybrid')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${computeMode === 'hybrid'
                    ? 'bg-[#152640] border-[#00e0b8]'
                    : 'bg-[#0f1e35] border-[rgba(255,255,255,0.06)]'
                  }`}
              >
                <Sparkles className="w-6 h-6 text-[#9d7cd8] mb-2" />
                <h3 className="font-bold text-[#e8f0f8] text-xs">混合调度模式</h3>
                <p className="text-[11px] text-[#8a97a8] mt-1 leading-tight">
                  日间本地 DGX 推理，夜间平电云端错峰渲染。
                </p>
              </div>
            </div>

            {/* NAS Storage Card */}
            <div className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.2)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#152640] flex items-center justify-center text-[#00e0b8]">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#e8f0f8] block">/mnt/nas 统一单一事实源存储</span>
                  <span className="text-[11px] font-mono text-[#8a97a8]">已连接 · 12.4 TB / 24 TB 可用 (52%)</span>
                </div>
              </div>
              <span className="text-xs font-mono text-[#22C55E]">正常挂载</span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.06)]">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 rounded-lg text-[#8a97a8] hover:text-white text-xs inline-flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>上一步</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-6 py-2 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <span>下一步：认识 AI Family</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* Step 4 · 认识你的 AI Family                                   */}
        {/* ============================================================== */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-[#e8f0f8]">认识你的 8 个 AI Family 创作伙伴</h2>
              <p className="text-xs text-[#8a97a8]">视觉平等 · 角色专精 · ReAct-C 九步实时协同</p>
            </div>

            {/* 4x2 Grid of 8 Agents */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {AGENTS_LIST.map((ag) => (
                <div
                  key={ag.id}
                  className="p-3.5 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.06)] hover:border-[#00e0b8] transition-all flex flex-col justify-between h-36 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <AgentAvatar agentId={ag.id} size="sm" />
                    <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#e8f0f8] group-hover:text-[#00e0b8] transition-colors">
                      {ag.name}
                    </h3>
                    <span className="text-[10px] text-[#8a97a8] block">{ag.role}</span>
                  </div>
                  <span className="text-[9px] font-mono text-[#5c697a] truncate block">
                    {ag.desc}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.06)]">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 rounded-lg text-[#8a97a8] hover:text-white text-xs inline-flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>上一步</span>
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="px-8 py-2.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs cursor-pointer shadow-lg shadow-teal-950/40 flex items-center gap-2"
              >
                {isFinalizing ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-[#0a1628] border-t-transparent animate-spin" />
                    <span>产线已就绪，正在进入工作台...</span>
                  </>
                ) : (
                  <>
                    <span>进入生产工作台</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Slogan */}
      <div className="text-center text-xs font-mono text-[#5c697a] z-10">
        YYC³ AI Family · Comic Drama Industrial Production System
      </div>
    </div>
  );
};

export default OnboardingPage;
