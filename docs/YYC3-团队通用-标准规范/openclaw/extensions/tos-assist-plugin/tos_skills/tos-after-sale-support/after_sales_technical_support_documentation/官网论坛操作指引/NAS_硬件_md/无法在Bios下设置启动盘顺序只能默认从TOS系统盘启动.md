# 无法在Bios下设置启动盘顺序，只能默认从TOS系统盘启动

适用型号：
F2-223, F2-423, F4-223, F4-423, T6-423, T9-423, T12-423, U4-423, U8-423, U12-423
(如果您使用的是其他系列的223/423型号,请将发票信息提供到技术支持邮箱来单独获取对应BIOS.)

故障现象：对于少数有特殊需求的用户，希望能自定义 TNAS 的盘启动顺序，但是无法在 Bios下设置启动盘顺序，只能默认从 TOS 系统盘启动。

对策：需要更新 Bios，具体操作步骤如下:
适用于 F2-223、F2-423、F4-223、F4-423的 Bios 文件压缩包：
https://download2.terra-master.com/Bios_T1509BG0.zip

适用于 T6-423的 Bios 文件压缩包:
https://download2.terra-master.com/T1509BF2.zip

适用于 T9-423, T12-423, U4-423, U8-423, U12-423的Bios 文件压缩包:
https://download2.terra-master.com/T7309A13.zip

1. 准备一个空 U 盘并将其格式化为 FAT 格式，解压 Bios_T1509BG0.zip 并将其中的所有文件拷贝至 U 盘根目录中。

2. 拔出 TNAS 上的所有硬盘，拆开 TNAS ，将 TNAS 内部的引导 U 盘拔出。
（注意：在不拆开 TNAS 的情况下，也可以完成对 Bios 的升级，但在 Bios 设置页面“Boot> 选择 UEFI USB Drive BBS Priorities > BOOT Option #?”的位置会存在两个 U 盘启动项，您需要找到对应的 Bios U 盘才行。）

3. 将含有 Bios 文件的 U 盘插到 TNAS 上。

4. 将 TNAS 通过一条 HDMI 线与显示器连接，并在 TNAS 上连接一个 USB 插头的键盘。

5. 将 TNAS 开机，在显示器显示 Bios 主页面后，按下 Esc 或 Delete 键进入到 Bios 设置页面。

6.前往 Boot > 选择 UEFI USB Drive BBS Priorities, 按下 Enter 键，将 BOOT Option #1选项由 Disable 改为 UEFI: General UDISK 5.00, Partition 1，再按下 Enter 键，接着按下 F4保存，然后 Bios 就会进入自动更新的页面。

7. Bios 更新完成后，会进入以下页面。

8. 当显示器画面出现“FPT Operation Successful；any other key to continue"时，无需按键盘的任意键，只需短按TNAS设备电源键将 TNAS 关机，取下含有 Bios 文件的 U 盘。并将此 U 盘连接至电脑，在 U 盘内仅保留 DmiEditEfi64、EFI 文件夹，将其它文件全部删除。

9. 然后再将这个含有 Bios 文件的 U 盘插入至 TNAS 并开机，进入到 Bios 主页面后，按 Esc 或 Delete 键进入到 Bios 设置页面。

10. 前往 Boot > 选择 UEFI USB Drive BBS Priorities, 按下 Enter 键，将 BOOT Option #1选项由
Disable 改为 UEFI: General UDISK 5.00, Partition 1, 再按下 Enter 键，接着按 F4保存，然后 Bios 会进入 Shell 界面。

11. 在 Shell 界面输入以下命令：
如果型号是F4-423,则输入以下命令:
代码： 全选fs0:
cd DmiEditEfi64
AMIDEEFIx64.EFI /SP 000-F4423-NT140-0001
如果型号是T6-423,则输入以下命令:
代码： 全选fs0:
cd DmiEditEfi64
AMIDEEFIx64.EFI /SP 000-T6423-NT140-0001

"F4423"或"T6423"代表了你的TNAS型号,如果您使用的是其他的适用型号,您只需要将更改为与TNAS型号对应的字母数字组合.

12. 将 TNAS 关机，把含有 Bios 文件的 U 盘拔掉。将原本位于 TNAS 内部的引导 U 盘安装回 TNAS，将硬盘安装回对应的硬盘槽位，将 TNAS 开机就可以继续使用了。

13. 若你要自定义 TNAS 的盘启动顺序，请重复第5步，前往 Bios 设置选项 > Fast > TOS Boot First，将此选项改为 Disabled ，然后再设置 Boot 启动顺序，即可保存启动顺序。
