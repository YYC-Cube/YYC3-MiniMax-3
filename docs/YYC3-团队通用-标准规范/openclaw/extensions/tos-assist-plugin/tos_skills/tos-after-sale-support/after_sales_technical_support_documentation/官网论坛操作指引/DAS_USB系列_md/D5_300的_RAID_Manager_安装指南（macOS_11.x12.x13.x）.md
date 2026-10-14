# D5 300的 RAID Manager 安装指南（macOS 11.x12.x13.x）

安装最新的 RAID Manager 程序, 让您能够在 macOS 系统中管理您设备上的阵列。

适用型号：D5-300

支持操作系统版本：macOS 11.x/12.x/13.x

第一步：获取 Mac 终端 root 权限
1.1 请保持设备运行并将其连接至您的电脑；
1.2 以管理员身份登录 macOS，找到“前往 > 实用工具 > 终端”，单击运行“终端”；
1.3 输入：sudo -i
1.4 按下“回车”；
1.5 输入您的 macOS 管理员密码，并按下“回车”（请注意在输入密码时，输入密码是不显示的）；
1.6 当您看到如“xxxxxxx:~ root#”的字样时，说明您已成功获取 root 权限。

.

第二步：安装 RAID Manager 程序。
2.1 下载 RAID Manager 程序
2.2 双击打开TerraMaster RAID Manager_V1.0.14.app.dmg ；
2.3 选中并右击“TerraMaster RAID Manager”，点击“显示包内容 > Contents > MacOS >TerraMaster RAID Manager；
2.4 右击“TerraMaster RAID Manager”，点击“复制”；
2.5 将 “TerraMaster RAID Manager” 粘贴到终端窗口并按下回车；
.

2.6 之后会弹出 RAID Manager 界面；
注意：如果您收到由于安全原因导致安装停止的消息，您需要进入 "系统偏好设置 > 安全和隐私"，并允许 RAID Manager 运行。

视频指南：https://terrahelp.oss-cn-hongkong.aliyu ... _guide.mov

注意：由于 D5-300 已经上市超过7年，期间设备的硬件陆续进行了几次迭代更新。较早的硬件版本无法兼容 macOS 11.x/12.x/13.x 系统，也就是说，即便使用的最新的 RAID Manager 程序，您也无法在 macOS 11.x/12.x/13.x 系统中管理设备中的阵列。只有最新的3个硬件版本可以支持 macOS 11.x/12.x/13.x 系统：B01-D5300NEW-S1，B01-D5300NEW-S2，B01-D5300NEW-S3；请务必留意您的硬件属于哪个版本。

查看 D5-300 硬件版本的方法：

请拔出所有硬盘抽屉，可查看主板型号。
