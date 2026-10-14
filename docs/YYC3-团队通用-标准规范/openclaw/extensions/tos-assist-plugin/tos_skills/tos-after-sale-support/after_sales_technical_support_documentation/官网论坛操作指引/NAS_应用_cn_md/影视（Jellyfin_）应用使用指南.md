# 影视（Jellyfin ）应用使用指南

**链接**：https://forum.terra-master.com/cn/viewtopic.php?t=4868&sid=b265ad2ea5bccea440907c924ea82b46

**关键词**：Plex媒体服务器、emby、jellyfin、plex、媒体服务器、影视、影音、电影、电视剧、视频播放

---

一、了解 Jellyfin

Jellyfin 是一个开源的媒体服务器软件，可以将您的电影、电视剧、音乐、照片等媒体文件集中管理，并通过网页、手机、平板、电视等设备进行流媒体播放。它类似于 Plex 和 Emby，但无需任何付费即可享受所有功能。

二、你需要准备什么？

1.TOS 系统版本及设备要求

TOS 6.0 或更高版本，硬件加速需设备支持 GPU ，否则不可用。

2.安装 Jellyfin 应用并完成初始化

进入“应用中心”，搜索找到“影视”应用后进行安装，首次访问 Jellyfin 会进入设置向导，按照引导依次完成以下设置。
语言：界面的显示语言，根据您的需要进行设置。
账号：请记住您设置的账号与密码，便于您在初始化完成后可以顺利登录。
媒体库：需要将存放媒体资源的文件夹添加至媒体库才能被正常识别，也可以稍后添加。
元数据语言：元数据语言关系到您的媒体海报墙的显示语言，建议您按需选择。
远程访问：可以根据您的使用场景选择是否启用。
完成设置，点击“完成”即可进入 Jellyfin 登录页面，输入设置的账号和密码进行登录。

3.媒体库整理

安装完成后，系统会自动创建一个名为 jellyfin 的共享文件夹。您可以将需要管理的媒体文件（如电影、音乐、照片等文件）存放于此文件夹中。建议你在此文件夹下按媒体资源类型进行分类  （如：电源、电视剧）



注：你也可以选择其它文件夹用于存放媒体文件，当选择其它文件夹需对该文件夹设置应用用户jellyfin的读写权限，以确保能有权限访问媒体资源。（jellfin文件夹默认为应用用户分配了读写权限）



三、Jellyfin 使用教程

添加媒体库

登录 Jellyfin 后，点击左上角菜单图标，选择“控制台”。



在控制台左侧菜单中，选择“媒体库”，然后点击“添加媒体库”



添加媒体库需要选择媒体类型（电影、电视剧、音乐等），设置媒体库名称并添加媒体文件所在的文件夹，建议按媒体库类型来选择对应的文件夹（如添加电影类型的媒体库则添加存放电影的文件夹）。您还可根据需求设置其他选项，例如元数据下载器、图像保存位置等。



媒体库添加完成后，Jellyfin 会自动扫描媒体文件并下载元数据。如果媒体库显示为空，请前往jellyfin 网页端的控制台，点击“扫描所有媒体库”手动扫描媒体文件。



扫描完成后就可以进入媒体库观看媒体资源了。



硬件转码

硬件转码可以减轻 CPU 负担，提高视频播放流畅度。在 Jellyfin 控制台中，选择“播放”-“转码”进行设置。系统已默认调整为最优的转码配置，建议不要随意调整。



多用户设置

可以在“用户”菜单添加用户，添加后可对该用户分配不同的媒体库，从而实现为不同用户设置不同媒体资源访问权限。



四、客户端下载与安装

Android Mobile客户端下载

1.访问 Jellyfin 官网下载页面https://jellyfin.org/downloads ，选择“Full Repository”页面。



2.点击 Client.



3.选择android.



4.选择release签名包进行下载。(不要选择debug和unsigned包，proprietary为特别版)



IOS Mobile 客户端下载

可通过AppStore搜索jellyfin，并安装。如果AppStore未找到Jellyfin APP，也可以下载Swiftfin APP，Jellyfin 和 Swiftfin 可以共用一个 Jellyfin 服务端，两者账号的所有配置都是共享互通。



客户端登录 

打开已安装好的应用，输入服务器IP+端口号进行连接（在网页版打开jellyfin 应用时在标签信息上即可显示服务器的地址与端口号，例如：192.168.1.2:8096），连接成功后输入用户信息进行登录（默认用户名：jellyfin, 密码：您在设置jellyfin 服务端时设置的密码）。下图以Android Mobile为例，IOS Mobile 客户端登录方法相同。



Windows & MAC桌面客户端下载

1.访问 Jellyfin 官网下载页面https://jellyfin.org/downloads ，如图示点击Github Downloads



2.根据需要的操作系统（Windows和MAC ）选择对应的版本，请注意 MAC 系统需区分Intel或Apple芯片。



Android TV客户端下载

1.访问 Jellyfin 官网下载页面https://jellyfin.org/downloads ，选择“Full Repository”页面。



2.点击 Client.



3.选择androidtv.



4.选择release签名包进行下载。(不要选择debug和unsigned包，proprietary为特别版)



TV 客户端安装

 可以通过U盘或者网络共享将安装包传输至TV客户端。


注：TOS 6“应用中心”已上架Jellyfin for Android mobile 、Jellyfin for Windows、Jellyfin for Android TV 客户端，你可在“应用中心”中搜索对应关键词进行安装。同时也提供 Android 客户端的安装包，你可以直接从下方连接下载，但不确保是最新版本，若需要最新版本，请按上述方法进行下载安装。

Jellyfin for Android mobile：

https://download3.terra-master.com/Apps ... 60299.apk 

Jellyfin for Windows：

https://download3.terra-master.com/Apps ... s-x64.exe 

Jellyfin for Android TV：

https://download3.terra-master.com/Apps ... elease.apk


五、常见问题与故障排查

1.端口冲突问题

jellyfin和emby同时启用时会存在端口冲突的问题，可以停用其中一个应用或者修改其中一个应用的端口。下图为jellyfin修改端口的示意：



2.媒体库文件夹权限

当媒体库无法扫描到媒体文件夹时，在确保媒体资源放置在该文件夹的同时还需确认该文件夹是否设置了应用用户权限。设置应用用户权限方式如下：



3.无法进入初始化页面

若打开应用未进入初始化流程，是由于浏览器缓存导致的，需要清除浏览器缓存，然后在浏览器输入 NAS 的 IP 地址加上 Jellyfin 的端口号（默认 8096），例如：http://192.168.1.100:8096。

六、 结语

Jellyfin 是一个功能强大且易于使用的媒体服务器软件，可以帮助您轻松管理和播放您的媒体文件。希望本教程能够帮助您快速上手 Jellyfin，享受精彩的影音体验。
