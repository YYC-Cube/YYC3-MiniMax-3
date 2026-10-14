/**
 * @file: VideoTemplatesPage.tsx
 * @description: 页面组件：VideoTemplatesPage
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
  Sparkles
} from 'lucide-react';
import React, { useState } from 'react';
import { editingService, SNAPSHOT, useApiData } from '../../api';
import { EmptyState, ErrorState, LoadingState, NoPermissionState } from '../../components/common/States';
import Thumb from '../../components/common/Thumb';
import { DevModeMeta, PageId, ViewState } from '../../types';

interface VideoTemplatesPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_TEMPLATES: DevModeMeta = {
  apiEndpoint: '/api/v2/editing/templates',
  confidenceSource: '知遇·伯乐 (历史爆款模板参数推荐) + 剪映工程解析器',
  memoryScope: 'project',
  learningSampleSource: '完播率前 10% 剧目自动归纳沉淀为整片剪辑工程模板',
  driveModePolicy: '套用模板一键完成轨道对齐与转场铺设，保留分镜视频源',
  stateSwitchConditions: {
    empty: '当前模板库无对应分类模板',
    loading: '模板时间线工程与关键帧动效预加载中',
    error: '模板解压失败或版本不兼容',
    forbidden: '用户无企业品牌模板库调用权限',
  },
};

export const VideoTemplatesPage: React.FC<VideoTemplatesPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { data: templatesData } = useApiData(editingService.templates, SNAPSHOT.videoTemplates);
  const templates = templatesData ?? [];

  if (viewState === 'loading') return <LoadingState message="加载爆款剪辑模板与品牌片头片尾..." />;
  if (viewState === 'empty') return <EmptyState title="暂无可用模板" />;
  if (viewState === 'error') return <ErrorState title="模板库拉取异常" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无模板库访问权限" />;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#e8f0f8]">剪辑模板中心 (Templates)</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#9d7cd8] border border-[#9d7cd8]/30">
              剪映模板库对标
            </span>
          </div>
          <p className="text-xs text-[#8a97a8] mt-1">
            片头片尾 · 爆款转场包 · 整片智能套剪 · 品牌企业级规范置顶
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('video')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs cursor-pointer shadow-md shadow-teal-950/40"
        >
          <span>应用至时间线剪辑 →</span>
        </button>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] hover:border-[#9d7cd8] overflow-hidden transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="aspect-video bg-[#0a1628] overflow-hidden relative">
                <Thumb src={tpl.preview} label={tpl.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                {tpl.recommended && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#FFD700] text-[#0a1628] font-bold text-[10px] flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3 h-3" />
                    <span>{tpl.agentRecommend || '爆款推荐'}</span>
                  </span>
                )}
                {tpl.brandBadge && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#00e0b8] text-[#0a1628] font-bold text-[10px] flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    <span>品牌置顶</span>
                  </span>
                )}
              </div>

              <div className="p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#152640] text-[#9d7cd8]">
                    {tpl.category}
                  </span>
                  <span className="text-[10px] font-mono text-[#8a97a8]">适用 {tpl.ratio}</span>
                </div>
                <h4 className="text-xs font-bold text-[#e8f0f8] group-hover:text-[#9d7cd8] transition-colors">
                  {tpl.title}
                </h4>
              </div>
            </div>

            <div className="p-3.5 pt-0 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs mt-2">
              <span className="text-[11px] font-mono text-[#5c697a]">调用 {tpl.usedCount} 次</span>
              <button
                type="button"
                onClick={() => onNavigate('video')}
                className="px-3 py-1 rounded bg-[#152640] hover:bg-[#9d7cd8] hover:text-white text-[#9d7cd8] font-bold text-xs transition-colors cursor-pointer"
              >
                一键应用
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoTemplatesPage;
