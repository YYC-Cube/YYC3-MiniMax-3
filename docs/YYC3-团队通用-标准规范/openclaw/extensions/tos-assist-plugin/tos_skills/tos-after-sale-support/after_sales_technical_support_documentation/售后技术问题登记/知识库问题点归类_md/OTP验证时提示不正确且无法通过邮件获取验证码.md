# OTP 验证时提示不正确。且无法通过邮件获取验证码。

可能是 TOS 系统的时间与你的手机的时间不一致。您可以尝试调整手机的时区或小时来生成不同的验证码。

通过终端重置（连接 HDMI 和 USB 键盘，重启 NAS，登录终端）：

1. 连接数据库以更新用户信息：
   
    
   
    ```bash
    psql -U terramaster -d tos -p 5032
    ```
    
1. 将指定用户的 otp_secret 字段值更新为空字符串（请将 xxx 替换为您需要登录的用户名）：
   
   
    ```sql
    UPDATE user_table SET otp_secret = '' WHERE username = 'xxx';
    ```
    
2. 执行完以上命令后，刷新浏览器并尝试重新登录 TOS 系统，此时您将不再需要输入 OTP 验证码。
   

如果您最后依然无法解决，您可以尝试重启 TNAS。

如果重启 TNAS 依然未能解决问题，很遗憾您只能尝试重置系统了：

- **[EN]** https://forum.terra-master.com/en/viewtopic.php?t=423
  
- **[CN]** https://forum.terra-master.com/cn/viewtopic.php?t=241
  

---
