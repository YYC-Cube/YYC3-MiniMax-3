# 电源指示灯亮，无法进入TOS系统，空机开机后只有一声beep声.

**关键词：TOS、TNAS、初始化、指示灯、USB启动**

**解决方案：**

排查步骤：
1. 若TNAS具备HDMI接口：接入HDMI显示器和键盘，观察启动流程停在哪个步骤
   - 卡在UEFI Shell → 制作/烧录USB启动盘
   - 卡在系统加载 → 可能是系统损坏，尝试重新初始化
2. 空机开机后只有一声beep声，可能是USB启动盘故障，尝试重新制作/烧录USB启动盘
- 中文教程：https://forum.terra-master.com/cn/viewtopic.php?t=4399
- 英文教程：https://forum.terra-master.com/en/viewtopic.php?t=6433
