# 更新 TOS 6.0.750后，TNAS.online 远程访问不可用的解决方法

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=4993&sid=51493c53a160f99b97633ae2f702b6b5

亲爱的铁威马用户，

您们好！在TOS 6.0.750版本推出后，我们收到部分用户反馈，升级后TNAS.online远程访问无法使用。针对这一问题，我们整理了相关的解决方法，希望能为您提供帮助。

问题一
问题描述：启用TNAS.online后，通过浏览器访问 https://tnas.online/tnasid 时，出现错误：“An unexpected error occurred ENO200999 unchecked error, please send this to the developer: dial tcp 127.0.0.1:5443: connect: connection refused”。

解决方法：此问题的出现是由于在更新750版本之前修改了默认的HTTPS端口（端口号5443）。
建议您重新修改一下HTTPS端口，然后再尝试是否可以正常使用 TNAS.online。

问题二
问题描述：TNAS.online 服务无法启用，页面出现错误提示：“TNAS.online无法使用，请检查您的TNAS设备网络连接是否正常，并确保‘安全隔离模式’已关闭。”

解决方法：出现此问题通常有两种情况：

1.“安全隔离模式”已开启：此模式为保证NAS的数据安全，只允许在内网访问，且不可访问互联网。所以无法开启TNAS.online 远程访问，设计就是如此。
2.NAS网络连接问题：NAS无法正常访问互联网，仅能在内网访问。常见的原因包括运营商欠费或DNS设置错误。常见的全球DNS服务器地址有：8.8.8.8（Google DNS）和1.1.1.1（Cloudflare DNS）；在中国，常用DNS服务器地址有：114.114.114.114（114 DNS）和223.5.5.5（阿里云DNS）。若您使用的是手动IP，请将其更改为DHCP自动分配IP后，并使用TNAS PC 应用程序搜索新的IP，并重启 NAS。然后，再尝试重新开启TNAS.online服务。

若您在操作过程中遇到任何问题，请随时与我们联系。
对此带来的不便，我们深感抱歉，感谢您的理解与支持！

铁威马技术团队

2025年7月12日
