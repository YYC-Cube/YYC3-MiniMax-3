# 在 TOS6 无法将 SSD 设置为 Hyper Cache，提示可用 RAM 内存不足.

如果您使用的是较早的 TOS6, Hyper Cache 需要依赖部分 RAM. 请您更新 TOS 版本.

如果您已经在使用最新的 TOS6, 可能是你的 SSD 是少见的只支持 4K 扇区大小的型号，这使得它在设置 SSD Cache 时存在无法对齐分区的问题。

建议您联系 SSD 供应商帮你修改扇区标记。

If you are using an older version of TOS6, Hyper Cache requires access to some RAM. Please update your TOS version.

If you are already using the latest version of TOS6, it is possible that your SSD is a rare model that only supports 4K sector sizes, which causes partition misalignment issues when setting up the SSD cache. We recommend contacting your SSD vendor to have them adjust the sector markings.

---
