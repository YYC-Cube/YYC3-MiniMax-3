# 如何通过 TerraSync 远程同步数据?

**关键词：端口映射、DDNS、TOS、TNAS、控制面板、HTTPS**

**解决方案：**

TerraSync远程同步配置步骤：

前提：配置远程访问
1. 通过TNAS.online实现远程访问（推荐，最简单）
   - TOS Web > 控制面板 > 网络服务 > TNAS.online，按提示启用
2. 或通过DDNS+端口映射：
   - 设置DDNS服务
   - 在路由器上将TNAS的8023端口映射到外网

同步配置：
- 详细教程：https://toshelp.terra-master.com/cn/docs/TOS7/backup/terrasync
- 简要步骤：
  1. 在TNAS上打开TerraSync应用
  2. 创建同步任务，选择要同步的本地文件夹
  3. 在电脑/手机的TerraSync客户端添加TNAS设备（使用远程地址）
  4. 选择要同步的远程文件夹，启动同步任务

注意：远程同步速度受网络带宽影响，大量数据建议先在内网完成首次同步
