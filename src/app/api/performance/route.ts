import { NextRequest, NextResponse } from "next/server";

export interface PerformanceSession {
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
  metrics: Array<{
    fps: number;
    frameTime: number;
    memoryUsage?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
    timestamp: number;
  }>;
  startTime: number;
  endTime?: number;
  averageFPS: number;
  minFPS: number;
  maxFPS: number;
  averageFrameTime: number;
}

// W produkcji użyj bazy danych - tutaj używamy prostego przechowywania w pamięci
// Dla prawdziwej aplikacji użyj MongoDB (które już masz w dependencies)
const performanceSessions: PerformanceSession[] = [];

export async function POST(request: NextRequest) {
  try {
    const session: PerformanceSession = await request.json();

    // Walidacja danych
    if (!session.sessionId || !session.hardwareInfo || !session.metrics) {
      return NextResponse.json(
        { error: "Invalid session data" },
        { status: 400 }
      );
    }

    // Zapisz sesję
    performanceSessions.push(session);

    // W produkcji zapisz do bazy danych:
    // await PerformanceSession.create(session);

    return NextResponse.json(
      { 
        success: true, 
        sessionId: session.sessionId,
        message: "Performance session saved successfully" 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving performance session:", error);
    return NextResponse.json(
      { error: "Failed to save performance session" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (sessionId) {
      // Zwróć konkretną sesję
      const session = performanceSessions.find(s => s.sessionId === sessionId);
      if (!session) {
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(session, { status: 200 });
    }

    // Zwróć wszystkie sesje (z ograniczeniem)
    const limit = parseInt(searchParams.get("limit") || "50");
    const sessions = performanceSessions
      .slice(-limit)
      .map(s => ({
        sessionId: s.sessionId,
        hardwareInfo: s.hardwareInfo,
        startTime: s.startTime,
        endTime: s.endTime,
        averageFPS: s.averageFPS,
        minFPS: s.minFPS,
        maxFPS: s.maxFPS,
        averageFrameTime: s.averageFrameTime,
        metricsCount: s.metrics.length,
      }));

    return NextResponse.json(
      { 
        sessions,
        total: performanceSessions.length 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching performance sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch performance sessions" },
      { status: 500 }
    );
  }
}

