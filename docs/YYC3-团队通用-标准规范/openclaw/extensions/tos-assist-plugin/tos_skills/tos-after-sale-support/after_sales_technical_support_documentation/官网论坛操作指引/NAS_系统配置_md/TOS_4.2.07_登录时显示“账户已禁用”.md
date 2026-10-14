# TOS 4.2.07 登录时，显示“账户已禁用”？

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=803&sid=91960374e52a8fba318a0aab4711ff91

故障排除

经反馈和验证 TOS 4.2.07存在中文名称账户登录时显示“账户被禁用”而无法登录的问题，以下是该问题的解决办法：
1. 下载压缩包：https://dl.terra-master.com/cn/TOS_4.2. ... .class.zip，并解压；
2. 将解压出的 user.class.php 配置文件上传至 TOS 的 共享文件夹public/ 下；
3. 启用 ssh 服务，并登录SSH，执行以下命令替换掉有错误的 user.class.php 文件：
代码： 全选cp /mnt/public/user.class.php /usr/www/tos/controller/

该问题将会在 TOS 4.2.08 及以后的版本得到修复。
