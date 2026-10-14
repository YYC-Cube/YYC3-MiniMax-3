# docker-compose提示"找不到/usr/local/bin/python"

**链接**：https://forum.terra-master.com/cn/viewtopic.php?t=1586&sid=2830252e3f49fda663c79a41b721ea52

**关键词**：Docker、docker、docker-compose、容器

---

操作指引

适用机型
F2-210/F4-210

适用版本
TOS 4.1.x ~ TOS 4.2.x

原因分析
F2-210/F4-210的 TOS系统默认安装 python2.7,该版本不支持运行docker-compose

解决方法
到应用中心安装 Python3，然后重新尝试运行docker-compose。
