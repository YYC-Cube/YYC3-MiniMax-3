# TOS 5 网页无法访问，同时 Samba（SMB）网络共享磁盘、应用等其它方面可以访问。

如果还能有机会进入 TOS Web 网页，或者能通过 SSH/Telnet 访问终端，可以尝试检查是否系统根目录塞满：



```bash
df -h
```

尝试重置 nginx 服务配置并重启：


```bash
cp -r /etc. Default/nginx/ /etc/
```

如果依然无法解决，可以尝试重置系统：

- **[EN]** https://forum.terra-master.com/en/viewtopic.php?t=423
  
- **[CN]** https://forum.terra-master.com/cn/viewtopic.php?t=241
  

---
