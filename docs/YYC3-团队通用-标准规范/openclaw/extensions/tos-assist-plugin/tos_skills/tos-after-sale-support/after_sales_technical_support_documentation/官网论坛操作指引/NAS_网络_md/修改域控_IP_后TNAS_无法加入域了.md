# 修改域控 IP 后，TNAS 无法加入域了？

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=3559&sid=51493c53a160f99b97633ae2f702b6b5

故障排除

故障现象
在修改 Windows 域控之前，TNAS 已添加域并使用正常。而在修改 Windows 域控的 IP 后，TNAS 无法再添加域。

故障分析
修改 IP 后，通常可能由于网络配置及防火墙原因无法连接，设备无法通过身份验证，DNS 记录未及时更新等原因导致 TNAS 无法成功加入域。本文将简单介绍相关的解决办法。

排查步骤
1.首先预设情景以便说明
原来域控的IP：192.168.1.254  DNS：192.168.1.254
现在修改为IP：10.10.10.254    DNS：10.10.10.254

2.按下 Win+R，在“运行”窗口输入“CMD”打开命令行窗口，输入以下指令查看网络修改是否正确：
代码： 全选ipconfig -all

3.输入以下指令停止 Netlogon 服务
代码： 全选net stop NETLOGON

4.再输入以下指令启动 Netlogon 服务
代码： 全选net start NETLOGON

5.重启 Netlogon 服务后，输入以下指令重新注册 IP。新的 IP 将重新注册到 DNS 服务器。
代码： 全选ipconfig /registerdns

6.删除原域控记录
打开 DNS 服务器，进入到 gc ，查看原来 IP 的 DNS 记录是否存在，如果存在，请删除该记录

7.检查 pangzhan.net 下是否存在旧的 DNS 记录，如果存在，请删除旧的记录

8.检查 DomainDnsZones 是否存在旧的 A 记录，如果存在，请删除旧的记录

9.检查 ForestDnsZones 是否存在旧的 A 记录，如果存在，请删除旧的记录

10.如果部署了“反向查找区域”，那么建议您删除它并重新建立“反向查找区域”；如果没有部署“反向查找区域”，就略过

11.执行完以上步骤后，请重启域控。
重新启动域控后，再次打开命令行窗口，输入：
代码： 全选ipconfig /flushdns

执行完成后，再输入：
代码： 全选ipconfig /registerdns

至此，您应该已经可以在 TNAS 上重新加入域了。
