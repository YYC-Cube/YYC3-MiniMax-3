# 如何修复TNAS 的 U盘初始化引导系统 (x.86 Legacy，较旧型号)

适用机型
F2-220、F2-221、F2-420、F2-421、
F4-220、F4-221、F4-420、F4-421、
F5-220、F5-221、F5-225、F5-420、F5-421、F5-422、
F8-421、F8-422

适用 TOS版本：不限

引导系统是TOS 启动前用于配置基础硬件的一些程序，这些程序被储存在一个U盘里。意外停电、非正常关机、硬件故障均有可能导致引导系统出现故障。如果您的 x.86 TNAS 无法正常启动，而且在无硬盘空机开机时也无法搜索到设备时，极可能是 U盘引导系统出现故障。

以下是当引导系统出现故障后的 3 种修复方法：

方法 1
如果您还有一个备用的硬盘，里面含有 TOS 系统并且能够正常启动：
1. 把硬盘插入您的TNAS后开机；
2. 使用终端通过 SSH 登录系统后台；登录方法
3. 获取 root权限并执行以下命令（默认密码同 admin 密码）：
代码： 全选[root@TNAS-??????~]# /etc/init.d/mountusb start
mount usb storage...
[root@TNAS-??????~]# ter_wget http://download2.terra-master.com/bzImage
--2021-08-30 16:23:53--  http://download2.terra-master.com/bzImage
Resolving download2.terra-master.com... 47.102.71.249
Connecting to download2.terra-master.com|47.102.71.249|:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 37896576 (36M) [application/octet-stream]
Saving to: 'bzImage'

bzImage             100%[===================>]  36.14M  24.1MB/s    in 1.5s

2021-08-30 16:23:55 (24.1 MB/s) - 'bzImage' saved [37896576/37896576]
[root@TNAS-??????~]# cp ~/bzImage /mnt/bootdev/boot/

方法 2
如果您已经无法再访问 TOS，您需要重新制作一个新的引导系统替换故障的系统。
以下文章是引导系统的制作说明。
点击下载

方法 3
如果您对配置系统或者自行制作引导系统感觉到困难，您也可以选择向铁威马客服咨询购买一个新的U盘引导系统。
