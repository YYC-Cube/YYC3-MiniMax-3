/**
 * @file: ScriptListPage.tsx
 * @description: 页面组件：ScriptListPage
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
  Layers,
  Network,
  Plus,
  Search
} from 'lucide-react';
import React, { useState } from 'react';
import { ENDPOINTS, SNAPSHOT, scriptService, useApiData } from '../../api';
import BatchActionBar from '../../components/common/BatchActionBar';
import GateBadge from '../../components/common/GateBadge';
import { EmptyState, ErrorState, LoadingState, NoPermissionState } from '../../components/common/States';
import Thumb from '../../components/common/Thumb';
import { GATE_CURRENT_ID } from '../../tokens';
import { DevModeMeta, PageId, ViewState } from '../../types';

interface ScriptListPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_SCRIPT_LIST: DevModeMeta = {
  apiEndpoint: ENDPOINTS.scripts,
  confidenceSource: '创想·灵韵 (创意生成) + 语枢·万物 (语义结构化解析)',
  memoryScope: 'project',
  learningSampleSource: '剧本长文本抽取 Few-shot 规则库',
  driveModePolicy: '剧本文本提取默认 L1 模式，结构化实体需人工核准',
  stateSwitchConditions: {
    empty: '当前剧本库中尚无任何剧本文档',
    loading: '20 万字小说长文本语义图谱抽块解析中',
    error: '文档解析服务返回非结构化畸变错误 (ERR_DOCX_CORRUPT)',
    forbidden: '用户无编导级剧本编辑与立项权限',
  },
};

export const ScriptListPage: React.FC<ScriptListPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const { data: scriptsData, loading } = useApiData(scriptService.list, SNAPSHOT.scriptList);
  const scripts = scriptsData ?? [];
  const [selectedGenre, setSelectedGenre] = useState<string>('全部');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const previewScript = (previewId ? scripts.find((s) => s.id === previewId) : scripts[0]) ?? null;
  const [searchQuery, setSearchQuery] = useState('');

  if (viewState === 'loading') return <LoadingState message="正在解析剧本文档结构与世界观实体..." />;
  if (viewState === 'empty') return <EmptyState title="还没有剧本，上传或让 AI 写一个" actionText="上传小说/剧本" onAction={() => onNavigate('library')} />;
  if (viewState === 'error') return <ErrorState title="剧本解析服务异常" />;
  if (viewState === 'forbidden') return <NoPermissionState title="暂无剧本库访问权限" />;
  if (loading) return <LoadingState message="正在解析剧本文档结构与世界观实体..." />;

  const genres = ['全部', '都市', '古风', '悬疑', '甜宠', '科幻'];

  const filteredScripts = scripts.filter((s) => {
    const matchesGenre = selectedGenre === '全部' || s.genre === selectedGenre;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredScripts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredScripts.map((s) => s.id));
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header & AI Family Tag */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-[#e8f0f8]">剧本工作台</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#00e0b8] border border-[rgba(0,224,184,0.3)]">
              Notion Database Mode
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[#8a97a8]">
              <span>协同 Agent:</span>
              <span className="text-[#00e0b8] font-bold">元启·天枢</span>
              <span>+</span>
              <span className="text-[#FF7A5C] font-bold">创想·灵韵</span>
            </div>
          </div>
          <p className="text-xs text-[#8a97a8] mt-1">
            支持 20 万字小说长文本上传，自动解构为场次、角色表、场景表并构建知识图谱
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('project-lore')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#152640] hover:bg-[#1f3659] text-[#00B4D8] border border-[rgba(0,180,216,0.3)] text-xs font-medium cursor-pointer"
          >
            <Network className="w-3.5 h-3.5" />
            <span>批量提取世界观</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('script-detail')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs cursor-pointer shadow-lg shadow-teal-950/40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新建剧本</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Search, Genre Chips, Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)]">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.08)] text-xs text-[#8a97a8] w-full focus-within:border-[#00e0b8]">
            <Search className="w-3.5 h-3.5 text-[#5c697a]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索剧本名称、角色、简介..."
              className="bg-transparent text-xs text-[#e8f0f8] placeholder-[#5c697a] focus:outline-none flex-1"
            />
          </div>
        </div>

        {/* Genre Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {genres.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${selectedGenre === genre
                ? 'bg-[#00e0b8] text-[#0a1628] font-bold shadow-sm'
                : 'bg-[#152640] text-[#8a97a8] hover:text-[#e8f0f8]'
                }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split: Table View + Right Structured Preview Drawer */}
      <div className="flex gap-5">
        {/* Left: Script Table */}
        <div className="flex-1 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#152640] text-[#8a97a8] border-b border-[rgba(255,255,255,0.08)]">
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredScripts.length && filteredScripts.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-[rgba(0,224,184,0.3)] text-[#00e0b8] cursor-pointer"
                    />
                  </th>
                  <th className="p-3 font-semibold">剧名</th>
                  <th className="p-3 font-semibold">题材</th>
                  <th className="p-3 font-semibold font-mono">字数</th>
                  <th className="p-3 font-semibold">角色/场景</th>
                  <th className="p-3 font-semibold">图谱完备度</th>
                  <th className="p-3 font-semibold">门禁阶段</th>
                  <th className="p-3 font-semibold">最近编辑</th>
                  <th className="p-3 font-semibold text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                {filteredScripts.map((script) => {
                  const isSelected = selectedIds.includes(script.id);
                  const isPreview = previewScript?.id === script.id;

                  return (
                    <tr
                      key={script.id}
                      onClick={() => setPreviewId(script.id)}
                      className={`hover:bg-[#152640]/70 transition-colors cursor-pointer ${isPreview ? 'bg-[#152640]/50' : ''
                        }`}
                    >
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(script.id)}
                          className="rounded border-[rgba(0,224,184,0.3)] text-[#00e0b8] cursor-pointer"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.1)] overflow-hidden shrink-0">
                            <Thumb
                              src={script.characters[0]?.avatar}
                              label={script.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-[#e8f0f8] hover:text-[#00e0b8] transition-colors block">
                              {script.title}
                            </span>
                            <span className="text-[10px] text-[#5c697a] truncate max-w-[200px] block">
                              {script.synopsis}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-[#152640] text-[#00e0b8] text-[11px] font-mono">
                          {script.genre}
                        </span>
                      </td>
                      <td className="p-3 font-mono tabular-nums text-[#8a97a8]">
                        {(script.wordCount / 10000).toFixed(1)} 万字
                      </td>
                      <td className="p-3 text-[#8a97a8]">
                        <span>{script.characterCount} 角色 / {script.sceneCount} 场景</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-[#0a1628] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#00B4D8]"
                              style={{ width: `${script.loreCompleteness}%` }}
                            />
                          </div>
                          <span className="font-mono text-[10px] text-[#00B4D8]">
                            {script.loreCompleteness}%
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <GateBadge level={script.gateLevel} active={script.gateLevel === GATE_CURRENT_ID} />
                      </td>
                      <td className="p-3 text-[#5c697a] font-mono text-[11px]">
                        {script.lastEdited}
                      </td>
                      <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onNavigate('script-detail')}
                            className="px-2 py-1 rounded bg-[#0a1628] hover:bg-[#152640] text-[#00e0b8] font-medium text-xs transition-colors cursor-pointer"
                          >
                            编辑
                          </button>
                          <button
                            type="button"
                            onClick={() => onNavigate('storyboard')}
                            className="px-2 py-1 rounded bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs transition-colors cursor-pointer"
                          >
                            转分镜
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

        {/* Right: Structured Entity Drawer (320px) */}
        {previewScript && (
          <div className="w-80 shrink-0 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.15)] p-4 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-[rgba(255,255,255,0.06)] pb-3">
                <div>
                  <span className="text-[10px] font-mono text-[#00e0b8] uppercase">结构化剧本预览</span>
                  <h3 className="text-sm font-bold text-[#e8f0f8]">{previewScript.title}</h3>
                </div>
                <GateBadge level={previewScript.gateLevel} />
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#8a97a8] uppercase tracking-wider block mb-1">
                  剧目梗概
                </span>
                <p className="text-xs text-[#8a97a8] leading-relaxed bg-[#0a1628] p-2.5 rounded-lg border border-[rgba(255,255,255,0.06)]">
                  {previewScript.synopsis}
                </p>
              </div>

              {/* Characters List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#8a97a8] uppercase tracking-wider">
                    提取角色表 ({previewScript.characters.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate('assets')}
                    className="text-[10px] text-[#00e0b8] hover:underline cursor-pointer"
                  >
                    查看资产库
                  </button>
                </div>
                <div className="space-y-2">
                  {previewScript.characters.map((char, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.06)] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Thumb
                          src={char.avatar}
                          label={char.name}
                          className="w-7 h-7 rounded-full object-cover border border-[#00e0b8]/40"
                        />
                        <div>
                          <span className="text-xs font-bold text-[#e8f0f8] block">{char.name}</span>
                          <span className="text-[10px] text-[#8a97a8] truncate max-w-[140px] block">
                            {char.roleDesc}
                          </span>
                        </div>
                      </div>
                      {char.refTrained ? (
                        <span className="text-[9px] font-mono px-1 rounded bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30">
                          Ref 已绑定
                        </span>
                      ) : (
                        <span className="text-[9px] text-[#5c697a]">待训练</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Scenes List */}
              <div>
                <span className="text-[11px] font-bold text-[#8a97a8] uppercase tracking-wider block mb-2">
                  主要场景表 ({previewScript.scenes.length})
                </span>
                <div className="space-y-1.5">
                  {previewScript.scenes.map((sc, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs"
                    >
                      <span className="text-[#e8f0f8]">{sc.name}</span>
                      <span className="text-[10px] text-[#8a97a8] font-mono">{sc.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[rgba(255,255,255,0.06)]">
              <button
                type="button"
                onClick={() => onNavigate('storyboard')}
                className="w-full py-2.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-teal-950/40"
              >
                <span>一键转分镜设计器</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Multi-Selection Batch Action Bar */}
      <BatchActionBar
        selectedCount={selectedIds.length}
        totalCount={filteredScripts.length}
        onClear={() => setSelectedIds([])}
        actions={[
          {
            label: '批量转分镜',
            icon: <Layers className="w-3.5 h-3.5" />,
            variant: 'primary',
            onClick: () => onNavigate('storyboard'),
          },
          {
            label: '批量提取世界观图谱',
            icon: <Network className="w-3.5 h-3.5" />,
            onClick: () => onNavigate('project-lore'),
          },
          {
            label: '归档剧目',
            variant: 'secondary',
            onClick: () => setSelectedIds([]),
          },
        ]}
      />
    </div>
  );
};

export default ScriptListPage;
