/**
 * @file: States.tsx
 * @description: 组件：States
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import React from 'react';
import { AlertCircle, ShieldAlert, FolderPlus, RefreshCw, Cpu, ArrowRight } from 'lucide-react';

interface StateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<StateProps> = ({
  title = '暂无产线数据',
  description = '当前尚未创建任何实体或任务，您可以立即发起新建或由 AI Family 自动立项生成。',
  actionText = '创建第一项',
  onAction,
  secondaryActionText = '由 AI 创想·灵韵 推荐立项',
  onSecondaryAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)] my-6 ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-[#152640] border border-[rgba(0,224,184,0.25)] flex items-center justify-center text-[#00e0b8] mb-4 shadow-lg shadow-teal-950/20">
        <FolderPlus className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-[#e8f0f8] mb-1">{title}</h3>
      <p className="text-xs text-[#8a97a8] max-w-md leading-relaxed mb-6">
        {description}
      </p>
      <div className="flex items-center gap-3">
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="px-4 py-2 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
        {onSecondaryAction && (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="px-4 py-2 rounded-lg bg-[#152640] hover:bg-[#1f3659] text-[#00e0b8] border border-[rgba(0,224,184,0.3)] text-xs font-medium transition-colors cursor-pointer"
          >
            {secondaryActionText}
          </button>
        )}
      </div>
    </div>
  );
};

export const LoadingState: React.FC<{ message?: string; subMessage?: string; className?: string }> = ({
  message = '产线运算中，ReAct-C 九步闭环执行中...',
  subMessage = '元启·天枢 正在调度 DGX 节点资源',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-16 text-center rounded-2xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)] my-6 ${className}`}
    >
      <div className="relative mb-6">
        <div className="w-14 h-14 rounded-full border-2 border-[rgba(0,224,184,0.15)] border-t-[#00e0b8] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-[#00e0b8]">
          <Cpu className="w-5 h-5 animate-pulse" />
        </div>
      </div>
      <h3 className="text-sm font-bold text-[#e8f0f8] mb-1 font-mono tracking-wide">
        {message}
      </h3>
      <p className="text-xs text-[#8a97a8]">{subMessage}</p>
    </div>
  );
};

export const ErrorState: React.FC<
  StateProps & { errorCode?: string; fallbackManualPath?: string }
> = ({
  title = '算力节点通信超时或异常',
  description = '后端推理引擎返回异常响应。系统已自动切入降级保护路径，禁止静默失败。',
  errorCode = 'ERR_VLLM_SOCKET_TIMEOUT_504',
  fallbackManualPath = '已启用本地手工降级路径：支持直接上传本地预渲染视频片段',
  actionText = '重试当前链路',
  // 恢复动作单源（R13）：错误恢复默认整页重载，30 处调用点零 prop；未来改 refetch 只改此处
  onAction = () => window.location.reload(),
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-[#0f1e35] border border-[rgba(255,68,34,0.3)] my-6 relative overflow-hidden ${className}`}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#ff4422]" />
      <div className="w-16 h-16 rounded-2xl bg-[rgba(255,68,34,0.12)] border border-[rgba(255,68,34,0.3)] flex items-center justify-center text-[#ff4422] mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#152640] text-[#ff4422] border border-[rgba(255,68,34,0.25)] mb-2">
        {errorCode}
      </span>
      <h3 className="text-base font-bold text-[#e8f0f8] mb-1">{title}</h3>
      <p className="text-xs text-[#8a97a8] max-w-md leading-relaxed mb-3">
        {description}
      </p>

      {/* 规范红线：必须给出降级提示与手工替代路径 */}
      <div className="p-3 mb-6 rounded-lg bg-[#152640] border border-[rgba(92,105,122,0.4)] text-left max-w-md">
        <span className="text-[11px] font-bold text-[#FFB020] block mb-1">
          降级路径已激活 (Degraded Fallback)
        </span>
        <span className="text-xs text-[#8a97a8]">{fallbackManualPath}</span>
      </div>

      <div className="flex items-center gap-3">
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="px-4 py-2 rounded-lg bg-[#ff4422] hover:bg-[#e03818] text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{actionText}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export const NoPermissionState: React.FC<
  StateProps & { requiredRole?: string }
> = ({
  title = '需要管理员或导演级权限',
  description = '当前账户角色尚未获得本模块的高级操作授权（如 Prompt 版本发布、L0 全自动模式审批、敏感脱敏审计等）。',
  requiredRole = 'RBAC 级别：Director / Admin',
  actionText = '申请提权审批',
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-[#0f1e35] border border-[rgba(255,176,32,0.3)] my-6 relative overflow-hidden ${className}`}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#FFB020]" />
      <div className="w-16 h-16 rounded-2xl bg-[rgba(255,176,32,0.12)] border border-[rgba(255,176,32,0.3)] flex items-center justify-center text-[#FFB020] mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#152640] text-[#FFB020] border border-[rgba(255,176,32,0.25)] mb-2">
        {requiredRole}
      </span>
      <h3 className="text-base font-bold text-[#e8f0f8] mb-1">{title}</h3>
      <p className="text-xs text-[#8a97a8] max-w-md leading-relaxed mb-6">
        {description}
      </p>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-4 py-2 rounded-lg bg-[#152640] hover:bg-[#1a2f4e] text-[#FFB020] border border-[rgba(255,176,32,0.3)] text-xs font-bold transition-colors cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
