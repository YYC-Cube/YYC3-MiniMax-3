/**
 * @file: ProjectSeriesPage.tsx
 * @description: 页面组件：ProjectSeriesPage
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import {
  Calendar,
  Kanban,
  Plus,
  Table
} from 'lucide-react';
import React, { useState } from 'react';
import { ENDPOINTS, SNAPSHOT, scriptService, useApiData } from '../../api';
import GateBadge from '../../components/common/GateBadge';
import { EmptyState, ErrorState, LoadingState, NoPermissionState } from '../../components/common/States';
import Thumb from '../../components/common/Thumb';
import { DevModeMeta, PageId, ViewState } from '../../types';

interface ProjectSeriesPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_PROJECT: DevModeMeta = {
  apiEndpoint: ENDPOINTS.scripts,
  confidenceSource: '元启·天枢 全局项目编排拓扑 + 里程碑工期预测模型',
  memoryScope: 'project',
  learningSampleSource: '各剧目各制作阶段实际耗时与排期偏差回归训练',
  driveModePolicy: '里程碑延期风险阈值超过 15% 自动向顶栏铃铛推送预警',
  stateSwitchConditions: {
    empty: '当前组织尚未立项任何漫剧剧目项目',
    loading: 'Linear 式多阶段看板泳道与集数产物状态拉取中',
    error: '项目关系数据库聚合查询超时 (SQL_QUERY_TIMEOUT)',
    forbidden: '用户无漫剧项目立项、归档与排期规划权限',
  },
};

export const ProjectSeriesPage: React.FC<ProjectSeriesPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table' | 'timeline'>('kanban');
  const { data: scriptsData, loading } = useApiData(scriptService.list, SNAPSHOT.scriptList);
  const scripts = scriptsData ?? [];

  if (viewState === 'loading') return <LoadingState message="获取漫剧项目多维看板与阶段甘特图..." />;
  if (viewState === 'empty') return <EmptyState title="暂无剧目项目" actionText="创建第一部漫剧" onAction={() => onNavigate('script')} />;
  if (viewState === 'error') return <ErrorState title="剧集中心服务异常" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无项目管理权限" />;
  if (loading) return <LoadingState message="获取漫剧项目多维看板与阶段甘特图..." />;

  const kanbanColumns = [
    { id: 'script', name: '剧本立项', count: 1, color: '#00e0b8' },
    { id: 'storyboard', name: '分镜设计', count: 1, color: '#00B4D8' },
    { id: 'production', name: '批量生成', count: 1, color: '#FFB020' },
    { id: 'editing', name: '剪辑成片', count: 1, color: '#9d7cd8' },
    { id: 'published', name: '全网发布', count: 2, color: '#22C55E' },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#e8f0f8]">项目剧集中心 (Series Center)</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#00B4D8] border border-[rgba(0,180,216,0.3)]">
              Linear 敏捷视图对标
            </span>
          </div>
          <p className="text-xs text-[#8a97a8] mt-1">
            全链路六阶段工期跟踪 · 集数产物齐备度 · 延期自动预警
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center p-0.5 rounded-lg bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] text-xs">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded cursor-pointer ${viewMode === 'kanban'
                ? 'bg-[#00B4D8] text-[#0a1628] font-bold'
                : 'text-[#8a97a8] hover:text-white'
                }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>看板</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded cursor-pointer ${viewMode === 'table'
                ? 'bg-[#00B4D8] text-[#0a1628] font-bold'
                : 'text-[#8a97a8] hover:text-white'
                }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>表格</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded cursor-pointer ${viewMode === 'timeline'
                ? 'bg-[#00B4D8] text-[#0a1628] font-bold'
                : 'text-[#8a97a8] hover:text-white'
                }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>甘特</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('script')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs cursor-pointer shadow-md shadow-teal-950/40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新建漫剧项目</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
        {kanbanColumns.map((col) => (
          <div
            key={col.id}
            className="rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.06)] flex flex-col overflow-hidden min-h-[480px]"
          >
            <div className="p-3 bg-[#152640] border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                <h3 className="font-bold text-[#e8f0f8]">{col.name}</h3>
              </div>
              <span className="font-mono text-[#8a97a8]">({col.count})</span>
            </div>

            <div className="p-3 flex-1 overflow-y-auto space-y-3">
              {scripts.slice(0, col.count).map((script) => (
                <div
                  key={script.id}
                  onClick={() => onNavigate('storyboard')}
                  className="p-3.5 rounded-xl bg-[#0a1628] border border-[rgba(0,224,184,0.12)] hover:border-[#00e0b8] transition-all cursor-pointer space-y-2 group"
                >
                  <div className="aspect-video rounded-lg overflow-hidden bg-[#152640] relative">
                    <Thumb src={script.characters[0]?.avatar} label={script.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1 rounded bg-black/80 text-[#00e0b8]">
                      进度: 3/12 集
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[#e8f0f8] group-hover:text-[#00e0b8] transition-colors truncate">
                      {script.title}
                    </h4>
                    <span className="text-[10px] text-[#8a97a8] block mt-0.5">
                      最近活跃：{script.lastEdited}
                    </span>
                  </div>

                  {/* Readiness 4 Dots: Script / Storyboard / Film / Published */}
                  <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.06)] text-[10px] font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#22C55E]" title="剧本就绪">剧本✓</span>
                      <span className="text-[#22C55E]" title="分镜就绪">分镜✓</span>
                      <span className="text-[#00e0b8]" title="成片生成中">成片⚙</span>
                      <span className="text-[#5c697a]" title="待发布">发布○</span>
                    </div>
                    <GateBadge level={script.gateLevel} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSeriesPage;
