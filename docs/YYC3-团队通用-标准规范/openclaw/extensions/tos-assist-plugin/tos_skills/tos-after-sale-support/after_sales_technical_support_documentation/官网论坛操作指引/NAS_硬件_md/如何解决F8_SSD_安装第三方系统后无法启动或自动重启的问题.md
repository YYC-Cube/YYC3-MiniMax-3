# 如何解决F8 SSD 安装第三方系统后无法启动或自动重启的问题

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=5051&sid=ff7bc9dc8c8215f8ab568c189aad116e

适用机型：
F8 SSD / F8 SSD Plus

故障现象：
安装第三方操作系统后，出现异常现象，例如：安装Promox后无法正常启动、系统反复自动重启等现象。

故障原因：
F8 SSD / F8 SSD Plus机种与第三方系统存在兼容性问题，需要更新主板bios与PCIe扩展芯片(ASM2806)的固件(FW)来解决此问题点。

解决方法：
一、检查主板当前BIOS版本是否为 MADN0301.V07 或更高版本。若低于此版本，请参考下文 操作步骤 > 升级BIOS步骤 进行更新。

二、检查主板PCIe扩展芯片（ASM2806）的 FW版本 是否为 24082140-0000，检查方法：

1、下载以下文件并上传至NAS 共享文件夹（例如: /Volume1/public/），如下图所示：
https://download2.terra-master.com/240821_40_00_00.bin
https://download2.terra-master.com/218xfwdl

2、参考以下链接方式登录终端：https://forum.terra-master.com/en/viewtopic.php?t=2350，并分别执行以下命令:
代码： 全选cd /Volume1/public/
代码： 全选chmod 755 218xfwdl
代码： 全选./218xfwdl /s

若看到如下图红色框中显示为”24 08 21 40 00 00 ”，则无需升级PCIe扩展芯片(ASM2806)固件，若低于该版本(例如: 17 11 01 40 00 00 )，请参考下文 操作步骤 > 升级PCIe扩展芯片(ASM2806)固件步骤 进行更新。

操作步骤：

一、升级BIOS步骤：

1、关闭 NAS，移除所有 M.2 SSD 及主板上的TOS引导 U 盘。

2、准备一个 FAT32 格式的 U 盘，下载 BIOS 升级包，

F8 SSD 下载路径：https://download2.terra-master.com/F8_S ... 1.V07.zip
F8 SSD Plus 下载路径：https://download2.terra-master.com/F8_S ... 01.V07.zip

并解压压缩包，将所有文件复制到 U 盘根目录，如下图：

3、插入U盘并启动NAS，系统将自动完成BIOS升级并重启（如下图）。

4、再次重新启动NAS，将自动刷写NAS主板的相关信息，直到设备再次自动重启后即表示bios升级完成。

5、Bios升级完成后，请移除U盘。

注意事项：
升级过程中请确保 NAS 所在环境供电稳定，严禁断电。
升级过程中请勿移除 U 盘、按键盘按键或拔插电源。
整个过程系统将自动完成操作，请耐心等待。

二、升级PCIe扩展芯片(ASM2806)固件步骤：
1、下载以下文件并上传至NAS 共享文件夹（例如: /Volume1/public/），如下图所示：
https://download2.terra-master.com/240821_40_00_00.bin
https://download2.terra-master.com/218xfwdl

2、参考以下链接方式登录终端：https://forum.terra-master.com/en/viewtopic.php?t=2350，并分别执行以下命令:
代码： 全选cd /Volume1/public/
代码： 全选chmod 755 218xfwdl
代码： 全选./218xfwdl /u 240821_40_00_00.bin
如图所示：

3、重新启动NAS，登录终端，再次执行
代码： 全选cd /Volume1/public/
代码： 全选./218xfwdl /s

检查PCIe扩展芯片(ASM2806)的固件版本是否已升级为”24 08 21 40 00 00 ”，如下图所示

至此，PCIe扩展芯片(ASM2806)固件版本已成功升级。
