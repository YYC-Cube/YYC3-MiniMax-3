# VirtulBox 如何挂载 USB 设备

**链接**：https://forum.terra-master.com/cn/viewtopic.php?t=4863&sid=b265ad2ea5bccea440907c924ea82b46

**关键词**：VM、Windows虚拟机、virtualbox、虚拟化、虚拟机

---

适用机型
X86 机型

适用版本
TOS 6 

故障现象 
VirtualBox 无法识别插在 TNAS 上的 USB 设备。

挂载方法
1、打开虚拟机管理页面，在虚拟机未启动的情况下，点击虚拟机的“设置”选项。
2、在虚拟机设置中找到 “USB” ，启用USB控制器。
3、根据主机硬件和虚拟机软件的兼容性，选择合适的USB控制器版本（如USB 2.0或USB 3.0）。
4、点击右侧第二个创建按钮，添加一个虚拟存储设备（如“Generic Mass Storage [0100]”）。
5、启动虚拟机后插入 USB 设备，虚拟机将会自动识别并挂载USB设备，然后你可以在虚拟机的磁盘管理中看到该设备。
