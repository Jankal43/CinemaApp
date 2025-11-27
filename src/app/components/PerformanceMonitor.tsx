"use client";

import { useEffect, useState } from "react";
import { getPerformanceMonitor, PerformanceMetrics } from "@/utils/performanceMonitor";

interface PerformanceMonitorProps {
  visible?: boolean;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  metrics?: PerformanceMetrics | null;
}

const PerformanceMonitor = ({ 
  visible = true, 
  position = "top-right",
  metrics
}: PerformanceMonitorProps) => {

  if (!visible || !metrics) return null;

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  const getFPSColor = (fps: number): string => {
    if (fps >= 55) return "text-green-400";
    if (fps >= 30) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div
      className={`absolute ${positionClasses[position]} bg-black bg-opacity-80 text-white p-3 rounded-lg font-mono text-xs z-50 min-w-[200px]`}
    >
      <div className="font-bold mb-2 text-sm border-b border-gray-600 pb-1">
        Performance Monitor
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-400">FPS:</span>
          <span className={getFPSColor(metrics.fps)}>{metrics.fps}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Frame Time:</span>
          <span>{metrics.frameTime.toFixed(2)} ms</span>
        </div>

        {metrics.memoryUsage && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-400">Memory:</span>
              <span>{(metrics.memoryUsage.usedJSHeapSize / 1048576).toFixed(2)} MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total:</span>
              <span>{(metrics.memoryUsage.totalJSHeapSize / 1048576).toFixed(2)} MB</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PerformanceMonitor;

