---
name: "tos-app-package"
description: "将 TOS 应用打包为可安装的 .deb 包或 tar.gz 双包，并支持通过应用中心安装。当用户需要给应用打包、制作安装包、构建 deb 包、安装应用到TOS应用中心时使用此技能。Triggers on: 打包、deb、安装包、应用包、package、build deb、设计应用、做应用、应用原型、应用设计、原型设计、安装本地应用、安装deb包、部署应用包、上传安装包。"
---


# TOS 应用打包技能

基于 TOS 官方 deb 应用打包规范（2026.5.22 版），将应用从原型设计到打包安装的全流程。

> **⚠️ 本技能严格遵循 TOS 官方打包规范。所有步骤和规则必须严格执行，不得跳过或省略。**

---

## 应用类型总览

TOS 应用分为 **5 种类型**，决定了目录结构、后端通信方式和 config.ini 字段的不同：

| 类型 | 格式 | UI | 打开方式 | 后端通信 | application_type |
|------|------|----|---------|---------|-----------------|
| **A. deb 有 UI（内部打开）** | 单 .deb | ✅ | iframe 内嵌 | Unix Socket `/var/api/<app_id>.sock` | `deb` |
| **B. deb 有 UI（外部打开）** | 单 .deb | ✅ | 新标签页 | TCP `<listen_port>` + nginx | `deb` |
| **C. deb 无 UI** | 单 .deb | ❌ | 后台服务 | 按需 | `deb` |
| **D. tar.gz 有 UI（外部打开）** | tar.gz 双 deb | ✅ | 新标签页 | TCP `<listen_port>` + nginx | `deb-TarGz` |
| **E. tar.gz 无 UI** | tar.gz 双 deb | ❌ | 后台服务 | 按需 | `deb-TarGz` |

### 类型选择指南

- **需要 TOS iframe 内嵌打开** → 类型 A（必须用 Unix Socket + `/v2/proxy/`）
- **需要浏览器新标签页打开** → 类型 B 或 D
- **纯后台服务，无界面** → 类型 C 或 E
- **应用本体和 TOS 配置需要分离管理** → 类型 D 或 E（双包结构）
- **简单应用，单包即可** → 类型 A、B 或 C

---

# ⛔ 执行纪律

### 检查点 1：路径确认（Step 1 & Step 3）
- 执行 Step 1 时，**必须询问用户文件保存路径**
- 执行 Step 3（直接打包）时，**必须询问用户代码路径**
- 路径不可用时**不能继续**，必须继续询问

### 检查点 2：确认应用类型（Step 2 强制门控）
- Step 2 开始时，**必须询问用户：「您想做成什么样式的应用？」**，并提供以下 3 个选项：
  1. **无 UI** — 纯后台服务，无操作界面
  2. **系统内** — 在 TOS 界面内嵌窗口中运行
  3. **新标签页** — 在浏览器新标签页中独立运行
- **用户必须回答，否则不进行接下来的任何步骤**
- 用户选择后映射到打包类型：无UI→C，系统内→A，新标签页→B
- 默认走单 deb 包形式；仅当用户明确要求双包分离时才使用 tar.gz 双 deb（D/E 类型），否则不主动提及
- 即使能从描述或代码推断出类型，也必须让用户明确选择，不能跳过

### 检查点 3：用户确认（Step 1 → Step 2）
- Step 1 原型生成后，**必须询问用户"是否按此设计实现？"**
- 只有得到**明确的肯定答复**才能进入 Step 2

### 检查点 4：Step 2 → Step 3 自动衔接
- Step 2 完成后**自动进入 Step 3 打包构建**，无需再次询问

### 检查点 5：Step 3 → Step 4 门控
- Step 3 成功生成安装包后，**必须询问用户"是否立刻安装？"**
- 只有得到**明确肯定答复**才能进入 Step 4

### 检查点 6：直接触发 Step 4
- 用户直接要求安装时，**必须询问安装包路径和文件名**
- 必须验证文件存在后才可继续

---

## 交互触发规则

| 用户意图 | 触发关键词 | 执行步骤 |
|---|---|---|
| **设计一款应用** | "设计应用"、"做个应用"、"开发应用" | Step 1 → Step 2 → Step 3 → Step 4 |
| **应用原型/设计** | "应用原型"、"应用设计"、"原型设计" | Step 1（仅原型） |
| **给应用打包** | "打包"、"做个安装包"、"build deb"、"package" | Step 3（必须先确认代码路径和应用类型） |
| **安装应用到TOS** | "安装本地应用"、"安装deb包"、"部署应用包" | Step 4（必须先确认安装包路径） |

---

# Step 1: 原型设计

根据用户描述的应用需求，生成一个独立的 `.html` 原型文件。

## 1.1 确认应用信息

向用户确认以下信息（用户没提供的要主动问）：

| 信息 | 说明 | 示例 |
|---|---|---|
| 应用名称 | 中文显示名 | "AI 搜索" |
| APP_ID | 英文标识 | `ai_search` |
| 应用功能 | 核心功能描述 | "搜索 NAS 上的文件" |
| 版本号 | 初始版本 | `1.0.001` |
| 应用类型 | A~E（见上方类型总览） | 类型 B |
| 后端端口 | 类型 B/D 需要指定监听端口 | `16688` |

