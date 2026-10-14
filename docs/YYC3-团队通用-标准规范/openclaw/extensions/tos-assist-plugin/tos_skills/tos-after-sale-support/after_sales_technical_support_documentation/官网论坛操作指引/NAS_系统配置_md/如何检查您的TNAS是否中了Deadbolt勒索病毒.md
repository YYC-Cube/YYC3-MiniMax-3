# 如何检查您的TNAS是否中了Deadbolt勒索病毒？

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=2039&sid=91960374e52a8fba318a0aab4711ff91

如何检查您的TNAS是否中了Deadbolt勒索病毒？

方法一
在浏览器地址栏输入TNAS IP,若登录界面出现以下页面，说明您的TNAS已中了Deadbolt勒索病毒。

方法二
1. 登录SSH终端查看，如何登录SSH终端请参照：
       https://forum.terra-master.com/cn/viewt ... utty#p6232
2. 在终端输入ls -lh /usr/bin/dead-tool  ,查看是否含有Dead字样的文件：
代码： 全选ls -lh /usr/bin/dead-tool
3. 在终端输入 cat /etc/crontabs/root  ,查看是否含有“dead-tool、pty10、qnx“字样的文件，这三类文件都为已知的病毒文件。
代码： 全选cat /etc/crontabs/root
可参照下图：
