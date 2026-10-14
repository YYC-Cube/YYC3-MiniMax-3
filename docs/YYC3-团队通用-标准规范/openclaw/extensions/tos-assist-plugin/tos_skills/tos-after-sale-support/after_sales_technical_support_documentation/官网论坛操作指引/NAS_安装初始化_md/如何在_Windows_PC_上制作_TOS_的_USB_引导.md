# 如何在 Windows PC 上制作 TOS 的 USB 引导？

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=4399&sid=df318c2657b676e1a07d8bad1baa14ba

如何在 Windows PC 上制作 TOS 的 USB 引导？

问题现象：
USB Initboot（引导系统）是 TOS 启动前用于配置基础硬件的一些程序，这些程序被储存在一个 U 盘里。意外停电、非正常关机、硬件故障均有可能导致引导系统出现故障。如果您的 x.86 TNAS 无法正常启动，而且在无硬盘空机开机时也无法搜索到设备时，极可能是 USB Initboot 出现故障。

解决方法：
旧方法较为繁琐且有几率失败，我们已应诸位的建议更换成简单的方法。

步骤1. 在你的电脑安装刻录工具
balenaEtcher：https://etcher.balena.io/
更多其他的：https://alternativeto.net/software/rufus/

步骤2. 取下 TNAS 内部的 USB initboot 盘，或准备一个没有数据的 U 盘。将 U 盘接入电脑，并拔掉电脑上的其他U盘。右键点击“开始”，打开“磁盘管理”确认U盘的容量。

步骤3. 根据 TNAS 机型和需要安装的 TOS 版本下载对应的镜像文件。

USB Initboot Image(TOS 5 Legacy 120MB)
USB Initboot Image(TOS 5 Legacy 60MB)
适用机型：F2-220、F2-221、F2-420、F2-421、F4-220、F4-221、F4-420、F4-421、F5-220、F5-221、F5-225、F5-420、F5-421、F5-422、F8-421、F8-422
注意：如果您的 USB 容量没有达到120 MB，请选择60MB 版本的镜像文件。

USB Initboot Image(TOS 5 UEFI 120MB)
适用机型：F2-223、F2-423、F2-424、F4-223、F4-423、F4-424、F4-424 Pro、T6-423、T9-423、T12-423、U4-423、U8-423、U12-423

USB Initboot Image(TOS 6 Legacy 126MB)
适用机型：F2-221、F2-421、F4-221、F5-221、F5-421、F2-422、F4-422、F5-422
(此 8 个机种的 BIOS 版本必须为 MAPL0304V16 至 MAPL0304V22，或 MAPL0303V16 至 MAPL0303V22，可前往 TOS控面板》通用设置》系统》更新》BIOS/InitBoot位置查看BIOS版本。）

USB Initboot Image(TOS 6 UEFI 120MB)
适用机型：F2-223、F2-423、F2-424、F4-223、F4-423、F4-424、F4-424 Pro、T6-423、T9-423、T12-423、U4-423、U8-423、U12-423
F4-424 Max、F6-424、F6-424 Pro、F6-424 Max、F8 SSD、F8 SSD Plus、U8-500 Plus、T9-500 Pro、T12-500 Pro、U12-500 Plus

步骤4. 执行刻录工具，选择目标镜像和目标U盘开始制作。

步骤5. 将U盘接回 TNAS 上，并确保这是唯一接在 TNAS 上的U盘。然后在不安装任何HDD/sataSSD/m.2SSD的情况下启动 TNAS，观察引导系统是否成功启动。

步骤6. 如果刚制作完成的 USB Initboot 在 TNAS 上没有起作用。请尝试用硬盘工具擦除 U 盘重试一次，或更换其他 U 盘重试一次。
