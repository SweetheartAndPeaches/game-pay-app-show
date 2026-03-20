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

// ===== Chat Widget System =====
let chatMessages: Array<{ role: 'user' | 'assistant'; content: string }> = [];
let isChatOpen = false;
let isTyping = false;

function createChatWidget(): void {
  const chatWidget = document.createElement('div');
  chatWidget.id = 'chat-widget';
  chatWidget.innerHTML = `
    <!-- Chat Toggle Button -->
    <div id="chat-toggle" class="chat-toggle">
      <div class="chat-toggle-icon">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      </div>
      <span class="chat-toggle-text">Help</span>
      <span class="chat-notification-dot"></span>
    </div>
    
    <!-- Chat Window -->
    <div id="chat-window" class="chat-window">
      <div class="chat-header">
        <div class="chat-header-avatar">
          <span>🇮🇳</span>
        </div>
        <div class="chat-header-info">
          <div class="chat-header-name">Raju</div>
          <div class="chat-header-status">
            <span class="status-dot"></span>
            Online
          </div>
        </div>
        <button id="chat-close" class="chat-close">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <div id="chat-messages" class="chat-messages">
        <div class="chat-message assistant">
          <div class="message-avatar">🇮🇳</div>
          <div class="message-content">
            <p>नमस्ते! 🙏 मैं Raju हूं, 9INR का मार्केटिंग एक्सपर्ट।</p>
            <p>आपको किस बारे में जानकारी चाहिए? मैं आपकी भाषा में जवाब दूंगा! 😊</p>
          </div>
        </div>
      </div>
      
      <div class="chat-input-container">
        <input type="text" id="chat-input" class="chat-input" placeholder="अपना सवाल टाइप करें..." />
        <button id="chat-send" class="chat-send">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(chatWidget);
  
  // Event listeners
  document.getElementById('chat-toggle')?.addEventListener('click', toggleChat);
  document.getElementById('chat-close')?.addEventListener('click', toggleChat);
  document.getElementById('chat-send')?.addEventListener('click', sendMessage);
  document.getElementById('chat-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}

function toggleChat(): void {
  const chatWindow = document.getElementById('chat-window');
  const toggleBtn = document.getElementById('chat-toggle');
  isChatOpen = !isChatOpen;
  
  if (isChatOpen) {
    chatWindow?.classList.add('open');
    toggleBtn?.classList.add('hidden');
  } else {
    chatWindow?.classList.remove('open');
    toggleBtn?.classList.remove('hidden');
  }
}

async function sendMessage(): Promise<void> {
  const input = document.getElementById('chat-input') as HTMLInputElement;
  const message = input?.value.trim();
  
  if (!message || isTyping) return;
  
  // Add user message
  addMessage('user', message);
  input.value = '';
  
  // Show typing indicator
  isTyping = true;
  showTypingIndicator();
  
  try {
    // Call API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...chatMessages, { role: 'user', content: message }] })
    });
    
    if (!response.ok) throw new Error('API error');
    
    // Remove typing indicator
    hideTypingIndicator();
    
    // Create assistant message element
    const messagesContainer = document.getElementById('chat-messages');
    const assistantDiv = document.createElement('div');
    assistantDiv.className = 'chat-message assistant';
    assistantDiv.innerHTML = `
      <div class="message-avatar">🇮🇳</div>
      <div class="message-content"><p></p></div>
    `;
    messagesContainer?.appendChild(assistantDiv);
    
    const contentP = assistantDiv.querySelector('.message-content p') as HTMLElement;
    let fullResponse = '';
    
    // Read stream
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.content;
            if (content) {
              fullResponse += content;
              contentP.textContent = fullResponse;
              // Scroll to bottom
              messagesContainer?.scrollTo(0, messagesContainer.scrollHeight);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
    
    // Save to history
    chatMessages.push({ role: 'user', content: message });
    chatMessages.push({ role: 'assistant', content: fullResponse });
    
  } catch (error) {
    hideTypingIndicator();
    addMessage('assistant', 'Sorry, मुझे थोड़ी समस्या हो रही है। कृपया बाद में पुनः प्रयास करें। 🙏');
  }
  
  isTyping = false;
}

function addMessage(role: 'user' | 'assistant', content: string): void {
  const messagesContainer = document.getElementById('chat-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${role}`;
  
  if (role === 'assistant') {
    messageDiv.innerHTML = `
      <div class="message-avatar">🇮🇳</div>
      <div class="message-content"><p>${content}</p></div>
    `;
  } else {
    messageDiv.innerHTML = `
      <div class="message-content"><p>${content}</p></div>
    `;
  }
  
  messagesContainer?.appendChild(messageDiv);
  messagesContainer?.scrollTo(0, messagesContainer.scrollHeight);
}

