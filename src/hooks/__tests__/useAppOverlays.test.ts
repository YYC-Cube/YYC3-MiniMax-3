/**
 * YYC³ App Shell — useAppOverlays 编排规则测试（R7 专项 R7-A）
 *
 * 零 DOM 依赖策略：vi.mock('react') 最小 Hook 模拟栈（与 useApiData.test 同源），
 * 覆盖浮层互斥与导航编排规则，不引入 jsdom。
 * @file: useAppOverlays.test.ts
 * @description: YYC³ App Shell — useAppOverlays 编排规则测试
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
*/
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_AGENT_ID } from '../../tokens';
import type { AppOverlayActions, AppOverlays } from '../useAppOverlays';
import { useAppOverlays } from '../useAppOverlays';

const h = vi.hoisted(() => ({
  cells: [] as { value: unknown; set: (v: unknown) => void }[],
  cellIndex: 0,
}));

vi.mock('react', () => ({
  useState: (initial: unknown) => {
    const i = h.cellIndex++;
    const existing = h.cells[i];
    if (existing) return [existing.value, existing.set] as const;
    const cell = {
      value: initial,
      // 与 React 语义一致：支持值与 updater 函数两种形态（Hook 内 toggle 用函数式更新）
      set: (v: unknown) => {
        cell.value = typeof v === 'function' ? (v as (prev: unknown) => unknown)(cell.value) : v;
      },
    };
    h.cells[i] = cell;
    return [cell.value, cell.set] as const;
  },
}));

/** 渲染一轮 Hook；setState 后重复调用即为重渲染（state 单元保留） */
function render(): { overlays: AppOverlays; actions: AppOverlayActions } {
  h.cellIndex = 0;
  return useAppOverlays(vi.fn());
}

beforeEach(() => {
  h.cells = [];
  h.cellIndex = 0;
});

describe('useAppOverlays — 浮层编排规则', () => {
  it('初始态：全部浮层关闭，默认智能体选中', () => {
    const { overlays } = render();
    expect(overlays).toEqual({
      isDevModeOpen: false,
      isPrototypeOpen: false,
      isCommandOpen: false,
      isFamilyWidgetOpen: false,
      isCognitionWidgetOpen: false,
      isCounselOpen: false,
      selectedAgentId: DEFAULT_AGENT_ID,
    });
  });

  it('toggleDevMode：开 ↔ 关往返', () => {
    const first = render();
    first.actions.toggleDevMode();
    expect(render().overlays.isDevModeOpen).toBe(true);
    render().actions.toggleDevMode();
    expect(render().overlays.isDevModeOpen).toBe(false);
  });

  it('openCognition 互斥：关 W1 家族浮层 → 开 W2 并记录智能体', () => {
    render().actions.toggleFamilyWidget();
    expect(render().overlays.isFamilyWidgetOpen).toBe(true);

    render().actions.openCognition('agent-x');
    const after = render().overlays;
    expect(after.isFamilyWidgetOpen).toBe(false);
    expect(after.isCognitionWidgetOpen).toBe(true);
    expect(after.selectedAgentId).toBe('agent-x');
  });

  it('switchToW1 反向互斥：关 W2 → 开 W1', () => {
    const { actions } = render();
    actions.openCognition('agent-y');
    actions.switchToW1();
    const after = render().overlays;
    expect(after.isCognitionWidgetOpen).toBe(false);
    expect(after.isFamilyWidgetOpen).toBe(true);
  });

  it('adoptArbitration：关闭议事厅并按去向导航（true → admin-agents / false → production）', () => {
    const navigate = vi.fn();
    h.cellIndex = 0;
    const { actions } = useAppOverlays(navigate);
    actions.openCounsel();
    actions.adoptArbitration(true);
    expect(render().overlays.isCounselOpen).toBe(false);
    expect(navigate).toHaveBeenCalledWith('admin-agents');

    h.cells = [];
    h.cellIndex = 0;
    const second = useAppOverlays(navigate);
    second.actions.openCounsel();
    second.actions.adoptArbitration(false);
    expect(navigate).toHaveBeenLastCalledWith('production');
  });

  it('humanOverride：关闭议事厅并导航至分镜台', () => {
    const navigate = vi.fn();
    h.cellIndex = 0;
    const { actions } = useAppOverlays(navigate);
    actions.openCounsel();
    actions.humanOverride();
    expect(render().overlays.isCounselOpen).toBe(false);
    expect(navigate).toHaveBeenCalledWith('storyboard');
  });
});
