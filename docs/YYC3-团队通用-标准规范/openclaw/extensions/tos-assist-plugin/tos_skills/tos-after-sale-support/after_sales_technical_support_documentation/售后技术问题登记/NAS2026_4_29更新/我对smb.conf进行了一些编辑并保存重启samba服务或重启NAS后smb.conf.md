# 我对 smb.conf 进行了一些编辑并保存。重启 samba 服务或重启NAS后，smb.conf会恢复到原始状态。

**关键词：TOS、控制面板、Web界面、SMB、**

**解决方案：**

原因：TOS系统中，smb.conf配置由系统数据库管理，每次重启服务时会使用数据库中的配置覆盖smb.conf。

正确修改SMB配置的方法：

方法一：通过TOS Web界面（推荐，TOS5及以上）
1. 前往 TOS Web > 控制面板 > 文件服务 > SMB
2. 找到「高级设置」或「自定义参数」选项
3. 在此处添加的自定义配置将永久保存，且优先级高于smb.conf

方法二：通过Terminal修改自定义配置文件
1. 打开Terminal
2. 编辑 /etc/samba/smb-customize.conf 文件
3. 在此文件中添加您的自定义SMB配置
4. 重启SMB服务或重启NAS，配置将保留

注意：直接修改 /etc/samba/smb.conf 的文件会在重启后丢失，请使用上述两种方法
