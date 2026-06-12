# iOS 部署方案

智谱余额查看工具 - iOS 部署完整指南

## 方案对比

| 方案 | 难度 | 体验 | 是否需要开发者账号 | 推荐 |
|------|------|------|-------------------|------|
| **PWA（渐进式 Web 应用）** | ⭐ 简单 | ⭐⭐⭐ 良好 | ❌ 不需要 | ✅ 推荐 |
| **Capacitor 打包** | ⭐⭐ 中等 | ⭐⭐⭐⭐ 接近原生 | ❌ 不需要 | ✅ 推荐 |
| **原生 iOS App** | ⭐⭐⭐ 困难 | ⭐⭐⭐⭐⭐ 完美 | ✅ 需要 | ⚠️ 复杂 |

---

## 方案一：PWA（推荐，最简单）

### 优点
- ✅ 完全免费，无需开发者账号
- ✅ 安装简单，无需 App Store
- ✅ 自动更新，无需重新安装
- ✅ 占用空间小

### 安装步骤

#### 在 iPhone 上安装

1. **用 Safari 打开应用**：
   ```
   https://zhipu-balance-tracker-production.up.railway.app
   ```

2. **点击分享按钮**：
   - Safari 底部的方框加上箭头图标

3. **选择"添加到主屏幕"**：
   - 滚动找到并点击

4. **点击"添加"**：
   - 可以修改名称（默认"智谱余额"）
   - 点击右上角"添加"

5. **完成！**
   - 主屏幕上会出现应用图标
   - 点击即可像原生 App 一样使用

#### 功能特性

- 🔄 **自动刷新**：每次打开自动获取最新数据
- 📱 **全屏显示**：没有浏览器栏，体验接近原生
- 🔔 **可添加通知**（需要进一步配置）
- 💾 **离线缓存**：支持基本离线使用

---

## 方案二：Capacitor 打包（推荐，接近原生体验）

### 优点
- ✅ 可以发布到 App Store
- ✅ 完整的原生功能访问
- ✅ 支持推送通知
- ✅ 可以设置启动画面

### 安装步骤

#### 1. 安装依赖

```bash
cd ~/zhipu-balance-tracker
npm install @capacitor/core @capacitor/cli
npx cap init
```

#### 2. 添加 iOS 平台

```bash
npm install @capacitor/ios
npx cap add ios
```

#### 3. 构建 Web 应用

```bash
# 确保服务器运行在 https://zhipu-balance-tracker-production.up.railway.app
npx cap sync ios
```

#### 4. 打开 Xcode

```bash
npx cap open ios
```

#### 5. 在 Xcode 中配置

1. **设置 Bundle Identifier**：
   - 选择项目 → TARGETS → Bundle Identifier
   - 设置为唯一标识符，如 `com.zhipu.balance`

2. **设置团队**：
   - 在 "Signing & Capabilities" 中
   - 选择你的开发团队（需要 Apple Developer 账号）

3. **选择目标设备**：
   - 任何 iOS 设备

4. **运行**：
   - 点击 ▶️ 按钮或按 Cmd+R
   - 通过 USB 连接的 iPhone 上安装

#### 6. 发布到 App Store（可选）

1. 在 Xcode 中选择 "Product" → "Archive"
2. 在 Organizer 中选择 "Distribute App"
3. 按照步骤提交到 App Store Connect

---

## 方案三：原生 iOS App（最复杂）

### 技术栈
- SwiftUI
- UIKit
- Alamofire（网络请求）
- Charts（图表库）

### 项目结构

```
ZhipuBalance/
├── App/
│   ├── ZhipuBalanceApp.swift
│   ├── ContentView.swift
│   └── models/
│       ├── Balance.swift
│       └── ZhipuUsage.swift
├── Views/
│   ├── BalanceListView.swift
│   ├── ZhipuUsageView.swift
│   └── ChartView.swift
├── ViewModels/
│   ├── BalanceViewModel.swift
│   └── ZhipuUsageViewModel.swift
└── Services/
    └── APIService.swift
```

### 核心代码示例

**APIService.swift**：
```swift
import Alamofire

class APIService {
    static let shared = APIService()
    private let baseURL = "https://zhipu-balance-tracker-production.up.railway.app/api"

    func fetchBalances(completion: @escaping (Result<[Balance], Error>) -> Void) {
        AF.get("\(baseURL)/balance").responseDecodable(of: [Balance].self) { response in
            completion(result.map { $0.value })
        }
    }

    func fetchZhipuUsage(apiKey: String, region: String, completion: @escaping (Result<ZhipuUsageResponse, Error>) -> Void) {
        AF.post("\(baseURL)/balance/zhipu-usage",
                parameters: ["apiKey": apiKey, "region": "region"])
            .responseDecodable(of: ZhipuUsageResponse.self) { response in
                completion(result.map { $0.value })
            }
        }
}
```

### 需要的工具

- ✅ Mac 电脑
- ✅ Xcode（从 Mac App Store 免费下载）
- ✅ Apple Developer 账号（$99/年）

---

## 快速开始推荐

### 最快方式（5分钟）

使用 **PWA 方案**：

1. iPhone Safari 打开：https://zhipu-balance-tracker-production.up.railway.app
2. 点击分享按钮 → "添加到主屏幕"
3. 完成！

### 最佳体验（30分钟）

使用 **Capacitor 打包**：

1. 在电脑上执行上面 Capacitor 的安装步骤
2. 通过 Xcode 安装到 iPhone
3. 获得接近原生的体验

---

## 对比总结

| 特性 | PWA | Capacitor | 原生 |
|------|-----|-----------|------|
| 安装难度 | ⭐ | ⭐⭐ | ⭐⭐⭐ |
| 应用体验 | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 更新方式 | 自动 | 需重新打包 | 需审核 |
| 存储大小 | ~5MB | ~15MB | ~20MB |
| 推送通知 | ❌ | ✅ | ✅ |
| 开发成本 | 免费 | 免费 | $99/年 |

---

## 推荐选择

- **个人使用**：PWA 方案（免费、快速）
- **团队分享**：Capacitor 方案（可发布 App Store）
- **商业项目**：原生开发（最佳体验）

---

## 下一步

你想用哪个方案？我可以帮你：
1. 配置 PWA 元数据（更好看的图标、启动画面）
2. 设置 Capacitor 打包
3. 提供原生 App 的完整代码
