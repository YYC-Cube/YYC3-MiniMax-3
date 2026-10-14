/**
 * @file: AgentAvatar.test.tsx
 * @description: AgentAvatar 交互契约测试 — AGENTS_MAP 联动/未知降级/状态色脉冲/onClick 契约/文案分支
 * @author: AI Tutor <minimax>
 * @version: v1.0.0
 * @created: 2026-10-12
 * @updated: 2026-10-12
 * @status: active
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AGENTS_MAP } from '../../../tokens';
import { AgentAvatar } from '../AgentAvatar';

const [firstAgentId] = Object.keys(AGENTS_MAP);
const firstAgent = AGENTS_MAP[firstAgentId];

type El = {
  type: unknown;
  props: { onClick?: unknown; children?: unknown; className?: string };
};

describe('AgentAvatar 交互契约（零依赖元素树派发）', () => {
  it('AGENTS_MAP 联动：真实 agentId 渲染名字首字母与 token 色边框', () => {
    const html = renderToStaticMarkup(
      <AgentAvatar agentId={firstAgentId} />
    );
    expect(html).toContain(firstAgent.name.slice(0, 1));
    expect(html).toContain(`border:1.5px solid ${firstAgent.color}`);
    expect(html).toContain(
      `${firstAgent.name} (${firstAgent.role}) - ${firstAgent.desc}`
    );
  });

  it('未知 agentId 降级：Agent 首字母 / 协同单元 / 默认主色 #00e0b8', () => {
    const html = renderToStaticMarkup(<AgentAvatar agentId="unknown-agent-x" />);
    expect(html).toContain('>A<');
    expect(html).toContain('border:1.5px solid #00e0b8');
  });

  it('status 色映射：degrade 红色双点；speaking 唯一 ping；thinking 外圈脉冲 + ping', () => {
    const degrade = renderToStaticMarkup(
      <AgentAvatar agentId={firstAgentId} status="degrade" />
    );
    expect(degrade.match(/background-color:#ff4422/g)).toHaveLength(2);
    expect(degrade).not.toContain('animate-ping');

    const speaking = renderToStaticMarkup(
      <AgentAvatar agentId={firstAgentId} status="speaking" />
    );
    expect(speaking.match(/animate-ping/g)).toHaveLength(1);
    expect(speaking).toContain('background-color:#00e0b8');

    const thinking = renderToStaticMarkup(
      <AgentAvatar agentId={firstAgentId} status="thinking" />
    );
    expect(thinking.match(/animate-ping/g)).toHaveLength(1);
    expect(thinking).toContain('animate-pulse');
    expect(thinking).toContain('background-color:#7B8CFF');
  });

  it('onClick 契约：传入则根节点可点击并派发；不传则无 cursor-pointer', () => {
    const onClick = vi.fn();
    const clickable = AgentAvatar({ agentId: firstAgentId, onClick }) as El;
    expect(clickable.props.onClick).toBe(onClick);
    expect(clickable.props.className).toContain('cursor-pointer');
    (clickable.props.onClick as () => void)();
    expect(onClick).toHaveBeenCalledTimes(1);

    const plain = AgentAvatar({ agentId: firstAgentId }) as El;
    expect(plain.props.onClick).toBeUndefined();
    expect(plain.props.className).not.toContain('cursor-pointer');
  });

  it('showName/showRole 分支：默认无文案区；按需渲染名字与角色 span（与 title 属性解耦）', () => {
    const nameSpan = `>${firstAgent.name}</span>`;
    const roleSpan = `>${firstAgent.role}</span>`;

    const bare = renderToStaticMarkup(<AgentAvatar agentId={firstAgentId} />);
    expect(bare).not.toContain(nameSpan);
    expect(bare).not.toContain(roleSpan);

    const labeled = renderToStaticMarkup(
      <AgentAvatar agentId={firstAgentId} showName showRole />
    );
    expect(labeled).toContain(nameSpan);
    expect(labeled).toContain(roleSpan);

    const nameOnly = renderToStaticMarkup(
      <AgentAvatar agentId={firstAgentId} showName />
    );
    expect(nameOnly).toContain(nameSpan);
    expect(nameOnly).not.toContain(roleSpan);
  });
});
