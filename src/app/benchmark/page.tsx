"use client";

import { useState, useEffect } from "react";
import { getPerformanceBenchmark, BenchmarkSuite, BenchmarkResult } from "@/utils/performanceBenchmark";
import PerformanceBenchmark from "@/utils/performanceBenchmark";
import { getPerformanceMonitor } from "@/utils/performanceMonitor";

export default function BenchmarkPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [suite, setSuite] = useState<BenchmarkSuite | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Opóźnij inicjalizację do momentu gdy jest dostępne środowisko przeglądarki
  const [benchmark, setBenchmark] = useState<ReturnType<typeof getPerformanceBenchmark> | null>(null);
  const [monitor, setMonitor] = useState<ReturnType<typeof getPerformanceMonitor> | null>(null);

  // Wczytaj ostatni benchmark z localStorage przy starcie i zainicjalizuj benchmarki
  useEffect(() => {
    // Inicjalizuj tylko po stronie klienta
    if (typeof window !== 'undefined') {
      setBenchmark(getPerformanceBenchmark());
      setMonitor(getPerformanceMonitor());
    }
    try {
      const saved = localStorage.getItem('lastBenchmarkSuite');
      const savedDate = localStorage.getItem('lastBenchmarkDate');
      if (saved && savedDate) {
        const parsed = JSON.parse(saved);
        // Sprawdź czy nie jest starszy niż 24h
        const age = Date.now() - parseInt(savedDate);
        if (age < 24 * 60 * 60 * 1000) {
          setSuite(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not load from localStorage:', e);
    }
  }, []);

  const handleStartBenchmark = async () => {
    if (!benchmark || !monitor) {
      setError('Benchmark system nie jest jeszcze gotowy. Poczekaj chwilę...');
      return;
    }

    setIsRunning(true);
    setError(null);
    setSuite(null);
    setProgress(0);
    setCurrentTest(null);

    try {
      // Uruchom testy sekwencyjnie z aktualizacją postępu
      const configs = PerformanceBenchmark.PRESETS || [];
      const results: BenchmarkResult[] = [];
      
      for (let i = 0; i < configs.length; i++) {
        const config = configs[i];
        setCurrentTest(config.name);
        setProgress(((i + 1) / configs.length) * 100);

        const result = await benchmark.runBenchmark(config);
        results.push(result);

        // Krótka przerwa między testami
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Utwórz pełną serię
      const hardwareInfo = monitor.getHardwareInfo();
      if (!hardwareInfo) throw new Error('Hardware info not available');

      const fullSuite: BenchmarkSuite = {
        suiteId: `benchmark_${Date.now()}`,
        hardwareInfo,
        results,
        startTime: Date.now(),
        endTime: Date.now(),
        overallScore: benchmark.calculateOverallScore(results),
        minRequirements: benchmark.determineMinRequirementsPublic(results),
      };

      setSuite(fullSuite);
      
      // Zapisz do localStorage jako backup (działa również na Vercel)
      try {
        localStorage.setItem('lastBenchmarkSuite', JSON.stringify(fullSuite));
        localStorage.setItem('lastBenchmarkDate', Date.now().toString());
      } catch (e) {
        console.warn('Could not save to localStorage:', e);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Błąd podczas uruchamiania benchmarków';
      setError(errorMessage);
      console.error('Benchmark error:', err);
    } finally {
      setIsRunning(false);
      setCurrentTest(null);
      setProgress(100);
    }
  };

  const handleExportJSON = () => {
    if (!suite || !benchmark) return;
    const json = benchmark.exportToJSON(suite);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `benchmark_${suite.suiteId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (!suite || !benchmark) return;
    const csv = benchmark.exportToCSV(suite);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `benchmark_${suite.suiteId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getPassedColor = (passed: boolean): string => {
    return passed ? "text-green-400" : "text-red-400";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Benchmark Wydajności Systemu 3D</h1>

        {/* Informacje o sprzęcie */}
        {monitor && monitor.getHardwareInfo() && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">Informacje o sprzęcie</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-400 mb-1">GPU</div>
                <div>{monitor?.getHardwareInfo()?.gpu || "Unknown"}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Platform</div>
                <div>{monitor?.getHardwareInfo()?.platform || "Unknown"}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Resolution</div>
                <div>{monitor?.getHardwareInfo()?.screenResolution || "Unknown"}</div>
              </div>
              {monitor?.getHardwareInfo()?.cores && (
                <div>
                  <div className="text-gray-400 mb-1">CPU Cores</div>
                  <div>{monitor.getHardwareInfo()?.cores}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Kontrolki */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Uruchom testy benchmarkowe</h2>
            <button
              onClick={handleStartBenchmark}
              disabled={isRunning}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              {isRunning ? "Uruchamianie..." : "Start Benchmark"}
            </button>
          </div>

          {isRunning && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>{currentTest || "Przygotowywanie..."}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-900 bg-opacity-50 border border-red-700 rounded-lg text-red-200">
              <strong>Błąd:</strong> {error}
            </div>
          )}
        </div>

        {/* Wyniki */}
        {suite && (
          <div className="space-y-6">
            {/* Podsumowanie */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Podsumowanie wyników</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleExportJSON}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Export JSON
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Ogólny wynik</div>
                  <div className={`text-3xl font-bold ${getScoreColor(suite.overallScore)}`}>
                    {suite.overallScore}/100
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Liczba testów</div>
                  <div className="text-3xl font-bold">{suite.results.length}</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Czas trwania</div>
                  <div className="text-3xl font-bold">
                    {suite.endTime ? Math.round((suite.endTime - suite.startTime) / 1000) : 0}s
                  </div>
                </div>
              </div>

              {/* Minimalne wymagania */}
              {(suite.minRequirements.memory || suite.minRequirements.cores) && (
                <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Szacowane minimalne wymagania:</h3>
                  <div className="text-sm space-y-1">
                    {suite.minRequirements.memory && (
                      <div>Pamięć RAM: {suite.minRequirements.memory} GB</div>
                    )}
                    {suite.minRequirements.cores && (
                      <div>CPU Cores: {suite.minRequirements.cores}</div>
                    )}
                    {suite.minRequirements.gpu && (
                      <div>GPU: {suite.minRequirements.gpu}</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Szczegółowe wyniki */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">Szczegółowe wyniki testów</h2>
              <div className="space-y-4">
                {suite.results.map((result, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 rounded-lg p-6 border border-gray-600"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{result.config.name}</h3>
                        <p className="text-sm text-gray-400">{result.config.description}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                          {result.score}/100
                        </div>
                        <div className={`text-sm ${getPassedColor(result.passed)}`}>
                          {result.passed ? "✓ Passed" : "✗ Failed"}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <div className="text-gray-400 mb-1">Średni FPS</div>
                        <div className="text-lg font-semibold">{result.session.averageFPS}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1">Min/Max FPS</div>
                        <div className="text-lg font-semibold">
                          {result.session.minFPS} / {result.session.maxFPS}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1">Frame Time</div>
                        <div className="text-lg font-semibold">
                          {result.session.averageFrameTime.toFixed(2)} ms
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1">Rozdzielczość</div>
                        <div className="text-lg font-semibold">
                          {result.config.resolution.width}x{result.config.resolution.height}
                        </div>
                      </div>
                    </div>

                    {result.recommendations.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-600">
                        <div className="text-sm text-gray-400 mb-2">Rekomendacje:</div>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {result.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Instrukcje */}
        <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold mb-2">Jak używać benchmarków:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
            <li>Upewnij się, że jesteś na stronie z wizualizacją 3D (scena kinowa)</li>
            <li>Kliknij &quot;Start Benchmark&quot; aby uruchomić automatyczne testy</li>
            <li>Testy będą uruchamiane sekwencyjnie dla różnych konfiguracji jakości</li>
            <li>Każdy test trwa 30 sekund - nie zamykaj okna przeglądarki</li>
            <li>Po zakończeniu zobaczysz szczegółowe wyniki i rekomendacje</li>
            <li>Eksportuj wyniki do JSON lub CSV dla analizy w pracy inżynierskiej</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

