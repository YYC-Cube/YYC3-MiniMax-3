# VirtualBox 虚拟机提示 VT-x 在BIOS 中未启用

**链接**：https://forum.terra-master.com/cn/viewtopic.php?t=351&sid=b265ad2ea5bccea440907c924ea82b46

**关键词**：VM、Windows虚拟机、virtualbox、虚拟化、虚拟机

---

故障排除

适用型号：x.86_64 所有型号

如果您在使用VirtualBox 虚拟机时, 遇到以下提示，说明您的TNAS 的BIOS 未将VT-x 功能启用。
2.jpg

请参照以下指引，在BIOS 中启用VT-x：
1. 找到TNAS 背面的HDMI接口；
2. 使用HDMI 线将您TNAS 连接到显示器；
3. 连接一个USB键盘到您的TNAS；
4. 将您的TNAS开机；
5. 开机后立即连续按键盘的ESC或DEL键，直到进入BIOS模式；
6. 在BIOS 中，前往 Advanced > cpu configuration，将 VT-d 和 Intel Virtualization Technology 项都改为 Enabled；
7. 按F4键保存设置，并重启您的TNAS。
5.jpg
4.jpg
