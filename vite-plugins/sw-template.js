/**
 * @file sw-template.js
 * @description Service Worker 模板（构建期由 vite-plugins/pwa-sw.mjs 注入版本与预缓存清单）。
 *   策略：
 *   - install  预缓存 App Shell（index/全部 js/css chunks/图标）→ skipWaiting
 *   - activate 清理旧版本缓存 → clients.claim
 *   - 导航请求 network-first，离线回退缓存的 "/"（SPA 可离线开屏）
 *   - 同源静态 GET stale-while-revalidate（离线 cache-only）；非 GET / 跨域 / API 一律直通
 *   - 缓存匹配统一 ignoreVary（构建产物 Vary: Origin 与预缓存请求头不一致）
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-10-15
 * @updated 2026-10-15
 * @status stable
 * @copyright Copyright (c) 2025-2026 YYC³ Team
 * @license MIT
 */

/* global self, caches, fetch, URL */

const CACHE_VERSION = "__CACHE_VERSION__";
const CACHE_NAME = `yyc3-static-${CACHE_VERSION}`;
const PRECACHE_URLS = __PRECACHE_URLS__;
const OFFLINE_SHELL = "/";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        cache.addAll(PRECACHE_URLS).then(() => self.skipWaiting())
      )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  // 页面可 postMessage({ type: "SKIP_WAITING" }) 立即激活新版本
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

/**
 * 缓存匹配统一入口。
 * 必须 ignoreVary：构建产物对带 crossorigin 的模块/CSS 请求响应 `Vary: Origin`，
 * 而 addAll 预缓存的落库请求不带 Origin，严格 Vary 校验会导致离线时匹配失败。
 */
function matchCache(key) {
  return caches.match(key, { ignoreVary: true });
}

/** 仅处理同源 GET；其余（非 GET / 跨域 / API）直通网络 */
function isCacheable(request) {
  if (request.method !== "GET") return false;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return false;
  return true;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (!isCacheable(request)) return;

  // 导航请求：network-first → 离线回退 App Shell
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(OFFLINE_SHELL, copy));
          return response;
        })
        .catch(() =>
          matchCache(OFFLINE_SHELL).then((cached) => cached || Response.error())
        )
    );
    return;
  }

  // 离线：cache-only，跳过 revalidation（避免离线产生 ERR_FAILED 噪音与竞态）
  if (!self.navigator.onLine) {
    event.respondWith(matchCache(request).then((cached) => cached || Response.error()));
    return;
  }

  // 同源静态资源：stale-while-revalidate
  event.respondWith(
    matchCache(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
