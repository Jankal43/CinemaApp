"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { getPerformanceMonitor, PerformanceMetrics } from "@/utils/performanceMonitor";

interface PerformanceStatsProps {
  enabled: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics | null) => void;
}

/**
 * Komponent zbierający metryki wydajności wewnątrz Canvas (Three.js)
 * Nie renderuje niczego, tylko zbiera dane
 */
const PerformanceStats = ({ enabled, onMetricsUpdate }: PerformanceStatsProps) => {
  const { gl } = useThree();
  const monitor = getPerformanceMonitor();

  useEffect(() => {
    if (!enabled) {
      monitor.stopMonitoring();
      return;
    }

    // Ustaw kontekst WebGL jeśli dostępny
    try {
      const context = gl.getContext();
      if (context) {
        monitor.setGLContext(context);
      }
    } catch {
      // Ignoruj błąd - kontekst może być już ustawiony
    }

    // Rozpocznij monitorowanie
    monitor.startMonitoring();

    // Aktualizuj metryki co sekundę
    const interval = setInterval(() => {
      const currentMetrics = monitor.getCurrentMetrics();
      if (onMetricsUpdate) {
        onMetricsUpdate(currentMetrics);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      if (enabled) {
        monitor.stopMonitoring();
      }
    };
  }, [enabled, gl, monitor, onMetricsUpdate]);

  // Nie renderuj niczego - to jest tylko komponent zbierający dane
  return null;
};

export default PerformanceStats;

