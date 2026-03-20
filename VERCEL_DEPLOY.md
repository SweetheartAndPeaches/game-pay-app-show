# Vercel 部署指南

## 部署步骤

### 1. 准备工作
确保项目代码已提交到 Git 仓库。

### 2. 在 Vercel 创建项目
1. 访问 [Vercel](https://vercel.com)
2. 点击 "Import Project"
3. 选择你的 Git 仓库
4. Vercel 会自动检测项目配置

### 3. 配置环境变量
在 Vercel 项目设置中添加环境变量：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `NVIDIA_API_KEY` | 你的NVIDIA API密钥 | Production, Preview |

**重要**: 不要将 API Key 硬编码在代码中！

### 4. 部署配置
项目已预配置：
- `vercel.json` - Vercel 部署配置
- `api/chat.js` - Serverless Function (Node.js)
- `build:vercel` - Vercel 构建脚本

### 5. 触发部署
- 推送代码到 main 分支会自动触发部署
- 或在 Vercel 控制台手动触发

## 文件结构

```
.
├── api/
│   └── chat.js          # Vercel Serverless Function (Node.js)
├── src/
│   ├── main.ts          # 前端入口
│   └── security.ts      # 安全防护
├── dist/                # 构建输出
├── vercel.json          # Vercel 配置
└── package.json
```

## API 端点

### POST /api/chat
AI 聊天接口

**请求体**:
```json
{
  "messages": [
    { "role": "user", "content": "你好" }
  ]
}
```

**响应**:
```json
{
  "content": "你好！欢迎来到9INR！🎉"
}
```

## 环境变量

| 变量 | 说明 | 是否必需 |
|------|------|---------|
| `NVIDIA_API_KEY` | NVIDIA API 密钥 | 是 |

## 常见问题

### Q: 部署后 AI 聊天不工作？
A: 检查 Vercel 环境变量中是否已配置 `NVIDIA_API_KEY`

### Q: 如何查看日志？
A: 在 Vercel 控制台 > 项目 > Deployments > 选择部署 > Logs

### Q: 如何重新部署？
A: 推送新代码到 Git 仓库，或点击 "Redeploy" 按钮

## 本地测试

```bash
# 安装依赖
pnpm install

# 创建 .env 文件
echo "NVIDIA_API_KEY=your_api_key_here" > .env

# 构建前端
pnpm run build:vercel

# 本地运行（需要安装 vercel cli）
npx vercel dev
```

## 安全说明

- API Key 存储在环境变量中，不会暴露到前端代码
- 前端有基础安全防护（禁用 F12、右键菜单等）
- API 有 CORS 保护

## 技术栈

- **前端**: Vite + TypeScript + Tailwind CSS
- **后端**: Vercel Serverless Functions (Node.js)
- **AI**: NVIDIA API (z-ai/glm5 模型)
- **部署**: Vercel
