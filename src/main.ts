// ===== Triangle Particle Animation =====
interface TriangleParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

let animationFrameId: number | null = null;

function initBackgroundAnimation(): void {
  const canvas = document.getElementById('bg-canvas') as HTMLCanvasElement;
  
  if (!canvas) {
    console.error('Canvas element not found!');
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Canvas context not available!');
    return;
  }

  console.log('=== 9INR Triangle Animation Started ===');

  let particles: TriangleParticle[] = [];
  let particleCount = 0;

  // Resize canvas and recalculate particles
  function resizeCanvas(): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    particleCount = Math.floor((canvas.width * canvas.height) / 8000);
    
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 3 + Math.random() * 8,
        speedY: -(0.2 + Math.random() * 0.8),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: 0.1 + Math.random() * 0.6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      });
    }
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function drawTriangle(x: number, y: number, size: number, rotation: number, opacity: number): void {
    if (!ctx) return;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(-size * 0.6, size * 0.6);
    ctx.lineTo(size * 0.6, size * 0.6);
    ctx.closePath();

    ctx.shadowColor = 'rgba(255, 215, 0, 1)';
    ctx.shadowBlur = 20;
    ctx.fillStyle = `rgba(255, 215, 0, ${opacity})`;
    ctx.fill();

    ctx.restore();
  }

  function animate(): void {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      if (p.y < -20) {
        p.y = canvas.height + 20;
        p.x = Math.random() * canvas.width;
      }

      drawTriangle(p.x, p.y, p.size, p.rotation, p.opacity);
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();
}

