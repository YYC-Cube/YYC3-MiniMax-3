/**
 * @file: GlobalCommandMenu.tsx
 * @description: 组件：GlobalCommandMenu
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import {
  ArrowRight,
  Bot,
  Compass,
  FileText,
  Film,
  Key,
  Layers,
  Lock,
  LogIn,
  Scissors,
  Search,
  Send,
  Shield,
  Sparkles,
  UserPlus,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { PageId } from '../../types';

interface GlobalCommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageId) => void;
}

export const GlobalCommandMenu: React.FC<GlobalCommandMenuProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle from parent or handled outside
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands: {
    group: string;
    items: { title: string; subtitle: string; page: PageId; icon: React.ReactNode }[];
  }[] = [
      {
        group: '快捷跳转',
        items: [
          { title: '工作台首页', subtitle: '产线总览与双 DGX 状态', page: 'dashboard', icon: <Layers className="w-4 h-4 text-[#00e0b8]" /> },
          { title: '剧本工作台', subtitle: 'Notion 数据库风格剧本库', page: 'script', icon: <FileText className="w-4 h-4 text-[#00e0b8]" /> },
          { title: '分镜设计器', subtitle: '12 字段 Schema 与画布模式', page: 'storyboard', icon: <Film className="w-4 h-4 text-[#00e0b8]" /> },
          { title: '多轨道时间线剪辑', subtitle: '剪映专业版级四轨编辑器', page: 'video', icon: <Scissors className="w-4 h-4 text-[#9d7cd8]" /> },
          { title: '质检门禁看板', subtitle: '格物·宗师 80% 一致性红线', page: 'qa', icon: <Shield className="w-4 h-4 text-[#00e0b8]" /> },
          { title: '多平台发布看板', subtitle: '抖音/视频号/B站/快手/小红书', page: 'publish-board', icon: <Send className="w-4 h-4 text-[#FF7A5C]" /> },
          { title: '智能体训练中心', subtitle: 'Learning Inbox 与三层记忆', page: 'admin-agents', icon: <Bot className="w-4 h-4 text-[#00B4D8]" /> },
          { title: 'AI Family 8 Agent 时钟环', subtitle: '1.5h 时钟环大屏中枢', page: 'family', icon: <Compass className="w-4 h-4 text-[#FFD700]" /> },
        ],
      },
      {
        group: '生产域操作',
        items: [
          { title: '批量生成任务台', subtitle: '多实例并行任务队列', page: 'production', icon: <Layers className="w-4 h-4 text-[#00e0b8]" /> },
          { title: '角色一致性训练', subtitle: 'LoRA Ref 保持与定妆照', page: 'assets-consistency', icon: <FileText className="w-4 h-4 text-[#00e0b8]" /> },
          { title: '世界观与知识图谱', subtitle: '力导向图与剧情冲突检测', page: 'project-lore', icon: <Sparkles className="w-4 h-4 text-[#00B4D8]" /> },
        ],
      },
      {
        group: 'Auth 鉴权域',
        items: [
          { title: 'A01 登录入口', subtitle: '55:45 沉浸式登录与品牌时钟环', page: 'auth-login', icon: <LogIn className="w-4 h-4 text-[#00e0b8]" /> },
          { title: 'A02 注册向导', subtitle: '6位OTP、密码强度与角色分配', page: 'auth-register', icon: <UserPlus className="w-4 h-4 text-[#00e0b8]" /> },
          { title: 'A03 找回密码', subtitle: '防撞库邮件重置链接派发', page: 'auth-forgot', icon: <Key className="w-4 h-4 text-[#FFD700]" /> },
          { title: 'A04 重置密码', subtitle: 'Token 校验与新密码设置', page: 'auth-reset', icon: <Lock className="w-4 h-4 text-[#9d7cd8]" /> },
          { title: 'A05 二次验证 MFA', subtitle: '智云·守护 TOTP/短信/邮箱三验', page: 'auth-mfa', icon: <Shield className="w-4 h-4 text-[#9d7cd8]" /> },
          { title: 'A06 团队邀请', subtitle: '45:55 镜像反转邀请落地页', page: 'auth-invite', icon: <UserPlus className="w-4 h-4 text-[#00B4D8]" /> },
          { title: 'A07 首次登录引导', subtitle: '4 步向导配置品牌、算力与 Agent', page: 'auth-onboarding', icon: <Compass className="w-4 h-4 text-[#00e0b8]" /> },
          { title: 'A08 会话过期 / 403', subtitle: '未保存草稿恢复与角色越权警示', page: 'auth-expired', icon: <Lock className="w-4 h-4 text-[#ff7a45]" /> },
          { title: 'A09 账号停用 / 锁定', subtitle: '5 次失败锁定与管理员停用态', page: 'auth-locked', icon: <Lock className="w-4 h-4 text-[#ff4422]" /> },
        ],
      },
    ];

  const filtered = commands
    .map((grp) => ({
      ...grp,
      items: grp.items.filter(
        (it) =>
          it.title.toLowerCase().includes(query.toLowerCase()) ||
          it.subtitle.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter((grp) => grp.items.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-start justify-center lg:pt-24 p-0 lg:p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div
        className="w-full max-w-xl rounded-t-2xl lg:rounded-2xl bg-[#0f1e35] border border-[rgba(0,224,184,0.3)] shadow-2xl overflow-hidden max-h-[88dvh] lg:max-h-none animate-in zoom-in-95 duration-150"
        style={{
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 24px rgba(0, 224, 184, 0.15)',
        }}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 bg-[#152640] border-b border-[rgba(255,255,255,0.08)] flex items-center gap-3">
          <Search className="w-4 h-4 text-[#00e0b8]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入页面名称、Agent、或操作指令..."
            className="flex-1 bg-transparent text-sm text-[#e8f0f8] placeholder-[#5c697a] focus:outline-none"
          />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0a1628] text-[#8a97a8] border border-[rgba(255,255,255,0.1)]">
            ESC
          </kbd>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8a97a8] hover:text-[#e8f0f8] p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command Results */}
        <div className="max-h-[60dvh] lg:max-h-96 overflow-y-auto p-2 space-y-3">
          {filtered.map((grp) => (
            <div key={grp.group} className="space-y-1">
              <span className="px-3 text-[10px] font-bold text-[#5c697a] uppercase tracking-wider block">
                {grp.group}
              </span>
              {grp.items.map((item) => (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => {
                    onNavigate(item.page);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#152640] text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#0a1628] border border-[rgba(255,255,255,0.06)] group-hover:border-[rgba(0,224,184,0.3)] transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#e8f0f8] group-hover:text-[#00e0b8] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-[#8a97a8]">{item.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#5c697a] group-hover:text-[#00e0b8] transition-colors" />
                </button>
              ))}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="p-8 text-center text-xs text-[#8a97a8]">
              未检索到相关指令或页面
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-[#0a1628] border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11px] text-[#5c697a]">
          <span>按 ↑↓ 选择，Enter 确认跳转</span>
          <span className="font-mono">YYC³ Global Routing</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalCommandMenu;
