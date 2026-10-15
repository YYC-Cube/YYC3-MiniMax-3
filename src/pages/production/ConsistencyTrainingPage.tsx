/**
 * @file: ConsistencyTrainingPage.tsx
 * @description: 页面组件：ConsistencyTrainingPage
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import {
  Cpu,
  History,
  Play,
  Upload
} from 'lucide-react';
import React, { useState } from 'react';
import { assetService, SNAPSHOT, useApiData } from '../../api';
import { EmptyState, ErrorState, LoadingState, NoPermissionState } from '../../components/common/States';
import Thumb from '../../components/common/Thumb';
import { DevModeMeta, PageId, ViewState } from '../../types';

interface ConsistencyTrainingPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_CONSISTENCY: DevModeMeta = {
  apiEndpoint: '/api/v2/production/lora/train/asset-c01',
  confidenceSource: 'FaceID Cosine Vector + LoRA Weight Convergence Loss',
  memoryScope: 'project',
  learningSampleSource: '定妆照与多机位样本特征提取库',
  driveModePolicy: 'LoRA Rank 64 训练需占用 DGX 节点 20 分钟独占资源，任务提交自动进队列',
  stateSwitchConditions: {
    empty: '定妆照数据集不足 8 张，无法开启有效 LoRA 训练',
    loading: 'DGX GB10 正在执行 1200 步 LoRA 权重微调反向传播',
    error: 'CUDA 显存溢出或反向传播梯度爆炸 (GRAD_NAN)',
    forbidden: '用户无模型权重训练与微调参数修改权限',
  },
};

export const ConsistencyTrainingPage: React.FC<ConsistencyTrainingPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const [refStrength, setRefStrength] = useState<number>(82);
  const [loraRank, setLoraRank] = useState<number>(64);
  const [trainSteps, setTrainSteps] = useState<number>(1200);
  const { data: assetsData } = useApiData(assetService.list, SNAPSHOT.assetList);
  const trainingImages = assetsData?.find((a) => a.id === 'asset-c01')?.referenceImages ?? [];

  if (viewState === 'loading') return <LoadingState message="DGX 节点正在执行 LoRA 权重收敛微调 (840/1200 steps)..." />;
  if (viewState === 'empty') return <EmptyState title="样本量不足" description="建议先上传 ≥ 8 张多机位定妆照后再开启 LoRA 训练。" />;
  if (viewState === 'error') return <ErrorState title="LoRA 训练进程异常中断" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无模型权重微调训练权限" />;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#e8f0f8]">角色一致性训练中心</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#00e0b8] border border-[rgba(0,224,184,0.3)]">
              IP-Adapter / LoRA 工业级保持
            </span>
          </div>
          <p className="text-xs text-[#8a97a8] mt-1">
            定妆照 / 角色板多视图训练 · 锁定身份特征向量 · 杜绝产线面部漂移
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('tasks')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#152640] text-[#00e0b8] border border-[rgba(0,224,184,0.25)] text-xs font-medium cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>查看 GPU 任务队列</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('tasks')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs cursor-pointer shadow-lg shadow-teal-950/40"
          >
            <Play className="w-3.5 h-3.5" />
            <span>发起异步训练任务</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Split */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: Character List */}
        <div className="w-full lg:w-60 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)] p-3 space-y-3 lg:shrink-0">
          <span className="text-xs font-bold text-[#e8f0f8] block">角色列表 (带 Ref 标)</span>
          <div className="space-y-2">
            <div className="p-2.5 rounded-lg bg-[#152640] border-l-2 border-[#00e0b8] cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#e8f0f8]">叶凌霄</span>
                <span className="text-[10px] font-mono text-[#22C55E]">94%</span>
              </div>
              <span className="text-[10px] text-[#8a97a8] block">LoRA v3.2 · 已训练</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#0a1628] hover:bg-[#152640]/50 cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#e8f0f8]">苏清月</span>
                <span className="text-[10px] font-mono text-[#FFB020]">88%</span>
              </div>
              <span className="text-[10px] text-[#8a97a8] block">LoRA v2.8 · 需提权</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#0a1628] hover:bg-[#152640]/50 cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#e8f0f8]">陈浩天</span>
                <span className="text-[10px] font-mono text-[#22C55E]">89%</span>
              </div>
              <span className="text-[10px] text-[#8a97a8] block">LoRA v1.4 · 已训练</span>
            </div>
          </div>
        </div>

        {/* Center: Training Console & Dataset Grid */}
        <div className="flex-1 space-y-4">
          {/* Progress Bar Header */}
          <div className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] text-[#8a97a8] block">当前目标一致性得分</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold font-mono text-[#00e0b8]">88%</span>
                <span className="text-xs text-[#8a97a8]">→ 目标</span>
                <span className="text-2xl font-bold font-mono text-[#22C55E]">94%</span>
              </div>
            </div>
            <div className="w-full sm:w-64 space-y-1 shrink-0">
              <div className="flex justify-between text-[10px] text-[#8a97a8] font-mono">
                <span>训练集收敛度</span>
                <span>88%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#0a1628] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#00e0b8] to-[#22C55E]" style={{ width: '88%' }} />
              </div>
            </div>
          </div>

          {/* Training Dataset Grid */}
          <div className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#e8f0f8]">
                训练集多机位定妆照 (12 张)
              </span>
              <button
                type="button"
                className="text-xs text-[#00e0b8] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>补充定妆样本</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {trainingImages.map((img, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden bg-[#0a1628] border border-[rgba(255,255,255,0.08)] relative group">
                  <Thumb src={img} label={`Ref ${i + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1 rounded bg-black/80 text-white">
                    Ref #{i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hyperparameters Card */}
          <div className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)] space-y-3">
            <span className="text-xs font-bold text-[#e8f0f8] block">模型与训练超参数</span>
            <div className="grid grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <span className="text-[#8a97a8] block mb-1">LoRA Rank:</span>
                <select
                  value={loraRank}
                  onChange={(e) => setLoraRank(Number(e.target.value))}
                  className="w-full p-2 rounded bg-[#0a1628] border border-[rgba(255,255,255,0.08)] text-[#00e0b8] focus:outline-none"
                >
                  <option value={32}>Rank 32 (轻量快速)</option>
                  <option value={64}>Rank 64 (推荐标配)</option>
                  <option value={128}>Rank 128 (超高保真)</option>
                </select>
              </div>

              <div>
                <span className="text-[#8a97a8] block mb-1">迭代步数 (Steps):</span>
                <input
                  type="number"
                  value={trainSteps}
                  onChange={(e) => setTrainSteps(Number(e.target.value))}
                  className="w-full p-2 rounded bg-[#0a1628] border border-[rgba(255,255,255,0.08)] text-[#e8f0f8] focus:outline-none"
                />
              </div>

              <div>
                <span className="text-[#8a97a8] block mb-1">学习率 (LR):</span>
                <div className="p-2 rounded bg-[#0a1628] border border-[rgba(255,255,255,0.08)] text-[#8a97a8]">
                  1e-4 (AdamW)
                </div>
              </div>
            </div>
          </div>

          {/* Ref Constraint Strength Slider */}
          <div className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.15)] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#e8f0f8]">
                Ref 约束强度滑杆 (0% – 100%)
              </span>
              <span className="font-mono font-bold text-[#00e0b8] text-sm">
                {refStrength}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={refStrength}
              onChange={(e) => setRefStrength(Number(e.target.value))}
              className="w-full accent-[#00e0b8] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#5c697a] font-mono">
              <span>0% 自由发挥 (易漂移)</span>
              <span>80% 工业级红线</span>
              <span>100% 绝对刚性锁定</span>
            </div>
          </div>
        </div>

        {/* Right: Training History Timeline */}
        <div className="w-full lg:w-72 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)] p-4 space-y-4 lg:shrink-0">
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,255,255,0.06)]">
            <span className="text-xs font-bold text-[#e8f0f8] flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-[#00B4D8]" />
              训练历史版本
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-2.5 rounded-lg bg-[#152640] border border-[rgba(0,224,184,0.3)] space-y-1">
              <div className="flex items-center justify-between font-mono">
                <span className="font-bold text-[#00e0b8]">v2.8 (当前生效)</span>
                <span className="text-[#22C55E]">88%</span>
              </div>
              <span className="text-[10px] text-[#8a97a8] block">Step 1000 · 昨天 16:20</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.06)] space-y-1 opacity-80">
              <div className="flex items-center justify-between font-mono">
                <span className="font-bold text-[#e8f0f8]">v2.0</span>
                <span className="text-[#FFB020]">76%</span>
              </div>
              <span className="text-[10px] text-[#8a97a8] block">Step 600 · 3 天前</span>
              <button
                type="button"
                className="text-[10px] text-[#00B4D8] hover:underline cursor-pointer"
              >
                回滚到此版
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsistencyTrainingPage;
