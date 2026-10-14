/**
 * @file: AssetsPage.tsx
 * @description: 页面组件：AssetsPage
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import {
  Crown,
  ExternalLink,
  Plus,
  Search,
  ShieldCheck
} from 'lucide-react';
import React, { useState } from 'react';
import { assetService, ENDPOINTS, SNAPSHOT, useApiData } from '../../api';
import { EmptyState, ErrorState, LoadingState, NoPermissionState } from '../../components/common/States';
import Thumb from '../../components/common/Thumb';
import { DevModeMeta, PageId, ViewState } from '../../types';

interface AssetsPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_ASSETS: DevModeMeta = {
  apiEndpoint: ENDPOINTS.assets,
  confidenceSource: 'IP-Adapter / LoRA 一致性校验矩阵 · Cosine Similarity',
  memoryScope: 'project',
  learningSampleSource: '定妆照与多视图特征向量提取库',
  driveModePolicy: '角色资产变更自动联动全部下游分镜打上待重检标记',
  stateSwitchConditions: {
    empty: '当前资产中心无任何角色、场景或道具资产',
    loading: '资产高分辨率特征向量与 LoRA 权重加载中',
    error: 'NAS 存储单点读写超时 (/mnt/nas/assets)',
    forbidden: '用户无企业级资产库上传与删除权限',
  },
};

export const AssetsPage: React.FC<AssetsPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const [selectedType, setSelectedType] = useState<string>('character');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: assetsData, loading } = useApiData(assetService.list, SNAPSHOT.assetList);
  const assets = assetsData ?? [];
  const [inspectedId, setInspectedId] = useState<string | null>(null);
  const inspectedAsset = (inspectedId ? assets.find((a) => a.id === inspectedId) : assets[0]) ?? null;

  if (viewState === 'loading') return <LoadingState message="加载影视级高维资产特征与 LoRA 权重..." />;
  if (viewState === 'empty') return <EmptyState title="资产库暂无资产" actionText="上传第一批角色定妆照" onAction={() => onNavigate('assets-consistency')} />;
  if (viewState === 'error') return <ErrorState title="资产存储节点不可达" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无资产库管理权限" />;
  if (loading) return <LoadingState message="加载影视级高维资产特征与 LoRA 权重..." />;

  const assetTypes = [
    { id: 'character', label: '角色资产', count: 6 },
    { id: 'scene', label: '场景资产', count: 14 },
    { id: 'prop', label: '道具法宝', count: 8 },
    { id: 'style', label: '画风预设', count: 5 },
    { id: 'template', label: '品牌模板', count: 3 },
  ];

  const filtered = assets.filter((a) =>
    selectedType === 'all' ? true : a.type === selectedType
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#e8f0f8]">影视级资产中心</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#00e0b8] border border-[rgba(0,224,184,0.3)]">
              Pixmax 对标 · 跨剧目复用
            </span>
          </div>
          <p className="text-xs text-[#8a97a8] mt-1">
            定妆照 → 角色板 → 多视图 → LoRA 资产包全演化链路
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('assets-consistency')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#152640] hover:bg-[#1f3659] text-[#00e0b8] border border-[rgba(0,224,184,0.25)] text-xs font-medium cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>进入一致性训练中心</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs cursor-pointer shadow-lg shadow-teal-950/40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新建资产</span>
          </button>
        </div>
      </div>

      {/* Brand Asset Pinned Banner */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-[rgba(0,224,184,0.1)] to-[rgba(157,124,216,0.1)] border border-[rgba(0,224,184,0.2)] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <Crown className="w-4 h-4 text-[#FFD700]" />
          <div>
            <span className="font-bold text-[#e8f0f8]">企业品牌专属资产专区已激活</span>
            <span className="text-[#8a97a8] ml-2">
              标准片头片尾 · 官方 Logo 水印 · 品牌级调色 LUT 自动注入
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-[#00e0b8] cursor-pointer hover:underline">
          管理品牌配置 →
        </span>
      </div>

      {/* Toolbar & Type Segmented Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)]">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.08)] text-xs text-[#8a97a8] w-full focus-within:border-[#00e0b8]">
            <Search className="w-3.5 h-3.5 text-[#5c697a]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="语法检索，如「标签:修真 状态:已训练」..."
              className="bg-transparent text-xs text-[#e8f0f8] placeholder-[#5c697a] focus:outline-none flex-1"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {assetTypes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedType(t.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${selectedType === t.id
                ? 'bg-[#00e0b8] text-[#0a1628] font-bold shadow-sm'
                : 'bg-[#152640] text-[#8a97a8] hover:text-[#e8f0f8]'
                }`}
            >
              <span>{t.label}</span>
              <span className="ml-1 text-[10px] font-mono opacity-80">({t.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid + Right Asset Inspector */}
      <div className="flex gap-5">
        {/* Asset Cards Grid */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              onClick={() => setInspectedId(asset.id)}
              className={`rounded-xl bg-[#0f1e35] border overflow-hidden transition-all cursor-pointer group relative ${inspectedAsset?.id === asset.id
                ? 'border-[#00e0b8] shadow-lg shadow-teal-950/30'
                : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(0,224,184,0.3)]'
                }`}
            >
              {/* Ref Card Badge in Top-Right Corner */}
              {asset.refCard && (
                <div className="absolute top-2 right-2 z-10 px-1.5 py-0.5 rounded bg-black/80 border border-[#FFD700] text-[#FFD700] text-[10px] font-mono flex items-center gap-1 shadow-md">
                  <ShieldCheck className="w-3 h-3 text-[#FFD700]" />
                  <span>Ref 保持</span>
                </div>
              )}

              {/* Asset Preview */}
              <div
                className={`overflow-hidden bg-[#0a1628] ${asset.type === 'character' ? 'aspect-3/4' : 'aspect-video'
                  }`}
              >
                <Thumb
                  src={asset.previewUrl}
                  alt={asset.name}
                  label={asset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Asset Meta */}
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#e8f0f8] group-hover:text-[#00e0b8] transition-colors truncate">
                    {asset.name}
                  </h4>
                  <span className="text-[10px] font-mono text-[#8a97a8]">{asset.version}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {asset.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-1.5 py-0.2 rounded bg-[#152640] text-[#8a97a8]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.06)] text-[11px] font-mono">
                  <span className="text-[#5c697a]">调用 {asset.usageCount} 次</span>
                  <span className="text-[#22C55E] font-bold">
                    一致性 {asset.consistencyScore}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Asset Detail Sheet */}
        {inspectedAsset && (
          <div className="w-88 shrink-0 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.15)] p-4 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,255,255,0.06)]">
                <div>
                  <span className="text-[10px] font-mono text-[#00e0b8] uppercase">
                    {inspectedAsset.evolutionStage}
                  </span>
                  <h3 className="text-sm font-bold text-[#e8f0f8]">{inspectedAsset.name}</h3>
                </div>
                <span className="text-xs font-mono text-[#22C55E]">
                  {inspectedAsset.consistencyScore}%
                </span>
              </div>

              {/* Large Preview */}
              <div className="aspect-video rounded-lg overflow-hidden bg-[#0a1628] border border-[rgba(255,255,255,0.1)]">
                <Thumb
                  src={inspectedAsset.previewUrl}
                  label={inspectedAsset.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Dual Form Contract */}
              {inspectedAsset.dualFormContract && (
                <div className="p-3 rounded-lg bg-[#0a1628] border border-[rgba(255,215,0,0.25)] space-y-1.5">
                  <span className="text-[11px] font-bold text-[#FFD700] block">
                    双形态契约 (Dual-Form Contract)
                  </span>
                  <div className="text-[11px] text-[#8a97a8] space-y-1">
                    <div>
                      <strong className="text-[#e8f0f8]">主形态:</strong>{' '}
                      {inspectedAsset.dualFormContract.mainForm}
                    </div>
                    <div>
                      <strong className="text-[#00e0b8]">切换形态:</strong>{' '}
                      {inspectedAsset.dualFormContract.altForm}
                    </div>
                  </div>
                </div>
              )}

              {/* Reverse References */}
              <div>
                <span className="text-[11px] font-bold text-[#8a97a8] uppercase tracking-wider block mb-1.5">
                  反向引用 (已绑定 4 个剧目分镜)
                </span>
                <div className="space-y-1.5 text-xs">
                  <div
                    onClick={() => onNavigate('storyboard')}
                    className="p-2 rounded bg-[#0a1628] border border-[rgba(255,255,255,0.06)] flex items-center justify-between cursor-pointer hover:border-[#00e0b8]"
                  >
                    <span className="text-[#e8f0f8]">《凌霄剑仙》S01-01</span>
                    <ExternalLink className="w-3 h-3 text-[#5c697a]" />
                  </div>
                  <div
                    onClick={() => onNavigate('storyboard')}
                    className="p-2 rounded bg-[#0a1628] border border-[rgba(255,255,255,0.06)] flex items-center justify-between cursor-pointer hover:border-[#00e0b8]"
                  >
                    <span className="text-[#e8f0f8]">《凌霄剑仙》S01-03</span>
                    <ExternalLink className="w-3 h-3 text-[#5c697a]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[rgba(255,255,255,0.06)]">
              <button
                type="button"
                onClick={() => onNavigate('assets-consistency')}
                className="w-full py-2.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-teal-950/40"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>进入一致性训练调优</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetsPage;
