# TOS 6 网页无法访问，同时 Samba（SMB）网络共享磁盘、应用等其它方面可以访问。

如果还能有机会进入 TOS Web 网页，或者能通过 SSH/Telnet/HDMI 访问终端，可以尝试以下排查方法。

执行指令检查是否有任何因为虚拟机、Docker、下载工具等 APP 的误操作而将文件放入系统根目录导致爆满的情况：


```bash
df -h
```

执行指令检查相关服务的运行情况：


```bash
systemctl status postgresql@13-main.service | head -n 10
systemctl status TOSDaemon. Service
```

执行指令检查有关服务的库文件权限是否正常，并尝试修正：



```bash
ll /lib/x86_64-linux-gnu/ld-linux-x86-64. So. 2
chmod 755 /lib/x86_64-linux-gnu/ld-linux-x86-64. So*
```

---
