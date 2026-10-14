# F2-NAS2/F2-NAS21/F4-NAS/F4-NAS11 搜索不到设备？

原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=645

如果您突然无法在网络中搜索到您的 F2-NAS2/F2-NAS21/F4-NAS/F4-NAS11设备，请尝试以下三种方法：

一、空机搜索
1）关机->拔出硬盘->开机；
2）尝试 V2.515 版桌面客户端搜索（路径：桌面级系统->Tcloud客户端）; 下载V2.515版桌面客户端

二、恢复出厂设置
1）设备通电状态下，按住reset键8秒，即可松手；
2）硬盘指示灯会全部变红色，代表系统进入恢复出厂设置模式；
3）等待大约15分钟，即可完成恢复出厂设置；
4）使用 V2.515 客户端尝试再搜索一次；
5）如果能搜索出NAS的IP地址，表示复位成功。

三、重新烧录固件
烧录视频教程：https://dl.terra-master.com/en/NAS/烧录步骤.zip
F2-NAS2/F4-NAS 烧录指引：https://dl.terra-master.com/en/NAS/F2-N ... AS烧录程序.zip
F2-NAS21/F4-NAS11 烧录指引：https://dl.terra-master.com/en/NAS/F2-N ... 11烧录程序.zip
烧录成功后用2.515版客户端重新搜索。

四、如果以上方法都无法搜索到设备，需要更换硬盘后再尝试一次；如果还是无法搜索到设备，说明主机已经出现故障无法修复了。

如果您成功搜索到了设备，但是当您访问设备时，系统菜单进入初始化页面，说明您的磁盘未被成功挂载。请依照指引挂载您的硬盘：https://forum.terra-master.com/cn/viewt ... f=79&t=646
