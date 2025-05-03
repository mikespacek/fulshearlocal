"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface MapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    position: { lat: number; lng: number };
    title: string;
    id: string;
  }>;
  onMarkerClick?: (id: string) => void;
  className?: string;
}

export function GoogleMap({
  center,
  zoom = 14,
  markers = [],
  onMarkerClick,
  className = "w-full h-full",
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [googleMarkers, setGoogleMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    // If we already have markers, clean them up
    if (googleMarkers.length > 0) {
      googleMarkers.forEach((marker) => marker.setMap(null));
      setGoogleMarkers([]);
    }

    // If map is loaded and we have map and markers to add
    if (mapLoaded && map && markers.length > 0) {
      const newMarkers = markers.map((markerData) => {
        const marker = new google.maps.Marker({
          position: markerData.position,
          map,
          title: markerData.title,
        });

        if (onMarkerClick) {
          marker.addListener("click", () => {
            onMarkerClick(markerData.id);
          });
        }

        return marker;
      });

      setGoogleMarkers(newMarkers);
    }
  }, [mapLoaded, map, markers, onMarkerClick, googleMarkers]);

  useEffect(() => {
    if (!mapRef.current || mapLoaded) return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.error("Google Maps API key is missing");
      return;
    }

    const loader = new Loader({
      apiKey,
      version: "weekly",
    });

    loader
      .load()
      .then(() => {
        if (mapRef.current) {
          const newMap = new google.maps.Map(mapRef.current, {
            center,
            zoom,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          });
          setMap(newMap);
          setMapLoaded(true);
        }
      })
      .catch((error) => {
        console.error("Error loading Google Maps:", error);
      });
  }, [center, zoom, mapLoaded]);

  // Update map center when prop changes
  useEffect(() => {
    if (map && mapLoaded) {
      map.setCenter(center);
    }
  }, [center, map, mapLoaded]);

  return (
    <div className={className}>
      {!mapLoaded && (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-gray-500">Loading map...</div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full rounded-lg" />
    </div>
  );
} 