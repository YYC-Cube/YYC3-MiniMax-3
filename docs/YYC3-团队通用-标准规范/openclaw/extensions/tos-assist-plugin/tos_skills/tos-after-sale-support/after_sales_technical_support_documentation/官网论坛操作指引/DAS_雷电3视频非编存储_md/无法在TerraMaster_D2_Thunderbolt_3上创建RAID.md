# 无法在TerraMaster D2 Thunderbolt 3上创建RAID？

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=295

故障排查

适用机型：TerraMaster TD2-Thunderbolt 3 / D2-Thunderbolt 3（D2-330）

如果您已将硬盘安装到TerraMaster设备中，且HDD指示灯为绿色，并且所有HDD均显示正常，但是创建RAID失败，创建完成后HDD指示灯仍为红色。请尝试以下解决方案：

步骤1：将开关指针旋转到SINGLE模式；
步骤2：按住复位按钮约5秒钟，直到硬盘指示灯从绿色变为红色；
步骤3：大约3秒钟后，HDD指示灯会从红色自动变为绿色，这意味着您先前的RAID已删除，并且磁盘阵列现在设置为SINGLE模式。
步骤4：将开关的指针旋转到所需的RAID模式；
步骤5：按住复位按钮约5秒钟，直到硬盘指示灯由绿色变为红色；
步骤6：大约3秒钟后，HDD指示灯将自动从红色变为绿色。 RAID创建完成。

注意：
在整个过程中，您的TerraMaster设备和计算机需要保持开机和连接状态。
