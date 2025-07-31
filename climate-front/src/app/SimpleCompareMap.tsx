"use client";
import { useState, useEffect } from 'react';

interface SimpleCompareMapProps {
  city: string;
  mapboxToken: string;
  onMapLoad?: () => void;
}

export default function SimpleCompareMap({ city, mapboxToken, onMapLoad }: SimpleCompareMapProps) {
  const [coordinates, setCoordinates] = useState<{ longitude: number; latitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCity, setShowCity] = useState(false);

  useEffect(() => {
    if (!city) return;

    const getCoordinates = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${mapboxToken}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch coordinates');
        }
        
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const [longitude, latitude] = data.features[0].center;
          setCoordinates({ longitude, latitude });
        } else {
          setError('City not found');
        }
      } catch (err) {
        setError('Error getting coordinates');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    getCoordinates();
  }, [city, mapboxToken]);

  useEffect(() => {
    if (coordinates && onMapLoad) {
      onMapLoad();
    }
  }, [coordinates, onMapLoad]);

  const handleShowCity = () => {
    setShowCity(true);
  };

  if (loading) {
    return (
      <div style={{
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ textAlign: 'center', color: '#1976d2' }}>
          <div className="loader" style={{ margin: '0 auto 1rem', width: 32, height: 32 }} />
          <p>Loading climate zones map for {city}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.2)',
        color: '#d32f2f'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p>Error loading climate zones map: {error}</p>
        </div>
      </div>
    );
  }

  if (!coordinates) {
    return null;
  }

  // URL avec vue globe centrée sur l'hémisphère nord, puis centrage sur la ville si demandé
  const baseUrl = `https://probablefutures.org/maps/?selected_map=climate_zones&version=latest&scenario=3&view=globe#2/45/0`;
  const cityUrl = `https://probablefutures.org/maps/?selected_map=climate_zones&version=latest&scenario=3&view=globe#6/${coordinates.latitude}/${coordinates.longitude}`;
  
  const currentUrl = showCity ? cityUrl : baseUrl;

  return (
    <div style={{
      height: '100%',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.2)',
      background: 'rgba(255,255,255,0.05)',
      position: 'relative'
    }}>
      <iframe
        src={currentUrl}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '12px'
        }}
        title="Climate Zones Map - 3°C Warming Scenario"
        allow="geolocation"
      />
      {!showCity && coordinates && (
        <button
          onClick={handleShowCity}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 152, 0, 0.9)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 152, 0, 1)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 152, 0, 0.9)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          🎯 Show {city}
        </button>
      )}
    </div>
  );
} 