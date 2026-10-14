# 如何修复 TNAS 的 U盘初始化引导系统 (x.86 UEFI，较新型号)

引导系统是TOS 启动前用于配置基础硬件的一些程序，这些程序被储存在一个U盘里。意外停电、非正常关机、硬件故障均有可能导致引导系统出现故障。如果您的 x.86 TNAS 无法正常启动，而且在无硬盘空机开机时也无法搜索到设备时，极可能是 USB 引导系统出现故障。

请参见以下指引重新烧录一个新的USB 引导系统。

适用机型
F2-223、F2-423、F4-223、F4-423
T6-423、T9-423、T12-423
U4-423、U8-423、U12-423

适用版本：
TOS 5

制作启动系统条件：
1、Ubuntu 18.04或以上版本，centos 6或以上版本。

可参考如下操作步骤（以 Ubuntu 为例）：

1、准备一个空的 USB 盘；

2、使用 Windows/Mac 电脑安装 VMware Workstation Pro。

3、在 VMware Workstation Pro 中安装 Ubuntu 系统。

4、打开安装的 Ubuntu 系统。

5、插入 USB 至 Windows 电脑，选择连接到虚拟机。

6、打开 Ubuntu 的终端 Terminal。

7、直接输入“sudo -i”并按回车键，再输入当前用户的密码切换用户至 root。（输入密码时密码不会显示）

8、输入“cd /mnt/”并按回车进入 mnt 目录，输入“wget https://download2.terra-master.com/bzImage_uefi.zip” 并按回车键下载文件。下载完成后可输入“ls”并按回车查看是否已成功下载压缩包。

9、输入“unzip bzImage_uefi.zip”并按回车键解压压缩包。解压后可输入“ls”并按回车键查看解压的文件。

10、输入“chmod +x make_uefi grub.cfg  x86_64-efi.cfg”并按回车。

11、输入./make_uefi bzImage 按回车键来将文件写入 USB。
当您看到以下信息,说明已经完成了制作.
可能提示"uid1000"和"guid1000"权限问题,请忽略.

12.取出 U 盘接回TNAS。

备注
如果您对配置系统或者自行制作引导系统感觉到困难，您也可以选择向铁威马客服咨询寄送一个新的 U 盘引导系统。
