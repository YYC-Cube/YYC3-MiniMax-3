/**
 * @file: Storyboard3DPage.tsx
 * @description: 页面组件：Storyboard3DPage
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import {
  ArrowRight,
  Box,
  Camera,
  LayoutGrid,
  Sparkles,
  Sun,
  Table
} from 'lucide-react';
import React, { useState } from 'react';
import { EmptyState, ErrorState, LoadingState, NoPermissionState } from '../../components/common/States';
import { DevModeMeta, PageId, ViewState } from '../../types';

interface Storyboard3DPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_3D: DevModeMeta = {
  apiEndpoint: '/api/v2/production/storyboard/3d-viewport/sc-101',
  confidenceSource: 'Three.js Camera Matrix → 创想·灵韵 运镜提示词逆向编译器',
  memoryScope: 'project',
  learningSampleSource: '好莱坞经典机位运镜矩阵参数映射库',
  driveModePolicy: '拖拽相机生成的机位参数自动格式化回填分镜 12 字段表',
  stateSwitchConditions: {
    empty: '当前分镜无绑定的 3D 场景或机位基准模型',
    loading: 'WebGL 3D 视口初始化与灯光材质网格构建中',
    error: '客户端 GPU WebGL 上下文丢失 (CONTEXT_LOST)',
    forbidden: '用户无 3D 视口机位调试与提示词回填权限',
  },
};

export const Storyboard3DPage: React.FC<Storyboard3DPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const [focalLength, setFocalLength] = useState<number>(50); // mm
  const [cameraAngle, setCameraAngle] = useState<'low' | 'eye' | 'high'>('low');

  if (viewState === 'loading') return <LoadingState message="WebGL 3D 视口加载中..." />;
  if (viewState === 'empty') return <EmptyState title="暂无 3D 场景数据" />;
  if (viewState === 'error') return <ErrorState title="WebGL 渲染上下文异常" fallbackManualPath="已降级为静态 2D 机位机图模式" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无 3D 导演权限" />;

  const generatedPrompt = `Cinematic ${focalLength}mm lens, ${cameraAngle}-angle perspective, dramatic volumetric rim lighting, shallow depth of field (f/1.8)`;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header & Tab Switcher (Shared with P04) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.15)]">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-bold text-[#e8f0f8]">3D 导演视角 (3D Director View)</h1>
          <div className="flex items-center p-0.5 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.08)] text-xs">
            <button
              type="button"
              onClick={() => onNavigate('storyboard')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[#8a97a8] hover:text-[#e8f0f8] cursor-pointer"
            >
              <Table className="w-3.5 h-3.5" />
              <span>表格模式</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('storyboard')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[#8a97a8] hover:text-[#e8f0f8] cursor-pointer"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>画布节点流</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#00e0b8] text-[#0a1628] font-bold cursor-pointer"
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D 导演视角</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('storyboard')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs cursor-pointer"
        >
          <span>回填分镜提示词</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main 3D Viewport Layout */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: Scene & Prop Assets */}
        <div className="w-full lg:w-64 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)] p-3 space-y-3 lg:shrink-0 text-xs">
          <span className="font-bold text-[#e8f0f8] block">场景环境与角色机位</span>
          <div className="space-y-2">
            <div className="p-2.5 rounded-lg bg-[#152640] border border-[#00e0b8]/30">
              <span className="font-bold text-[#00e0b8] block">苏家顶层酒会大厅</span>
              <span className="text-[10px] text-[#8a97a8]">室内 12m × 20m 空间网格</span>
            </div>
            <div className="p-2 rounded bg-[#0a1628] text-[#8a97a8]">
              机位 A: 紧跟叶凌霄视平线
            </div>
            <div className="p-2 rounded bg-[#0a1628] text-[#8a97a8]">
              机位 B: 陈浩天压迫仰拍位
            </div>
          </div>
        </div>

        {/* Center: Simulated 3D Viewport */}
        <div className="flex-1 rounded-xl bg-[#071222] border border-[rgba(0,224,184,0.25)] h-[460px] relative overflow-hidden flex flex-col justify-between p-4">
          <div className="flex items-center justify-between text-xs text-[#8a97a8] z-10">
            <span className="font-mono text-[#00e0b8]">Three.js Viewport · Camera Active</span>
            <span className="font-mono">FOV: 39.6° · 60 FPS</span>
          </div>

          {/* 3D Grid & Wireframe Elements */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full border border-[rgba(0,224,184,0.15)] animate-pulse" />
            <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-[rgba(0,224,184,0.08)] absolute" />
            <div className="text-center space-y-2 z-10">
              <Camera className="w-10 h-10 text-[#00e0b8] mx-auto animate-bounce" />
              <div className="text-xs font-mono text-[#e8f0f8] bg-[#0f1e35]/90 px-3 py-1 rounded-full border border-[rgba(0,224,184,0.3)]">
                当前机位：仰角特写 (Low Angle Shot)
              </div>
            </div>
          </div>

          {/* Real-time Generated Prompt Overlay */}
          <div className="p-3 rounded-lg bg-[#0f1e35]/90 border border-[rgba(0,224,184,0.3)] z-10 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#00e0b8] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>实时生成运镜提示词 (Prompt Output)</span>
              </span>
              <span className="text-[#8a97a8] font-mono">创想·灵韵 映射</span>
            </div>
            <p className="text-xs font-mono text-[#e8f0f8]">{generatedPrompt}</p>
          </div>
        </div>

        {/* Right: Camera Inspector */}
        <div className="w-full lg:w-80 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)] p-4 space-y-4 lg:shrink-0 text-xs">
          <span className="font-bold text-[#e8f0f8] block">机位与光学参数</span>

          <div>
            <span className="text-[#8a97a8] block mb-1">焦距 (Focal Length):</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={18}
                max={135}
                value={focalLength}
                onChange={(e) => setFocalLength(Number(e.target.value))}
                className="flex-1 accent-[#00e0b8]"
              />
              <span className="font-mono font-bold text-[#00e0b8] w-12 text-right">{focalLength}mm</span>
            </div>
          </div>

          <div>
            <span className="text-[#8a97a8] block mb-1">机位视角 (Angle):</span>
            <div className="grid grid-cols-3 gap-1.5 font-mono">
              {(['low', 'eye', 'high'] as const).map((ang) => (
                <button
                  key={ang}
                  type="button"
                  onClick={() => setCameraAngle(ang)}
                  className={`py-1.5 rounded cursor-pointer ${cameraAngle === ang
                    ? 'bg-[#00e0b8] text-[#0a1628] font-bold'
                    : 'bg-[#0a1628] text-[#8a97a8]'
                    }`}
                >
                  {ang === 'low' ? '仰拍' : ang === 'eye' ? '平视' : '俯拍'}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.06)] space-y-1.5">
            <span className="font-bold text-[#FFD700] block flex items-center gap-1">
              <Sun className="w-3.5 h-3.5" />
              <span>三点布光预设 (Three-Point Lighting)</span>
            </span>
            <p className="text-[11px] text-[#8a97a8]">
              主光 70% 暖白 + 辅光 30% 青绿冷光 + 轮廓光 85% 锐利高光
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Storyboard3DPage;
