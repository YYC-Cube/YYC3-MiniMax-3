# 网络连接正常，但是使用 TailScale 等网络工具后, WAN 未连接。

可能是使用了其他的网络工具阻碍了系统网络工具的正常运行。可尝试以下指令解决：

```bash
rm -rf /etc/resolv. Conf
ln -sf /run/systemd/resolve/stub-resolv. Conf /etc/resolv. Conf
```

如果您添加的网络工具有与 DNS 解析相关的选项，建议您尝试打开或关闭，以试图让它避免影响系统的 DNS 解析设置。

It is possible that other network tools are interfering with the normal operation of the system's network tools. You can try the following commands to resolve the issue:


```bash
rm -rf /etc/resolv. Conf
ln -sf /run/systemd/resolve/stub-resolv. Conf /etc/resolv. Conf
```

If the network tool you added includes options related to DNS resolution, we recommend that you try enabling or disabling them to prevent them from affecting the system's DNS resolution settings.

---
