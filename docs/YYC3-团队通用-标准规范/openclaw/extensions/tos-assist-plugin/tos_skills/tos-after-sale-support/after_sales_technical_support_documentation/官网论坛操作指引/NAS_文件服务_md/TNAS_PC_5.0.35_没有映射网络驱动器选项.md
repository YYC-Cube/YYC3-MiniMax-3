# TNAS PC 5.0.35 没有映射网络驱动器选项？

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=3127&sid=048e1debfe835733a17dfc037a28fa77

适用机型：
所有 TNAS 型号

故障现象：
在使用新版本 TNAS PC 时，部分用户无法找到映射网络驱动器选项。

分析及对策：
新版本 TNAS PC 需要适配新的 TOS 5版本使用，需要先在 TNAS PC 登录后才能看到映射网络驱动器选项。

Windows
1. 如果您的 TOS 版本是TOS4.x，请使用与之适配性最好的旧版本 TNAS PC（Windows），或者查看您的 TNAS 是否适合重装升级到 TOS５以适配新版 TNAS PC。
旧版本 TNAS PC：https://download2.terra-master.com/Terr ... .2.0.6.zip（Windows）
重装升级到 TOS5：https://forum.terra-master.com/cn/viewt ... =25&t=2332

2. 如果您的 TOS 版本是TOS5.x，您需要先在 TNAS PC 上选中TNAS，点击“登录”，登录成功后，您就可以在右上方发现“映射”选项。

3. 如果以上方法未能解决您的问题，可能是由于电脑系统设置或者不兼容等其他未知原因，导致您无法正常使用 TNAS PC 来映射网络驱动器。
请尝试使用电脑自带的方法映射网络驱动器：
Windows：
1). 按下 WIN + R，输入你的IP地址如： \\192.168.xxx.xxx

2). 输入网络凭据（TNAS 的账号密码），并勾选“记住我的凭据”以便后续访问。

3). 认证通过后，你将在资源管理器看到你的共享文件夹。

4. 请右键点击需要映射的共享文件夹，如：public、Photos等，选择“映射网络驱动器”，点击“完成”。

5.如果还需要将其他的共享文件夹映射为网络驱动器，请重复第4步。

备注：如果您在以上步骤中遇到任何无法解决的问题,您可以参考这个来排查问题:
https://forum.terra-master.com/cn/viewt ... =86&t=1848

Mac：
待补充
