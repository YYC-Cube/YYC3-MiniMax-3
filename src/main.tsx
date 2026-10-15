/**
 * @file: main.tsx
 * @description: 模块：main
 * @author: YanYuCloudCube Team <admin@0379.email>
 * @version: v1.0.0
 * @created: 2026-10-11
 * @updated: 2026-10-11
 * @status: stable
 * @copyright: Copyright (c) 2025-2026 YYC³ Team
 * @license: MIT
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { setApiEventSink } from './api/useApiData'
import App from './App'
import './index.css'
import { recordEvent } from './observability/telemetry'
import { registerSW } from './pwa/registerSW'

// 组合根：api 层遥测端口桥接本地遥测环形缓冲（先于 createRoot 注册，页面请求时序天然保证）
setApiEventSink((level, source, message, detail) => recordEvent(level, source, message, detail))

// PWA：生产环境注册 Service Worker（App Shell 预缓存 / 离线开屏 / 更新提示）
registerSW()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
