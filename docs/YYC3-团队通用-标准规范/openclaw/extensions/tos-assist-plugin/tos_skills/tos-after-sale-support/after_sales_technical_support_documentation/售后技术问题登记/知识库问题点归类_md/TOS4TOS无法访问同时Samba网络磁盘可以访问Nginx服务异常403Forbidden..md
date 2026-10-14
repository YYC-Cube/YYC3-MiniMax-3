# TOS4 TOS 无法访问，同时 Samba 网络磁盘可以访问。Nginx 服务异常 403 Forbidden.

尝试登录 SSH 运行命令重启 nginx 服务：

```bash
service nginx start
```

登录 SSH 方法：

- **[EN]** https://forum.terra-master.com/en/viewtopic.php?t=2350
  
- **[CN]** https://forum.terra-master.com/cn/viewtopic.php?t=1511
  

很可能存在文件系统错误甚至是 HDD 故障。

请您输入指令切换到 root 权限：

```bash
cd /
sudo -i 
cd /
```

然后，参考这个检查和修复可能出错的文件系统：

- **[EN]** https://forum.terra-master.com/en/viewtopic.php?t=2575
  
- **[CN]** https://forum.terra-master.com/cn/viewtopic.php?t=1691
  

此外，可以用S.M.A.R.T 指令检查每个 HDD 的健康状况:


```bash
# (?=abcdef... )
smartctl -a /dev/sd?
```


---
