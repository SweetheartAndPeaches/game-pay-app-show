# Vercel 部署指南

## 📋 部署前准备

### 1. 确保项目已推送到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. 安装 Vercel CLI（可选）

```bash
npm i -g vercel
```

---

## 🚀 方式一：通过 Vercel 网站部署（推荐）

### Step 1: 登录 Vercel

访问 [vercel.com](https://vercel.com)，使用 GitHub 账号登录。

### Step 2: 导入项目

1. 点击 **"Add New..."** → **"Project"**
2. 选择你的 GitHub 仓库
3. 点击 **"Import"**

### Step 3: 配置项目

| 配置项 | 值 |
|--------|------|
| **Framework Preset** | Other |
| **Root Directory** | `./` |
| **Build Command** | `pnpm run build:vercel` |
| **Output Directory** | `dist` |
| **Install Command** | `pnpm install` |

### Step 4: 配置环境变量

在 **"Environment Variables"** 部分添加：

| 变量名 | 值 |
|--------|------|
| `NVIDIA_API_KEY` | `nvapi-xxx`（你的 API Key） |

### Step 5: 部署

点击 **"Deploy"**，等待部署完成。

---

## 🖥️ 方式二：通过 CLI 部署

```bash
# 登录 Vercel
vercel login

# 部署到生产环境
vercel --prod

# 设置环境变量
vercel env add NVIDIA_API_KEY
# 粘贴你的 API Key，选择 Production
```

---

## ⚙️ 项目结构说明

```
.
├── api/                  # Vercel Serverless Functions
│   └── chat.ts          # AI 聊天 API
├── dist/                 # Vite 构建输出（静态文件）
├── src/                  # 前端源码
├── vercel.json          # Vercel 配置
└── package.json
```

---

## 🔧 常见问题

### Q: 部署后 API 返回 500 错误？

**A:** 检查环境变量是否正确配置：
1. 进入 Vercel Dashboard
2. 选择项目 → Settings → Environment Variables
3. 确认 `NVIDIA_API_KEY` 已添加且值正确

### Q: 页面刷新后显示 404？

**A:** 检查 `vercel.json` 中的 rewrites 配置是否正确。

### Q: 如何查看部署日志？

**A:** 
1. Vercel Dashboard → 项目 → Deployments
2. 点击具体部署 → 查看 Build Logs 和 Runtime Logs

### Q: 如何更新部署？

**A:** 推送新代码到 GitHub，Vercel 会自动触发重新部署。

---

## 📝 部署后检查清单

- [ ] 网站可以正常访问
- [ ] AI 聊天功能正常
- [ ] 下载功能正常
- [ ] 环境变量已配置
- [ ] 自定义域名已绑定（如需要）

---

## 🌐 自定义域名

1. Vercel Dashboard → 项目 → Settings → Domains
2. 添加你的域名
3. 按照提示配置 DNS 记录

---

## 💡 提示

- **免费额度**：Vercel 免费套餐每月有 100GB 带宽和无限次部署
- **冷启动**：Serverless Functions 首次调用可能有冷启动延迟
- **日志**：使用 `console.log` 可以在 Vercel 日志中查看输出
