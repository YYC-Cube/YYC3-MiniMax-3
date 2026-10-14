# 更新一个较老的 TOS （x86 4.1.27 或更早的版本）？

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=1662&sid=df318c2657b676e1a07d8bad1baa14ba

操作指引

X86型号: F2-220, F2-221, F2-420, F2-421, F4-220, F4-221, F4-420, F4-421, F5-220, F5-221, F5-420, F5-421, F8-421

较老的版本如 TOS 3.x 不能直接更新到 TOS 4.1.x 或者 4.2.x，须遵循以下顺序逐级手动更新：3.1.15 -> 4.0.09 -> 4.1.18 -> 4.1.27 -> 4.1.31 -> 4.2.x；

以下是更新包资源：
3.1.15: https://dl.terra-master.com/cn/TOS_S1.0 ... _VN108.bz2
4.0.09: https://dl.terra-master.com/cn/TOS_S2.0 ... _VN178.bz2
4.1.03: https://dl.terra-master.com/cn/TOS_S2.0 ... 03_294.bz2
4.1.27: https://dl.terra-master.com/cn/TOS_S2.0 ... 301433.bz2
4.1.31: https://dl.terra-master.com/cn/TOS_S2.0 ... 061157.bz2
4.2.32: https://download2.terra-master.com/TOS_ ... 071924.bz2

ARM 210 models:
F2-210, F4-210

如果您的 TOS 低于 4.2.x，请按照更新流程逐步进行。不要跳过任何这些步骤！
遵循以下顺序逐级手动更新：4.1.07 -> 4.1.27 -> 4.1.32 -> 4.2.08 -> 4.2.xx

以下是更新包资源：
4.1.07：https://dl.terra-master.com/cn/TOS_A1.0 ... 7_2883.bz2
4.1.27：https://dl.terra-master.com/cn/TOS_A1.0 ... 291655.bz2
4.1.32：https://dl.terra-master.com/cn/TOS_A1.0 ... 031214.bz2
4.2.08:  https://dl.terra-master.com/cn/TOS_A1.0 ... 111540.bz2
4.2.31:  https://download2.terra-master.com/TOS_ ... 021829.bz2

重要说明:
1. 更新前请最好备份数据；
2. 先前安装的应用可能需要重新安装；
3. 由于 4.0 以后的系统不再支持阵列加密，请在更新您 TOS 3.x 的系统前将阵列解密，否则您将无法使用您的数据；
