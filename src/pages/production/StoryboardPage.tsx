/**
 * @file: StoryboardPage.tsx
 * @description: 页面组件：StoryboardPage
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
  ArrowRight,
  Box,
  Layers,
  LayoutGrid,
  Play,
  RotateCw,
  Shield,
  Table
} from 'lucide-react';
import React, { useState } from 'react';
import { ENDPOINTS, SNAPSHOT, storyboardService, useApiData } from '../../api';
import BatchActionBar from '../../components/common/BatchActionBar';
import ConfidenceBadge from '../../components/common/ConfidenceBadge';
import { EmptyState, ErrorState, LoadingState, NoPermissionState } from '../../components/common/States';
import Thumb from '../../components/common/Thumb';
import { DevModeMeta, PageId, ViewState } from '../../types';

interface StoryboardPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
  onOpenCounsel: () => void;
}

export const DEV_META_STORYBOARD: DevModeMeta = {
  apiEndpoint: ENDPOINTS.storyboards,
  confidenceSource: '格物·宗师 (质量与一致性预估) + 创想·灵韵 (运镜提示词评分)',
  memoryScope: 'project',
  learningSampleSource: '分镜打回样本与专家重修提示词自动入库',
  driveModePolicy: '置信度 < 0.6 强制标红并拦截提交；≥0.9 允许一键直通批量生成',
  stateSwitchConditions: {
    empty: '当前剧本尚未拆解生成任何分镜镜头',
    loading: '创想·灵韵 正在并发解构 26 镜头运镜机位与 12 字段 Schema',
    error: '分镜提示词编译器超时或角色绑定反向引用失效',
    forbidden: '用户无分镜导演与提示词编辑修改权限',
  },
};

export const StoryboardPage: React.FC<StoryboardPageProps> = ({
  onNavigate,
  viewState = 'normal',
  onOpenCounsel,
}) => {
  const [activeTab, setActiveTab] = useState<'table' | 'canvas' | '3d'>('table');
  const { data: shotsData, loading } = useApiData(storyboardService.list, SNAPSHOT.shotList);
  const shots = shotsData ?? [];
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [inspectedId, setInspectedId] = useState<string | null>(null);
  // 默认聚焦 S01-04（打回拦截演示项），与原 MOCK_SHOTS[3] 行为一致
  const inspectedShot = (
    inspectedId ? shots.find((s) => s.id === inspectedId) : shots.find((s) => s.id === 'S01-04')
  ) ?? null;
  const [narrativeMode, setNarrativeMode] = useState<'标准' | '紧凑' | '电影感'>('标准');

  if (viewState === 'loading') return <LoadingState message="创想·灵韵 正在构建 12 字段分镜矩阵与运镜提示词..." />;
  if (viewState === 'empty') return <EmptyState title="当前剧本尚未生成分镜" actionText="启动 AI 创想·灵韵 拆解分镜" />;
  if (viewState === 'error') return <ErrorState title="分镜生成服务返回异常" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无分镜设计器编辑权限" />;
  if (loading) return <LoadingState message="创想·灵韵 正在构建 12 字段分镜矩阵与运镜提示词..." />;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === shots.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(shots.map((s) => s.id));
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.15)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-[#e8f0f8]">分镜设计器</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#00e0b8] border border-[rgba(0,224,184,0.3)]">
              12 字段 Schema
            </span>
          </div>

          {/* Mode Tabs: Table / Canvas / 3D */}
          <div className="flex items-center p-0.5 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.08)]">
            <button
              type="button"
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-all ${activeTab === 'table'
                ? 'bg-[#00e0b8] text-[#0a1628] font-bold shadow-sm'
                : 'text-[#8a97a8] hover:text-[#e8f0f8]'
                }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>表格模式</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('canvas')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-all ${activeTab === 'canvas'
                ? 'bg-[#00e0b8] text-[#0a1628] font-bold shadow-sm'
                : 'text-[#8a97a8] hover:text-[#e8f0f8]'
                }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>画布节点流</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('storyboard-3d')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium text-[#8a97a8] hover:text-[#e8f0f8] cursor-pointer"
            >
              <Box className="w-3.5 h-3.5 text-[#00B4D8]" />
              <span>3D 导演视角</span>
            </button>
          </div>
        </div>

        {/* Narrative Mode & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#8a97a8]">
            <span>叙事节奏:</span>
            <div className="flex items-center p-0.5 rounded bg-[#0a1628] border border-[rgba(255,255,255,0.08)]">
              {(['紧凑', '标准', '电影感'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setNarrativeMode(m)}
                  className={`px-2 py-0.5 text-[11px] rounded cursor-pointer ${narrativeMode === m
                    ? 'bg-[#152640] text-[#00e0b8] font-bold'
                    : 'text-[#8a97a8] hover:text-white'
                    }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('production')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs cursor-pointer shadow-md shadow-teal-950/40"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>进入批量生成任务台</span>
          </button>
        </div>
      </div>

      {/* Mode A: Table Mode (12-Column Schema) */}
      {activeTab === 'table' && (
        <div className="flex gap-4">
          {/* Main 12-Column Table */}
          <div className="flex-1 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)] overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                <thead>
                  <tr className="bg-[#152640] text-[#8a97a8] border-b border-[rgba(255,255,255,0.08)]">
                    <th className="p-2.5 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === shots.length && shots.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-[rgba(0,224,184,0.3)] text-[#00e0b8] cursor-pointer"
                      />
                    </th>
                    <th className="p-2.5 font-semibold">镜头号</th>
                    <th className="p-2.5 font-semibold">缩略图</th>
                    <th className="p-2.5 font-semibold">景别</th>
                    <th className="p-2.5 font-semibold">运镜</th>
                    <th className="p-2.5 font-semibold max-w-xs">画面描述</th>
                    <th className="p-2.5 font-semibold">角色</th>
                    <th className="p-2.5 font-semibold">场景</th>
                    <th className="p-2.5 font-semibold font-mono">时长</th>
                    <th className="p-2.5 font-semibold">一致性分</th>
                    <th className="p-2.5 font-semibold">置信度</th>
                    <th className="p-2.5 font-semibold">状态</th>
                    <th className="p-2.5 font-semibold text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                  {shots.map((shot) => {
                    const isSelected = selectedIds.includes(shot.id);
                    const isInspected = inspectedShot?.id === shot.id;
                    const isRejected = shot.status === 'rejected';

                    return (
                      <tr
                        key={shot.id}
                        onClick={() => setInspectedId(shot.id)}
                        className={`hover:bg-[#152640]/70 transition-colors cursor-pointer ${isInspected ? 'bg-[#152640]/60' : ''
                          } ${isRejected ? 'bg-[rgba(255,68,34,0.06)]' : ''}`}
                      >
                        <td className="p-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(shot.id)}
                            className="rounded border-[rgba(0,224,184,0.3)] text-[#00e0b8] cursor-pointer"
                          />
                        </td>
                        <td className="p-2.5 font-mono font-bold text-[#e8f0f8]">
                          {shot.shotNumber}
                        </td>
                        <td className="p-2.5">
                          <div className="w-12 h-8 rounded bg-[#0a1628] border border-[rgba(255,255,255,0.1)] overflow-hidden">
                            <Thumb src={shot.thumbnailUrl} label={shot.shotNumber} className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="p-2.5">
                          <span className="px-1.5 py-0.5 rounded bg-[#152640] text-[#00B4D8] font-mono text-[11px]">
                            {shot.shotSize}
                          </span>
                        </td>
                        <td className="p-2.5 text-[#8a97a8]">{shot.cameraMove}</td>
                        <td className="p-2.5 max-w-[240px] truncate text-[#e8f0f8]">
                          {shot.visualDesc}
                        </td>
                        <td className="p-2.5 text-[#00e0b8] font-medium">{shot.character}</td>
                        <td className="p-2.5 text-[#8a97a8]">{shot.scene}</td>
                        <td className="p-2.5 font-mono tabular-nums text-[#8a97a8]">
                          {shot.durationSec}s
                        </td>
                        <td className="p-2.5">
                          <span
                            className={`font-mono text-xs font-bold ${shot.consistencyScore >= 80 ? 'text-[#22C55E]' : 'text-[#ff4422]'
                              }`}
                          >
                            {shot.consistencyScore}%
                          </span>
                        </td>
                        <td className="p-2.5">
                          <ConfidenceBadge confidence={shot.confidence} size="sm" />
                        </td>
                        <td className="p-2.5">
                          {shot.status === 'passed' && (
                            <span className="px-2 py-0.5 rounded bg-[#22C55E]/15 text-[#22C55E] font-medium text-[11px]">
                              已通过
                            </span>
                          )}
                          {shot.status === 'rejected' && (
                            <span
                              className="px-2 py-0.5 rounded bg-[#ff4422]/20 text-[#ff4422] font-bold text-[11px] animate-pulse"
                              title={shot.rejectReason}
                            >
                              打回拦截
                            </span>
                          )}
                          {shot.status === 'generating' && (
                            <span className="px-2 py-0.5 rounded bg-[#00e0b8]/15 text-[#00e0b8] font-mono text-[11px] flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00e0b8] animate-ping" />
                              生成中
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {shot.status === 'rejected' && (
                              <button
                                type="button"
                                onClick={onOpenCounsel}
                                className="px-2 py-1 rounded bg-[rgba(255,68,34,0.15)] hover:bg-[rgba(255,68,34,0.3)] text-[#ff4422] font-bold text-[11px] cursor-pointer"
                              >
                                仲裁
                              </button>
                            )}
                            <button
                              type="button"
                              className="px-2 py-1 rounded bg-[#0a1628] hover:bg-[#152640] text-[#00e0b8] text-[11px] cursor-pointer"
                            >
                              重绘
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Inspector: Inspected Shot Details */}
          {inspectedShot && (
            <div className="w-88 shrink-0 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.15)] p-4 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,255,255,0.06)]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-mono text-[#00e0b8]">
                      {inspectedShot.shotNumber} 镜头详情
                    </span>
                    <ConfidenceBadge confidence={inspectedShot.confidence} size="sm" />
                  </div>
                  <span className="text-xs text-[#8a97a8]">{inspectedShot.shotSize} · {inspectedShot.cameraMove}</span>
                </div>

                {/* Preview Image with Status Overlay */}
                <div className="relative aspect-video rounded-xl bg-[#0a1628] border border-[rgba(255,255,255,0.1)] overflow-hidden group">
                  <Thumb
                    src={inspectedShot.thumbnailUrl}
                    label={inspectedShot.shotNumber}
                    className="w-full h-full object-cover"
                  />
                  {inspectedShot.status === 'rejected' && (
                    <div className="absolute inset-0 bg-red-950/60 p-3 flex flex-col justify-between text-xs backdrop-blur-xs">
                      <div className="flex items-center gap-1.5 text-[#ff4422] font-bold">
                        <AlertTriangle className="w-4 h-4" />
                        <span>格物·宗师 质检打回</span>
                      </div>
                      <p className="text-[11px] text-[#e8f0f8] bg-black/60 p-2 rounded leading-snug">
                        {inspectedShot.rejectReason}
                      </p>
                    </div>
                  )}
                </div>

                {/* Prompt Editor */}
                <div>
                  <span className="text-[11px] font-bold text-[#8a97a8] uppercase tracking-wider block mb-1">
                    运镜正向提示词 (Prompt)
                  </span>
                  <textarea
                    rows={3}
                    defaultValue={inspectedShot.prompt}
                    className="w-full p-2.5 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.08)] text-xs text-[#e8f0f8] font-mono focus:border-[#00e0b8] focus:outline-none"
                  />
                </div>

                {/* Character Ref Binding */}
                <div>
                  <span className="text-[11px] font-bold text-[#8a97a8] uppercase tracking-wider block mb-1">
                    绑定资产与 Ref 约束
                  </span>
                  <div className="p-2.5 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#e8f0f8] block">{inspectedShot.character}</span>
                      <span className="text-[10px] text-[#8a97a8]">RefCard v2.8 (女总裁晚宴装)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate('assets-consistency')}
                      className="text-[10px] text-[#00e0b8] hover:underline cursor-pointer"
                    >
                      调整权重 →
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] space-y-2">
                {inspectedShot.status === 'rejected' ? (
                  <button
                    type="button"
                    onClick={onOpenCounsel}
                    className="w-full py-2 rounded-lg bg-[#ff4422] hover:bg-[#e03818] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-red-950/40"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>发起议事厅冲突仲裁 (P04 触发点)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="w-full py-2 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs transition-colors cursor-pointer"
                  >
                    重新生成单镜
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode B: Canvas Graph Node Flow */}
      {activeTab === 'canvas' && (
        <div className="rounded-xl bg-[#0a1628] border border-[rgba(0,224,184,0.15)] p-6 min-h-[520px] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00e0b8]">横向镜头节点流 (Graph Canvas)</span>
              <span className="text-xs text-[#8a97a8]">支持拖拽连线与批量重排</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-2.5 py-1 rounded bg-[#152640] text-xs text-[#8a97a8] hover:text-white cursor-pointer"
              >
                统一画风预设
              </button>
              <button
                type="button"
                className="px-2.5 py-1 rounded bg-[#152640] text-xs text-[#8a97a8] hover:text-white cursor-pointer"
              >
                自动卡点重排
              </button>
            </div>
          </div>

          {/* Node Cards Row with Arrows */}
          <div className="flex items-center gap-4 overflow-x-auto py-6">
            {shots.map((shot, idx) => (
              <React.Fragment key={shot.id}>
                <div
                  onClick={() => setInspectedId(shot.id)}
                  className={`w-52 rounded-xl bg-[#0f1e35] border transition-all p-3 cursor-pointer shrink-0 hover:scale-102 ${inspectedShot?.id === shot.id
                    ? 'border-[#00e0b8] shadow-lg shadow-teal-950/40'
                    : shot.status === 'rejected'
                      ? 'border-[#ff4422]'
                      : 'border-[rgba(255,255,255,0.08)]'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-xs text-[#00e0b8]">
                      {shot.shotNumber}
                    </span>
                    <ConfidenceBadge confidence={shot.confidence} size="sm" showValue={false} />
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden bg-[#0a1628] mb-2 relative">
                    <Thumb src={shot.thumbnailUrl} label={shot.shotNumber} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1 rounded bg-black/80 text-white">
                      {shot.durationSec}s
                    </span>
                  </div>
                  <p className="text-[11px] text-[#e8f0f8] line-clamp-2 leading-tight mb-1">
                    {shot.visualDesc}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[#8a97a8]">
                    <span>{shot.shotSize}</span>
                    <span className="text-[#00B4D8]">{shot.cameraMove}</span>
                  </div>
                </div>

                {idx < shots.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-[#5c697a] shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-[#0f1e35] border border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs text-[#8a97a8]">
            <span>提示：按住 Shift 框选多个分镜卡片可呼出浮动批量调色与重生成工具栏</span>
            <span className="font-mono">Zoom: 100% · Total Duration: 18.0s</span>
          </div>
        </div>
      )}

      {/* Floating Batch Action Bar */}
      <BatchActionBar
        selectedCount={selectedIds.length}
        totalCount={shots.length}
        onClear={() => setSelectedIds([])}
        actions={[
          {
            label: '批量生成选定镜头',
            icon: <Play className="w-3.5 h-3.5" />,
            variant: 'primary',
            onClick: () => onNavigate('production'),
          },
          {
            label: '批量重试打回项',
            icon: <RotateCw className="w-3.5 h-3.5" />,
            onClick: () => setSelectedIds([]),
          },
        ]}
      />
    </div>
  );
};

export default StoryboardPage;
