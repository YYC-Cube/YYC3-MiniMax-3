/**
 * @file: QualityAssurancePage.tsx
 * @description: 页面组件：QualityAssurancePage
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import {
  AlertTriangle,
  CheckCircle2,
  Inbox,
  Scale
} from 'lucide-react';
import React, { useState } from 'react';
import { assetService, SNAPSHOT, storyboardService, useApiData } from '../../api';
import ConfidenceBadge from '../../components/common/ConfidenceBadge';
import { ErrorState, LoadingState, NoPermissionState } from '../../components/common/States';
import Thumb from '../../components/common/Thumb';
import { REF_CONSISTENCY_PASS, SYNCNET_PASS } from '../../domain/rules';
import { DevModeMeta, PageId, ViewState } from '../../types';

interface QualityAssurancePageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
  onOpenCounsel: () => void;
}

export const DEV_META_QA: DevModeMeta = {
  apiEndpoint: '/api/v2/production/qa/evaluations/batch-091',
  confidenceSource: '格物·宗师 (质量门禁) + 智云·守护 (安全审计脱敏)',
  memoryScope: 'project',
  learningSampleSource: '复检未通过样本直接推送至 Learning Inbox',
  driveModePolicy: '质检评分 <80 分一律强制拦截；禁止提供无确认快捷放行通道',
  stateSwitchConditions: {
    empty: '本批次全镜直通！无可复检或打回的问题镜头',
    loading: '格物·宗师 正在执行高维多模态视觉比对与 SyncNet 对齐',
    error: '质检模型推理异常或特征基准向量丢失',
    forbidden: '用户无终审质检放行与打回仲裁权',
  },
};

export const QualityAssurancePage: React.FC<QualityAssurancePageProps> = ({
  onNavigate,
  viewState = 'normal',
  onOpenCounsel,
}) => {
  const [activeTab, setActiveTab] = useState<'consistency' | 'syncnet' | 'style'>('consistency');
  const [selectedShotId, setSelectedShotId] = useState('S01-04');
  const [inboxChecked, setInboxChecked] = useState(true);
  const { data: shotsData } = useApiData(storyboardService.list, SNAPSHOT.shotList);
  const { data: assetsData } = useApiData(assetService.list, SNAPSHOT.assetList);
  // 生成画面派生自分镜域（S01-04 缩略图）；RefCard 基准派生自资产域（asset-c02 苏清月）
  const problemShotThumb = shotsData?.find((s) => s.shotNumber === selectedShotId)?.thumbnailUrl;
  const refCardThumb = assetsData?.find((a) => a.id === 'asset-c02')?.previewUrl;

  if (viewState === 'loading') return <LoadingState message="格物·宗师 正在执行严格多模态质检与唇形对齐..." />;
  if (viewState === 'empty') {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center rounded-2xl bg-[#0f1e35] border border-[rgba(34,197,94,0.3)] my-6">
        <div className="w-16 h-16 rounded-2xl bg-[rgba(34,197,94,0.15)] text-[#22C55E] flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-[#e8f0f8] mb-1">本批次全镜直通！</h3>
        <p className="text-xs text-[#8a97a8] max-w-md mb-4">
          所有 36 个镜头的一致性评分均 ≥{REF_CONSISTENCY_PASS}%，SyncNet ≥{SYNCNET_PASS}，无物理与画风畸变，可直接交付成片。
        </p>
        <button
          type="button"
          onClick={() => onNavigate('video')}
          className="px-4 py-2 rounded-lg bg-[#00e0b8] text-[#0a1628] font-bold text-xs"
        >
          前往多轨时间线剪辑 →
        </button>
      </div>
    );
  }
  if (viewState === 'error') return <ErrorState title="质检服务判定超时" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无质检放行与裁决权限" />;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header & QA Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.15)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-[#e8f0f8]">质检门禁看板 (Quality Assurance Gate)</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[rgba(255,68,34,0.15)] text-[#ff4422] border border-[rgba(255,68,34,0.3)] font-bold">
              工业红线：&lt;80 一律打回
            </span>
          </div>
          <p className="text-xs text-[#8a97a8] mt-0.5">
            格物·宗师 严控产线质量 · 复检 ≤2 轮红线预警 · 全操作可追溯
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenCounsel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(255,176,32,0.15)] hover:bg-[rgba(255,176,32,0.25)] text-[#FFB020] border border-[rgba(255,176,32,0.3)] text-xs font-bold cursor-pointer"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>进入多 Agent 议事厅</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards for QA Batch */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)]">
          <span className="text-xs text-[#8a97a8] block">本批次通过率</span>
          <span className="text-2xl font-bold font-mono text-[#22C55E]">94.4%</span>
          <span className="text-[10px] text-[#5c697a] block mt-1">34/36 镜一次通过</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0f1e35] border border-[rgba(255,68,34,0.25)]">
          <span className="text-xs text-[#ff4422] block">待裁决问题镜头</span>
          <span className="text-2xl font-bold font-mono text-[#ff4422]">1</span>
          <span className="text-[10px] text-[#8a97a8] block mt-1">S01-04 身份漂移</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)]">
          <span className="text-xs text-[#8a97a8] block">复检轮次分布</span>
          <span className="text-2xl font-bold font-mono text-[#00B4D8]">第 1 轮</span>
          <span className="text-[10px] text-[#22C55E] block mt-1">符合 ≤2 轮红线</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)]">
          <span className="text-xs text-[#8a97a8] block">人工终审介入</span>
          <span className="text-2xl font-bold font-mono text-[#FFB020]">1 次</span>
          <span className="text-[10px] text-[#5c697a] block mt-1">干预率 2.7% (持续走低)</span>
        </div>
      </div>

      {/* Main Split: Left Problem Shot Lanes, Right Side-by-Side Adjudication Panel */}
      <div className="flex gap-4">
        {/* Left: Problem Shot Lanes */}
        <div className="w-1/2 rounded-xl bg-[#0f1e35] border border-[rgba(255,68,34,0.25)] p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,255,255,0.06)]">
            <span className="text-xs font-bold text-[#e8f0f8] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#ff4422]" />
              打回问题镜头列表
            </span>
            <span className="text-[11px] font-mono text-[#ff4422]">1 项待人工裁决</span>
          </div>

          {/* Problem Card S01-04 */}
          <div
            onClick={() => setSelectedShotId('S01-04')}
            className="p-3.5 rounded-xl bg-[#0a1628] border-2 border-[#ff4422] shadow-lg shadow-red-950/20 cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-[#e8f0f8]">
                S01-04 苏清月阻拦特写
              </span>
              <ConfidenceBadge confidence={0.54} size="sm" />
            </div>

            <div className="flex gap-3">
              <div className="w-24 h-16 rounded-lg overflow-hidden bg-[#152640] shrink-0 border border-red-500/30">
                <Thumb
                  src={problemShotThumb}
                  label="S01-04"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs space-y-1">
                <div className="text-[#ff4422] font-bold">
                  扣分项: 面部相似度 64% (低于 80% 阈值)
                </div>
                <p className="text-[#8a97a8] text-[11px] leading-snug">
                  AI 诊断：眼神呈现过度柔弱，缺失“冷面女总裁”核心威仪，且礼服反光与场景灯光产生 14% 偏色。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Side-by-Side Adjudication Inspector */}
        <div className="w-1/2 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.15)] p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,255,255,0.06)]">
              <div>
                <span className="text-xs font-bold text-[#e8f0f8]">
                  S01-04 视觉对比裁决面板
                </span>
                <span className="text-[10px] text-[#8a97a8] block">
                  生成图 vs 角色 RefCard 并排比对
                </span>
              </div>
              <ConfidenceBadge confidence={0.54} size="sm" />
            </div>

            {/* Side-by-Side Visual Comparison */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] font-mono text-[#ff4422] block mb-1">
                  当前生成画面 (相似度 64%)
                </span>
                <div className="aspect-square rounded-lg overflow-hidden bg-[#0a1628] border-2 border-[#ff4422]">
                  <Thumb
                    src={problemShotThumb}
                    label="生成画面"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-[#00e0b8] block mb-1">
                  苏清月 RefCard (标准基准 100%)
                </span>
                <div className="aspect-square rounded-lg overflow-hidden bg-[#0a1628] border-2 border-[#00e0b8]">
                  <Thumb
                    src={refCardThumb}
                    label="RefCard"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Arbiter Recommendation */}
            <div className="p-3 rounded-lg bg-[#0a1628] border border-[rgba(0,224,184,0.2)] text-xs space-y-1">
              <span className="font-bold text-[#00e0b8] block">格物·宗师 裁决建议:</span>
              <p className="text-[#8a97a8] leading-relaxed text-[11px]">
                建议提权 LoRA Ref 权重至 0.82，锁定眼神高光形态，进行单帧局域重绘（预计耗时 12s）。
              </p>
            </div>

            <label className="flex items-center gap-1.5 text-xs text-[#8a97a8] cursor-pointer">
              <input
                type="checkbox"
                checked={inboxChecked}
                onChange={(e) => setInboxChecked(e.target.checked)}
                className="rounded border-[rgba(0,224,184,0.3)] text-[#00e0b8]"
              />
              <Inbox className="w-3.5 h-3.5 text-[#B57BFF]" />
              <span>裁决结果同步归档至 Learning Inbox 作为少样本参考</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onOpenCounsel}
              className="flex-1 py-2 rounded-lg bg-[rgba(255,176,32,0.15)] hover:bg-[rgba(255,176,32,0.25)] text-[#FFB020] border border-[rgba(255,176,32,0.3)] font-bold text-xs transition-colors cursor-pointer"
            >
              发起议事厅争辩
            </button>
            <button
              type="button"
              onClick={() => onNavigate('production')}
              className="flex-1 py-2 rounded-lg bg-[#ff4422] hover:bg-[#e03818] text-white font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-red-950/40"
            >
              打回立即重生成
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityAssurancePage;
