declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: any);
      setCenter(latLng: {lat: number, lng: number}): void;
    }
    
    class Marker {
      constructor(opts?: any);
      setMap(map: Map | null): void;
      addListener(event: string, callback: Function): void;
    }
  }
} 