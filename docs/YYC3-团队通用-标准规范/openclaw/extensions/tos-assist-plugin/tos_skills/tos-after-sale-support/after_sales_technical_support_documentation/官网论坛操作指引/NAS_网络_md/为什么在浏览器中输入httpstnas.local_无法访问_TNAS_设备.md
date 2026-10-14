# 为什么在浏览器中输入 httpstnas.local 无法访问 TNAS 设备

适用机型：
所有 TNAS 机型

问题描述：
在浏览器中输入 https://tnas.local 时，无法成功访问 TNAS 设备。

可能原因：
访问失败可能源于 DNS 解析问题、电脑本地 hosts 文件配置错误、浏览器缓存干扰、防火墙或安全软件拦截，以及网络连接不稳定等多种因素。

解决方案：
方法一：全面排查故障
逐一检查并排除 DNS 解析、电脑本地 hosts 文件、浏览器缓存、防火墙设置、安全软件配置以及网络连接等方面的问题。

方法二：使用 TNAS PC 客户端搜索 TNAS 设备
在 Windows 或 macOS 电脑上安装 TNAS PC 客户端，推荐使用以下版本：
TNAS PC 5.2.003（适用于 Windows 系统）
TNAS PC 5.1.202（适用于 macOS，Intel芯片）
TNAS PC 5.1.202（适用于 macOS，Apple芯片）
注意：TNAS PC 客户端仅能搜索到与电脑所在同一局域网同一网段的 TNAS 设备

方法三：通过路由器查找设备 IP
登录路由器管理页面，在路由器管理页面中查找已连接设备列表，定位 TNAS 设备并查看其IP地址。

方法四：使用第三方工具 Advanced IP Scanner
下载并安装适用于 Windows 系统的 Advanced IP Scanner for Windows，使用该工具扫描网络中的设备，查找并获取 TNAS 设备的 IP 地址。