function showTypingIndicator(): void {
  const messagesContainer = document.getElementById('chat-messages');
  const typingDiv = document.createElement('div');
  typingDiv.id = 'typing-indicator';
  typingDiv.className = 'chat-message assistant typing';
  typingDiv.innerHTML = `
    <div class="message-avatar">🇮🇳</div>
    <div class="message-content typing-dots">
      <span></span><span></span><span></span>
    </div>
  `;
  messagesContainer?.appendChild(typingDiv);
  messagesContainer?.scrollTo(0, messagesContainer.scrollHeight);
}

function hideTypingIndicator(): void {
  document.getElementById('typing-indicator')?.remove();
}

function initChatWidget(): void {
  createChatWidget();
}

// ===== Commission Notification System =====
const indianNames = [
  'Priya', 'Amit', 'Neha', 'Rahul', 'Deepa', 'Vikram', 'Anjali', 'Suresh',
  'Kavita', 'Rajesh', 'Pooja', 'Sanjay', 'Meera', 'Arjun', 'Shreya', 'Vijay',
  'Nisha', 'Rohan', 'Divya', 'Karan', 'Anita', 'Manish', 'Ritu', 'Ashok'
];

const indianCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Jaipur',
  'Ahmedabad', 'Lucknow', 'Chandigarh', 'Noida', 'Gurgaon', 'Indore', 'Bhopal', 'Nagpur'
];

let notificationInterval: number | null = null;

function showCommissionNotification(): void {
  // 随机生成数据
  const name = indianNames[Math.floor(Math.random() * indianNames.length)];
  const city = indianCities[Math.floor(Math.random() * indianCities.length)];
  const amount = Math.floor(Math.random() * 500 + 100); // ₹100 - ₹600
  
  // 创建通知元素
  const notification = document.createElement('div');
  notification.className = 'commission-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-avatar">
        <span class="avatar-text">${name.charAt(0)}${name.split(' ')[1]?.charAt(0) || ''}</span>
      </div>
      <div class="notification-info">
        <div class="notification-title">
          <span class="notification-name">${name}</span>
          <span class="notification-city">📍 ${city}</span>
        </div>
        <div class="notification-amount">कमीशन मिला: <span class="amount-value">₹${amount}</span></div>
      </div>
      <div class="notification-time">अभी</div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // 触发动画 - 从右往左滑入
  requestAnimationFrame(() => {
    notification.classList.add('show');
  });
  
  // 3秒后消失
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 500); // 等待动画完成
  }, 3000);
}

