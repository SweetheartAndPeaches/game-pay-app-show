'use client';

import { useEffect, useRef } from 'react';

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

export default function TriangleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: TriangleParticle[] = [];
    let particleCount = 0;

    function resizeCanvas() {
      if (!canvas || !ctx) return;
      
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

    function drawTriangle(x: number, y: number, size: number, rotation: number, opacity: number) {
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

    function animate() {
      if (!ctx || !canvas) return;
      
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

      animationRef.current = requestAnimationFrame(animate);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
