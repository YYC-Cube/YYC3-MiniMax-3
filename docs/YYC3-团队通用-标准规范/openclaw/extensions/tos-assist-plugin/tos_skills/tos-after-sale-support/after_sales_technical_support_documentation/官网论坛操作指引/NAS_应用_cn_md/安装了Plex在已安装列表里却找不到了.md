# 安装了Plex，在已安装列表里却找不到了

**链接**：https://forum.terra-master.com/cn/viewtopic.php?t=544&sid=2830252e3f49fda663c79a41b721ea52

**关键词**：Plex媒体服务器、plex、媒体服务器、影视、影音、视频播放

---

故障排除

适用机型：
TNAS设备

如果您安装了Plex，但在应用中心的安装列表中找不到该应用，可以按照以下步骤手动进行修复：
1. 首先下载压缩包并解压出正确的 app.class.php，下载链接：
http://dl.terra-master.com/cn/app.class.zip

2. 把 app.class.php 文件上传到 public 目录下；
3. 使用 ssh 登录 TOS，执行以下命令替换掉错误的 app.class.php 文件： 
(1) mv  /usr/www/tos/controller/app.class.php  /usr/www/tos/controller/app.class.php0101
(2) mv  /mnt/md0/public/app.class.php  /usr/www/tos/controller/
