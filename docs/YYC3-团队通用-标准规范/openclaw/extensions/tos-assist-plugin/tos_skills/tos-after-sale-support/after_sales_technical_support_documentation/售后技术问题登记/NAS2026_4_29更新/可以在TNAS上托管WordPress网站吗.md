# 可以在TNAS上托管WordPress网站吗?

**关键词：端口映射、TOS、TNAS、初始化、Web界面、ss和数据库怎么配置**

**解决方案：**

支持。有以下两种方式：

方式一：TOS内置服务（推荐新手）
1. 前往 TOS Web > 应用中心，安装WordPress和数据库（MariaDB/MySQL）服务
2. 配置数据库后，通过Web界面完成WordPress初始化
3. 适合个人博客、小型企业官网等轻量应用

方式二：Docker容器（推荐进阶用户）
1. 前往 TOS Web > 应用中心，安装Docker应用
2. 在Docker中拉取WordPress镜像和数据库镜像
3. 配置容器网络、端口映射和卷挂载
4. 适合需要自定义配置、多容器协作的场景

注意事项：
- 如需外网访问，需配置端口转发或TNAS.online远程访问
- 建议为WordPress配置定期备份，避免数据丢失
