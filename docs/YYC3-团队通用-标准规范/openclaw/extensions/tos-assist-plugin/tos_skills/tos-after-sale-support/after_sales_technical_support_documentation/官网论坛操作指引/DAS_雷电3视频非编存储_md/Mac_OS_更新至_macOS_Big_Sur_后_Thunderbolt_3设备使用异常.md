# Mac OS 更新至 macOS Big Sur 后 Thunderbolt 3设备使用异常

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=748

适用型号
D4 Thunderbolt3、D5 Thunderbolt3、D8 Thunderbolt3、D16 Thunderbolt3

故障现象
由于 Mac OS 更新至 macOS Big Sur 后导致很多数商家设备无法正常使用，之前一直使用正常的 D4 Thunderbolt3、D5 Thunderbolt3、D8 Thunderbolt3 产品会出现蜂鸣器报警、拷贝掉线、阵列硬盘缺失等故障。

解决对策

第一步：检查 Mac 电脑是否具有 Apple T2 安全芯片
Mac OS 系统控制器分为有/无 Apple T2 安全芯片，如果系统具有 Apple T2 安全芯片，需逐步按照以下步骤操作；若无T2安全芯片，则可以跳过第二步。
您可以登录 Mac OS，前往 System Information > Controller 查看是否具有 T2 Security Chip。如果 Controller Information 显示 Apple T2 chip，则您的 Mac 具有 T2 Security Chip。

第二步：禁用 Apple T2 安全芯片
2.1. 重启 Mac OS 系统时，持续同时按住 Command + R 按键，直到进入 Mac OS Recovery 页面。
2.2. 点击 Utilities→ Startup Security Utility ，将出现一个对话框，提示您需要以管理员身份进行设置，单击 Enter Mac OS Password…按钮，输入 Mac OS 密码。

2.3. 进入 Startup Security Utility 页面，请勾选 No Security 和 Allow booting from exernal or removable media。

2.4. 完成操作后，从 Apple 菜单中选择“Restart”重启。

第三步：卸载驱动程序
3.1. 卸载 HighPointRR 驱动程序，请以系统管理员身份登录并前往实用工具，打开 Terminal 窗口，并输入以下命令，再按回车键
sudo rm –rf /Library/Extensions/HighPointRR.kext

3.2. 完成后在 Password:输入 Mac OS密码，按回车键（注意：输入密码不会显示）。
3.3. 继续输入以下命令，按回车键。
sudo kextcache -i /

第四步：安装驱动程序
4.1. 下载驱动程序：https://download2.terra-master.com/T327 ... %20Mac.zip
4.2. 找到下载驱动文件，然后双击该软件包以启动安装程序，单击 Continue 按钮。

4.3.	Mac OS 将提示您安装驱动程序，单击 Install 按钮：

4.4.	系统将提示您安装程序正在尝试安装新软件，请输入管理员用户名和密码，然后单击 Install Software：

4.5.	如果没有弹出窗口，请继续进行下一步安装，单击 Restart 重启系统：

4.6.	如果弹出一个窗口提示您许可此程序安装，请单击 Open Security Preferences：

4.7.	确保已选中‘App Store and identified developers’，然后单击 Allow：

4.8.	您将收到一个弹出窗口，提示您重新启动，单击 Not Now：

4.9.	返回驱动程序安装窗口，单击 Restart 以重新启动系统：

第五步：查看驱动是否安装成功
5.1. 请以系统管理员身份登录前往实用工具，打开 Terminal 窗口。
5.2. 输入以下命令后按回车：sudo su
5.3. 完成后在 Password: 输入 Mac OS 密码，然后回车（注意输入密码不会显示）。
5.4. 输入以下命令后按回车：kextstat | grep high*
5.5. 请确认版本为4.13.2。
5.6. 恭喜您驱动安装成功，请连接 Thunderbolt3 设备正常使用。
