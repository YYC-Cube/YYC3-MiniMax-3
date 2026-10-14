/**
 * @file: ScriptDetailPage.tsx
 * @description: 页面组件：ScriptDetailPage
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import React, { useState } from 'react';
import {
  Save,
  History,
  Download,
  Sparkles,
  ArrowRight,
  Check,
  X,
  Cpu,
  Inbox,
  Layers,
  ChevronRight,
  Film,
  User,
  MapPin,
  GitCommit,
} from 'lucide-react';
import { PageId, ViewState, DevModeMeta } from '../../types';
import { DriveModeId } from '../../tokens';
import DriveModeSwitch from '../../components/common/DriveModeSwitch';
import ConfidenceBadge from '../../components/common/ConfidenceBadge';
import { EmptyState, LoadingState, ErrorState, NoPermissionState } from '../../components/common/States';

interface ScriptDetailPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
  driveMode: DriveModeId;
  onDriveModeChange: (mode: DriveModeId) => void;
}

export const DEV_META_SCRIPT_DETAIL: DevModeMeta = {
  apiEndpoint: '/api/v2/production/scripts/sc-101/scenes',
  confidenceSource: '创想·灵韵 (Prompt 改写) + 智云·守护 (合规预检)',
  memoryScope: 'project',
  learningSampleSource: '剧本 Diff 采纳/拒绝偏好入库',
  driveModePolicy: 'L0 自动应用优化；L1 逐条 Diff 弹窗审核；L2 仅右侧输出建议',
  stateSwitchConditions: {
    empty: '当前剧本尚未划分任何场次与对白',
    loading: 'AI 冲突检查与上下文语义补全分析中',
    error: '剧本富文本渲染引擎解析失败',
    forbidden: '当前用户无该剧目主编导写权限',
  },
};

export const ScriptDetailPage: React.FC<ScriptDetailPageProps> = ({
  onNavigate,
  viewState = 'normal',
  driveMode,
  onDriveModeChange,
}) => {
  const [activeScene, setActiveScene] = useState(1);
  const [isSaved, setIsSaved] = useState(true);
  const [showDiff, setShowDiff] = useState(true);
  const [inboxChecked, setInboxChecked] = useState(true);

  if (viewState === 'loading') return <LoadingState message="剧本语意分析与角色对白着色中..." />;
  if (viewState === 'empty') return <EmptyState title="剧本场次为空" actionText="让 AI 创想·灵韵 生成第 1 场" />;
  if (viewState === 'error') return <ErrorState title="剧本文档同步异常" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无该剧本编辑权限" />;

  const scenes = [
    { id: 1, title: '第 1 场 · 苏家宴会厅', desc: '酒会冲突，陈少逼迫', shotsEst: 5 },
    { id: 2, title: '第 2 场 · 滨海造船厂', desc: '雨夜追逐，法宝初现', shotsEst: 8 },
    { id: 3, title: '第 3 场 · 云雾洞府', desc: '闭关吐纳，本命剑归位', shotsEst: 6 },
    { id: 4, title: '第 4 场 · 苏氏董事会', desc: '强力反击，立威全场', shotsEst: 7 },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.15)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('script')}
            className="text-xs text-[#8a97a8] hover:text-[#00e0b8] transition-colors cursor-pointer"
          >
            ← 剧本列表
          </button>
          <span className="text-[#5c697a]">/</span>
          <h2 className="text-sm font-bold text-[#e8f0f8]">
            《凌霄剑仙之都市重修》E01 剧本正文
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#152640] text-[#22C55E] border border-[#22C55E]/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            {isSaved ? '已自动保存' : '保存中...'}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Drive Mode Switch for this Task */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#5c697a]">单任务驾驶:</span>
            <DriveModeSwitch currentMode={driveMode} onChange={onDriveModeChange} size="sm" />
          </div>

          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#152640] text-[#8a97a8] hover:text-white text-xs border border-[rgba(255,255,255,0.08)] cursor-pointer"
            title="版本历史 (90天审计)"
          >
            <History className="w-3.5 h-3.5" />
            <span>v3.4 历史</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#152640] text-[#8a97a8] hover:text-white text-xs border border-[rgba(255,255,255,0.08)] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出 docx</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('storyboard')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs cursor-pointer shadow-md shadow-teal-950/40"
          >
            <span>一键转分镜 (预计 26 镜)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Three-Column Layout */}
      <div className="flex gap-4 h-[calc(100vh-14rem)]">
        {/* Left Column (240px): Scene Navigation Tree */}
        <div className="w-60 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)] p-3 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,255,255,0.06)]">
              <span className="text-xs font-bold text-[#e8f0f8]">第 1 集 · 场次导航</span>
              <span className="text-[10px] font-mono text-[#00e0b8]">共 4 场</span>
            </div>

            <div className="space-y-1.5">
              {scenes.map((sc) => {
                const isActive = activeScene === sc.id;
                return (
                  <div
                    key={sc.id}
                    onClick={() => setActiveScene(sc.id)}
                    className={`p-2.5 rounded-lg cursor-pointer transition-all ${
                      isActive
                        ? 'bg-[#152640] border-l-2 border-[#00e0b8] text-[#e8f0f8]'
                        : 'hover:bg-[#152640]/50 text-[#8a97a8]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold truncate">{sc.title}</span>
                      <span className="text-[10px] font-mono text-[#5c697a]">
                        {sc.shotsEst} 镜
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5c697a] truncate">{sc.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            className="w-full py-2 rounded-lg bg-[#152640] hover:bg-[#1f3659] text-[#00e0b8] border border-[rgba(0,224,184,0.25)] text-xs font-medium cursor-pointer"
          >
            + 添加新场次
          </button>
        </div>

        {/* Center Column: Screenplay Editor & AI Diff */}
        <div className="flex-1 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)] p-5 flex flex-col overflow-y-auto relative">
          {/* Editor Header / Formatting Toolbar */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(255,255,255,0.06)] text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#152640] text-[#00e0b8] font-bold">
                场次 1
              </span>
              <span className="text-[#8a97a8]">日内 · 苏家顶层酒会大厅</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#5c697a]">
                自动着色: 场景[紫] 角色[蓝] 对白[白] 动作[绿]
              </span>
            </div>
          </div>

          {/* Screenplay Content Body */}
          <div className="space-y-4 text-xs font-mono leading-relaxed flex-1">
            <div className="p-2 rounded bg-[#152640]/30 text-[#9d7cd8] font-bold">
              [SCENE 101] 内景 - 苏家顶层酒会大厅 - 日
            </div>

            <p className="text-[#8a97a8]">
              水晶吊灯洒下奢华暖光，衣香鬓影。酒会正中央，世家宾客推杯换盏。
              叶凌霄一身朴素深色西装，神态自若地坐在角落沙发，指尖轻轻摇晃着一杯香槟。
            </p>

            <div className="pl-4 border-l-2 border-[#00B4D8] space-y-1">
              <span className="text-[#00B4D8] font-bold block">叶凌霄（内心独白）:</span>
              <p className="text-[#e8f0f8]">
                “三百年了，这具肉躯终于感应到灵枢。待本命冰魄剑重铸之日，昔日仇怨，一并清算。”
              </p>
            </div>

            <p className="text-[#8a97a8]">
              皮鞋声清脆作响。陈浩天手端红酒，带着两名身材魁梧的黑衣保镖，带着戏谑冷笑径直走向叶凌霄。
            </p>

            <div className="pl-4 border-l-2 border-[#FF69B4] space-y-1">
              <span className="text-[#FF69B4] font-bold block">陈浩天（讥讽大笑）:</span>
              <p className="text-[#e8f0f8]">
                “哟，这不是我们苏家的大能人吗？听说连苏总的私密年会都没请你坐主桌，你倒是有闲心躲在这里偷酒喝？”
              </p>
            </div>

            {/* AI Diff Panel for Revision (创想·灵韵 创意优化建议) */}
            {showDiff && (
              <div className="p-4 rounded-xl bg-[#0a1628] border border-[rgba(0,224,184,0.3)] space-y-3 my-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FF7A5C]" />
                    <span className="font-bold text-[#e8f0f8]">
                      AI 创想·灵韵 改写建议（张力增强）
                    </span>
                    <ConfidenceBadge confidence={0.94} size="sm" />
                  </div>
                  <span className="text-[10px] text-[#8a97a8]">ReAct-C Step 5</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="p-2.5 rounded bg-[rgba(255,68,34,0.1)] border border-[rgba(255,68,34,0.25)]">
                    <span className="text-[#ff4422] font-bold block mb-1">- 原文 (陈浩天):</span>
                    <p className="text-[#8a97a8]">
                      “哟，这不是我们苏家的大能人吗？听说连苏总的私密年会都没请你坐主桌...”
                    </p>
                  </div>
                  <div className="p-2.5 rounded bg-[rgba(0,224,184,0.1)] border border-[rgba(0,224,184,0.25)]">
                    <span className="text-[#00e0b8] font-bold block mb-1">+ 建议改写 (黄金3秒打脸前奏):</span>
                    <p className="text-[#e8f0f8]">
                      “叶凌霄，苏家养条狗都知道摇尾巴，你这倒插门的三无赘婿，也配脏了这顶层水晶杯？”
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.06)]">
                  <label className="flex items-center gap-1.5 text-[11px] text-[#8a97a8] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inboxChecked}
                      onChange={(e) => setInboxChecked(e.target.checked)}
                      className="rounded border-[rgba(0,224,184,0.3)] text-[#00e0b8]"
                    />
                    <Inbox className="w-3 h-3 text-[#B57BFF]" />
                    <span>采纳后自动归档至 Learning Inbox</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowDiff(false)}
                      className="px-2.5 py-1 rounded bg-[#152640] hover:bg-[#1f3659] text-[#8a97a8] hover:text-white cursor-pointer"
                    >
                      拒绝建议
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDiff(false)}
                      className="px-3 py-1 rounded bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold cursor-pointer"
                    >
                      采纳改写
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (320px): Structured Entities & Storyboard Action */}
        <div className="w-80 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)] p-4 flex flex-col justify-between shrink-0 space-y-4 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,255,255,0.06)]">
              <span className="text-xs font-bold text-[#e8f0f8]">结构化资产绑定</span>
              <span className="text-[10px] text-[#00e0b8] font-mono">本场 2 人 1 景</span>
            </div>

            {/* Character Cards */}
            <div>
              <span className="text-[11px] font-bold text-[#8a97a8] uppercase tracking-wider block mb-2">
                出场角色
              </span>
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-[#0a1628] border border-[rgba(0,224,184,0.2)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#152640] border border-[#00e0b8] flex items-center justify-center font-bold text-[#00e0b8]">
                      叶
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#e8f0f8]">叶凌霄</span>
                      <span className="text-[10px] text-[#8a97a8] block">男主 / 冷峻剑修</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono px-1 rounded bg-[#00e0b8]/15 text-[#00e0b8]">
                    Ref 94%
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#152640] border border-[#FF69B4] flex items-center justify-center font-bold text-[#FF69B4]">
                      陈
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#e8f0f8]">陈浩天</span>
                      <span className="text-[10px] text-[#8a97a8] block">世家纨绔 / 反派</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono px-1 rounded bg-[#FFD700]/15 text-[#FFD700]">
                    Ref 89%
                  </span>
                </div>
              </div>
            </div>

            {/* Scene Card */}
            <div>
              <span className="text-[11px] font-bold text-[#8a97a8] uppercase tracking-wider block mb-2">
                绑现场景
              </span>
              <div className="p-2.5 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#e8f0f8] font-bold block">苏家顶层酒会大厅</span>
                  <span className="text-[10px] text-[#8a97a8]">现代奢华 · 冷暖交织射灯</span>
                </div>
                <span className="text-[10px] font-mono text-[#00B4D8]">一致性 92%</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[rgba(255,255,255,0.06)]">
            <button
              type="button"
              onClick={() => onNavigate('storyboard')}
              className="w-full py-2.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-teal-950/40"
            >
              <Film className="w-4 h-4" />
              <span>一键转分镜设计器</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptDetailPage;
