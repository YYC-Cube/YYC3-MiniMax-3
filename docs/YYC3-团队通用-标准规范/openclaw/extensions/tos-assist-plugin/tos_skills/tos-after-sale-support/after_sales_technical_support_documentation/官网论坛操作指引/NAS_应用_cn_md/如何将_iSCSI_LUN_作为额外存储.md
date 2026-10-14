# 如何将 iSCSI LUN 作为额外存储

**链接**：https://forum.terra-master.com/cn/viewtopic.php?t=4733&sid=b265ad2ea5bccea440907c924ea82b46

**关键词**：LUN、iSCSI、iscsi、块存储、存储、网络存储

---

什么是 iSCSI ？

iSCSI —— 是一种以网络协议为架构的存储空间网络化标准规格，适合用来链接许多数据存储设备。iSCSI 会在 IP 网络上运行 SCSI 命令，供数据在局域网 (LAN)、广域网 (WAN) 上进行传输。通过 iSCSI，客户端计算机的操作系统会将存储服务器上的空间视为本机硬盘。事实上，传输到该硬盘的数据会通过网络传输到存储服务器上。


本文含以下内容：

一. iSCSI Manager 使用教程
二. 如何在 Windows 中连接使用 iSCSI LUN ？（以Win11为例）
三. 如何在 TNAS 中连接使用 iSCSI LUN ？


一. iSCSI Manager 使用教程

1. 在TOS应用中心下载安装并启用。



2. 打开 iSCSI Manager ，在右侧导航栏中选择 iSCSI Target。点击创建，完成 iSCSI Target 的相关配置。

注意：在创建时勾选 多重连接，能够实现多个客户端连接使用。（不推荐，可能会出现性能、数据一致性、存储冲突等问题。）



3. 在右侧导航栏中选择 iSCSI LUN。点击创建，完成 iSCSI LUN 的相关配置。

① “位置” 选择将会决定该 LUN 所使用的是哪个卷的空间。
② “容量” 默认为 1 GB，且容量设置只能增加，不能减少。
③ “空间分配” 模式有：Thin Provisioning（支持快照技术、按需空间分配）、Thick Provisioning （不支持快照技术、预分配空间）。
④ “映射到iSCSI目标” 选择刚刚创建的 iSCSI Target。



4. 检查 iSCSI Target、iSCSI LUN 配置完毕。

在右侧导航栏中选择 iSCSI Target，能够看见该 Target 的IQN与映射的LUN。




二. 如何在 Windows 中连接使用 iSCSI LUN ？（以Win11为例）

1. 按下 Windows 键 + S键，输入 iSCSI 发起程序。
点击 发现-发现门户-添加 IP 地址，它将出现在目标门户中。



2. 点击 目标-刷新，在已发现的目标 中选择在iSCSI Manager中配置的 target 并点击连接。



3. 如果您为 target 配置了高级设置（例如 CRC 校验或 CHAP），请点击高级以完成相应设置。如果没有，请点击确定完成。

4. 按下 Windows 键 + S键，输入计算机管理。从左侧面板中选择磁盘管理。



5. 右键点击与您的 LUN 大小匹配的磁盘并选择联机-初始化磁盘。



6. 此时您的 LUN 已联机并初始化完毕，右键点击磁盘并选择新建简单卷。按照向导完成操作。



7. 配置完毕。您的 Windows 现在有一个额外的驱动器，分配的驱动器号作为额外存储。





三. 如何在 TNAS 中连接使用 iSCSI LUN ？

1. 点击 控制面板-虚拟磁盘-挂载-添加 IP 地址-获取iSCSI LUN。
如果您为 target 配置了高级设置（例如 CRC 校验或 CHAP），请完成相应设置。如果没有，请点击下一步确定完成。



2.挂载成功后，您现在有一个额外的存储空间，可以通过文件管理查看。
