# 如何设置TOS系统外置USB设备的访问权限？

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=4807&sid=2853efb328304e05736fc85f61407238

适用版本：TOS 5/TOS 6

适用机型：全系列TNAS

故障现象：
当USB存储设备（格式为FAT32/NTFS/exFAT）接入TNAS时，控制面板中无法配置用户权限，所有账户默认拥有读写权限。

故障原因：
由于FAT32/NTFS/exFAT文件系统设计限制，不支持Linux权限管理机制，故无法通过TOS系统设置USB存储设备访问权限。

解决方案：
请提前备份USB设备中的重要文件，将外置USB设备连接至电脑格式化为EXT4、BTRFS、HFS Plus文件系统格式。
然后，将格式化后的USB设备接入TNAS，再前往控制面板 > 存储管理 >USB设备>点击更多 > 权限，设置用户权限。
