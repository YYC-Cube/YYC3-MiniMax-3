# 手机端 TNAS mobile 无法访问 NAS!

请打开 TOS Web，检查 WAN 连接状态，在 APP Center 下载安装任意 app 以测试互联网连接情况。

前往控制面板-远程访问，确认 TNAS. Online 服务是启用的。您可以用浏览器访问 TNAS. Online 的 TNAS ID，看看是否能成功访问。

请打开控制面板-安全-证书，检查 SSL 证书是否过期。如果过期，请参考这个更新它：

- **[EN]** https://forum.terra-master.com/en/viewtopic.php?t=6701
  
- **[CN]** https://forum.terra-master.com/cn/viewtopic.php?t=4514
  

如果您的 TNAS 正在运行的系统是 TOS 4，请使用适配的旧版 TNAS mobile app：

- **Android：**https://download2.terra-master.com/TNASmobile_Android_2.4.20.apk
  
- **iOS：**不再可用。
  

此外，如果您在远程登录 TOS 4 NAS 时遇到提示”Illegal request, please use genuine software!“ 由于 app 版本和 TOS4 版本太旧，我们目前无法查明确切原因。如果您使用的是近期发布的 TOS 版本，请尽可能更新您的 TOS 版本以适配新的 TNAS mobile app。

我们建议切换到更稳定的 DDNS 解决方案进行远程访问。您可以在 TNAS 设备上配置 DDNS，然后在移动应用程序中使用 DDNS 域名访问 TNAS.

- **[CN]** https://forum.terra-master.com/cn/viewtopic.php?t=4946
  
- **[EN]** https://forum.terra-master.com/en/viewtopic.php?t=433
  

---
