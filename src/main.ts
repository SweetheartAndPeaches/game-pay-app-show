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

// ===== Calculator Update =====
function updateCalculation(): void {
  const friendsSlider = document.getElementById('friends-slider') as HTMLInputElement;
  const amountSlider = document.getElementById('amount-slider') as HTMLInputElement;
  
  if (!friendsSlider || !amountSlider) return;
  
  const friends = parseInt(friendsSlider.value);
  const amount = parseInt(amountSlider.value);
  
  const friendsCount = document.getElementById('friends-count');
  const amountCount = document.getElementById('amount-count');
  const monthlyIncome = document.getElementById('monthly-income');
  
  if (friendsCount) friendsCount.textContent = friends.toString();
  if (amountCount) amountCount.textContent = '₹' + amount;
  
  // Calculate: L1 (friends * amount * 1%) + L2 (friends*10 * amount * 0.5%) + L3 (friends*100 * amount * 0.3%)
  const l1 = friends * amount * 0.01;
  const l2 = friends * 10 * amount * 0.005;
  const l3 = friends * 100 * amount * 0.003;
  const daily = l1 + l2 + l3;
  const monthly = Math.round(daily * 30);
  
  if (monthlyIncome) monthlyIncome.textContent = monthly.toLocaleString();
}

// ===== Leaderboard =====
const leaderboardNames = [
  'राहुल कुमार', 'प्रिया शर्मा', 'अमित वर्मा', 'नेहा गुप्ता', 
  'विक्रम मेहता', 'अंजली राव', 'सुरेश पटेल', 'दीपा नायर',
  'राजेश सिंह', 'कविता रे', 'अजय कुमार', 'पूजा शाह'
];
const leaderboardCities = ['मुंबई', 'दिल्ली', 'बैंगलोर', 'पुणे', 'चेन्नई', 'हैदराबाद', 'कोलकाता', 'जयपुर'];

function populateLeaderboard(): void {
  const container = document.getElementById('leaderboard');
  if (!container) return;
  
  const sorted = leaderboardNames.map((name, i) => ({
    name,
    city: leaderboardCities[i % leaderboardCities.length],
    amount: Math.floor(Math.random() * 5000) + 2000
  })).sort((a, b) => b.amount - a.amount);
  
  container.innerHTML = sorted.slice(0, 6).map((user, index) => {
    const badgeClass = index === 0 
      ? 'bg-yellow-500 text-black' 
      : index === 1 
        ? 'bg-gray-300 text-black' 
        : index === 2 
          ? 'bg-orange-600 text-white' 
          : 'bg-gray-700 text-white';
    
    return `
      <div class="p-3 sm:p-4 flex justify-between items-center hover:bg-white/5 transition">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full ${badgeClass} flex items-center justify-center font-bold text-sm">
            ${index + 1}
          </div>
          <div>
            <div class="font-bold text-white text-sm">${user.name}</div>
            <div class="text-xs text-gray-500">${user.city}</div>
          </div>
        </div>
        <div class="text-right">
          <div class="font-bold text-green-400">₹${user.amount.toLocaleString()}</div>
          <div class="text-xs text-gray-500">आज</div>
        </div>
      </div>
    `;
  }).join('');
}

// ===== Notification System =====
const notificationActions = ['ने कमाया', 'ने टास्क पूरा किया', 'ने दोस्त को इनवाइट किया'];
const notificationAmounts = ['₹450', '₹1,200', '₹3,600', '₹890', '₹2,100', '₹5,500'];

