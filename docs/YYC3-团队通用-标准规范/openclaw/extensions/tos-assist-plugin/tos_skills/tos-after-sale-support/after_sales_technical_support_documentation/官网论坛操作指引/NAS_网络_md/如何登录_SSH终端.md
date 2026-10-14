# 如何登录 SSH终端？

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=1511&sid=51493c53a160f99b97633ae2f702b6b5

操作指引

适用型号：
所有TNAS 型号

如您有特殊操作需要通过 SSH 终端登录 TNAS，请参照以下指引：
(注意: 关于以下操作步骤中的"cd /"的指令,其作用是使当前 SSH/Telnet 连接的位置切换到根目录,以免造成对卷的占用.请不要遗漏它.)

Windows 电脑
1. 请下载 ssh终端工具：https://www.chiark.greenend.org.uk/~sgt ... atest.html

2. 打开 putty，输入 TNAS的 IP地址和 ssh的端口，端口默认为9222。

3A. 若您的系统为 TOS 4.2.12及以上版本，使用初始化时创建的第一个用户进行登录，再以相同的密码切换至 root 最高权限：
代码： 全选login as: admin
Keyboard-interactive authentication prompts from server:
| Password:
End of keyboard-interactive prompts from server
Welcome to Tnas!
[admin@TNAS-???? ~]$ cd /
[admin@TNAS-???? /]$ sudo -i
Password:
[root@TNAS-???? ~]
3B: 若您的系统为 TOS 4.2.12以下的版本，使用 root登录,密码为 admin的密码：
代码： 全选login as: root
Keyboard-interactive authentication prompts from server:
| Password:
End of keyboard-interactive prompts from server
Welcome to Tnas!
[root@TNAS-???? ~]

Mac电脑
1.请打开“Finder-应用程序-实用工具”或“Launchpad”，找到“Terminal”并启动。

2A. 若您的系统为 TOS 4.2.12及以上版本，请使用TOS初始化时创建的第一个用户进行登录，再以相同的密码切换至 root 最高权限：
代码： 全选Last login: Mon Sep 13 09:55:15 on console
adminTWMtekiiMac:~ admintwm$ ssh -p 9222 admin@10.18.15.123
The authenticity of host '[10.18.15.123]:9222 ([10.18.15.123]:9222)' can't be established.
RSA key fingerprint is d4:29:f3:57:ef:ab:89:2a:fa:21:62:87:86:9e:0d:ae.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '[10.18.15.123]:9222' (RSA) to the list of known hosts.
admin@10.18.15.123's password:
Welcome to TNAS
-bash: ulimit: open files: cannot modify limit: Operation not permitted
admin@TNAS-????:~$ cd /
admin@TNAS-????:/$ sudo -i
Password:
Welcome to TNAS
root@TNAS-????:~#
2B: 若您的系统为 TOS 4.2.12以下的版本，使用 root登录,密码为 admin的密码：
代码： 全选Last login: Mon Sep 13 09:55:15 on console
adminTWMtekiiMac:~ admintwm$ ssh -p 9222 root@10.18.15.123
The authenticity of host '[10.18.15.123]:9222 ([10.18.15.123]:9222)' can't be established.
RSA key fingerprint is d4:29:f3:57:ef:ab:89:2a:fa:21:62:87:86:9e:0d:ae.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '[10.18.15.123]:9222' (RSA) to the list of known hosts.
root@10.18.15.123's password:
Welcome to TNAS
-bash: ulimit: open files: cannot modify limit: Operation not permitted
root@TNAS-????:~$ cd /

通过 SSH 连接 USB 引导系统
若你在没有硬盘时启动 TNAS 并连接 SSH, 将启动 USB 引导系统.
USB 引导系统的默认用户名为root,默认密码为Admin123,默认端口为9222.
(210系列默认端口为22,默认密码为admin)
