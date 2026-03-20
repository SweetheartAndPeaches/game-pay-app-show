/**
 * 安全防护脚本
 * 防止用户打开开发者工具、查看源码等操作
 */

export function initSecurity(): void {
  // 禁用右键菜单
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showToast('右键菜单已禁用 🔒');
    return false;
  });

  // 禁用 F12、Ctrl+Shift+I、Ctrl+Shift+J、Ctrl+U 等快捷键
  document.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12') {
      e.preventDefault();
      showToast('开发者工具已禁用 🔒');
      return false;
    }

    // Ctrl+Shift+I (开发者工具)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault();
      showToast('开发者工具已禁用 🔒');
      return false;
    }

    // Ctrl+Shift+J (控制台)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
      e.preventDefault();
      showToast('开发者工具已禁用 🔒');
      return false;
    }

    // Ctrl+Shift+C (元素选择器)
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      showToast('开发者工具已禁用 🔒');
      return false;
    }

    // Ctrl+U (查看源码)
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      showToast('查看源码已禁用 🔒');
      return false;
    }

    // Ctrl+S (保存)
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      showToast('保存已禁用 🔒');
      return false;
    }

    return true;
  });

  // 检测开发者工具是否打开（通过 debugger 时间差检测）
  let devtoolsOpen = false;
  
  const checkDevTools = () => {
    const start = performance.now();
    // eslint-disable-next-line no-debugger
    debugger;
    const end = performance.now();
    
    if (end - start > 100) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        showToast('⚠️ 请勿使用开发者工具');
      }
    } else {
      devtoolsOpen = false;
    }
  };

  // 定期检测（降低频率避免影响性能）
  setInterval(checkDevTools, 2000);

  // 禁用拖拽选择文本
  document.addEventListener('selectstart', (e) => {
    // 允许在输入框中选择
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return true;
    }
    e.preventDefault();
    return false;
  });

  // 禁用拖拽
  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  });

  console.log('%c⚠️ 警告', 'color: red; font-size: 40px; font-weight: bold;');
  console.log('%c此页面已启用安全防护，请勿尝试破解！', 'color: red; font-size: 16px;');
}

// Toast 提示
function showToast(message: string): void {
  // 避免重复创建 toast
  const existingToast = document.getElementById('security-toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.id = 'security-toast';
  toast.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #ffd700;
      padding: 12px 24px;
      border-radius: 12px;
      border: 1px solid rgba(255, 215, 0, 0.3);
      font-size: 14px;
      font-weight: 600;
      z-index: 99999;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      animation: slideDown 0.3s ease-out;
    ">
      ${message}
    </div>
  `;

  // 添加动画样式
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(toast);

  // 2秒后移除
  setTimeout(() => {
    toast.remove();
  }, 2000);
}