## 1.2 确认文件保存路径

**必须询问用户**："你想把原型文件放在哪个路径下？"

## 1.3 生成 .html 原型

生成一个**独立的 .html 文件**，包含完整的 HTML + CSS + JavaScript。

原型文件要求：
- **自包含**：所有样式和脚本内联
- **可预览**：直接用浏览器打开就能看到界面效果
- **功能完整**：界面布局、交互逻辑、API 调用代码都要有
- **鉴权代码**：必须包含 `getCookie`、`apiHeaders` 函数

**API 路径取决于应用类型：**
- **类型 A（iframe）**：前端用 `/v2/proxy/<app_id>` 前缀，如 `/v2/proxy/ai_search/api/search`
- **类型 B/D（外部打开）**：前端用相对路径，如 `api/search`

原型 .html 基本结构：

```html
<!DOCTYPE html>
<html lang="zh-cn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><APP_NAME></title>
    <style>
        /* 全部样式内联，TOS 风格：深色侧边栏、圆角卡片 */
    </style>
</head>
<body>
    <!-- 应用界面 -->

    <script>
        // 鉴权工具函数
        function getCookie(name) {
            const prefix = encodeURIComponent(name) + "=";
            return document.cookie
                .split(";")
                .map((item) => item.trim())
                .find((item) => item.startsWith(prefix))
                ?.slice(prefix.length) || "";
        }

        function apiHeaders() {
            const sessionName = getCookie("TMSESSNAME");
            const csrfToken = getCookie("X-Csrf-Token");
            return {
                "Content-Type": "application/json",
                "X-Csrf-Token": csrfToken,
                "Cookie": `TMSESSNAME=${sessionName}; X-Csrf-Token=${csrfToken};`
            };
        }

        // 类型 A: fetch("/v2/proxy/<APP_ID>/<api_name>", { headers: apiHeaders(), credentials: "include", ... })
        // 类型 B/D: fetch("api/<api_name>", { headers: apiHeaders(), credentials: "include", ... })
    </script>
</body>
</html>
```

## 1.4 确认是否继续实现

原型生成后，**必须询问用户**："是否按此设计实现？"

---

# Step 2: 代码实现

根据 Step 1 的原型设计，实现完整的后端代码和打包配置文件。

## 2.1 确认代码存放路径

与用户确认代码存放路径，默认与 Step 1 原型同路径。

## 2.2 实现方法

### 2.2.1 拆分前端（类型 A/B/D）

将 .html 原型拆分为独立文件：

```
<project>/src/webui/
├── index.html          # HTML 结构
├── app.js              # JavaScript 逻辑
├── styles.css          # CSS 样式
└── images/icons/
    └── <app_id>.svg    # 应用图标
```

拆分要点：
- `<style>` → `styles.css`，用 `<link rel="stylesheet" href="./styles.css?v=<VERSION>">`
- `<script>` → `app.js`，用 `<script src="./app.js?v=<VERSION>"></script>`
- 版本号参数避免缓存

### 2.2.2 编写后端

#### 类型 A（iframe 内嵌，Unix Socket）

后端**必须**监听 Unix Socket `/var/api/<app_id>.sock`，不是 TCP 端口。

```python
#!/usr/bin/env python3
import http.server, json, os, signal, sys, tarfile, bz2, urllib.parse, socket

APP_ID = '<APP_ID>'
INSTALL_DIR = '/usr/local/' + APP_ID
WEBUI_DIR = os.path.join(INSTALL_DIR, 'webui')
SOCKET_PATH = '/var/api/' + APP_ID + '.sock'

CONTENT_TYPES = {
    'html': 'text/html; charset=utf-8',
    'js':   'application/javascript; charset=utf-8',
    'css':  'text/css; charset=utf-8',
    'svg':  'image/svg+xml',
    'json': 'application/json; charset=utf-8',
}

def extract_webui():
    bz2_path = os.path.join(INSTALL_DIR, 'webui.bz2')
    os.makedirs(WEBUI_DIR, exist_ok=True)
    with bz2.open(bz2_path, 'rb') as f:
        with tarfile.open(fileobj=f, mode='r') as tar:
            tar.extractall(WEBUI_DIR)

class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split('?')[0]
        # 兼容多种代理路径
        for prefix in [f'/{APP_ID}', f'/{APP_ID}/', f'/{APP_ID}/']:
            if path.startswith(prefix):
                path = path[len(prefix):] or '/'
                break
        if path.startswith('/api/'):
            self._handle_api(path)
        else:
            self._serve_static(path)

    def do_POST(self):
        path = self.path.split('?')[0]
        for prefix in [f'/{APP_ID}', f'/{APP_ID}/']:
            if path.startswith(prefix):
                path = path[len(prefix):] or '/'
                break
        if path.startswith('/api/'):
            self._handle_api_post(path)
        else:
            self.send_json({'error': 'Not found'}, 404)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-Csrf-Token, Cookie')
        self.send_header('Access-Control-Max-Age', '86400')
        self.end_headers()

    def _serve_static(self, path):
        if path == '/' or path == '':
            path = '/index.html'
        file_path = os.path.join(WEBUI_DIR, path.lstrip('/'))
        real_webui = os.path.realpath(WEBUI_DIR)
        real_file = os.path.realpath(file_path)
        if not real_file.startswith(real_webui):
            self.send_error(403); return
        if os.path.isfile(real_file):
            ext = real_file.rsplit('.', 1)[-1].lower()
            ct = CONTENT_TYPES.get(ext, 'application/octet-stream')
            with open(real_file, 'rb') as f: data = f.read()
            self.send_response(200)
            self.send_header('Content-Type', ct)
            self.send_header('Content-Length', str(len(data)))
            self.send_header('Cache-Control', 'no-store')
            self.end_headers()
            self.wfile.write(data)
        else:
            self.send_error(404)

    def _handle_api(self, path):
        """根据应用功能实现 GET API"""
        if path == '/api/status':
            self.send_json({'status': 'ok', 'app': APP_ID})
        else:
            self.send_json({'error': 'Not found'}, 404)

    def _handle_api_post(self, path):
        """根据应用功能实现 POST API"""
        content_len = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_len) if content_len > 0 else b''
        try:
            data = json.loads(body) if body else {}
        except json.JSONDecodeError:
            self.send_json({'error': 'Invalid JSON'}, 400); return
        self.send_json({'error': 'Not found'}, 404)

    def send_json(self, data, code=200):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        pass

class UnixSocketHTTPServer(http.server.HTTPServer):
    address_family = socket.AF_UNIX

def main():
    extract_webui()
    # 确保目录存在，清理旧 socket
    os.makedirs(os.path.dirname(SOCKET_PATH), exist_ok=True)
    if os.path.exists(SOCKET_PATH):
        os.unlink(SOCKET_PATH)

    server = UnixSocketHTTPServer(SOCKET_PATH, Handler)
    # 设置 socket 权限，允许平台代理访问
    os.chmod(SOCKET_PATH, 0o666)

    def shutdown(sig, frame):
        server.server_close()
        if os.path.exists(SOCKET_PATH):
            os.unlink(SOCKET_PATH)
        sys.exit(0)
    signal.signal(signal.SIGTERM, shutdown)
    signal.signal(signal.SIGINT, shutdown)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        shutdown(None, None)

if __name__ == '__main__':
    main()
```

