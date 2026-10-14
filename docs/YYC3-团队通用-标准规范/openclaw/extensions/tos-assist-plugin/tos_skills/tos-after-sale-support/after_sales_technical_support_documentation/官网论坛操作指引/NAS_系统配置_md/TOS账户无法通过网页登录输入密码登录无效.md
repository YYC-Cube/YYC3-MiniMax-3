# TOS账户无法通过网页登录，输入密码登录无效？

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=1568&sid=91960374e52a8fba318a0aab4711ff91

故障排除

原因分析:
输入密码无法登录到 TOS桌面，且没有错误提示。引起该现象的原因一般有以下两种：
1.redis 服务失效
2.卷的文件系统为btrfs，而 btrfs文件系统出现异常

解决方法：
1.登录ssh 如何登录 SSH终端？

2.执行以下指令重启 redis服务，刷新TOS页面，重新登录
代码： 全选/etc/init.d/redis  restart

如果上述方法无效，请继续下面的操作步骤：

3.执行以下指令查看系统日志：
代码： 全选dmesg

4.若发现明显的红色字体标识，或带有“Btrfs error”字样的信息，则表示文件系统异常，请逐条执行以下指令，卸除文件系统：
代码： 全选umount /mnt/md0
umount /home

5.执行以下指令，对 btrfs文件系统进行检测：
代码： 全选btrfs check /dev/mapper/vg0-lv0

6.若检查时间过长或出现明显的错误提示，请耐心等待，检测完成后，执行以下指令恢复文件系统：
（若 btrfs文件系统异常情况严重，该操作可能会有风险）
代码： 全选btrfs check --repair /dev/mapper/vg0-lv0

7. 如上图，恢复时，若出现“10 9 8 7 6 5 4 3 2 1”，表示文件系统恢复的概率很大，仅需等待恢复过程结束后。完成后，执行以下指令将文件系统挂载回去：
代码： 全选/etc/tos/script/mntdata

8. 刷新 TOS 登录页面，重新登录。
