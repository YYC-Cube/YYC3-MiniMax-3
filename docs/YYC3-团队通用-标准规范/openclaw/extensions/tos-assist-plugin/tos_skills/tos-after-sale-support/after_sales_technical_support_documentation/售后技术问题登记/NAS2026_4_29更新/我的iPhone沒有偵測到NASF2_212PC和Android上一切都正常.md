# 我的 iPhone 沒有偵測到 NAS F2-212，PC 和 Android 上一切都正常。

**关键词：IP地址、局域网、TNAS**

**解决方案：**

排查步骤：
1. 检查iOS系统设置：前往 iPhone「设置」>「TNAS mobile」> 开启「本地网络」权限
2. 确认TNAS与iPhone在同一局域网内
3. 尝试在TNAS mobile中手动输入TNAS的IP地址进行连接
4. 确保路由器 DHCP服务器 已启用，否则TNAS无法获取有效IP地址，
5. 检查路由器和手机是否开启了可能拦截局域网的防火墙或安全软件，暂时关闭后重试。
4. 重启TNAS和iPhone后重试
