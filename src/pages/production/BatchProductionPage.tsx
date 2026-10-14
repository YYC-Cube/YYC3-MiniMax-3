/**
 * @file: BatchProductionPage.tsx
 * @description: 页面组件：BatchProductionPage
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import {
  RotateCcw,
  Scale
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { assetService, ENDPOINTS, SNAPSHOT, useApiData } from '../../api';
import ConfidenceBadge from '../../components/common/ConfidenceBadge';
import DriveModeSwitch from '../../components/common/DriveModeSwitch';
import { EmptyState, ErrorState, LoadingState, NoPermissionState } from '../../components/common/States';
import Thumb from '../../components/common/Thumb';
import { classifySyncNet, SYNCNET_PASS, SYNCNET_REVIEW_MIN } from '../../domain/rules';
import { DriveModeId } from '../../tokens';
import { BatchItem, DevModeMeta, PageId, ViewState } from '../../types';

interface BatchProductionPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
  driveMode: DriveModeId;
  onDriveModeChange: (mode: DriveModeId) => void;
  onOpenCounsel: () => void;
}

export const DEV_META_PRODUCTION: DevModeMeta = {
  apiEndpoint: ENDPOINTS.batch,
  confidenceSource: 'SyncNet 唇形置信度 + 运动矢量物理合规性 + 宗师质检评分',
  memoryScope: 'session',
  learningSampleSource: '待定列人工复核样本与换种子重试结果',
  driveModePolicy: 'L0 自动将待定列推向后处理；L1 阻塞待定列直至人工打勾；L2 全量预览',
  stateSwitchConditions: {
    empty: '当前无正在运行或排队的批次生成任务',
    loading: 'DGX GB10 vLLM 正在并行生成 36 个分镜批次',
    error: 'DGX 推理集群 CUDA 内存不足 (OOM 503)',
    forbidden: '用户无算力队列调度与批量提交权限',
  },
};

export const BatchProductionPage: React.FC<BatchProductionPageProps> = ({
  onNavigate,
  viewState = 'normal',
  driveMode,
  onDriveModeChange,
  onOpenCounsel,
}) => {
  const [activeStep, setActiveStep] = useState<number>(3); // 1: Select, 2: Params, 3: Swimlane Board
  const { data: batchData, loading } = useApiData(assetService.batchItems, SNAPSHOT.batchItems);
  const [items, setItems] = useState<BatchItem[]>([]);
  useEffect(() => {
    if (batchData) setItems(batchData);
  }, [batchData]);
  const [motionStrength, setMotionStrength] = useState(0.7);

  if (viewState === 'loading') return <LoadingState message="DGX 双节点 vLLM 正在批量并行生成 36 个镜头..." />;
  if (viewState === 'empty') return <EmptyState title="当前没有正在生成的批次" actionText="提交第一批生成" onAction={() => setActiveStep(1)} />;
  if (viewState === 'error') return <ErrorState title="算力生成集群通信异常" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无批量生成控制权限" />;
  if (loading) return <LoadingState message="DGX 双节点 vLLM 正在批量并行生成 36 个镜头..." />;

  const passedItems = items.filter((i) => i.status === 'passed');
  const reviewItems = items.filter((i) => i.status === 'review');
  const failedItems = items.filter((i) => i.status === 'failed');

  const totalCost = items.reduce((acc, cur) => acc + cur.costEstimated, 0);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header & 3-Step Wizard Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.15)]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-[#e8f0f8]">批量生成任务台</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#00e0b8] border border-[rgba(0,224,184,0.3)]">
              即梦 API / DGX 并行
            </span>
          </div>

          {/* 3 Step Indicator */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
            <span className={activeStep >= 1 ? 'text-[#00e0b8] font-bold' : 'text-[#5c697a]'}>
              ① 选分镜 (36镜)
            </span>
            <span className="text-[#5c697a]">→</span>
            <span className={activeStep >= 2 ? 'text-[#00e0b8] font-bold' : 'text-[#5c697a]'}>
              ② 参数预设
            </span>
            <span className="text-[#5c697a]">→</span>
            <span className={activeStep >= 3 ? 'text-[#00e0b8] font-bold' : 'text-[#5c697a]'}>
              ③ 批次看板 (运行中)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#5c697a]">驾驶模式:</span>
            <DriveModeSwitch currentMode={driveMode} onChange={onDriveModeChange} size="sm" />
          </div>

          <button
            type="button"
            onClick={onOpenCounsel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(255,176,32,0.15)] hover:bg-[rgba(255,176,32,0.25)] text-[#FFB020] border border-[rgba(255,176,32,0.3)] text-xs font-bold cursor-pointer"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Agent 议事厅 (1 处冲突)</span>
          </button>
        </div>
      </div>

      {/* Batch Summary Bar & Single Episode Cost Tracker (≤ 2 RMB North Star) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)]">
        <div>
          <span className="text-[11px] text-[#8a97a8] block">批次总镜头</span>
          <span className="text-xl font-bold font-mono text-[#e8f0f8]">
            36 <span className="text-xs text-[#8a97a8]">镜 (已产出 {items.length})</span>
          </span>
        </div>
        <div>
          <span className="text-[11px] text-[#8a97a8] block">质检通过率</span>
          <span className="text-xl font-bold font-mono text-[#22C55E]">
            {((passedItems.length / items.length) * 100).toFixed(0)}%
          </span>
        </div>
        <div>
          <span className="text-[11px] text-[#8a97a8] block">SyncNet 均分</span>
          <span className="text-xl font-bold font-mono text-[#00B4D8]">
            0.76 <span className="text-[10px] text-[#22C55E]">(≥{SYNCNET_PASS} 达标)</span>
          </span>
        </div>
        <div>
          <span className="text-[11px] text-[#8a97a8] block">预计剩余时间</span>
          <span className="text-xl font-bold font-mono text-[#FFB020]">01m 24s</span>
        </div>
        <div>
          <span className="text-[11px] text-[#8a97a8] block flex items-center justify-between">
            <span>单集预估成本</span>
            <span className="text-[10px] text-[#00e0b8]">标杆 ≤ ¥2.00</span>
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-bold font-mono text-[#00e0b8]">
              ¥ {totalCost.toFixed(4)}
            </span>
            <span className="text-[10px] text-[#22C55E]">（降本 99.9%）</span>
          </div>
        </div>
      </div>

      {/* Swimlane View: 3 Columns（阈值单源 domain/rules） */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[460px]">
        {/* Lane 1: Passed (绿) */}
        <div className="rounded-xl bg-[#0f1e35] border border-[rgba(34,197,94,0.25)] flex flex-col overflow-hidden">
          <div className="p-3 bg-[#152640] border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
              <h3 className="text-xs font-bold text-[#e8f0f8]">
                质检通过 (评分 ≥ {SYNCNET_PASS})
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#22C55E]">
              {passedItems.length} 镜
            </span>
          </div>

          <div className="p-3 flex-1 overflow-y-auto space-y-3">
            {passedItems.map((item) => (
              <div
                key={item.shotId}
                className="p-3 rounded-xl bg-[#0a1628] border border-[rgba(255,255,255,0.06)] hover:border-[#22C55E] transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-[#00e0b8]">
                    {item.shotNumber}
                  </span>
                  <ConfidenceBadge confidence={item.confidence} size="sm" />
                </div>

                <div className="aspect-video rounded-lg overflow-hidden bg-[#152640] relative">
                  <Thumb src={item.thumbnail} label={item.shotNumber} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1 rounded bg-black/80 text-white">
                    {item.duration}s
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#8a97a8]">SyncNet: <strong className="text-[#22C55E]">{item.syncNetScore}</strong></span>
                  <span className="text-[#5c697a]">耗时 {item.renderTime}s</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lane 2: Review (橙 - 需人工裁决) */}
        <div className="rounded-xl bg-[#0f1e35] border border-[rgba(255,176,32,0.3)] flex flex-col overflow-hidden">
          <div className="p-3 bg-[#152640] border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFB020] animate-pulse" />
              <h3 className="text-xs font-bold text-[#e8f0f8]">
                待定复核 ({SYNCNET_REVIEW_MIN} – {SYNCNET_PASS})
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#FFB020]">
              {reviewItems.length} 镜
            </span>
          </div>

          <div className="p-3 flex-1 overflow-y-auto space-y-3">
            {reviewItems.map((item) => (
              <div
                key={item.shotId}
                className="p-3 rounded-xl bg-[#0a1628] border border-[rgba(255,176,32,0.3)] hover:border-[#FFB020] transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-[#FFB020]">
                    {item.shotNumber}
                  </span>
                  <ConfidenceBadge confidence={item.confidence} size="sm" />
                </div>

                <div className="aspect-video rounded-lg overflow-hidden bg-[#152640] relative">
                  <Thumb src={item.thumbnail} label={item.shotNumber} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1 rounded bg-black/80 text-white">
                    {item.duration}s
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#8a97a8]">SyncNet: <strong className="text-[#FFB020]">{item.syncNetScore}</strong></span>
                  <span className="text-[#5c697a]">耗时 {item.renderTime}s</span>
                </div>

                {/* Human Quick Action */}
                <div className="flex items-center gap-2 pt-2 border-t border-[rgba(255,255,255,0.06)]">
                  <button
                    type="button"
                    onClick={() => {
                      setItems((prev) =>
                        prev.map((i) =>
                          i.shotId === item.shotId ? { ...i, status: 'passed' } : i
                        )
                      );
                    }}
                    className="flex-1 py-1 rounded bg-[#22C55E]/15 hover:bg-[#22C55E]/25 text-[#22C55E] text-[11px] font-bold cursor-pointer"
                  >
                    人工放行
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setItems((prev) =>
                        prev.map((i) =>
                          i.shotId === item.shotId ? { ...i, status: 'failed' } : i
                        )
                      );
                    }}
                    className="flex-1 py-1 rounded bg-[#ff4422]/15 hover:bg-[#ff4422]/25 text-[#ff4422] text-[11px] font-bold cursor-pointer"
                  >
                    打回重绘
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lane 3: Failed (红 - 换种子重试) */}
        <div className="rounded-xl bg-[#0f1e35] border border-[rgba(255,68,34,0.3)] flex flex-col overflow-hidden">
          <div className="p-3 bg-[#152640] border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff4422]" />
              <h3 className="text-xs font-bold text-[#e8f0f8]">
                失败打回 (评分 &lt; {SYNCNET_REVIEW_MIN})
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#ff4422]">
              {failedItems.length} 镜
            </span>
          </div>

          <div className="p-3 flex-1 overflow-y-auto space-y-3">
            {failedItems.map((item) => (
              <div
                key={item.shotId}
                className="p-3 rounded-xl bg-[#0a1628] border border-[rgba(255,68,34,0.3)] hover:border-[#ff4422] transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-[#ff4422]">
                    {item.shotNumber}
                  </span>
                  <ConfidenceBadge confidence={item.confidence} size="sm" />
                </div>

                <div className="aspect-video rounded-lg overflow-hidden bg-[#152640] relative">
                  <Thumb src={item.thumbnail} label={item.shotNumber} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-red-950/50 p-2 flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold bg-black/70 px-2 py-0.5 rounded">
                      一致性低于 80% 红线
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#ff4422]">SyncNet: {item.syncNetScore}</span>
                  <button
                    type="button"
                    onClick={onOpenCounsel}
                    className="text-[10px] text-[#FFB020] hover:underline cursor-pointer"
                  >
                    议事厅仲裁 →
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[rgba(255,255,255,0.06)]">
                  <button
                    type="button"
                    onClick={() => {
                      setItems((prev) =>
                        prev.map((i) =>
                          i.shotId === item.shotId
                            ? { ...i, status: classifySyncNet(0.81), syncNetScore: 0.81, confidence: 0.91 }
                            : i
                        )
                      );
                    }}
                    className="w-full py-1 rounded bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-[11px] transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>一键换种子重试 (Seed +1)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchProductionPage;
