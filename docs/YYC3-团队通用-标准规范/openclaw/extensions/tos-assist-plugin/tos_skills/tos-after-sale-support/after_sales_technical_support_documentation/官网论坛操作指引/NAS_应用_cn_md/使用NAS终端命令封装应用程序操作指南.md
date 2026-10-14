# 使用NAS终端命令封装应用程序操作指南

**链接**：https://forum.terra-master.com/cn/viewtopic.php?t=4887&sid=b265ad2ea5bccea440907c924ea82b46

---

适用版本: TOS5/6

适用机型：所有x86机型

操作步骤:

1、下载适用于x86架构的封装工具。

访问 GitHub 仓库https://github.com/TerraMasterOfficial/app-pkg-tools，下载适用于 x86 架构的封装工具





2、上传封装工具：

1）将下载的封装工具上传至 NAS 的共享文件夹中，建议创建一个共享文件夹（如“Pack-test”）来存放封装工具和相关文件。

2）在封装工具所在目录下，新建名为“output”的文件夹，用于存放配置文件和其他必要文件。




3、存放配置文件

在 output 目录中放置以下必要文件：

output/config.ini ： 应用的配置，详细字段说明可以参考GitHub文档

output/image/icons/myapp.svg： 应用的图标文件，

output/init.d/myapp.service：应用的启动服务文件，用于定义应用的启动方式和相关设置。

output/myapp.lang ：应用的多语言描述文件。

output/webui：应用的UI目录。如下图：



3、赋予执行权限：
使用SSH登录NAS，运行以下命令赋予封装工具执行权限：代码： 全选chmod +x /Volume1/Pack-test/makeapp_x64 


4、执行封装命令：
执行以下命令完成封装： 代码： 全选./Volume1/Pack-test/makeapp_x64 -path /Volume1/Pack-test/


注意：参数必须是 -path 

完成封装后，应用tpk文件将存放在指定的输出目录中：/Volume1/Pack-test/dist/Volume1/


如需要具体详细文档和说明请参考：
https://github.com/TerraMasterOfficial/ ... /Manual.md
