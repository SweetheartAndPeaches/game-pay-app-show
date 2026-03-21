# 宝塔面板部署指南

## 一、环境要求

### 1. 安装 Node.js
在宝塔面板 → 软件商店 → 搜索 `PM2管理器` 并安装
- 会自动安装 Node.js 环境
- 确保 Node.js 版本 >= 18

### 2. 安装 pnpm
```bash
npm install -g pnpm
```

---

## 二、上传代码

### 方式1: Git 克隆（推荐）
```bash
cd /www/wwwroot
git clone https://github.com/SweetheartAndPeaches/game-pay-app-show.git 9inr
cd 9inr
```

### 方式2: 上传压缩包
1. 在 GitHub 下载项目压缩包
2. 宝塔面板 → 文件 → 上传到 `/www/wwwroot/9inr`
3. 解压

---

## 三、安装依赖

```bash
cd /www/wwwroot/9inr
pnpm install
```

---

## 四、配置环境变量

创建 `.env` 文件：
```bash
cd /www/wwwroot/9inr
nano .env
```

输入以下内容：
```
NVIDIA_API_KEY=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
```

按 `Ctrl+O` 保存，`Ctrl+X` 退出。

---

## 五、构建项目

```bash
cd /www/wwwroot/9inr
pnpm run build
```

构建完成后会生成 `.next` 目录。

---

## 六、PM2 启动项目

### 1. 创建 PM2 配置文件
```bash
cd /www/wwwroot/9inr
nano ecosystem.config.js
```

输入以下内容：
```javascript
module.exports = {
  apps: [{
    name: '9inr',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 5000',
    cwd: '/www/wwwroot/9inr',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
```

### 2. 启动项目
```bash
pm2 start ecosystem.config.js
pm2 save
```

### 3. 设置开机自启
```bash
pm2 startup
```

### 4. 常用命令
```bash
pm2 list          # 查看所有进程
pm2 logs 9inr     # 查看日志
pm2 restart 9inr  # 重启
pm2 stop 9inr     # 停止
pm2 delete 9inr   # 删除
```

---

## 七、Nginx 反向代理配置

### 1. 宝塔创建网站
- 宝塔面板 → 网站 → 添加站点
- 域名：填写你的域名（如 `9inr.example.com`）
- PHP版本：纯静态
- 创建数据库：否

### 2. 配置 Nginx 反向代理
点击网站设置 → 反向代理 → 添加反向代理：
- 代理名称：`9inr`
- 目标URL：`http://127.0.0.1:5000`
- 发送域名：`$host`

### 3. 手动配置（如果反向代理不生效）
点击网站设置 → 配置文件，在 `server {}` 内添加：

```nginx
location / {
    proxy_pass http://127.0.0.1:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 300s;
    proxy_connect_timeout 75s;
}
```

---

## 八、配置 SSL 证书（可选）

1. 宝塔面板 → 网站 → 点击域名 → SSL
2. 选择 Let's Encrypt 免费证书
3. 点击申请
4. 开启强制 HTTPS

---

## 九、防火墙设置

确保 5000 端口不需要对外开放（仅本地访问）：
- 宝塔面板 → 安全
- 只放行 80 (HTTP) 和 443 (HTTPS)

---

## 十、更新部署

```bash
cd /www/wwwroot/9inr
git pull origin main
pnpm install
pnpm run build
pm2 restart 9inr
```

---

## 常见问题

### Q: 启动失败，提示端口被占用？
```bash
# 查看端口占用
netstat -tlnp | grep 5000
# 杀掉进程
kill -9 <PID>
# 重启
pm2 restart 9inr
```

### Q: 页面无法访问？
1. 检查 PM2 是否运行：`pm2 list`
2. 检查端口是否监听：`netstat -tlnp | grep 5000`
3. 检查防火墙设置
4. 查看 PM2 日志：`pm2 logs 9inr`

### Q: API 调用失败？
检查 `.env` 文件是否正确配置 `NVIDIA_API_KEY`

---

## 项目结构

```
/www/wwwroot/9inr/
├── .env                 # 环境变量
├── ecosystem.config.js  # PM2 配置
├── .next/               # 构建输出
├── public/              # 静态资源
├── src/                 # 源代码
├── package.json
└── pnpm-lock.yaml
```
