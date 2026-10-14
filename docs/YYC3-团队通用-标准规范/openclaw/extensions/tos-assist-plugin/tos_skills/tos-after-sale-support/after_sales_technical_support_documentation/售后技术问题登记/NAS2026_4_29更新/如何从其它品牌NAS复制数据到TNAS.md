# 如何从其它品牌NAS复制数据到TNAS?

**关键词：TOS、TNAS、控制面板、HTTPS、Rsync、SMB**

**解决方案：**

方法一：Rsync同步（推荐，适合定期备份）
1. 在TNAS上启用Rsync Server：TOS Web > 控制面板 > 文件服务 > Rsync
2. 在源NAS上配置Rsync Client备份任务，指向TNAS的Rsync服务
3. 适用于大多数基于Linux的NAS系统（群晖、威联通等）

方法二：网络挂载直接复制（适合一次性迁移）
1. 通过SMB或NFS将源NAS的共享目录挂载到TNAS
2. 在TOS Web > 文件管理中直接复制文件
3. 挂载教程：https://toshelp.terra-master.com/docs/TOS6/controlpanel/access-permission/remote-folder

方法三：通过电脑中转
1. 从源NAS下载数据到电脑
2. 从电脑上传到TNAS
