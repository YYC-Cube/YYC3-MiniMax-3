# qBittorrent正在运行一个未知的进程,CPU占用100%.

**关键词：TOS、TNAS、Web界面、某个任务导致进程异常**

**解决方案：**

导致原因：qBittorrent的未知进程异常占用资源。

排查与解决步骤：
1. 快速恢复：前往 TOS Web > 应用中心 > qBittorrent > 停止，等待几秒后再启动
2. 清理重新启动：停止qBittorrent后，清理浏览器缓存和Cookie，重新打开qBittorrent Web界面
3. 检查下载任务：暂停或删除异常的种子任务，可能是某个任务导致进程异常
4. 更新版本：检查并升级到最新版qBittorrent
5. 如问题持续：考虑卸载qBittorrent后重新安装
6. 资源限制：若TNAS性能有限，建议减少同时下载任务数量
