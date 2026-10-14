# 为什么 A USBLAN 2.5G在TNAS设备上无法识别？

故障现象
A-USBLAN-2.5G（USB 2.5G Dongle）连接到TNAS设备上无法识别，但将A-USBLAN-2.5G（USB 2.5G Dongle）连接到PC可以识别到。

适用机型
A-USBLAN-2.5G

解决方法
以下操作win10系统为例

一、将A-USBLAN-2.5G适配器连接至PC，然后前往 设备管理器》网络适配器，看是否有USB 2.5G驱动。
二、下载WIN_USB_PGTOOL_v2.0.13烧录工具，运行RtPGtoolUI.exe
https://download3.terra-master.com/Util ... .13_V3.zip

三、PGtoolUI界面设置

1)     在CURRENT、MINIMUN、MAXIMUN填写需要烧录的MAC地址。

2)     勾选SPI_FLASH_EN、EEPROM_EN、LINK_OK

3)     LED_SEL_CFG填写为200008003F020200

4)     其它选项保持默认

5)     点击”Program”烧录

四、这是烧录完成的界面。烧录完成后，请从PC上移除A-USBLAN-2.5G，然后再连接至TNAS设备上使用。
