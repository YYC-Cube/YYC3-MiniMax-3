# 为什么Plex添加媒体库文件后却无法扫描出文件

**链接**：https://forum.terra-master.com/cn/viewtopic.php?t=4001&sid=b265ad2ea5bccea440907c924ea82b46

**关键词**：Plex媒体服务器、plex、媒体服务器、影视、影音、视频播放

---

适用版本：
TOS 5

适用机种：
所有 TNAS型号（不包括F2-210、F4-210型号）

故障现象：
Plex添加媒体库文件后却无法扫描出文件

故障原因：
Plex添加的共享文件夹没有加入media用户组权限

解决方法：
1.请为Plex添加的共享文件夹设置media用户组权限，请前往 TOS控制面板》共享文件夹，选中需要设置的共享文件夹，点击“编辑”按钮，为media用户组配置读写权限。


2. 请先关闭Plex应用，然后重启Plex应用即可。
