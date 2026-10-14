/**
 * @file: AdminCompliancePage.tsx
 * @description: 页面组件：AdminCompliancePage
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
  Lock,
  ShieldCheck,
  AlertTriangle,
  Key,
  History,
  CheckCircle2,
  FileCheck,
  Search,
  EyeOff,
} from 'lucide-react';
import { PageId, ViewState, DevModeMeta } from '../../types';
import { EmptyState, LoadingState, ErrorState, NoPermissionState } from '../../components/common/States';

interface AdminCompliancePageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_COMPLIANCE: DevModeMeta = {
  apiEndpoint: '/api/v2/management/compliance/audit-trail',
  confidenceSource: '智云·守护 (安全防护审计) + PII 敏感隐私自动扫描引擎',
  memoryScope: 'global',
  learningSampleSource: '各平台敏感词库动态变更与版权确权存证链',
  driveModePolicy: '检测到 PII 高危泄漏或版权确权不全时强制阻断全网发布',
  stateSwitchConditions: {
    empty: '当前系统审计日志为空，无任何合规拦截事件',
    loading: '五大平台最新敏感词库同步与合规规则更新中',
    error: '司法存证哈希校验失败或合规探针离线',
    forbidden: '用户无合规中心高密审计日志调阅与敏感词管理权限',
  },
};

export const AdminCompliancePage: React.FC<AdminCompliancePageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const [activeTab, setActiveTab] = useState<'copyright' | 'words' | 'rules' | 'audit' | 'pii'>('words');
  const [testText, setTestText] = useState('此药水乃天下第一绝品，包治百病，立见奇效！');

  if (viewState === 'loading') return <LoadingState message="同步全网平台新规与执行 PII 隐私扫描..." />;
  if (viewState === 'empty') return <EmptyState title="无合规违规记录" />;
  if (viewState === 'error') return <ErrorState title="合规检测引擎连接中断" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无企业级合规中心审计权限" />;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#e8f0f8]">合规与版权中心 (Compliance & Privacy)</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#00e0b8] border border-[rgba(0,224,184,0.3)]">
              红线保全 · 审计之审计
            </span>
          </div>
          <p className="text-xs text-[#8a97a8] mt-1">
            版权商用登记 · 敏感词分级正则 · PII 隐私一键脱敏 · 密钥永不入库
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-0.5 rounded-lg bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] text-xs font-mono">
          {(['words', 'copyright', 'rules', 'pii', 'audit'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1 rounded cursor-pointer ${
                activeTab === t
                  ? 'bg-[#00e0b8] text-[#0a1628] font-bold'
                  : 'text-[#8a97a8] hover:text-white'
              }`}
            >
              {t === 'words' ? '敏感词库' : t === 'copyright' ? '版权登记' : t === 'rules' ? '平台规则' : t === 'pii' ? 'PII 检测' : '审计追溯'}
            </button>
          ))}
        </div>
      </div>

      {/* Sensitive Words Live Test Bench */}
      {activeTab === 'words' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(255,68,34,0.25)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#e8f0f8]">
                敏感词实时检测测试台 (输入台词对白快速预检)
              </span>
              <span className="text-[10px] text-[#ff4422] font-mono">命中 2 个广告法绝对禁用词</span>
            </div>

            <textarea
              rows={2}
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.08)] text-xs text-[#e8f0f8] font-mono focus:border-[#00e0b8] focus:outline-none"
            />

            <div className="p-3 rounded-lg bg-[#0a1628] border border-[rgba(255,68,34,0.3)] text-xs space-y-1">
              <span className="text-[#ff4422] font-bold block">
                违规拦截提醒：
              </span>
              <p className="text-[11px] text-[#8a97a8]">
                检测到绝对化用语：“<strong className="text-[#ff4422]">天下第一</strong>”、“<strong className="text-[#ff4422]">包治百病</strong>”，将直接触发抖音与视频号机审驳回。建议替换为修真限定语“当世罕有”、“调理气血”。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PII Detection */}
      {activeTab === 'pii' && (
        <div className="p-4 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.15)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#e8f0f8]">
              全平台 PII 个人隐私扫描报告 (剧本 / 资产 / 账号凭证)
            </span>
            <span className="text-[10px] font-mono text-[#22C55E]">零明文泄露 (0 PII Leaks)</span>
          </div>
          <div className="p-3 rounded-lg bg-[#0a1628] text-xs text-[#8a97a8] font-mono space-y-1.5">
            <div>✓ 所有第三方平台 Token 均已实施哈希盐值脱敏 (enc_token_••••••••)</div>
            <div>✓ 剧本对白中涉及真实身份证号与手机号均已自动置换为虚拟号段</div>
            <div>✓ 角色立绘人脸已完成虚拟特征脱敏，杜绝真人肖像侵权风险</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCompliancePage;