#### 类型 B/D（外部打开，TCP 端口）

后端监听 TCP 端口，nginx 反向代理：

```python
#!/usr/bin/env python3
import http.server, json, os, signal, sys, urllib.parse

PORT = <LISTEN_PORT>
APP_ID = '<APP_ID>'

class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split('?')[0]
        if path.startswith('/api/'):
            self._handle_api(path)
        else:
            self._serve_static(path)

    def do_POST(self):
        path = self.path.split('?')[0]
        if path.startswith('/api/'):
            self._handle_api_post(path)
        else:
            self.send_json({'error': 'Not found'}, 404)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-Csrf-Token, Cookie')
        self.send_header('Access-Control-Max-Age', '86400')
        self.end_headers()

    def _serve_static(self, path):
        # 根据应用实际情况实现静态文件服务
        self.send_error(404)

    def _handle_api(self, path):
        if path == '/api/status':
            self.send_json({'status': 'ok', 'app': APP_ID})
        else:
            self.send_json({'error': 'Not found'}, 404)

    def _handle_api_post(self, path):
        content_len = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_len) if content_len > 0 else b''
        try:
            data = json.loads(body) if body else {}
        except json.JSONDecodeError:
            self.send_json({'error': 'Invalid JSON'}, 400); return
        self.send_json({'error': 'Not found'}, 404)

    def send_json(self, data, code=200):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(body)

def main():
    server = http.server.HTTPServer(('127.0.0.1', PORT), Handler)
    def shutdown(sig, frame):
        server.server_close(); sys.exit(0)
    signal.signal(signal.SIGTERM, shutdown)
    signal.signal(signal.SIGINT, shutdown)
    try: server.serve_forever()
    except KeyboardInterrupt: shutdown(None, None)

if __name__ == '__main__':
    main()
```

### 2.2.3 生成打包配置文件

#### 类型 A/B/C（单 deb 包）

```
<project>/src/packaging/
├── config.ini                    # 应用元数据
├── <app_id>.lang                 # 多语言文件
├── init.d/
│   └── <system_id>.service       # systemd 服务
├── nginx/                        # 仅类型 B 需要
│   └── <app_id>.conf             # nginx 反向代理配置
├── images/icons/
│   └── <app_id>.svg              # 应用图标
├── control                       # debian 包元数据
├── postinst                      # 安装后脚本
└── prerm                         # 卸载前脚本
```

#### 类型 D/E（tar.gz 双 deb 包）

**数据包** (`<app_id>.deb`)：
```
<project>/src/data_package/
├── config.ini
├── <app_id>.lang
├── images/icons/
│   └── <app_id>.svg
├── nginx/                        # 仅类型 D 需要
│   └── <app_id>.conf
├── control
└── prerm
```

**源包** (`<package>.deb`)：
```
<project>/src/source_package/
├── bin/
│   └── <binary_name>             # 可执行程序
├── init.d/
│   └── <system_id>.service       # systemd 服务
├── depends/                      # 依赖（可选）
│   ├── bin/
│   ├── lib/
│   ├── python/
│   ├── config/
│   └── data/
├── <app_id>.env                  # 依赖环境变量（可选）
├── webui/                        # 前端静态文件（可选，类型 D）
│   └── index.html
├── control
└── postinst
```

