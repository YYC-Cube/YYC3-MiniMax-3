# 无法通过 Win11 访问 SMB 文件共享/网络磁盘.



Win11 默认不支持 SMB1，而如果您正在使用 210 型号的 TNAS，那么它们可能自动协商使用 SMB1 并被 Win11 拒绝。

您可以考虑设置 Win11 支持 SMB1。

https://winsides.com/enable-smb-1-0-cifs-file-sharing-support-windows-11/

如果您使用的是其它的 TNAS 机型，请前往 TOS 网页-控制面板-网络-文件服务-SMB，调整最大和最小 SMB 协议版本。

---
