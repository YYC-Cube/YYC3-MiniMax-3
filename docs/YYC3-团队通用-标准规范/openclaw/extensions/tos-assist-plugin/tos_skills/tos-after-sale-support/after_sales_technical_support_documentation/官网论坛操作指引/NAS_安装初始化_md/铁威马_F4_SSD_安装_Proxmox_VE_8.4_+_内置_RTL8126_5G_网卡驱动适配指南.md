# 铁威马 F4 SSD 安装 Proxmox VE 8.4 + 内置 RTL8126 5G 网卡驱动适配指南

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=4999&sid=df318c2657b676e1a07d8bad1baa14ba

铁威马 F4 SSD 安装 Proxmox VE 8.4 + 内置 RTL8126 5G 网卡驱动适配指南

一、准备工作

1. 硬件设备

铁威马 F4 SSD 设备
外接 USB 网卡（临时联网使用，设备名如 enx00e04c680003）
内置 5G 网卡（Realtek RTL8126，默认无驱动）
U 盘（≥2GB，用于制作 PVE 启动盘）
显示器 + HDMI 线 + 键盘鼠标（用于初始配置）

2. 软件资源

Proxmox VE 8.4 安装镜像
Realtek RTL8126 驱动下载（示例文件名：r8126-10.016.00.tar.bz2）
Rufus 启动盘制作工具

---

二、BIOS 设置

启动设备，按 DEL 键进入 BIOS。
将 TOS first Boot 设置为 Disable，确保从 PVE U 盘启动。

保存并退出（按 F4）。

---

三、安装 Proxmox VE 8.4

按提示安装 Proxmox VE。
安装过程中使用外接 USB 网卡（如 enx00e04c680003）连接网络。
安装完成后重启，进入 PVE 控制台，进入 shell。

---

四、配置软件源（推荐使用清华源）

注释掉企业订阅源：
代码： 全选find /etc/apt/sources.list.d/ -type f -exec sed -i 's|^deb https://enterprise.proxmox.com|# deb https://enterprise.proxmox.com|' {} \;

添加非订阅源：
代码： 全选echo "deb http://download.proxmox.com/debian/pve bookworm pve-no-subscription" > /etc/apt/sources.list.d/pve-no-subscription.list

替换为清华源：
代码： 全选cp /etc/apt/sources.list /etc/apt/sources.list.bak

cat > /etc/apt/sources.list <<EOF
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm main contrib non-free non-free-firmware
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-updates main contrib non-free non-free-firmware
deb https://mirrors.tuna.tsinghua.edu.cn/debian-backports bookworm-backports main contrib non-free non-free-firmware
deb https://mirrors.tuna.tsinghua.edu.cn/debian-security bookworm-security main contrib non-free non-free-firmware
EOF

更新系统：
代码： 全选apt update && apt full-upgrade -y

---

五、安装内核头文件及编译工具

代码： 全选apt install -y build-essential pve-headers-$(uname -r)

---

六、安装 RTL8126 驱动

上传驱动包到 PVE 主机（使用 SCP 或 U 盘）：
代码： 全选scp r8126-10.016.00.tar.bz2 root@<PVE_IP>:/root/

解压并安装驱动：
代码： 全选cd /root
tar -xjf r8126-10.016.00.tar.bz2
cd r8126-10.016.00
chmod +x autorun.sh
./autorun.sh

安装完成后重启系统：
代码： 全选reboot

---

七、识别网卡并配置桥接网络

查看网卡名称：
代码： 全选ip link

你可能会看到如下设备名：

enx00e04c680003：外接 USB 网卡
enp1s0：内置 RTL8126 网卡（安装驱动后）

编辑网络配置文件：
代码： 全选nano /etc/network/interfaces

内容如下（请根据实际网络配置修改 IP 和网关）：
代码： 全选# Loopback 接口
auto lo
iface lo inet loopback

iface enx00e04c680003 inet manual

auto vmbr0
iface vmbr0 inet static
    address 10.18.8.165/24       # 修改为你自己的 IP
    gateway 10.18.8.1            # 默认网关
    bridge-ports enp1s0          # 修改为内置5G网卡
    bridge-stp off
    bridge-fd 0

source /etc/network/interfaces.d/*

重启系统：
代码： 全选reboot

---

八、验证驱动和网络

确认 RTL8126 驱动已加载：
代码： 全选lsmod | grep r8126

应看到 r8126 模块已加载。

---

九、访问 Proxmox VE Web 管理界面

在浏览器中访问：

代码： 全选https://10.18.8.165:8006

使用 root 用户 和 安装时设置的密码 登录。
