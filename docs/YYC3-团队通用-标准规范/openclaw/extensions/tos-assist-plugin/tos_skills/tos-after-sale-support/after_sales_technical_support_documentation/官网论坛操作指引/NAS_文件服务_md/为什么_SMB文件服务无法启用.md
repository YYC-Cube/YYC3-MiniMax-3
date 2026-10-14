# 为什么 SMB文件服务无法启用

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=4433&sid=048e1debfe835733a17dfc037a28fa77

适用机型：
所有 TNAS型号

适用版本：
TOS 4/5/6

故障现象：
SMB 文件服务无法正常使用，且在TOS控制面板中即使勾选了”启用SMB文件服务”选项，也无法点击“应用”按钮保存设置。

故障原因：
通常是由于TOS系统中的SMB配置文件（smb-extend.conf）出现异常状态，导致SMB程序无法正常运行。

操作步骤：
一、SSH登录TNAS设备
1. 访问以下链接，按照指引通过SSH登录TNAS设备。
viewtopic.php?f=79&t=1511
二、编辑SMB配置文件
1、在SSH会话中，输入以下命令重置SMB配置。
代码： 全选cp /etc.default/samba/smb-extend.conf /etc/samba/smb-extend.conf
2、由于TOS系统版本不同，需使用不同的命令重启SMB服务，使新配置生效:
TOS 4/5系统重启命令：代码： 全选/etc/init.d/samba restart
TOS 6系统重启命令：代码： 全选systemctl restart samba.service
完成上述操作步骤后，如果问题仍未解决，请访问官网(https://www.terra-master.com)与在线客服预约工程师进行远程检查。
