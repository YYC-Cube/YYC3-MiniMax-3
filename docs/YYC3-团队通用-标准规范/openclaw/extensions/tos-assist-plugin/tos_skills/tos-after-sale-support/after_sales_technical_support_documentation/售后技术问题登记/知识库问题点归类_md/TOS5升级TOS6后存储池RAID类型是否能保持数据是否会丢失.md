# TOS 5 升级 TOS 6 后存储池 RAID 类型是否能保持？数据是否会丢失?

存储池 RAID 类型独立于系统配置外，并不会因为系统更改而变更。

需要注意的是，如果您的盘在 TOS 4 使用过，盘很可能是旧分区格式的而无法在新版本上顺利使用。

如果您设置了 SSD Hyper Cache，请在升级 TOS 6 前先取消 SSD Hyper Cache。因为 TOS 6 使用着和 TOS 5 不同的 Cache 策略。

---
