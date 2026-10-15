/**
 * @file: useRealTimeClock.ts
 * @description: YYC³ 真实时钟 Hook — 1 秒 setInterval 走时、时/分/秒三针角度公式、
 *               中心数字时间、yy/mm/dd + 星期（周末粉色判定）。逻辑复用 AI Family
 *               时钟环参考实现（docs/AIFamilyPage.tsx），供 Agent 协同大屏与
 *               A01 登录 / A02 注册品牌时钟共用，杜绝双源漂移。
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-12
 * @updated: 2026-10-12
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import { useEffect, useState } from 'react';

/** 星期标签（getDay()：0=日 … 6=六） */
export const DAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'] as const;

/** 时/分/秒三针角度（度，0°=12点方向；CSS/SVG 三角函数用，-90 校正 x 轴起点） */
export interface ClockAngles {
  /** 时针：每小时 30° + 分钟补偿 0.5°/min */
  hourAngle: number;
  /** 分针：每分钟 6° + 秒补偿 0.1°/s */
  minuteAngle: number;
  /** 秒针：每秒 6° */
  secondAngle: number;
}

/** 日期信息：yy/mm/dd 字符串、星期标签、是否周末（六/日） */
export interface ClockDateInfo {
  dateStr: string;
  dayLabel: string;
  isWeekend: boolean;
}

/** 完整走时状态 */
export interface RealTimeClock {
  time: Date;
  /** 中心数字时间 HH:MM:SS（24 小时制） */
  timeStr: string;
  angles: ClockAngles;
  dateInfo: ClockDateInfo;
}

/**
 * 三针视觉规范（大屏 / A01 登录 / A02 注册 同源，禁止各自定义）：
 * 三色三长 —— 时针最短最粗（品牌青碧）、分针居中（天青蓝）、秒针最长最细（朱红，
 * 与 Agent 激光粉 #FF69B4 明确区隔，避免被误读为"多了一条粉线"），秒针带尾部配重。
 */
export const CLOCK_HAND_COLORS = {
  hour: '#00e0b8',
  minute: '#38bdf8',
  second: '#ff3b6b',
} as const;

/** 枢纽直径 / 表盘外径（与 AI Family 时钟环参考图 110/520 比例对齐） */
export const CLOCK_HUB_RATIO = 0.21;

/** 三针长度（含秒针尾部配重）相对节点轨道半径的比例：时 0.42 / 分 0.56 / 秒 0.68，均不越中圈 */
export function getHandLengths(orbitRadius: number): {
  hour: number;
  minute: number;
  second: number;
  tail: number;
} {
  return {
    hour: orbitRadius * 0.42,
    minute: orbitRadius * 0.56,
    second: orbitRadius * 0.68,
    tail: orbitRadius * 0.16,
  };
}

/**
 * 三针角度公式（与 docs/AIFamilyPage.tsx 参考实现逐式一致）：
 * hour   = (h%12)*30 + m*0.5 - 90
 * minute = m*6 + s*0.1 - 90
 * second = s*6 - 90
 */
export function getClockAngles(date: Date): ClockAngles {
  const hours = date.getHours() % 12;
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return {
    hourAngle: hours * 30 + minutes * 0.5 - 90,
    minuteAngle: minutes * 6 + seconds * 0.1 - 90,
    secondAngle: seconds * 6 - 90,
  };
}

/** 格式化 yy/mm/dd + 星期；周末（日/六）标记 isWeekend（UI 着粉色） */
export function formatDateInfo(date: Date): ClockDateInfo {
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const dayIdx = date.getDay();
  return {
    dateStr: `${yy}/${mm}/${dd}`,
    dayLabel: DAY_LABELS[dayIdx],
    isWeekend: dayIdx === 0 || dayIdx === 6,
  };
}

/** 1 秒一跳的真实时钟；卸载即清定时器 */
export function useRealTimeClock(): RealTimeClock {
  const [time, setTime] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return {
    time,
    timeStr: time.toLocaleTimeString('zh-CN', { hour12: false }),
    angles: getClockAngles(time),
    dateInfo: formatDateInfo(time),
  };
}

/** 元素内容区尺寸（ResizeObserver），时钟环按短边自适应缩放用 */
export function useElementSize<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
): { width: number; height: number } {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) setSize({ width, height });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
