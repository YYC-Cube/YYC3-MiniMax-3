# 如何修改TOS系统与Windows中SMB服务的端口

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=4432&sid=048e1debfe835733a17dfc037a28fa77

适用机型：
所有 TNAS型号

适用版本：
TOS 4/5/6

故障现象：
使用SMB服务时，无法在Windows或Mac上通过SMB正常连接NAS。

故障原因：
为了降低安全风险，部份公司或网络运营商可能会封禁存在安全隐患的端口，例如SMB协议的默认端口445，从而保护用户免受恶意软件的侵害。

操作步骤：
一、修改TOS系统中SMB服务端口：

1. SSH登录TNAS设备
访问以下链接，按照指引通过SSH登录TNAS设备。
viewtopic.php?f=79&t=1511

2、编辑SMB配置文件
(1)、在SSH会话中，输入命令 代码： 全选vi /etc/samba/smb-extend.conf 并按回车键打开SMB配置文件。
(2)、按 i 键进入编辑模式。
(3)、使用键盘的方向键将光标移动到文件的末尾，并添加一行，输入 代码： 全选smb ports = 端口号
（将“端口号”替换为您想要设置的SMB端口）。如下图：

(4)、按 ESC 键退出编辑模式，然后同时按下“Shift”+“:” 。出现冒号“:”后，输入“wq”，再按 Enter 键保存配置并退出。

3、重启SMB服务
对于TOS 4/5，输入命令 代码： 全选/etc/init.d/samba restart
对于TOS 6，输入命令 代码： 全选systemctl restart samba.service

二、修改Windows系统中SMB服务端口：

1、以管理员权限运行PowerShell
按下Win + R键，输入powershell。然后按 Ctrl + Shift + Enter，以管理员权限运行 PowerShell。

2、设置端口转发
在PowerShell窗口中，输入以下命令(根据实际情况替换端口号和IP地址)：
代码： 全选netsh interface portproxy add v4tov4 listenport=445 listenaddress=127.0.0.1 connectport=5656  connectaddress=10.18.8.88 并按下回车键。
其中”connectport=5656 ” 填入需要修改的SMB端口号。“connectaddress=10.18.8.88”填入需要修改的NAS的IP地址)。

3、验证修改设置
输入命令代码： 全选netsh interface portproxy show all查询是否修改成功，如下图：

注意：
1.填入的SMB端口须与第一步中修改的TOS系统中SMB端口一致。
2.若需删除Windows转发端口，请使用命令：
代码： 全选netsh interface portproxy delete v4tov4 listenport=445 listenaddress=127.0.0.1

4、重启电脑
完成所有配置步骤后，为了确保设置生效，请重启电脑。待电脑重新启动完毕后，您可以按照以下第三步的提示方法开始访问您的NAS设备。

三、通过SMB访问NAS
按下Win + R键，打开命令提示符（CMD）输入 \\127.0.0.1 访问NAS。如下图：