最终打包为 `<app_id>_<platform>.tar.gz`，包含两个 deb 文件。

---

## config.ini 字段规范

`config.ini` 后缀为 `.ini`，但内容必须是**合法 JSON**。

要求：
1. 不允许注释
2. 不允许尾随逗号
3. 字段类型必须固定
4. 安装到 `/usr/local/<app_id>/config.ini`

### 完整字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `string` | ✅ | 应用 ID |
| `icon` | `string` | ✅ | 应用图标路径（应用内相对路径） |
| `exec` | `bool` | ✅ | 是否需要启动后端服务 |
| `version` | `string` | ✅ | 应用版本，与 deb 元数据 `version` 相同 |
| `category` | `[]string` | ✅ | 应用分类，最多三个 |
| `platform` | `string` | ✅ | 架构：`x86_64` / `aarch64` |
| `system_id` | `string` | ✅ | systemd 服务 ID（不含 `.service`） |
| `package` | `string` | ✅ | 与 deb 元数据 `package` 对应 |
| `application_type` | `string` | ✅ | `deb` 或 `deb-TarGz` |
| `path` | `string` | ✅ | 应用路由地址，格式 `/<app_id>/` |
| `open_path` | `bool` | ❌ | 是否新页面打开（类型 B/D 必须为 true） |
| `type` | `string` | ❌ | 打开方式：`iframe`（类型 A） |
| `resize` | `bool` | ❌ | 窗口是否支持拉伸 |
| `maxmin` | `bool` | ❌ | 窗口是否支持放大缩小 |
| `width` | `int` | ❌ | 窗口宽度，默认 1180 |
| `height` | `int` | ❌ | 窗口高度，默认 680 |
| `low_version` | `string` | ❌ | 支持的最低系统版本 |
| `help` | `string` | ❌ | 帮助网址 |
| `recommend` | `bool` | ❌ | 是否推荐应用 |
| `beta` | `bool` | ❌ | 是否测试应用 |
| `depend` | `[]string` | ❌ | 依赖的应用 ID 列表 |
| `relation` | `[]string` | ❌ | 关联的应用 ID 列表 |
| `official` | `string` | ❌ | 官方网址 |
| `user` | `string` | ❌ | 安装时可创建的系统用户 |

### 各类型最小配置

**类型 A（deb 有 UI，iframe 内嵌）：**
```json
{
  "id": "<app_id>",
  "icon": "/images/icons/<app_id>.svg",
  "exec": true,
  "version": "<version>",
  "category": ["Utilities"],
  "platform": "x86_64",
  "system_id": "<system_id>",
  "package": "<deb_package_name>",
  "application_type": "deb",
  "path": "/<app_id>/",
  "type": "iframe"
}
```

**类型 B（deb 有 UI，外部打开）：**
```json
{
  "id": "<app_id>",
  "icon": "/images/icons/<app_id>.svg",
  "exec": true,
  "version": "<version>",
  "category": ["Utilities"],
  "platform": "x86_64",
  "system_id": "<system_id>",
  "package": "<deb_package_name>",
  "application_type": "deb",
  "path": "/<app_id>/",
  "open_path": true
}
```

**类型 C（deb 无 UI）：**
```json
{
  "id": "<app_id>",
  "icon": "/images/icons/<app_id>.svg",
  "exec": true,
  "version": "<version>",
  "category": ["Utilities"],
  "platform": "x86_64",
  "system_id": "<system_id>",
  "package": "<deb_package_name>",
  "application_type": "deb"
}
```

**类型 D（tar.gz 有 UI，外部打开）：**
```json
{
  "id": "<app_id>",
  "icon": "/images/icons/<app_id>.svg",
  "exec": true,
  "version": "<version>",
  "category": ["Utilities"],
  "platform": "x86_64",
  "system_id": "<system_id>",
  "package": "<deb_package_name>",
  "application_type": "deb-TarGz",
  "path": "/<app_id>/",
  "open_path": true
}
```

**类型 E（tar.gz 无 UI）：**
```json
{
  "id": "<app_id>",
  "icon": "/images/icons/<app_id>.svg",
  "exec": true,
  "version": "<version>",
  "category": ["Utilities"],
  "platform": "x86_64",
  "system_id": "<system_id>",
  "package": "<deb_package_name>",
  "application_type": "deb-TarGz"
}
```

### 字段关联规则

| 关联 | 说明 |
|------|------|
| `config.ini.package` == deb 元数据 `Package` | 包名对应 |
| `config.ini.version` == deb 元数据 `Version` | 版本对应 |
| `config.ini.system_id` == systemd 服务 ID | 服务名对应 |
| `<app_id>.lang` 文件名 == `config.ini.id` | 语言文件对应 |
| `nginx/<app_id>.conf` 文件名 == `config.ini.id` | nginx 配置对应（类型 B/D） |
| `config.ini.path` 对应 nginx location 路由 | 路由对应（类型 B/D） |
| 双包中 `config.ini.system_id` == **源包**的 systemd 服务 ID | 双包特有 |

---

## lang 文件规范

安装路径：`/usr/local/<app_id>/<app_id>.lang`

文件名必须与 `config.ini.id` 对应。内容使用 INI section 格式。

