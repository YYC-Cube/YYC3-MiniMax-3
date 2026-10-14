# TNAS mobile无法打开任何共享文件夹子目录了

**链接**：https://forum.terra-master.com/cn/viewtopic.php?t=1572&sid=2830252e3f49fda663c79a41b721ea52

**关键词**：APP登录、tnas mobile、手机端、手机访问、移动端

---

故障排除

适用机型
F2-210、F4-210

原因分析
在确保拥有所有共享文件夹的读写权限且网络流畅的情况下，使用 TNAS mobile突然无法访问任何共享文件夹了，且尝试升级到最新版本依然未能解决。该故障在 TOS 4.2.12版本出现，且升级系统并未能更新 TNAS mobile的相关配置。

解决办法
A：重新安装系统，更新所有系统配置文件以修复问题。在您的系统设置和应用并不多，且随时方便重新设置的情况下，可以考虑这个最为快捷的方式。如何重新安装TOS系统？

B：若您的系统设置复杂，应用较多，且重新配置困难，可以考虑通过登录 SSH终端，单独更新 TNAS mobile的系统配置文件以修复问题。
1. 下载 mobile.class.zip并解压出 mobile.class.php。
http://dl.terra-master.com/cn/mobile.class.zip

2. 通过 TOS上传功能或 smb文件服务，将 mobile.class.php传输到共享文件夹/public目录下。

3. 登录 SSH终端（如何登录 SSH终端？），登录成功后，输入以下指令以更新 TNAS mobile系统配置文件：
代码： 全选cp /mnt/public/mobile.class.php /usr/www/include/class/
