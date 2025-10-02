"use client";
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: 'bee' | 'data' | 'connection';
  opacity: number;
  life: number;
  maxLife: number;
}

interface Hexagon {
  x: number;
  y: number;
  size: number;
  opacity: number;
  pulse: number;
}

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const hexagonsRef = useRef<Hexagon[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ajuster la taille du canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialiser les particules
    const initParticles = () => {
      particlesRef.current = [];
      
      // Particules d'abeilles (points dorés)
      for (let i = 0; i < 15; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 2,
          type: 'bee',
          opacity: Math.random() * 0.6 + 0.4,
          life: Math.random() * 100,
          maxLife: 100
        });
      }

      // Particules de données (points bleus)
      for (let i = 0; i < 25; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 2 + 1,
          type: 'data',
          opacity: Math.random() * 0.5 + 0.3,
          life: Math.random() * 80,
          maxLife: 80
        });
      }

      // Ondes de connexion
      for (let i = 0; i < 8; i++) {
        particlesRef.current.push({
          x: canvas.width / 2,
          y: canvas.height / 2,
          vx: 0,
          vy: 0,
          size: Math.random() * 100 + 50,
          type: 'connection',
          opacity: 0.1,
          life: Math.random() * 200,
          maxLife: 200
        });
      }
    };

    // Initialiser la grille hexagonale
    const initHexagons = () => {
      hexagonsRef.current = [];
      const hexSize = 40;
      const rows = Math.ceil(canvas.height / (hexSize * 1.5)) + 2;
      const cols = Math.ceil(canvas.width / (hexSize * Math.sqrt(3))) + 2;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * hexSize * Math.sqrt(3) + (row % 2) * (hexSize * Math.sqrt(3)) / 2;
          const y = row * hexSize * 1.5;
          
          hexagonsRef.current.push({
            x,
            y,
            size: hexSize,
            opacity: Math.random() * 0.05 + 0.02,
            pulse: Math.random() * Math.PI * 2
          });
        }
      }
    };

    // Dessiner un hexagone
    const drawHexagon = (x: number, y: number, size: number, opacity: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const px = x + size * Math.cos(angle);
        const py = y + size * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(144, 202, 249, ${opacity})`;
      ctx.fill();
    };

    // Dessiner une particule
    const drawParticle = (particle: Particle) => {
      ctx.save();
      ctx.globalAlpha = particle.opacity;

      switch (particle.type) {
        case 'bee':
          // Particule d'abeille dorée avec effet de lueur
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 2
          );
          gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
          gradient.addColorStop(0.5, 'rgba(255, 193, 7, 0.4)');
          gradient.addColorStop(1, 'rgba(255, 193, 7, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Point central
          ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'data':
          // Particule de données bleue
          ctx.fillStyle = 'rgba(25, 118, 210, 0.7)';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Effet de traînée
          ctx.strokeStyle = 'rgba(25, 118, 210, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particle.x - particle.vx * 10, particle.y - particle.vy * 10);
          ctx.stroke();
          break;

        case 'connection':
          // Onde de connexion
          ctx.strokeStyle = 'rgba(144, 202, 249, 0.3)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.stroke();
          break;
      }

      ctx.restore();
    };

    // Animer les particules
    const animateParticles = () => {
      particlesRef.current.forEach((particle, index) => {
        // Mettre à jour la position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        // Rebondir sur les bords
        if (particle.x <= 0 || particle.x >= canvas.width) {
          particle.vx *= -1;
        }
        if (particle.y <= 0 || particle.y >= canvas.height) {
          particle.vy *= -1;
        }

        // Gérer le cycle de vie des ondes de connexion
        if (particle.type === 'connection') {
          particle.size += 0.5;
          particle.opacity = Math.max(0, 0.3 * (1 - particle.life / particle.maxLife));
          
          if (particle.life > particle.maxLife) {
            particle.x = canvas.width / 2;
            particle.y = canvas.height / 2;
            particle.size = Math.random() * 100 + 50;
            particle.life = 0;
            particle.opacity = 0.3;
          }
        }

        // Effet de pulsation pour les particules d'abeilles
        if (particle.type === 'bee') {
          particle.opacity = 0.4 + 0.3 * Math.sin(particle.life * 0.05);
        }
      });
    };

    // Animer la grille hexagonale
    const animateHexagons = () => {
      hexagonsRef.current.forEach(hex => {
        hex.pulse += 0.02;
        hex.opacity = 0.02 + 0.03 * Math.sin(hex.pulse);
      });
    };

    // Fonction d'animation principale
    const animate = () => {
      // Effacer le canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dessiner le gradient de fond animé
      const time = Date.now() * 0.001;
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, `hsl(${220 + Math.sin(time * 0.1) * 10}, 70%, 15%)`);
      gradient.addColorStop(0.3, `hsl(${230 + Math.sin(time * 0.15) * 15}, 60%, 20%)`);
      gradient.addColorStop(0.7, `hsl(${240 + Math.sin(time * 0.2) * 10}, 50%, 25%)`);
      gradient.addColorStop(1, `hsl(${250 + Math.sin(time * 0.1) * 5}, 40%, 30%)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ajouter un effet de profondeur avec des couches supplémentaires
      const depthGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );
      depthGradient.addColorStop(0, 'rgba(20, 33, 61, 0.3)');
      depthGradient.addColorStop(0.5, 'rgba(20, 33, 61, 0.1)');
      depthGradient.addColorStop(1, 'rgba(20, 33, 61, 0.5)');
      
      ctx.fillStyle = depthGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dessiner la grille hexagonale
      hexagonsRef.current.forEach(hex => {
        drawHexagon(hex.x, hex.y, hex.size, hex.opacity);
      });

      // Dessiner les particules
      particlesRef.current.forEach(particle => {
        drawParticle(particle);
      });

      // Animer les éléments
      animateParticles();
      animateHexagons();

      // Continuer l'animation
      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialiser et démarrer l'animation
    initParticles();
    initHexagons();
    animate();

    // Nettoyer
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
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
};

export default AnimatedBackground; 