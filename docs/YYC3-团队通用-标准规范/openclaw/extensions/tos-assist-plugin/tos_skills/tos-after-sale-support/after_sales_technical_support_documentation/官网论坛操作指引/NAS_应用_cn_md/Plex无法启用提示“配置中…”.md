# Plex无法启用，提示“配置中…”

**链接**：https://forum.terra-master.com/cn/viewtopic.php?t=218&sid=2830252e3f49fda663c79a41b721ea52

**关键词**：Plex媒体服务器、plex、媒体服务器、影视、影音、视频播放

---

操作指引

适用机型：所有 TNAS 型号

如果您的Plex使用过一段时间后无法启用，提示“配置中…”，这可能是PLEX数据库损坏，请参照以下解决对策。

1.请登录TOS，关闭Plex。
2.在TOS桌面打开File Manager, 进入目录 admin > User > plex > home > Library > Application Support > Plex Media Server > Plug-in Support > Databases，找到正在使用的数据库（后缀名为db)。
1.png
3.将正在使用的数据库改名备份
2.png
4.找到日期较近的备份数据库
3.png
5.将备份的数据库后缀删除。
4.png
6.启动Plex。
