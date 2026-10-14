# 无法访问 TNAS-登录页面提示 502



当访问 TNAS 登录页面出现 502 错误时，通常表示后端服务未正常响应。可能原因包括：

1. `TOSDaemon.service` 服务未正常启动或运行异常，导致后端接口无法响应请求
   
2. `nginx` 服务未启动或异常停止，无法正常进行请求转发或页面访问
   

可参考以下操作步骤进行检查。

操作以下命令需通过 SSH 工具登录 TOS 后台（需提前在 TNAS 管理端开启 SSH 功能），参考以下链接：https://forum.terra-master.com/en/viewtopic.php?t=2350

若之前没有开启 SSH 则无法执行以下操作步骤，可以尝试重启 nas。检测是否可以解决问题。

如无效只能尝试重新安装 TOS 系统。重装系统可参考以下链接：https://forum.terra-master.com/en/viewtopic.php?t=423

### 排查方法一：检查 TOSDaemon. Service 服务

`TOSDaemon.service` 是 TNAS 核心服务，该服务异常是导致 502 错误的常见原因，优先检查此服务。

**步骤 1：检查服务运行状态**

- TOS4/5 版本：执行命令 `/etc/init.d/tosdaemon status`
  
- TOS6/7 版本：执行命令 `systemctl status TOSDaemon.service`
  

执行后查看返回结果，确认服务是否为正常启动状态（显示 running/active）。

若服务未启动 / 状态异常，执行重启命令：

- TOS4/5 版本：`/etc/init.d/tosdaemon restart`
  
- TOS6/7 版本：`systemctl restart TOSDaemon.service`
  

重启后重新访问 TNAS 登录页面，若 502 错误消失，说明问题已解决；若仍无法访问，执行步骤 2 收集日志。

**步骤 2：收集服务日志**

若重启服务后仍无法正常启动，需收集日志分析根因，执行日志收集命令后，将日志文件发送至铁威马官方技术支持邮箱： support@terra-master.com

- TOS4/5 版本：
  
    ```bash
    cp /var/log/TOSDaemon.log > /Volume2/public/TOSDaemon.txt
    ```
    
- TOS6/7 版本：
  
    ```bash
    journalctl -u TOSDaemon.service > /Volume1/public/TOSDaemon.txt
    ```
    

日志文件会生成在对应 Volume1 的 public 共享文件夹中。

### 排查方法二：检查并修复 Nginx 服务

Nginx 是 TNAS 的网页服务核心，服务异常或配置文件损坏会直接导致 502 页面错误，若方法一排查无问题，执行此方法。

**步骤 1：检查服务运行状态**

- TOS4/5 版本：执行命令:
  
  
    ``` bash
    /etc/init.d/nginx status
    ```
    
- TOS6/7 版本：执行命令:
  
    ```bash
    systemctl status nginx.service
    ```
    

查看返回结果，确认服务是否为正常启动状态（显示 running/active）。若服务未启动 / 状态异常，执行重启命令：

- TOS4/5 版本
  
    ```bash
    /etc/init.d/nginx restart
    ```
    
- TOS6/7 版本
  
    ```bash
    systemctl restart nginx.service
    ```
    

重启后重新访问 TNAS 登录页面，验证是否恢复正常。

**步骤 2：修复 Nginx 配置文件**

若重启 Nginx 服务后仍无法启动，大概率是配置文件损坏，执行以下命令覆盖修复默认配置文件（依次执行三条）：


```bash
cp /etc.default/nginx/nginx-extend.conf /etc/nginx
cp /etc.default/nginx/nginx-http.conf /etc/nginx
cp /etc.default/nginx/nginx.conf /etc/nginx
```

配置文件修复后，重新执行步骤 2 的 Nginx 重启命令，再尝试访问登录页面。

若依次执行方法一和方法二的所有步骤后，TNAS 登录页面仍提示 502、无法访问，可通过铁威马官方网站预约专业工程师，进行远程一对一问题排查与修复。

---
