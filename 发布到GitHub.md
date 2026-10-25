# 将课程发布到 GitHub Pages

## 1. 创建独立仓库

建议仓库名：`control-engineering-notes`。GitHub Free可使用公开仓库发布Pages。若使用其他套餐的私有仓库，请先核对账户是否支持相应Pages功能。

这个仓库只存本课程网站，不要把整个Study目录一起上传。当前网站根目录就是包含index.html的文件夹。

若准备从本地初始化并推送，创建远程空仓库时不要额外勾选README、gitignore或许可证；本地已有前两项，许可证可按自己的意愿另行选择。

## 2. 首次推送

在网站根目录打开终端，而不是在Study总目录。先确认git status显示的目录范围正确，再提交。

```powershell
git init -b main
git add .
git commit -m "Publish control engineering learning site"
git remote add origin https://github.com/YOUR_USERNAME/control-engineering-notes.git
git push -u origin main
```

把YOUR_USERNAME替换为实际账号；若使用其他仓库名，同样替换。首次认证使用GitHub支持的网页登录/凭据管理器或其他已配置方式，不要把令牌写进仓库文件或远程URL。

如果git提示缺少作者信息，可只给本仓库设置git config user.name与user.email；邮箱可使用GitHub账户设置中提供的noreply邮箱。不要使用示例中的占位账号执行push。

## 3. 开启 Pages

在远程仓库进入：

1. Settings → Pages。
2. Source选择Deploy from a branch。
3. Branch选择main，目录选择/(root)。
4. 点击Save。
5. 查看Actions中的Pages部署，成功后从Pages设置页打开实际网站地址。

通常项目站点地址形式为：`https://YOUR_USERNAME.github.io/control-engineering-notes/`。这里是模板，实际地址以GitHub显示为准。

## 4. 检查上线结果

打开首页后，分别检查一节基础课、一节带公式的课及一节含交互的课。确认样式、SVG图片、公式与滑块正常；刷新课程子页面应仍可访问。

如果404，先核对index.html是否在发布根目录，以及部署是否成功。若图片或交互失败，检查assets与courses是否一并上传、路径大小写是否一致。

## 5. 更新课程

```powershell
python build.py
git add .
git commit -m "Update course content"
git push
```

本项目采用“本地构建、提交成品HTML、Pages直接发布”的方式；只修改Markdown而不重新构建，不会改变已生成的教学网页。

## 官方说明

- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll

本文件为发布准备说明，不表示远程仓库已经创建或网站已经上线。
