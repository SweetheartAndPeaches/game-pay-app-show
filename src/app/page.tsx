'use client';

import { useState } from 'react';
import TriangleBackground from '@/components/TriangleBackground';
import ChatWidget from '@/components/ChatWidget';
import CommissionNotification from '@/components/CommissionNotification';
import VideoModal from '@/components/VideoModal';
import { useSecurity } from '@/hooks/useSecurity';

// Download frequency limit
const DOWNLOAD_LIMIT = 3;
const DOWNLOAD_COOLDOWN = 10 * 1000;

// Promo video URL (pre-generated)
const PROMO_VIDEO_URL = 'https://d1lpd5tr8ui3gv.cloudfront.net/web/9inr/video_generate_9inr.mp4';

export default function Home() {
  useSecurity();
  
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitMessage, setLimitMessage] = useState('');
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Calculator state
  const [level1Count, setLevel1Count] = useState(10);
  const [dailyTask, setDailyTask] = useState(100);
  const [inviteMultiplier, setInviteMultiplier] = useState(10);
  const [networkCount, setNetworkCount] = useState('1,110 लोग');
  const [dailyIncome, setDailyIncome] = useState('₹360');
  const [monthlyIncome, setMonthlyIncome] = useState('₹10,800');

  // Download tracking
  const [lastDownloadTime, setLastDownloadTime] = useState(0);
  const [downloadCount, setDownloadCount] = useState(0);
  const [downloadCountResetTime, setDownloadCountResetTime] = useState(Date.now() + 60 * 60 * 1000);

  const canDownload = (): { allowed: boolean; message: string } => {
    const now = Date.now();
    
    if (now > downloadCountResetTime) {
      setDownloadCount(0);
      setDownloadCountResetTime(now + 60 * 60 * 1000);
    }
    
    if (now - lastDownloadTime < DOWNLOAD_COOLDOWN) {
      const remainingSeconds = Math.ceil((DOWNLOAD_COOLDOWN - (now - lastDownloadTime)) / 1000);
      return { allowed: false, message: `कृपया ${remainingSeconds} सेकंड प्रतीक्षा करें` };
    }
    
    if (downloadCount >= DOWNLOAD_LIMIT) {
      const resetMinutes = Math.ceil((downloadCountResetTime - now) / 60000);
      return { allowed: false, message: `प्रति घंटे अधिकतम ${DOWNLOAD_LIMIT} बार डाउनलोड कर सकते हैं, ${resetMinutes} मिनट बाद पुनः प्रयास करें` };
    }
    
    return { allowed: true, message: '' };
  };

  const handleDownload = () => {
    const { allowed, message } = canDownload();
    if (!allowed) {
      setLimitMessage(message);
      setShowLimitModal(true);
      return;
    }
    
    setLastDownloadTime(Date.now());
    setDownloadCount(prev => prev + 1);
    
    // 打开APK下载链接
    window.open('https://d1lpd5tr8ui3gv.cloudfront.net/web/9inr/9inr.apk', '_blank');
  };

  const calculateEarnings = () => {
    const level2Count = level1Count * inviteMultiplier;
    const total = level1Count + level2Count;
    
    // 只有代付任务有佣金
    const daily = Math.round(
      level1Count * dailyTask * 0.008 +
      level2Count * dailyTask * 0.004
    );
    
    setNetworkCount(`${total.toLocaleString()} लोग`);
    setDailyIncome(`₹${daily.toLocaleString()}`);
    setMonthlyIncome(`₹${(daily * 30).toLocaleString()}`);
  };

  return (
    <main className="relative min-h-screen">
      {/* Background Animation */}
      <TriangleBackground />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="w-full py-4 px-4 sm:px-8 sticky top-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/app-icon.png"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <span className="text-white font-bold text-xl">9INR</span>
              <span className="hidden sm:inline-block bg-yellow-400/20 text-yellow-400 text-xs px-2 py-1 rounded-full">टास्क प्लेटफॉर्म</span>
            </div>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6">
                <a href="#commission" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">कमीशन सिस्टम</a>
                <a href="#tasks" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">टास्क सिस्टम</a>
                <a href="#calculator" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">कमाई कैलकुलेटर</a>
              </nav>
              <button 
                onClick={handleDownload}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 text-sm"
              >
                अभी डाउनलोड करें
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="w-full py-16 sm:py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Left Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-2 mb-6">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                  <span className="text-yellow-400 text-sm font-medium">दो स्तरीय कमीशन · पासिव इनकम</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                  दोस्तों को आमंत्रित करें<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">कमीशन कमाएं</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-xl">
                  भुगतान टास्क से पैसे कमाएं, दोस्तों को आमंत्रित करके अतिरिक्त कमीशन पाएं! दो स्तरीय रेफरल सिस्टम से आपकी कमाई बढ़ेगी!
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <button 
                    onClick={handleDownload}
                    className="group flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-400/20"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.523 15.341c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9m-11.046 0c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9m11.4-6.02l1.97-3.41a.41.41 0 00-.71-.41l-2 3.46c-1.54-.7-3.26-1.09-5.14-1.09s-3.6.39-5.14 1.09l-2-3.46a.41.41 0 00-.71.41l1.97 3.41C2.69 11.08.34 14.53 0 18.5h24c-.34-3.97-2.69-7.42-6.12-9.18"/>
                    </svg>
                    <span>ऐप डाउनलोड करें और कमाई शुरू करें</span>
                  </button>
                  
                  <button 
                    onClick={() => setShowVideoModal(true)}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-yellow-400/50 hover:bg-yellow-400/10 transition-all">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <span>वीडियो देखें</span>
                  </button>
                </div>
                
                {/* Stats */}
                <div className="flex items-center gap-8 mt-12 justify-center lg:justify-start">
                  <div className="text-center">
                    <div className="text-3xl font-black text-yellow-400">10M+</div>
                    <div className="text-gray-500 text-sm">डाउनलोड</div>
                  </div>
                  <div className="w-px h-10 bg-white/10"></div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-yellow-400">4.8</div>
                    <div className="text-gray-500 text-sm">रेटिंग</div>
                  </div>
                  <div className="w-px h-10 bg-white/10"></div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-yellow-400">₹50K+</div>
                    <div className="text-gray-500 text-sm">दैनिक कमीशन</div>
                  </div>
                </div>
              </div>
              
              {/* Right - App Preview */}
              <div className="flex-1 flex justify-center">
                <div className="relative">
                  <div className="w-64 h-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10" style={{ animation: 'float 3s ease-in-out infinite' }}>
                    <img 
                      src="/app-icon.png"
                      alt="9INR App"
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="absolute inset-0 w-64 h-full rounded-3xl bg-yellow-400 opacity-10 blur-3xl -z-10"></div>
                  
                  {/* Floating Badges */}
                  <div className="absolute -right-4 top-1/4 bg-green-500 text-white text-sm font-bold py-2 px-4 rounded-full shadow-lg" style={{ animation: 'float 2s ease-in-out infinite 0.5s' }}>
                    +₹1000 आज का कमीशन
                  </div>
                  <div className="absolute -left-4 bottom-1/4 bg-yellow-500 text-black text-sm font-bold py-2 px-4 rounded-full shadow-lg" style={{ animation: 'float 2s ease-in-out infinite 1s' }}>
                    दो स्तरीय कमीशन
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Commission System Section */}
        <section id="commission" className="w-full py-16 px-4 bg-gradient-to-b from-transparent via-yellow-400/5 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                दोस्तों को आमंत्रित करें <span className="text-yellow-400">कमीशन कमाएं</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                आमंत्रित किए गए दोस्तों के भुगतान टास्क से आपको कमीशन मिलता है। जितने अधिक दोस्त, उतनी अधिक कमाई!
              </p>
            </div>
            
            {/* Commission Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
              {/* Level 1 */}
              <div className="relative bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 rounded-3xl p-6 border border-yellow-400/30 overflow-hidden group hover:border-yellow-400/50 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center overflow-hidden shadow-lg">
                      <img src="/avatar-level1.jpeg" alt="Level 1" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-white font-bold">पहला स्तर</div>
                      <div className="text-gray-400 text-sm">सीधे रेफरल</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">भुगतान टास्क कमीशन</span>
                      <span className="text-yellow-400 font-black text-2xl">0.8%</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-sm text-gray-400">उदाहरण: ₹1000 भुगतान टास्क पर</div>
                    <div className="text-yellow-400 font-bold text-lg">₹8 कमाएं</div>
                  </div>
                </div>
              </div>
              
              {/* Level 2 */}
              <div className="relative bg-gradient-to-br from-green-400/20 to-green-600/10 rounded-3xl p-6 border border-green-400/30 overflow-hidden group hover:border-green-400/50 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/10 rounded-full blur-3xl"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center overflow-hidden shadow-lg">
                      <img src="/avatar-level2.jpeg" alt="Level 2" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-white font-bold">दूसरा स्तर</div>
                      <div className="text-gray-400 text-sm">रेफरल का रेफरल</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">भुगतान टास्क कमीशन</span>
                      <span className="text-green-400 font-black text-2xl">0.4%</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-sm text-gray-400">उदाहरण: ₹1000 भुगतान टास्क पर</div>
                    <div className="text-green-400 font-bold text-lg">₹4 कमाएं</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Example */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 max-w-2xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💡</span>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">कमाई का उदाहरण</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    आपने <span className="text-yellow-400 font-bold">A</span> को आमंत्रित किया, A ने <span className="text-green-400 font-bold">B</span> को आमंत्रित किया<br/>
                    • A ने ₹5000 का भुगतान टास्क किया → आपको <span className="text-yellow-400 font-bold">₹40</span><br/>
                    • B ने ₹5000 का भुगतान टास्क किया → आपको <span className="text-green-400 font-bold">₹20</span><br/>
                    <span className="text-white font-medium">केवल भुगतान टास्क से ही कमीशन मिलता है!</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Task System Section */}
        <section id="tasks" className="w-full py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                दोहरी टास्क <span className="text-yellow-400">आसान कमाई</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                सरल टास्क, 30 मिनट में पूरा। प्राप्ति और भुगतान दोनों विकल्प, लचीली कमाई!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 代收任务 */}
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-3xl p-8 border border-green-500/20 hover:border-green-500/40 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">प्राप्ति टास्क</h3>
                    <p className="text-green-400">पैसे प्राप्त करें और पुष्टि करें</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300">निर्दिष्ट खाते में पैसे प्राप्त करें</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300">प्राप्ति की पुष्टि करें और स्क्रीनशॉट अपलोड करें</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300">टास्क रिवार्ड प्राप्त करें (कोई कमीशन नहीं)</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">अनुमानित कमाई</span>
                    <span className="text-green-400 font-bold text-xl">प्रति टास्क ₹50~200</span>
                  </div>
                </div>
              </div>
              
              {/* 代付任务 */}
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-3xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">भुगतान टास्क</h3>
                    <p className="text-blue-400">निर्दिष्ट खाते में भुगतान करें</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300">निर्दिष्ट खाते में भुगतान करें</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300">भुगतान स्क्रीनशॉट अपलोड करें</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300">टास्क रिवार्ड + कमीशन प्राप्त करें</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">अनुमानित कमाई</span>
                    <span className="text-blue-400 font-bold text-xl">प्रति टास्क +0.8%~1.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section id="calculator" className="w-full py-16 px-4 bg-gradient-to-b from-transparent via-yellow-400/5 to-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                कमाई <span className="text-yellow-400">कैलकुलेटर</span>
              </h2>
              <p className="text-gray-400">देखें आपका नेटवर्क कितना पासिव इनकम ला सकता है</p>
            </div>
            
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">पहले स्तर के एजेंट</label>
                  <input 
                    type="number" 
                    value={level1Count}
                    onChange={(e) => setLevel1Count(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xl font-bold focus:border-yellow-400/50 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">प्रति दिन टास्क राशि (₹)</label>
                  <input 
                    type="number" 
                    value={dailyTask}
                    onChange={(e) => setDailyTask(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xl font-bold focus:border-yellow-400/50 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">आमंत्रण गुणक</label>
                  <input 
                    type="number" 
                    value={inviteMultiplier}
                    onChange={(e) => setInviteMultiplier(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xl font-bold focus:border-yellow-400/50 focus:outline-none" 
                  />
                </div>
              </div>
              
              <button 
                onClick={calculateEarnings}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] mb-8"
              >
                मेरी कमाई की गणना करें
              </button>
              
              {/* Results */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-yellow-400/10 rounded-xl p-4 border border-yellow-400/20">
                  <div className="text-gray-400 text-sm mb-1">आपका नेटवर्क</div>
                  <div className="text-yellow-400 font-black text-3xl">{networkCount}</div>
                  <div className="text-gray-500 text-xs">10 + 100 + 1000</div>
                </div>
                <div className="bg-green-400/10 rounded-xl p-4 border border-green-400/20">
                  <div className="text-gray-400 text-sm mb-1">दैनिक कमीशन</div>
                  <div className="text-green-400 font-black text-3xl">{dailyIncome}</div>
                  <div className="text-gray-500 text-xs">पासिव इनकम</div>
                </div>
                <div className="bg-blue-400/10 rounded-xl p-4 border border-blue-400/20 col-span-1 sm:col-span-2">
                  <div className="text-gray-400 text-sm mb-1">मासिक कमीशन</div>
                  <div className="text-blue-400 font-black text-3xl">{monthlyIncome}</div>
                  <div className="text-gray-500 text-xs">बिना कुछ किए हर महीने कमाएं!</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Leaderboard Section */}
        <section className="w-full py-16 px-4 bg-gradient-to-b from-transparent via-yellow-400/5 to-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="text-4xl">🏆</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  आज के टॉप कमीशन विनर्स
                </h2>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>Live Updates - हर 5 मिनट में अपडेट</span>
              </div>
            </div>
            
            {/* Leaderboard Table */}
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-3 bg-white/5 border-b border-white/10 text-gray-400 text-sm">
                <div className="col-span-1 text-center">रैंक</div>
                <div className="col-span-5">यूज़र</div>
                <div className="col-span-3 text-right hidden sm:block">शहर</div>
                <div className="col-span-6 sm:col-span-3 text-right">आज की कमाई</div>
              </div>
              
              {/* Rank 1 */}
              <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 items-center border-b border-white/5 hover:bg-yellow-400/5 transition-colors">
                <div className="col-span-1 text-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mx-auto shadow-lg shadow-yellow-400/30">
                    <span className="text-black font-black text-sm">1</span>
                  </div>
                </div>
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">NG</div>
                  <span className="text-white font-medium">Neha G.</span>
                </div>
                <div className="col-span-3 text-right text-gray-400 text-sm hidden sm:block">Pune</div>
                <div className="col-span-6 sm:col-span-3 text-right">
                  <span className="text-yellow-400 font-bold text-lg">₹6,836</span>
                </div>
              </div>
              
              {/* Rank 2 */}
              <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 items-center border-b border-white/5 hover:bg-gray-400/5 transition-colors">
                <div className="col-span-1 text-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-black font-black text-sm">2</span>
                  </div>
                </div>
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">AV</div>
                  <span className="text-white font-medium">Amit V.</span>
                </div>
                <div className="col-span-3 text-right text-gray-400 text-sm hidden sm:block">Bangalore</div>
                <div className="col-span-6 sm:col-span-3 text-right">
                  <span className="text-gray-300 font-bold text-lg">₹6,729</span>
                </div>
              </div>
              
              {/* Rank 3 */}
              <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 items-center border-b border-white/5 hover:bg-orange-400/5 transition-colors">
                <div className="col-span-1 text-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mx-auto shadow-lg shadow-orange-400/30">
                    <span className="text-black font-black text-sm">3</span>
                  </div>
                </div>
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">RK</div>
                  <span className="text-white font-medium">Rahul K.</span>
                </div>
                <div className="col-span-3 text-right text-gray-400 text-sm hidden sm:block">Mumbai</div>
                <div className="col-span-6 sm:col-span-3 text-right">
                  <span className="text-orange-400 font-bold text-lg">₹4,425</span>
                </div>
              </div>
              
              {/* Rank 4 */}
              <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors">
                <div className="col-span-1 text-center">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                    <span className="text-gray-400 font-bold text-sm">4</span>
                  </div>
                </div>
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-sm">VM</div>
                  <span className="text-white font-medium">Vikram M.</span>
                </div>
                <div className="col-span-3 text-right text-gray-400 text-sm hidden sm:block">Chennai</div>
                <div className="col-span-6 sm:col-span-3 text-right">
                  <span className="text-white font-bold">₹4,072</span>
                </div>
              </div>
              
              {/* Rank 5 */}
              <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors">
                <div className="col-span-1 text-center">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                    <span className="text-gray-400 font-bold text-sm">5</span>
                  </div>
                </div>
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">PS</div>
                  <span className="text-white font-medium">Priya S.</span>
                </div>
                <div className="col-span-3 text-right text-gray-400 text-sm hidden sm:block">Delhi</div>
                <div className="col-span-6 sm:col-span-3 text-right">
                  <span className="text-white font-bold">₹3,951</span>
                </div>
              </div>
              
              {/* Rank 6 */}
              <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors">
                <div className="col-span-1 text-center">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                    <span className="text-gray-400 font-bold text-sm">6</span>
                  </div>
                </div>
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">DK</div>
                  <span className="text-white font-medium">Deepa K.</span>
                </div>
                <div className="col-span-3 text-right text-gray-400 text-sm hidden sm:block">Jaipur</div>
                <div className="col-span-6 sm:col-span-3 text-right">
                  <span className="text-white font-bold">₹3,883</span>
                </div>
              </div>
              
              {/* Rank 7 */}
              <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors">
                <div className="col-span-1 text-center">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                    <span className="text-gray-400 font-bold text-sm">7</span>
                  </div>
                </div>
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-600 flex items-center justify-center text-white font-bold text-sm">AR</div>
                  <span className="text-white font-medium">Anjali R.</span>
                </div>
                <div className="col-span-3 text-right text-gray-400 text-sm hidden sm:block">Hyderabad</div>
                <div className="col-span-6 sm:col-span-3 text-right">
                  <span className="text-white font-bold">₹3,165</span>
                </div>
              </div>
              
              {/* Rank 8 */}
              <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 items-center hover:bg-white/5 transition-colors">
                <div className="col-span-1 text-center">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                    <span className="text-gray-400 font-bold text-sm">8</span>
                  </div>
                </div>
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">SP</div>
                  <span className="text-white font-medium">Suresh P.</span>
                </div>
                <div className="col-span-3 text-right text-gray-400 text-sm hidden sm:block">Kolkata</div>
                <div className="col-span-6 sm:col-span-3 text-right">
                  <span className="text-white font-bold">₹3,165</span>
                </div>
              </div>
            </div>
            
            {/* CTA below leaderboard */}
            <div className="text-center mt-6">
              <p className="text-gray-400 text-sm mb-4">अपना नाम इस लिस्ट में देखना चाहते हैं?</p>
              <button 
                onClick={handleDownload}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <span>अभी शुरू करें</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-yellow-400/20 via-yellow-500/10 to-yellow-400/20 rounded-3xl p-8 sm:p-12 border border-yellow-400/30 text-center">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                अपनी पासिव इनकम यात्रा शुरू करें
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                आज ही 9INR डाउनलोड करें और तीन स्तरीय कमीशन प्रणाली से पासिव इनकम कमाना शुरू करें। अपने दोस्तों को आमंत्रित करें और उनकी कमाई से भी कमीशन पाएं!
              </p>
              <button 
                onClick={handleDownload}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-4 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-400/20 text-lg"
              >
                अभी डाउनलोड करें 🚀
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-8 px-4 border-t border-white/5">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-500 text-sm">
              © 2024 9INR. All rights reserved. | भारत का सबसे भरोसेमंद टास्क प्लेटफॉर्म
            </p>
          </div>
        </footer>
      </div>

      {/* Chat Widget */}
      <ChatWidget />

      {/* Commission Notification */}
      <CommissionNotification />

      {/* Limit Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && setShowLimitModal(false)}>
          <div className="bg-gray-900 rounded-3xl p-8 max-w-md w-full border border-red-400/30 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">डाउनलोड सीमित</h3>
              <p className="text-gray-400 mb-6">{limitMessage}</p>
              <button className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-xl transition-colors" onClick={() => setShowLimitModal(false)}>
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      <VideoModal 
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        videoUrl={PROMO_VIDEO_URL}
      />
    </main>
  );
}
