# 需要测试内存RAM.

**关键词：TOS、TNAS、SSD、USB启动、BIOS、有HDD和SSD硬盘**

**解决方案：**

内存测试需要使用memtest86工具。

测试步骤：
1. 准备一个空USB盘
2. 制作memtest86启动盘（官网：www.memtest86.com）
3. 关闭TNAS，取下所有HDD和SSD硬盘
4. ⚠️ 重要：取下TNAS内置的TOS专用USB引导盘
5. 插入memtest86 USB启动盘
6. 开机，系统将自动运行memtest86内存测试

测试结果异常处理（发现错误时）：
1. 可能是兼容性问题导致测试结果异常
2. 进入BIOS设置：开机时按Del或F2进入BIOS
3. 按 Ctrl + ,（逗号）打开隐藏菜单
4. 前往 Chipset > SA > Memory > SA GV
5. 禁用 SA GV 选项
6. 保存并退出BIOS，重新运行memtest86测试
