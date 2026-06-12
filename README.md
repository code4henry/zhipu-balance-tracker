# 智谱余额查看工具

一个简洁的智谱 AI 平台 Token 余额查看工具，支持手机和电脑端访问。

## 功能特点

- 📱 **响应式设计** - 完美适配手机和电脑
- 🎯 **多账户管理** - 支持添加多个余额账户
- 📊 **趋势追踪** - 显示余额变化趋势
- ⚠️ **余额警告** - 自定义阈值，低余额提醒
- 🔄 **自动刷新** - 定期更新余额信息
- 📲 **PWA 支持** - 可安装到手机主屏幕

## 本地运行

```bash
# 安装依赖
cd ~/zhipu-balance-tracker
npm install

# 启动服务器
npm start

# 访问 http://localhost:3000
```

## 部署到 Vercel

1. 安装 Vercel CLI（如果还没安装）：
```bash
npm install -g vercel
```

2. 在项目目录运行：
```bash
cd ~/zhipu-balance-tracker
vercel
```

3. 按照提示完成部署

## 使用方法

1. 点击"添加账户"按钮
2. 填写账户信息：
   - 账户名称：例如"主账号"
   - 当前余额：从智谱开放平台控制台查看后输入
   - 单位：选择 tokens、元或积分
   - 警告阈值：低于此值时会显示警告
3. 保存后即可在卡片中查看余额

## 查看智谱余额

1. 访问 [智谱开放平台](https://open.bigmodel.cn)
2. 登录后进入控制台
3. 在账户信息中查看当前余额
4. 将余额输入到本工具中

## 技术栈

- **后端**: Node.js + Express
- **前端**: 原生 HTML/CSS/JavaScript
- **PWA**: Service Worker + Manifest
- **部署**: Vercel

## 项目结构

```
zhipu-balance-tracker/
├── api/
│   └── balance.js       # 余额查询 API
├── public/
│   ├── index.html       # 主页面
│   ├── app.js           # 前端逻辑
│   ├── sw.js            # Service Worker
│   └── manifest.json    # PWA 配置
├── data/
│   └── balances.json    # 数据存储（自动创建）
├── server.js            # 服务器入口
├── vercel.json          # Vercel 配置
└── package.json         # 依赖配置
```

## 安装到手机

1. 在手机浏览器中访问部署后的网址
2. 点击浏览器菜单中的"添加到主屏幕"
3. 确认后即可像原生 App 一样使用

## 注意事项

- 数据保存在服务器的 `data/balances.json` 文件中
- 部署到 Vercel 时，数据会保存在临时存储中，重新部署可能清空
- 建议定期导出或备份重要数据

## License

MIT
