# TNAS可以自动开机吗?

**关键词：TOS、TNAS、控制面板、HTTPS、BIOS、自动启动在哪里设置**

**解决方案：**

支持自动开机功能。

配置方法：
- 详细教程：https://toshelp.terra-master.com/cn/docs/TOS7/controlpanel/general-settings/hardware-power

简要步骤：
1. 前往 TOS Web > 控制面板 > 通用设置 > 硬件与电源
2. 找到「自动开机」或「通电自启」选项
3. 启用该功能
4. 保存设置后，下次TNAS接通电源时将自动启动

注意事项：
- 部分机型可能不支持此功能，请以实际TOS界面显示为准
- 若需定时自动开机：可结合主板的RTC唤醒功能（需在BIOS中设置）
- 若TNAS非正常关机后通电，也会自动启动（需启用断电恢复自启功能）