支持 14 种语言 section：
```
[de-de] [en-us] [es-es] [fr-fr] [hu-hu] [it-it]
[ja-jp] [ko-kr] [pl-pl] [pt-pt] [ru-ru] [tr-tr]
[zh-cn] [zh-hk]
```

字段结构：

| 字段 | 说明 |
|------|------|
| `name` | 应用显示名称 |
| `auth` | 开发者 |
| `descript` | 应用描述 |
| `release_note` | 更新内容 |
| `important` | 重要提示信息 |

示例：
```ini
[zh-cn]
name = "应用名称"
auth = "开发者"
descript = "应用描述"
release_note = "更新内容"
important = "重要提示"

[en-us]
name = "App Name"
auth = "Developer"
descript = "App description"
release_note = "Release notes"
important = "Important notice"
```

---

## 图标规范

路径：`/usr/local/<app_id>/images/icons/<icon_file>.svg`

`config.ini.icon` 必须写为应用内相对路径：`"/images/icons/<icon_file>.svg"`

---

## systemd 服务规范

服务文件存放路径：`/usr/local/<app_id>/init.d/<system_id>.service`

标准服务文件：

### 类型 A（Unix Socket）

```ini
[Unit]
Description=<service_description>
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/<app_id>/bin/<binary_name>
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

### 有依赖的情况

```ini
[Unit]
Description=<service_description>
After=network.target

[Service]
Type=simple
EnvironmentFile=/usr/local/<app_id>/<app_id>.env
ExecStart=/usr/local/<app_id>/bin/<binary_name>
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

---

## 依赖管理规范

依赖的动态库、命令行工具、配置文件等存放在 `/usr/local/<app_id>/depends/`。

### 目录结构

```text
/usr/local/<app_id>/depends/
├── bin/          # 命令查找路径
├── lib/          # 动态库路径
├── python/       # Python 模块路径
├── config/       # 配置文件路径
└── data/         # 数据目录（自定义）
```

### 环境变量文件

`/usr/local/<app_id>/<app_id>.env`：

```text
PATH=/usr/local/<app_id>/depends/bin
LD_LIBRARY_PATH=/usr/local/<app_id>/depends/lib
PYTHONPATH=/usr/local/<app_id>/depends/python
CONFIG_DIR=/usr/local/<app_id>/depends/config
DATA_DIR=/usr/local/<app_id>/depends/data
```

如需依赖系统自带工具：
```text
PATH=/usr/local/<app_id>/depends/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

**注意：** 依赖关系通过配置文件管理，不需要写入 deb 安装包的元数据 `Depends` 字段。但 tar.gz 双包中，**数据包的 `Depends` 字段必须写上源包包名**。

---

## 后端服务规范

### 类型 A（Unix Socket）

后端**必须**监听 Unix Socket：`/var/api/<app_id>.sock`

要求：
1. `/var/api` 不存在时必须自动创建
2. 启动前必须清理旧 socket 文件
3. socket 文件权限必须允许平台代理访问（`chmod 666`）
4. 后端接口协议为 HTTP-over-Unix-socket
5. 后端应优雅处理 `SIGTERM`

### 类型 B/D（TCP 端口）

后端直接监听 `<listen_port>`。

要求：
1. 提供健康检查接口
2. 提供业务 API 路由
3. 如需兼容系统入口，可同时支持 `/v2/proxy/<app_id>/<resource>` 路径

---

## 前端请求与鉴权规范

### 前端请求路径

**类型 A（iframe 内嵌）：**
前端请求**必须**走平台代理路径，不能直接访问 socket：
```text
/v2/proxy/<app_id>/<api_name>
```

示例：
```js
fetch("/v2/proxy/<app_id>/<api_name>", {
  method: "POST",
  credentials: "include",
  headers: apiHeaders(),
  body: JSON.stringify(payload)
});
```

**类型 B/D（外部打开）：**
前端使用相对路径：
```js
fetch("/<app_id>/<api_name>", {
  method: "POST",
  credentials: "include",
  headers: apiHeaders(),
  body: JSON.stringify(payload)
});
```

### 鉴权 Header

前端必须读取网站 cookie：`TMSESSNAME` 和 `X-Csrf-Token`

请求 header 必须包含：
```text
X-Csrf-Token: <从 cookie 读取到的 X-Csrf-Token 值>
Cookie: TMSESSNAME=<TMSESSNAME值>; X-Csrf-Token=<X-Csrf-Token值>;
```

前端实现：
```js
function getCookie(name) {
  const prefix = encodeURIComponent(name) + "=";
  return document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(prefix))
    ?.slice(prefix.length) || "";
}

