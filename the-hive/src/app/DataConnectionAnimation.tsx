"use client";
import React, { useState, useEffect, useRef } from 'react';

interface ConnectionStep {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  duration: number;
  status: 'pending' | 'connecting' | 'connected' | 'error';
}

const DataConnectionAnimation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<ConnectionStep[]>([
    {
      id: 'onu',
      name: 'United Nations SDG API',
      description: 'Connecting to UN Sustainable Development Goals database to retrieve Goal 11 data for sustainable cities...',
      icon: '🏛️',
      color: '#1a237e',
      duration: 2500,
      status: 'pending'
    },
    {
      id: 'openmeteo',
      name: 'OpenMeteo Climate API',
      description: 'Retrieving historical weather data and climate forecasts for accurate analysis...',
      icon: '🌡️',
      color: '#2196f3',
      duration: 3000,
      status: 'pending'
    },
    {
      id: 'probablefutures',
      name: 'Probable Futures',
      description: 'Accessing climate change projection models and IPCC scenarios for future impact assessment...',
      icon: '🌍',
      color: '#4caf50',
      duration: 3500,
      status: 'pending'
    }
  ]);

  const [showAnimation, setShowAnimation] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    // Démarrer l'animation après un court délai
    const timer = setTimeout(() => {
      setShowAnimation(true);
      startConnectionSequence();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Effet pour dessiner les alvéoles hexagonales dans l'animation de connexion
  useEffect(() => {
    if (showAnimation) {
      const canvas = document.getElementById('connectionHoneycombCanvas') as HTMLCanvasElement;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

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

      // Initialiser la grille hexagonale
      const hexSize = 35;
      const rows = Math.ceil(canvas.height / (hexSize * 1.5)) + 2;
      const cols = Math.ceil(canvas.width / (hexSize * Math.sqrt(3))) + 2;

      const hexagons: Array<{x: number, y: number, opacity: number, pulse: number}> = [];
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * hexSize * Math.sqrt(3) + (row % 2) * (hexSize * Math.sqrt(3)) / 2;
          const y = row * hexSize * 1.5;
          
          hexagons.push({
            x,
            y,
            opacity: Math.random() * 0.15 + 0.08,
            pulse: Math.random() * Math.PI * 2
          });
        }
      }

      // Animation des hexagones
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        hexagons.forEach(hex => {
          hex.pulse += 0.015;
          hex.opacity = 0.08 + 0.12 * Math.sin(hex.pulse);
          drawHexagon(hex.x, hex.y, hexSize, hex.opacity);
        });

        requestAnimationFrame(animate);
      };

      animate();

      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }
  }, [showAnimation]);

  const startConnectionSequence = async () => {
    for (let i = 0; i < steps.length; i++) {
      // Marquer l'étape comme en cours de connexion
      setSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'connecting' } : step
      ));
      setCurrentStep(i);

      // Simuler la connexion avec un délai variable
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));

      // Marquer l'étape comme connectée
      setSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'connected' } : step
      ));

      // Mettre à jour le progrès avec une animation fluide
      setProgress(((i + 1) / steps.length) * 100);

      // Petit délai entre les connexions pour un effet plus naturel
      if (i < steps.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Afficher le message de succès
    setShowSuccess(true);
    
    // Attendre un peu avant de terminer pour montrer le succès
    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !showAnimation) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particules de connexion
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
      targetX: number;
      targetY: number;
    }> = [];

    // Créer des particules pour chaque étape
    steps.forEach((step, stepIndex) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 - 100 + stepIndex * 120;
      
      // Particules principales pour chaque source de données
      for (let i = 0; i < 12; i++) {
        particles.push({
          x: centerX + (Math.random() - 0.5) * 300,
          y: centerY + (Math.random() - 0.5) * 300,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          size: Math.random() * 4 + 2,
          opacity: Math.random() * 0.6 + 0.4,
          color: step.color,
          targetX: centerX,
          targetY: centerY
        });
      }

      // Particules de données qui se déplacent vers la source
      for (let i = 0; i < 6; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: 0,
          vy: 0,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.4 + 0.2,
          color: step.color,
          targetX: centerX,
          targetY: centerY
        });
      }
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dessiner le fond avec effet de profondeur
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(20, 33, 61, 0.95)');
      gradient.addColorStop(1, 'rgba(25, 118, 210, 0.1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Animer les particules
      particles.forEach((particle, index) => {
        const stepIndex = Math.floor(index / 18); // 12 + 6 particules par étape
        const step = steps[stepIndex];
        
        if (step.status === 'connecting' || step.status === 'connected') {
          // Attirer les particules vers le centre de l'étape
          const dx = particle.targetX - particle.x;
          const dy = particle.targetY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 5) {
            particle.vx += dx * 0.015;
            particle.vy += dy * 0.015;
          }
          
          // Limiter la vitesse
          const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
          if (speed > 4) {
            particle.vx = (particle.vx / speed) * 4;
            particle.vy = (particle.vy / speed) * 4;
          }

          // Effet de pulsation pour les particules connectées
          if (step.status === 'connected') {
            particle.opacity = 0.4 + 0.3 * Math.sin(Date.now() * 0.005 + index);
          }
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        // Dessiner la particule
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        
        if (step.status === 'connected') {
          // Effet de lueur pour les connexions établies
          const glow = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 4
          );
          glow.addColorStop(0, particle.color);
          glow.addColorStop(0.5, particle.color + '80');
          glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Particule principale
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Effet de traînée pour les particules en mouvement
        if (Math.abs(particle.vx) > 0.1 || Math.abs(particle.vy) > 0.1) {
          ctx.strokeStyle = particle.color + '40';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particle.x - particle.vx * 8, particle.y - particle.vy * 8);
          ctx.stroke();
        }

        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [showAnimation, steps]);

  if (!showAnimation) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, hsl(220, 70%, 15%), hsl(230, 60%, 20%), hsl(240, 50%, 25%))',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      position: 'relative'
    }}>
      {/* Canvas pour les alvéoles hexagonales */}
      <canvas
        id="connectionHoneycombCanvas"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.5
        }}
      />
      {/* Canvas pour les animations de particules */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />

      {/* Titre principal */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        position: 'relative',
        zIndex: 2
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          color: '#fff',
          margin: 0,
          marginBottom: '1rem',
          textShadow: '0 4px 8px rgba(0,0,0,0.3)'
        }}>
          🐝 Bee Agents Connecting...
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: 'rgba(255, 255, 255, 0.8)',
          margin: 0,
          fontStyle: 'italic'
        }}>
          Establishing connections to climate data sources
        </p>
      </div>

      {/* Étapes de connexion */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        marginBottom: '3rem',
        position: 'relative',
        zIndex: 2
      }}>
        {steps.map((step, index) => (
          <div
            key={step.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              padding: '1.5rem 2rem',
              background: step.status === 'connected' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              border: step.status === 'connected' 
                ? `2px solid ${step.color}` 
                : '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              transform: step.status === 'connected' ? 'scale(1.02)' : 'scale(1)',
              boxShadow: step.status === 'connected' 
                ? `0 8px 32px rgba(${parseInt(step.color.slice(1, 3), 16)}, ${parseInt(step.color.slice(3, 5), 16)}, ${parseInt(step.color.slice(5, 7), 16)}, 0.3)` 
                : '0 4px 16px rgba(0,0,0,0.2)'
            }}
          >
            {/* Icône */}
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: step.status === 'connected' 
                ? `linear-gradient(135deg, ${step.color}, rgba(255, 255, 255, 0.8))` 
                : 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              boxShadow: step.status === 'connected' 
                ? `0 4px 16px ${step.color}40` 
                : '0 2px 8px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              overflow: 'hidden'
            }}>
              {step.id === 'onu' ? (
                <img 
                  src="/onu-flag.png" 
                  alt="UN Flag" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                />
              ) : (
                step.icon
              )}
            </div>

            {/* Contenu */}
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 600,
                color: '#fff',
                margin: 0,
                marginBottom: '0.5rem'
              }}>
                {step.name}
              </h3>
              <p style={{
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.7)',
                margin: 0
              }}>
                {step.description}
              </p>
            </div>

            {/* Statut */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              {step.status === 'pending' && (
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.3)',
                  border: '2px solid rgba(255, 255, 255, 0.5)'
                }} />
              )}
              
              {step.status === 'connecting' && (
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: `2px solid ${step.color}`,
                  animation: 'spin 1s linear infinite'
                }} />
              )}
              
              {step.status === 'connected' && (
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: step.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  color: '#fff'
                }}>
                  ✓
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

             {/* Barre de progression ou message de succès */}
       {!showSuccess ? (
         <div style={{
           width: '400px',
           position: 'relative',
           zIndex: 2
         }}>
           <div style={{
             width: '100%',
             height: '8px',
             background: 'rgba(255, 255, 255, 0.1)',
             borderRadius: '4px',
             overflow: 'hidden',
             backdropFilter: 'blur(10px)',
             WebkitBackdropFilter: 'blur(10px)'
           }}>
             <div style={{
               width: `${progress}%`,
               height: '100%',
               background: 'linear-gradient(90deg, #1a237e, #4caf50)',
               borderRadius: '4px',
               transition: 'width 0.5s ease',
               boxShadow: '0 0 20px rgba(25, 118, 210, 0.5)'
             }} />
           </div>
           <p style={{
             textAlign: 'center',
             color: 'rgba(255, 255, 255, 0.7)',
             fontSize: '0.9rem',
             marginTop: '0.5rem'
           }}>
             {Math.round(progress)}% Complete
           </p>
         </div>
                ) : (
           <div style={{
             textAlign: 'center',
             position: 'relative',
             zIndex: 2,
             animation: 'fadeInUp 0.8s ease-out'
           }}>
           <div style={{
             width: '80px',
             height: '80px',
             borderRadius: '50%',
             background: 'linear-gradient(135deg, #4caf50, #66bb6a)',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             fontSize: '2.5rem',
             margin: '0 auto 1.5rem auto',
             boxShadow: '0 8px 32px rgba(76, 175, 80, 0.4)',
             animation: 'pulse 2s infinite'
           }}>
             ✅
           </div>
           <h2 style={{
             fontSize: '1.8rem',
             fontWeight: 700,
             color: '#4caf50',
             margin: 0,
             marginBottom: '0.5rem',
             textShadow: '0 2px 4px rgba(0,0,0,0.3)'
           }}>
             All Connections Established!
           </h2>
           <p style={{
             fontSize: '1.1rem',
             color: 'rgba(255, 255, 255, 0.9)',
             margin: 0,
             fontStyle: 'italic'
           }}>
             Bee Agents are ready to analyze climate data for your city
           </p>
         </div>
       )}

      {/* Styles CSS pour les animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes fadeInUp {
          0% { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </div>
  );
};

export default DataConnectionAnimation; 