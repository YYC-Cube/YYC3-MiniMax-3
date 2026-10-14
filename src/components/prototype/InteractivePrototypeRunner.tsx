/**
 * @file: InteractivePrototypeRunner.tsx
 * @description: 组件：InteractivePrototypeRunner
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
  PlayCircle,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Brain,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { PageId } from '../../types';

interface StepSpec {
  title: string;
  targetPage: PageId;
  timeSec: number;
  agent: string;
  description: string;
  actionGuide: string;
}

interface InteractivePrototypeRunnerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageId) => void;
  onOpenCounsel: () => void;
}

export const InteractivePrototypeRunner: React.FC<InteractivePrototypeRunnerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenCounsel,
}) => {
  const [activeTrack, setActiveTrack] = useState<'golden' | 'cognitive'>('golden');
  const [stepIndex, setStepIndex] = useState(0);

  if (!isOpen) return null;

  const goldenPathSteps: StepSpec[] = [
    {
      title: '① 上传剧本与智能立项',
      targetPage: 'script',
      timeSec: 15,
      agent: '言启·千行 + 元启·天枢',
      description: '上传《凌霄剑仙》20万字网文小说或剧本文档，AI 自动抽离角色、场景表与知识图谱。',
      actionGuide: '查看剧本列表，点击「从素材库立项」或进入剧本详情',
    },
    {
      title: '② AI 智能分镜编排',
      targetPage: 'storyboard',
      timeSec: 20,
      agent: '创想·灵韵 + 语枢·万物',
      description: '生成标准 12 字段 Schema 分镜表，绑定角色资产与运镜提示词。',
      actionGuide: '在 12 列分镜表格中查看 S01-01 至 S01-05，观察景别与提示词绑定',
    },
    {
      title: '③ 批量生成控制台',
      targetPage: 'production',
      timeSec: 15,
      agent: '语枢·万物 + 预见·先知',
      description: '通过泳道看板并行生成视频，实时监测 SyncNet 评分与单集算力成本。',
      actionGuide: '查看通过/待定/失败三列泳道分流与单集成本 ≤2 元指示',
    },
    {
      title: '④ 质检门禁看板',
      targetPage: 'qa',
      timeSec: 15,
      agent: '格物·宗师',
      description: '一致性 ≥80% 与口型同步门禁，严格把关产线质量，杜绝劣质出片。',
      actionGuide: '查看身份漂移打回项与角色 Ref 并排对比',
    },
    {
      title: '⑤ 多轨道时间线编辑器',
      targetPage: 'video',
      timeSec: 15,
      agent: '智云·守护 + 知遇·伯乐',
      description: '对标剪映专业版，V1/A1/A2/T1 四轨剪辑，智能粗剪卡点与字幕波形。',
      actionGuide: '体验多轨道播放、片段微调与右侧转场检查器',
    },
    {
      title: '⑥ 一键多端分发与数据回流',
      targetPage: 'publish-board',
      timeSec: 10,
      agent: '知遇·伯乐 + 语枢·万物',
      description: '抖音/视频号/B站多平台自适应发布，播放数据秒级回流，反哺选题。',
      actionGuide: '查看发布矩阵看板与数据反哺生产域闭环',
    },
  ];

  const cognitivePathSteps: StepSpec[] = [
    {
      title: '① 低置信度异常捕获',
      targetPage: 'storyboard',
      timeSec: 15,
      agent: '格物·宗师',
      description: '镜头 S01-04 生成时面部相似度仅 64%，系统置信度仅 0.54，触发阻断。',
      actionGuide: '定位到标红的 S01-04 镜头，观察其置信度条与打回原因',
    },
    {
      title: '② 多 Agent 议事厅仲裁',
      targetPage: 'qa',
      timeSec: 20,
      agent: '格物·宗师 vs 创想·灵韵 → 元启·天枢',
      description: '质检校验主张打回 vs 创意主张保留，元启·天枢提出 LoRA 提权重绘方案。',
      actionGuide: '点击「打开议事厅」，查看两方争辩与天枢仲裁方案',
    },
    {
      title: '③ 采纳并归档 Learning Inbox',
      targetPage: 'admin-agents',
      timeSec: 15,
      agent: '知遇·伯乐',
      description: '人类确认采纳仲裁方案，样本自动进入待审 Learning Inbox，沉淀 Few-shot。',
      actionGuide: '在智能体训练中心查看待审样本卡，进行人工终审入库',
    },
    {
      title: '④ 模型权重提升与复利回流',
      targetPage: 'admin-agents',
      timeSec: 10,
      agent: 'YYC³ AI Family 全员',
      description: '准确率曲线提升，人工干预率下降，实现越用越准复利智能。',
      actionGuide: '查看准确率趋势折线与记忆溯源链',
    },
  ];

  const currentSteps = activeTrack === 'golden' ? goldenPathSteps : cognitivePathSteps;
  const currentStep = currentSteps[stepIndex] || currentSteps[0];

  const goToStep = (idx: number) => {
    if (idx < 0 || idx >= currentSteps.length) return;
    setStepIndex(idx);
    const step = currentSteps[idx];
    onNavigate(step.targetPage);
  };

  return (
    <div
      className="fixed top-18 left-1/2 -translate-x-1/2 w-[760px] z-50 rounded-2xl bg-[#0f1e35] border border-[rgba(0,224,184,0.35)] shadow-2xl p-5 backdrop-blur-xl animate-in slide-in-from-top-4 duration-200"
      style={{
        boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 20px rgba(0,224,184,0.15)',
      }}
    >
      {/* Track Tabs & Close */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[rgba(0,224,184,0.15)] text-[#00e0b8]">
            <PlayCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#e8f0f8]">
              Figma 核心交互演示原型 (Prototype Player)
            </h3>
            <p className="text-xs text-[#8a97a8]">
              可直接向业务方与评审会演示的双闭环全链路交互原型
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-0.5 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.08)] flex items-center">
            <button
              type="button"
              onClick={() => {
                setActiveTrack('golden');
                setStepIndex(0);
                onNavigate('script');
              }}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                activeTrack === 'golden'
                  ? 'bg-[#00e0b8] text-[#0a1628] font-bold'
                  : 'text-[#8a97a8] hover:text-[#e8f0f8]'
              }`}
            >
              90秒 金牌生产路径
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTrack('cognitive');
                setStepIndex(0);
                onNavigate('storyboard');
              }}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                activeTrack === 'cognitive'
                  ? 'bg-[#7B8CFF] text-white font-bold'
                  : 'text-[#8a97a8] hover:text-[#e8f0f8]'
              }`}
            >
              60秒 认知仲裁闭环
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8a97a8] hover:text-[#e8f0f8] hover:bg-[#152640] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step Progress Dots */}
      <div className="flex items-center justify-between gap-2 mb-4">
        {currentSteps.map((step, idx) => {
          const isDone = stepIndex > idx;
          const isCurrent = stepIndex === idx;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => goToStep(idx)}
              className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg text-left transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-[#152640] border border-[rgba(0,224,184,0.4)]'
                  : 'hover:bg-[#0a1628]'
              }`}
            >
              <div className="flex items-center gap-1.5 w-full">
                <span
                  className={`w-4 h-4 rounded-full text-[10px] font-mono flex items-center justify-center font-bold ${
                    isCurrent
                      ? 'bg-[#00e0b8] text-[#0a1628]'
                      : isDone
                      ? 'bg-[#22C55E] text-white'
                      : 'bg-[#0a1628] text-[#8a97a8] border border-[rgba(255,255,255,0.1)]'
                  }`}
                >
                  {isDone ? '✓' : idx + 1}
                </span>
                <span className="text-[11px] font-medium text-[#e8f0f8] truncate">
                  {step.title.split(' ')[1] || step.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Current Step Detail Card */}
      <div className="p-4 rounded-xl bg-[#0a1628] border border-[rgba(255,255,255,0.08)] mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#00e0b8] font-mono">
              STEP {stepIndex + 1}/{currentSteps.length}
            </span>
            <h4 className="text-sm font-bold text-[#e8f0f8]">{currentStep.title}</h4>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#8a97a8]">
            <Sparkles className="w-3.5 h-3.5 text-[#FFB020]" />
            <span>协同: {currentStep.agent}</span>
          </div>
        </div>

        <p className="text-xs text-[#8a97a8] leading-relaxed mb-3">
          {currentStep.description}
        </p>

        <div className="p-2.5 rounded-lg bg-[#152640] border border-[rgba(0,224,184,0.2)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e0b8] animate-ping" />
            <span className="text-xs text-[#e8f0f8] font-medium">
              操作指引：{currentStep.actionGuide}
            </span>
          </div>
          {activeTrack === 'cognitive' && stepIndex === 1 && (
            <button
              type="button"
              onClick={onOpenCounsel}
              className="px-2.5 py-1 rounded bg-[#FFB020] hover:bg-[#e09b18] text-[#0a1628] font-bold text-xs transition-colors cursor-pointer"
            >
              打开议事厅
            </button>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => goToStep(stepIndex - 1)}
          disabled={stepIndex === 0}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs cursor-pointer ${
            stepIndex === 0
              ? 'opacity-30 cursor-not-allowed text-[#8a97a8]'
              : 'bg-[#152640] hover:bg-[#1f3659] text-[#e8f0f8]'
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>上一步</span>
        </button>

        <div className="text-xs text-[#5c697a] font-mono">
          预估耗时: ~{currentStep.timeSec}s
        </div>

        {stepIndex < currentSteps.length - 1 ? (
          <button
            type="button"
            onClick={() => goToStep(stepIndex + 1)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs cursor-pointer shadow-md shadow-teal-950/30"
          >
            <span>下一步</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              goToStep(0);
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#22C55E] hover:bg-[#1ea750] text-white font-bold text-xs cursor-pointer shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重新演示</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default InteractivePrototypeRunner;
