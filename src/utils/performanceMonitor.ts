/**
 * System monitorowania wydajności aplikacji 3D
 * Zbiera metryki: FPS, czas renderowania, użycie pamięci, informacje o sprzęcie
 */

export interface PerformanceMetrics {
  fps: number;
  frameTime: number; // w milisekundach
  memoryUsage?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  drawCalls?: number;
  triangles?: number;
  timestamp: number;
}

export interface HardwareInfo {
  gpu?: string;
  gpuVendor?: string;
  renderer?: string;
  platform: string;
  userAgent: string;
  screenResolution: string;
  devicePixelRatio: number;
  cores?: number;
  memory?: number;
}

export interface PerformanceSession {
  sessionId: string;
  hardwareInfo: HardwareInfo;
  metrics: PerformanceMetrics[];
  startTime: number;
  endTime?: number;
  averageFPS: number;
  minFPS: number;
  maxFPS: number;
  averageFrameTime: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 0;
  private frameTime = 0;
  private sessionId: string;
  private hardwareInfo: HardwareInfo | null = null;
  private isMonitoring = false;
  private animationFrameId: number | null = null;
  private gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;

  constructor() {
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    // Opóźnij wykrywanie sprzętu do momentu gdy jest dostępne środowisko przeglądarki
    if (typeof window !== 'undefined') {
      this.detectHardware();
    }
  }

  /**
   * Wykrywa informacje o sprzęcie użytkownika
   */
  private detectHardware(): void {
    // Sprawdź czy jesteśmy w środowisku przeglądarki
    if (typeof document === 'undefined' || typeof window === 'undefined' || typeof navigator === 'undefined') {
      this.hardwareInfo = {
        platform: 'Unknown',
        userAgent: 'Unknown',
        screenResolution: 'Unknown',
        devicePixelRatio: 1,
      };
      return;
    }

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
    
    let gpuInfo = 'Unknown';
    let gpuVendor = 'Unknown';
    let renderer = 'Unknown';

    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        gpuVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'Unknown';
        gpuInfo = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown';
        renderer = gpuInfo;
      }
    }

    const hardwareInfo: HardwareInfo = {
      gpu: gpuInfo,
      gpuVendor: gpuVendor,
      renderer: renderer,
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      devicePixelRatio: window.devicePixelRatio,
      cores: (navigator as Navigator & { hardwareConcurrency?: number }).hardwareConcurrency,
      memory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory,
    };

    this.hardwareInfo = hardwareInfo;
  }

  /**
   * Ustawia kontekst WebGL do zbierania dodatkowych metryk
   */
  setGLContext(gl: WebGLRenderingContext | WebGL2RenderingContext): void {
    this.gl = gl;
  }

  /**
   * Rozpoczyna monitorowanie wydajności
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.metrics = [];
    this.frameCount = 0;
    this.lastTime = performance.now();
    
    this.tick();
  }

  /**
   * Zatrzymuje monitorowanie wydajności
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Główna pętla monitorowania
   */
  private tick = (): void => {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    
    this.frameCount++;
    
    // Oblicz FPS co sekundę
    if (deltaTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / deltaTime);
      this.frameTime = deltaTime / this.frameCount;
      
      // Zbierz metryki
      const metric: PerformanceMetrics = {
        fps: this.fps,
        frameTime: this.frameTime,
        timestamp: currentTime,
      };

      // Dodaj informacje o pamięci jeśli dostępne
      if ('memory' in performance) {
        const memory = (performance as Performance & { memory?: {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        }}).memory;
        if (memory) {
          metric.memoryUsage = {
            usedJSHeapSize: memory.usedJSHeapSize,
            totalJSHeapSize: memory.totalJSHeapSize,
            jsHeapSizeLimit: memory.jsHeapSizeLimit,
          };
        }
      }

      // Dodaj informacje o renderowaniu jeśli dostępne
      if (this.gl) {
        // Draw calls i triangles wymagają dodatkowych rozszerzeń lub bibliotek
        this.gl.getExtension('WEBGL_debug_renderer_info');
      }

      this.metrics.push(metric);
      
      // Reset liczników
      this.frameCount = 0;
      this.lastTime = currentTime;
    }

    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  /**
   * Pobiera aktualne metryki
   */
  getCurrentMetrics(): PerformanceMetrics | null {
    if (this.metrics.length === 0) return null;
    return this.metrics[this.metrics.length - 1];
  }

  /**
   * Pobiera wszystkie zebrane metryki
   */
  getAllMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Pobiera informacje o sprzęcie
   */
  getHardwareInfo(): HardwareInfo | null {
    return this.hardwareInfo;
  }

  /**
   * Generuje raport sesji wydajności
   */
  generateSessionReport(): PerformanceSession | null {
    // Sprawdź czy mamy minimalne wymagania
    if (this.metrics.length === 0) {
      console.warn('PerformanceMonitor: No metrics collected');
      return null;
    }
    
    if (!this.hardwareInfo) {
      console.warn('PerformanceMonitor: Hardware info not available');
      // Spróbuj wykryć hardware info jeśli jesteśmy w przeglądarce
      if (typeof window !== 'undefined') {
        this.detectHardware();
        if (!this.hardwareInfo) {
          // Użyj domyślnych wartości jako fallback
          this.hardwareInfo = {
            platform: navigator.platform || 'Unknown',
            userAgent: navigator.userAgent || 'Unknown',
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            devicePixelRatio: window.devicePixelRatio || 1,
          };
        }
      } else {
        return null;
      }
    }

    const fpsValues = this.metrics.map(m => m.fps);
    const frameTimeValues = this.metrics.map(m => m.frameTime);

    const session: PerformanceSession = {
      sessionId: this.sessionId,
      hardwareInfo: this.hardwareInfo,
      metrics: [...this.metrics],
      startTime: this.metrics[0]?.timestamp || Date.now(),
      endTime: this.metrics[this.metrics.length - 1]?.timestamp,
      averageFPS: Math.round(fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length),
      minFPS: Math.min(...fpsValues),
      maxFPS: Math.max(...fpsValues),
      averageFrameTime: frameTimeValues.reduce((a, b) => a + b, 0) / frameTimeValues.length,
    };

    return session;
  }

  /**
   * Resetuje monitorowanie (nowa sesja)
   */
  reset(): void {
    this.stopMonitoring();
    this.metrics = [];
    this.frameCount = 0;
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.lastTime = performance.now();
  }
}

// Singleton instance
let performanceMonitorInstance: PerformanceMonitor | null = null;

export const getPerformanceMonitor = (): PerformanceMonitor => {
  if (!performanceMonitorInstance) {
    performanceMonitorInstance = new PerformanceMonitor();
  }
  return performanceMonitorInstance;
};

export default PerformanceMonitor;

