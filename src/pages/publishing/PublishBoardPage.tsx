/**
 * @file: PublishBoardPage.tsx
 * @description: 页面组件：PublishBoardPage
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
  ExternalLink,
  Send
} from 'lucide-react';
import React, { useState } from 'react';
import { ENDPOINTS, publishingService, SNAPSHOT, useApiData } from '../../api';
import { EmptyState, ErrorState, LoadingState, NoPermissionState } from '../../components/common/States';
import Thumb from '../../components/common/Thumb';
import { DevModeMeta, PageId, ViewState } from '../../types';

interface PublishBoardPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_PUBLISH_BOARD: DevModeMeta = {
  apiEndpoint: ENDPOINTS.publishMatrix,
  confidenceSource: '各短视频开放平台 Webhook 回执 + 驳回状态码智能归因解析',
  memoryScope: 'project',
  learningSampleSource: '高播放高互动发布排期样本直接归入 Learning Inbox',
  driveModePolicy: '机审驳回自动唤醒 创想·灵韵 重新生成合规标题与封面',
  stateSwitchConditions: {
    empty: '当前发布看板无排队中或已发布的成片剧集',
    loading: '抖音/视频号/B站多平台 Webhook 实时发布回执同步中',
    error: '第三方开放平台分发 API 网关超时 (GATEWAY_504)',
    forbidden: '用户无发布状态看板查阅与重发批复权限',
  },
};

export const PublishBoardPage: React.FC<PublishBoardPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const { data: matrixData, loading } = useApiData(publishingService.matrix, SNAPSHOT.publishMatrix);
  const matrix = matrixData ?? [];
  const [inspectedRejection, setInspectedRejection] = useState<{
    film: string;
    platform: string;
    reason: string;
    fix: string;
  } | null>(null);

  if (viewState === 'loading') return <LoadingState message="获取多平台实时发布状态与播放数据回执..." />;
  if (viewState === 'empty') return <EmptyState title="暂无发布记录" actionText="前往分发向导" onAction={() => onNavigate('publish')} />;
  if (viewState === 'error') return <ErrorState title="发布回执网关异常" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无发布看板查看权限" />;
  if (loading) return <LoadingState message="获取多平台实时发布状态与播放数据回执..." />;

  const platforms = [
    { key: 'douyin', name: '抖音' },
    { key: 'channels', name: '视频号' },
    { key: 'bilibili', name: 'B站' },
    { key: 'kuaishou', name: '快手' },
    { key: 'xiaohongshu', name: '小红书' },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[rgba(255,255,255,0.06)] domain-border-push">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#e8f0f8]">发布看板 (Publish Board)</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#FF7A5C] border border-[#FF7A5C]/30">
              蚁小二矩阵对标
            </span>
          </div>
          <p className="text-xs text-[#8a97a8] mt-1">
            多平台发布状态矩阵 · 驳回原因码智能溯源 · 播放回执直通运营反哺
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('publish')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FF7A5C] hover:bg-[#e06548] text-white font-bold text-xs cursor-pointer shadow-md shadow-orange-950/40"
        >
          <Send className="w-3.5 h-3.5" />
          <span>新建一键分发</span>
        </button>
      </div>

      {/* 4 Metric Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)]">
          <span className="text-xs text-[#8a97a8] block">今日已发布条数</span>
          <span className="text-2xl font-bold font-mono text-[#22C55E]">32 条</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)]">
          <span className="text-xs text-[#8a97a8] block">排队队列中</span>
          <span className="text-2xl font-bold font-mono text-[#00B4D8]">6 条</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0f1e35] border border-[rgba(255,68,34,0.25)]">
          <span className="text-xs text-[#ff4422] block">平台驳回拦截</span>
          <span className="text-2xl font-bold font-mono text-[#ff4422]">1 条</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)]">
          <span className="text-xs text-[#8a97a8] block">分发成功率</span>
          <span className="text-2xl font-bold font-mono text-[#00e0b8]">97.2%</span>
        </div>
      </div>

      {/* Matrix Table: Rows = Films, Columns = Platforms */}
      <div className="rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#152640] text-[#8a97a8] border-b border-[rgba(255,255,255,0.08)]">
                <th className="p-3 font-semibold">成片信息</th>
                {platforms.map((p) => (
                  <th key={p.key} className="p-3 font-semibold text-center">{p.name}</th>
                ))}
                <th className="p-3 font-semibold text-right">数据回流</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.04)] text-xs">
              {matrix.map((row) => (
                <tr key={row.filmId} className="hover:bg-[#152640]/50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-7 rounded bg-[#0a1628] overflow-hidden shrink-0 border border-[rgba(255,255,255,0.1)]">
                        <Thumb src={row.thumbnail} label={row.filmTitle} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-[#e8f0f8]">{row.filmTitle}</span>
                    </div>
                  </td>

                  {platforms.map((p) => {
                    const target = row.targets[p.key];

                    if (!target || target.status === 'unassigned') {
                      return (
                        <td key={p.key} className="p-3 text-center text-[#5c697a] font-mono">
                          未排期
                        </td>
                      );
                    }

                    if (target.status === 'published') {
                      return (
                        <td key={p.key} className="p-3 text-center">
                          <div
                            onClick={() => onNavigate('analytics')}
                            className="inline-flex flex-col items-center p-1.5 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] cursor-pointer hover:bg-[#22C55E]/20"
                            title="查看详细运营数据"
                          >
                            <span className="font-bold text-[11px]">已发布✓</span>
                            <span className="text-[10px] font-mono opacity-80">
                              {(target.views! / 10000).toFixed(1)}w 播放
                            </span>
                          </div>
                        </td>
                      );
                    }

                    if (target.status === 'rejected') {
                      return (
                        <td key={p.key} className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              setInspectedRejection({
                                film: row.filmTitle,
                                platform: p.name,
                                reason: target.rejectReason || '敏感词拦截',
                                fix: target.suggestedFix || '更换封面人物特写',
                              })
                            }
                            className="inline-flex flex-col items-center p-1.5 rounded-lg bg-[#ff4422]/15 border border-[#ff4422]/40 text-[#ff4422] cursor-pointer hover:bg-[#ff4422]/25 animate-pulse"
                          >
                            <span className="font-bold text-[11px]">驳回 {target.rejectCode}</span>
                            <span className="text-[10px] underline">点击查看原因</span>
                          </button>
                        </td>
                      );
                    }

                    if (target.status === 'queued') {
                      return (
                        <td key={p.key} className="p-3 text-center font-mono text-[#FFB020]">
                          <span className="px-2 py-0.5 rounded bg-[#FFB020]/15">排队中</span>
                        </td>
                      );
                    }

                    return (
                      <td key={p.key} className="p-3 text-center font-mono text-[#00e0b8]">
                        转码中...
                      </td>
                    );
                  })}

                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => onNavigate('analytics')}
                      className="px-2.5 py-1 rounded bg-[#0a1628] hover:bg-[#152640] text-[#00B4D8] font-mono text-xs flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <span>数据回流</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rejection Inspection Sheet */}
      {inspectedRejection && (
        <div className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(255,68,34,0.35)] space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-2 text-[#ff4422]">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="text-xs font-bold">
                {inspectedRejection.platform} 平台驳回详情诊断
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setInspectedRejection(null)}
              className="text-xs text-[#8a97a8] hover:text-white"
            >
              关闭
            </button>
          </div>

          <div className="text-xs space-y-1.5">
            <div>
              <strong className="text-[#8a97a8]">涉及剧目:</strong>{' '}
              <span className="text-[#e8f0f8]">{inspectedRejection.film}</span>
            </div>
            <div>
              <strong className="text-[#ff4422]">平台驳回原因:</strong>{' '}
              <span className="text-[#e8f0f8]">{inspectedRejection.reason}</span>
            </div>
            <div className="p-2.5 rounded bg-[#0a1628] border border-[rgba(0,224,184,0.2)] text-[#00e0b8]">
              <strong>AI 创想·灵韵 修复建议:</strong> {inspectedRejection.fix}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('publish')}
              className="px-3.5 py-1.5 rounded-lg bg-[#00e0b8] text-[#0a1628] font-bold text-xs cursor-pointer"
            >
              一键应用建议并重新分发
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublishBoardPage;
