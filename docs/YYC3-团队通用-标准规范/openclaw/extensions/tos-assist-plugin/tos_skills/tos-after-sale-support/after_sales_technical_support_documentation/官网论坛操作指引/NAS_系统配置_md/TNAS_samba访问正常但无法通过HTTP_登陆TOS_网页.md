# TNAS samba访问正常，但无法通过HTTP 登陆TOS 网页？

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=1460&sid=91960374e52a8fba318a0aab4711ff91

现象：
TNAS samba访问正常，但无法通过HTTP登陆TOS网页

对策：
a.  ssh登陆TNAS的终端，使用root用户权限，执行 service nginx start，刷新TOS页面 如何登录SSH终端？
b.  若a方法无法解决：
停止 nginx 服务,使用初始配置替换现有的 nginx 配置文件,然后再启用 nginx 服务:
代码： 全选service nginx stop
cp /etc.default/nginx/nginx-extend.conf /etc/nginx
cp /etc.default/nginx/nginx-http.conf /etc/nginx
cp /etc.default/nginx/nginx.conf /etc/nginx
service nginx start
刷新TOS页面
