# 当TOS系统安装至M.2 SSD上并遭遇异常时，如何重装TOS系统？(223423机型)

适用版本:

所有版本

适用机型：

F2-223/F2-423/F4-223/F4-423/T6-423/T9-423

故障现象：

由于异常断电或SSD故障等原因导致TOS系统异常，导致正常开机无法并进入TOS。

对策 ：由于NVMe M.2 SSD 固态硬盘不支持热插拔的特性，所以当M.2 SSD的TOS系统出现故障异常后，无法通过拔掉M.2 SSD重新安装TOS。只能将M.2 SSD拆卸下来，安装至硬盘盒设备格式化容量为7.6GB大小的分区（TOS系统分区）。

步骤一：下载与安装Diskgenius格式化软件

1、访问Diskgenius官网https://www.diskgenius.com，下载并安装适用于您操作系统的Diskgenius版本。

步骤二：NVME M.2 SSD安装至硬盘盒内并连接至电脑，并格式化硬盘容量为8GB大小的分区

1、启动Diskgenius软件，在界面中找到并选中识别到的NVME M.2 SSD硬盘。

2、选中“Partition(1)”分区（容量为7.6GB），此分区即为TOS系统分区。点击鼠标右键将弹出一个下拉对话框，然后选中“Format Current Partition(F)”。

3、在弹出的格式化窗口中，确认所选分区无误后，然后点击“确定”开始格式化。

警告：Partition(3)”为数据分区，请勿对此分区做任何处理。

步骤三：重新安装TOS系统

1、关闭TNAS，将已格式化完的NVME M.2 SSD硬盘安装回TNAS设备中。

2、启动TNAS，参考以下链接重新安装TOS系统。

https://forum.terra-master.com/en/viewtopic.php?t=423
