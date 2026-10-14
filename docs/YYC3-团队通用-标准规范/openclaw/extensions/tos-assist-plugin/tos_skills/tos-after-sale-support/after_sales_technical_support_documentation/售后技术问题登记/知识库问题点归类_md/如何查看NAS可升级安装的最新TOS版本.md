# 如何查看 NAS 可升级/安装的最新 TOS 版本?

### **210：**
最新的TOS 4版本是4.2.44.
升级方法:直接在控制面板-系统进行在线更新或下载.bz2包手动上传更新。

### **220/420：**
220/420机型是 TOS 4时期的产品, 可以使用TOS4和TOS5.
TOS 5及未来的TOS版本使用的是不同于的TOS4的分区结构. 如果变更分区结构, 会丢失数据。
最新的TOS 4版本是4.2.44.

a. 如果保持TOS4 旧分区结构, 可以保留数据,并使用TOS 5.0.176这个能兼容旧分区结构的版本. 升级方法请参考:
* **[EN]** https://forum.terra-master.com/en/viewtopic.php?f=28&t=3358
* **[CN]** https://forum.terra-master.com/cn/viewtopic.php?t=1662
不建议继续更新更高的TOS5版本.

b. 如果能变更分区, 最高可以使用TOS 5.1.145，请执行以下步骤：
1. 备份数据到其他设备.
2. 将所有盘接入PC，通过磁盘工具删除所有盘上的旧分区表（一般每个盘有4个分区）.
3. 将内部USB启动盘取出，制作成 TOS 5专用的版本并接回NAS.（TOS 5 Legacy），具体步骤请参考：
   * **[EN]** https://forum.terra-master.com/en/viewtopic.php?t=6433 
   * **[CN]** https://forum.terra-master.com/cn/viewtopic.php?t=4399 
4. 重新初始化在线安装 TOS 5.1.145。

### **221/421/422：**
请先根据SN码和Bios版本判断您的221/421/422机型是旧批次还是新批次。
* **看SN码**：2020年6月及之前的批次不兼容；2020年7月及之后的批次兼容。（例：A2Y201200148：表示2020年12月批号00148）
* **看BIOS版本**：版本号为5.12和MAPL****V15及之前的版本不兼容；版本号为MAPL****V16及以后的版本兼容。（BIOS版本可以通过在TOS-技术支持-Report Issues收集系统报告，然后解压，从device.txt上看到）V15版本可以更新Bios，从而能被视为新批次。

请根据初始RAM容量选择对应的Bios更新包：
* **MAPL0303（4GB版本）**：https://download2.terra-master.com/MAPL0303V21.zip
* **MAPL0304（2GB版本）**：https://download2.terra-master.com/MAPL0304V22.zip

旧批次机型和220/420机型一样最高可使用版本是 TOS 5.1.145（升级方法请参考上述的”220/420机型“的步骤）；
新批次机型可使用的最高版本是 TOS 6甚至更高。

**升级方法1：更新**
* **[EN]**
  → 5.1.145 https://forum.terra-master.com/en/viewtopic.php?t=6355
  → 6.0.530 https://forum.terra-master.com/en/viewtopic.php?t=6809
  → 6.0.770 https://forum.terra-master.com/en/viewtopic.php?t=8817
  → Check for updates to the latest TOS6
* **[CN]**
  → 5.1.145 https://forum.terra-master.com/cn/viewtopic.php?t=4363
  → 6.0.530 https://forum.terra-master.com/cn/viewtopic.php?t=4555
  → 6.0.770 https://forum.terra-master.com/cn/viewtopic.php?t=5025
  → 检测更新至最新的TOS6
  如果有SSD Hyper Cache，请先取消 Cache。

**升级方法2：恢复出厂设置**，将内置U盘刷入TOS6专用的Initbboot镜像（TOS6 Legacy），然后直接在线安装最新的TOS6系统。
* **[EN]** https://forum.terra-master.com/en/viewtopic.php?t=6433
* **[CN]** https://forum.terra-master.com/cn/viewtopic.php?t=4399
如果有SSD Hyper Cache，请先取消 Cache。

### **211/212机型：**最高可使用的版本是5.1.73
可以选择安装TOS 6.0.585 Beta:
* **[EN]** https://forum.terra-master.com/en/viewtopic.php?t=7888
* **[CN]** https://forum.terra-master.com/cn/viewtopic.php?t=4879

### **223/423/424/424 Pro/424 Max/SSD/ SSD Plus：**
可以支持使用最新TOS版本。

### 关于TOS7
基本上能使用TOS6的TNAS都能支持使用TOS7.

---
