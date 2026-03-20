'use client';

import { useEffect } from 'react';

export function useSecurity() {
  useEffect(() => {
    // Toast function
    const showToast = (message: string) => {
      const existingToast = document.getElementById('security-toast');
      if (existingToast) existingToast.remove();

      const toast = document.createElement('div');
      toast.id = 'security-toast';
      toast.className = 'security-toast';
      toast.textContent = message;
      document.body.appendChild(toast);

      setTimeout(() => toast.remove(), 2000);
    };

    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showToast('राइट-क्लिक अक्षम है 🔒');
    };

    // Disable keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        showToast('डेवलपर टूल अक्षम है 🔒');
        return;
      }

      // Ctrl+Shift+I/J/C
      if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) {
        e.preventDefault();
        showToast('डेवलपर टूल अक्षम है 🔒');
        return;
      }

      // Ctrl+U
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        showToast('स्रोत कोड देखना अक्षम है 🔒');
        return;
      }

      // Ctrl+S
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        showToast('सहेजना अक्षम है 🔒');
        return;
      }
    };

    // Disable select
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      e.preventDefault();
    };

    // Disable drag
    const handleDragStart = (e: Event) => e.preventDefault();

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);
}