function startNotificationSystem(): void {
  // 初始延迟5秒后开始
  setTimeout(() => {
    showCommissionNotification();
    // 每30秒推送一次
    notificationInterval = window.setInterval(() => {
      showCommissionNotification();
    }, 30000);
  }, 5000);
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

    <div class="content-wrapper min-h-screen flex flex-col">
      
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
            <span class="hidden sm:inline-block bg-yellow-400/20 text-yellow-400 text-xs px-2 py-1 rounded-full">टास्क प्लेटफॉर्म</span>
          </div>
          <div class="flex items-center gap-4">
            <nav class="hidden md:flex items-center gap-6">
              <a href="#commission" class="text-gray-300 hover:text-yellow-400 transition-colors text-sm">तीन स्तरीय कमीशन</a>
              <a href="#tasks" class="text-gray-300 hover:text-yellow-400 transition-colors text-sm">टास्क सिस्टम</a>
              <a href="#calculator" class="text-gray-300 hover:text-yellow-400 transition-colors text-sm">कमाई कैलकुलेटर</a>
            </nav>
            <button 
              id="download-btn-header"
              class="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 text-sm"
            >
              अभी डाउनलोड करें
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
                  <span class="text-yellow-400 text-sm font-medium">तीन स्तरीय वितरण · पासिव इनकम</span>
                </div>
                
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                  दोस्तों को आमंत्रित करें<br/>
                  <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">तीन स्तरीय कमीशन कमाएं</span>
                </h1>
                
                <p class="text-lg sm:text-xl text-gray-300 mb-8 max-w-xl">
                  टास्क पूरा करके पैसे कमाएं, दोस्तों को आमंत्रित करके कमीशन कमाएं! तीन स्तरीय वितरण प्रणाली से आपके दोस्तों के टास्क से भी आपको मिलेगा!
                </p>
                
                <div class="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <button 
                    id="download-btn-hero"
                    class="group flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-400/20"
                  >
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.523 15.341c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9m-11.046 0c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9m11.4-6.02l1.97-3.41a.41.41 0 00-.71-.41l-2 3.46c-1.54-.7-3.26-1.09-5.14-1.09s-3.6.39-5.14 1.09l-2-3.46a.41.41 0 00-.71.41l1.97 3.41C2.69 11.08.34 14.53 0 18.5h24c-.34-3.97-2.69-7.42-6.12-9.18"/>
                    </svg>
                    <span>ऐप डाउनलोड करें और कमाई शुरू करें</span>
                  </button>
                  
                  <button class="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                    <div class="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-yellow-400/50 transition-colors">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <span>वीडियो देखें</span>
                  </button>
                </div>
                
                <!-- Stats -->
                <div class="flex items-center gap-8 mt-12 justify-center lg:justify-start">
                  <div class="text-center">
                    <div class="text-3xl font-black text-yellow-400">10M+</div>
                    <div class="text-gray-500 text-sm">डाउनलोड</div>
                  </div>
                  <div class="w-px h-10 bg-white/10"></div>
                  <div class="text-center">
                    <div class="text-3xl font-black text-yellow-400">4.8</div>
                    <div class="text-gray-500 text-sm">रेटिंग</div>
                  </div>
                  <div class="w-px h-10 bg-white/10"></div>
                  <div class="text-center">
                    <div class="text-3xl font-black text-yellow-400">₹50K+</div>
                    <div class="text-gray-500 text-sm">दैनिक कमीशन</div>
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
                  <div class="absolute inset-0 w-64 h-full rounded-3xl bg-yellow-400 opacity-10 blur-3xl -z-10"></div>
                  
                  <!-- Floating Badge -->
                  <div class="absolute -right-4 top-1/4 bg-green-500 text-white text-sm font-bold py-2 px-4 rounded-full shadow-lg" style="animation: float 2s ease-in-out infinite 0.5s;">
                    +₹1000 आज का कमीशन
                  </div>
                  <div class="absolute -left-4 bottom-1/4 bg-yellow-500 text-black text-sm font-bold py-2 px-4 rounded-full shadow-lg" style="animation: float 2s ease-in-out infinite 1s;">
                    तीन स्तरीय कमीशन
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
                तीन स्तरीय <span class="text-yellow-400">कमीशन प्रणाली</span>
              </h2>
              <p class="text-gray-400 max-w-2xl mx-auto">
                दोस्तों को आमंत्रित करें और तीन स्तरों तक कमीशन कमाएं। आपका नेटवर्क जितना सक्रिय, उतना अधिक पासिव इनकम!
              </p>
            </div>
            
            <!-- Commission Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <!-- Level 1 -->
              <div class="relative bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 rounded-3xl p-6 border border-yellow-400/30 overflow-hidden group hover:border-yellow-400/50 transition-all">
                <div class="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl"></div>
                <div class="relative">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center overflow-hidden shadow-lg">
                      <img src="/avatar-level1.jpeg" alt="Level 1" class="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div class="text-white font-bold">पहला स्तर</div>
                      <div class="text-gray-400 text-sm">सीधे रेफरल</div>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <span class="text-gray-300">प्राप्ति टास्क कमीशन</span>
                      <span class="text-yellow-400 font-black text-2xl">1.0%</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-300">भुगतान टास्क कमीशन</span>
                      <span class="text-yellow-400 font-black text-2xl">0.8%</span>
                    </div>
                  </div>
                  <div class="mt-4 pt-4 border-t border-white/10">
                    <div class="text-sm text-gray-400">उदाहरण: ₹1000 टास्क पर</div>
                    <div class="text-yellow-400 font-bold text-lg">₹10 कमाएं</div>
                  </div>
                </div>
              </div>
              
              <!-- Level 2 -->
              <div class="relative bg-gradient-to-br from-green-400/20 to-green-600/10 rounded-3xl p-6 border border-green-400/30 overflow-hidden group hover:border-green-400/50 transition-all">
                <div class="absolute top-0 right-0 w-32 h-32 bg-green-400/10 rounded-full blur-3xl"></div>
                <div class="relative">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center overflow-hidden shadow-lg">
                      <img src="/avatar-level2.jpeg" alt="Level 2" class="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div class="text-white font-bold">दूसरा स्तर</div>
                      <div class="text-gray-400 text-sm">अप्रत्यक्ष रेफरल</div>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <span class="text-gray-300">प्राप्ति टास्क कमीशन</span>
                      <span class="text-green-400 font-black text-2xl">0.5%</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-300">भुगतान टास्क कमीशन</span>
                      <span class="text-green-400 font-black text-2xl">0.4%</span>
                    </div>
                  </div>
                  <div class="mt-4 pt-4 border-t border-white/10">
                    <div class="text-sm text-gray-400">उदाहरण: ₹1000 टास्क पर</div>
                    <div class="text-green-400 font-bold text-lg">₹5 कमाएं</div>
                  </div>
                </div>
              </div>
              
              <!-- Level 3 -->
              <div class="relative bg-gradient-to-br from-blue-400/20 to-blue-600/10 rounded-3xl p-6 border border-blue-400/30 overflow-hidden group hover:border-blue-400/50 transition-all">
                <div class="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"></div>
                <div class="relative">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center overflow-hidden shadow-lg">
                      <img src="/avatar-level3.jpeg" alt="Level 3" class="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div class="text-white font-bold">तीसरा स्तर</div>
                      <div class="text-gray-400 text-sm">दूर का रेफरल</div>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <span class="text-gray-300">प्राप्ति टास्क कमीशन</span>
                      <span class="text-blue-400 font-black text-2xl">0.3%</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-300">भुगतान टास्क कमीशन</span>
                      <span class="text-blue-400 font-black text-2xl">0.2%</span>
                    </div>
                  </div>
                  <div class="mt-4 pt-4 border-t border-white/10">
                    <div class="text-sm text-gray-400">उदाहरण: ₹1000 टास्क पर</div>
                    <div class="text-blue-400 font-bold text-lg">₹3 कमाएं</div>
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
                  <h4 class="text-white font-bold mb-2">कमाई का उदाहरण</h4>
                  <p class="text-gray-300 text-sm leading-relaxed">
                    आपने <span class="text-yellow-400 font-bold">A</span> को आमंत्रित किया, A ने <span class="text-green-400 font-bold">B</span> को, B ने <span class="text-blue-400 font-bold">C</span> को<br/>
                    • A ने ₹1000 का प्राप्ति टास्क किया → आपको <span class="text-yellow-400 font-bold">₹10</span><br/>
                    • B ने ₹1000 का प्राप्ति टास्क किया → आपको <span class="text-green-400 font-bold">₹5</span><br/>
                    • C ने ₹1000 का प्राप्ति टास्क किया → आपको <span class="text-blue-400 font-bold">₹3</span><br/>
                    <span class="text-white font-medium">पासिव इनकम: जब तक आपका नेटवर्क सक्रिय है, आप हर दिन कमीशन कमा रहे हैं!</span>
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
                दोहरी टास्क <span class="text-yellow-400">आसान कमाई</span>
              </h2>
              <p class="text-gray-400 max-w-2xl mx-auto">
                सरल टास्क, 30 मिनट में पूरा। प्राप्ति और भुगतान दोनों विकल्प, लचीली कमाई!
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
                    <h3 class="text-2xl font-bold text-white">प्राप्ति टास्क</h3>
                    <p class="text-green-400">पैसे प्राप्त करें और पुष्टि करें</p>
                  </div>
                </div>
                <div class="space-y-4">
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span class="text-gray-300">निर्दिष्ट खाते में पैसे प्राप्त करें</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span class="text-gray-300">प्राप्ति की पुष्टि करें और स्क्रीनशॉट अपलोड करें</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span class="text-gray-300">टास्क रिवार्ड + कमीशन प्राप्त करें</span>
                  </div>
                </div>
                <div class="mt-6 pt-6 border-t border-white/10">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-400">अनुमानित कमाई</span>
                    <span class="text-green-400 font-bold text-xl">प्रति टास्क +1%~2%</span>
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
                    <h3 class="text-2xl font-bold text-white">भुगतान टास्क</h3>
                    <p class="text-blue-400">निर्दिष्ट खाते में भुगतान करें</p>
                  </div>
                </div>
                <div class="space-y-4">
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span class="text-gray-300">निर्दिष्ट खाते में भुगतान करें</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span class="text-gray-300">भुगतान स्क्रीनशॉट अपलोड करें</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span class="text-gray-300">टास्क रिवार्ड + कमीशन प्राप्त करें</span>
                  </div>
                </div>
                <div class="mt-6 pt-6 border-t border-white/10">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-400">अनुमानित कमाई</span>
                    <span class="text-blue-400 font-bold text-xl">प्रति टास्क +0.8%~1.5%</span>
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
                कमाई <span class="text-yellow-400">कैलकुलेटर</span>
              </h2>
              <p class="text-gray-400">देखें आपका नेटवर्क कितना पासिव इनकम ला सकता है</p>
            </div>
            
            <div class="bg-white/5 rounded-3xl p-8 border border-white/10">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div>
                  <label class="block text-gray-400 text-sm mb-2">पहले स्तर के एजेंट</label>
                  <input type="number" id="level1-count" value="10" min="0" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xl font-bold focus:border-yellow-400/50 focus:outline-none" />
                </div>
                <div>
                  <label class="block text-gray-400 text-sm mb-2">प्रति दिन टास्क राशि (₹)</label>
                  <input type="number" id="daily-task" value="100" min="0" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xl font-bold focus:border-yellow-400/50 focus:outline-none" />
                </div>
                <div>
                  <label class="block text-gray-400 text-sm mb-2">आमंत्रण गुणक</label>
                  <input type="number" id="invite-multiplier" value="10" min="0" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xl font-bold focus:border-yellow-400/50 focus:outline-none" />
                </div>
              </div>
              
              <button id="calculate-btn" class="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] mb-8">
                मेरी कमाई की गणना करें
              </button>
              
              <!-- Results -->
              <div id="calc-results" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="bg-yellow-400/10 rounded-xl p-4 border border-yellow-400/20">
                  <div class="text-gray-400 text-sm mb-1">आपका नेटवर्क</div>
                  <div class="text-yellow-400 font-black text-3xl" id="network-count">1,110 लोग</div>
                  <div class="text-gray-500 text-xs">10 + 100 + 1000</div>
                </div>
                <div class="bg-green-400/10 rounded-xl p-4 border border-green-400/20">
                  <div class="text-gray-400 text-sm mb-1">दैनिक कमीशन</div>
                  <div class="text-green-400 font-black text-3xl" id="daily-income">₹360</div>
                  <div class="text-gray-500 text-xs">पासिव इनकम</div>
                </div>
                <div class="bg-blue-400/10 rounded-xl p-4 border border-blue-400/20">
                  <div class="text-gray-400 text-sm mb-1">मासिक कमीशन</div>
                  <div class="text-blue-400 font-black text-3xl" id="monthly-income">₹10,800</div>
                  <div class="text-gray-500 text-xs">30 दिनों की गणना</div>
                </div>
                <div class="bg-purple-400/10 rounded-xl p-4 border border-purple-400/20">
                  <div class="text-gray-400 text-sm mb-1">वार्षिक कमीशन</div>
                  <div class="text-purple-400 font-black text-3xl" id="yearly-income">₹131,400</div>
                  <div class="text-gray-500 text-xs">365 दिनों की गणना</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Leaderboard Section -->
        <section class="w-full py-16 px-4 bg-gradient-to-b from-transparent via-yellow-400/5 to-transparent">
          <div class="max-w-4xl mx-auto">
            <div class="text-center mb-8">
              <div class="inline-flex items-center gap-2 mb-4">
                <span class="text-4xl">🏆</span>
                <h2 class="text-2xl sm:text-3xl font-black text-white">
                  आज के टॉप कमीशन विनर्स
                </h2>
              </div>
              <div class="flex items-center justify-center gap-2 text-sm text-green-400">
                <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>Live Updates - हर 5 मिनट में अपडेट</span>
              </div>
            </div>
            
            <!-- Leaderboard Table -->
            <div class="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
              <!-- Header -->
              <div class="grid grid-cols-12 gap-4 px-4 sm:px-6 py-3 bg-white/5 border-b border-white/10 text-gray-400 text-sm">
                <div class="col-span-1 text-center">रैंक</div>
                <div class="col-span-5">यूज़र</div>
                <div class="col-span-3 text-right hidden sm:block">शहर</div>
                <div class="col-span-6 sm:col-span-3 text-right">आज की कमाई</div>
              </div>
              
              <!-- Rank 1 -->
              <div class="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 items-center border-b border-white/5 hover:bg-yellow-400/5 transition-colors">
                <div class="col-span-1 text-center">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mx-auto shadow-lg shadow-yellow-400/30">
                    <span class="text-black font-black text-sm">1</span>
                  </div>
                </div>
                <div class="col-span-5 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">NG</div>
                  <span class="text-white font-medium">Neha G.</span>
                </div>
                <div class="col-span-3 text-right text-gray-400 text-sm hidden sm:block">Pune</div>
                <div class="col-span-6 sm:col-span-3 text-right">
                  <span class="text-yellow-400 font-bold text-lg">₹6,836</span>
                </div>
              </div>
              
              <!-- Rank 2 -->
              <div class="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 items-center border-b border-white/5 hover:bg-green-400/5 transition-colors">
                <div class="col-span-1 text-center">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center mx-auto shadow-lg">
                    <span class="text-black font-black text-sm">2</span>
                  </div>
                </div>
                <div class="col-span-5 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">AV</div>
                  <span class="text-white font-medium">Amit V.</span>
                </div>
                <div class="col-span-3 text-right text-gray-400 text-sm hidden sm:block">Bangalore</div>
                <div class="col-span-6 sm:col-span-3 text-right">
                  <span class="text-green-400 font-bold text-lg">₹6,729</span>
                </div>
              </div>
              
              <!-- Rank 3 -->
              <div class="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 items-center border-b border-white/5 hover:bg-orange-400/5 transition-colors">
                <div class="col-span-1 text-center">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mx-auto shadow-lg shadow-orange-400/30">
                    <span class="text-black font-black text-sm">3</span>
                  </div>
                </div>
                <div class="col-span-5 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">RK</div>
                  <span class="text-white font-medium">Rahul K.</span>
                </div>
                <div class="col-span-3 text-right text-gray-400 text-sm hidden sm:block">Mumbai</div>
                <div class="col-span-6 sm:col-span-3 text-right">
                  <span class="text-orange-400 font-bold text-lg">₹4,425</span>
                </div>
              </div>
              
              <!-- Rank 4 -->
              <div class="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors">
                <div class="col-span-1 text-center">
                  <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                    <span class="text-gray-400 font-bold text-sm">4</span>
                  </div>
                </div>
                <div class="col-span-5 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-sm">VM</div>
                  <span class="text-white font-medium">Vikram M.</span>
                </div>
                <div class="col-span-3 text-right text-gray-400 text-sm hidden sm:block">Chennai</div>
                <div class="col-span-6 sm:col-span-3 text-right">
                  <span class="text-white font-bold">₹4,072</span>
                </div>
              </div>
              
              <!-- Rank 5 -->
              <div class="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors">
                <div class="col-span-1 text-center">
                  <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                    <span class="text-gray-400 font-bold text-sm">5</span>
                  </div>
                </div>
                <div class="col-span-5 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">DN</div>
                  <span class="text-white font-medium">Deepa N.</span>
                </div>
                <div class="col-span-3 text-right text-gray-400 text-sm hidden sm:block">Jaipur</div>
                <div class="col-span-6 sm:col-span-3 text-right">
                  <span class="text-white font-bold">₹3,985</span>
                </div>
              </div>
              
              <!-- Rank 6 -->
              <div class="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors">
                <div class="col-span-1 text-center">
                  <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                    <span class="text-gray-400 font-bold text-sm">6</span>
                  </div>
                </div>
                <div class="col-span-5 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">PS</div>
                  <span class="text-white font-medium">Priya S.</span>
                </div>
                <div class="col-span-3 text-right text-gray-400 text-sm hidden sm:block">Delhi</div>
                <div class="col-span-6 sm:col-span-3 text-right">
                  <span class="text-white font-bold">₹3,931</span>
                </div>
              </div>
              
              <!-- Rank 7 -->
              <div class="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors">
                <div class="col-span-1 text-center">
                  <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                    <span class="text-gray-400 font-bold text-sm">7</span>
                  </div>
                </div>
                <div class="col-span-5 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">AR</div>
                  <span class="text-white font-medium">Anjali R.</span>
                </div>
                <div class="col-span-3 text-right text-gray-400 text-sm hidden sm:block">Hyderabad</div>
                <div class="col-span-6 sm:col-span-3 text-right">
                  <span class="text-white font-bold">₹3,883</span>
                </div>
              </div>
              
              <!-- Rank 8 -->
              <div class="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 items-center hover:bg-white/5 transition-colors">
                <div class="col-span-1 text-center">
                  <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                    <span class="text-gray-400 font-bold text-sm">8</span>
                  </div>
                </div>
                <div class="col-span-5 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">SP</div>
                  <span class="text-white font-medium">Suresh P.</span>
                </div>
                <div class="col-span-3 text-right text-gray-400 text-sm hidden sm:block">Kolkata</div>
                <div class="col-span-6 sm:col-span-3 text-right">
                  <span class="text-white font-bold">₹3,165</span>
                </div>
              </div>
            </div>
            
            <!-- CTA below leaderboard -->
            <div class="text-center mt-6">
              <p class="text-gray-400 text-sm mb-4">अपना नाम इस लिस्ट में देखना चाहते हैं?</p>
              <button 
                id="download-btn-leaderboard"
                class="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <span>अभी शुरू करें</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </button>
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="w-full py-16 px-4">
          <div class="max-w-4xl mx-auto">
            <div class="bg-gradient-to-r from-yellow-400/20 via-yellow-500/10 to-yellow-400/20 rounded-3xl p-8 sm:p-12 border border-yellow-400/30 text-center">
              <h2 class="text-3xl sm:text-4xl font-black text-white mb-4">
                अपनी पासिव इनकम यात्रा शुरू करें
              </h2>
              <p class="text-gray-300 mb-8 max-w-2xl mx-auto">
                अभी 9INR डाउनलोड करें, आमंत्रण कोड डालें और कमाई शुरू करें। दोस्तों को आमंत्रित करें, तीन स्तरीय कमीशन का आनंद लें!
              </p>
              <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  id="download-btn-cta"
                  class="flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-400/30"
                >
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.523 15.341c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9m-11.046 0c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9m11.4-6.02l1.97-3.41a.41.41 0 00-.71-.41l-2 3.46c-1.54-.7-3.26-1.09-5.14-1.09s-3.6.39-5.14 1.09l-2-3.46a.41.41 0 00-.71.41l1.97 3.41C2.69 11.08.34 14.53 0 18.5h24c-.34-3.97-2.69-7.42-6.12-9.18"/>
                  </svg>
                  <span>अभी ऐप डाउनलोड करें</span>
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
              <a href="#" class="hover:text-yellow-400 transition-colors">गोपनीयता नीति</a>
              <a href="#" class="hover:text-yellow-400 transition-colors">सेवा की शर्तें</a>
              <a href="#" class="hover:text-yellow-400 transition-colors">संपर्क करें</a>
            </div>
            <div class="text-gray-500 text-sm">
              © 2024 9INR. सर्वाधिकार सुरक्षित।
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
  document.getElementById('download-btn-leaderboard')?.addEventListener('click', () => handleDownload('android'));

  // Calculator functionality
  document.getElementById('calculate-btn')?.addEventListener('click', () => {
    const level1 = parseInt((document.getElementById('level1-count') as HTMLInputElement)?.value || '0');
    const dailyTask = parseInt((document.getElementById('daily-task') as HTMLInputElement)?.value || '0');
    const multiplier = parseInt((document.getElementById('invite-multiplier') as HTMLInputElement)?.value || '0');
    
    const level2 = level1 * multiplier;
    const level3 = level2 * multiplier;
    const network = level1 + level2 + level3;
    
    const dailyIncome = (level1 * dailyTask * 0.01) + (level2 * dailyTask * 0.005) + (level3 * dailyTask * 0.003);
    const monthlyIncome = dailyIncome * 30;
    const yearlyIncome = dailyIncome * 365;
    
    (document.getElementById('network-count') as HTMLElement).textContent = network.toLocaleString() + ' लोग';
    (document.getElementById('daily-income') as HTMLElement).textContent = '₹' + Math.round(dailyIncome).toLocaleString();
    (document.getElementById('monthly-income') as HTMLElement).textContent = '₹' + Math.round(monthlyIncome).toLocaleString();
    (document.getElementById('yearly-income') as HTMLElement).textContent = '₹' + Math.round(yearlyIncome).toLocaleString();
  });

  // Start commission notification system
  startNotificationSystem();
  
  // Initialize chat widget
  initChatWidget();
}
