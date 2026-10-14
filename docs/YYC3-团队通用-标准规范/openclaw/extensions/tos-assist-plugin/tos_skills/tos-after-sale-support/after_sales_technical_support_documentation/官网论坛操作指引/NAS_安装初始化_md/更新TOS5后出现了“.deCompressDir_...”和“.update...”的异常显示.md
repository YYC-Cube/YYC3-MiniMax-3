# 更新TOS5后出现了“.deCompressDir_...”和“.update...”的异常显示？

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=3822&sid=df318c2657b676e1a07d8bad1baa14ba

适用机型
所有 TNAS型号

适用版本
TOS 5.0.x

故障现象
在升级系统后，通过smb访问，发现两个以 .deCompressDir_0b812568da4ba30bc002ace26544dc24 和.update_6cf63d40d9af5463182da96e489889c1命名的文件夹。然而，在共享文件夹和文件管理模块中却无法看到它们

解决方法

1、登录NAS后，进入控制面板 > 通用设置，然后点击"任务计划"。点击"创建任务计划"，选择"自定义"，填入任务计划的名称，然后点击下一步。在自定义命令脚本框中输入以下命令：

代码： 全选mkdir /Volume1/.deCompressDir_0b812568da4ba30bc002ace26544dc24
mkdir /Volume1/.update_6cf63d40d9af5463182da96e489889c1

点击下一步，然后点击"创建"并执行。

2、在控制面板 > 访问权限 > 共享文件夹 。在该模块中，找到通过任务计划创建的文件夹名称，选中它们并删除。

3、请在文件删除完成后删除创建的任务计划。
