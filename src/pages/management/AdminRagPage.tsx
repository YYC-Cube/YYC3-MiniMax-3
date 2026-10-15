/**
 * @file: AdminRagPage.tsx
 * @description: 页面组件：AdminRagPage
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import {
  Upload
} from 'lucide-react';
import React, { useState } from 'react';
import { EmptyState, ErrorState, LoadingState, NoPermissionState } from '../../components/common/States';
import { DevModeMeta, PageId, ViewState } from '../../types';

interface AdminRagPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_RAG: DevModeMeta = {
  apiEndpoint: '/api/v2/management/rag/collections',
  confidenceSource: 'Milvus 向量检索相似度 (Cosine Top-k) + BGE-Reranker',
  memoryScope: 'global',
  learningSampleSource: '向量检索未命中 Query 自动汇聚至微调样本池',
  driveModePolicy: '知识库重建索引期间降级为本地纯文本精确匹配模式',
  stateSwitchConditions: {
    empty: '当前向量知识库未建立任何集合与切块索引',
    loading: 'Milvus 正在构建 HNSW 向量索引与稠密特征嵌入',
    error: '向量数据库集群连接超时 (MILVUS_NODE_TIMEOUT)',
    forbidden: '用户无向量知识库增删改与测试检索权限',
  },
};

export const AdminRagPage: React.FC<AdminRagPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const [testQuery, setTestQuery] = useState('叶凌霄本命飞剑外观特征与施法禁忌');
  const [selectedKb, setSelectedKb] = useState('世界观设定库');

  if (viewState === 'loading') return <LoadingState message="连接 Milvus 向量集群并构建 HNSW 索引..." />;
  if (viewState === 'empty') return <EmptyState title="知识库为空" actionText="上传第一份文档" />;
  if (viewState === 'error') return <ErrorState title="向量知识库服务异常" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无 RAG 知识库管理权限" />;

  const collections = [
    { name: '世界观设定库', docs: 12, chunks: 1420, vectors: 1420, hitRate: '98.4%' },
    { name: '爆款漫剧分镜库', docs: 34, chunks: 3890, vectors: 3890, hitRate: '94.2%' },
    { name: '平台规则与敏感词库', docs: 8, chunks: 640, vectors: 640, hitRate: '99.8%' },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#e8f0f8]">RAG 与知识库管理 (Vector Knowledge)</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#00B4D8] border border-[rgba(0,180,216,0.3)]">
              Milvus / RAGFlow 对标
            </span>
          </div>
          <p className="text-xs text-[#8a97a8] mt-1">
            世界观/剧本/规则库统一向量化 · 毫秒级语义检索 · 检索测试验证台
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs cursor-pointer shadow-md shadow-teal-950/40"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>上传并切块索引文档</span>
        </button>
      </div>

      {/* Main Split: Left Knowledge Collections, Right Test Bench */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Collections List */}
        <div className="w-full lg:w-1/2 rounded-xl bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] p-4 space-y-3">
          <span className="text-xs font-bold text-[#e8f0f8] block">向量知识库集合</span>

          <div className="space-y-2.5">
            {collections.map((col, i) => (
              <div
                key={i}
                onClick={() => setSelectedKb(col.name)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${selectedKb === col.name
                  ? 'bg-[#152640] border-[#00B4D8]'
                  : 'bg-[#0a1628] border-[rgba(255,255,255,0.06)] hover:border-[#00B4D8]/40'
                  }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-[#e8f0f8]">{col.name}</h4>
                  <span className="text-[10px] font-mono text-[#22C55E]">命中率 {col.hitRate}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-[#8a97a8]">
                  <span>文档数: {col.docs}</span>
                  <span>切块数: {col.chunks}</span>
                  <span>向量数: {col.vectors}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Retrieval Test Bench */}
        <div className="w-full lg:w-1/2 rounded-xl bg-[#0f1e35] border border-[rgba(0,180,216,0.2)] p-4 space-y-3 domain-border-mgmt">
          <span className="text-xs font-bold text-[#e8f0f8] block">实时检索验证测试台</span>

          <div className="flex items-center gap-2 bg-[#0a1628] p-2 rounded-lg border border-[rgba(255,255,255,0.08)]">
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="输入检索词…"
              className="flex-1 min-w-0 bg-transparent text-xs text-[#e8f0f8] focus:outline-none"
            />
            <button
              type="button"
              className="px-3 py-1 rounded bg-[#00B4D8] text-[#0a1628] font-bold text-xs cursor-pointer"
            >
              检索 Top-3
            </button>
          </div>

          <div className="p-3 rounded-lg bg-[#0a1628] border border-[rgba(0,224,184,0.2)] space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#00e0b8]">
              <span>[Top-1 命中] 相似度: 0.94</span>
              <span>召回用时: 14ms</span>
            </div>
            <p className="text-[#8a97a8] text-[11px] leading-relaxed">
              “叶凌霄本命飞剑名唤‘冰魄’，平时化作食指上的一枚古拙墨玉戒。在现代室内光线下，聚光角度超过 45 度时会映射出微弱晶莹水雾。”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRagPage;
