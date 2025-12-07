/**
 * System automatycznych testów wydajności (benchmarków)
 * Testuje różne konfiguracje jakości, rozdzielczości i scenariusze użycia
 * w celu określenia minimalnych wymagań sprzętowych
 */

import { getPerformanceMonitor, PerformanceSession, HardwareInfo } from './performanceMonitor';

export interface BenchmarkConfig {
  name: string;
  description: string;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  resolution: {
    width: number;
    height: number;
  };
  pixelRatio: number;
  antialiasing: boolean;
  shadows: boolean;
  postProcessing: boolean;
  videoEnabled: boolean;
  duration: number; // w sekundach
}

export interface BenchmarkResult {
  config: BenchmarkConfig;
  session: PerformanceSession;
  passed: boolean;
  score: number; // 0-100
  recommendations: string[];
  minRequirements: {
    gpu?: string;
    memory?: number;
    cores?: number;
  };
}

export interface BenchmarkSuite {
  suiteId: string;
  hardwareInfo: HardwareInfo;
  results: BenchmarkResult[];
  startTime: number;
  endTime?: number;
  overallScore: number;
  minRequirements: {
    gpu?: string;
    memory?: number;
    cores?: number;
  };
}

class PerformanceBenchmark {
  private suite: BenchmarkSuite | null = null;
  private currentConfig: BenchmarkConfig | null = null;
  private monitor = getPerformanceMonitor();

  /**
   * Predefiniowane konfiguracje testów
   */
  static readonly PRESETS: BenchmarkConfig[] = [
    {
      name: 'Low Quality - Minimum Requirements',
      description: 'Najniższa jakość - test minimalnych wymagań',
      quality: 'low',
      resolution: { width: 1280, height: 720 },
      pixelRatio: 1,
      antialiasing: false,
      shadows: false,
      postProcessing: false,
      videoEnabled: true,
      duration: 30,
    },
    {
      name: 'Medium Quality - Standard',
      description: 'Średnia jakość - standardowe użycie',
      quality: 'medium',
      resolution: { width: 1920, height: 1080 },
      pixelRatio: 1,
      antialiasing: true,
      shadows: true,
      postProcessing: false,
      videoEnabled: true,
      duration: 30,
    },
    {
      name: 'High Quality - Recommended',
      description: 'Wysoka jakość - zalecana konfiguracja',
      quality: 'high',
      resolution: { width: 1920, height: 1080 },
      pixelRatio: 1.5,
      antialiasing: true,
      shadows: true,
      postProcessing: true,
      videoEnabled: true,
      duration: 30,
    },
    {
      name: 'Ultra Quality - Maximum',
      description: 'Najwyższa jakość - maksymalne ustawienia',
      quality: 'ultra',
      resolution: { width: 2560, height: 1440 },
      pixelRatio: 2,
      antialiasing: true,
      shadows: true,
      postProcessing: true,
      videoEnabled: true,
      duration: 30,
    },
  ];

