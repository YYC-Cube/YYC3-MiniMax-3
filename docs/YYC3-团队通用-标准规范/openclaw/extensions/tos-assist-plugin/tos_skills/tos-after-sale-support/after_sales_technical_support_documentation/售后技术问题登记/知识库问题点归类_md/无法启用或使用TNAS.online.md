# 无法启用或使用 TNAS.online

一、确认是否启用了「安全隔离模式」

请首先确认 NAS 是否开启了 安全隔离模式：
* 在安全隔离模式下，仅允许局域网通信
* 无法访问 TNAS.online 属于正常行为
👉 如需使用 TNAS.online，请先关闭安全隔离模式。

### 二、检查系统时间是否正确
系统时间异常会导致 安全连接建立失败。
在 NAS 终端执行：
```bash
date
```


判断结果：

- ✅ 时间与当前实际时间接近 → 正常
  
- ❌ 时间明显不正确 → 请开启自动时间同步（NTP）
  

### 三、检查 NAS 网络是否正常（是否可访问外网）

**1️⃣ DNS 是否正常**

DNS 异常会导致 NAS 无法解析 TNAS. Online 服务器地址。

测试方式：

- 中国大陆用户：
  
    ```bash
    nslookup baidu.com
    ```
    
- 海外用户：
  
    ```bash
    nslookup google.com
    ```
    

判断结果：

- ✅ 能返回 IP 地址 → DNS 正常
  
- ❌ 查询失败 / 超时 → DNS 异常
  

DNS 建议配置：

- 中国大陆：`223.5.5.5`
  
- 海外用户：`1.1.1.1`
  
    配置完成后请重新测试。
    

**2️⃣ 是否可访问 HTTP / HTTPS 服务**

测试方式：

- 中国大陆用户：
  
    ```bash
    curl baidu.com
    ```
    
- 海外用户：
  
  
    ```bash
    curl [https://google.com](https://google.com)
    ```
    

判断结果：

- ✅ 返回 HTML 内容（或提示 Moved Permanently）→ 网络正常
  
- ❌ 命令卡住 / 无返回 → 当前网络存在访问限制
  
    👉 请联系网络管理员或运营商协助处理
    

### 四、确认 NAS 是否可访问 TNAS. Online 服务器

请根据 TOS 版本进行对应检查。

**1️⃣ TOS 5 / TOS 6.0.694 及之前版本**

请确认是否可以访问以下地址（终端 curl 或电脑浏览器均可）：

- Tnas. Online
  
- V1. Tnas. Online
  
- V2. Tnas. Online
  
- Tnas2. Link
  
- Tnas. Link
  
    ⚠️ 如无法访问，通常为当地运营商拦截，该情况无法处理。
    

**2️⃣ TOS 6.0.750 及之后版本**

请确认是否可以访问以下地址：

- Tnas. Online
  
- V1. Tnas. Online
  
- V2. Tnas. Online
  
- V3. Tnas. Online
  
- Tnas2. Link
  
- Tnas. Link
  
    如中国用户 tnas. Online / v1. Tnas. Online 无法访问，可尝试以下方案：
    
    https://www.yuque.com/u34450862/rhl6sm/sh2dutd7xrw13k42?singleDoc# 《国内某些地区用户无法启用 TNAS. Online 的解决办法》
    

**3️⃣ TOS 7 用户**

请确认：

1. 当前 TOS 是否为最新版本
   
2. 是否可访问以下地址：
   
    - V3. Tnas. Online
      
    - Tnas. Online
      
    - V1. Tnas. Online
      

### 五、外网无法通过 TNAS. Online 访问 NAS 的排查

请确认以下两点：

- 远程 NAS 当前已开机，且可正常登录 TOS
  
- 远程 NAS 上 TNAS. Online 功能已成功启用
  

### 六、仍无法解决？请导出日志协助排查

如以上步骤均未发现问题，请在 NAS 终端中拷贝 TNAS. Online 相关日志并发送给我们。

日志路径如下：

- **TOS 5:** `/var/log/frpc.log`
  
- **TOS 6:** `/var/log/online2.log`
  
- **TOS 7:** `/var/log/onlined.log`
  

---
