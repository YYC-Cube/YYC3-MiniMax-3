# 如何解决 D5D8 Hybrid 的 M.2 NVMe SSD 序列号重复及掉线问题？

故障现象:
1.例如使用Unraid第三方软件只能识别一个M.2 NVMe，或识别M.2 NVMe序列号重复问题。
2.M.2 NVMe SSD在某些计算机上随机断开连。

前期准备工作：
:准备一台Windows电脑。
:准备1到4个M.2 NVMe SSD升级安装备用。
:准备需要升级的Hybrid设备，将M.2 NVMe SSD安装到Hybrid的M.2槽位中。
:准备USB线，将Hybrid设备与电脑连接并开机，等待下一步操作升级。

升级注意事项:
1.本次升级不会造成数据的丢失或 M.2 NVMe SSD 损坏，但为了安全建议您还是备份数据避免丢失数据的风险。
2.在升级固件时请关闭Windows的某些应用占用M.2 NVMe SSD的资源，避免在升级固件时导致更新失败。
3. 在升级页面UTHSB_MPtool_Lite工具参数请不要修改避免造成升级失败。
4. 拔掉其他USB设备，以免误操作。
5. 升级工具不支持MacOS。

升级教程:
1.下载UTHSB_FW zip文件，https://download2.terra-master.com/UTHSB_FW.zip，
2.将文件放在Windows桌面并将zip文件解压到当前文件夹。
3.打开UTHSB_FW文件夹，找到UTHSB_MPtooI_Lite应用程序并打开。

4.在升级工具页面查看Hybrid设备是否连接成功，在列表中显示Port1. Port2. Port3. Port4.接口能正常显示M.2 NVMe SSD说明连接计算机识别成功。
如果您只有1个M.2 NVMe SSD想需要升级Hybrid的其他M.2槽位，请在升级完成后，然后在安装其它M.2槽位继续点击升级。

5..确认Hybrid设备正常识别，点击【Update Device】升级。

6.完成升级之后查看版本及信息：

Update Progress显示100%
Update Status显示PASS
fwver显示9.34.55
Build Date显示 2025.05.02

7.更新完成后，请将正常关闭DAS，就可正常使用了。若有问题请在线咨询我们团队。感谢支持！
