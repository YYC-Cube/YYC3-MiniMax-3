/**
 * @file: registerSW.ts
 * @description: PWA Service Worker 注册与更新状态（生产环境生效；dev 不注册以保 HMR）。
 *               外部订阅 store：发现 waiting 新版本 → usePwaUpdate 弹轻提示；
 *               用户确认后 postMessage SKIP_WAITING，controllerchange 即刷新。
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-15
 * @updated: 2026-10-15
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

let waitingReg: ServiceWorkerRegistration | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const fn of listeners) fn();
}

/** 是否有等待激活的新版本（供 useSyncExternalStore 订阅） */
export function subscribeUpdate(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getUpdateAvailable(): boolean {
  return waitingReg !== null;
}

/** 用户点击「立即刷新」：通知 waiting SW 跳过等待，控制权切换后整页刷新 */
export function activateUpdate(): void {
  const reg = waitingReg;
  if (!reg || !reg.waiting) return;
  let reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!reloading) {
      reloading = true;
      window.location.reload();
    }
  });
  reg.waiting.postMessage({ type: "SKIP_WAITING" });
}

function trackInstalling(reg: ServiceWorkerRegistration) {
  reg.installing?.addEventListener("statechange", (e) => {
    const worker = e.target as ServiceWorker;
    // 已有页面控制（非首次安装）且新 SW 进入 waiting → 提示更新
    if (worker.state === "installed" && navigator.serviceWorker.controller) {
      waitingReg = reg;
      emit();
    }
  });
}

/** 生产环境注册 /sw.js；失败静默（PWA 为渐进增强，不阻断应用） */
export function registerSW(): void {
  if (!import.meta.env.PROD) return;
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        if (reg.waiting && navigator.serviceWorker.controller) {
          waitingReg = reg;
          emit();
        }
        reg.addEventListener("updatefound", () => trackInstalling(reg));
      })
      .catch(() => {
        /* 注册失败（隐私模式/协议非 http(s) 等）不影响主应用 */
      });
  });
}
