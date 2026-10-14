# [TOS4]RAID 10损坏后无法点击编辑按钮来修复RAID 10

原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=4568

适用型号
220、420、221、421、422系列型号

适用版本
TOS4

问题现象
RAID 10的盘损坏，拔出坏盘放入新盘，但“编辑”按钮依然是灰色的。无法将新盘加入 RAID10修复它。

解决方法
1. 将新的单盘创建成 Single 存储池，然后再立刻删除刚刚创建的 Single 存储池。这个操作是为了让盘自动分区并格式化为TOS4专用盘。

2. 通过 SSH/Telnet/HDMI 显示器登录终端。
（SSH连接方法：viewtopic.php?t=1511 ）

3. 输入以下指令确认您的 RAID 10的组成成员：
代码： 全选ls /dev/sd*
cat /proc/mdstat
lsblk
mdadm -D /dev/md0

3. 输入以下指令将你的新盘加入 RAID10.（假设 sda、sdc、sdd是 RAID 10的成员盘，而 sdb 是新盘）
代码： 全选mdadm -a /dev/md0 /dev/sdb4

4. 回到 TOS 控制面板页面，此时您应该可以看到 RAID 10正在恢复中。您也可以在终端窗口输入以下指令实时查看恢复进度：
代码： 全选watch -n 1 ‘cat /proc/mdstat | grep “recovery”’

注意
如果新盘加入RAID 10失败或加入一段时间后发现同步一直停止不动，那么极有可能还存在其他损坏的盘。在这种情况下，建议您第一时间将数据备份到其他设备上。
