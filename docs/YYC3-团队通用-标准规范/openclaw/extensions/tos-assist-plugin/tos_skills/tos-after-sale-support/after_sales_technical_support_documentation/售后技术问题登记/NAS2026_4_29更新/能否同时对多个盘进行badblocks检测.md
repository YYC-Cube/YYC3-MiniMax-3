# 能否同时对多个盘进行badblocks检测?

**关键词：TOS、TNAS、控制面板、Web界面、SSH、选择单个硬盘**

**解决方案：**

TOS Web界面不支持同时对多个盘进行badblocks检测，但有以下方案：

方案一：逐个检测（TOS Web界面）
1. 前往 TOS Web > 控制面板 > 盘
2. 选择单个硬盘，点击「坏块扫描」
3. 等待完成后再对下一个硬盘进行检测

方案二：同时检测（通过SSH终端，适合高级用户）
1. 打开Terminal或SSH登录TOS
2. 使用badblocks命令对多个盘同时检测（需了解命令行操作）
   示例：badblocks -sv /dev/sda & badblocks -sv /dev/sdb &
3. ⚠️ 注意：
   - 多盘同时检测会显著增加系统负载和磁盘读写
   - 建议在系统低峰期操作
   - 确保TNAS散热良好，避免过热
