/**
 * @file: ProjectLorePage.tsx
 * @description: 页面组件：ProjectLorePage
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
  Sparkles
} from 'lucide-react';
import React, { useState } from 'react';
import { EmptyState, ErrorState, LoadingState, NoPermissionState } from '../../components/common/States';
import { DevModeMeta, PageId, ViewState } from '../../types';

interface ProjectLorePageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_LORE: DevModeMeta = {
  apiEndpoint: '/api/v2/management/lore/graph/sc-101',
  confidenceSource: '语枢·万物 知识图谱实体三元组提取器 + D3 力导向物理引擎',
  memoryScope: 'project',
  learningSampleSource: '世界观设定集与实体冲突消歧样本库',
  driveModePolicy: '剧情前后矛盾冲突达到高危时自动在剧本与分镜中标红阻断',
  stateSwitchConditions: {
    empty: '当前剧本尚未提取任何世界观实体与关系图谱',
    loading: '语枢·万物 正在遍历 20 万字抽取人物/地点/法宝三元组',
    error: '图谱知识抽取算法超限或向量图引擎异常',
    forbidden: '用户无世界观图谱与圣经设定编辑权限',
  },
};

export const ProjectLorePage: React.FC<ProjectLorePageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const [selectedEntity, setSelectedEntity] = useState<string>('叶凌霄');
  const [layoutMode, setLayoutMode] = useState<'force' | 'timeline' | 'hierarchy'>('force');

  if (viewState === 'loading') return <LoadingState message="语枢·万物 正在抽取世界观实体三元组并构建力导向拓扑..." />;
  if (viewState === 'empty') return <EmptyState title="世界观图谱为空" actionText="让 AI 语枢·万物 提取图谱" />;
  if (viewState === 'error') return <ErrorState title="知识图谱服务异常" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无世界观设定编辑权限" />;

  const nodes = [
    { id: 'n1', name: '叶凌霄', type: 'character', shape: '圆', ref: 'Ref 94%', color: '#00e0b8', x: 260, y: 160 },
    { id: 'n2', name: '苏清月', type: 'character', shape: '圆', ref: 'Ref 88%', color: '#FF69B4', x: 420, y: 130 },
    { id: 'n3', name: '陈浩天', type: 'character', shape: '圆', ref: 'Ref 89%', color: '#FFD700', x: 280, y: 310 },
    { id: 'n4', name: '冰魄飞剑', type: 'prop', shape: '菱', ref: 'Ref 96%', color: '#00B4D8', x: 120, y: 220 },
    { id: 'n5', name: '苏家酒会大厅', type: 'scene', shape: '方', ref: '一致性92%', color: '#9d7cd8', x: 460, y: 280 },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#e8f0f8]">世界观与知识图谱 (Worldview Lore)</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#00B4D8] border border-[rgba(0,180,216,0.3)]">
              World Anvil 对标
            </span>
          </div>
          <p className="text-xs text-[#8a97a8] mt-1">
            力导向拓扑关系 · 角色/场景/法宝实体反向引用 · 剧本设定逻辑冲突自动检测
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Layout Switcher */}
          <div className="flex items-center p-0.5 rounded-lg bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] text-xs font-mono">
            {(['force', 'timeline', 'hierarchy'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLayoutMode(l)}
                className={`px-3 py-1 rounded cursor-pointer ${layoutMode === l
                  ? 'bg-[#00B4D8] text-[#0a1628] font-bold'
                  : 'text-[#8a97a8] hover:text-white'
                  }`}
              >
                {l === 'force' ? '力导向图' : l === 'timeline' ? '时间轴' : '层级树'}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs cursor-pointer shadow-md shadow-teal-950/40"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI 从剧本提取图谱</span>
          </button>
        </div>
      </div>

      {/* Conflict Alert Banner */}
      <div className="p-3.5 rounded-xl bg-[rgba(255,176,32,0.1)] border border-[rgba(255,176,32,0.3)] flex items-center justify-between text-xs animate-in fade-in">
        <div className="flex items-center gap-2 text-[#FFB020]">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            <strong>世界观逻辑冲突检测:</strong> 检测到 1 处潜在矛盾（第 1 场叶凌霄设定为“隐匿修为不发”，但在 S01-05 画面描述中出现了大范围法术外溢）。
          </span>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('storyboard')}
          className="text-[#00e0b8] hover:underline font-mono text-[11px] shrink-0"
        >
          定位分镜修复 →
        </button>
      </div>

      {/* Main Split: Left Interactive Force Graph Canvas, Right Entity Inspector（<lg 纵向堆叠；图谱固定设计宽横滑） */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: Force-Directed Graph Canvas */}
        <div className="flex-1 min-w-0 rounded-xl bg-[#0a1628] border border-[rgba(0,224,184,0.2)] h-[500px] relative overflow-x-auto lg:overflow-hidden">
          <div className="relative w-[560px] lg:w-full h-full flex flex-col justify-between p-4">
            <div className="flex items-center justify-between text-xs text-[#8a97a8] z-10">
              <span className="font-mono text-[#00e0b8]">Force Simulation Active (5 Nodes, 7 Edges)</span>
              <span className="font-mono">Zoom: 100% · Physics: Repulsion 400</span>
            </div>

            {/* Simulated Graph Nodes & Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line x1={260} y1={160} x2={420} y2={130} stroke="#00e0b8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
              <line x1={260} y1={160} x2={280} y2={310} stroke="#ff4422" strokeWidth="2" opacity="0.8" />
              <line x1={260} y1={160} x2={120} y2={220} stroke="#00B4D8" strokeWidth="2" opacity="0.9" />
              <line x1={420} y1={130} x2={460} y2={280} stroke="#9d7cd8" strokeWidth="1.5" opacity="0.7" />
            </svg>

            {/* Nodes Overlay */}
            <div className="absolute inset-0 pointer-events-auto">
              {nodes.map((node) => {
                const isSelected = selectedEntity === node.name;

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedEntity(node.name)}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all ${isSelected
                      ? 'bg-[#152640] border-2 shadow-lg shadow-teal-950/40 scale-110 z-20'
                      : 'bg-[#0f1e35] border-[rgba(255,255,255,0.1)] hover:scale-105 z-10'
                      }`}
                    style={{
                      left: `${node.x}px`,
                      top: `${node.y}px`,
                      borderColor: isSelected ? node.color : undefined,
                    }}
                  >
                    <span className="font-bold text-xs text-[#e8f0f8]">{node.name}</span>
                    <span className="text-[9px] font-mono opacity-80" style={{ color: node.color }}>
                      {node.ref}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Graph Legend */}
            <div className="flex items-center gap-4 text-[10px] text-[#8a97a8] z-10 bg-[#0f1e35]/80 p-2 rounded-lg border border-[rgba(255,255,255,0.06)] w-fit">
              <span>实线(红): 宿敌仇怨</span>
              <span>虚线(青): 夫妻/契约</span>
              <span>实线(蓝): 本命法宝绑定</span>
            </div>
          </div>
        </div>

        {/* Right Entity Inspector */}
        <div className="w-full lg:w-80 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.15)] p-4 flex flex-col justify-between space-y-4 lg:shrink-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,255,255,0.06)]">
              <div>
                <span className="text-[10px] font-mono text-[#00e0b8] uppercase">实体属性与反向引用</span>
                <h3 className="text-sm font-bold text-[#e8f0f8]">{selectedEntity}</h3>
              </div>
              <span className="text-xs font-mono text-[#22C55E]">Ref 94%</span>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-[#8a97a8] block">核心人设圣经 (Lore Bible):</span>
              <p className="text-[#e8f0f8] text-[11px] leading-relaxed bg-[#0a1628] p-2.5 rounded-lg border border-[rgba(255,255,255,0.06)]">
                万古剑尊重生现代，外表冷峻寡言，无论聚光灯何种角度，瞳孔均映射淡青冰魄寒光，右手戴墨玉戒。
              </p>
            </div>

            {/* Reverse References in Storyboard */}
            <div>
              <span className="text-[11px] font-bold text-[#8a97a8] uppercase tracking-wider block mb-1.5">
                分镜出场记录 (4 个镜头)
              </span>
              <div className="space-y-1.5 text-xs">
                <div
                  onClick={() => onNavigate('storyboard')}
                  className="p-2 rounded bg-[#0a1628] border border-[rgba(255,255,255,0.06)] flex items-center justify-between cursor-pointer hover:border-[#00e0b8]"
                >
                  <span className="text-[#e8f0f8]">S01-01 叶凌霄特写</span>
                  <span className="text-[10px] text-[#00e0b8] font-mono">通过</span>
                </div>
                <div
                  onClick={() => onNavigate('storyboard')}
                  className="p-2 rounded bg-[#0a1628] border border-[rgba(255,255,255,0.06)] flex items-center justify-between cursor-pointer hover:border-[#00e0b8]"
                >
                  <span className="text-[#e8f0f8]">S01-03 冰魄飞剑水箭</span>
                  <span className="text-[10px] text-[#00e0b8] font-mono">通过</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[rgba(255,255,255,0.06)]">
            <button
              type="button"
              onClick={() => onNavigate('assets')}
              className="w-full py-2 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs transition-colors cursor-pointer"
            >
              在资产中心编辑该实体
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectLorePage;
