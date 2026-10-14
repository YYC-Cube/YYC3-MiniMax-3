# 如何使用 VPN Server

**链接**：https://forum.terra-master.com/cn/viewtopic.php?t=1900&sid=b265ad2ea5bccea440907c924ea82b46

**关键词**：VPN服务器、vpn server、加密通道、虚拟专用网、远程连接

---

操作指引

适用机型： F2-220, F2-221, F2-420, F2-421, F2-422, F4-220, F4-221, F4-420, F4-421, F4-422, F5-220, F5-221, F5-225, F5-420, F5-421, F5-422, F8-421, F8-422

VPN Server提供了简单易用的 VPN解决方案，可将 TNAS设备设置成为 VPN服务器 ，让远程其它设备连接至 TNAS设备形成局域网。支持 PPTP、OpneVPN和 L2TP/IPSec协议。

准备工作
确保 TNAS所连接的路由器的 WAN IP是 Internet IP。 
在 TNAS连接的路由器上映射 VPNServer需要的端口（PPTP默认为 TCP1723，OpenVPN默认为 UDP1194，L2TP/IPSec默认为 UDP500和 UDP4500） ，或者开启路由器的 DMZ功能（简单但不安全）。
设置方法可参考：https://forum.terra-master.com/cn/viewt ... =87&t=1256

PPTP
1. 打开“设置”，启用 PPTP服务，确认默认配置。在路由器上转发 PPTP端口：TCP1723。


2. 打开“权限”，设置连接 PPTP服务器所需的用户和密码。


3. 在另一个 WAN IP的网络下的 Windows电脑上，打开“网络和共享中心”，找到 VPN客户端功能选项，点击“添加VPN连接”。


4. 在“服务器名称或地址”处填写 TNAS所在的路由器的 WAN IP，VPN类型选择“PPTP”，“用户名”和“密码”处添加在 VPN Server“权限”中已设置好的用户名密码，点击“保存”。


5. 返回“网络与共享中心”，点击连接。


6. 确认连接成功后，打开浏览器（推荐 Chrome、FireFox、360浏览器极速模式），尝试输入默认的 PPTP服务器动态IP地址 10.16.12.0:8181，若能打开 TOS登录界面，则此时 Windows电脑所在的本地网络与 TNAS所在的另一个网络之间的 VPN通道已建立成功。

提示：若使用 WIN7电脑，请前往网络>属性>设置新的连接或网络>连接到工作区，创建一个 VPN网络。
点击右下角系统托盘中的 桌面右小角的“网络”图标，找到创建的 VPN，再点击属性，找到安全选项，将 VPN类型改为“点对点的隧道协议 PPTP”，将数据加密改为“可选加密（没有加密也可以连接）”，并勾选“允许使用这些协议”，完成设置。


OpenVPN
1. 打开“设置”，启用 OpenVPN服务，确认默认配置。 在路由器上转发 
 OpenVPN端口：UDP1194。


2. 打开“权限”，设置连接 OpenVPN服务器所需的用户和密码。


3. 导出配置文件并解压到另一个 WAN IP下作为客户端的 Windows电脑上。

使用文件编辑器打开 OpenVPN.ovpn文件，找到YOUR_SERVER_IP，用路由器的公网 IP替换 YOUR_SERVER_IP字段。


4. 从 OpenVPN的官方网站（https://openvpn.net/community-downloads/）下载并安装OpenVPN应用程序。安装完成后，可以在“开始”菜单中看到 OpenVPN GUI程序，以管理员身份启动此程序。


5. 将 ca.crt和 openvpn.ovpn两个文件放入 OpenVPN目录下名为 config的子目录（C：\Program Files\OpenVPN\config\），替换原有的两个文件。


6. 双击桌面右下角系统托盘中的 OpenVPN GUI图标。输入用户和密码并点击“连接”，并使用用户凭据连接到 VPN Server。访问 TOS时，需输入172.10.11.1:8181地址，而不是172.10.11.0:8181。

提示：指定 VPN 服务器的动态 IP 地址之前，请注意：
1. VPN 服务器的动态 IP 地址必须为下列其中一个地址：
从 “10.0.0.0” 到 “10.255.255.0”
从 “172.16.0.0” 到 “172.31.255.0”
从 “192.168.0.0” 到 “192.168.255.0”
2. 您指定的 VPN 服务器动态 IP，以及指派给 VPN 客户端的虚拟 IP不能与局域网中其它设备 IP 冲突。

L2TP/IPSec
1. 打开“设置”，启用 L2TP/IPSec服务，确认默认配置。 在路由器上转发 
  L2TP/IPSec端口：UDP500和 UDP4500。


2. 打开“权限”，设置连接 L2TP/IPSec服务器所需的用户和密码。


3. L2TP/IPSec的两种连接方式：
a. 使用 L2TP/IPSec服务器的用户和密码连接
b. 使用预共享密匙连接（暂时不支持）

4. 在“服务器名称或地址”处填写 TNAS所在的路由器的 WAN IP，VPN类型选择“ L2TP/IPSec with certificate”，“用户名”和“密码”处添加在 VPN Server“权限”中已设置好的用户名密码，点击“保存”。


5. 返回“网络与共享中心”，点击连接。


6.  确认连接成功后，打开浏览器（推荐 Chrome、FireFox、360浏览器极速模式），尝试输入默认的 L2TP/IPSec服务器动态IP地址 10.3.1.0:8181，若能打开 TOS登录界面，则此时 Windows电脑所在的本地网络与 TNAS所在的另一个网络之间的 VPN通道已建立成功。

提示：
若使用 WIN7电脑，请前往网络>属性>设置新的连接或网络>连接到工作区，创建一个 VPN网络。
若使用 WIN7电脑，点击电脑右下角的WIFI图标，找到创建的 VPN，再点击属性，找到安全选项，将 VPN类型改为“使用 IPsec的第2层隧道协议（L2TP/IPSec）”，数据加密改为”可选加密（没有加密也可以连接）”，并勾选“允许使用这些协议”，完成设置。
