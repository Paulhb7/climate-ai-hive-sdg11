"use client";
import { useState } from "react";
import Mapbox3DMap from "./Mapbox3DMap";
import { useEffect } from "react";

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
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [additionalQuestion, setAdditionalQuestion] = useState("");
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [questionResponse, setQuestionResponse] = useState<string | null>(null);
  const [loadingClimateAnalysis, setLoadingClimateAnalysis] = useState(false);
  const [climateAnalysisResult, setClimateAnalysisResult] = useState<string | null>(null);

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

  return (
    <div style={{ minHeight: "100vh", minWidth: "100vw", position: "relative", overflow: "hidden", background: "#14213d" }}>
      {/* Globe en arrière-plan */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "800px",
        height: "800px",
        opacity: 0.1,
        zIndex: 0,
        backgroundImage: "url('/globe.svg')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        filter: "invert(1) brightness(0.8)"
      }} />
      {/* Box d'intro description agent */}
      {showIntro && (
        <>
          <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          minWidth: 850,
          maxWidth: "1200px",
          maxHeight: "80vh",
          background: "rgba(20, 33, 61, 0.15)",
          color: "#fff",
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 24,
          padding: "3rem 2.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "'IBM Plex Sans', 'Inter', Arial, sans-serif",
          fontSize: "1rem",
          textAlign: "center",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          overflow: "auto"
        }}>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 700, marginBottom: 8 }}>🌍🐝 Climate Hive</h1>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 400, marginBottom: 20, color: "#90caf9", fontStyle: "italic" }}>🤖 AI-Powered Urban Climate Adaptation Platform</h2>
          <p style={{ marginBottom: 0, lineHeight: "1.6" }}>
            Welcome to Climate Hive, an AI-powered platform designed to support cities in their climate adaptation journey by aligning with UN Sustainable Development Goal 11.<br /><br />
            <b>🎯 Our Mission:</b><br />
            • 🌡️ Analyze climate change impacts on cities worldwide<br />
            • 🏙️ Provide personalized recommendations for urban resilience<br />
            • 🏛️ Showcase UN projects and initiatives for sustainable cities<br />
            • 📋 Help cities understand and implement SDG 11 targets<br /><br />
            <b>⚡ Technology:</b><br />
            Powered by BeeAI agents built on WatsonX and Granite models, with data from UN SDG API and OpenMeteo climate services.
          </p>
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
            onClick={e => { e.preventDefault?.(); setShowIntro(false); }}
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
              background: "linear-gradient(135deg, #1976d2, #42a5f5)",
              color: "#fff",
              fontWeight: 700,
              borderRadius: 16,
              border: "none",
              boxShadow: "0 4px 16px rgba(25, 118, 210, 0.3)",
              height: 52,
              minWidth: 180,
              fontSize: "1.1rem",
              padding: "0 2rem",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(.4,2,.6,1)",
              fontFamily: "'IBM Plex Sans', 'Inter', Arial, sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}
          >
            Get Started
          </button>
        </div>
        </>
      )}
      {/* Carte et box de recherche seulement après intro */}
      {!showIntro && (
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
            background: "rgba(255,255,255,0.08)",
            boxShadow: "0 8px 32px 0 rgba(44,83,100,0.10)",
            borderRadius: 24,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            padding: "2.5rem 2.5rem 2rem 2.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
            fontFamily: "'IBM Plex Sans', 'Inter', Arial, sans-serif",
            fontSize: "0.98rem",
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
                  border: "1.5px solid #90caf9",
                  fontSize: "0.98rem",
                  minWidth: 220,
                  outline: "none",
                  background: "rgba(248,251,255,0.85)",
                  color: "#1a237e",
                  boxShadow: "0 2px 8px rgba(44,83,100,0.04)",
                  transition: "border 0.2s",
                  height: 48,
                  marginBottom: 0,
                  textAlign: "center",
                  fontFamily: "'IBM Plex Sans', 'Inter', Arial, sans-serif",
                  flex: 1
                }}
                required
              />
              <button
                type="submit"
                disabled={!city}
                className="glassmorphism"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "#1a237e",
                  cursor: !city ? "not-allowed" : "pointer",
                  opacity: !city ? 0.7 : 1,
                  height: 48,
                  minWidth: 180,
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  borderRadius: 12,
                  border: "1.5px solid #e0e0e0",
                  boxShadow: "0 2px 12px rgba(44,83,100,0.10)",
                  marginTop: 0,
                  marginBottom: 0,
                  marginLeft: 8,
                  transition: "all 0.25s cubic-bezier(.4,2,.6,1)",
                  backdropFilter: "blur(8px)",
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
                  background: "rgba(255,255,255,0.13)",
                  color: gettingLocation ? "#888" : "#1976d2",
                  fontWeight: 600,
                  borderRadius: 12,
                  border: "1.5px solid #e0e0e0",
                  boxShadow: "0 2px 8px rgba(44,83,100,0.08)",
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
                  padding: 0
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
                  background: "rgba(255,255,255,0.08)",
                  color: "#1a237e",
                  fontWeight: 700,
                  borderRadius: 12,
                  border: "1.5px solid #e0e0e0",
                  boxShadow: "0 2px 12px rgba(44,83,100,0.10)",
                  height: 48,
                  minWidth: 240,
                  fontSize: "0.95rem",
                  marginTop: 12,
                  cursor: "pointer",
                  transition: "all 0.25s cubic-bezier(.4,2,.6,1)",
                  opacity: 0.92,
                  backdropFilter: "blur(8px)",
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
                  <div className="glassmorphism" style={{ padding: 18, borderRadius: 16, textAlign: 'center', fontWeight: 500, color: '#1976d2', fontSize: '1.08rem', minWidth: 220 }}>
                    <span className="loader" style={{ marginRight: 10, verticalAlign: 'middle' }} />
                    Agents are working...
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
      
      {/* Popup de résultat - positionnée en dehors de la structure pour un centrage parfait */}
      {agentResult && (
        <div className="glassmorphism" style={{ 
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '85vw',
          maxWidth: '1200px',
          height: '80vh',
          padding: '2rem',
          borderRadius: 20,
          textAlign: 'left',
          fontWeight: 400,
          color: '#1a237e',
          fontSize: '0.9rem',
          lineHeight: '1.5',
          overflow: 'auto',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          border: '1.5px solid #e0e0e0',
          boxShadow: '0 8px 32px rgba(44,83,100,0.15)',
          zIndex: 1000
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '1.5rem',
            borderBottom: '1px solid #e0e0e0',
            paddingBottom: '1rem'
          }}>
            <strong style={{ fontSize: '1.2rem', fontWeight: 600 }}>Climate Hive Analysis for {selectedCity} - SDG 11 Recommendations:</strong>
            <button
              onClick={() => setAgentResult(null)}
              style={{
                background: 'rgba(255,255,255,0.8)',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontSize: '0.8rem',
                color: '#666'
              }}
            >
              Close
            </button>
          </div>
          <div style={{ 
            whiteSpace: 'pre-wrap',
            fontFamily: "'IBM Plex Sans', 'Inter', Arial, sans-serif",
            marginBottom: '2rem'
          }}>
            {agentResult}
          </div>
          
          {/* Encart de questions supplémentaires */}
          <div style={{
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '1.5rem',
            background: 'rgba(248,251,255,0.8)',
            marginTop: '1rem'
          }}>
            <h3 style={{ 
              fontSize: '1.1rem', 
              fontWeight: 600, 
              marginBottom: '1rem',
              color: '#1976d2'
            }}>
              💬 Ask a follow-up question to the agent
            </h3>
            <p style={{ 
              fontSize: '0.9rem', 
              color: '#666', 
              marginBottom: '1rem',
              fontStyle: 'italic'
            }}>
              Ask if a specific proposal meets Goal 11 criteria or ask any other question about the recommendations.
            </p>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={additionalQuestion}
                onChange={(e) => setAdditionalQuestion(e.target.value)}
                placeholder="Ex: Does installing solar panels meet the criteria?"
                style={{
                  flex: 1,
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleAdditionalQuestion()}
              />
              <button
                onClick={handleAdditionalQuestion}
                disabled={!additionalQuestion.trim() || loadingQuestion}
                style={{
                  padding: '0.8rem 1.2rem',
                  borderRadius: '8px',
                  border: '1px solid #1976d2',
                  background: additionalQuestion.trim() && !loadingQuestion ? '#1976d2' : '#f5f5f5',
                  color: additionalQuestion.trim() && !loadingQuestion ? 'white' : '#999',
                  cursor: additionalQuestion.trim() && !loadingQuestion ? 'pointer' : 'not-allowed',
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}
              >
                {loadingQuestion ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="loader" style={{ width: 16, height: 16 }} />
                    Sending...
                  </span>
                ) : (
                  'Ask'
                )}
              </button>
            </div>
            
            {questionResponse && (
              <div style={{
                background: 'rgba(255,255,255,0.9)',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '1rem',
                marginTop: '1rem'
              }}>
                <strong style={{ color: '#1976d2', fontSize: '0.9rem' }}>Agent response:</strong>
                <div style={{ 
                  marginTop: '0.5rem',
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.9rem',
                  lineHeight: '1.4'
                }}>
                  {questionResponse}
                </div>
              </div>
            )}
            
            {/* Bouton d'analyse climatique */}
            <div style={{
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              padding: '1.5rem',
              background: 'rgba(248,251,255,0.8)',
              marginTop: '1rem'
            }}>
              <h3 style={{ 
                fontSize: '1.1rem', 
                fontWeight: 600, 
                marginBottom: '1rem',
                color: '#1976d2'
              }}>
                🌍 Climate Change Impact Analysis
              </h3>
              <p style={{ 
                fontSize: '0.9rem', 
                color: '#666', 
                marginBottom: '1rem',
                fontStyle: 'italic'
              }}>
                Get a detailed analysis of climate change impacts on {selectedCity} including risks, vulnerabilities, and adaptation strategies.
              </p>
              
              <button
                onClick={handleClimateAnalysis}
                disabled={loadingClimateAnalysis}
                style={{
                  padding: '0.8rem 1.5rem',
                  borderRadius: '8px',
                  border: '1px solid #1976d2',
                  background: !loadingClimateAnalysis ? '#1976d2' : '#f5f5f5',
                  color: !loadingClimateAnalysis ? 'white' : '#999',
                  cursor: !loadingClimateAnalysis ? 'pointer' : 'not-allowed',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {loadingClimateAnalysis ? (
                  <>
                    <span className="loader" style={{ width: 16, height: 16 }} />
                    Analyzing...
                  </>
                ) : (
                  'Analyse Climate change impact on the city'
                )}
              </button>
              
              {climateAnalysisResult && (
                <div style={{
                  background: 'rgba(255,255,255,0.9)',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginTop: '1rem'
                }}>
                  <strong style={{ color: '#1976d2', fontSize: '0.9rem' }}>Climate Analysis for {selectedCity}:</strong>
                  <div style={{ 
                    marginTop: '0.5rem',
                    whiteSpace: 'pre-wrap',
                    fontSize: '0.9rem',
                    lineHeight: '1.4'
                  }}>
                    {climateAnalysisResult}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}