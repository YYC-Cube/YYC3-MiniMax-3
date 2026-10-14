# 为什么Emby应用选择TNAS共享文件夹时提示错误

**链接**：https://forum.terra-master.com/cn/viewtopic.php?t=4002&sid=b265ad2ea5bccea440907c924ea82b46

**关键词**：emby、媒体服务器、影视、影音、视频播放

---

适用版本：
TOS 5

适用机种：
所有 TNAS型号（不包括F2-210、F4-210型号）

故障现象：
Emby应用选择TNAS共享文件夹时提示错误

故障原因：
Emby添加的共享文件夹没有加入media用户组权限

解决方法：
1.请为Emby添加的共享文件夹设置media用户组权限，请前往 TOS控制面板》共享文件夹，选中需要设置的共享文件夹，点击“编辑”按钮，为media用户组配置读写权限。


2. 请先关闭Emby应用，然后重启Emby应用即可。
