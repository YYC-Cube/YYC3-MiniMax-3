# 如何更新过期的SSL证书？

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=4514&sid=91960374e52a8fba318a0aab4711ff91

适用版本：
所有版本

适用机型：
所有机型

故障现象：
在使用部分 TOS 系统版本时，系统提示tnas.link 或 terra-master.com 证书过期。

对策：
1、terra-master.com 证书过期
针对 terra-master.com 证书过期的问题，请前往 TOS > 控制面板 > 安全 > 证书，选中 terra-master.com 证书，并点击“更新”按钮。若更新失败，请检查您的网络连接状态，确保您的 TNAS 设备能够正常访问互联网。

2、tnas.link 证书过期
（1）若您的系统版本为 TOS 6，只需在设备连接网络的状态下重启您的 TNAS，系统便会自动更新证书。
（2）若您的系统版本为 TOS 4（F2-210、F4-210 型号除外）或 TOS 5，在确保网络连接正常的情况下，重启 TNAS.online 服务即可实现证书更新。如遇TNAS.online 重启不成功的情况，通过重启整个 TNAS 设备同样能够完成证书的更新操作。

3、针对F2-210、F4-210两种机型，tnas.link证书更新的方法
第一步：下载tnas.link证书更新时需要使用的文件。下载链接：
https://download3.terra-master.com/Docu ... dateCrt.sh

第二步：将下载好的证书上传至public目录。

第三步：开启SSH服务后，登录终端，切换管理员身份。终端登录方法链接：viewtopic.php?t=1511。身份切换命令：
代码： 全选sudo -i

第四步：执行证书更新命令，更新证书。证书更新命令：
代码： 全选/mnt/md0/public/updateCrt.sh

第五步：查看证书有效期并验证证书可正常使用。
（1）前往 TOS > 控制面板 > 安全 > 证书处查看tnas.link的有效期。
（2）重启tnas.online，tnas.online可成功启用。
