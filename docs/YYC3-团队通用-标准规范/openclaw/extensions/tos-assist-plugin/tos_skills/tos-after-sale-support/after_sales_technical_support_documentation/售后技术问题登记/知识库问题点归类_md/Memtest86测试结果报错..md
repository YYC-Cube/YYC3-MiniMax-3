# Memtest86 测试结果报错.

不一定是 RAM 或硬件问题. 请进入 Bios，修改以下选项提高兼容性再使用 Memtest86 测试一下。

通过快捷键把隐藏项打开

BIOS -> `ctl +`

前往 `chipset->SA->Memory->SA GV` ，修改为 `disabled`

---
