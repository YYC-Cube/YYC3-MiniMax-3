/**
 * @file: PublishAccountsPage.tsx
 * @description: 页面组件：PublishAccountsPage
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import {
  Lock,
  QrCode
} from 'lucide-react';
import React, { useState } from 'react';
import { ENDPOINTS, publishingService, SNAPSHOT, useApiData } from '../../api';
import { EmptyState, ErrorState, LoadingState, NoPermissionState } from '../../components/common/States';
import { DevModeMeta, PageId, ViewState } from '../../types';

interface PublishAccountsPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_ACCOUNTS: DevModeMeta = {
  apiEndpoint: ENDPOINTS.accounts,
  confidenceSource: '预见·先知 账号掉线概率预测模型 (LSTM) + OAuth2.0 Token 探针',
  memoryScope: 'global',
  learningSampleSource: '平台风控封控规则库与 API 响应码学习样本',
  driveModePolicy: '凭证到期前 7 天自动触发续期警示；高危账号自动移入风控隔离池',
  stateSwitchConditions: {
    empty: '当前矩阵池未绑定任何短视频平台发布账号',
    loading: '五大平台账号状态与授权凭证健康心跳巡检中',
    error: 'OAuth 授权中心中间件网络中断 (AUTH_GATEWAY_DOWN)',
    forbidden: '用户无多平台账号管理、扫码授权与凭证轮换权限',
  },
};

export const PublishAccountsPage: React.FC<PublishAccountsPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const { data: accountsData, loading } = useApiData(publishingService.accounts, SNAPSHOT.accounts);
  const accounts = accountsData ?? [];
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  if (viewState === 'loading') return <LoadingState message="巡检全网矩阵账号授权状态与预见掉线风险..." />;
  if (viewState === 'empty') return <EmptyState title="暂无绑定账号" actionText="扫码授权添加账号" />;
  if (viewState === 'error') return <ErrorState title="账号矩阵服务异常" />;
  if (viewState === 'forbidden') return <NoPermissionState title="无账号矩阵授权权限" />;
  if (loading) return <LoadingState message="巡检全网矩阵账号授权状态与预见掉线风险..." />;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[rgba(255,255,255,0.06)] domain-border-push">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#e8f0f8]">账号矩阵管理 (Account Matrix)</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#152640] text-[#FF7A5C] border border-[#FF7A5C]/30">
              蚁小二对标 · 零明文存储
            </span>
          </div>
          <p className="text-xs text-[#8a97a8] mt-1">
            多账号统一授权池 · 预见·先知 7 天掉线预测 · 到期自动轮换提现
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs cursor-pointer shadow-lg shadow-teal-950/40"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>扫码添加平台账号</span>
        </button>
      </div>

      {/* Security Zero-Plaintext Banner */}
      <div className="p-3 rounded-xl bg-[#0f1e35] border border-[rgba(0,224,184,0.15)] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-[#e8f0f8]">
          <Lock className="w-4 h-4 text-[#00e0b8]" />
          <span>安全红线：所有开放平台 Cookie 与 AppSecret 均在 HSM 硬件加密机内脱敏，永不出明文。</span>
        </div>
        <span className="text-[10px] font-mono text-[#00e0b8]">AES-256 GCM 隔离</span>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts.map((acc) => {
          const isExpiring = acc.authStatus === 'expiring';

          return (
            <div
              key={acc.id}
              className={`rounded-xl bg-[#0f1e35] border p-4 space-y-3 transition-all ${isExpiring
                ? 'border-[rgba(255,176,32,0.4)] shadow-md shadow-amber-950/20'
                : 'border-[rgba(255,255,255,0.08)] hover:border-[#FF7A5C]'
                }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-[#152640] text-[#FF7A5C]">
                    {acc.platformName}
                  </span>
                  <h4 className="text-xs font-bold text-[#e8f0f8]">{acc.accountName}</h4>
                </div>
                <span className="text-[10px] font-mono text-[#8a97a8]">{acc.group}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-[#0a1628]">
                  <span className="text-[10px] text-[#5c697a] block">粉丝数</span>
                  <span className="text-sm font-bold text-[#e8f0f8]">{acc.followers}</span>
                </div>
                <div className="p-2 rounded bg-[#0a1628]">
                  <span className="text-[10px] text-[#5c697a] block">发布成功率</span>
                  <span className="text-sm font-bold text-[#22C55E]">{acc.successRate}%</span>
                </div>
              </div>

              {/* Offline Risk Prediction by 预见·先知 */}
              <div className="p-2.5 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.04)] text-xs flex items-center justify-between">
                <span className="text-[#8a97a8] text-[11px]">预见·先知 掉线预测:</span>
                <span
                  className={`font-mono font-bold text-[11px] ${acc.predictOfflineRisk > 10 ? 'text-[#ff4422]' : 'text-[#22C55E]'
                    }`}
                >
                  {acc.predictOfflineRisk > 10 ? '较高风险 (19%)' : '极低风险 (<5%)'}
                </span>
              </div>

              {/* Status and Action */}
              <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.06)] text-xs">
                <span className="text-[#5c697a] font-mono text-[10px]">
                  凭证有效期：{acc.expireDays} 天
                </span>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded bg-[#152640] hover:bg-[#1f3659] text-[#00e0b8] text-[11px] font-medium cursor-pointer"
                >
                  一键轮换
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PublishAccountsPage;
