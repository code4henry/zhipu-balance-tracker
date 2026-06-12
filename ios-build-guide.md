# iOS 应用打包指南

## ✅ Capacitor 配置已完成

Xcode 项目已打开！现在需要在 Xcode 中完成以下配置：

---

## 📱 Xcode 配置步骤

### 1. 配置项目设置

#### 设置 Bundle Identifier
1. 在 Xcode 左侧面板中，点击最顶部的项目名称 "App"
2. 选择 TARGETS → App
3. 在 "General" 标签页中找到 "Identity"
4. 修改 Bundle Identifier：
   - 如果有 Apple Developer 账号：使用你的域名格式，如 `com.yourname.zhipu.balance`
   - 如果没有：保持 `com.zhipu.balance`

#### 设置版本号
- Version: `1.0.0`
- Build: `1`

### 2. 配置签名和权限

#### 无开发者账号（免费，只能安装到自己的设备）

1. 在 "Signing & Capabilities" 标签页
2. 取消勾选 "Automatically manage signing"
3. 在 "Team" 下拉菜单中：
   - 如果有个人 Apple ID：选择你的个人团队
   - 如果没有：点击 "Add Account..." 添加你的 Apple ID

#### 有开发者账号（$99/年，可发布到 App Store）

1. 在 "Signing & Capabilities" 标签页
2. 确保 "Automatically manage signing" 已勾选
3. 在 "Team" 下拉菜单中选择你的开发者团队

### 3. 配置应用图标和启动画面

#### 应用图标
1. 在 Xcode 中找到 "Assets.xcassets"
2. 点击 "AppIcon"
3. 替换不同尺寸的图标（需要准备多种尺寸）

#### 启动画面
1. 在 "Assets.xcassets" 中创建新的 "LaunchScreen" 图片集
2. 或在代码中配置（已在 capacitor.config.json 中配置）

### 4. 配置权限

如果需要访问网络或通知，在 "Info" 标签页添加：
- **App Transport Security**：允许 HTTP 请求（如果需要）
- **网络权限**：确保可以访问 API

---

## 🚀 构建和安装

### 方式一：直接安装到连接的 iPhone

#### 准备工作
1. 用 USB 线连接 iPhone 到 Mac
2. 在 iPhone 上信任此电脑：
   - 打开 iPhone 设置 → 通用 → VPN与设备管理
   - 找到你的 Mac 并点击"信任"

#### 在 Xcode 中运行
1. 在 Xcode 顶部工具栏中，选择你的 iPhone 设备
2. 点击 ▶️ 运行按钮（或按 Cmd+R）
3. 首次运行需要在 iPhone 上信任开发者证书：
   - 打开 iPhone 设置 → 通用 → VPN与设备管理
   - 点击开发者应用证书并信任

#### 完成！
应用会安装到你的 iPhone 上，可以像普通应用一样使用

### 方式二：构建 Archive（用于发布）

1. 在 Xcode 菜单栏选择 "Product" → "Archive"
2. 构建完成后会自动打开 Organizer 窗口
3. 选择 "Distribute App"
4. 选择分发方式：
   - **Ad Hoc**：分发到测试设备
   - **App Store Connect**：提交到 App Store
   - **Enterprise**：企业分发
5. 按照提示完成打包

---

## 📋 重要检查清单

### 打包前检查
- [ ] Bundle Identifier 已设置且唯一
- [ ] 版本号已设置
- [ ] 签名团队已选择
- [ ] 网络权限已配置
- [ ] 应用图标已添加

### 首次运行检查
- [ ] iPhone 通过 USB 连接到 Mac
- [ ] iPhone 已信任此电脑
- [ ] Xcode 中已选择正确的 iPhone 设备
- [ ] 应用已成功安装到 iPhone
- [ ] 应用可以正常打开和使用

---

## 🔧 常见问题

### Q1: Xcode 显示 "Failed to register bundle identifier"
**解决**: Bundle Identifier 被占用，修改为唯一的标识符

### Q2: 应用安装到 iPhone 后无法打开
**解决**: 需要在 iPhone 设置中信任开发者证书
- 设置 → 通用 → VPN与设备管理 → 信任

### Q3: 网络请求失败
**解决**: 检查 Info.plist 中的网络权限配置

### Q4: 如何更新应用？
**解决**:
1. 修改 Web 代码后，运行 `npx cap sync ios`
2. 在 Xcode 中重新构建并安装

---

## 📱 应用功能

打包后的 iOS 应用将包含：

- ✅ 智谱余额查询
- ✅ Coding Plan 用量监控
- ✅ 图表化显示
- ✅ 多账户管理
- ✅ 趋势追踪
- ✅ 余额警告提醒

---

## 🎯 下一步

1. **在 Xcode 中完成上述配置**
2. **连接 iPhone 并运行应用**
3. **测试所有功能是否正常**
4. **如需分享给他人，可通过 Ad Hoc 分发**

需要帮助解决具体的配置问题吗？
