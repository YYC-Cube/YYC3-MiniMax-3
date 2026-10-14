# 如何远程使用SMB?

**关键词：局域网、SMB**

**解决方案：**

SMB协议本身设计用于局域网访问，远程使用有以下方案：

推荐方案（适合远程）：
- WebDAV：TOS Web > 控制面板 > 文件服务 > WebDAV，启用后通过WebDAV客户端访问
- FTP：TOS Web > 控制面板 > 文件服务 > FTP，配置后远程访问
- 配合工具：Windows可使用RaiDrive将WebDAV/FTP映射为本地磁盘，获得类似SMB的使用体验

注意：SMB协议直接暴露到公网存在安全风险，不推荐
