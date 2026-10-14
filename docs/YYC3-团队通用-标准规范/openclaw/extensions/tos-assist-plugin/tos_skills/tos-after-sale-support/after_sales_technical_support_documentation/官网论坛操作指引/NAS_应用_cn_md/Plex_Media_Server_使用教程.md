# Plex Media Server 使用教程

**链接**：https://forum.terra-master.com/cn/viewtopic.php?t=4766&sid=b265ad2ea5bccea440907c924ea82b46

**关键词**：Plex媒体服务器、emby、plex、媒体服务器、影视、影音、视频播放

---

TNAS （铁威马 NAS）中可以安装多媒体服务器、影视、Plex Media Server、Emby Server作为个人媒体服务器使用。

Plex Media Server可以组织整理 TNAS 上的媒体，使您可以通过 Pad、手机、电视、计算机等设备轻松地浏览和播放这些媒体文件。

TOS 6 中 Plex Media Server 的使用方法：
1、在 TOS 6 应用中心找到 Plex Media Server，然后进行安装。

2、安装完成后，你可以前往 TOS 控制面板新建一个共享文件夹用于存放媒体文件，例如：video。系统会自动创建名为 Plex 的共享文件夹用于存放应用的部分配置和日志，请不要在此文件夹内存放任何媒体文件。

3、给新建的 video 共享文件夹配置权限：编辑新建的共享文件夹，设置安装应用时自动生成的应用用户 plex 的读写权限，如果未设置 plex 用户的权限，Plex Media Server 运行时将无法扫描该目录下的媒体文件。

4、保存权限之后，将媒体文件存放至该 video 共享文件夹内。
5、然后打开并配置 Plex Media Sever，使用已注册的账号或者新注册的账号进行登录。



6、根据自己的需求添加媒体库，可在 TOS 控制面板的共享文件夹模块中查看你的共享文件夹属于哪个卷。


7、进入 Plex 主页后找到自己添加的库进行浏览，如果该共享文件夹下有媒体文件但是显示为空，可以根据下图方法重新扫描媒体库文件。
注意：未按照第3步设置权限的共享文件夹中的媒体文件将无法被扫描。

8、如果想再次管理媒体库，可前往用户设置中的媒体库进行管理。


9、扫描完成后就可以在点击左侧自己添加的库查看媒体文件内容了。

10、另外，还可以下载其他客户端软件连接TNAS中的媒体库。
其他客户端软件下载地址：
https://www.plex.tv/media-server-downlo ... s#plex-app

其他说明：
1、PLEX/EMBY 如何扫描TNAS中的数据：viewtopic.php?t=4596
2、Plex无法启用，提示“操作失败”：viewtopic.php?t=3496
3、前往 PLEX 官网寻找常见问题解决方法。
