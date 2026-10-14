# Windows 通过 SMB 网络磁盘创建X.file 时, 竟然允许我再创建x.file. 这不正常.

TOS6 默认打开 SMB 的大小写敏感, 符合 Linux 文件系统特性, 但可能导致 Windows 在访问时使用异常.

您可以关闭大小写敏感, 从而兼容 Windows 的使用习惯.

请前往 TOS-控制面板-SMB-高级-自定义, 增加配置:

`case sensitive = no`

---
