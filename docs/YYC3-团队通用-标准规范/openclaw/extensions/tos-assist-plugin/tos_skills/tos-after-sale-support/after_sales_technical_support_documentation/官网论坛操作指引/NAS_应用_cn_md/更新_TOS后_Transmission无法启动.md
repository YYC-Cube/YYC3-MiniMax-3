# 更新 TOS后 Transmission无法启动

**链接**：https://forum.terra-master.com/cn/viewtopic.php?t=1564&sid=2830252e3f49fda663c79a41b721ea52

**关键词**：BT、BT下载、transmission、下载器、种子下载

---

故障排除

适用机型
所有 TNAS型号

如果在您更新 TOS后，出现无法启动 Transmission的现象，尝试卸载重装 Transmission也无法解决，请执行以下操作。

1. 登录TOS，卸载Transmission应用
2. 登录SSH，执行sudo –i，切换到root用户 如何登录 SSH终端？
3. 然后执行命令：
代码： 全选find / -path '/mnt/md0/application/transmission' -prune -o -name 'transmission' -print -exec rm -rf {} \;
4. 重新安装Transmission应用。
