"use client";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

interface Mapbox3DMapProps {
  city: string;
  mapboxToken: string;
  mapStyle: string;
  animate?: boolean;
}

export default function Mapbox3DMap({ city, mapboxToken, mapStyle, animate = true }: Mapbox3DMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const animationRef = useRef<number | null>(null);
  const globeAnimationActive = useRef(false);

  // Initialisation de la carte une seule fois
  useEffect(() => {
    if (!mapboxToken) return;
    if (mapRef.current) return;
    const map = new mapboxgl.Map({
      container: mapContainer.current!,
      style: mapStyle,
      center: [0, 0],
      zoom: 0,
      pitch: 0,
      bearing: 0,
      accessToken: mapboxToken,
      projection: 'globe',
      attributionControl: false,
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl());
    map.on('style.load', () => {
      map.setConfigProperty('basemap', 'lightPreset', 'dawn');
    });
    // Nettoyage
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapboxToken, mapStyle, animate]);

  // Quand animate change, force le zoom initial si animate=false
  useEffect(() => {
    if (!mapRef.current) return;
    if (!animate) {
      mapRef.current.jumpTo({ center: [0, 0], zoom: 0, pitch: 0, bearing: 0 });
    }
  }, [animate]);

  // Quand la ville change, flyTo animé
  useEffect(() => {
    if (!mapRef.current) return;
    if (!city) {
      // Si on revient à la mappemonde, relance l'animation seulement si animate
      if (animate) {
        globeAnimationActive.current = true;
        animationRef.current = requestAnimationFrame(function animateGlobe(time) {
          if (!mapRef.current || !globeAnimationActive.current) return;
          const bearing = mapRef.current.getBearing();
          mapRef.current.setBearing(bearing + 0.018);
          mapRef.current.setPitch(0);
          animationRef.current = requestAnimationFrame(animateGlobe);
        });
      } else {
        globeAnimationActive.current = false;
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      }
      mapRef.current.flyTo({ center: [0, 0], zoom: 1.3, pitch: 0, bearing: 0, speed: 0.8, curve: 1.8, essential: true });
      return;
    }
    // Stoppe l'animation globe
    globeAnimationActive.current = false;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    // Géocode la ville puis flyTo
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${mapboxToken}`)
      .then(res => res.json())
      .then(data => {
        const coords = data.features?.[0]?.center;
        if (!coords) return;
        mapRef.current!.flyTo({
          center: coords,
          zoom: 16,
          pitch: 60,
          bearing: -20,
          speed: 0.8,
          curve: 1.8,
          essential: true
        });
      });

    // Animation de survol après le flyTo
    const startHoverAnimation = () => {
      let lastTime: number | null = null;
      const animate = (time: number) => {
        if (!mapRef.current) return;
        if (!lastTime) lastTime = time;
        const elapsed = time - lastTime;
        // Incrémente le bearing très lentement (0.02° par frame)
        const currentBearing = mapRef.current.getBearing();
        mapRef.current.setBearing(currentBearing + 0.02);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    };

    // Lance l'animation après la fin du flyTo
    mapRef.current!.once('moveend', startHoverAnimation);
  }, [city]);

  // Animation globe progressive, durée dépend de animate
  useEffect(() => {
    if (!mapRef.current) return;
    let startTime: number | null = null;
    let initialZoom = mapRef.current.getZoom();
    const targetZoom = 1.3;
    const zoomDuration = animate ? 12000 : 90000; // plus lent : 12s après intro, 90s avant (ajuste si besoin)
    const animateGlobe = (time: number) => {
      if (!mapRef.current || !globeAnimationActive.current) return;
      if (!startTime) startTime = time;
      const bearing = mapRef.current.getBearing();
      mapRef.current.setBearing(bearing + 0.018);
      mapRef.current.setPitch(0);
      const elapsed = time - startTime;
      if (elapsed < zoomDuration) {
        const zoom = initialZoom + (targetZoom - initialZoom) * (elapsed / zoomDuration);
        mapRef.current.setZoom(zoom);
        animationRef.current = requestAnimationFrame(animateGlobe);
      } else {
        mapRef.current.setZoom(targetZoom);
      }
    };
    // Démarre l'animation globe
    if (globeAnimationActive.current || (!animate && mapRef.current.getZoom() < targetZoom)) {
      globeAnimationActive.current = true;
      animationRef.current = requestAnimationFrame(animateGlobe);
    }
    // Nettoyage
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "100%", borderRadius: 12 }}
    />
  );
} 