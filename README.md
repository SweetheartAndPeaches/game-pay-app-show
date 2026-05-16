# 9INR App Download Page

## 项目简介 | Project Overview | परियोजना अवलोकन

### 中文
这是一个 9INR 软件下载推广页面，黑色背景搭配金黄色主题，包含 App 图标展示、下载功能、佣金体系、收益排行榜和 AI 客服。

### English
This is a 9INR software download promotion page with a black background with golden theme, featuring app icon display, download function, commission system, earnings leaderboard, and AI customer service.

### हिंदी
यह 9INR सॉफ्टवेयर डाउनलोड प्रोमोशन पेज है जिसमें काला बैकग्राउंड और सुनहरा थीम है, जिसमें ऐप आइकॉन डिस्प्ले, डाउनलोड फ़ंक्शन, कमीशन सिस्टम, कमाई लीडरबोर्ड और AI कस्टमर सर्विस शामिल है।

---

## 核心功能 | Key Features | मुख्य विशेषताएं

### 1. App 图标展示 | App Icon Display | ऐप आइकॉन डिस्प्ले
- 精美的 App 图标展示
- 黑色背景配合金色边框动画
- 吸引用户眼球

### 2. 下载功能 | Download Function | डाउनलोड फ़ंक्शन
- 直接 APK 下载链接
- 下载频率限制（每小时3次，间隔10秒）
- 安全防护（禁用右键、F12、开发者工具）

### 3. 佣金体系 | Commission System | कमीशन सिस्टम
- 一级佣金：1.8% + 0.2%（最高0.2%）
- 二级佣金：1.6% + 0.1%（最高0.1%）
- 三级佣金：1.4%
- 一级佣金可提现，二级仅显示

### 4. 收益排行榜 | Earnings Leaderboard | कमाई लीडरबोर्ड
- 展示Top 5 收益用户
- 金色头像和数字动画效果
- 激励用户推广

### 5. AI 客服 | AI Customer Service | AI कस्टमर सर्विस
- Raju 智能助手
- 支持 Hindi/English 双语
- 7x24 在线解答

### 6. 佣金通知系统 | Commission Notification System | कमीशन नोटिफिकेशन सिस्टम
- 实时佣金通知弹窗
- 随机佣金通知
- 吸引注意

---

## 技术栈 | Tech Stack | टेक स्टैक

| 技术 | Technology | तकनीक |
|------|------------|--------|
| 框架 | Framework | फ्रेमवर्क | Next.js 16 (App Router) |
| 核心 | Core | कोर | React 19 |
| 语言 | Language | भाषा | TypeScript 5 |
| UI组件 | UI Components | UI कंपोनेंट्स | shadcn/ui (Radix UI) |
| 样式 | Styling | स्टाइलिंग | Tailwind CSS 4 |
| 背景动画 | Background Animation | बैकग्राउंड एनिमेशन | Canvas 2D API |
| AI对话 | AI Chat | AI चैट | NVIDIA API (z-ai/glm5) |
| 包管理 | Package Manager | पैकेज मैनेजर | pnpm |

---

## 文件说明 | File Structure | फ़ाइल स्ट्रक्चर

```
src/
├── app/
│   ├── page.tsx              # 首页 | Home Page | होम पेज
│   ├── layout.tsx            # 根布局 | Root Layout | रूट लेआउट
│   ├── globals.css           # 全局样式 | Global Styles | ग्लोबल स्टाइल्स
│   └── api/
│       ├── chat/route.ts    # AI聊天 API | AI Chat API | AI चैट API
│       └── video/route.ts   # 视频生成 API | Video Generate API | वीडियो जनरेट API
├── components/
│   ├── TriangleBackground.tsx  # 粒子背景 | Particle Background | पार्टिकल बैकग्राउंड
│   ├── ChatWidget.tsx        # AI客服组件 | AI Customer Service | AI कस्टमर सर्विस
│   ├── CommissionNotification.tsx # 佣金通知 | Commission Notification | कमीशन नोटिफिकेशन
│   ├── VideoModal.tsx         # 视频弹窗（已移除）| Video Modal (Removed) | वीडियो मॉडल (हटा दिया)
│   └── ui/                   # shadcn/ui 组件库 | Component Library | कंपोनेंट लाइब्रेरी
├── hooks/
│   └── useSecurity.ts         # 安全防护 | Security Protection | सुरक्षा सुरक्षा
└── lib/
    └── utils.ts               # 工具函数 | Utility Functions | यूटिलिटी फ़ंक्शंस
```

---

## 部署说明 | Deployment Guide | डिप्लॉयमेंट गाइड

### 开发环境 | Development Environment | डेवलपमेंट एनवायरमेंट

```bash
# 安装依赖 | Install Dependencies | डिपेंडेंसी इंस्टॉल करें
pnpm install

# 启动开发服务器 | Start Dev Server | डेव सर्वर शुरू करें
pnpm dev

# 构建 | Build | बिल्ड करें
pnpm build
```

### 宝塔面板部署 | Baota Panel Deployment | बाओता पैनल डिप्लॉयमेंट

详见 `BAOTA_DEPLOY.md` 文件。

### Vercel 部署 | Vercel Deployment | Vercel डिप्लॉयमेंट

直接连接 GitHub 仓库自动部署。

---

## 下载链接 | Download Link | डाउनलोड लिंक

- APK: `https://d1lpd5tr8ui3gv.cloudfront.net/web/9inr/9inr.apk`

---

## 环境变量 | Environment Variables | एनवायरमेंट वेरिएबल्स

| 变量名 | Variable Name | वेरिएबल नाम | 说明 | Description | विवरण |
|--------|---------------|----------------|------|-------------|--------|
| NVIDIA_API_KEY | NVIDIA API Key | NVIDIA API की | AI对话API密钥 | AI Chat API Key | AI चैट API की |

---

## 重要提示 | Important Notes | महत्वपूर्ण नोट्स

1. 必须使用 pnpm 作为包管理器
2. 使用 Node.js 20+
3. 开发端口必须使用 5000

---

© 2024 9INR Team
