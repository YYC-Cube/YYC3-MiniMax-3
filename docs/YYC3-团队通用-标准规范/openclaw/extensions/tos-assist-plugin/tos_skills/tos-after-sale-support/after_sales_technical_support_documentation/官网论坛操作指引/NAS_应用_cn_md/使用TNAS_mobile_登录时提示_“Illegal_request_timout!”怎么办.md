# 使用TNAS mobile 登录时提示 “Illegal request, timout!”怎么办

**链接**：https://forum.terra-master.com/cn/viewtopic.php?t=1415&sid=2830252e3f49fda663c79a41b721ea52

**关键词**：APP登录、tnas mobile、手机端、手机访问、移动端

---

故障排除

适用机型
所有TNAS 型号

TNAS 安装了TOS，手机段安装了TNAS mobile，使用TNAS mobile 登录时提示 “Illegal request, timout!”。这很可能是未正确连接互联网、网络不稳定、时区设置错误等导致TOS 系统时间错误或存在较大误差，进而导致无法登录。由于TOS 和TNAS mobile 需要依赖各自的本机时间，进行通信，如果时间相差过大，则通信协议无法完成。

解决方法
请检查手机系统和TOS的时间是否正确。
如需设置TOS 时间，请登录TOS，进入“控制面板”，找到“区域与语言”-“时间”，设置正确的时区和时间。
