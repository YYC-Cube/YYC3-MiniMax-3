# 卸载了Music/Photo Library Beta后，它们依然在占用资源

**链接**：https://forum.terra-master.com/cn/viewtopic.php?t=3584&sid=b265ad2ea5bccea440907c924ea82b46

---

故障排除

适用型号
所有 TNAS 机型

适用版本
TOS4.2.x的较早版本

故障现象
曾经安装过 Beta 版本应用 Photo Library 或 Music Library，由于相关的进程如tnasdbd, minidlna, music 等占用计算资源较高，出于某种考虑卸载了应用。但卸载后，相关进程依然残留着并继续占用计算资源。

解决方法
1. 请登录SSH:
https://forum.terra-master.com/cn/viewt ... =87&t=1511
输入以下指令以取消部分相关进程的自启动：
代码： 全选rm /etc/init.d/MediaSearch
rm /etc/sc.d/MediaSearch

然后重启即可

2. 如果您发现步骤1依然没能解决问题，或者您想要彻底清理残留文件，您可以选择重新安装TOS：
https://forum.terra-master.com/cn/viewt ... f=85&t=241