function showNotification(): void {
  const container = document.getElementById('notification-container');
  if (!container) return;
  
  const name = leaderboardNames[Math.floor(Math.random() * leaderboardNames.length)];
  const action = notificationActions[Math.floor(Math.random() * notificationActions.length)];
  const amount = notificationAmounts[Math.floor(Math.random() * notificationAmounts.length)];
  
  const notif = document.createElement('div');
  notif.className = 'bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 text-sm transform translate-x-full transition-transform duration-500 flex items-center gap-3 shadow-lg border-l-2 border-green-500';
  notif.innerHTML = `
    <div class="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
      </svg>
    </div>
    <div>
      <div class="font-bold text-white text-xs">${name} ${action}</div>
      <div class="text-green-400 text-xs font-bold">${amount}</div>
    </div>
  `;
  
  container.appendChild(notif);
  
  setTimeout(() => notif.classList.remove('translate-x-full'), 100);
  setTimeout(() => {
    notif.classList.add('translate-x-full');
    setTimeout(() => notif.remove(), 500);
  }, 4000);
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

    <!-- Notification Container -->
    <div id="notification-container" class="fixed bottom-4 left-4 z-50 flex flex-col gap-2 pointer-events-none"></div>

    <div class="content-wrapper min-h-screen flex flex-col">
      
      <!-- Header -->
      <header class="w-full py-4 px-4 sm:px-8 sticky top-0 z-40 backdrop-blur-md bg-black/70 border-b border-white/5">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img 
              src="https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E7%94%BB%E6%9D%BF+1.png&nonce=6d3f72c8-f4f7-4ad9-bcc3-823fd80794f8&project_id=7619222010605879330&sign=5dae79049555ccd18cf6790ff76b33e7f16dd8c15328fb199be74d824d53a75f"
              alt="9INR"
              class="w-10 h-10 rounded-xl object-cover"
            />
            <span class="text-white font-bold text-xl">9INR</span>
            <span class="hidden sm:inline-block bg-gradient-to-r from-orange-500 to-green-500 text-white text-xs px-2 py-1 rounded-full">भारत #1</span>
          </div>
          <div class="flex items-center gap-4">
            <nav class="hidden md:flex items-center gap-6">
              <a href="#commission" class="text-gray-300 hover:text-yellow-400 transition-colors text-sm">तीन स्तरीय</a>
              <a href="#calculator" class="text-gray-300 hover:text-yellow-400 transition-colors text-sm">कैलकुलेटर</a>
              <a href="#leaderboard" class="text-gray-300 hover:text-yellow-400 transition-colors text-sm">लीडरबोर्ड</a>
            </nav>
            <button 
              id="download-btn-header"
              class="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 text-sm"
            >
              अभी डाउनलोड करें
            </button>
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <main class="flex-1">
        
        <!-- Hero Banner -->
        <section class="w-full py-12 sm:py-20 px-4">
          <div class="max-w-7xl mx-auto">
            <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              <!-- Left Content -->
              <div class="flex-1 text-center lg:text-left">
                <div class="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-green-500/20 border border-orange-500/30 rounded-full px-4 py-2 mb-6">
                  <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span class="text-white text-sm font-medium">🇮🇳 भारत का नंबर 1 टास्क प्लेटफॉर्म</span>
                </div>
                
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
                  रोज़ाना <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-400 to-green-400">₹360</span> बिना काम किए
                </h1>
                
                <p class="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-green-400 mb-6">
                  3-स्तरीय कमीशन सिस्टम
                </p>
                
                <p class="text-lg text-gray-300 mb-8 max-w-xl">
                  सिर्फ दोस्तों को इनवाइट करो, वो काम करें तो आपको पैसा मिले - यही है असली पैसिव इनकम!
                </p>
                
                <div class="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <button 
                    id="download-btn-hero"
                    class="group flex items-center gap-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    style="animation: pulse-saffron 2s infinite;"
                  >
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.523 15.341c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9m-11.046 0c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9m11.4-6.02l1.97-3.41a.41.41 0 00-.71-.41l-2 3.46c-1.54-.7-3.26-1.09-5.14-1.09s-3.6.39-5.14 1.09l-2-3.46a.41.41 0 00-.71.41l1.97 3.41C2.69 11.08.34 14.53 0 18.5h24c-.34-3.97-2.69-7.42-6.12-9.18"/>
                    </svg>
                    <span>अभी फ्री में ज्वाइन करें</span>
                  </button>
                  
                  <div class="flex items-center gap-2 text-gray-400 text-sm">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                    <span>100% सुरक्षित</span>
                  </div>
                </div>
                
                <!-- Stats -->
                <div class="flex items-center gap-6 sm:gap-8 mt-10 justify-center lg:justify-start">
                  <div class="text-center">
                    <div class="text-2xl sm:text-3xl font-black text-white">50K+</div>
                    <div class="text-gray-500 text-sm">सक्रिय यूज़र</div>
                  </div>
                  <div class="w-px h-10 bg-white/10"></div>
                  <div class="text-center">
                    <div class="text-2xl sm:text-3xl font-black text-white">₹2Cr+</div>
                    <div class="text-gray-500 text-sm">कमीशन वितरित</div>
                  </div>
                  <div class="w-px h-10 bg-white/10"></div>
                  <div class="text-center">
                    <div class="text-2xl sm:text-3xl font-black text-white">4.9★</div>
                    <div class="text-gray-500 text-sm">Google Play</div>
                  </div>
                </div>
              </div>
              
              <!-- Right - App Preview -->
              <div class="flex-1 flex justify-center">
                <div class="relative">
                  <div class="w-48 sm:w-56 h-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10" style="animation: float 3s ease-in-out infinite;">
                    <img 
                      src="https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E7%94%BB%E6%9D%BF+1.png&nonce=6d3f72c8-f4f7-4ad9-bcc3-823fd80794f8&project_id=7619222010605879330&sign=5dae79049555ccd18cf6790ff76b33e7f16dd8c15328fb199be74d824d53a75f"
                      alt="9INR App"
                      class="w-full h-auto"
                    />
                  </div>
                  <div class="absolute inset-0 w-48 sm:w-56 h-full rounded-3xl bg-yellow-400 opacity-10 blur-3xl -z-10"></div>
                  
                  <!-- Floating Badge -->
                  <div class="absolute -right-2 top-1/4 bg-green-500 text-white text-xs font-bold py-2 px-3 rounded-full shadow-lg whitespace-nowrap" style="animation: float 2s ease-in-out infinite 0.5s;">
                    +₹1000 आज का कमीशन
                  </div>
                  <div class="absolute -left-2 bottom-1/4 bg-gradient-to-r from-orange-500 to-yellow-500 text-black text-xs font-bold py-2 px-3 rounded-full shadow-lg whitespace-nowrap" style="animation: float 2s ease-in-out infinite 1s;">
                    3-स्तरीय कमीशन
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Commission System Section -->
        <section id="commission" class="w-full py-16 px-4">
          <div class="max-w-7xl mx-auto">
            <div class="text-center mb-12">
              <h2 class="text-3xl sm:text-4xl font-black text-white mb-4">
                आपका <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-green-400">3-स्तरीय नेटवर्क</span>
              </h2>
              <p class="text-gray-400 max-w-2xl mx-auto">
                एक बार इनवाइट करें, लाइफटाइम कमाएं
              </p>
            </div>
            
            <!-- Commission Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <!-- Level 1 -->
              <div class="relative bg-gradient-to-br from-yellow-400/20 to-orange-600/10 rounded-3xl p-6 border border-yellow-400/30 overflow-hidden group hover:scale-105 transition-all duration-300">
                <div class="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl"></div>
                <div class="relative">
                  <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black font-black text-xl mb-4 mx-auto">
                    L1
                  </div>
                  <h3 class="text-xl font-bold text-center mb-1 text-yellow-400">Level 1 - सीधा दोस्त</h3>
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
              <div class="relative bg-gradient-to-br from-gray-300/20 to-gray-500/10 rounded-3xl p-6 border border-gray-400/30 overflow-hidden group hover:scale-105 transition-all duration-300">
                <div class="absolute top-0 right-0 w-32 h-32 bg-gray-300/10 rounded-full blur-3xl"></div>
                <div class="relative">
                  <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-black font-black text-xl mb-4 mx-auto">
                    L2
                  </div>
                  <h3 class="text-xl font-bold text-center mb-1 text-gray-300">Level 2 - दोस्त का दोस्त</h3>
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
              <div class="relative bg-gradient-to-br from-orange-600/20 to-orange-800/10 rounded-3xl p-6 border border-orange-500/30 overflow-hidden group hover:scale-105 transition-all duration-300">
                <div class="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full blur-3xl"></div>
                <div class="relative">
                  <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center text-white font-black text-xl mb-4 mx-auto">
                    L3
                  </div>
                  <h3 class="text-xl font-bold text-center mb-1 text-orange-400">Level 3 - नेटवर्क</h3>
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
            
            <!-- Example Calculation Box -->
            <div class="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl p-6 border border-orange-500/20">
              <h3 class="text-xl font-bold mb-6 text-center text-orange-400">💡 उदाहरण: 10 दोस्त → 1110 नेटवर्क</h3>
              <div class="grid sm:grid-cols-2 gap-6 items-center">
                <div class="space-y-3">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-sm">You</div>
                    <div class="flex-1 h-0.5 bg-gradient-to-r from-orange-500 to-gray-600"></div>
                    <div class="text-center">
                      <div class="text-xl font-bold text-white">10</div>
                      <div class="text-xs text-gray-500">Level 1</div>
                    </div>
                  </div>
                  <div class="flex items-center gap-4 pl-8">
                    <div class="w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center text-gray-300 font-bold text-sm">L1</div>
                    <div class="flex-1 h-0.5 bg-gradient-to-r from-gray-400 to-gray-600"></div>
                    <div class="text-center">
                      <div class="text-xl font-bold text-white">100</div>
                      <div class="text-xs text-gray-500">Level 2</div>
                    </div>
                  </div>
                  <div class="flex items-center gap-4 pl-16">
                    <div class="w-10 h-10 rounded-full bg-orange-700/20 flex items-center justify-center text-orange-600 font-bold text-sm">L2</div>
                    <div class="flex-1 h-0.5 bg-gradient-to-r from-orange-700 to-gray-600"></div>
                    <div class="text-center">
                      <div class="text-xl font-bold text-white">1000</div>
                      <div class="text-xs text-gray-500">Level 3</div>
                    </div>
                  </div>
                </div>
                <div class="bg-black/40 rounded-xl p-4">
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
        <section id="calculator" class="w-full py-16 px-4">
          <div class="max-w-3xl mx-auto">
            <div class="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-6 sm:p-10 border border-green-500/30 shadow-xl">
              <h2 class="text-2xl sm:text-3xl font-bold text-center mb-8">🧮 अपनी कमाई कैलकुलेट करें</h2>
              
              <div class="space-y-8">
                <!-- Friends Slider -->
                <div>
                  <label class="block text-sm font-medium mb-4">आपने कितने दोस्तों को इनवाइट किया?</label>
                  <input type="range" min="1" max="50" value="10" class="w-full mb-2" id="friends-slider" style="height: 6px; -webkit-appearance: none; background: rgba(255,255,255,0.2); border-radius: 3px;">
                  <div class="flex justify-between text-sm text-gray-400">
                    <span>1</span>
                    <span class="text-2xl font-bold text-orange-400" id="friends-count">10</span>
                    <span>50</span>
                  </div>
                </div>

                <!-- Amount Slider -->
                <div>
                  <label class="block text-sm font-medium mb-4">प्रत्येक यूज़र का औसत दैनिक टास्क</label>
                  <input type="range" min="100" max="5000" step="100" value="500" class="w-full mb-2" id="amount-slider" style="height: 6px; -webkit-appearance: none; background: rgba(255,255,255,0.2); border-radius: 3px;">
                  <div class="flex justify-between text-sm text-gray-400">
                    <span>₹100</span>
                    <span class="text-2xl font-bold text-green-400" id="amount-count">₹500</span>
                    <span>₹5000</span>
                  </div>
                </div>

                <!-- Result -->
                <div class="bg-gradient-to-r from-orange-500/20 to-green-500/20 rounded-2xl p-6 text-center">
                  <div class="text-sm text-gray-400 mb-2">अनुमानित मासिक कमाई</div>
                  <div class="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-green-400">
                    ₹<span id="monthly-income">54,000</span>
                  </div>
                  <div class="text-sm text-green-400 mt-2">बिना कुछ किए...</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Leaderboard Section -->
        <section id="leaderboard" class="w-full py-16 px-4">
          <div class="max-w-3xl mx-auto">
            <h2 class="text-2xl sm:text-3xl font-bold text-center mb-8">🏆 आज के टॉप कमीशन विनर्स</h2>
            
            <div class="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl overflow-hidden border border-white/10">
              <div class="p-4 bg-gradient-to-r from-orange-500/20 to-green-500/20 border-b border-white/10 flex justify-between items-center">
                <span class="font-bold text-white">यूज़र</span>
                <span class="font-bold text-white">आज की कमाई</span>
              </div>
              <div id="leaderboard" class="divide-y divide-white/5">
                <!-- Populated by JS -->
              </div>
            </div>
            
            <div class="mt-6 text-center">
              <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-400 text-sm">
                <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>Live Updates - हर 10 सेकंड में अपडेट</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Task Types -->
        <section class="w-full py-16 px-4">
          <div class="max-w-6xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-12">दो तरह के टास्क, दोहरी कमाई</h2>
            
            <div class="grid sm:grid-cols-2 gap-8">
              <div class="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-3xl p-8 border-l-4 border-green-500 hover:scale-105 transition-all duration-300">
                <div class="flex items-center gap-4 mb-6">
                  <div class="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center text-3xl">📥</div>
                  <h3 class="text-2xl font-bold text-white">Collection Tasks</h3>
                </div>
                <ul class="space-y-3 text-gray-300">
                  <li class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>पैसे प्राप्त करें और कन्फर्म करें</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>30 मिनट में पूरा</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>अधिक कमीशन (1% लेवल 1)</span>
                  </li>
                </ul>
              </div>

              <div class="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-3xl p-8 border-l-4 border-blue-500 hover:scale-105 transition-all duration-300">
                <div class="flex items-center gap-4 mb-6">
                  <div class="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-3xl">📤</div>
                  <h3 class="text-2xl font-bold text-white">Payment Tasks</h3>
                </div>
                <ul class="space-y-3 text-gray-300">
                  <li class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>निर्दिष्ट खाते में भुगतान करें</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>स्क्रीनशॉट अपलोड करें</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>तुरंत कमीशन (0.8% लेवल 1)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- Trust & Security -->
        <section class="w-full py-16 px-4">
          <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-3xl font-bold mb-12">🔒 पूरी तरह सुरक्षित और विश्वसनीय</h2>
            
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div class="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-green-500/50 transition-colors">
                <svg class="w-10 h-10 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                <div class="font-bold text-sm">SSL सुरक्षा</div>
              </div>
              <div class="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-orange-500/50 transition-colors">
                <svg class="w-10 h-10 text-orange-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <div class="font-bold text-sm">KYC वेरिफिकेशन</div>
              </div>
              <div class="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-yellow-500/50 transition-colors">
                <svg class="w-10 h-10 text-yellow-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                <div class="font-bold text-sm">तुरंत निकासी</div>
              </div>
              <div class="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-colors">
                <svg class="w-10 h-10 text-blue-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
                <div class="font-bold text-sm">24/7 सपोर्ट</div>
              </div>
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="w-full py-16 px-4 relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-transparent to-green-600/10"></div>
          <div class="max-w-3xl mx-auto text-center relative z-10">
            <h2 class="text-3xl sm:text-4xl font-bold mb-4">🚀 अभी शुरू करें!</h2>
            <p class="text-xl text-gray-300 mb-8">पहला टास्क पूरा करें और ₹50 बोनस पाएं</p>
            
            <div class="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 border border-orange-500/30 max-w-md mx-auto mb-8">
              <div class="text-sm text-gray-400 mb-2">इनवाइट कोड डालें</div>
              <div class="text-3xl font-mono font-bold text-orange-400 mb-4">9INR2026</div>
              <button 
                id="download-btn-cta"
                class="w-full bg-gradient-to-r from-orange-500 to-green-500 text-white font-bold py-4 rounded-xl text-lg hover:scale-105 transition transform"
                style="animation: pulse-saffron 2s infinite;"
              >
                रजिस्टर करें - 100% फ्री
              </button>
            </div>
            
            <div class="flex justify-center gap-6 text-3xl">
              <div class="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 hover:scale-110 transition cursor-pointer">
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.523 15.341c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9m-11.046 0c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9m11.4-6.02l1.97-3.41a.41.41 0 00-.71-.41l-2 3.46c-1.54-.7-3.26-1.09-5.14-1.09s-3.6.39-5.14 1.09l-2-3.46a.41.41 0 00-.71.41l1.97 3.41C2.69 11.08.34 14.53 0 18.5h24c-.34-3.97-2.69-7.42-6.12-9.18"/>
                </svg>
              </div>
              <div class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:scale-110 transition cursor-pointer">
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
              <div class="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 hover:scale-110 transition cursor-pointer">
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
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
              <a href="#" class="hover:text-yellow-400 transition-colors">गोपनीयता नीति</a>
              <a href="#" class="hover:text-yellow-400 transition-colors">सेवा की शर्तें</a>
              <a href="#" class="hover:text-yellow-400 transition-colors">संपर्क करें</a>
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

  // Setup calculator sliders
  const friendsSlider = document.getElementById('friends-slider');
  const amountSlider = document.getElementById('amount-slider');
  
  friendsSlider?.addEventListener('input', updateCalculation);
  amountSlider?.addEventListener('input', updateCalculation);
  
  // Initial calculation
  updateCalculation();
  
  // Populate leaderboard
  populateLeaderboard();
  setInterval(populateLeaderboard, 10000); // Refresh every 10s
  
  // Start notifications
  setTimeout(showNotification, 3000);
  setInterval(showNotification, 8000);
}
