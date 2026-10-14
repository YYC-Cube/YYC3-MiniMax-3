# 我新购买了 TNAS，如何安装系统和初始化？

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=790&sid=cd797fee55a7adc920bb07134fd62706

操作指引和故障排除

我刚购买了 TNAS，如何安装系统和初始化？

适用机型: 所有 TNAS 型号

总览
新 TNAS 的系统安装包括以下步骤：
1.  硬件安装（包括硬盘的安装）;
2.  安装操作系统 TOS;
3.  基本的系统配置和存储配置;
4.  在 Web 浏览器登录 TOS;

安装指南的使用及相关故障排除方法
1.  找到快速安装指南
在产品包装中找到快速安装指南传单；将传单上显示的URL地址 输入Web浏览器。 如果您没有在包装中找到这样的传单，或者遗失了。 请访问以下链接以开始使用。https://start.terra-master.com
start.jpg

输入您的电子邮件地址，选择您的型号或产品ID，然后单击“开始”。
quickstart (1).png

在TNAS设备底部标签上，可以查找到型号或产品ID。
model_number.png

2.  硬件和硬盘安装
按照说明安装硬盘，将电源和网线连接到TNAS设备，然后开机；

重要说明！
为避免系统崩溃和数据丢失，您需要参考 兼容性列表 并选择正确的硬盘。 使用不兼容的驱动器，台式机硬盘驱动器（例如Seagate 酷鱼绿盘）或扇区或块损坏的运行状况不佳的硬盘，可能会导致诸如系统安装失败，系统崩溃甚至数据丢失的问题。

故障排除：
如果您的 TNAS 在安装过程中未能检测到硬盘，请参考此指引 https://forum.terra-master.com/cn/viewt ... f=79&t=789

3.  在网络上查找您的TNAS设备
为了帮助您找到 TNAS ，您可以下载 TNAS PC 桌面应用程序，并通过在 Windows 或 MAC 电脑上运行 TNAS PC 来搜索 TNAS 。 选中列表中显示的TNAS，然后单击“登录”；
1TNAS PC.png

重要说明！
如果在 TNAS PC 上单击“登录”后，应用程序跳至 IE（Windows自带的默认浏览器）Web浏览器，请从IE复制IP地址，然后尝试使用其他最近版本的Web浏览器，例如 Google Chrome，Firefox ，Safari 或极速模式的360浏览器。 否则，由于 IE 的兼容性，您可能会在安装过程中遇到问题。如果您偏好从 TNAS PC 登录，请将Windows默认浏览器从 IE 更改为其他浏览器。

故障排除：
TNAS PC 没能搜索到 TNAS ？ 请参考此文进行排查 https://forum.terra-master.com/cn/viewt ... f=79&t=140

4.  在 TNAS 上安装 TOS
请按照提示安装 TOS，建议使用自动在线安装。 但是，如果您没有将 TNAS 连接到 Internet 或无法连接到 Internet，则可以下载 TOS 安装软件包并手动安装。

要下载TOS安装包，请访问 https://download.terra-master.com/
为避免因下载过程中安装包损坏而导致安装异常，请在安装前检查 MD5 值。
在TOS 安装完成后，您的 TNAS 设备将自动重启。

注意！
1. 安装包是一个.ins压缩文件，您可以直接使用它进行安装，但不要 进行解压！
2. TOS 的安装需要大约5〜10分钟，如果该版本系统需要更新内核，可能需要更长的时间，大约为20分钟。 不要 在完成网页之前刷新网页或切断电源，否则设备可能会变砖。

5.  系统配置
成功安装TOS后，系统将提示您设置一些基本的系统配置。
用户名: 默认为admin;
密码: 您必须记住它，需要它来登录TOS;
密保邮箱: 通过这个邮箱地址您可以重置密码，以防万一您忘记密码。推荐您完成邮箱认证。

如果您忘记密码，请参考此说明： https://forum.terra-master.com/cn/viewt ... f=79&t=241

6.  存储配置
只有当你选择“手动安装”，您才能一步步进行存储配置，否则系统将自动使用默认的存储配置。
注意！
在系统配置和存储配置完成后，系统将格式化硬盘。 在初始化过程中，将格式化您安装到 TNAS 中的任何硬盘！ 请先备份硬盘上的数据！

故障排除：
如果 RAID 格式化卡在10％〜80％，或者总是提示您 RAID 格式化失败，请参考此方法进行排查：https://forum.terra-master.com/cn/viewt ... f=79&t=789

7.  登录 TOS
如要对 TNAS 进行高级设置或尝试安装应用程序，您需要登录 TOS 。
如要登录TOS，请在 Web 浏览器地址栏上输入 IP 地址或您的TNAS 设备名，例如：//192.168.1.10/ 或 //TNAS 设备名.local/

用户名: 默认为admin，除非您创建了其他用户;
密码: 密码为您在安装过程中设置的密码;

故障排除：
1.  如果您忘记密码，请参阅以下说明：https://forum.terra-master.com/cn/viewt ... f=79&t=265
2.  输入用户名和密码后，如果您的界面停留在“正在加载...”中，则无法登录 TOS，请改用最新版本的Google Chrome，Firefox ，Safari 或极速模式的360浏览器；
loading.png
3.  如果即使您在 TOS 登录页面上输入正确的密码，也会不断要求输入用户名和密码，请参考说明重新安装TOS。 https://forum.terra-master.com/cn/viewt ... f=79&t=241

如果您需要支持，请访问 https://www.terra-master.com/support/
support.png
