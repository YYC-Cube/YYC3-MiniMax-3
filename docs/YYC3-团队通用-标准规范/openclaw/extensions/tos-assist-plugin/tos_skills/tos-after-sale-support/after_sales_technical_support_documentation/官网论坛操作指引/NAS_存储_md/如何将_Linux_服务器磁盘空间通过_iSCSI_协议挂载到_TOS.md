# 如何将 Linux 服务器磁盘空间通过 iSCSI 协议挂载到 TOS？

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=5066&sid=2853efb328304e05736fc85f61407238

适用版本: TOS 5/TOS 6

适用机型：所有TNAS型号

操作步骤：
所有操作需以root权限执行，请在Linux 服务器开始配置前通过以下命令切换至root用户：
代码： 全选sudo -i

1、安装 iSCSI Target 工具：
如果是基于Ubuntu/Debian系统，输入以下命令安装：代码： 全选apt install targetcli-fb -y
如果是基于RHEL/CentOS系统，输入以下命令安装：代码： 全选yum install targetcli -y
若安装失败，尝试更换软件源后重试。

2、检查当前磁盘情况，确定挂载的磁盘
输入lsblk进行查看，如图中sdd

3、创建存储对象
代码： 全选targetcli
cd /backstores/block
create my_disk /dev/sdd

4、创建iSCSI Target
代码： 全选cd /iscsi
create iqn.2025-08.com.ubuntu    #Target名称可自定义

5、创建 LUN 并关联存储对象
代码： 全选cd iqn.2025-08.com.ubuntu/tpg1/luns
create /backstores/block/my_disk

6、配置 ACL 访问控制
首先通过ssh访问TOS，参考以下链接：
如何登录终端

输入以下命令来查看iSCSI Initiator 名称：
代码： 全选cat /etc/iscsi/initiatorname.iscsi

然后回到Linux 服务器将其添加到acls目录下：
代码： 全选cd  /iscsi/iqn.2025-08.com.ubuntu/tpg1/acls
create iqn.2004-10.com.ubuntu:01:654228120e9

7、设置允许连接的用户和密码
代码： 全选cd iqn.2004-10.com.ubuntu:01:654228120e9
set auth userid=test
set auth password=NAStest123456   #密码不能小于8位，必须包含数字、大小写字母
cd /iscsi/iqn.2025-08.com.ubuntu/tpg1/
set attribute authentication=1

8、 配置监听端口并保存设置
代码： 全选cd /iscsi/iqn.2025-08.com.ubuntu/tpg1/portals
create 0.0.0.0 3260
cd /
ls     #检查配置
saveconfig
exit

9、启动 iSCSI Target 服务并配置防火墙
设置开机自启并立即启动服务：
代码： 全选systemctl enable --now target.service
或者
代码： 全选systemctl enable --now rtslib-fb-targetctl.service
开放 iSCSI 默认端口 3260/tcp：
代码： 全选firewall-cmd --add-port=3260/tcp --permanent
firewall-cmd --reload

10、前往TOS系统的控制面板-存储管理-虚拟磁盘进行挂载

完成上述所有操作步骤后，即可成功通过 iSCSI 协议将 Linux 服务器的磁盘空间挂载至 TOS 存储管理系统，实现跨设备资源共享与数据集中管理。
