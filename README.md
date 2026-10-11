# A+ 英语备考站：Render 版本

保留服务器端内测账号验证、词汇学习、专项练习、模拟测验、错题及学习计划。无需 ChatGPT 登录。

将此目录内容上传至 GitHub 仓库根目录。在 Render 创建 Web Service 并连接仓库，选择 Node、Free，构建命令 `npm install --omit=dev`，启动命令 `npm start`，健康检查 `/health`。

环境变量：`BETA_USERNAME` 为内测用户名；`BETA_PASSWORD` 为内测密码；`SESSION_SECRET` 为随机会话密钥，至少 32 字符。密码与密钥应通过 Render 环境设置提供，不要提交到 GitHub。使用 Blueprint 时 `SESSION_SECRET` 自动生成。

Render 自动提供 `RENDER_EXTERNAL_URL`。如以后绑定自己的域名，请配置 `PUBLIC_URL` 为该域名的完整 HTTPS 地址，用于登录请求的来源校验。

默认只提供一个内测账号；修改用户名或密码后重新部署。学习记录仍在浏览器保存。

免费服务可能休眠。部署完成后，应在实际手机网络中检查登录页、登录及退出流程。
