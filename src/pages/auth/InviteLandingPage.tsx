/**
 * @file: InviteLandingPage.tsx
 * @description: 页面组件：InviteLandingPage
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Lock,
  Mail
} from 'lucide-react';
import React, { useState } from 'react';
import Thumb from '../../components/common/Thumb';
import { AUTH_TOKENS } from '../../tokens';
import { DevModeMeta, PageId, ViewState } from '../../types';

interface InviteLandingPageProps {
  onNavigate: (page: PageId) => void;
  viewState?: ViewState;
}

export const DEV_META_INVITE: DevModeMeta = {
  apiEndpoint: 'GET /api/invite/{token} & POST /api/invite/{token}/accept',
  confidenceSource: '智云·守护 (邀请公私钥签名与企业工作空间隔离校验)',
  memoryScope: 'project',
  learningSampleSource: '外部协作邀请转化率与多角色分配偏好分析',
  driveModePolicy: '接受邀请后自动绑定指定项目剧集访问权；无系统管理提权',
  stateSwitchConditions: {
    empty: '等待受邀者接受加入初始态',
    loading: '工作空间角色挂载与项目资产读取权限下发中',
    error: '邀请链接已过期（超过 7 天）或已被撤销',
    forbidden: '受邀邮箱已存在，自动引导为直接登录加入流程',
  },
};

export const InviteLandingPage: React.FC<InviteLandingPageProps> = ({
  onNavigate,
  viewState = 'normal',
}) => {
  const [password, setPassword] = useState('••••••••••••');
  const [confirmPassword, setConfirmPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [simState, setSimState] = useState<ViewState>(viewState);

  const isExpired = simState === 'error';
  const isAlreadyRegistered = simState === 'forbidden';

  const permissions = [
    '可访问剧本工作台与分镜设计器',
    '可提交批量生成与渲染导出任务',
    '可查看《凌霄剑仙》项目全网数据看板',
    '不可访问系统管理、权限分配与合规审计',
  ];

  return (
    <div
      className="min-h-screen w-full flex select-none overflow-hidden animate-in fade-in duration-200"
      style={{ backgroundColor: AUTH_TOKENS.canvasRight }}
    >
      {/* State Switcher for Figma Dev Validation */}
      <div className="absolute top-4 right-6 flex items-center gap-1.5 p-1 rounded-lg bg-[#0f1e35] border border-[rgba(255,255,255,0.08)] text-[10px] font-mono z-30">
        <span className="text-[#5c697a] px-1">状态:</span>
        <button
          type="button"
          onClick={() => setSimState('normal')}
          className={`px-2 py-0.5 rounded cursor-pointer ${simState === 'normal' ? 'bg-[#00e0b8] text-[#0a1628] font-bold' : 'text-[#8a97a8]'
            }`}
        >
          正常邀请
        </button>
        <button
          type="button"
          onClick={() => setSimState('error')}
          className={`px-2 py-0.5 rounded cursor-pointer ${simState === 'error' ? 'bg-[#ff7a45] text-white font-bold' : 'text-[#8a97a8]'
            }`}
        >
          邀请失效
        </button>
        <button
          type="button"
          onClick={() => setSimState('forbidden')}
          className={`px-2 py-0.5 rounded cursor-pointer ${simState === 'forbidden' ? 'bg-[#00B4D8] text-white font-bold' : 'text-[#8a97a8]'
            }`}
        >
          已有账号
        </button>
      </div>

      {/* ============================================================== */}
      {/* LEFT 45% · Invitation Information Zone (Mirrored layout)      */}
      {/* ============================================================== */}
      <div
        className="w-[45%] relative flex flex-col justify-between p-14 overflow-hidden border-r border-[rgba(255,255,255,0.06)]"
        style={{ backgroundColor: AUTH_TOKENS.canvasLeft }}
      >
        {/* Ambient Glow */}
        <div
          className="absolute -top-24 -left-24 w-[460px] h-[460px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(157, 124, 216, 0.08) 0%, transparent 70%)' }}
        />

        {/* Top Logo */}
        <div className="z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00e0b8] via-[#00B4D8] to-[#9d7cd8] p-0.5">
            <div className="w-full h-full bg-[#071222] rounded-[6px] flex items-center justify-center font-black text-xs text-[#00e0b8]">
              YYC³
            </div>
          </div>
          <span className="text-xs text-[#8a97a8] tracking-wider uppercase font-mono">
            AI Family · Comic Drama
          </span>
        </div>

        {/* Center: Inviter Info & Pre-assigned Role */}
        <div className="z-10 my-auto space-y-6 max-w-md">
          {/* Inviter Avatar Group（装饰性头像：本地确定性渐变占位，零外链依赖） */}
          <div className="flex items-center">
            <Thumb
              label="邀请人"
              className="w-12 h-12 rounded-full object-cover border-2 border-[#071222] shadow-md z-30"
            />
            <Thumb
              label="协作者"
              className="w-12 h-12 rounded-full object-cover border-2 border-[#071222] shadow-md -ml-3 z-20"
            />
            <div className="w-12 h-12 rounded-full bg-[#152640] border-2 border-[#071222] shadow-md -ml-3 z-10 flex items-center justify-center font-bold font-mono text-xs text-[#00e0b8]">
              +3
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[#e8f0f8] tracking-tight">
              王编导 邀请你加入
            </h1>
            <h2 className="text-lg text-[#8a97a8] font-normal">
              星辉影业漫剧工坊 · 生产空间
            </h2>
          </div>

          {/* Pre-assigned Role Card */}
          <div className="p-3.5 rounded-xl bg-[#0f1e35] border border-[rgba(157,124,216,0.3)] space-y-1.5 w-80">
            <span className="text-[10px] text-[#5c697a] uppercase font-mono tracking-wider block">
              你将获得的角色
            </span>
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#e8f0f8] text-sm">专业剪辑 (Editor)</span>
              <span className="w-3 h-3 rounded-sm bg-[#9d7cd8]" title="剪辑域色" />
            </div>
            <p className="text-[11px] text-[#8a97a8] leading-tight">
              负责多轨道时间线粗剪、BGM情绪卡点排镜与硬件渲染导出。
            </p>
          </div>

          {/* Permission Checklist */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-[#e8f0f8] block">角色权限清单:</span>
            <div className="space-y-1.5 text-xs">
              {permissions.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-[#8a97a8]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                  <span className="text-[11px]">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Expiration Clock */}
        <div className="z-10 flex items-center gap-1.5 text-xs text-[#FFB020] font-mono pt-3 border-t border-[rgba(255,255,255,0.06)]">
          <Clock className="w-3.5 h-3.5" />
          <span>该邀请链接将在 7 天后失效 (2026-10-18)</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT 55% · Account Confirmation Form Zone                    */}
      {/* ============================================================== */}
      <div
        className="w-[55%] flex flex-col items-center justify-center p-8 relative"
        style={{ backgroundColor: AUTH_TOKENS.canvasRight }}
      >
        <div
          className="w-full max-w-[400px] rounded-2xl p-8 border shadow-2xl relative transition-all duration-200"
          style={{
            backgroundColor: AUTH_TOKENS.formCard,
            borderColor: isExpired ? '#ff7a45' : 'rgba(0, 224, 184, 0.15)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
          }}
        >
          {isExpired ? (
            /* Expired View */
            <div className="text-center space-y-4 py-6">
              <div className="w-14 h-14 rounded-2xl bg-[rgba(255,122,69,0.15)] text-[#ff7a45] flex items-center justify-center mx-auto border border-[#ff7a45]/30">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#e8f0f8]">邀请已失效</h3>
                <p className="text-xs text-[#8a97a8] mt-1.5 leading-relaxed">
                  该团队邀请已被发起人撤回或已超出 7 天有效期。
                </p>
              </div>
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => onNavigate('auth-register')}
                  className="w-full py-2.5 rounded-lg bg-[#00e0b8] text-[#0a1628] font-bold text-xs"
                >
                  前往自主注册新账号
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('auth-login')}
                  className="w-full py-2 rounded-lg text-xs text-[#8a97a8]"
                >
                  返回登录
                </button>
              </div>
            </div>
          ) : (
            /* Accept Form */
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onNavigate('dashboard');
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <h2 className="text-lg font-bold text-[#e8f0f8] tracking-tight">接受邀请</h2>
                <p className="text-xs text-[#8a97a8] mt-0.5">完善账号密码即可加入工作空间</p>
              </div>

              {isAlreadyRegistered && (
                <div className="p-2.5 rounded-lg bg-[#00B4D8]/10 border border-[#00B4D8]/30 text-[#00B4D8] text-xs">
                  检测到该邮箱已有账号，输入原密码即可直接加入团队。
                </div>
              )}

              {/* Readonly Email Input with Lock Icon */}
              <div className="space-y-1">
                <span className="text-[11px] text-[#8a97a8] block">受邀邮箱 (只读锁定):</span>
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[#071222] border border-[rgba(255,255,255,0.06)] text-[#8a97a8]">
                  <Mail className="w-4 h-4 text-[#5c697a]" />
                  <input
                    type="text"
                    readOnly
                    value="editor.li@studio.com"
                    className="flex-1 bg-transparent text-xs text-[#e8f0f8] focus:outline-none cursor-not-allowed font-mono"
                  />
                  <Lock className="w-3.5 h-3.5 text-[#5c697a]" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <span className="text-[11px] text-[#8a97a8] block">
                  {isAlreadyRegistered ? '输入密码加入:' : '设置登录密码:'}
                </span>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.08)] focus-within:border-[#00e0b8]">
                  <Lock className="w-4 h-4 text-[#5c697a]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="输入密码"
                    className="flex-1 bg-transparent text-xs text-[#e8f0f8] focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#5c697a] hover:text-[#00e0b8]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {!isAlreadyRegistered && (
                <div className="space-y-1">
                  <span className="text-[11px] text-[#8a97a8] block">确认密码:</span>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.08)] focus-within:border-[#00e0b8]">
                    <Lock className="w-4 h-4 text-[#5c697a]" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="再次确认密码"
                      className="flex-1 bg-transparent text-xs text-[#e8f0f8] focus:outline-none font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Agreement */}
              <label className="flex items-center gap-2 text-[11px] text-[#8a97a8] cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="rounded border-[rgba(0,224,184,0.3)] text-[#00e0b8] focus:ring-0"
                />
                <span>同意并遵循星辉影业团队协同规范</span>
              </label>

              {/* Action Buttons */}
              <button
                type="submit"
                disabled={!agreed}
                className="w-full py-2.5 rounded-lg bg-[#00e0b8] hover:bg-[#00c9a5] text-[#0a1628] font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-teal-950/40 flex items-center justify-center gap-1.5"
              >
                <span>{isAlreadyRegistered ? '直接登录并加入' : '完成加入团队'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('auth-login')}
                  className="text-xs text-[#5c697a] hover:text-[#ff4422] transition-colors cursor-pointer"
                >
                  拒绝本次邀请
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteLandingPage;
