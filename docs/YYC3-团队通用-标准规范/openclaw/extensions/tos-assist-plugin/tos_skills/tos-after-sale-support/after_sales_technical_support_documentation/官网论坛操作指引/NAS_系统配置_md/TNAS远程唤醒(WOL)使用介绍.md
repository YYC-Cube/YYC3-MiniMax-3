# TNAS远程唤醒(WOL)使用介绍

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=587&sid=91960374e52a8fba318a0aab4711ff91

适用机型
F2-221、F2-421、
F4-221、F4-421、
F5-221、F5-225、F5-421、F5-422、
F8-421、F8-422
(ARM 机型和未列出的 X86机型已默认开启了 WOL 功能，无需设置)

适用 TOS 版本
TOS4.2.04及以上版本

一.开启Bios中WOL功能
1.使用 HDMI 线将 TNAS 的 HDMI 接口与显示器连接；
2.在 TNAS 的 USB 接口位置连接一个 USB 键盘；
3.将 TNAS 开机，并不断地敲击键盘的 ESC 或 DEL 键，直到进入 BIOS 模式；
4.选择 Advanced>Power Mangaement Features>Wake On Lan,将 Wake On Lan 的状态由 Disable 改为 Enable 并保存。

二.开启 TOS 系统的“网络唤醒”
登录 TOS，进入控制面板>硬件与电源>电源>网络唤醒 ，勾选并应用启用网络唤醒功能。

三.下载与使用 Wake Me OnLan软件
Windows 系统
1.下载第三方软件 WakeMeOnLan，下载链接:
https://www.nirsoft.net/utils/wake_on_l ... nloadLinks
2.局域网中选择搜索到的产品IP地址，点击 File>Wake Up Selected Computers 进行唤醒。
3.Internet环境或局域网无法搜索到设备的情况下，点击 File>Add New Computer,输入 IP Address（或DDNS主机名）、MAC 地址，然后选择 File>Wake Up Selected Computers 进行唤醒。

Linux 系统
使用wol命令输入TerraMaster nas 对应的IP地址（或DDNS主机名）、MAC 地址进行唤醒，示例如下：
wol -i 10.18.8.154 6C:BF:B5:01:11:99

Mac 系统
类似 Linux 系统方法，打开 Finder>应用程序>实用工具>Terminal,示例如下：
wol -i 10.18.8.154 6C:BF:B5:01:11:99

注意事项：
1.仅 LAN1网络接口支持网络唤醒功能。
2.只有在 TerraMaster NAS 正常关机后（按电源按钮或单击 TOS 界面上的关机），网络唤醒功能才会生效。
3.目前仅支持在路由器开启了DMZ的情况下使用外网远程唤醒。
