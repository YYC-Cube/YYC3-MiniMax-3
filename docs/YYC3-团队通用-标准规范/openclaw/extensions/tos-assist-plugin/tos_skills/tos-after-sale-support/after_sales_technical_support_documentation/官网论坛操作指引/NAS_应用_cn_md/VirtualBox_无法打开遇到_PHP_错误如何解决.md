# VirtualBox 无法打开，遇到 PHP 错误，如何解决

**链接**：https://forum.terra-master.com/cn/viewtopic.php?t=4032&sid=b265ad2ea5bccea440907c924ea82b46

**关键词**：VM、Windows虚拟机、virtualbox、虚拟化、虚拟机

---

适用版本：
TOS 5

适用机型：
所有 TNAS 型号（不包括F2-210、F4-210型号）

故障现象：

启动 VirtualBox 时，页面出现了 PHP 报错。如图：


故障原因：

此问题通常源于 PHP 配置文件的错误设置。VirtualBox 预期以自定义的超级用户身份运行，但出于某种原因，配置文件中的该用户被错误地更改为了 root 用户。目前，问题的具体原因还在排查中。

解决方法：

1.通过 SSH 登录您的TNAS。
https://forum.terra-master.com/cn/viewt ... =79&t=1511

2.执行以下命令：
代码： 全选/etc/init.d/php-fpm restart
若出现图中红色框中错误信息，则进行第3步


3.执行以下命令，将 root用户修改为您的自定义的超级用户：
代码： 全选vi /etc/nginx/php-fpm.conf
修改前：


按下 i 键进入编辑模式。
使用键盘的方向键将光标移动到需要修改的位置，删除 "root" 并输入您的自定义超级用户的名称。
按下 ESC 键退出编辑模式，然后同时按下“Shift”+“:” 。
当屏幕上出现冒号“:”后，输入“wq”，再按 Enter 键保存配置并退出。

修改后：


4.请执行以下命令重启 PHP 服务,VirtualBox则使用正常。
代码： 全选/etc/init.d/php-fpm restart
