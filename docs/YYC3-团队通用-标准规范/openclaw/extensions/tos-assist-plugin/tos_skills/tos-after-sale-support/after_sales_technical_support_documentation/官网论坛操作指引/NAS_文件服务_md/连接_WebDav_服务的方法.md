# 连接 WebDav 服务的方法

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=3581&sid=048e1debfe835733a17dfc037a28fa77

适用机型
所有 TNAS型号
适用版本
TOS 5.0.x
操作步骤
1、登录NAS系统，控制面板>网络服务>文件服务>WebDAV 开启服务
2、选择连接软件，例：winscp、RaiDrive ......
Winscp：
新建连接，填入正确的 局域网ip/远程ip/远程域名、端口、用户名、密码，即可连接
设置DDNS，可以参考以下连接方法：https://forum.terra-master.com/en/viewt ... f=78&t=433
注意：WebDAV 中http为不加密连接，https为TLS/SSL隐式加密

RaiDrive：
  填入正确的 局域网ip/远程ip/远程域名、端口、用户名、密码，即可连接
