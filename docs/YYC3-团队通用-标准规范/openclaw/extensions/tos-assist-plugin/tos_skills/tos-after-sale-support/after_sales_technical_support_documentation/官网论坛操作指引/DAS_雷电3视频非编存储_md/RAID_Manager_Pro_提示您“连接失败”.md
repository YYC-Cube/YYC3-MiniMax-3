# RAID Manager Pro 提示您“连接失败”？

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=297

故障排除

适用机型：
TerraMaster D4 Thunderbolt 3（D4-330）
TerraMaster D5 Thunderbolt 3（D5-330）
TerraMaster D8 Thunderbolt 3（D8-330）

RAID Manager pro是TerraMaster Thunderbolt 3设备的硬件阵列控制器的配置工具。如果要创建硬件阵列，则需要在计算机上安装RAID Manager。

需要用户名和密码才能运行RAID Manager Pro
用户名：RAID
默认密码：hpt
登录后即可更改密码。

如果您已将硬盘安装到TerraMaster Thunderbolt 3设备中，但是无法创建RAID，提示“连接失败！”。在计算机上运行RAID Manager pro时，请尝试以下解决方案：
connection failure.jpg
1.您可以将TerraMaster Thunderbolt 3设备连接到Thunderbolt 3雷电接口；
2.您的计算机上尚未安装RAID控制器驱动程序，请下载并安装TerraMaster Thunderbolt 3驱动。
Windows：https://dl.terra-master.com/cn/T32720_R ... or_Win.zip
Mac：https://dl.terra-master.com/cn/T32720_R ... %20Mac.zip
3.确保您使用的是设备附带的原装Thunderbolt 3电缆，或带有Thunderbolt 3标记的认证雷电线材；劣质线材或未经认证的电缆可能会导致连接失败；
4.如果您是Windows 10用户，请检查计算机上是否已安装Thunderbolt 3接口驱动程序。如果没有，请访问计算机制造商的官方网站下载驱动程序或更新计算机主板的驱动程序。如果失败，请访问英特尔官方网站（https://downloadcenter.intel.com/zh-cn/ ... -Intel-NUC），下载英特尔提供的Thunderbolt 3接口驱动程序；
5.安装产品Thunderbolt 3驱动程序后，计算机上还将安装windows 10电脑的hunderbolt控制软件。 查找并打开Thunderbolt控制软件，允许所连接的Thunderbolt设备。
thunderbolt_control (1).png
