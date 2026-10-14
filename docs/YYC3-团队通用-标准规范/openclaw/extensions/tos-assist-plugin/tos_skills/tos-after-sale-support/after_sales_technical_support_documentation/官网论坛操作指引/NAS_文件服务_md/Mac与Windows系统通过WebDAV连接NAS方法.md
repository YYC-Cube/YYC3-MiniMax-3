# Mac与Windows系统通过WebDAV连接NAS方法

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=4402&sid=048e1debfe835733a17dfc037a28fa77

适用机型：
所有 TNAS型号

适用版本：
TOS 4/5/6

操作步骤：
一、MacOS

1、登录TOS系统后，依次点击“控制面板” > “网络服务” > “文件服务”，然后启用WebDAV服务。

2、点击屏幕顶部的“前往”菜单，从下拉菜单中选择“连接服务器”。

3、在弹出的“连接服务器”窗口中，填写您的WebDAV服务器地址及端口号（HTTP为8800，HTTPS为474）然后点击“连接“。如图所示：

4、选择“注册用户”作为连接身份，输入您的TOS账号和密码，最后点击“连接”按钮即可完成连接。

二、Windows
WinSCP 和 RaiDrive 两款软件的连接方法。

使用WinSCP连接：
1、访问WinSCP官网下载并安装WinSCP，下载地址：https://winscp.net/eng/index.php

2、打开WinSCP，点击“新建站点”。

3、在“文件协议”下拉菜单中选择WebDAV。

4、填入正确的局域网IP/公网IP/域名、端口号（HTTP为8800，HTTPS为474）、用户名、密码，点击“登陆”按钮即可完成操作，如下图：

使用RaiDrive连接：

1、访问RaiDrive官网下载并安装RaiDrive，下载地址：https://www.raidrive.com/download

2、打开RaiDrive，点击“Add”按钮。

3、在Storage选择NAS，并选中WebDAV。

根据红色提示框提示，填入正确的局域网IP/公网IP/域名、端口号（HTTP为8800，HTTPS为474）、用户名、密码即可，点击“连接”按钮即可完成操作。如下图:

远程访问注意事项：
若需要使用公网IP或 域名通过WebDAV连接NAS，请确保在路由器上正确映射WebDAV端口号 （HTTP为8800，HTTPS为474）。
具体操作可参考链接：viewtopic.php?t=1256
