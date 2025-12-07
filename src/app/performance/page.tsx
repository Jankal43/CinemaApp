"use client";

import { useEffect, useState } from "react";

interface PerformanceSession {
  sessionId: string;
  hardwareInfo: {
    gpu?: string;
    gpuVendor?: string;
    renderer?: string;
    platform: string;
    userAgent: string;
    screenResolution: string;
    devicePixelRatio: number;
    cores?: number;
    memory?: number;
  };
  startTime: number;
  endTime?: number;
  averageFPS: number;
  minFPS: number;
  maxFPS: number;
  averageFrameTime: number;
  metricsCount: number;
}

export default function PerformancePage() {
  const [sessions, setSessions] = useState<PerformanceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<PerformanceSession | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/performance");
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("pl-PL");
  };

  const formatDuration = (start: number, end?: number) => {
    if (!end) return "N/A";
    const seconds = Math.floor((end - start) / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  const getFPSColor = (fps: number): string => {
    if (fps >= 55) return "text-green-600";
    if (fps >= 30) return "text-yellow-600";
    return "text-red-600";
  };

  // Grupuj sesje według GPU
  const groupedByGPU = sessions.reduce((acc, session) => {
    const gpu = session.hardwareInfo.gpu || "Unknown";
    if (!acc[gpu]) {
      acc[gpu] = [];
    }
    acc[gpu].push(session);
    return acc;
  }, {} as Record<string, PerformanceSession[]>);

  // Oblicz statystyki dla każdego GPU
  const gpuStats = Object.entries(groupedByGPU).map(([gpu, gpuSessions]) => {
    const avgFPS = gpuSessions.reduce((sum, s) => sum + s.averageFPS, 0) / gpuSessions.length;
    const minFPS = Math.min(...gpuSessions.map(s => s.minFPS));
    const maxFPS = Math.max(...gpuSessions.map(s => s.maxFPS));
    const avgFrameTime = gpuSessions.reduce((sum, s) => sum + s.averageFrameTime, 0) / gpuSessions.length;

    return {
      gpu,
      count: gpuSessions.length,
      averageFPS: Math.round(avgFPS),
      minFPS,
      maxFPS,
      averageFrameTime: avgFrameTime.toFixed(2),
    };
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Ładowanie danych wydajności...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Statystyki Wydajności Aplikacji 3D</h1>

        {/* Statystyki według GPU */}
        {gpuStats.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Wydajność według sprzętu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gpuStats.map((stat) => (
                <div
                  key={stat.gpu}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                >
                  <h3 className="text-lg font-semibold mb-3 truncate" title={stat.gpu}>
                    {stat.gpu}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Liczba testów:</span>
                      <span>{stat.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Średni FPS:</span>
                      <span className={getFPSColor(stat.averageFPS)}>{stat.averageFPS}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Min/Max FPS:</span>
                      <span>
                        {stat.minFPS} / {stat.maxFPS}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Średni Frame Time:</span>
                      <span>{stat.averageFrameTime} ms</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista wszystkich sesji */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Wszystkie sesje ({sessions.length})</h2>
          {sessions.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-400">
              Brak zapisanych sesji wydajności. Uruchom aplikację i użyj monitora wydajności (naciśnij P w scenie 3D).
            </div>
          ) : (
            <div className="space-y-4">
              {sessions
                .sort((a, b) => b.startTime - a.startTime)
                .map((session) => (
                  <div
                    key={session.sessionId}
                    className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                    onClick={() => setSelectedSession(selectedSession?.sessionId === session.sessionId ? null : session)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">GPU</div>
                        <div className="text-sm truncate" title={session.hardwareInfo.gpu}>
                          {session.hardwareInfo.gpu || "Unknown"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Średni FPS</div>
                        <div className={`text-lg font-semibold ${getFPSColor(session.averageFPS)}`}>
                          {session.averageFPS}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Czas trwania</div>
                        <div className="text-sm">
                          {formatDuration(session.startTime, session.endTime)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Data</div>
                        <div className="text-sm">{formatDate(session.startTime)}</div>
                      </div>
                    </div>

                    {selectedSession?.sessionId === session.sessionId && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-gray-400 mb-1">Min FPS</div>
                            <div className={getFPSColor(session.minFPS)}>{session.minFPS}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1">Max FPS</div>
                            <div className={getFPSColor(session.maxFPS)}>{session.maxFPS}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1">Avg Frame Time</div>
                            <div>{session.averageFrameTime.toFixed(2)} ms</div>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1">Próbki</div>
                            <div>{session.metricsCount}</div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <div className="text-sm text-gray-400 mb-2">Szczegóły sprzętu:</div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Platform:</span> {session.hardwareInfo.platform}
                            </div>
                            <div>
                              <span className="text-gray-500">Resolution:</span> {session.hardwareInfo.screenResolution}
                            </div>
                            {session.hardwareInfo.cores && (
                              <div>
                                <span className="text-gray-500">CPU Cores:</span> {session.hardwareInfo.cores}
                              </div>
                            )}
                            {session.hardwareInfo.memory && (
                              <div>
                                <span className="text-gray-500">Memory:</span> {session.hardwareInfo.memory} GB
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Instrukcje */}
        <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Jak mierzyć wydajność:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
            <li>Przejdź do sceny 3D (wybierz film i miejsce)</li>
            <li>Naciśnij klawisz <kbd className="px-2 py-1 bg-gray-700 rounded">P</kbd> aby pokazać monitor wydajności</li>
            <li>Kliknij &quot;Start Recording&quot; aby rozpocząć pomiar</li>
            <li>Użyj aplikacji normalnie (poruszaj kamerą, oglądaj wideo)</li>
            <li>Kliknij &quot;Stop Recording&quot; aby zakończyć pomiar</li>
            <li>Kliknij &quot;Save Report&quot; aby zapisać wyniki</li>
            <li>Odśwież tę stronę aby zobaczyć zapisane statystyki</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

