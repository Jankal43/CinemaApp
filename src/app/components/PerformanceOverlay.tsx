"use client";

import { useEffect, useState } from "react";
import { getPerformanceMonitor, PerformanceMetrics, HardwareInfo } from "@/utils/performanceMonitor";

interface PerformanceOverlayProps {
  visible?: boolean;
  onSave?: (session: any) => void;
}

const PerformanceOverlay = ({ visible = true, onSave }: PerformanceOverlayProps) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [hardwareInfo, setHardwareInfo] = useState<HardwareInfo | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionStats, setSessionStats] = useState<any>(null);
  const monitor = getPerformanceMonitor();

  useEffect(() => {
    setHardwareInfo(monitor.getHardwareInfo());

    const interval = setInterval(() => {
      const currentMetrics = monitor.getCurrentMetrics();
      setMetrics(currentMetrics);
      
      if (isRecording) {
        const report = monitor.generateSessionReport();
        if (report) {
          setSessionStats({
            averageFPS: report.averageFPS,
            minFPS: report.minFPS,
            maxFPS: report.maxFPS,
            averageFrameTime: report.averageFrameTime.toFixed(2),
            duration: report.endTime && report.startTime 
              ? ((report.endTime - report.startTime) / 1000).toFixed(1) + "s"
              : "N/A",
            samples: report.metrics.length,
          });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [monitor, isRecording]);

  const handleStartRecording = () => {
    monitor.reset();
    monitor.startMonitoring();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    monitor.stopMonitoring();
    setIsRecording(false);
    const report = monitor.generateSessionReport();
    if (report && onSave) {
      onSave(report);
    }
  };

  const handleSaveReport = async () => {
    const report = monitor.generateSessionReport();
    if (!report) return;

    try {
      const response = await fetch("/api/performance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(report),
      });

      if (response.ok) {
        alert("Raport wydajności został zapisany!");
      } else {
        alert("Błąd podczas zapisywania raportu");
      }
    } catch (error) {
      console.error("Error saving report:", error);
      alert("Błąd podczas zapisywania raportu");
    }
  };

  if (!visible) return null;

  const getFPSColor = (fps: number): string => {
    if (fps >= 55) return "text-green-400";
    if (fps >= 30) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="absolute top-4 left-4 bg-black bg-opacity-90 text-white p-4 rounded-lg font-mono text-xs z-50 min-w-[280px] max-w-[400px]">
      <div className="font-bold mb-3 text-sm border-b border-gray-600 pb-2">
        Performance Monitor
      </div>

      {/* Hardware Info */}
      {hardwareInfo && (
        <div className="mb-4 space-y-1 text-xs">
          <div className="text-gray-400 font-semibold mb-1">Hardware:</div>
          <div className="pl-2 space-y-0.5">
            <div className="truncate">
              <span className="text-gray-500">GPU:</span> {hardwareInfo.gpu}
            </div>
            <div>
              <span className="text-gray-500">Platform:</span> {hardwareInfo.platform}
            </div>
            <div>
              <span className="text-gray-500">Resolution:</span> {hardwareInfo.screenResolution}
            </div>
            {hardwareInfo.cores && (
              <div>
                <span className="text-gray-500">Cores:</span> {hardwareInfo.cores}
              </div>
            )}
            {hardwareInfo.memory && (
              <div>
                <span className="text-gray-500">Memory:</span> {hardwareInfo.memory} GB
              </div>
            )}
          </div>
        </div>
      )}

      {/* Current Metrics */}
      {metrics && (
        <div className="mb-4 space-y-1">
          <div className="text-gray-400 font-semibold mb-1">Current:</div>
          <div className="pl-2 space-y-0.5">
            <div className="flex justify-between">
              <span className="text-gray-500">FPS:</span>
              <span className={getFPSColor(metrics.fps)}>{metrics.fps}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Frame Time:</span>
              <span>{metrics.frameTime.toFixed(2)} ms</span>
            </div>
            {metrics.memoryUsage && (
              <div className="flex justify-between">
                <span className="text-gray-500">Memory:</span>
                <span>{(metrics.memoryUsage.usedJSHeapSize / 1048576).toFixed(2)} MB</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Session Stats */}
      {sessionStats && isRecording && (
        <div className="mb-4 space-y-1">
          <div className="text-gray-400 font-semibold mb-1">Session:</div>
          <div className="pl-2 space-y-0.5">
            <div className="flex justify-between">
              <span className="text-gray-500">Avg FPS:</span>
              <span className={getFPSColor(sessionStats.averageFPS)}>
                {sessionStats.averageFPS}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Min/Max:</span>
              <span>{sessionStats.minFPS} / {sessionStats.maxFPS}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Duration:</span>
              <span>{sessionStats.duration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Samples:</span>
              <span>{sessionStats.samples}</span>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2 mt-4">
        {!isRecording ? (
          <button
            onClick={handleStartRecording}
            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-xs font-semibold transition-colors"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={handleStopRecording}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded text-xs font-semibold transition-colors"
          >
            Stop Recording
          </button>
        )}
        {sessionStats && !isRecording && (
          <button
            onClick={handleSaveReport}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-xs font-semibold transition-colors"
          >
            Save Report
          </button>
        )}
      </div>
    </div>
  );
};

export default PerformanceOverlay;

