# 为什么设置了防火墙后，我无法访问 TNAS 了？设置了错误的防火墙规则，导致无法再访问。

**方法 1：重置防火墙设置**

- **TOS6：**在 TOS 运行时将 HDMI 显示器和 USB 键盘接入 NAS，登录为超级用户，输入以下命令。
```bash
    systemctl stop iptables.service
    touch /iptables.conf
    rm /etc/firewalld/iptables.conf
    mv /iptables.conf /etc/firewalld/
    systemctl restart iptables.service
```

- **TOS4/TOS5：**在 TOS 运行时将 HDMI 显示器和 USB 键盘接入 NAS，登录为超级用户，输入以下命令。
  
  
    ```bash
    service iptables stop
    touch /iptables.conf
    rm /etc/firewalld/iptables.conf
    mv /iptables.conf /etc/firewalld/
    service iptables start
    ```
    

**方法 2：重置系统**

若无法访问系统，可考虑重新安装 TOS 以重置配置，从而恢复对系统的访问。

- **[EN]** https://forum.terra-master.com/en/viewtopic.php?t=423
  
- **[CN]** https://forum.terra-master.com/cn/viewtopic.php?t=241
  

---
