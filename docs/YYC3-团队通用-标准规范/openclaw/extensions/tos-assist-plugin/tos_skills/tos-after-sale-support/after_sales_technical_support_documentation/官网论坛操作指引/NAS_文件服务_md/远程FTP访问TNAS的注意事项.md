# 远程FTP访问TNAS的注意事项

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=137&sid=048e1debfe835733a17dfc037a28fa77

当您使用FTP 远程访问 TNAS 时，请开启路由器（与TNAS相连接的路由器）TCP端口转发，需转发的接口为21（默认控制连接），55536-56569（被动式的数据连接）。否则远程访问有可能会失败。
