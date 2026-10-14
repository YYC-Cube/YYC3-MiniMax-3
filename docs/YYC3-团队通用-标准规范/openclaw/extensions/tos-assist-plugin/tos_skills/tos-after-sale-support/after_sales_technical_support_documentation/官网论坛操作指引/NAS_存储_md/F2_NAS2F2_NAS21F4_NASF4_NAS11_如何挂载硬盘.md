# F2 NAS2F2 NAS21F4 NASF4 NAS11 如何挂载硬盘？

设备显示进入初始化，需要进行硬盘挂载操作，步骤如下：
一、关机,取出全部硬盘；
二、空机开机，进入初始化页面；
三、启动PUTTY程序，输入NAS的IP地址，选择“telnet”，点击”open”；
PUTTY下载地址：https://dl.terra-master.com/en/NAS/putty.exe
putty.png
四、输入用户名root和密码admin(注意密码不显示，直接回车即可)
username.png
password.png
五、插入硬盘全部插入（不关机，直接插入）
六、硬盘指示灯亮，输入挂载指令
1)如果硬盘有组建阵列，请输入以下命令（输入一行，回车一下）
   mdadm -A /dev/md0 /dev/sd[a-z]2 --force
   mdadm -A /dev/md9 /dev/sd[a-z]1 --force
   /usr/init.d/userspace
   /usr/init.d/dataspace
2）如果单模式，且只有一个盘
mdadm -A /dev/md0 /dev/sda2 --force
mdadm -A /dev/md9 /dev/sda1 --force
/usr/init.d/userspace
/usr/init.d/dataspace
3) 如果单盘模式，需要挂载两个硬盘
mdadm -A /dev/md0 /dev/sda2 --force
mdadm -A /dev/md0 /dev/sdb2 --force
mdadm -A /dev/md9 /dev/sd[a-z]1 --force
/usr/init.d/userspace
/usr/init.d/dataspace
4) 如果单盘模式，需要挂载三个硬盘
mdadm -A /dev/md0 /dev/sda2 --force
mdadm -A /dev/md0 /dev/sdb2 --force
mdadm -A /dev/md0 /dev/sdc2 --force
mdadm -A /dev/md9 /dev/sd[a-z]1 --force
/usr/init.d/userspace
/usr/init.d/dataspace
5) 如果单盘模式，需要挂载四个硬盘
mdadm -A /dev/md0 /dev/sda2 --force
mdadm -A /dev/md0 /dev/sdb2 --force
mdadm -A /dev/md0 /dev/sdc2 --force
mdadm -A /dev/md0 /dev/sdd2 --force
mdadm -A /dev/md9 /dev/sd[a-z]1 --force
/usr/init.d/userspace
/usr/init.d/dataspace

如果以上以上方式无法挂载，请更换主机及硬盘！
