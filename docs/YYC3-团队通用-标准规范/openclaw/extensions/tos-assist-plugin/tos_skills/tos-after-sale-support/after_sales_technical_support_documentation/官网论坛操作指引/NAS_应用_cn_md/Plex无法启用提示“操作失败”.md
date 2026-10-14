# Plex无法启用，提示“操作失败”

**链接**：https://forum.terra-master.com/cn/viewtopic.php?t=3496&sid=b265ad2ea5bccea440907c924ea82b46

**关键词**：Plex媒体服务器、plex、媒体服务器、影视、影音、视频播放

---

操作指引

适用机型：所有 TNAS 型号
适用系统：TOS 5/6

故障现象
个别的TNAS用户Plex应用使用一段时间后无法启用，提示“操作失败”，这可能是Plex应用的数据库损坏，请参照以下对策。

对策
1. 前往TOS应用中心>已安装，停用Plex。
2. 前往TOS桌面打开File Manager, 进入目录Plex > Library > Application Support > Plex Media Server > Plug-in Support > Databases，找到正在使用的数据库（后缀名为db)，将正在使用的数据库改名备份。
plex1.png
3.前往TOS应用中心>已安装，重新启用Plex。
4.如果Plex仍然无法启用，请前往TOS 控制面板>共享文件夹，修改Plex文件夹名称，然后再次启用Plex。