  /**
   * Rozpoczyna pełną serię testów benchmarkowych
   */
  async startBenchmarkSuite(configs: BenchmarkConfig[] = PerformanceBenchmark.PRESETS): Promise<BenchmarkSuite> {
    const hardwareInfo = this.monitor.getHardwareInfo();
    if (!hardwareInfo) {
      throw new Error('Hardware info not available');
    }

    this.suite = {
      suiteId: `benchmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      hardwareInfo,
      results: [],
      startTime: Date.now(),
      overallScore: 0,
      minRequirements: {},
    };

    // Uruchom testy sekwencyjnie
    for (const config of configs) {
      const result = await this.runBenchmark(config);
      this.suite.results.push(result);
    }

    this.suite.endTime = Date.now();
    this.suite.overallScore = this.calculateOverallScore(this.suite.results);
    this.suite.minRequirements = this.determineMinRequirements(this.suite.results);

    return this.suite;
  }

  /**
   * Uruchamia pojedynczy test benchmarkowy
   */
  async runBenchmark(config: BenchmarkConfig): Promise<BenchmarkResult> {
    this.currentConfig = config;

    // Sprawdź czy hardware info jest dostępne
    let hardwareInfo = this.monitor.getHardwareInfo();
    if (!hardwareInfo) {
      // Spróbuj wykryć hardware info ponownie
      if (typeof window !== 'undefined') {
        // Wymuś ponowne wykrycie hardware
        this.monitor.redetectHardware();
        hardwareInfo = this.monitor.getHardwareInfo();
      }
      
      // Jeśli nadal nie ma, użyj domyślnych wartości
      if (!hardwareInfo) {
        hardwareInfo = {
          platform: typeof navigator !== 'undefined' ? navigator.platform : 'Unknown',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
          screenResolution: typeof window !== 'undefined' 
            ? `${window.screen.width}x${window.screen.height}` 
            : 'Unknown',
          devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
        };
      }
    }

    // Sprawdź czy Canvas/WebGL jest dostępny (wymagane dla benchmarków)
    if (typeof window !== 'undefined') {
      const canvas = document.querySelector('canvas');
      if (!canvas) {
        throw new Error('Canvas not found. Please navigate to the 3D scene page first and wait for it to load completely.');
      }
      
      // Sprawdź czy WebGL jest dostępny
      const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
      if (!gl) {
        throw new Error('WebGL is not available. Your browser or device may not support WebGL.');
      }
    }

    // Reset monitora
    this.monitor.reset();
    
    // Upewnij się, że hardware info jest ustawione
    if (!this.monitor.getHardwareInfo() && hardwareInfo) {
      this.monitor.setHardwareInfo(hardwareInfo);
    }
    
    // Ustaw kontekst WebGL jeśli dostępny
    if (typeof window !== 'undefined') {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
        if (gl) {
          this.monitor.setGLContext(gl);
        }
      }
    }
    
    this.monitor.startMonitoring();

    // Czekaj na stabilizację (2 sekundy)
    await this.wait(2000);

    // Uruchom test przez określony czas
    await this.wait(config.duration * 1000);

    // Zatrzymaj monitorowanie
    this.monitor.stopMonitoring();

    // Pobierz wyniki
    const session = this.monitor.generateSessionReport();
    if (!session) {
      // Sprawdź dlaczego nie udało się wygenerować raportu
      const metrics = this.monitor.getAllMetrics();
      const hwInfo = this.monitor.getHardwareInfo();
      
      const errorDetails = {
        metricsCount: metrics.length,
        hasHardwareInfo: !!hwInfo,
        isMonitoring: false,
      };
      
      console.error('Failed to generate session report:', errorDetails);
      
      // Jeśli nie ma metryk, stwórz minimalny raport
      if (metrics.length === 0) {
        throw new Error('No metrics collected during benchmark. Make sure you are on the 3D scene page and the page is fully loaded.');
      }
      
      if (!hwInfo) {
        throw new Error('Hardware information not available. Please refresh the page and try again.');
      }
      
      throw new Error(`Failed to generate session report: ${JSON.stringify(errorDetails)}`);
    }

    // Analizuj wyniki
    const passed = this.evaluatePerformance(session, config);
    const score = this.calculateScore(session, config);
    const recommendations = this.generateRecommendations(session, config, score);
    const minRequirements = this.estimateMinRequirements(session, config);

    return {
      config,
      session,
      passed,
      score,
      recommendations,
      minRequirements,
    };
  }

  /**
   * Ocenia czy wydajność jest akceptowalna
   */
  private evaluatePerformance(session: PerformanceSession, config: BenchmarkConfig): boolean {
    const minFPS = this.getMinFPSForQuality(config.quality);
    return session.averageFPS >= minFPS && session.minFPS >= minFPS * 0.8;
  }

  /**
   * Oblicza wynik (0-100) dla konfiguracji
   */
  private calculateScore(session: PerformanceSession, config: BenchmarkConfig): number {
    const targetFPS = this.getTargetFPSForQuality(config.quality);
    const fpsScore = Math.min(100, (session.averageFPS / targetFPS) * 100);
    
    const targetFrameTime = 1000 / targetFPS;
    const frameTimeScore = Math.min(100, (targetFrameTime / session.averageFrameTime) * 100);
    
    // Średnia ważona: 70% FPS, 30% Frame Time
    return Math.round(fpsScore * 0.7 + frameTimeScore * 0.3);
  }

  /**
   * Oblicza ogólny wynik dla całej serii testów (publiczna metoda)
   */
  calculateOverallScore(results: BenchmarkResult[]): number {
    if (results.length === 0) return 0;
    
    const scores = results.map(r => r.score);
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }

  /**
   * Określa minimalne wymagania na podstawie wszystkich testów (publiczna metoda)
   */
  determineMinRequirementsPublic(results: BenchmarkResult[]): BenchmarkSuite['minRequirements'] {
    return this.determineMinRequirements(results);
  }

  /**
   * Generuje rekomendacje na podstawie wyników
   */
  private generateRecommendations(
    session: PerformanceSession,
    config: BenchmarkConfig,
    score: number
  ): string[] {
    const recommendations: string[] = [];

    if (score < 60) {
      recommendations.push(`Wydajność poniżej oczekiwań dla ${config.quality} jakości`);
      recommendations.push('Rozważ obniżenie jakości lub rozdzielczości');
    }

    if (session.averageFPS < 30) {
      recommendations.push('Średni FPS poniżej 30 - doświadczenie może być niepłynne');
    }

    if (session.minFPS < 20) {
      recommendations.push('Minimalny FPS bardzo niski - mogą wystąpić znaczące spadki wydajności');
    }

    if (session.averageFrameTime > 33.33) {
      recommendations.push('Średni czas renderowania klatki przekracza 33ms (30 FPS)');
    }

    if (config.quality === 'low' && score < 70) {
      recommendations.push('Nawet najniższa jakość nie działa płynnie - sprzęt może nie spełniać minimalnych wymagań');
    }

    if (config.quality === 'ultra' && score >= 90) {
      recommendations.push('Ultra jakość działa płynnie - sprzęt obsługuje maksymalne ustawienia');
    }

    // Sprawdź użycie pamięci
    if (session.metrics.length > 0) {
      const lastMetric = session.metrics[session.metrics.length - 1];
      if (lastMetric.memoryUsage) {
        const usedMB = lastMetric.memoryUsage.usedJSHeapSize / 1048576;
        if (usedMB > 500) {
          recommendations.push(`Wysokie użycie pamięci (${usedMB.toFixed(0)} MB) - może wpływać na wydajność`);
        }
      }
    }

    return recommendations;
  }

  /**
   * Szacuje minimalne wymagania sprzętowe
   */
  private estimateMinRequirements(
    session: PerformanceSession,
    config: BenchmarkConfig
  ): BenchmarkResult['minRequirements'] {
    const requirements: BenchmarkResult['minRequirements'] = {};

    // Jeśli test na low quality nie przechodzi, wymagania są wyższe
    if (config.quality === 'low' && session.averageFPS < 30) {
      requirements.memory = 8; // Wymagane minimum 8GB RAM
      requirements.cores = 4; // Wymagane minimum 4 rdzenie
    }

    // Jeśli test na medium quality przechodzi, wymagania są niższe
    if (config.quality === 'medium' && session.averageFPS >= 30) {
      requirements.memory = 4; // Minimum 4GB RAM
      requirements.cores = 2; // Minimum 2 rdzenie
    }

    return requirements;
  }

  /**
   * Określa minimalne wymagania na podstawie wszystkich testów
   */
  private determineMinRequirements(results: BenchmarkResult[]): BenchmarkSuite['minRequirements'] {
    const requirements: BenchmarkSuite['minRequirements'] = {};

    // Znajdź najniższą jakość która działa płynnie
    const workingConfigs = results.filter(r => r.passed && r.score >= 70);
    
    if (workingConfigs.length === 0) {
      // Żaden test nie przeszedł - wymagania są wysokie
      requirements.memory = 8;
      requirements.cores = 4;
      return requirements;
    }

    // Znajdź najniższą jakość która działa
    const lowestWorking = workingConfigs.reduce((lowest, current) => {
      const qualityOrder = { low: 1, medium: 2, high: 3, ultra: 4 };
      return qualityOrder[current.config.quality] < qualityOrder[lowest.config.quality] 
        ? current 
        : lowest;
    });

    // Ustaw wymagania na podstawie najniższej działającej jakości
    switch (lowestWorking.config.quality) {
      case 'low':
        requirements.memory = 4;
        requirements.cores = 2;
        break;
      case 'medium':
        requirements.memory = 6;
        requirements.cores = 4;
        break;
      case 'high':
        requirements.memory = 8;
        requirements.cores = 4;
        break;
      case 'ultra':
        requirements.memory = 16;
        requirements.cores = 6;
        break;
    }

    return requirements;
  }

  /**
   * Pobiera minimalny FPS dla danej jakości
   */
  private getMinFPSForQuality(quality: BenchmarkConfig['quality']): number {
    switch (quality) {
      case 'low': return 25;
      case 'medium': return 30;
      case 'high': return 45;
      case 'ultra': return 55;
      default: return 30;
    }
  }

  /**
   * Pobiera docelowy FPS dla danej jakości
   */
  private getTargetFPSForQuality(quality: BenchmarkConfig['quality']): number {
    switch (quality) {
      case 'low': return 30;
      case 'medium': return 45;
      case 'high': return 55;
      case 'ultra': return 60;
      default: return 60;
    }
  }

  /**
   * Pomocnicza funkcja do czekania
   */
  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Pobiera aktualną serię testów
   */
  getCurrentSuite(): BenchmarkSuite | null {
    return this.suite;
  }

  /**
   * Eksportuje wyniki do JSON
   */
  exportToJSON(suite: BenchmarkSuite): string {
    return JSON.stringify(suite, null, 2);
  }

  /**
   * Eksportuje wyniki do CSV
   */
  exportToCSV(suite: BenchmarkSuite): string {
    const lines: string[] = [];
    
    // Header
    lines.push('Config Name,Quality,Resolution,FPS Avg,FPS Min,FPS Max,Frame Time Avg,Score,Passed,Memory Used (MB)');
    
    // Data rows
    suite.results.forEach(result => {
      const config = result.config;
      const session = result.session;
      const memory = session.metrics.length > 0 && session.metrics[session.metrics.length - 1].memoryUsage
        ? (session.metrics[session.metrics.length - 1].memoryUsage!.usedJSHeapSize / 1048576).toFixed(2)
        : 'N/A';
      
      lines.push([
        config.name,
        config.quality,
        `${config.resolution.width}x${config.resolution.height}`,
        session.averageFPS,
        session.minFPS,
        session.maxFPS,
        session.averageFrameTime.toFixed(2),
        result.score,
        result.passed ? 'Yes' : 'No',
        memory,
      ].join(','));
    });
    
    return lines.join('\n');
  }
}

// Singleton instance
let benchmarkInstance: PerformanceBenchmark | null = null;

export const getPerformanceBenchmark = (): PerformanceBenchmark => {
  if (!benchmarkInstance) {
    benchmarkInstance = new PerformanceBenchmark();
  }
  return benchmarkInstance;
};

export default PerformanceBenchmark;

