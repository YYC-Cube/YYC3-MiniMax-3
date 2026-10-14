/**
 * @file: CollabCommentsPage.tsx
 * @description: 页面组件：CollabCommentsPage
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import {
  Bot,
  ExternalLink
} from 'lucide-react';
import React, { useState } from 'react';
import { collabService, ENDPOINTS, SNAPSHOT, useApiData } from '../../api';
import { EmptyState, ErrorState, LoadingState, NoPermissionState } from '../../components/common/States';
import Thumb from '../../components/common/Thumb';
import { DevModeMeta, PageId, ViewState } from '../../types';

interface CollabCommentsPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_COLLAB: DevModeMeta = {
  apiEndpoint: ENDPOINTS.comments,
  confidenceSource: 'WebSocket 实时双向流 + 分镜/时间轴微秒级锚点坐标绑定',
  memoryScope: 'project',
  learningSampleSource: '导演修改批注与 AI Agent 改写反馈记录',
  driveModePolicy: '评论提出的修改要求由相关 Agent 实时自动生成 Diff 改写草稿',
  stateSwitchConditions: {
    empty: '当前剧目无任何待处理或历史评审批注评论',
    loading: '跨页面时间码微秒级锚点与评论流同步聚合中',
    error: 'WebSocket 协同广播集群连接中断 (WS_CLOSED)',
    forbidden: '用户无剧组协作评审发表与裁决权限',
  },
};

export const CollabCommentsPage: React.FC<CollabCommentsPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'resolved'>('all');
  const { data: commentsData, loading } = useApiData(collabService.comments, SNAPSHOT.comments);
  const comments = commentsData ?? [];

  if (viewState === 'loading') return <LoadingState message="加载协同评论流与时间点锚点..." />;
  if (viewState === 'empty') return <EmptyState title="暂无评审批注" description="在分镜或时间线上双击即可留下批注锚点。" />;
  if (viewState === 'error') return <ErrorState title="协同通讯异常" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无协同评论权限" />;
  if (loading) return <LoadingState message="加载协同评论流与时间点锚点..." />;

  const filtered = comments.filter((c) =>
    filterStatus === 'all' ? true : c.status === filterStatus
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#e8f0f8]">协作与评论中心 (Collaboration)</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#00B4D8] border border-[rgba(0,180,216,0.3)]">
              Figma 评审对标 · 跨页时间锚点
            </span>
          </div>
          <p className="text-xs text-[#8a97a8] mt-1">
            导演组 / 剪辑师 / AI Agent 统一会话评审流 · 点击锚点秒级跳转高亮
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center p-0.5 rounded-lg bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] text-xs font-mono">
          {(['all', 'pending', 'resolved'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded cursor-pointer ${filterStatus === st
                ? 'bg-[#00B4D8] text-[#0a1628] font-bold'
                : 'text-[#8a97a8] hover:text-white'
                }`}
            >
              {st === 'all' ? '全部批注' : st === 'pending' ? '待裁决 (1)' : '已解决 (1)'}
            </button>
          ))}
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {filtered.map((comment) => (
          <div
            key={comment.id}
            className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] space-y-3 hover:border-[rgba(0,180,216,0.3)] transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Thumb
                  src={comment.avatar}
                  label={comment.author}
                  className="w-8 h-8 rounded-full object-cover border border-[#00e0b8]/40"
                />
                <div>
                  <span className="text-xs font-bold text-[#e8f0f8] block">{comment.author}</span>
                  <span className="text-[10px] text-[#8a97a8]">{comment.role} · {comment.createdAt}</span>
                </div>
              </div>

              {/* Anchor Target Jump Button */}
              <button
                type="button"
                onClick={() => onNavigate(comment.targetPage)}
                className="px-2.5 py-1 rounded bg-[#152640] hover:bg-[#00e0b8] hover:text-[#0a1628] text-[#00e0b8] text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>锚点: {comment.targetAnchor}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-[#e8f0f8] leading-relaxed pl-10">
              {comment.content}
            </p>

            {/* Agent Responses / Discussion Thread */}
            {comment.replies.map((reply, i) => (
              <div
                key={i}
                className="ml-10 p-3 rounded-lg bg-[#0a1628] border border-[rgba(0,224,184,0.2)] text-xs space-y-1"
              >
                <div className="flex items-center gap-1.5 text-[#00e0b8] font-bold">
                  <Bot className="w-3.5 h-3.5" />
                  <span>{reply.author}</span>
                  <span className="text-[10px] text-[#5c697a] font-normal font-mono">
                    ({reply.createdAt})
                  </span>
                </div>
                <p className="text-[#8a97a8] text-[11px] leading-relaxed">
                  {reply.content}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollabCommentsPage;
