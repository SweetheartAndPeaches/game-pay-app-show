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

function initBackgroundAnimation(): void {
  const canvas = document.getElementById('bg-canvas') as HTMLCanvasElement;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let particles: TriangleParticle[] = [];

  function resizeCanvas(): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particleCount = Math.floor((canvas.width * canvas.height) / 8000);
    
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

    // India Saffron color
    ctx.shadowColor = 'rgba(255, 153, 51, 1)';
    ctx.shadowBlur = 20;
    ctx.fillStyle = `rgba(255, 153, 51, ${opacity})`;
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

    requestAnimationFrame(animate);
  }

  animate();
}

// ===== Money Rain Effect =====
function initMoneyRain(): void {
  const container = document.getElementById('money-rain');
  if (!container) return;

  const symbols = ['₹', '💰', '💵', '💸'];
  
  setInterval(() => {
    const el = document.createElement('div');
    el.className = 'money-particle';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.animationDuration = (Math.random() * 3 + 4) + 's';
    el.style.opacity = String(Math.random() * 0.3 + 0.1);
    container.appendChild(el);
    
    setTimeout(() => el.remove(), 7000);
  }, 800);
}

// ===== Counter Animation =====
function animateCounter(target: number, duration: number = 2000): void {
  const el = document.getElementById('hero-counter');
  if (!el) return;
  
  let start = 0;
  const increment = target / (duration / 16);
  
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start).toLocaleString();
    }
  }, 16);
}

// ===== Calculator =====
function updateCalculation(): void {
  const friends = parseInt((document.getElementById('friends-slider') as HTMLInputElement)?.value || '10');
  const amount = parseInt((document.getElementById('amount-slider') as HTMLInputElement)?.value || '500');
  
  const friendsCount = document.getElementById('friends-count');
  const amountCount = document.getElementById('amount-count');
  const dailyIncome = document.getElementById('daily-income');
  const monthlyIncome = document.getElementById('monthly-income');
  const yearlyIncome = document.getElementById('yearly-income');
  
  if (friendsCount) friendsCount.textContent = String(friends);
  if (amountCount) amountCount.textContent = '₹' + amount;
  
  // L1 + L2 + L3 calculation
  const l1 = friends * amount * 0.01;
  const l2 = friends * 10 * amount * 0.005;
  const l3 = friends * 100 * amount * 0.003;
  const daily = l1 + l2 + l3;
  const monthly = daily * 30;
  const yearly = daily * 365;
  
  if (dailyIncome) dailyIncome.textContent = '₹' + Math.round(daily).toLocaleString();
  if (monthlyIncome) monthlyIncome.textContent = '₹' + Math.round(monthly).toLocaleString();
  if (yearlyIncome) yearlyIncome.textContent = '₹' + Math.round(yearly).toLocaleString();
}

// ===== Leaderboard =====
const names = ['Rahul K.', 'Priya S.', 'Amit V.', 'Neha G.', 'Vikram M.', 'Anjali R.', 'Suresh P.', 'Deepa N.'];
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Jaipur'];

function populateLeaderboard(): void {
  const container = document.getElementById('leaderboard');
  if (!container) return;
  
  const sorted = names.map((name, i) => ({
    name,
    city: cities[i],
    amount: Math.floor(Math.random() * 5000) + 2000
  })).sort((a, b) => b.amount - a.amount);
  
  container.innerHTML = sorted.map((user, index) => `
    <div class="p-4 flex justify-between items-center hover:bg-white/5 transition">
      <div class="flex items-center gap-4">
        <div class="w-8 h-8 rounded-full ${index === 0 ? 'bg-yellow-500 text-black' : index === 1 ? 'bg-gray-300 text-black' : index === 2 ? 'bg-orange-600' : 'bg-gray-700'} flex items-center justify-center font-bold text-sm">
          ${index + 1}
        </div>
        <div>
          <div class="font-bold text-white">${user.name}</div>
          <div class="text-xs text-gray-500">${user.city}</div>
        </div>
      </div>
      <div class="text-right">
        <div class="font-bold text-green-400">₹${user.amount.toLocaleString()}</div>
        <div class="text-xs text-gray-500">आज</div>
      </div>
    </div>
  `).join('');
}