function apiHeaders() {
  const sessionName = getCookie("TMSESSNAME");
  const csrfToken = getCookie("X-Csrf-Token");
  return {
    "Content-Type": "application/json",
    "X-Csrf-Token": csrfToken,
    "Cookie": `TMSESSNAME=${sessionName}; X-Csrf-Token=${csrfToken};`
  };
}
```

注意：
1. 浏览器不允许前端手动设置标准 `Cookie` header，本规范使用自定义 header `Cookie` 传递
2. `Cookie` 为固定 key 名称，必须按平台要求拼写
3. 请求应保留 `credentials: "include"`

后端如需支持预检请求，应允许 header：`Content-Type`、`X-Csrf-Token`、`Cookie`

---

## nginx 配置规范

仅类型 B/D 需要。文件路径：`/usr/local/<app_id>/nginx/<app_id>.conf`

**通用规则：** 只写 `location {}` 指令，**不能写 `server {}`**（TOS 的 conf.d 已在 server 块内）

### 类型 B/D 模板

```nginx
location /<app_id>/ {
    proxy_pass http://127.0.0.1:<listen_port>/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

`proxy_pass` 末尾的 `/` 使路径重写：`/<app_id>/api/search` → 后端收到 `/api/search`

---

## 前端文件（webui.bz2）规范

仅类型 A 需要。类型 B/D 的前端由后端自行提供。

前端源码：
```text
webui/
├── index.html
├── app.js
└── styles.css
```

打包时压缩为 `webui.bz2`（bzip2 压缩的 tar 归档），安装后路径：`/usr/local/<app_id>/webui.bz2`

要求：
1. `webui.bz2` 是固定文件名，不能改成其他名称
2. 解压后必须包含可正常打开的 `.html` 文件
3. 前端资源引用应带版本参数：`<link rel="stylesheet" href="./styles.css?v=<version>">`
4. 前端页面每次新打开时应初始化为空状态

打包命令：
```bash
cd webui/ && tar cjf ../webui.bz2 . && cd ..
```

---

## debian 包元数据（control 文件）

### 单 deb 包

```text
Package: <deb_package_name>
Version: <version>
Section: utils
Priority: optional
Architecture: amd64
Maintainer: <author> <email>
Description: <description>
```

### tar.gz 双包 - 数据包 control

```text
Package: <deb_package_name>
Version: <version>
Section: utils
Priority: optional
Architecture: amd64
Depends: <source_package_name> (>= <version>)
Maintainer: <author> <email>
Description: Data package for <app_id>
```

### tar.gz 双包 - 源包 control

```text
Package: <source_package_name>
Version: <version>
Section: utils
Priority: optional
Architecture: amd64
Depends: python3, systemd
Maintainer: <author> <email>
Description: <description>
```

---

## postinst / prerm 脚本

### 单 deb 包 - postinst

**类型 A（有 webui.bz2）：**
```bash
#!/bin/sh
set -e

APP_ID="<app_id>"
BINARY_NAME="<binary_name>"

# 确保可执行
chmod +x /usr/local/${APP_ID}/bin/${BINARY_NAME}

# 解压 webui.bz2
if [ -f /usr/local/${APP_ID}/webui.bz2 ]; then
    mkdir -p /usr/local/${APP_ID}/webui
    cd /usr/local/${APP_ID}/webui
    tar xjf /usr/local/${APP_ID}/webui.bz2
fi
```

**类型 B（有 nginx）：**
```bash
#!/bin/sh
set -e

APP_ID="<app_id>"
BINARY_NAME="<binary_name>"

# 确保可执行
chmod +x /usr/local/${APP_ID}/bin/${BINARY_NAME}

# 配置 nginx
if [ -f /usr/local/${APP_ID}/nginx/${APP_ID}.conf ]; then
    cp /usr/local/${APP_ID}/nginx/${APP_ID}.conf /etc/nginx/conf.d/
    nginx -s reload 2>/dev/null || true
fi

# 配置 systemd
if [ -f /usr/local/${APP_ID}/init.d/${SYSTEM_ID}.service ]; then
    cp /usr/local/${APP_ID}/init.d/${SYSTEM_ID}.service /lib/systemd/system/
    systemctl daemon-reload
    systemctl enable ${SYSTEM_ID}
    systemctl start ${SYSTEM_ID}
fi
```

**类型 C（无 UI）：**
```bash
#!/bin/sh
set -e

APP_ID="<app_id>"
BINARY_NAME="<binary_name>"

# 确保可执行
chmod +x /usr/local/${APP_ID}/bin/${BINARY_NAME}

# 配置 systemd
if [ -f /usr/local/${APP_ID}/init.d/${SYSTEM_ID}.service ]; then
    cp /usr/local/${APP_ID}/init.d/${SYSTEM_ID}.service /lib/systemd/system/
    systemctl daemon-reload
    systemctl enable ${SYSTEM_ID}
    systemctl start ${SYSTEM_ID}
fi
```

### 单 deb 包 - prerm

```bash
#!/bin/sh
set -e

# 停止并禁用服务
systemctl stop <system_id> 2>/dev/null || true
systemctl disable <system_id> 2>/dev/null || true

# 清理 systemd 文件
rm -f /lib/systemd/system/<system_id>.service
systemctl daemon-reload

# 清理 nginx 配置（类型 B）
rm -f /etc/nginx/conf.d/<app_id>.conf
nginx -s reload 2>/dev/null || true
```

### tar.gz 双包 - 数据包 postinst

数据包通常不需要 postinst，TOS 应用中心会自动处理注册。

### tar.gz 双包 - 源包 postinst

```bash
#!/bin/bash
chmod +x /usr/local/<app_id>/bin/<binary_name>
systemctl daemon-reload
systemctl enable <system_id>
systemctl start <system_id>
```

---

# Step 3: 构建 .deb 包

## 3.1 确认代码路径

**必须询问用户**代码路径，确认存在且包含必要文件后才能继续。

## 3.2 构建流程

### 类型 A/B/C（单 deb 包）

```bash
#!/bin/bash
APP_ID="<app_id>"
BINARY_NAME="<binary_name>"
VERSION="<version>"
PLATFORM="x86_64"

# 准备构建目录
BUILD_DIR="/tmp/${APP_ID}_build"
rm -rf ${BUILD_DIR}
mkdir -p ${BUILD_DIR}/DEBIAN
mkdir -p ${BUILD_DIR}/usr/local/${APP_ID}/bin
mkdir -p ${BUILD_DIR}/usr/local/${APP_ID}/images/icons
mkdir -p ${BUILD_DIR}/usr/local/${APP_ID}/init.d

# 复制文件
cp src/packaging/config.ini ${BUILD_DIR}/usr/local/${APP_ID}/
cp src/packaging/<app_id>.lang ${BUILD_DIR}/usr/local/${APP_ID}/
cp src/packaging/images/icons/<app_id>.svg ${BUILD_DIR}/usr/local/${APP_ID}/images/icons/
cp src/packaging/init.d/<system_id>.service ${BUILD_DIR}/usr/local/${APP_ID}/init.d/
cp src/backend/<binary_name> ${BUILD_DIR}/usr/local/${APP_ID}/bin/
chmod +x ${BUILD_DIR}/usr/local/${APP_ID}/bin/${BINARY_NAME}

# 类型 A：打包 webui.bz2
if [ "<type>" = "A" ]; then
    cd src/webui/ && tar cjf ${BUILD_DIR}/usr/local/${APP_ID}/webui.bz2 . && cd -
fi

# 类型 B：nginx 配置
if [ "<type>" = "B" ]; then
    mkdir -p ${BUILD_DIR}/usr/local/${APP_ID}/nginx
    cp src/packaging/nginx/<app_id>.conf ${BUILD_DIR}/usr/local/${APP_ID}/nginx/
fi

# 依赖管理（可选）
if [ -d "src/depends" ]; then
    cp -r src/depends ${BUILD_DIR}/usr/local/${APP_ID}/
    cp src/<app_id>.env ${BUILD_DIR}/usr/local/${APP_ID}/
fi

# debian 元数据
cp src/packaging/control ${BUILD_DIR}/DEBIAN/control
cp src/packaging/postinst ${BUILD_DIR}/DEBIAN/postinst
chmod 755 ${BUILD_DIR}/DEBIAN/postinst
cp src/packaging/prerm ${BUILD_DIR}/DEBIAN/prerm
chmod 755 ${BUILD_DIR}/DEBIAN/prerm

# 构建 deb
dpkg-deb --build ${BUILD_DIR} ${APP_ID}_${PLATFORM}.deb
```

### 类型 D/E（tar.gz 双 deb 包）

先分别构建数据包和源包，再打包为 tar.gz：

```bash
#!/bin/bash
APP_ID="<app_id>"
BINARY_NAME="<binary_name>"
SOURCE_PACKAGE="<source_package_name>"
VERSION="<version>"
PLATFORM="x86_64"

##### 构建源包 #####
SRC_BUILD="/tmp/${APP_ID}_src_build"
rm -rf ${SRC_BUILD}
mkdir -p ${SRC_BUILD}/DEBIAN
mkdir -p ${SRC_BUILD}/usr/local/${APP_ID}/bin
mkdir -p ${SRC_BUILD}/usr/local/${APP_ID}/init.d

# 复制可执行程序
cp src/backend/<binary_name> ${SRC_BUILD}/usr/local/${APP_ID}/bin/
chmod +x ${SRC_BUILD}/usr/local/${APP_ID}/bin/${BINARY_NAME}

# systemd 服务
cp src/source_package/init.d/<system_id>.service ${SRC_BUILD}/usr/local/${APP_ID}/init.d/

# 依赖（可选）
if [ -d "src/depends" ]; then
    cp -r src/depends/* ${SRC_BUILD}/usr/local/${APP_ID}/
    cp src/<app_id>.env ${SRC_BUILD}/usr/local/${APP_ID}/
fi

# 类型 D：前端文件放入源包（由后端服务提供）
if [ "<type>" = "D" ]; then
    mkdir -p ${SRC_BUILD}/usr/share/${APP_ID}
    cp -r src/webui/* ${SRC_BUILD}/usr/share/${APP_ID}/
fi

# 源包 debian 元数据
cp src/source_package/control ${SRC_BUILD}/DEBIAN/control
cp src/source_package/postinst ${SRC_BUILD}/DEBIAN/postinst
chmod 755 ${SRC_BUILD}/DEBIAN/postinst

dpkg-deb --build ${SRC_BUILD} ${SOURCE_PACKAGE}.deb

##### 构建数据包 #####
DATA_BUILD="/tmp/${APP_ID}_data_build"
rm -rf ${DATA_BUILD}
mkdir -p ${DATA_BUILD}/DEBIAN
mkdir -p ${DATA_BUILD}/usr/local/${APP_ID}/images/icons

# 配置文件
cp src/data_package/config.ini ${DATA_BUILD}/usr/local/${APP_ID}/
cp src/data_package/<app_id>.lang ${DATA_BUILD}/usr/local/${APP_ID}/
cp src/data_package/images/icons/<app_id>.svg ${DATA_BUILD}/usr/local/${APP_ID}/images/icons/

# 类型 D：nginx 配置
if [ "<type>" = "D" ]; then
    mkdir -p ${DATA_BUILD}/usr/local/${APP_ID}/nginx
    cp src/data_package/nginx/<app_id>.conf ${DATA_BUILD}/usr/local/${APP_ID}/nginx/
fi

# 数据包 debian 元数据
cp src/data_package/control ${DATA_BUILD}/DEBIAN/control
cp src/data_package/prerm ${DATA_BUILD}/DEBIAN/prerm
chmod 755 ${DATA_BUILD}/DEBIAN/prerm

dpkg-deb --build ${DATA_BUILD} ${APP_ID}.deb

##### 打包为 tar.gz #####
tar czf ${APP_ID}_${PLATFORM}.tar.gz ${APP_ID}.deb ${SOURCE_PACKAGE}.deb
```

## 3.3 验证 .deb 包

```bash
# 检查包结构
dpkg-deb -I <deb_file>

# 检查文件列表
dpkg-deb -c <deb_file>

# 验证关键字段
dpkg-deb -I <deb_file> | grep "^ Package:"
dpkg-deb -I <deb_file> | grep "^ Version:"
```

验证要点：
- `Package` 与 `config.ini.package` 一致
- `Version` 与 `config.ini.version` 一致
- 文件路径都以 `usr/local/<app_id>/` 开头
- 类型 A 有 `webui.bz2`，类型 B/D 有 `nginx/` 目录
- 双包数据包的 `Depends` 引用了源包包名

---

# Step 4: 安装

## 4.0 前置确认

- Step 3 成功后，**必须询问用户**："安装包已生成，是否立刻安装？"
- 用户直接要求安装时，**必须询问安装包路径和文件名**
- 必须验证文件存在后才可继续

## 4.1 安装方式

### 单 deb 包安装

**通过应用中心安装**（推荐）：
将 .deb 包上传到 TOS 应用中心进行安装。

**手动安装**：
```bash
# 创建软链接（如果 /usr/local/<app_id> 不在应用安装路径）
APP_ID="<app_id>"
INSTALL_PATH="/Volume1/@apps"

mkdir -p "${INSTALL_PATH}/${APP_ID}"
if [ ! -L "/usr/local/${APP_ID}" ]; then
    rm -rf "/usr/local/${APP_ID}" 2>/dev/null || true
    ln -s "${INSTALL_PATH}/${APP_ID}" "/usr/local/${APP_ID}"
fi

dpkg -i <deb_file>
```

### tar.gz 双包安装

```bash
# 解压
tar xzf <tar_gz_file> -C /tmp/<app_id>_install/

# 先安装源包
dpkg -i /tmp/<app_id>_install/<source_package>.deb

# 再安装数据包
dpkg -i /tmp/<app_id>_install/<app_id>.deb
```

或通过应用中心上传 tar.gz 文件。

## 4.2 验证安装

```bash
# 服务状态
systemctl status <system_id>.service --no-pager | head -5

# 类型 A：检查 Unix Socket
ls -la /var/api/<app_id>.sock

# 类型 B/D：检查 TCP 端口
curl -s http://127.0.0.1:<listen_port>/api/status | head -3

# 类型 B/D：检查 nginx 代理
curl -sI http://127.0.0.1:8181/<app_id>/ | head -5
```

---

# 常见错误

| # | 错误现象 | 原因 | 解决方案 |
|---|---------|------|---------|
| 1 | Unix Socket 未创建 | 后端未正确创建 socket | 确保启动时自动创建 `/var/api/` 目录并绑定 socket |
| 2 | Socket 权限拒绝 | socket 文件权限不足 | `chmod 666 /var/api/<app_id>.sock` |
| 3 | 前端 404 找不到 API | 路径不匹配 | 检查 `/v2/proxy/<app_id>` 前缀是否正确 |
| 4 | nginx 301 重定向到 /tos/ | 正则 location 劫持 | nginx 配置加 `^~` 前缀：`location ^~ /<app_id>/` |
| 5 | dpkg 安装失败：目录不存在 | data.tar.gz 缺少目录条目 | 构建时 `mkdir -p` 确保目录存在 |
| 6 | 双包安装失败 | 数据包未找到源包依赖 | 先安装源包，再安装数据包 |
| 7 | 服务启动后立即退出 | 可执行文件权限问题 | postinst 中 `chmod +x` |
| 8 | webui.bz2 解压失败 | 压缩格式不对 | 必须是 `tar cjf`（bzip2 压缩的 tar） |
| 9 | 鉴权失败 | Cookie header 缺失 | 检查前端是否正确读取 TMSESSNAME 和 X-Csrf-Token |
| 10 | 旧 socket 文件残留 | 上次异常退出未清理 | 启动前 `os.unlink(SOCKET_PATH)` 清理 |

---

## 输出规则

| 场景 | 输出 |
|---|---|
| 安装成功且服务运行 | "应用 XX 已成功安装，服务运行中。" |
| 安装成功但服务未启动 | "应用 XX 已安装，但服务未能启动，请检查日志。" |
| dpkg 安装失败 | "安装包安装失败：[错误信息]，请检查安装包是否完整兼容。" |
| 安装包文件不存在 | "未找到安装包文件：[路径]，请确认路径是否正确。" |