# 如何解决TOS系统无法识别UPS？

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=4798&sid=91960374e52a8fba318a0aab4711ff91

适用版本：
所有版本

适用机型：
所有机型

故障现象：
部分型号的UPS（例如CyberPower 1500 CP1500PFCLCD）与TOS系统建立连接时，可能出现TOS系统无法识别UPS，或者连接后UPS与TOS失去连接的问题。

故障原因：
不同品牌和型号的UPS硬件存在差异，导致轮询间隔时间不一致，从而影响TOS系统对UPS的识别和连接稳定性。

解决方案：
为解决此问题，您可以使用以下任意一种方法。
方法1
1、登录TNAS终端：
对于TOS 5.1及之前版本的系统，请参考以下链接获取登录方法：
viewtopic.php?t=1511；
对于TOS 6.0及以上版本，可通过“所有应用”中的“终端”功能直接登录。

2、编辑ups.conf文件：
（1）在终端中执行以下命令以打开配置文件：
代码： 全选vim /etc/ups.conf

（2）输入i进入编辑模式。
（3）在文件中添加一条配置，配置内容：
代码： 全选pollinterval = 15

3、保存并退出编辑；
（1）按 ESC 键退出编辑模式。
（2）同时按下“Shift”+“:” 键，输入wq后按Enter键，以保存配置并退出vim编辑器。

4、重新连接UPS：
完成上述配置后，请重新尝试连接UPS设备，检查连接是否恢复正常。

方法2
1、下载UPS配置文件，下载地址：
https://download3.terra-master.com/Util ... S/ups.conf
2、在 TOS 文件管理中将该文件上传至public文件夹中；
3、打开TOS 桌面的所有应用中的终端，然后执行以下命令将文件复制到/etc/目录中；
代码： 全选cp -rf /Volume1/public/ups.conf  /etc/
如果public是在卷2则使用以下命令
代码： 全选cp -rf /Volume2/public/ups.conf  /etc/
4、执行以下命令赋予ups.conf文件权限；
chmod 644 /etc/ups.conf
5、完成上述配置后，请重新尝试连接UPS设备，检查连接是否恢复正常；
