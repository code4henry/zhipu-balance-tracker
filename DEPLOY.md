# 部署指南

## 方式一：Railway 网页部署（推荐，最简单）

### 步骤：

1. **访问 Railway**
   - 打开 https://railway.app/
   - 点击 "Start a New Project" 或 "Login"

2. **登录账号**
   - 可以用 GitHub、Google 或邮箱登录
   - 注册完全免费

3. **创建项目**
   - 点击 "New Project" → "Deploy from GitHub repo"
   - 如果还没推送代码到 GitHub，可以：
     - 先把项目推送到 GitHub
     - 或者选择 "Blank Project" 然后手动上传

4. **配置项目**
   - Project Name: `zhipu-balance-tracker`
   - Environment: 选择 `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`

5. **获取访问地址**
   - 部署完成后，Railway 会给你一个 URL
   - 例如：`https://zhipu-balance-tracker.railway.app`

---

## 方式二：通过 GitHub 自动部署（推荐）

### 1. 推送代码到 GitHub

```bash
cd ~/zhipu-balance-tracker

# 初始化 git（如果还没有）
git init
git add .
git commit -m "Initial commit"

# 创建 GitHub 仓库（需要先在 GitHub 网页上创建）
# 然后推送代码
git remote add origin https://github.com/YOUR_USERNAME/zhipu-balance-tracker.git
git push -u origin main
```

### 2. 在 Railway 连接 GitHub

1. 访问 https://railway.app/
2. 点击 "New Project"
3. 选择 "Deploy from GitHub repo"
4. 选择 `zhipu-balance-tracker` 仓库
5. Railway 会自动检测 Node.js 项目并部署

---

## 方式三：本地运行 + 内网穿透（最快）

如果你想立刻访问，可以用 ngrok：

```bash
# 安装 ngrok
brew install ngrok

# 启动服务器
cd ~/zhipu-balance-tracker
npm start

# 在另一个终端启动 ngrok
ngrok http 3000
```

然后访问 ngrok 给你的公网地址即可。

---

## 部署完成后

1. **测试访问**：打开部署后的 URL
2. **添加账户**：
   - 访问 https://open.bigmodel.cn 查看余额
   - 在应用中输入余额信息
3. **安装到手机**：
   - 用手机浏览器打开部署后的 URL
   - 点击浏览器菜单 → "添加到主屏幕"
