# 如何收集NAS的日志

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=4329&sid=91960374e52a8fba318a0aab4711ff91

适用版本:
适用于TOS 5.0.xxx、TOS5.1.xxx、TOS6。

适用机型：
TNAS型号（除F2-210、F4-210）

故障现象：
当TNAS宕机导致网页不可访问且PC无法搜索到该设备时，重启后TOS网页的系统报告缺失相关日志，不利于异常原因的分析。

故障原因：
当TNAS设备出现宕机重启TNAS后，系统相关部份日志会被清空。针对这种现象，需采用其他日志收集法分析异常。

TOS 5 操作步骤：
步骤一：使用Putty等工具登录NAS命令行终端。
viewtopic.php?f=87&t=1511

步骤二：修改日志存储的位置
2.1.执行以下命令：代码： 全选vi /etc/syslog.conf进入编辑配置文件界面

2.2.按 i 键进入编辑模式，使用键盘的方向键移动光标到/var/log/messages 处并删除/var/log，如下图：

2.3.按 ESC 键退出编辑模式，然后同时按下“Shift”+“:” 键，出现冒号“：”后输入“wq”，再按 Enter 键保存配置并退出。

2.4.执行以下命令代码： 全选vi /etc/init.d/S01logging进入编辑配置文件界面

2.5.按 i 键进入编辑模式，使用键盘的方向键移动光标到printf "Starting logging: " 处

2.6.按“Enter”当光标跳到下一行后 按“Tap”使光标输入内容与当前位置一致，然后输入
代码： 全选mv /messages /messages_$(date +"%Y_%m_$d_%H_%M_%s")
如下图

2.7.按 ESC 键退出编辑模式，然后同时按下“Shift”+“:” 键，出现冒号“：”后输入“wq”按 Enter 键保存配置并退出。

步骤三：查看日志配置是否成功

3.1.配置成功后，重启NAS，登录ssh，输入cd /  后再输入ls

3.2. 若显示有messages字样，表示配置已成功完成。

步骤四：日志输出与发送

4.1.若系统出现故障，重启TNAS设备并使用SSH登录到NAS设备后台，执行命令
代码： 全选mv /messages* /Volume1/public

4.2.通过SMB或网页登录TNAS, 将public目录下所有messages日志复制至电脑。

4.3.将日志以邮件的形式发送至support (at)terra-master.com

4.4.我们收到日志信息后，会第一时间分析原因并回复您。

TOS 6 操作步骤

1、登录 TOS 页面，在顶部导航栏中选择 “技术与帮助 > Debug 模式”，勾选 "启用系统 Debug 模式"。

2、当系统出现故障时，重启 TNAS 设备，再次进入 “技术与帮助 > Debug 模式”，点击下载日志文件。

3、将日志文件通过邮件发送至 support(at)terra-master.com，我们将在收到日志后第一时间分析问题并回复您。
