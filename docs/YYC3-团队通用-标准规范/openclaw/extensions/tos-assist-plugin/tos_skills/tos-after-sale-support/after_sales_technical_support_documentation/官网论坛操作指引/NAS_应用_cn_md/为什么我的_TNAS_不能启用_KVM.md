# 为什么我的 TNAS 不能启用 KVM

**链接**：https://forum.terra-master.com/cn/viewtopic.php?t=4196&sid=b265ad2ea5bccea440907c924ea82b46

**关键词**：KVM、kvm、虚拟化、虚拟机管理

---

适用版本
TOS 5.0.xxx至TOS 5.1.123（含）的所有版本。

适用机型
X86 TNAS 型号

故障原因
TOS系统未编译 kvm.ko 文件，导致无法成功启用虚拟化（kvm）

操作步骤

一、文件下载
1、打开您的浏览器，并依次访问以下链接下载所需文件
https://tos-downloads.oss-cn-hongkong.a ... qbypass.ko
https://tos-downloads.oss-cn-hongkong.a ... m-intel.ko
https://tos-downloads.oss-cn-hongkong.a ... nel/kvm.ko
2、下载完成后，确保这些文件保存在您的电脑桌面上。

二、文件传输至NAS

Windows 平台
1、使用快捷键 Windows 键+R打开“运行”对话框。
2、输入\\后接 NAS 的 IP 地址，例如\\192.168.1.123，并点击“确定”。
3、输入 NAS 的用户名和密码进行登录。
4、在文件资源管理器中，找到桌面上的三个文件（irqbypass.ko, kvm-intel.ko, kvm.ko），将它们复制到 NAS 的“public”共享目录中。

Mac 平台
打开 Finder，选择“前往” -> “连接到服务器”。
在弹出的窗口中，输入smb://后接 NAS 的 IP 地址，如smb://192.168.1.123。
登录NAS，并将桌面上的三个文件（irqbypass.ko, kvm-intel.ko, kvm.ko）复制到 NAS 的“public”	 共享目录中

三、NAS命令行操作
参考此链接的说明，登录到 NAS 的命令行终端。
viewtopic.php?f=87&t=1511
使用 mv 命令将共享目录中的文件移动相应目录
mv /Volume1/public/irqbypass.ko  /lib/modules/5.15.59/extra
mv /Volume1/public/kvm.ko  /lib/modules/5.15.59/extra
mv /Volume1/public/kvm-intel.ko  /lib/modules/5.15.59/extra
执行下列命令载入内核模块
insmod /lib/modules/5.15.59/extra/irqbypass.ko  
insmod /lib/modules/5.15.59/extra/kvm.ko  
insmod /lib/modules/5.15.59/extra/kvm-intel.ko
执行depmod -a命令更新模块依赖。

四、检查 kvm 模块是否插入成功
在命令行终端中输入：lsmod | grep kvm

出现下面输出表示模块插入成功：

    
检查”/lib/modules/5.15.59/modules.dep”文件
在命令行终端中输入：
cat /lib/modules/5.15.59/modules.dep | grep irq
出现下面输出表示开机会自动插入 kvm 模块到内核中：
