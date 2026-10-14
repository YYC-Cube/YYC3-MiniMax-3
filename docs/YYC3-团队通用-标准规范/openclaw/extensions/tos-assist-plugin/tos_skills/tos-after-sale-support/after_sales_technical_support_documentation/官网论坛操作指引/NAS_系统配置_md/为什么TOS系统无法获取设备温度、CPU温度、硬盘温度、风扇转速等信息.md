# 为什么TOS系统无法获取设备温度、CPU温度、硬盘温度、风扇转速等信息

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=4265&sid=91960374e52a8fba318a0aab4711ff91

适用版本:
 TOS5

适用机型：
所有 TNAS 型号

故障现象：
TOS系统无法获取设备温度、CPU温度、硬盘温度、风扇转速等信息，如图所示：

故障原因：
由于TOS系统中某项服务停止运行，导致无法系统获取到TNAS 相关硬件资源信息。

解决办法：
1、建议尝试清除浏览器缓存并重新启动TNAS设备。
2、建议尝试使用其他浏览器登录TOS，可能是因为浏览器兼容性问题导致的。
3、如果上述方法均未能解决问题，您可以尝试通过 SSH 登录到 TNAS 设备，参考链接如下viewtopic.php?f=79&t=1511
4、成功登录 SSH 后，请在SSH命令窗口内输入并执行以下命令重启服务即可。
代码： 全选/etc/init.d/ResourceCollection start
