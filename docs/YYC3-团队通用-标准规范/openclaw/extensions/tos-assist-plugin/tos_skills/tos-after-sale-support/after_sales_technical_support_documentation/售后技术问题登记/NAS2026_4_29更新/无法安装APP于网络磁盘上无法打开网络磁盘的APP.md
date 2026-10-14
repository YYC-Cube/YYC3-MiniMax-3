# 无法安装APP于网络磁盘上。无法打开网络磁盘的APP。

**关键词：SMB Direct、网络磁盘、控制面板、SMB、无法打开网络磁盘的APP**

**解决方案：**

原因：Windows默认禁用SMB Direct，导致无法在网络磁盘上安装或运行APP。

解决方法：
1. 控制面板 → 程序 → 程序与功能 → 打开或关闭 Windows 功能打开或关闭Windows功能）
2. 勾选「SMB Direct」并确认
3. 重启电脑后重试
