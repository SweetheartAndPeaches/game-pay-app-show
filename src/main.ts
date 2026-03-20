export function initApp(): void {
  const app = document.getElementById('app');

  if (!app) {
    console.error('App element not found');
    return;
  }

  app.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
      <!-- Header -->
      <header class="w-full py-6 px-4 sm:px-8">
        <div class="max-w-6xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
              <span class="text-black font-bold text-xl">9</span>
            </div>
            <span class="text-white font-bold text-xl">9INR</span>
          </div>
          <nav class="hidden sm:flex items-center gap-6">
            <a href="#features" class="text-gray-300 hover:text-yellow-400 transition-colors">विशेषताएं</a>
            <a href="#download" class="text-gray-300 hover:text-yellow-400 transition-colors">डाउनलोड</a>
            <a href="#about" class="text-gray-300 hover:text-yellow-400 transition-colors">हमारे बारे में</a>
          </nav>
        </div>
      </header>

      <!-- Hero Section -->
      <main class="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div class="max-w-6xl mx-auto text-center">
          <!-- App Icon -->
          <div class="mb-8 relative inline-block">
            <div class="w-48 h-48 sm:w-56 sm:h-56 rounded-[3rem] bg-gradient-to-br from-gray-800 to-black p-1 shadow-2xl" style="animation: float 3s ease-in-out infinite;">
              <div class="w-full h-full rounded-[2.75rem] bg-black flex flex-col items-center justify-center overflow-hidden relative">
                <!-- Black circle with 9 -->
                <div class="absolute top-0 w-full h-[75%] bg-black rounded-t-[2.75rem] flex items-center justify-center">
                  <div class="relative">
                    <span class="text-[120px] sm:text-[140px] font-black" style="color: #FFD700; -webkit-text-stroke: 3px black;">9</span>
                  </div>
                </div>
                <!-- Yellow arc at bottom -->
                <div class="absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-yellow-400 to-yellow-500 rounded-b-[2.75rem] flex items-center justify-center">
                  <span class="text-black font-bold text-sm sm:text-base tracking-wide">9INR.VIP</span>
                </div>
              </div>
            </div>
            <!-- Glow effect -->
            <div class="absolute inset-0 w-48 h-48 sm:w-56 sm:h-56 rounded-[3rem] bg-yellow-400 opacity-20 blur-3xl -z-10"></div>
          </div>

          <!-- Title -->
          <h1 class="text-4xl sm:text-6xl font-black text-white mb-4">
            <span class="text-yellow-400">9INR</span> ऐप
          </h1>
          <p class="text-xl sm:text-2xl text-gray-300 mb-2">
            भारत का सबसे लोकप्रिय मनोरंजन ऐप
          </p>
          <p class="text-lg text-gray-400 mb-8">
            अपने मोबाइल में अनगिनत मनोरंजन की दुनिया
          </p>

          <!-- Download Buttons -->
          <div id="download" class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button 
              onclick="handleDownload('android')"
              class="group flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              style="animation: pulse-glow 2s ease-in-out infinite;"
            >
              <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.523 15.341c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9m-11.046 0c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9m11.4-6.02l1.97-3.41a.41.41 0 00-.71-.41l-2 3.46c-1.54-.7-3.26-1.09-5.14-1.09s-3.6.39-5.14 1.09l-2-3.46a.41.41 0 00-.71.41l1.97 3.41C2.69 11.08.34 14.53 0 18.5h24c-.34-3.97-2.69-7.42-6.12-9.18"/>
              </svg>
              <div class="text-left">
                <div class="text-xs opacity-80">Android के लिए</div>
                <div class="text-lg">डाउनलोड करें</div>
              </div>
            </button>
            
            <button 
              onclick="handleDownload('ios')"
              class="group flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 border border-white/20"
            >
              <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div class="text-left">
                <div class="text-xs opacity-80">iOS के लिए</div>
                <div class="text-lg">ऐप स्टोर</div>
              </div>
            </button>
          </div>

          <!-- Stats -->
          <div class="flex flex-wrap items-center justify-center gap-8 sm:gap-16 mb-16">
            <div class="text-center">
              <div class="text-3xl sm:text-4xl font-black text-yellow-400">10M+</div>
              <div class="text-gray-400">डाउनलोड</div>
            </div>
            <div class="text-center">
              <div class="text-3xl sm:text-4xl font-black text-yellow-400">4.8</div>
              <div class="text-gray-400">रेटिंग</div>
            </div>
            <div class="text-center">
              <div class="text-3xl sm:text-4xl font-black text-yellow-400">50K+</div>
              <div class="text-gray-400">सक्रिय उपयोगकर्ता</div>
            </div>
          </div>
        </div>

        <!-- Features Section -->
        <div id="features" class="w-full max-w-6xl mx-auto px-4">
          <h2 class="text-2xl sm:text-3xl font-bold text-white text-center mb-8">विशेषताएं</h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-yellow-400/50 transition-all">
              <div class="w-12 h-12 rounded-xl bg-yellow-400/20 flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-white mb-2">तेज़ प्रदर्शन</h3>
              <p class="text-gray-400 text-sm">बिजली की गति से चलने वाला ऐप, कोई लैग नहीं</p>
            </div>
            
            <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-yellow-400/50 transition-all">
              <div class="w-12 h-12 rounded-xl bg-yellow-400/20 flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-white mb-2">सुरक्षित और सुरक्षित</h3>
              <p class="text-gray-400 text-sm">आपका डेटा हमेशा सुरक्षित रहता है</p>
            </div>
            
            <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-yellow-400/50 transition-all">
              <div class="w-12 h-12 rounded-xl bg-yellow-400/20 flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-white mb-2">उपयोग में आसान</h3>
              <p class="text-gray-400 text-sm">सरल और सहज उपयोगकर्ता इंटरफेस</p>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer id="about" class="w-full py-8 px-4 border-t border-white/10">
        <div class="max-w-6xl mx-auto text-center">
          <div class="flex items-center justify-center gap-2 mb-4">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
              <span class="text-black font-bold text-sm">9</span>
            </div>
            <span class="text-white font-bold">9INR.VIP</span>
          </div>
          <p class="text-gray-400 text-sm mb-4">© 2024 9INR. सर्वाधिकार सुरक्षित।</p>
          <div class="flex items-center justify-center gap-6 text-gray-400 text-sm">
            <a href="#" class="hover:text-yellow-400 transition-colors">गोपनीयता नीति</a>
            <a href="#" class="hover:text-yellow-400 transition-colors">सेवा की शर्तें</a>
            <a href="#" class="hover:text-yellow-400 transition-colors">संपर्क करें</a>
          </div>
        </div>
      </footer>
    </div>

    <script>
      function handleDownload(platform) {
        // Create download modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4';
        modal.onclick = (e) => {
          if (e.target === modal) modal.remove();
        };
        
        modal.innerHTML = \`
          <div class="bg-gray-900 rounded-3xl p-8 max-w-md w-full border border-yellow-400/30 shadow-2xl">
            <div class="text-center">
              <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mx-auto mb-4">
                <span class="text-black font-black text-4xl">9</span>
              </div>
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
              
              <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-white transition-colors">
                बंद करें
              </button>
            </div>
          </div>
        \`;
        
        document.body.appendChild(modal);
        
        // Simulate download progress
        const progressBar = document.getElementById('progress-bar');
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          if (progressBar) progressBar.style.width = progress + '%';
          if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              // Trigger actual download
              const link = document.createElement('a');
              link.href = '#';
              link.download = '9INR-' + platform + '.apk';
              link.click();
              
              // Update modal
              const progressText = modal.querySelector('.text-yellow-400 span');
              if (progressText) progressText.textContent = 'डाउनलोड पूरा हुआ!';
            }, 500);
          }
        }, 200);
      }
    </script>
  `;
}
