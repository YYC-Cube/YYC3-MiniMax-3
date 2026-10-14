# TOS5 网页显示”正在检查文件系统，请稍候！如果在文件系统中发现异常，系统将进行修复，这可能需要数小时“。

Volume 使用的 EXT4 文件系统格式，那么挂载文件系统前，它可能需要对文件系统进行检测。检测用时与您的数据量以及可能存在的错误量有关。

检测期间，您可以看到 Disk LED 灯不停闪烁。

如果 Disk LED 灯停止闪烁后，TOS Web 依然没有成功进入系统界面，说明检测可能失败了。您可以考虑设法通过 SSH/Telnet/HDMi 登录终端，尝试修复文件系统：

- **[EN]** https://forum.terra-master.com/en/viewtopic.php?t=2575
  
- **[CN]** https://forum.terra-master.com/cn/viewtopic.php?t=1691
  

---
