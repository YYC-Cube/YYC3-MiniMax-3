# 正在使用TOS4. 可以搜索到设备，但是无法在这个软件上进入文件夹.

**关键词：TOS、Web界面、共享文件夹、连接失败**

**解决方案：**

原因：TOS4系统较旧，新版TNAS PC可能不兼容。

解决方案：使用适配TOS4的旧版TNAS PC客户端

下载链接：
https://download2.terra-master.com/TerraMaster_TNAS_for_win_V3.2.0.6.zip

安装后操作：
1. 安装旧版TNAS PC客户端
2. 搜索并连接到TNAS设备
3. 进行网络驱动器映射（映射按钮应为可用状态）
4. 通过映射的驱动器访问文件

替代方案（如仍无法解决）：
- 使用浏览器访问TOS4 Web界面，直接管理文件
- 使用Windows文件管理器，通过SMB协议访问 \TNAS_IP\共享文件夹
- 考虑升级到TOS5或更高版本，获得更好的兼容性和功能支持
