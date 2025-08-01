"use client";
import React, { useState, useEffect } from "react";
import Mapbox3DMap from "./Mapbox3DMap";
import SimpleClimateMap from "./SimpleClimateMap";
import SimpleCompareMap from "./SimpleCompareMap";
import ReactMarkdown from "react-markdown";
import AnimatedBackground from "./AnimatedBackground";
import DataConnectionAnimation from "./DataConnectionAnimation";

export default function Home() {
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [mapboxToken] = useState("pk.eyJ1IjoicGF1bGJhcmJhc3RlIiwiYSI6ImNtZGVtYWl4bTA0MjEya284dmJ5bm95dDYifQ.ACq2Cei1RRtsOBk4nJRnpw");
  const [mapStyle] = useState("mapbox://styles/mapbox/standard");
  const [locationValidated, setLocationValidated] = useState(false);
  const [agentResult, setAgentResult] = useState<string | null>(null);
  const [loadingAgent, setLoadingAgent] = useState(false);
  const [errorAgent, setErrorAgent] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [showConnectionAnimation, setShowConnectionAnimation] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [additionalQuestion, setAdditionalQuestion] = useState("");
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [questionResponse, setQuestionResponse] = useState<string | null>(null);
  const [loadingClimateAnalysis, setLoadingClimateAnalysis] = useState(false);
  const [climateAnalysisResult, setClimateAnalysisResult] = useState<string | null>(null);
  const [showClimateMap, setShowClimateMap] = useState(true);
  const [showCompareMap, setShowCompareMap] = useState(true);
  const [currentSubtitle, setCurrentSubtitle] = useState(0);
  const [subtitleOpacity, setSubtitleOpacity] = useState(1);

  // Messages de sous-titres pour l'attente
  const subtitleMessages = [
    "🐝 Bee Agents are leaving the hive...",
    "🌐 Connecting to United Nations Goals API...",
    "📊 Gathering data for Goal 11...",
    `🔍 Analyzing request for ${selectedCity}...`,
    "🌡️ Processing climate data...",
    "💡 Generating recommendations...",
    "✨ Finalizing analysis...",
  ];

  // Effet pour les sous-titres animés
  useEffect(() => {
    if (loadingAgent) {
      const interval = setInterval(() => {
        setSubtitleOpacity(0);
        setTimeout(() => {
          setCurrentSubtitle((prev) => {
            const next = prev + 1;
            if (next >= subtitleMessages.length) {
              clearInterval(interval);
              return prev; // Garde le dernier message
            }
            return next;
          });
          setSubtitleOpacity(1);
        }, 300);
      }, 3000); // 3 secondes d'espacement

      return () => clearInterval(interval);
    } else {
      setCurrentSubtitle(0);
      setSubtitleOpacity(1);
    }
  }, [loadingAgent, subtitleMessages.length, selectedCity]);

  // Effet pour dessiner les alvéoles hexagonales dans l'interface de résultats
  useEffect(() => {
    if (agentResult) {
      const canvas = document.getElementById('honeycombCanvas') as HTMLCanvasElement;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const resizeCanvas = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
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
      const hexSize = 30;
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
            opacity: Math.random() * 0.04 + 0.02,
            pulse: Math.random() * Math.PI * 2
          });
        }
      }

      // Animation des hexagones
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        hexagons.forEach(hex => {
          hex.pulse += 0.01;
          hex.opacity = 0.02 + 0.03 * Math.sin(hex.pulse);
          drawHexagon(hex.x, hex.y, hexSize, hex.opacity);
        });

        requestAnimationFrame(animate);
      };

      animate();

      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }
  }, [agentResult]);


  const handleShowOnMap = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedCity(city);
    setLocationValidated(false);
    setAgentResult(null);
    setErrorAgent(null);
  };

  const handleValidate = async () => {
    setLocationValidated(true);
    setAgentResult(null);
    setErrorAgent(null);
    setLoadingAgent(true);
    try {
      const res = await fetch("http://localhost:8000/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: selectedCity }),
      });
      const data = await res.json();
      if (data.result) {
        setAgentResult(data.result);
      } else {
        setErrorAgent(data.error || "Unknown error");
      }
    } catch (err) {
      setErrorAgent("Erreur lors de la requête à l'API.");
    }
    setLoadingAgent(false);
  };

  // Fonction pour obtenir la ville via la géolocalisation
  const handleGetLocation = async () => {
    setGettingLocation(true);
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      setGettingLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}`);
        const data = await res.json();
        const place = data.features?.find((f: any) => f.place_type.includes('place'));
        if (place && place.text) {
          setCity(place.text);
          // Lance automatiquement la recherche
          setSelectedCity(place.text);
          setLocationValidated(false);
          setAgentResult(null);
          setErrorAgent(null);
        } else {
          setLocationError("Ville non trouvée");
        }
      } catch (err) {
        setLocationError("Erreur lors du reverse geocoding");
      }
      setGettingLocation(false);
    }, (err) => {
      setLocationError("Impossible d'obtenir la position");
      setGettingLocation(false);
    });
  };

  const handleAdditionalQuestion = async () => {
    if (!additionalQuestion.trim()) return;
    
    setLoadingQuestion(true);
    setQuestionResponse(null);
    
    try {
      const res = await fetch("http://localhost:8000/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          city: selectedCity,
          question: additionalQuestion 
        }),
      });
      const data = await res.json();
      if (data.result) {
        setQuestionResponse(data.result);
      } else {
        setQuestionResponse(data.error || "Erreur lors de la réponse");
      }
    } catch (err) {
      setQuestionResponse("Erreur lors de la requête à l'API.");
    }
    setLoadingQuestion(false);
  };

  const handleClimateAnalysis = async () => {
    if (!selectedCity) return;
    
    setLoadingClimateAnalysis(true);
    setClimateAnalysisResult(null);
    
    try {
      const res = await fetch("http://localhost:8000/climate-impact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: selectedCity }),
      });
      const data = await res.json();
      if (data.result) {
        setClimateAnalysisResult(data.result);
      } else {
        setClimateAnalysisResult(data.error || "Erreur lors de l'analyse climatique");
      }
    } catch (err) {
      setClimateAnalysisResult("Erreur lors de la requête à l'API.");
    }
    setLoadingClimateAnalysis(false);
  };

  // Fonction pour gérer la fin de l'animation de connexion
  const handleConnectionComplete = () => {
    setShowConnectionAnimation(false);
    // Ajouter un petit délai pour une transition plus fluide
    setTimeout(() => {
      // L'interface principale s'affichera automatiquement
    }, 300);
  };

  return (
    <div style={{ minHeight: "100vh", minWidth: "100vw", position: "relative", overflow: "hidden" }}>
      {/* Arrière-plan animé sophistiqué */}
      <AnimatedBackground />
      {/* Box d'intro description agent */}
      {showIntro && (
        <>
          <div className="custom-scrollbar" style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          minWidth: 950,
          maxWidth: "1400px",
          maxHeight: "95vh",
          background: "rgba(20, 33, 61, 0.08)",
          color: "#fff",
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 24,
          padding: "2.5rem 2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "'IBM Plex Sans', 'Inter', Arial, sans-serif",
          fontSize: "1rem",
          textAlign: "center",
          backdropFilter: "blur(25px)",
          WebkitBackdropFilter: "blur(25px)",
          overflow: "auto"
        }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 20 }}>🌍🐝 Climate Hive</h1>
          
                      {/* Alvéoles des trois agents */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '5.5rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap'
            }}>
              {/* Agent ONU */}
              <div style={{
                width: '90px',
                height: '90px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 193, 7, 0.05))',
              border: '2px solid rgba(255, 215, 0, 0.3)',
              borderRadius: '50%',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(255, 215, 0, 0.2), inset 0 1px 0 rgba(255, 215, 0, 0.1)',
              animation: 'pulse 3s ease-in-out infinite'
            }}>
                              <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.8), rgba(255, 193, 7, 0.6))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  boxShadow: '0 4px 16px rgba(255, 215, 0, 0.4)'
                }}>
                <img 
                  src="/onu-flag.png" 
                  alt="UN Agent" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                />
              </div>
              <div style={{
                position: 'absolute',
                bottom: '-25px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: 'rgba(255, 215, 0, 0.9)',
                textAlign: 'center',
                whiteSpace: 'nowrap'
              }}>
                UN Agent
              </div>
            </div>

            {/* Agent Climate Change */}
            <div style={{
              width: '90px',
              height: '90px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(102, 187, 106, 0.05))',
              border: '2px solid rgba(76, 175, 80, 0.3)',
              borderRadius: '50%',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(76, 175, 80, 0.2), inset 0 1px 0 rgba(76, 175, 80, 0.1)',
              animation: 'pulse 3s ease-in-out infinite 1s'
            }}>
                              <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.8), rgba(102, 187, 106, 0.6))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  boxShadow: '0 4px 16px rgba(76, 175, 80, 0.4)'
                }}>
                  🌡️
                </div>
                              <div style={{
                  position: 'absolute',
                  bottom: '-25px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: 'rgba(76, 175, 80, 0.9)',
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}>
                  Climate Agent
                </div>
            </div>

            {/* Agent Cities Advisor */}
            <div style={{
              width: '90px',
              height: '90px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(66, 165, 245, 0.05))',
              border: '2px solid rgba(33, 150, 243, 0.3)',
              borderRadius: '50%',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(33, 150, 243, 0.2), inset 0 1px 0 rgba(33, 150, 243, 0.1)',
              animation: 'pulse 3s ease-in-out infinite 2s'
            }}>
                              <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.8), rgba(66, 165, 245, 0.6))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  boxShadow: '0 4px 16px rgba(33, 150, 243, 0.4)'
                }}>
                  🏙️
                </div>
                              <div style={{
                  position: 'absolute',
                  bottom: '-25px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: 'rgba(33, 150, 243, 0.9)',
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}>
                  Cities Advisor
                </div>
            </div>
          </div>

          {/* Box Description */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1.5rem',
            width: '1000px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}>

            <p style={{
              margin: 0,
              fontSize: '0.9rem',
              lineHeight: '1.5',
              color: 'rgba(255, 255, 255, 0.9)'
            }}>
              <b>🎯 Mission:</b> Analyze climate impacts, provide urban resilience recommendations, and showcase UN sustainable city initiatives through SDG 11.
            </p>
          </div>
          
          {/* Box Technology */}
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            width: '1000px',
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 193, 7, 0.05))',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(255, 215, 0, 0.2), inset 0 1px 0 rgba(255, 215, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.8), rgba(255, 193, 7, 0.6))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
              }}>
                ⚡
              </div>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: 700,
                margin: 0,
                color: 'rgba(255, 215, 0, 0.9)',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}>
                Technology
              </h3>
            </div>
            <p style={{
              margin: 0,
              fontSize: '0.85rem',
              lineHeight: '1.5',
              color: 'rgba(255, 255, 255, 0.9)'
            }}>
              Powered by <strong>BeeAI agents</strong> built on <strong>WatsonX</strong> and <strong>Granite</strong> models, with data from <strong>UN SDG API</strong> and <strong>OpenMeteo</strong> climate services.
            </p>
          </div>
        </div>
        <div style={{
          position: "absolute",
          top: "85%",
          left: "50%",
          transform: "translate(-50%, 0)",
          zIndex: 10,
          display: "flex",
          justifyContent: "center"
        }}>
          <button
            type="button"
            onClick={e => { e.preventDefault?.(); setShowIntro(false); setShowConnectionAnimation(true); }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(25, 118, 210, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(25, 118, 210, 0.3)';
            }}
            className="glassmorphism"
            style={{
              background: "linear-gradient(135deg, rgba(255, 215, 0, 0.9), rgba(255, 193, 7, 0.8))",
              color: "#ffffff",
              fontWeight: 700,
              borderRadius: 16,
              border: "1px solid rgba(255, 215, 0, 0.3)",
              boxShadow: "0 4px 20px rgba(255, 215, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
              height: 52,
              minWidth: 180,
              fontSize: "0.9rem",
              padding: "0 2rem",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(.4,2,.6,1)",
              fontFamily: "'IBM Plex Sans', 'Inter', Arial, sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)"
            }}
          >
            Get Started
          </button>
        </div>
        </>
      )}
      {/* Animation de connexion aux sources de données */}
      {showConnectionAnimation && (
        <DataConnectionAnimation 
          onComplete={handleConnectionComplete}
        />
      )}

      {/* Carte et box de recherche seulement après intro et animation */}
      {!showIntro && !showConnectionAnimation && (
        <>
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 1,
          }}>
            <Mapbox3DMap city={selectedCity || ""} mapboxToken={mapboxToken} mapStyle={mapStyle} animate={true} />
          </div>
          <div style={{
            position: "absolute",
            top: "68%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
            minWidth: 320,
            background: "rgba(255,255,255,0.06)",
            boxShadow: "0 8px 32px 0 rgba(44,83,100,0.15)",
            borderRadius: 24,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            padding: "2.5rem 2.5rem 2rem 2.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
            fontFamily: "'IBM Plex Sans', 'Inter', Arial, sans-serif",
            fontSize: "0.98rem",
            border: '1px solid rgba(255,255,255,0.2)',
          }} className="glassmorphism">
            <form onSubmit={handleShowOnMap} style={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "flex-end", gap: 8, justifyContent: "center" }}>
              <input
                id="city"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Enter a city name (e.g. Paris, New York, Tokyo)"
                style={{
                  padding: "0.9rem 1.2rem",
                  borderRadius: 12,
                  border: "1.5px solid rgba(144, 202, 249, 0.6)",
                  fontSize: "0.98rem",
                  minWidth: 220,
                  outline: "none",
                  background: "rgba(248,251,255,0.9)",
                  color: "#1a237e",
                  boxShadow: "0 2px 12px rgba(44,83,100,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
                  transition: "all 0.3s ease",
                  height: 48,
                  marginBottom: 0,
                  textAlign: "center",
                  fontFamily: "'IBM Plex Sans', 'Inter', Arial, sans-serif",
                  flex: 1,
                  backdropFilter: "blur(5px)",
                  WebkitBackdropFilter: "blur(5px)"
                }}
                required
              />
              <button
                type="submit"
                disabled={!city}
                className="glassmorphism"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  color: "#1a237e",
                  cursor: !city ? "not-allowed" : "pointer",
                  opacity: !city ? 0.7 : 1,
                  height: 48,
                  minWidth: 180,
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  borderRadius: 12,
                  border: "1.5px solid rgba(255,255,255,0.3)",
                  boxShadow: "0 2px 12px rgba(44,83,100,0.15), inset 0 1px 0 rgba(255,255,255,0.2)",
                  marginTop: 0,
                  marginBottom: 0,
                  marginLeft: 8,
                  transition: "all 0.25s cubic-bezier(.4,2,.6,1)",
                  backdropFilter: "blur(15px)",
                  WebkitBackdropFilter: "blur(15px)",
                  fontFamily: "'IBM Plex Sans', 'Inter', Arial, sans-serif",
                }}
              >
                🌍 Show on Map 
              </button>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={gettingLocation}
                className="glassmorphism"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: gettingLocation ? "#888" : "#1a237e",
                  fontWeight: 600,
                  borderRadius: 12,
                  border: "1.5px solid rgba(255,255,255,0.3)",
                  boxShadow: "0 2px 8px rgba(44,83,100,0.12), inset 0 1px 0 rgba(255,255,255,0.2)",
                  height: 48,
                  minWidth: 48,
                  fontSize: "1.2rem",
                  marginBottom: 0,
                  marginLeft: 8,
                  cursor: gettingLocation ? "not-allowed" : "pointer",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: "all 0.2s cubic-bezier(.4,2,.6,1)",
                  fontFamily: "'IBM Plex Sans', 'Inter', Arial, sans-serif",
                  padding: 0,
                  backdropFilter: "blur(15px)",
                  WebkitBackdropFilter: "blur(15px)"
                }}
                title="Get my location"
              >
                {gettingLocation ? (
                  <span className="loader" style={{ width: 22, height: 22 }} />
                ) : (
                  <span role="img" aria-label="location">📍</span>
                )}
              </button>
            </form>
            {locationError && (
              <div style={{ color: '#d32f2f', fontSize: '0.95rem', marginTop: 4, marginBottom: -8, textAlign: 'center' }}>{locationError}</div>
            )}
            {/* Bouton de validation après recherche */}
            {selectedCity && !locationValidated && (
              <button
                onClick={handleValidate}
                className="glassmorphism"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  color: "#1a237e",
                  fontWeight: 700,
                  borderRadius: 12,
                  border: "1.5px solid rgba(255,255,255,0.3)",
                  boxShadow: "0 2px 12px rgba(44,83,100,0.15), inset 0 1px 0 rgba(255,255,255,0.2)",
                  height: 48,
                  minWidth: 240,
                  fontSize: "0.95rem",
                  marginTop: 12,
                  cursor: "pointer",
                  transition: "all 0.25s cubic-bezier(.4,2,.6,1)",
                  opacity: 0.95,
                  backdropFilter: "blur(15px)",
                  WebkitBackdropFilter: "blur(15px)",
                  fontFamily: "'IBM Plex Sans', 'Inter', Arial, sans-serif",
                  padding: '0 1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                🐝 Launch Bee Agents
              </button>
            )}
            {/* Loader ou résultat des agents */}
            {locationValidated && (
              <div style={{ width: '100%', marginTop: 24 }}>
                {loadingAgent && (
                  <div className="glassmorphism" style={{ 
                    padding: 24, 
                    borderRadius: 16, 
                    textAlign: 'center', 
                    fontWeight: 500, 
                    color: '#1a237e', 
                    fontSize: '1.08rem', 
                    minWidth: 280,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      marginBottom: 12,
                      gap: 12
                    }}>
                      <span className="loader" style={{ width: 24, height: 24 }} />
                      <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>🐝 Bee Agents are working...</span>
                    </div>
                    <div style={{
                      fontSize: '0.95rem',
                      color: '#1a237e',
                      fontStyle: 'italic',
                      opacity: subtitleOpacity,
                      transition: 'opacity 0.3s ease-in-out',
                      minHeight: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        whiteSpace: 'nowrap'
                      }}>
                        {subtitleMessages[currentSubtitle]}
                      </span>
                    </div>
                  </div>
                )}
                {errorAgent && (
                  <div className="glassmorphism" style={{ padding: 18, borderRadius: 16, textAlign: 'center', fontWeight: 500, color: '#d32f2f', fontSize: '1.08rem', minWidth: 220 }}>
                    {errorAgent}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Interface de résultats dans l'esprit de ruche */}
      {agentResult && (
        <div className="glassmorphism custom-scrollbar" style={{ 
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90vw',
          maxWidth: '1400px',
          height: '85vh',
          borderRadius: 24,
          textAlign: 'left',
          fontWeight: 400,
          color: '#1a237e',
          fontSize: '0.9rem',
          lineHeight: '1.5',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, hsl(220, 70%, 15%), hsl(230, 60%, 20%), hsl(240, 50%, 25%))',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '2px solid rgba(255, 215, 0, 0.3)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255, 215, 0, 0.2)',
          zIndex: 1000
        }}>
          {/* Canvas pour les alvéoles hexagonales */}
          <canvas
            id="honeycombCanvas"
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
          {/* Header de la ruche */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '1.5rem 2rem',
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 193, 7, 0.05))',
            borderBottom: '2px solid rgba(255, 215, 0, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            zIndex: 1
          }}>
            {/* Effet de particules d'abeilles en arrière-plan */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 193, 7, 0.08) 0%, transparent 50%)',
              pointerEvents: 'none'
            }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.8), rgba(255, 193, 7, 0.6))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
              }}>
                🐝
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '1.4rem', 
                  fontWeight: 700, 
                  color: '#fff',
                  margin: 0,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  🌍 Climate Hive
                </h1>
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: 'rgba(255, 215, 0, 0.8)', 
                  margin: 0,
                  fontStyle: 'italic'
                }}>
                  Bee Agents Analysis for {selectedCity}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setAgentResult(null)}
              style={{
                background: 'rgba(255, 215, 0, 0.1)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '12px',
                padding: '0.8rem 1.2rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: 'rgba(255, 215, 0, 0.9)',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                zIndex: 1
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 215, 0, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 215, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              ✕ Close Hive
            </button>
          </div>
          
          {/* Contenu principal de la ruche */}
          <div style={{ 
            display: 'flex', 
            height: 'calc(85vh - 120px)', 
            overflow: 'hidden',
            position: 'relative',
            zIndex: 1
          }}>
            {/* Section principale - Analyse des agents */}
            <div style={{
              flex: 1,
              padding: '2rem',
              overflow: 'auto',
              position: 'relative',
              zIndex: 1
            }}>
              {/* Cellule de miel - Analyse principale */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 193, 7, 0.03))',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Effet de texture de miel */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at 30% 70%, rgba(255, 215, 0, 0.03) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255, 193, 7, 0.02) 0%, transparent 50%)',
                  pointerEvents: 'none'
                }} />
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.8rem', 
                    marginBottom: '1.5rem' 
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.6), rgba(255, 193, 7, 0.4))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem'
                    }}>
                      🍯
                    </div>
                    <h3 style={{ 
                      fontSize: '1.3rem', 
                      fontWeight: 700, 
                      margin: 0,
                      color: 'rgba(255, 215, 0, 0.9)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}>
                      Honeycomb Analysis
                    </h3>
                  </div>
                  
                  {/* Contenu de l'analyse */}
                  <div style={{ 
                    fontFamily: "'IBM Plex Sans', 'Inter', Arial, sans-serif",
                    background: 'rgba(255,255,255,0.95)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    <ReactMarkdown 
                      components={{
                        h1: ({children}) => <h1 style={{fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.8rem', color: '#1a237e'}}>{children}</h1>,
                        h2: ({children}) => <h2 style={{fontSize: '1rem', fontWeight: 600, marginBottom: '0.7rem', color: '#1a237e'}}>{children}</h2>,
                        h3: ({children}) => <h3 style={{fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', color: '#1a237e'}}>{children}</h3>,
                        p: ({children}) => <p style={{marginBottom: '0.7rem', lineHeight: '1.5', fontSize: '0.85rem'}}>{children}</p>,
                        ul: ({children}) => <ul style={{marginBottom: '0.7rem', paddingLeft: '1.3rem', fontSize: '0.85rem'}}>{children}</ul>,
                        ol: ({children}) => <ol style={{marginBottom: '0.7rem', paddingLeft: '1.3rem', fontSize: '0.85rem'}}>{children}</ol>,
                        li: ({children}) => <li style={{marginBottom: '0.25rem', lineHeight: '1.4', fontSize: '0.85rem'}}>{children}</li>,
                        strong: ({children}) => <strong style={{fontWeight: 600, color: '#1a237e'}}>{children}</strong>,
                        em: ({children}) => <em style={{fontStyle: 'italic', color: '#666'}}>{children}</em>,
                        code: ({children}) => <code style={{background: '#f5f5f5', padding: '0.15rem 0.3rem', borderRadius: '3px', fontSize: '0.85rem', fontFamily: 'monospace'}}>{children}</code>,
                        blockquote: ({children}) => <blockquote style={{borderLeft: '3px solid #1a237e', paddingLeft: '0.8rem', marginLeft: 0, fontStyle: 'italic', color: '#666', fontSize: '0.9rem'}}>{children}</blockquote>
                      }}
                    >
                      {agentResult}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
              
              {/* Section questions supplémentaires */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 193, 7, 0.03))',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Effet de texture */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 193, 7, 0.02) 0%, transparent 50%)',
                  pointerEvents: 'none'
                }} />
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.8rem', 
                    marginBottom: '1.5rem' 
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.6), rgba(255, 193, 7, 0.4))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem'
                    }}>
                      💬
                    </div>
                    <h3 style={{ 
                      fontSize: '1.3rem', 
                      fontWeight: 700, 
                      margin: 0,
                      color: 'rgba(255, 215, 0, 0.9)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}>
                      Ask the Hive
                    </h3>
                  </div>
                  
                  <p style={{ 
                    fontSize: '0.95rem', 
                    color: 'rgba(255,255,255,0.8)', 
                    marginBottom: '1.5rem',
                    fontStyle: 'italic'
                  }}>
                    Ask if a specific proposal meets Goal 11 criteria or ask any other question about the recommendations.
                  </p>
                  
                  <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.5rem' }}>
                    <input
                      type="text"
                      value={additionalQuestion}
                      onChange={(e) => setAdditionalQuestion(e.target.value)}
                      placeholder="Ex: Does installing solar panels meet the criteria?"
                      style={{
                        flex: 1,
                        padding: '1rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        background: 'rgba(255,255,255,0.95)',
                        color: '#1a237e',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleAdditionalQuestion()}
                    />
                    <button
                      onClick={handleAdditionalQuestion}
                      disabled={!additionalQuestion.trim() || loadingQuestion}
                      style={{
                        padding: '1rem 1.5rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        background: additionalQuestion.trim() && !loadingQuestion ? 'rgba(255, 215, 0, 0.8)' : 'rgba(255,255,255,0.3)',
                        color: additionalQuestion.trim() && !loadingQuestion ? '#1a237e' : 'rgba(255,255,255,0.6)',
                        cursor: additionalQuestion.trim() && !loadingQuestion ? 'pointer' : 'not-allowed',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {loadingQuestion ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="loader" style={{ width: 16, height: 16 }} />
                          Sending...
                        </span>
                      ) : (
                        'Ask Hive'
                      )}
                    </button>
                  </div>
                  
                  {questionResponse && (
                    <div style={{
                      background: 'rgba(255,255,255,0.95)',
                      border: '1px solid rgba(255, 215, 0, 0.2)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      marginTop: '1rem'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        marginBottom: '1rem' 
                      }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.6), rgba(255, 193, 7, 0.4))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.9rem'
                        }}>
                          🐝
                        </div>
                        <strong style={{ color: '#1a237e', fontSize: '1rem' }}>Hive Response:</strong>
                      </div>
                      <div style={{ 
                        fontSize: '0.95rem',
                        lineHeight: '1.5'
                      }}>
                        <ReactMarkdown 
                          components={{
                            h1: ({children}) => <h1 style={{fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#1a237e'}}>{children}</h1>,
                            h2: ({children}) => <h2 style={{fontSize: '1rem', fontWeight: 600, marginBottom: '0.4rem', color: '#1a237e'}}>{children}</h2>,
                            h3: ({children}) => <h3 style={{fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.3rem', color: '#1a237e'}}>{children}</h3>,
                            p: ({children}) => <p style={{marginBottom: '0.5rem', lineHeight: '1.4'}}>{children}</p>,
                            ul: ({children}) => <ul style={{marginBottom: '0.5rem', paddingLeft: '1.2rem'}}>{children}</ul>,
                            ol: ({children}) => <ol style={{marginBottom: '0.5rem', paddingLeft: '1.2rem'}}>{children}</ol>,
                            li: ({children}) => <li style={{marginBottom: '0.2rem', lineHeight: '1.4'}}>{children}</li>,
                            strong: ({children}) => <strong style={{fontWeight: 600, color: '#1a237e'}}>{children}</strong>,
                            em: ({children}) => <em style={{fontStyle: 'italic', color: '#666'}}>{children}</em>,
                            code: ({children}) => <code style={{background: '#f5f5f5', padding: '0.1rem 0.3rem', borderRadius: '3px', fontSize: '0.85rem', fontFamily: 'monospace'}}>{children}</code>,
                            blockquote: ({children}) => <blockquote style={{borderLeft: '3px solid #1a237e', paddingLeft: '0.8rem', marginLeft: 0, fontStyle: 'italic', color: '#666'}}>{children}</blockquote>
                          }}
                        >
                          {questionResponse}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </div>
               
               {/* Section des cartes climatiques - Section indépendante */}
               {selectedCity && (showClimateMap || showCompareMap) && (
                 <div style={{
                   background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 193, 7, 0.03))',
                   borderRadius: '16px',
                   padding: '2rem',
                   border: '1px solid rgba(255, 215, 0, 0.2)',
                   marginBottom: '2rem',
                   position: 'relative',
                   overflow: 'hidden'
                 }}>
                   {/* Effet de texture */}
                   <div style={{
                     position: 'absolute',
                     top: 0,
                     left: 0,
                     right: 0,
                     bottom: 0,
                     background: 'radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.03) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(255, 193, 7, 0.02) 0%, transparent 50%)',
                     pointerEvents: 'none'
                   }} />
                   
                   <div style={{ position: 'relative', zIndex: 1 }}>
                     <div style={{ 
                       display: 'flex', 
                       alignItems: 'center', 
                       gap: '0.8rem', 
                       marginBottom: '1.5rem' 
                     }}>
                       <div style={{
                         width: '32px',
                         height: '32px',
                         borderRadius: '50%',
                         background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.6), rgba(255, 193, 7, 0.4))',
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         fontSize: '1.2rem'
                       }}>
                         🗺️
                       </div>
                       <h3 style={{ 
                         fontSize: '1.3rem', 
                         fontWeight: 700, 
                         margin: 0,
                         color: 'rgba(255, 215, 0, 0.9)',
                         textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                       }}>
                         Climate Maps
                       </h3>
                     </div>
                     
                     <p style={{ 
                       fontSize: '0.95rem', 
                       color: 'rgba(255,255,255,0.8)', 
                       marginBottom: '1.5rem',
                       fontStyle: 'italic'
                     }}>
                     </p>
                     
                     {/* Carte Probable Futures */}
                     {showClimateMap && (
                       <div style={{
                         marginBottom: '2rem',
                         padding: '2rem',
                         background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 193, 7, 0.03))',
                         borderRadius: '20px',
                         border: '2px solid rgba(255, 215, 0, 0.2)',
                         boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255, 215, 0, 0.1)',
                         backdropFilter: 'blur(15px)',
                         WebkitBackdropFilter: 'blur(15px)',
                         position: 'relative',
                         overflow: 'hidden'
                       }}>
                         {/* Effet de texture */}
                         <div style={{
                           position: 'absolute',
                           top: 0,
                           left: 0,
                           right: 0,
                           bottom: 0,
                           background: 'radial-gradient(circle at 30% 70%, rgba(255, 215, 0, 0.03) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255, 193, 7, 0.02) 0%, transparent 50%)',
                           pointerEvents: 'none'
                         }} />
                         
                         <div style={{ position: 'relative', zIndex: 1 }}>
                           <div style={{ 
                             display: 'flex', 
                             alignItems: 'center', 
                             justifyContent: 'center',
                             gap: '1rem', 
                             marginBottom: '2rem' 
                           }}>
                             <div style={{
                               width: '48px',
                               height: '48px',
                               borderRadius: '50%',
                               background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.8), rgba(255, 193, 7, 0.6))',
                               display: 'flex',
                               alignItems: 'center',
                               justifyContent: 'center',
                               fontSize: '1.8rem',
                               boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
                             }}>
                               🌡️
                             </div>
                             <h4 style={{ 
                               fontSize: '1rem', 
                               fontWeight: 700, 
                               margin: 0,
                               color: 'rgba(255, 215, 0, 0.9)',
                               textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                               textAlign: 'center',
                               textTransform: 'uppercase',
                               letterSpacing: '1px'
                             }}>
                               Climate Change Impact Map
                             </h4>
                           </div>
                           
                                                <p style={{ 
                       fontSize: '0.85rem', 
                       color: 'rgba(255,255,255,0.9)', 
                       marginBottom: '2rem',
                       textAlign: 'center',
                       fontStyle: 'italic',
                       lineHeight: '1.6',
                       maxWidth: '800px',
                       margin: '0 auto 2rem auto'
                     }}>
                       This interactive map shows projected days above 32°C (90°F) under a 1.5°C warming scenario. 
                       Red areas indicate more extreme heat days, while blue areas show fewer changes. 
                       Explore the map to understand climate impacts on {selectedCity}.
                     </p>
                           
                           <div style={{
                             height: '600px',
                             borderRadius: '16px',
                             overflow: 'hidden',
                             border: '3px solid rgba(255, 215, 0, 0.3)',
                             background: 'rgba(255,255,255,0.05)',
                             boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255, 215, 0, 0.2)',
                             backdropFilter: 'blur(10px)',
                             WebkitBackdropFilter: 'blur(10px)'
                           }}>
                             <SimpleClimateMap 
                               city={selectedCity || ""} 
                               mapboxToken={mapboxToken}
                               onMapLoad={() => console.log('Climate map loaded successfully')}
                             />
                           </div>
                         </div>
                       </div>
                     )}

                     {/* Carte de comparaison Probable Futures */}
                     {showCompareMap && (
                       <div style={{
                         marginBottom: '2rem',
                         padding: '2rem',
                         background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 193, 7, 0.03))',
                         borderRadius: '20px',
                         border: '2px solid rgba(255, 215, 0, 0.2)',
                         boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255, 215, 0, 0.1)',
                         backdropFilter: 'blur(15px)',
                         WebkitBackdropFilter: 'blur(15px)',
                         position: 'relative',
                         overflow: 'hidden'
                       }}>
                         {/* Effet de texture */}
                         <div style={{
                           position: 'absolute',
                           top: 0,
                           left: 0,
                           right: 0,
                           bottom: 0,
                           background: 'radial-gradient(circle at 70% 30%, rgba(255, 215, 0, 0.03) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(255, 193, 7, 0.02) 0%, transparent 50%)',
                           pointerEvents: 'none'
                         }} />
                         
                         <div style={{ position: 'relative', zIndex: 1 }}>
                           <div style={{ 
                             display: 'flex', 
                             alignItems: 'center', 
                             justifyContent: 'center',
                             gap: '1rem', 
                             marginBottom: '2rem' 
                           }}>
                             <div style={{
                               width: '48px',
                               height: '48px',
                               borderRadius: '50%',
                               background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.8), rgba(255, 193, 7, 0.6))',
                               display: 'flex',
                               alignItems: 'center',
                               justifyContent: 'center',
                               fontSize: '1.8rem',
                               boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
                             }}>
                               🌍
                             </div>
                             <h4 style={{ 
                               fontSize: '1rem', 
                               fontWeight: 700, 
                               margin: 0,
                               color: 'rgba(255, 215, 0, 0.9)',
                               textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                               textAlign: 'center',
                               textTransform: 'uppercase',
                               letterSpacing: '1px'
                             }}>
                               Climate Zones Map
                             </h4>
                           </div>
                           
                           <p style={{ 
                             fontSize: '0.85rem', 
                             color: 'rgba(255,255,255,0.9)', 
                             marginBottom: '2rem',
                             textAlign: 'center',
                             fontStyle: 'italic',
                             lineHeight: '1.6',
                             maxWidth: '800px',
                             margin: '0 auto 2rem auto'
                           }}>
                             Interactive climate zones map based on Probable Futures showing how global warming will transform Earth's climate patterns under a 3°C warming scenario. 
                             Different colors represent distinct climate zones that will shift as temperatures rise. 
                             Explore how climate zones around {selectedCity} and globally will change.
                           </p>
                           
                           <div style={{
                             height: '600px',
                             borderRadius: '16px',
                             overflow: 'hidden',
                             border: '3px solid rgba(255, 215, 0, 0.3)',
                             background: 'rgba(255,255,255,0.05)',
                             boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255, 215, 0, 0.2)',
                             backdropFilter: 'blur(10px)',
                             WebkitBackdropFilter: 'blur(10px)'
                           }}>
                             <SimpleCompareMap 
                               city={selectedCity || ""} 
                               mapboxToken={mapboxToken}
                               onMapLoad={() => console.log('Comparison map loaded successfully')}
                             />
                           </div>
                         </div>
                       </div>
                     )}
                   </div>
                 </div>
               )}
             </div>
            
            {/* Section latérale - Contrôles climatiques */}
            <div style={{
              width: '400px',
              padding: '2rem',
              overflow: 'auto',
              borderLeft: '1px solid rgba(255, 215, 0, 0.2)',
              background: 'rgba(20, 33, 61, 0.3)',
              position: 'relative',
              zIndex: 1
            }}>
              {/* Section d'analyse climatique */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 193, 7, 0.03))',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Effet de texture */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.03) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(255, 193, 7, 0.02) 0%, transparent 50%)',
                  pointerEvents: 'none'
                }} />
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.8rem', 
                    marginBottom: '1.5rem' 
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.6), rgba(255, 193, 7, 0.4))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem'
                    }}>
                      🌡️
                    </div>
                    <h3 style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: 700, 
                      margin: 0,
                      color: 'rgba(255, 215, 0, 0.9)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}>
                      Climate Analysis
                    </h3>
                  </div>
                  
                  <p style={{ 
                    fontSize: '0.9rem', 
                    color: 'rgba(255,255,255,0.8)', 
                    marginBottom: '1.5rem',
                    fontStyle: 'italic'
                  }}>
                    Get a detailed analysis of climate change impacts on {selectedCity} including risks, vulnerabilities, and adaptation strategies.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    <button
                      onClick={handleClimateAnalysis}
                      disabled={loadingClimateAnalysis}
                      style={{
                        padding: '0.8rem 1.2rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        background: !loadingClimateAnalysis ? 'rgba(255, 215, 0, 0.8)' : 'rgba(255,255,255,0.3)',
                        color: !loadingClimateAnalysis ? '#1a237e' : 'rgba(255,255,255,0.6)',
                        cursor: !loadingClimateAnalysis ? 'pointer' : 'not-allowed',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {loadingClimateAnalysis ? (
                        <>
                          <span className="loader" style={{ width: 16, height: 16 }} />
                          Analyzing...
                        </>
                      ) : (
                        'Analyze Climate Impact'
                      )}
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowClimateMap(!showClimateMap);
                        setShowCompareMap(!showCompareMap);
                      }}
                      style={{
                        padding: '0.8rem 1.2rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(76, 175, 80, 0.3)',
                        background: (showClimateMap && showCompareMap) ? 'rgba(76, 175, 80, 0.8)' : 'rgba(255,255,255,0.3)',
                        color: (showClimateMap && showCompareMap) ? '#fff' : 'rgba(76, 175, 80, 0.8)',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {(showClimateMap && showCompareMap) ? '🗺️ Hide Maps' : '🗺️ Show Maps'}
                    </button>
                  </div>
                  
                  {climateAnalysisResult && (
                    <div style={{
                      background: 'rgba(255,255,255,0.95)',
                      border: '1px solid rgba(255, 215, 0, 0.2)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      marginTop: '1rem'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        marginBottom: '1rem' 
                      }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.6), rgba(255, 193, 7, 0.4))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.9rem'
                        }}>
                          🌡️
                        </div>
                        <strong style={{ color: '#1a237e', fontSize: '1rem' }}>Climate Analysis:</strong>
                      </div>
                      <div style={{ 
                        fontSize: '0.9rem',
                        lineHeight: '1.4'
                      }}>
                        <ReactMarkdown 
                          components={{
                            h1: ({children}) => <h1 style={{fontSize: '1rem', fontWeight: 600, marginBottom: '0.4rem', color: '#1a237e'}}>{children}</h1>,
                            h2: ({children}) => <h2 style={{fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.3rem', color: '#1a237e'}}>{children}</h2>,
                            h3: ({children}) => <h3 style={{fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.2rem', color: '#1a237e'}}>{children}</h3>,
                            p: ({children}) => <p style={{marginBottom: '0.4rem', lineHeight: '1.3'}}>{children}</p>,
                            ul: ({children}) => <ul style={{marginBottom: '0.4rem', paddingLeft: '1rem'}}>{children}</ul>,
                            ol: ({children}) => <ol style={{marginBottom: '0.4rem', paddingLeft: '1rem'}}>{children}</ol>,
                            li: ({children}) => <li style={{marginBottom: '0.1rem', lineHeight: '1.3'}}>{children}</li>,
                            strong: ({children}) => <strong style={{fontWeight: 600, color: '#1a237e'}}>{children}</strong>,
                            em: ({children}) => <em style={{fontStyle: 'italic', color: '#666'}}>{children}</em>,
                            code: ({children}) => <code style={{background: '#f5f5f5', padding: '0.1rem 0.2rem', borderRadius: '2px', fontSize: '0.8rem', fontFamily: 'monospace'}}>{children}</code>,
                            blockquote: ({children}) => <blockquote style={{borderLeft: '2px solid #1a237e', paddingLeft: '0.6rem', marginLeft: 0, fontStyle: 'italic', color: '#666'}}>{children}</blockquote>
                          }}
                        >
                          {climateAnalysisResult}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles CSS pour les animations et scrollbars */}
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        /* Scrollbar personnalisée pour tous les éléments */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 215, 0, 0.1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.8), rgba(255, 193, 7, 0.6));
          border-radius: 4px;
          border: 1px solid rgba(255, 215, 0, 0.3);
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.9), rgba(255, 193, 7, 0.8));
        }
        
        /* Pour Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 215, 0, 0.8) rgba(255, 215, 0, 0.1);
        }
      `}</style>
    </div>
  );
}