# 我无法在 TOS 4.２上修改壁纸？

> 原文链接：https://forum.terra-master.com/cn/viewtopic.php?t=3514&sid=91960374e52a8fba318a0aab4711ff91

操作指引

在 TOS 4.2.x的较新版本上,存在增加桌面壁纸失败的问题,且由于各方面原因,部分客户的设备不能够或不方便重装升级 TOS 5,需要继续适用 TOS 4.2.x. 本文将为继续使用 TOS 4且对自定义壁纸有需求的用户提供一个可行的编辑壁纸的方法.

适用版本
TOS 4.2.x

适用机型
所有 TNAS 型号

操作步骤
1.登录SSH
https://forum.terra-master.com/cn/viewt ... =87&t=1511

2.输入以下指令将系统默认的壁纸和壁纸缩略图备份(可选)
代码： 全选cp -r /usr/www/tos/static/images/wall_page  /mnt/md0/public/
cp -r /usr/www/tos/static/images/wall_page/thumb  /mnt/md0/public/

3.准备好需要使用的壁纸 A.jpg和壁纸缩略图 a.jpg(可以用任意小图片当作缩略图),并上传到 pulbic 目录下.

4.输入以下指令来替换系统默认壁纸文件1.jpg
代码： 全选cp /mnt/md0/public/A.jpg  /usr/www/tos/static/images/wall_page/1.jpg
cp /mnt/md0/public/a.jpg  /usr/www/tos/static/images/wall_page/thumb/1.jpg

5.刷新 TOS 网页,再次打开用户设置－桌面，你将看到第1个壁纸图标已经被更换. 请点击该图标更改当前壁纸.
