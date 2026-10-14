# 重新安装Plex后，Plex无法启用了怎么办

**链接**：https://forum.terra-master.com/cn/viewtopic.php?t=626&sid=2830252e3f49fda663c79a41b721ea52

**关键词**：Plex媒体服务器、plex、媒体服务器、影视、影音、视频播放

---

故障排除

适用机型：
所有NAS型号

当因个别原因重装了Plex后，点击“启用”按钮无法启用Plex服务时，请尝试以下步骤：
1. 通过ssh以root账号(密码同admin)登录到指令窗口
2. 查看用户和用户组信息
输入：cat /etc/passwd 查看用户，看是否存在

输入：cat /etc/groud 查看用户组，看是否存在

如果能查看到如图所示的用户及用户组，请跳过3、4、5步骤
3. 创建plex用户组
输入：groupadd -g 5555 plex
4. 创建plex用户并指定到plex组
输入：useradd -M -u 5555 plex -g plex
5. 重启plex服务 
输入：/etc/init.d/plex restart
6. 前往应用中心，卸载Plex
7. 前往文件管理，点击admin用户文件夹
8. 点击User，将其中的“Plex”文件夹名称更改为“Plex1”

9. 再次前往应用中心，重新安装Plex