// ===== Download Handler =====
function handleDownload(platform: string): void {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4';
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };

  modal.innerHTML = `
    <div class="bg-gray-900 rounded-3xl p-8 max-w-md w-full border border-yellow-400/30 shadow-2xl">
      <div class="text-center">
        <img 
          src="https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E7%94%BB%E6%9D%BF+1.png&nonce=6d3f72c8-f4f7-4ad9-bcc3-823fd80794f8&project_id=7619222010605879330&sign=5dae79049555ccd18cf6790ff76b33e7f16dd8c15328fb199be74d824d53a75f"
          alt="9INR"
          class="w-20 h-20 rounded-2xl mx-auto mb-4 object-cover"
        />
        <h3 class="text-2xl font-bold text-white mb-2">9INR डाउनलोड करें</h3>
        <p class="text-gray-400 mb-6">आपका डाउनलोड शुरू हो रहा है...</p>
        
        <div class="bg-white/5 rounded-xl p-4 mb-6">
          <div class="flex items-center justify-center gap-2 text-yellow-400 mb-2">
            <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span class="font-medium">डाउनलोड हो रहा है...</span>
          </div>
          <div class="w-full bg-gray-700 rounded-full h-2">
            <div class="bg-yellow-400 h-2 rounded-full transition-all duration-1000" style="width: 0%" id="progress-bar"></div>
          </div>
        </div>
        
        <button class="text-gray-400 hover:text-white transition-colors close-modal">
          बंद करें
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.querySelector('.close-modal')?.addEventListener('click', () => modal.remove());

  const progressBar = document.getElementById('progress-bar');
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    if (progressBar) progressBar.style.width = progress + '%';
    if (progress >= 100) clearInterval(interval);
  }, 200);
}

// ===== Main App Initialization =====
export function initApp(): void {
  const app = document.getElementById('app');

  if (!app) {
    console.error('App element not found');
    return;
  }

  app.innerHTML = `
    <!-- Background Animation Canvas -->
    <canvas id="bg-canvas" class="fixed inset-0 w-full h-full" style="z-index: 0; pointer-events: none;"></canvas>

    <div class="content-wrapper min-h-screen flex flex-col" style="background: linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.95) 100%);">
      
      <!-- Header -->
      <header class="w-full py-4 px-4 sm:px-8 sticky top-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/5">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img 
              src="https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E7%94%BB%E6%9D%BF+1.png&nonce=6d3f72c8-f4f7-4ad9-bcc3-823fd80794f8&project_id=7619222010605879330&sign=5dae79049555ccd18cf6790ff76b33e7f16dd8c15328fb199be74d824d53a75f"
              alt="9INR"
              class="w-10 h-10 rounded-xl object-cover"
            />
            <span class="text-white font-bold text-xl">9INR</span>
            <span class="hidden sm:inline-block bg-yellow-400/20 text-yellow-400 text-xs px-2 py-1 rounded-full">任务赚钱平台</span>
          </div>
          <div class="flex items-center gap-4">
            <nav class="hidden md:flex items-center gap-6">
              <a href="#commission" class="text-gray-300 hover:text-yellow-400 transition-colors text-sm">三级分销</a>
              <a href="#tasks" class="text-gray-300 hover:text-yellow-400 transition-colors text-sm">任务系统</a>
              <a href="#calculator" class="text-gray-300 hover:text-yellow-400 transition-colors text-sm">收益计算</a>
            </nav>
            <button 
              id="download-btn-header"
              class="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 text-sm"
            >
              立即下载
            </button>
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <main class="flex-1">
        
        <!-- Hero Banner -->
        <section class="w-full py-16 sm:py-24 px-4">
          <div class="max-w-7xl mx-auto">
            <div class="flex flex-col lg:flex-row items-center gap-12">
              <!-- Left Content -->
              <div class="flex-1 text-center lg:text-left">
                <div class="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-2 mb-6">
                  <span class="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                  <span class="text-yellow-400 text-sm font-medium">三级分销 · 躺赚佣金</span>
                </div>
                
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                  邀请好友<br/>
                  <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">躺赚三级佣金</span>
                </h1>
                
                <p class="text-lg sm:text-xl text-gray-300 mb-8 max-w-xl">
                  做任务赚钱，邀请好友赚佣金！三级分销体系，你的朋友做任务，你也有收益！
                </p>
                
                <div class="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <button 
                    id="download-btn-hero"
                    class="group flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-400/20"
                  >
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.523 15.341c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9m-11.046 0c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9m11.4-6.02l1.97-3.41a.41.41 0 00-.71-.41l-2 3.46c-1.54-.7-3.26-1.09-5.14-1.09s-3.6.39-5.14 1.09l-2-3.46a.41.41 0 00-.71.41l1.97 3.41C2.69 11.08.34 14.53 0 18.5h24c-.34-3.97-2.69-7.42-6.12-9.18"/>
                    </svg>
                    <span>下载APP开始赚钱</span>
                  </button>
                  
                  <button class="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                    <div class="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-yellow-400/50 transition-colors">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <span>观看介绍视频</span>
                  </button>
                </div>
                
                <!-- Stats -->
                <div class="flex items-center gap-8 mt-12 justify-center lg:justify-start">
                  <div class="text-center">
                    <div class="text-3xl font-black text-yellow-400">10M+</div>
                    <div class="text-gray-500 text-sm">下载量</div>
                  </div>
                  <div class="w-px h-10 bg-white/10"></div>
                  <div class="text-center">
                    <div class="text-3xl font-black text-yellow-400">4.8</div>
                    <div class="text-gray-500 text-sm">用户评分</div>
                  </div>
                  <div class="w-px h-10 bg-white/10"></div>
                  <div class="text-center">
                    <div class="text-3xl font-black text-yellow-400">₹50K+</div>
                    <div class="text-gray-500 text-sm">日均佣金</div>
                  </div>
                </div>
              </div>
              
              <!-- Right - App Preview -->
              <div class="flex-1 flex justify-center">
                <div class="relative">
                  <div class="w-64 h-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10" style="animation: float 3s ease-in-out infinite;">
                    <img 
                      src="https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E7%94%BB%E6%9D%BF+1.png&nonce=6d3f72c8-f4f7-4ad9-bcc3-823fd80794f8&project_id=7619222010605879330&sign=5dae79049555ccd18cf6790ff76b33e7f16dd8c15328fb199be74d824d53a75f"
                      alt="9INR App"
                      class="w-full h-auto"
                    />
                  </div>
                  <!-- Glow -->
                  <div class="absolute inset-0 w-64 h-full rounded-3xl bg-yellow-400 opacity-10 blur-3xl -z-10"></div>
                  
                  <!-- Floating Badge -->
                  <div class="absolute -right-4 top-1/4 bg-green-500 text-white text-sm font-bold py-2 px-4 rounded-full shadow-lg" style="animation: float 2s ease-in-out infinite 0.5s;">
                    +₹1000 今日佣金
                  </div>
                  <div class="absolute -left-4 bottom-1/4 bg-yellow-500 text-black text-sm font-bold py-2 px-4 rounded-full shadow-lg" style="animation: float 2s ease-in-out infinite 1s;">
                    三级分成
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Commission System Section -->
        <section id="commission" class="w-full py-16 px-4 bg-gradient-to-b from-transparent via-yellow-400/5 to-transparent">
          <div class="max-w-7xl mx-auto">
            <div class="text-center mb-12">
              <h2 class="text-3xl sm:text-4xl font-black text-white mb-4">
                三级分销 <span class="text-yellow-400">佣金体系</span>
              </h2>
              <p class="text-gray-400 max-w-2xl mx-auto">
                邀请好友加入，享受三级佣金分成。你的下级网络越活跃，你的被动收入越多！
              </p>
            </div>
            
            <!-- Commission Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <!-- Level 1 -->
              <div class="relative bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 rounded-3xl p-6 border border-yellow-400/30 overflow-hidden group hover:border-yellow-400/50 transition-all">
                <div class="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl"></div>
                <div class="relative">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-12 h-12 rounded-xl bg-yellow-400 flex items-center justify-center">
                      <span class="text-black font-black text-xl">1</span>
                    </div>
                    <div>
                      <div class="text-white font-bold">一级代理</div>
                      <div class="text-gray-400 text-sm">直接推荐</div>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <span class="text-gray-300">代收任务佣金</span>
                      <span class="text-yellow-400 font-black text-2xl">1.0%</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-300">代付任务佣金</span>
                      <span class="text-yellow-400 font-black text-2xl">0.8%</span>
                    </div>
                  </div>
                  <div class="mt-4 pt-4 border-t border-white/10">
                    <div class="text-sm text-gray-400">例：1000元任务赚</div>
                    <div class="text-yellow-400 font-bold text-lg">₹10</div>
                  </div>
                </div>
              </div>
              
              <!-- Level 2 -->
              <div class="relative bg-gradient-to-br from-green-400/20 to-green-600/10 rounded-3xl p-6 border border-green-400/30 overflow-hidden group hover:border-green-400/50 transition-all">
                <div class="absolute top-0 right-0 w-32 h-32 bg-green-400/10 rounded-full blur-3xl"></div>
                <div class="relative">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-12 h-12 rounded-xl bg-green-400 flex items-center justify-center">
                      <span class="text-black font-black text-xl">2</span>
                    </div>
                    <div>
                      <div class="text-white font-bold">二级代理</div>
                      <div class="text-gray-400 text-sm">间接推荐</div>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <span class="text-gray-300">代收任务佣金</span>
                      <span class="text-green-400 font-black text-2xl">0.5%</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-300">代付任务佣金</span>
                      <span class="text-green-400 font-black text-2xl">0.4%</span>
                    </div>
                  </div>
                  <div class="mt-4 pt-4 border-t border-white/10">
                    <div class="text-sm text-gray-400">例：1000元任务赚</div>
                    <div class="text-green-400 font-bold text-lg">₹5</div>
                  </div>
                </div>
              </div>
              
              <!-- Level 3 -->
              <div class="relative bg-gradient-to-br from-blue-400/20 to-blue-600/10 rounded-3xl p-6 border border-blue-400/30 overflow-hidden group hover:border-blue-400/50 transition-all">
                <div class="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"></div>
                <div class="relative">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-12 h-12 rounded-xl bg-blue-400 flex items-center justify-center">
                      <span class="text-black font-black text-xl">3</span>
                    </div>
                    <div>
                      <div class="text-white font-bold">三级代理</div>
                      <div class="text-gray-400 text-sm">再间接推荐</div>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <span class="text-gray-300">代收任务佣金</span>
                      <span class="text-blue-400 font-black text-2xl">0.3%</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-300">代付任务佣金</span>
                      <span class="text-blue-400 font-black text-2xl">0.2%</span>
                    </div>
                  </div>
                  <div class="mt-4 pt-4 border-t border-white/10">
                    <div class="text-sm text-gray-400">例：1000元任务赚</div>
                    <div class="text-blue-400 font-bold text-lg">₹3</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Example -->
            <div class="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
                  <span class="text-2xl">💡</span>
                </div>
                <div>
                  <h4 class="text-white font-bold mb-2">收益示例</h4>
                  <p class="text-gray-300 text-sm leading-relaxed">
                    你推荐了 <span class="text-yellow-400 font-bold">A</span>，A推荐了 <span class="text-green-400 font-bold">B</span>，B推荐了 <span class="text-blue-400 font-bold">C</span><br/>
                    • A做了1000元代收任务 → 你赚 <span class="text-yellow-400 font-bold">₹10</span><br/>
                    • B做了1000元代收任务 → 你赚 <span class="text-green-400 font-bold">₹5</span><br/>
                    • C做了1000元代收任务 → 你赚 <span class="text-blue-400 font-bold">₹3</span><br/>
                    <span class="text-white font-medium">躺赚模式：只要你的下级网络在活跃，你每天都在赚取佣金！</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Task System Section -->
        <section id="tasks" class="w-full py-16 px-4">
          <div class="max-w-7xl mx-auto">
            <div class="text-center mb-12">
              <h2 class="text-3xl sm:text-4xl font-black text-white mb-4">
                双向任务 <span class="text-yellow-400">轻松赚钱</span>
              </h2>
              <p class="text-gray-400 max-w-2xl mx-auto">
                简单任务，30分钟内完成。代收代付双向选择，灵活赚钱！
              </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- 代收任务 -->
              <div class="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-3xl p-8 border border-green-500/20 hover:border-green-500/40 transition-all">
                <div class="flex items-center gap-4 mb-6">
                  <div class="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center">
                    <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-2xl font-bold text-white">代收任务</h3>
                    <p class="text-green-400">收款并确认</p>
                  </div>
                </div>
                <div class="space-y-4">
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span class="text-gray-300">接收付款到指定账户</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span class="text-gray-300">确认收款并截图上传</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span class="text-gray-300">获得任务奖励 + 佣金分成</span>
                  </div>
                </div>
                <div class="mt-6 pt-6 border-t border-white/10">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-400">预计收益</span>
                    <span class="text-green-400 font-bold text-xl">每单 +1%~2%</span>
                  </div>
                </div>
              </div>
              
              <!-- 代付任务 -->
              <div class="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-3xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all">
                <div class="flex items-center gap-4 mb-6">
                  <div class="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                    <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-2xl font-bold text-white">代付任务</h3>
                    <p class="text-blue-400">付款给指定账户</p>
                  </div>
                </div>
                <div class="space-y-4">
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span class="text-gray-300">按要求付款到指定账户</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span class="text-gray-300">上传付款截图</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span class="text-gray-300">获得任务奖励 + 佣金分成</span>
                  </div>
                </div>
                <div class="mt-6 pt-6 border-t border-white/10">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-400">预计收益</span>
                    <span class="text-blue-400 font-bold text-xl">每单 +0.8%~1.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Calculator Section -->
        <section id="calculator" class="w-full py-16 px-4 bg-gradient-to-b from-transparent via-yellow-400/5 to-transparent">
          <div class="max-w-4xl mx-auto">
            <div class="text-center mb-12">
              <h2 class="text-3xl sm:text-4xl font-black text-white mb-4">
                收益 <span class="text-yellow-400">计算器</span>
              </h2>
              <p class="text-gray-400">看看你的代理网络能带来多少被动收入</p>
            </div>
            
            <div class="bg-white/5 rounded-3xl p-8 border border-white/10">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div>
                  <label class="block text-gray-400 text-sm mb-2">一级代理人数</label>
                  <input type="number" id="level1-count" value="10" min="0" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xl font-bold focus:border-yellow-400/50 focus:outline-none" />
                </div>
                <div>
                  <label class="block text-gray-400 text-sm mb-2">每人每天任务额 (₹)</label>
                  <input type="number" id="daily-task" value="100" min="0" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xl font-bold focus:border-yellow-400/50 focus:outline-none" />
                </div>
                <div>
                  <label class="block text-gray-400 text-sm mb-2">邀请倍数</label>
                  <input type="number" id="invite-multiplier" value="10" min="0" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xl font-bold focus:border-yellow-400/50 focus:outline-none" />
                </div>
              </div>
              
              <button id="calculate-btn" class="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] mb-8">
                计算我的收益
              </button>
              
              <!-- Results -->
              <div id="calc-results" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="bg-yellow-400/10 rounded-xl p-4 border border-yellow-400/20">
                  <div class="text-gray-400 text-sm mb-1">你的代理网络</div>
                  <div class="text-yellow-400 font-black text-3xl" id="network-count">1,110 人</div>
                  <div class="text-gray-500 text-xs">10 + 100 + 1000</div>
                </div>
                <div class="bg-green-400/10 rounded-xl p-4 border border-green-400/20">
                  <div class="text-gray-400 text-sm mb-1">每日佣金</div>
                  <div class="text-green-400 font-black text-3xl" id="daily-income">₹360</div>
                  <div class="text-gray-500 text-xs">被动收入</div>
                </div>
                <div class="bg-blue-400/10 rounded-xl p-4 border border-blue-400/20">
                  <div class="text-gray-400 text-sm mb-1">每月佣金</div>
                  <div class="text-blue-400 font-black text-3xl" id="monthly-income">₹10,800</div>
                  <div class="text-gray-500 text-xs">30天计算</div>
                </div>
                <div class="bg-purple-400/10 rounded-xl p-4 border border-purple-400/20">
                  <div class="text-gray-400 text-sm mb-1">每年佣金</div>
                  <div class="text-purple-400 font-black text-3xl" id="yearly-income">₹131,400</div>
                  <div class="text-gray-500 text-xs">365天计算</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Languages Section -->
        <section class="w-full py-16 px-4">
          <div class="max-w-7xl mx-auto text-center">
            <h2 class="text-2xl sm:text-3xl font-black text-white mb-8">
              全球适用 · <span class="text-yellow-400">8种语言</span>
            </h2>
            <div class="flex flex-wrap justify-center gap-4">
              <div class="bg-white/5 rounded-xl px-4 py-2 border border-white/10 hover:border-yellow-400/30 transition-colors">
                <span class="text-2xl mr-2">🇮🇳</span>
                <span class="text-white">हिन्दी</span>
              </div>
              <div class="bg-white/5 rounded-xl px-4 py-2 border border-white/10 hover:border-yellow-400/30 transition-colors">
                <span class="text-2xl mr-2">🇨🇳</span>
                <span class="text-white">简体中文</span>
              </div>
              <div class="bg-white/5 rounded-xl px-4 py-2 border border-white/10 hover:border-yellow-400/30 transition-colors">
                <span class="text-2xl mr-2">🇺🇸</span>
                <span class="text-white">English</span>
              </div>
              <div class="bg-white/5 rounded-xl px-4 py-2 border border-white/10 hover:border-yellow-400/30 transition-colors">
                <span class="text-2xl mr-2">🇯🇵</span>
                <span class="text-white">日本語</span>
              </div>
              <div class="bg-white/5 rounded-xl px-4 py-2 border border-white/10 hover:border-yellow-400/30 transition-colors">
                <span class="text-2xl mr-2">🇰🇷</span>
                <span class="text-white">한국어</span>
              </div>
              <div class="bg-white/5 rounded-xl px-4 py-2 border border-white/10 hover:border-yellow-400/30 transition-colors">
                <span class="text-2xl mr-2">🇪🇸</span>
                <span class="text-white">Español</span>
              </div>
              <div class="bg-white/5 rounded-xl px-4 py-2 border border-white/10 hover:border-yellow-400/30 transition-colors">
                <span class="text-2xl mr-2">🇫🇷</span>
                <span class="text-white">Français</span>
              </div>
              <div class="bg-white/5 rounded-xl px-4 py-2 border border-white/10 hover:border-yellow-400/30 transition-colors">
                <span class="text-2xl mr-2">🇩🇪</span>
                <span class="text-white">Deutsch</span>
              </div>
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="w-full py-16 px-4">
          <div class="max-w-4xl mx-auto">
            <div class="bg-gradient-to-r from-yellow-400/20 via-yellow-500/10 to-yellow-400/20 rounded-3xl p-8 sm:p-12 border border-yellow-400/30 text-center">
              <h2 class="text-3xl sm:text-4xl font-black text-white mb-4">
                开启你的被动收入之旅
              </h2>
              <p class="text-gray-300 mb-8 max-w-2xl mx-auto">
                立即下载9INR，输入邀请码开始赚钱。邀请好友，享受三级佣金分成！
              </p>
              <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  id="download-btn-cta"
                  class="flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-400/30"
                >
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.523 15.341c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9m-11.046 0c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9m11.4-6.02l1.97-3.41a.41.41 0 00-.71-.41l-2 3.46c-1.54-.7-3.26-1.09-5.14-1.09s-3.6.39-5.14 1.09l-2-3.46a.41.41 0 00-.71.41l1.97 3.41C2.69 11.08.34 14.53 0 18.5h24c-.34-3.97-2.69-7.42-6.12-9.18"/>
                  </svg>
                  <span>立即下载APP</span>
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      <!-- Footer -->
      <footer class="w-full py-8 px-4 border-t border-white/10">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-2">
              <img 
                src="https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E7%94%BB%E6%9D%BF+1.png&nonce=6d3f72c8-f4f7-4ad9-bcc3-823fd80794f8&project_id=7619222010605879330&sign=5dae79049555ccd18cf6790ff76b33e7f16dd8c15328fb199be74d824d53a75f"
                alt="9INR"
                class="w-8 h-8 rounded-lg object-cover"
              />
              <span class="text-white font-bold">9INR.VIP</span>
            </div>
            <div class="flex items-center gap-6 text-gray-400 text-sm">
              <a href="#" class="hover:text-yellow-400 transition-colors">隐私政策</a>
              <a href="#" class="hover:text-yellow-400 transition-colors">服务条款</a>
              <a href="#" class="hover:text-yellow-400 transition-colors">联系我们</a>
            </div>
            <div class="text-gray-500 text-sm">
              © 2024 9INR. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  `;

  // Initialize background animation
  initBackgroundAnimation();

  // Setup download button handlers
  document.getElementById('download-btn-header')?.addEventListener('click', () => handleDownload('android'));
  document.getElementById('download-btn-hero')?.addEventListener('click', () => handleDownload('android'));
  document.getElementById('download-btn-cta')?.addEventListener('click', () => handleDownload('android'));

  // Calculator functionality
  document.getElementById('calculate-btn')?.addEventListener('click', () => {
    const level1 = parseInt((document.getElementById('level1-count') as HTMLInputElement)?.value || '0');
    const dailyTask = parseInt((document.getElementById('daily-task') as HTMLInputElement)?.value || '0');
    const multiplier = parseInt((document.getElementById('invite-multiplier') as HTMLInputElement)?.value || '0');
    
    const level2 = level1 * multiplier;
    const level3 = level2 * multiplier;
    const network = level1 + level2 + level3;
    
    // Daily income: Level1 * 1% + Level2 * 0.5% + Level3 * 0.3%
    const dailyIncome = (level1 * dailyTask * 0.01) + (level2 * dailyTask * 0.005) + (level3 * dailyTask * 0.003);
    const monthlyIncome = dailyIncome * 30;
    const yearlyIncome = dailyIncome * 365;
    
    (document.getElementById('network-count') as HTMLElement).textContent = network.toLocaleString() + ' 人';
    (document.getElementById('daily-income') as HTMLElement).textContent = '₹' + Math.round(dailyIncome).toLocaleString();
    (document.getElementById('monthly-income') as HTMLElement).textContent = '₹' + Math.round(monthlyIncome).toLocaleString();
    (document.getElementById('yearly-income') as HTMLElement).textContent = '₹' + Math.round(yearlyIncome).toLocaleString();
  });
}
