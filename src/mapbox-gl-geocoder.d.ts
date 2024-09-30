declare module '@mapbox/mapbox-gl-geocoder' {
    import { IControl } from 'mapbox-gl';
  
    interface GeocoderOptions {
      accessToken: string;
      placeholder?: string;
      proximity?: {
        longitude: number;
        latitude: number;
      };
      bbox?: [number, number, number, number];
      types?: string;
      country?: string;
      minLength?: number;
      limit?: number;
      language?: string;
      filter?: (feature: any) => boolean;
      localGeocoder?: (query: string) => any[];
      zoom?: number;
      flyTo?: boolean | object;
      marker?: boolean | object;
      mapboxgl?: any;
      collapsed?: boolean;
      clearAndBlurOnEsc?: boolean;
      clearOnBlur?: boolean;
      trackProximity?: boolean;
      collapsed?: boolean;
    }
  
    export default class MapboxGeocoder implements IControl {
      on(arg0: string, arg1: (e: any) => void) {
          throw new Error('Method not implemented.');
      }
      constructor(options: GeocoderOptions);
      onAdd(map: mapboxgl.Map): HTMLElement;
      onRemove(): void;
      setProximity(proximity: { longitude: number; latitude: number }): void;
      getProximity(): { longitude: number; latitude: number } | undefined;
      setBbox(bbox: [number, number, number, number]): void;
      getBbox(): [number, number, number, number] | undefined;
      setTypes(types: string): void;
      getTypes(): string | undefined;
      setCountry(country: string): void;
      getCountry(): string | undefined;
      setMinLength(minLength: number): void;
      getMinLength(): number | undefined;
      setLimit(limit: number): void;
      getLimit(): number | undefined;
      setLanguage(language: string): void;
      getLanguage(): string | undefined;
      setZoom(zoom: number): void;
      getZoom(): number | undefined;
      setFlyTo(flyTo: boolean | object): void;
      getFlyTo(): boolean | object | undefined;
      setMarker(marker: boolean | object): void;
      getMarker(): boolean | object | undefined;
      setPlaceholder(placeholder: string): void;
      getPlaceholder(): string | undefined;
      setFilter(filter: (feature: any) => boolean): void;
      getFilter(): ((feature: any) => boolean) | undefined;
      setLocalGeocoder(localGeocoder: (query: string) => any[]): void;
      getLocalGeocoder(): ((query: string) => any[]) | undefined;
      setClearOnBlur(clearOnBlur: boolean): void;
      getClearOnBlur(): boolean | undefined;
      setTrackProximity(trackProximity: boolean): void;
      getTrackProximity(): boolean | undefined;
    }
  }
  