// ===== Notifications =====
function showNotification(): void {
  const container = document.getElementById('notification-container');
  if (!container) return;
  
  const actions = ['ने कमाया', 'ने टास्क पूरा किया', 'ने दोस्त को इनवाइट किया'];
  const amounts = ['₹450', '₹1,200', '₹3,600', '₹890'];
  const name = names[Math.floor(Math.random() * names.length)];
  
  const notif = document.createElement('div');
  notif.className = 'glass rounded-lg p-3 text-sm transform translate-x-full transition-transform duration-500 flex items-center gap-3 shadow-lg border-l-2 border-green-500';
  notif.innerHTML = `
    <div class="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
      </svg>
    </div>
    <div>
      <div class="font-bold text-white text-xs">${name} ${actions[Math.floor(Math.random() * actions.length)]}</div>
      <div class="text-green-400 text-xs font-bold">${amounts[Math.floor(Math.random() * amounts.length)]}</div>
    </div>
  `;
  
  container.appendChild(notif);
  setTimeout(() => notif.classList.remove('translate-x-full'), 100);
  setTimeout(() => {
    notif.classList.add('translate-x-full');
    setTimeout(() => notif.remove(), 500);
  }, 4000);
}

// ===== Download Handler =====
function handleDownload(): void {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4';
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };

  modal.innerHTML = `
    <div class="bg-gray-900 rounded-3xl p-8 max-w-md w-full border border-orange-500/30 shadow-2xl">
      <div class="text-center">
        <img 
          src="https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E7%94%BB%E6%9D%BF+1.png&nonce=6d3f72c8-f4f7-4ad9-bcc3-823fd80794f8&project_id=7619222010605879330&sign=5dae79049555ccd18cf6790ff76b33e7f16dd8c15328fb199be74d824d53a75f"
          alt="9INR"
          class="w-20 h-20 rounded-2xl mx-auto mb-4 object-cover"
        />
        <h3 class="text-2xl font-bold text-white mb-2">9INR डाउनलोड करें</h3>
        <p class="text-gray-400 mb-6">आपका डाउनलोड शुरू हो रहा है...</p>
        
        <div class="bg-white/5 rounded-xl p-4 mb-6">
          <div class="flex items-center justify-center gap-2 text-orange-400 mb-2">
            <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span class="font-medium">डाउनलोड हो रहा है...</span>
          </div>
          <div class="w-full bg-gray-700 rounded-full h-2">
            <div class="bg-gradient-to-r from-orange-500 to-green-500 h-2 rounded-full transition-all duration-1000" style="width: 0%" id="progress-bar"></div>
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

// ===== Main App =====
export function initApp(): void {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <!-- Background Canvas -->
    <canvas id="bg-canvas" class="fixed inset-0 w-full h-full" style="z-index: 0; pointer-events: none;"></canvas>
    
    <!-- Money Rain -->
    <div id="money-rain" class="fixed inset-0 pointer-events-none overflow-hidden z-0"></div>

    <div class="relative z-10 min-h-screen">
      
      <!-- Language Switcher -->
      <div class="fixed top-4 right-4 z-50">
        <div class="glass rounded-full px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-white/10 transition">
          <span class="text-2xl">🇮🇳</span>
          <select class="bg-transparent border-none text-white text-sm focus:outline-none cursor-pointer">
            <option value="hi" class="text-black">हिन्दी</option>
            <option value="en" class="text-black">English</option>
            <option value="zh" class="text-black">中文</option>
          </select>
        </div>
      </div>

      <!-- Hero Section -->
      <section class="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-orange-900/20 via-black to-green-900/20"></div>
        
        <div class="relative z-10 max-w-4xl mx-auto text-center py-20">
          <div class="inline-block mb-4 px-6 py-2 rounded-full border border-orange-500/30 glass">
            <span class="text-orange-400 font-bold text-sm tracking-wider">🇮🇳 भारत का नंबर 1 टास्क प्लेटफॉर्म</span>
          </div>
          
          <h1 class="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span class="block text-white">रोज़ाना ₹360 बिना काम किए</span>
            <span class="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-400 to-green-400 text-4xl md:text-6xl mt-2">3-स्तरीय कमीशन सिस्टम</span>
          </h1>
          
          <p class="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            सिर्फ दोस्तों को इनवाइट करो, वो काम करें तो आपको पैसा मिले - यही है असली पैसिव इनकम!
          </p>

          <!-- Income Calculator Preview -->
          <div class="rounded-2xl p-6 md:p-8 max-w-lg mx-auto mb-8 border border-orange-500/30 glass" style="box-shadow: 0 0 40px rgba(255, 153, 51, 0.3);">
            <div class="flex justify-between items-center mb-4">
              <span class="text-gray-400 text-sm">आपका दैनिक कमीशन</span>
              <span class="text-orange-400 font-bold">LIVE</span>
            </div>
            <div class="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-400 to-green-400 mb-2">
              ₹<span id="hero-counter">0</span>
            </div>
            <div class="text-sm text-gray-400">सिर्फ 10 दोस्तों से शुरू</div>
          </div>

          <div class="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button 
              id="download-btn-hero"
              class="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 px-8 rounded-full text-xl hover:scale-105 transition transform flex items-center gap-3" style="animation: pulse-saffron 2s infinite;"
            >
              <span>🚀</span>
              <span>अभी फ्री में ज्वाइन करें</span>
            </button>
            <div class="flex items-center gap-2 text-gray-400 text-sm">
              <span class="text-green-500">🔒</span>
              <span>100% सुरक्षित</span>
            </div>
          </div>

          <!-- Social Proof -->
          <div class="mt-12 flex justify-center gap-8 text-center">
            <div>
              <div class="text-3xl font-bold text-white">50K+</div>
              <div class="text-xs text-gray-500">सक्रिय यूज़र</div>
            </div>
            <div class="w-px bg-gray-700"></div>
            <div>
              <div class="text-3xl font-bold text-white">₹2Cr+</div>
              <div class="text-xs text-gray-500">कमीशन वितरित</div>
            </div>
            <div class="w-px bg-gray-700"></div>
            <div>
              <div class="text-3xl font-bold text-white">4.9★</div>
              <div class="text-xs text-gray-500">Google Play</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3-Level Commission -->
      <section class="py-20 px-4 relative">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold mb-4">आपका 3-स्तरीय नेटवर्क</h2>
            <p class="text-gray-400 text-lg">एक बार इनवाइट करें, लाइफटाइम कमाएं</p>
          </div>

          <div class="grid md:grid-cols-3 gap-6 mb-12">
            <!-- Level 1 -->
            <div class="rounded-2xl p-6 relative overflow-hidden group hover:scale-105 transition duration-300 border border-yellow-500/30 glass">
              <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 opacity-20 blur-3xl rounded-full -mr-16 -mt-16"></div>
              <div class="relative z-10">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold text-2xl mb-4 mx-auto">
                  L1
                </div>
                <h3 class="text-2xl font-bold text-center mb-2 text-yellow-400">Level 1 - सीधा दोस्त</h3>
                <div class="space-y-3 mt-6">
                  <div class="flex justify-between items-center p-3 rounded-lg bg-white/5">
                    <span class="text-sm text-gray-400">Collection (1%)</span>
                    <span class="font-bold text-green-400">₹10 / ₹1000</span>
                  </div>
                  <div class="flex justify-between items-center p-3 rounded-lg bg-white/5">
                    <span class="text-sm text-gray-400">Payment (0.8%)</span>
                    <span class="font-bold text-green-400">₹8 / ₹1000</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Level 2 -->
            <div class="rounded-2xl p-6 relative overflow-hidden group hover:scale-105 transition duration-300 border border-gray-400/30 glass">
              <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-300 to-gray-400 opacity-20 blur-3xl rounded-full -mr-16 -mt-16"></div>
              <div class="relative z-10">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-black font-bold text-2xl mb-4 mx-auto">
                  L2
                </div>
                <h3 class="text-2xl font-bold text-center mb-2 text-gray-300">Level 2 - दोस्त का दोस्त</h3>
                <div class="space-y-3 mt-6">
                  <div class="flex justify-between items-center p-3 rounded-lg bg-white/5">
                    <span class="text-sm text-gray-400">Collection (0.5%)</span>
                    <span class="font-bold text-green-400">₹5 / ₹1000</span>
                  </div>
                  <div class="flex justify-between items-center p-3 rounded-lg bg-white/5">
                    <span class="text-sm text-gray-400">Payment (0.4%)</span>
                    <span class="font-bold text-green-400">₹4 / ₹1000</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Level 3 -->
            <div class="rounded-2xl p-6 relative overflow-hidden group hover:scale-105 transition duration-300 border border-orange-600/30 glass">
              <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-600 to-orange-700 opacity-20 blur-3xl rounded-full -mr-16 -mt-16"></div>
              <div class="relative z-10">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center text-white font-bold text-2xl mb-4 mx-auto">
                  L3
                </div>
                <h3 class="text-2xl font-bold text-center mb-2 text-orange-400">Level 3 - नेटवर्क</h3>
                <div class="space-y-3 mt-6">
                  <div class="flex justify-between items-center p-3 rounded-lg bg-white/5">
                    <span class="text-sm text-gray-400">Collection (0.3%)</span>
                    <span class="font-bold text-green-400">₹3 / ₹1000</span>
                  </div>
                  <div class="flex justify-between items-center p-3 rounded-lg bg-white/5">
                    <span class="text-sm text-gray-400">Payment (0.2%)</span>
                    <span class="font-bold text-green-400">₹2 / ₹1000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Example Box -->
          <div class="rounded-2xl p-8 border border-orange-500/30 glass">
            <h3 class="text-2xl font-bold mb-6 text-center text-orange-400">💡 उदाहरण: 10 दोस्त → 1000 नेटवर्क</h3>
            <div class="grid md:grid-cols-2 gap-8 items-center">
              <div class="space-y-4">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">You</div>
                  <div class="flex-1 h-0.5 bg-gradient-to-r from-orange-500 to-gray-600"></div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-white">10</div>
                    <div class="text-xs text-gray-500">Level 1</div>
                  </div>
                </div>
                <div class="flex items-center gap-4 pl-8">
                  <div class="w-12 h-12 rounded-full bg-gray-500/20 flex items-center justify-center text-gray-300 font-bold">L1</div>
                  <div class="flex-1 h-0.5 bg-gradient-to-r from-gray-400 to-gray-600"></div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-white">100</div>
                    <div class="text-xs text-gray-500">Level 2</div>
                  </div>
                </div>
                <div class="flex items-center gap-4 pl-16">
                  <div class="w-12 h-12 rounded-full bg-orange-700/20 flex items-center justify-center text-orange-600 font-bold">L2</div>
                  <div class="flex-1 h-0.5 bg-gradient-to-r from-orange-700 to-gray-600"></div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-white">1000</div>
                    <div class="text-xs text-gray-500">Level 3</div>
                  </div>
                </div>
              </div>
              <div class="bg-black/40 rounded-xl p-6">
                <div class="text-sm text-gray-400 mb-2">अगर हर कोई ₹100 का काम करे:</div>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span>L1 (10 × ₹100 × 1%)</span>
                    <span class="text-green-400 font-bold">₹10</span>
                  </div>
                  <div class="flex justify-between">
                    <span>L2 (100 × ₹100 × 0.5%)</span>
                    <span class="text-green-400 font-bold">₹50</span>
                  </div>
                  <div class="flex justify-between">
                    <span>L3 (1000 × ₹100 × 0.3%)</span>
                    <span class="text-green-400 font-bold">₹300</span>
                  </div>
                  <div class="border-t border-gray-700 pt-2 mt-2 flex justify-between text-lg font-bold text-orange-400">
                    <span>कुल रोज़ाना</span>
                    <span>₹360</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Interactive Calculator -->
      <section class="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div class="max-w-4xl mx-auto rounded-3xl p-8 md:p-12 border border-green-500/30 glass">
          <h2 class="text-3xl md:text-4xl font-bold text-center mb-8">🧮 अपनी कमाई कैलकुलेट करें</h2>
          
          <div class="space-y-8">
            <div>
              <label class="block text-sm font-medium mb-4">आपने कितने दोस्तों को इनवाइट किया?</label>
              <input type="range" min="1" max="50" value="10" class="w-full mb-2" id="friends-slider">
              <div class="flex justify-between text-sm text-gray-400">
                <span>1</span>
                <span class="text-2xl font-bold text-orange-400" id="friends-count">10</span>
                <span>50</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-4">प्रत्येक यूज़र का औसत दैनिक टास्क</label>
              <input type="range" min="100" max="5000" step="100" value="500" class="w-full mb-2" id="amount-slider">
              <div class="flex justify-between text-sm text-gray-400">
                <span>₹100</span>
                <span class="text-2xl font-bold text-green-400" id="amount-count">₹500</span>
                <span>₹5000</span>
              </div>
            </div>

            <div class="grid md:grid-cols-3 gap-4">
              <div class="bg-gradient-to-r from-orange-500/20 to-transparent rounded-2xl p-6 text-center">
                <div class="text-sm text-gray-400 mb-2">दैनिक कमाई</div>
                <div class="text-3xl font-black text-orange-400">₹<span id="daily-income">360</span></div>
              </div>
              <div class="bg-gradient-to-r from-green-500/20 to-transparent rounded-2xl p-6 text-center">
                <div class="text-sm text-gray-400 mb-2">मासिक कमाई</div>
                <div class="text-3xl font-black text-green-400">₹<span id="monthly-income">10,800</span></div>
              </div>
              <div class="bg-gradient-to-r from-yellow-500/20 to-transparent rounded-2xl p-6 text-center">
                <div class="text-sm text-gray-400 mb-2">वार्षिक कमाई</div>
                <div class="text-3xl font-black text-yellow-400">₹<span id="yearly-income">131,400</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Task Types -->
      <section class="py-20 px-4">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-4xl font-bold text-center mb-12">दो तरह के टास्क, दोहरी कमाई</h2>
          
          <div class="grid md:grid-cols-2 gap-8">
            <div class="rounded-2xl p-8 border-l-4 border-orange-500 glass">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-14 h-14 rounded-full bg-orange-500/20 flex items-center justify-center text-3xl">📥</div>
                <h3 class="text-2xl font-bold">Collection Tasks</h3>
              </div>
              <ul class="space-y-3 text-gray-300">
                <li class="flex items-start gap-3">
                  <span class="text-green-500 mt-1">✓</span>
                  <span>पैसे प्राप्त करें और कन्फर्म करें</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="text-green-500 mt-1">✓</span>
                  <span>30 मिनट में पूरा</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="text-green-500 mt-1">✓</span>
                  <span>अधिक कमीशन (1% लेवल 1)</span>
                </li>
              </ul>
            </div>

            <div class="rounded-2xl p-8 border-l-4 border-green-500 glass">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center text-3xl">📤</div>
                <h3 class="text-2xl font-bold">Payment Tasks</h3>
              </div>
              <ul class="space-y-3 text-gray-300">
                <li class="flex items-start gap-3">
                  <span class="text-green-500 mt-1">✓</span>
                  <span>निर्दिष्ट खाते में भुगतान करें</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="text-green-500 mt-1">✓</span>
                  <span>स्क्रीनशॉट अपलोड करें</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="text-green-500 mt-1">✓</span>
                  <span>तुरंत कमीशन (0.8% लेवल 1)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Leaderboard -->
      <section class="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-8">🏆 आज के टॉप कमीशन विनर्स</h2>
          
          <div class="rounded-2xl overflow-hidden glass">
            <div class="p-4 bg-gradient-to-r from-orange-500/20 to-green-500/20 border-b border-white/10 flex justify-between items-center">
              <span class="font-bold">यूज़र</span>
              <span class="font-bold">आज की कमाई</span>
            </div>
            <div id="leaderboard" class="divide-y divide-white/5"></div>
          </div>
          
          <div class="mt-6 text-center">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-400 text-sm">
              <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Live Updates - हर 5 मिनट में अपडेट</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Trust -->
      <section class="py-20 px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-12">🔒 पूरी तरह सुरक्षित और विश्वसनीय</h2>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div class="rounded-xl p-6 glass">
              <div class="text-4xl mb-3">🛡️</div>
              <div class="font-bold text-sm">SSL सुरक्षा</div>
            </div>
            <div class="rounded-xl p-6 glass">
              <div class="text-4xl mb-3">✅</div>
              <div class="font-bold text-sm">KYC वेरिफिकेशन</div>
            </div>
            <div class="rounded-xl p-6 glass">
              <div class="text-4xl mb-3">⚡</div>
              <div class="font-bold text-sm">तुरंत निकासी</div>
            </div>
            <div class="rounded-xl p-6 glass">
              <div class="text-4xl mb-3">💬</div>
              <div class="font-bold text-sm">24/7 सपोर्ट</div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="py-20 px-4 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-transparent to-green-600/20"></div>
        <div class="max-w-3xl mx-auto text-center relative z-10">
          <h2 class="text-4xl md:text-5xl font-bold mb-6">🚀 अभी शुरू करें!</h2>
          <p class="text-xl text-gray-300 mb-8">पहला टास्क पूरा करें और ₹50 बोनस पाएं</p>
          
          <div class="rounded-2xl p-8 border border-orange-500/50 max-w-md mx-auto mb-8 glass">
            <div class="text-sm text-gray-400 mb-2">इनवाइट कोड डालें</div>
            <div class="text-3xl font-mono font-bold text-orange-400 mb-4">9INR2026</div>
            <button 
              id="download-btn-cta"
              class="w-full bg-gradient-to-r from-orange-500 to-green-500 text-white font-bold py-4 rounded-xl text-lg hover:scale-105 transition transform"
            >
              रजिस्टर करें - 100% फ्री
            </button>
          </div>
          
          <div class="flex justify-center gap-4 text-3xl">
            <span class="hover:scale-110 transition cursor-pointer">🤖</span>
            <span class="hover:scale-110 transition cursor-pointer">🍎</span>
            <span class="hover:scale-110 transition cursor-pointer">📱</span>
            <span class="hover:scale-110 transition cursor-pointer">💬</span>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="py-8 px-4 border-t border-white/10">
        <div class="max-w-4xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2024 9INR. सर्वाधिकार सुरक्षित।</p>
        </div>
      </footer>
    </div>

    <!-- Notification Container -->
    <div id="notification-container" class="fixed bottom-4 left-4 z-50 flex flex-col gap-2 pointer-events-none"></div>
  `;

  // Initialize all effects
  initBackgroundAnimation();
  initMoneyRain();
  
  // Start counter after load
  setTimeout(() => animateCounter(360), 500);
  
  // Initialize calculator
  updateCalculation();
  
  // Initialize leaderboard
  populateLeaderboard();
  setInterval(populateLeaderboard, 10000);
  
  // Initialize notifications
  setInterval(showNotification, 8000);
  setTimeout(showNotification, 2000);
  
  // Setup download buttons
  document.getElementById('download-btn-hero')?.addEventListener('click', handleDownload);
  document.getElementById('download-btn-cta')?.addEventListener('click', handleDownload);
  
  // Setup calculator sliders
  document.getElementById('friends-slider')?.addEventListener('input', updateCalculation);
  document.getElementById('amount-slider')?.addEventListener('input', updateCalculation);
}
