/**
 * @file: AdminPermissionPage.tsx
 * @description: 页面组件：AdminPermissionPage
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
  Shield,
  Users,
  Lock,
  History,
  Key,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { PageId, ViewState, DevModeMeta } from '../../types';
import { EmptyState, LoadingState, ErrorState, NoPermissionState } from '../../components/common/States';

interface AdminPermissionPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_ADMIN: DevModeMeta = {
  apiEndpoint: '/api/v2/management/rbac/matrix',
  confidenceSource: '智云·守护 (安全防护) + RBAC 鉴权拦截内核',
  memoryScope: 'global',
  learningSampleSource: '越权操作拦截与权限提权审批审计日志',
  driveModePolicy: '仅总监/管理员可授权开启全局 L0 全自动驾驶模式',
  stateSwitchConditions: {
    empty: '当前组织尚未配置团队成员与角色规则',
    loading: 'RBAC 四维权限矩阵与 90 天审计日志拉取中',
    error: '身份认证鉴权中心连接异常 (SSO_UNAVAILABLE)',
    forbidden: '用户无系统级管理员与权限分配权限',
  },
};

export const AdminPermissionPage: React.FC<AdminPermissionPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const [activeTab, setActiveTab] = useState<'members' | 'roles' | 'audit' | 'l0_auth'>('roles');

  if (viewState === 'loading') return <LoadingState message="加载企业级 RBAC 四角色权限矩阵与安全审计流..." />;
  if (viewState === 'empty') return <EmptyState title="未配置角色矩阵" />;
  if (viewState === 'error') return <ErrorState title="权限控制台服务异常" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无超级管理员权限" />;

  const modules = [
    { name: '剧本立项与编辑', admin: '读/写/审', director: '读/写/审', editor: '只读', ops: '只读' },
    { name: '分镜设计与提示词', admin: '读/写/审', director: '读/写/审', editor: '读/写', ops: '只读' },
    { name: 'LoRA 训练与权重调优', admin: '读/写/审', director: '读/写/审', editor: '不可见', ops: '不可见' },
    { name: '多轨道剪辑与特效', admin: '读/写/审', director: '读/写/审', editor: '读/写/审', ops: '只读' },
    { name: '全网分发与账号凭证', admin: '读/写/审', director: '读/写/审', editor: '不可见', ops: '读/写/审' },
    { name: 'L0 全自动模式启停', admin: '全权', director: '授权', editor: '禁止', ops: '禁止' },
    { name: 'System Prompt 修改发布', admin: '全权', director: '审批', editor: '禁止', ops: '禁止' },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#e8f0f8]">权限与安全审计 (RBAC & Audit)</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#00B4D8] border border-[rgba(0,180,216,0.3)]">
              四角色矩阵 · 90天审计留痕
            </span>
          </div>
          <p className="text-xs text-[#8a97a8] mt-1">
            管理员 / 编导 / 剪辑 / 运营审计 四维隔离 · L0 全自动模式独立授权审批
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-0.5 rounded-lg bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] text-xs">
          {(['roles', 'members', 'audit', 'l0_auth'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#00B4D8] text-[#0a1628] font-bold'
                  : 'text-[#8a97a8] hover:text-white'
              }`}
            >
              {tab === 'roles' ? '四角色权限矩阵' : tab === 'members' ? '团队成员' : tab === 'audit' ? '审计日志' : 'L0 驾驶授权'}
            </button>
          ))}
        </div>
      </div>

      {/* Role Matrix Table */}
      <div className="rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.12)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#152640] text-[#8a97a8] border-b border-[rgba(255,255,255,0.08)]">
                <th className="p-3 font-semibold">功能模块</th>
                <th className="p-3 font-semibold text-[#00e0b8]">管理员 (Admin)</th>
                <th className="p-3 font-semibold text-[#00B4D8]">编导总监 (Director)</th>
                <th className="p-3 font-semibold text-[#9d7cd8]">剪辑师 (Editor)</th>
                <th className="p-3 font-semibold text-[#FF7A5C]">运营审计 (Ops)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.04)] text-xs">
              {modules.map((m, i) => (
                <tr key={i} className="hover:bg-[#152640]/50 transition-colors">
                  <td className="p-3 font-medium text-[#e8f0f8]">{m.name}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-[#00e0b8]/15 text-[#00e0b8] font-mono text-[11px]">
                      {m.admin}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-[#00B4D8]/15 text-[#00B4D8] font-mono text-[11px]">
                      {m.director}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-[#9d7cd8]/15 text-[#9d7cd8] font-mono text-[11px]">
                      {m.editor}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-[#FF7A5C]/15 text-[#FF7A5C] font-mono text-[11px]">
                      {m.ops}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPermissionPage;
