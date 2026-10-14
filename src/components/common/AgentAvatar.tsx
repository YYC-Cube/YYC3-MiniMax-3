/**
 * @file: AgentAvatar.tsx
 * @description: 组件：AgentAvatar
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import React from 'react';
import { AGENTS_MAP } from '../../tokens';

export type AgentStatus = 'online' | 'offline' | 'thinking' | 'speaking' | 'learning' | 'degrade';

interface AgentAvatarProps {
  agentId: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: AgentStatus;
  showName?: boolean;
  showRole?: boolean;
  onClick?: () => void;
  className?: string;
}

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  agentId,
  size = 'md',
  status = 'online',
  showName = false,
  showRole = false,
  onClick,
  className = '',
}) => {
  const agent = AGENTS_MAP[agentId] || {
    id: agentId,
    name: 'Agent',
    codeName: agentId,
    color: '#00e0b8',
    role: '协同单元',
    desc: 'YYC³ AI 智能体',
    clockPosition: '12:00',
    degree: 0,
  };

  const dimensions = {
    xs: { box: 'w-6 h-6 text-[10px]', ring: 'p-0.5', dot: 'w-1.5 h-1.5 -bottom-0.5 -right-0.5' },
    sm: { box: 'w-8 h-8 text-xs', ring: 'p-0.5', dot: 'w-2 h-2 -bottom-0.5 -right-0.5' },
    md: { box: 'w-10 h-10 text-sm', ring: 'p-1', dot: 'w-2.5 h-2.5 bottom-0 right-0' },
    lg: { box: 'w-14 h-14 text-base', ring: 'p-1', dot: 'w-3 h-3 bottom-0.5 right-0.5' },
    xl: { box: 'w-20 h-20 text-xl', ring: 'p-1.5', dot: 'w-3.5 h-3.5 bottom-1 right-1' },
  }[size];

  // First letter of the surname part
  const initial = agent.name.slice(0, 1);

  const statusColors = {
    online: '#22C55E',
    offline: '#5c697a',
    thinking: '#7B8CFF',
    speaking: '#00e0b8',
    learning: '#B57BFF',
    degrade: '#ff4422',
  }[status];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 ${onClick ? 'cursor-pointer group' : ''} ${className}`}
      title={`${agent.name} (${agent.role}) - ${agent.desc}`}
    >
      <div className="relative">
        <div
          className={`rounded-full flex items-center justify-center transition-all duration-200 ${dimensions.ring} ${
            status === 'thinking' ? 'animate-pulse' : ''
          }`}
          style={{
            background: `radial-gradient(circle, ${agent.color}30 0%, transparent 80%)`,
            border: `1.5px solid ${agent.color}`,
            boxShadow: `0 0 8px ${agent.color}25`,
          }}
        >
          <div
            className={`rounded-full flex items-center justify-center font-bold select-none text-[#e8f0f8] bg-[#0f1e35] ${dimensions.box}`}
          >
            {initial}
          </div>
        </div>

        {/* Status Dot */}
        <span
          className={`absolute rounded-full border-2 border-[#0a1628] ${dimensions.dot} ${
            status === 'speaking' || status === 'thinking' ? 'animate-ping' : ''
          }`}
          style={{ backgroundColor: statusColors }}
        />
        <span
          className={`absolute rounded-full border-2 border-[#0a1628] ${dimensions.dot}`}
          style={{ backgroundColor: statusColors }}
        />
      </div>

      {(showName || showRole) && (
        <div className="flex flex-col text-left leading-tight">
          {showName && (
            <span
              className="text-xs font-medium text-[#e8f0f8] group-hover:text-[#00e0b8] transition-colors"
              style={{ color: showRole ? undefined : agent.color }}
            >
              {agent.name}
            </span>
          )}
          {showRole && (
            <span className="text-[11px] text-[#8a97a8]">{agent.role}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentAvatar;
