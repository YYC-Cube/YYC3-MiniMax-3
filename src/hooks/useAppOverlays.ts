/**
 * YYC³ App Shell — 浮层编排 Hook（R7 专项 R7-A）
 *
 * 将 App.tsx 的 6 个浮层开关 + 选中智能体 + 全部互斥/导航规则收拢为单点编排，
 * 规则零 DOM 可测；App 收敛为纯布局组合。不引入 Context/全局 store（单消费方，过度设计）。
 * @file: useAppOverlays.ts
 * @description: YYC³ App Shell — 浮层编排 Hook（互斥规则单点化）
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
*/

import { useState } from 'react';
import { DEFAULT_AGENT_ID } from '../tokens';
import type { PageId } from '../types';

/** 浮层开关快照（App 渲染层只读） */
export interface AppOverlays {
  isDevModeOpen: boolean;
  isPrototypeOpen: boolean;
  isCommandOpen: boolean;
  isFamilyWidgetOpen: boolean;
  isCognitionWidgetOpen: boolean;
  isCounselOpen: boolean;
  selectedAgentId: string;
}

/** 浮层编排动作（互斥与导航规则的唯一实现点） */
export interface AppOverlayActions {
  toggleDevMode: () => void;
  closeDevMode: () => void;
  togglePrototype: () => void;
  closePrototype: () => void;
  toggleCommand: () => void;
  closeCommand: () => void;
  toggleFamilyWidget: () => void;
  /** 深认知互斥：关 W1 家族浮层 → 开 W2 并记录智能体 */
  openCognition: (agentId: string) => void;
  closeCognition: () => void;
  /** W2 → W1 反向互斥 */
  switchToW1: () => void;
  openCounsel: () => void;
  closeCounsel: () => void;
  /** 议事厅仲裁采纳：关闭后按去向导航（收件箱 → 智能体管理，否则 → 生产台） */
  adoptArbitration: (toInbox: boolean) => void;
  /** 议事厅人工接管：关闭后转分镜台 */
  humanOverride: () => void;
}

export function useAppOverlays(navigate: (page: PageId) => void): { overlays: AppOverlays; actions: AppOverlayActions } {
  const [isDevModeOpen, setIsDevModeOpen] = useState(false);
  const [isPrototypeOpen, setIsPrototypeOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isFamilyWidgetOpen, setIsFamilyWidgetOpen] = useState(false);
  const [isCognitionWidgetOpen, setIsCognitionWidgetOpen] = useState(false);
  const [isCounselOpen, setIsCounselOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(DEFAULT_AGENT_ID);

  const overlays: AppOverlays = {
    isDevModeOpen,
    isPrototypeOpen,
    isCommandOpen,
    isFamilyWidgetOpen,
    isCognitionWidgetOpen,
    isCounselOpen,
    selectedAgentId,
  };

  const actions: AppOverlayActions = {
    toggleDevMode: () => setIsDevModeOpen((v) => !v),
    closeDevMode: () => setIsDevModeOpen(false),
    togglePrototype: () => setIsPrototypeOpen((v) => !v),
    closePrototype: () => setIsPrototypeOpen(false),
    toggleCommand: () => setIsCommandOpen((v) => !v),
    closeCommand: () => setIsCommandOpen(false),
    toggleFamilyWidget: () => setIsFamilyWidgetOpen((v) => !v),
    openCognition: (agentId) => {
      setSelectedAgentId(agentId);
      setIsFamilyWidgetOpen(false);
      setIsCognitionWidgetOpen(true);
    },
    closeCognition: () => setIsCognitionWidgetOpen(false),
    switchToW1: () => {
      setIsCognitionWidgetOpen(false);
      setIsFamilyWidgetOpen(true);
    },
    openCounsel: () => setIsCounselOpen(true),
    closeCounsel: () => setIsCounselOpen(false),
    adoptArbitration: (toInbox) => {
      setIsCounselOpen(false);
      navigate(toInbox ? 'admin-agents' : 'production');
    },
    humanOverride: () => {
      setIsCounselOpen(false);
      navigate('storyboard');
    },
  };

  return { overlays, actions };
}
