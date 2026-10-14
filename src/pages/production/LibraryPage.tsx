/**
 * @file: LibraryPage.tsx
 * @description: 页面组件：LibraryPage
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
  ShieldCheck,
  Upload
} from 'lucide-react';
import React, { useState } from 'react';
import { SNAPSHOT, scriptService, useApiData } from '../../api';
import { EmptyState, ErrorState, LoadingState, NoPermissionState } from '../../components/common/States';
import Thumb from '../../components/common/Thumb';
import { DevModeMeta, PageId, ViewState } from '../../types';

interface LibraryPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_LIBRARY: DevModeMeta = {
  apiEndpoint: '/api/v2/production/library/novels',
  confidenceSource: '言启·千行 (语义解析与长文本章节抽块) + 智云·守护 (版权溯源)',
  memoryScope: 'project',
  learningSampleSource: '网文小说爆款情节节点抽取模板库',
  driveModePolicy: '小说入库自动完成 G0 准入审查（确权率 100% 允许立项）',
  stateSwitchConditions: {
    empty: '素材源站库中无任何导入小说或授权 IP',
    loading: '20 万字长文本语义切块与实体图谱解析中',
    error: '外部素材源站 API 抓取超时或防爬拦截',
    forbidden: '用户无商用版权 IP 采购与立项权限',
  },
};

export const LibraryPage: React.FC<LibraryPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const [selectedSource, setSelectedSource] = useState('all');
  const { data: scriptsData } = useApiData(scriptService.list, SNAPSHOT.scriptList);

  if (viewState === 'loading') return <LoadingState message="正在解析 20 万字小说长文本并构建情节章节树..." />;
  if (viewState === 'empty') return <EmptyState title="素材库暂无作品" actionText="导入第一本小说" />;
  if (viewState === 'error') return <ErrorState title="素材抓取网络超时" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无商用素材库访问权限" />;

  // 封面派生自剧本域主角头像（scriptId 与 src/data 剧本库同源对应）
  const novels = [
    {
      id: 'nov-01',
      scriptId: 'sc-101',
      title: '凌霄剑仙之都市重修',
      author: '风御九秋',
      wordCount: '14.5 万字',
      genre: '都市修真',
      copyright: '商用已授权',
      copyrightColor: '#22C55E',
      synopsis: '万古剑尊重生为现代赘婿，借都市灵气复苏之际重铸本命飞剑，横扫豪门世家。',
      chapters: 42,
    },
    {
      id: 'nov-02',
      scriptId: 'sc-102',
      title: '落魄千金的大唐机甲营',
      author: '墨香铜臭',
      wordCount: '18.2 万字',
      genre: '盛唐朋克',
      copyright: '公版改编',
      copyrightColor: '#00B4D8',
      synopsis: '唐朝天宝年间，流放千金机缘巧合启动机关木鸢核心，以蒸汽朋克机关术守卫边塞。',
      chapters: 58,
    },
    {
      id: 'nov-03',
      scriptId: 'sc-103',
      title: '赛博红娘：心率匹配 99.8%',
      author: '陈楸帆',
      wordCount: '9.2 万字',
      genre: '科幻情感',
      copyright: '原创版权',
      copyrightColor: '#9d7cd8',
      synopsis: '2088 年神经算法婚配所首席红娘，发现自己与最危险的通缉黑客产生了无法解释的基因共振。',
      chapters: 28,
    },
  ];
  const coverOf = (scriptId: string) =>
    scriptsData?.find((s) => s.id === scriptId)?.characters[0]?.avatar;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#e8f0f8]">IP 素材源站库</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#00e0b8] border border-[rgba(0,224,184,0.3)]">
              最大支持 20 万字
            </span>
          </div>
          <p className="text-xs text-[#8a97a8] mt-1">
            小说源 / 短篇 / 梗概一键立项 · 自动接入 G0 准入审查与知识图谱构建
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs cursor-pointer shadow-lg shadow-teal-950/40"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>导入长篇小说 (docx/txt/URL)</span>
          </button>
        </div>
      </div>

      {/* Copyright Notice Banner */}
      <div className="p-3 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.15)] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
          <span className="text-[#e8f0f8]">版权合规状态标识:</span>
          <span className="px-2 py-0.5 rounded bg-[#22C55E]/15 text-[#22C55E] text-[10px] font-bold">
            商用已授权
          </span>
          <span className="px-2 py-0.5 rounded bg-[#00B4D8]/15 text-[#00B4D8] text-[10px] font-bold">
            公版改编
          </span>
          <span className="px-2 py-0.5 rounded bg-[#ff7a45]/15 text-[#ff7a45] text-[10px] font-bold">
            未确权 (需二次审核)
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#8a97a8]">G0 门禁自动确权</span>
      </div>

      {/* Novel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {novels.map((nov) => (
          <div
            key={nov.id}
            className="rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)] p-4 flex flex-col justify-between space-y-4 hover:border-[rgba(0,224,184,0.35)] transition-all group"
          >
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-20 h-28 rounded-lg overflow-hidden bg-[#0a1628] shrink-0 border border-[rgba(255,255,255,0.1)]">
                  <Thumb src={coverOf(nov.scriptId)} label={nov.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="space-y-1">
                  <span
                    className="text-[10px] font-mono px-1.5 py-0.2 rounded inline-block"
                    style={{
                      backgroundColor: `${nov.copyrightColor}20`,
                      color: nov.copyrightColor,
                    }}
                  >
                    {nov.copyright}
                  </span>
                  <h3 className="text-sm font-bold text-[#e8f0f8] group-hover:text-[#00e0b8] transition-colors">
                    {nov.title}
                  </h3>
                  <span className="text-xs text-[#8a97a8] block">作者: {nov.author}</span>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#5c697a] pt-1">
                    <span>{nov.wordCount}</span>
                    <span>·</span>
                    <span>{nov.chapters} 章</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#8a97a8] line-clamp-3 leading-relaxed">
                {nov.synopsis}
              </p>
            </div>

            <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#00e0b8]">{nov.genre}</span>
              <button
                type="button"
                onClick={() => onNavigate('script')}
                className="px-3 py-1.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>一键立项</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibraryPage;
