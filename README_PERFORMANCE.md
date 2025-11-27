# System Monitorowania Wydajności Aplikacji 3D

## Opis

System monitorowania wydajności pozwala na pomiar i analizę wydajności aplikacji 3D na różnych urządzeniach i konfiguracjach sprzętowych. System zbiera metryki w czasie rzeczywistym i zapisuje je do analizy.

## Funkcjonalności

### 1. Monitorowanie w czasie rzeczywistym
- **FPS (Frames Per Second)** - liczba klatek na sekundę
- **Frame Time** - czas renderowania pojedynczej klatki w milisekundach
- **Użycie pamięci** - zużycie pamięci JavaScript heap (jeśli dostępne)
- **Informacje o sprzęcie** - GPU, CPU, przeglądarka, rozdzielczość ekranu

### 2. Rejestrowanie sesji
- Rozpoczęcie i zatrzymanie nagrywania sesji wydajności
- Automatyczne zbieranie metryk co sekundę
- Obliczanie statystyk: średni FPS, min/max FPS, średni czas renderowania

### 3. Analiza wyników
- Strona ze statystykami wszystkich sesji
- Grupowanie wyników według sprzętu (GPU)
- Porównywanie wydajności na różnych urządzeniach
- Szczegółowe informacje o każdej sesji

## Jak używać

### Podstawowe użycie

1. **Uruchom aplikację** i przejdź do sceny 3D (wybierz film i miejsce)

2. **Otwórz monitor wydajności**:
   - Naciśnij klawisz **P** w scenie 3D
   - Lub użyj komponentu `PerformanceOverlay` który pojawi się automatycznie

3. **Rozpocznij pomiar**:
   - Kliknij przycisk **"Start Recording"**
   - System zacznie zbierać metryki wydajności

4. **Używaj aplikacji normalnie**:
   - Poruszaj kamerą
   - Oglądaj wideo
   - Interakcja z interfejsem
   - System będzie zbierał metryki w tle

5. **Zatrzymaj pomiar**:
   - Kliknij przycisk **"Stop Recording"**
   - Zobaczysz podsumowanie sesji

6. **Zapisz wyniki**:
   - Kliknij przycisk **"Save Report"**
   - Sesja zostanie zapisana do bazy danych (lub pamięci w trybie dev)

7. **Zobacz statystyki**:
   - Przejdź do `/performance` lub kliknij "Performance" w menu
   - Zobaczysz wszystkie zapisane sesje i statystyki

### Zaawansowane użycie

#### Programatyczne użycie

```typescript
import { getPerformanceMonitor } from "@/utils/performanceMonitor";

const monitor = getPerformanceMonitor();

// Rozpocznij monitorowanie
monitor.startMonitoring();

// Pobierz aktualne metryki
const metrics = monitor.getCurrentMetrics();

// Pobierz informacje o sprzęcie
const hardware = monitor.getHardwareInfo();

// Zatrzymaj monitorowanie
monitor.stopMonitoring();

// Wygeneruj raport sesji
const report = monitor.generateSessionReport();
```

#### Integracja z komponentami

```tsx
import PerformanceMonitor from "@/app/components/PerformanceMonitor";
import PerformanceOverlay from "@/app/components/PerformanceOverlay";

// W komponencie Canvas (Three.js)
<Canvas>
  {/* ... inne komponenty ... */}
  <PerformanceMonitor visible={true} position="top-right" />
</Canvas>

// Poza Canvas (overlay)
<PerformanceOverlay visible={true} onSave={(session) => {
  console.log("Session saved:", session);
}} />
```

## Metryki zbierane

### Podstawowe metryki
- **FPS**: Liczba klatek na sekundę (obliczane co sekundę)
- **Frame Time**: Średni czas renderowania klatki w milisekundach
- **Timestamp**: Czas pomiaru

### Metryki pamięci (jeśli dostępne)
- **usedJSHeapSize**: Używana pamięć JavaScript heap
- **totalJSHeapSize**: Całkowita pamięć JavaScript heap
- **jsHeapSizeLimit**: Limit pamięci JavaScript heap

### Informacje o sprzęcie
- **GPU**: Model karty graficznej
- **GPU Vendor**: Producent karty graficznej
- **Renderer**: Renderer WebGL
- **Platform**: System operacyjny
- **User Agent**: Informacje o przeglądarce
- **Screen Resolution**: Rozdzielczość ekranu
- **Device Pixel Ratio**: Współczynnik pikseli urządzenia
- **CPU Cores**: Liczba rdzeni procesora (jeśli dostępne)
- **Memory**: Pamięć RAM (jeśli dostępne)

## API Endpoints

### POST `/api/performance`
Zapisuje sesję wydajności.

**Request Body:**
```json
{
  "sessionId": "session_1234567890_abc123",
  "hardwareInfo": { ... },
  "metrics": [ ... ],
  "averageFPS": 60,
  "minFPS": 45,
  "maxFPS": 60,
  "averageFrameTime": 16.67
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "session_1234567890_abc123",
  "message": "Performance session saved successfully"
}
```

### GET `/api/performance`
Pobiera listę wszystkich sesji lub konkretną sesję.

**Query Parameters:**
- `sessionId` (opcjonalny): ID konkretnej sesji
- `limit` (opcjonalny): Maksymalna liczba sesji do zwrócenia (domyślnie 50)

**Response:**
```json
{
  "sessions": [
    {
      "sessionId": "...",
      "hardwareInfo": { ... },
      "averageFPS": 60,
      "minFPS": 45,
      "maxFPS": 60,
      ...
    }
  ],
  "total": 10
}
```

## Struktura plików

```
src/
├── utils/
│   └── performanceMonitor.ts      # Główna logika monitorowania
├── app/
│   ├── components/
│   │   ├── PerformanceMonitor.tsx # Komponent wewnątrz Canvas (3D)
│   │   └── PerformanceOverlay.tsx # Overlay z kontrolkami
│   ├── api/
│   │   └── performance/
│   │       └── route.ts           # API endpoint
│   └── performance/
│       └── page.tsx               # Strona ze statystykami
```

## Interpretacja wyników

### FPS (Frames Per Second)
- **60+ FPS**: Doskonała wydajność (zielony)
- **30-59 FPS**: Dobra wydajność (żółty)
- **<30 FPS**: Słaba wydajność (czerwony)

### Frame Time
- **<16.67 ms**: Idealne dla 60 FPS
- **16.67-33.33 ms**: Akceptowalne dla 30-60 FPS
- **>33.33 ms**: Może powodować problemy z płynnością

### Pamięć
- Monitoruj wzrost użycia pamięci w czasie
- Nagłe skoki mogą wskazywać na wycieki pamięci
- Porównuj użycie pamięci na różnych urządzeniach

## Wskazówki dotyczące testowania

1. **Testuj na różnych urządzeniach**:
   - Komputery stacjonarne (różne GPU)
   - Laptopy (integrated vs dedicated GPU)
   - Różne przeglądarki (Chrome, Firefox, Edge)

2. **Testuj różne scenariusze**:
   - Statyczna scena (bez ruchu kamery)
   - Dynamiczna scena (ruch kamery, animacje)
   - Z włączonym/wyłączonym wideo
   - Z różnymi ustawieniami jakości

3. **Zapisuj kontekst**:
   - Notuj konfigurację sprzętu
   - Zapisuj ustawienia aplikacji
   - Dokumentuj warunki testowe

4. **Analizuj trendy**:
   - Porównuj wydajność przed i po optymalizacjach
   - Szukaj wzorców w danych
   - Identyfikuj wąskie gardła

## Rozszerzenia

### Integracja z bazą danych

Aktualnie sesje są przechowywane w pamięci. Aby zapisywać do bazy danych:

1. Stwórz model Mongoose:
```typescript
// src/models/PerformanceSession.ts
import mongoose from 'mongoose';

const PerformanceSessionSchema = new mongoose.Schema({
  sessionId: String,
  hardwareInfo: Object,
  metrics: Array,
  startTime: Number,
  endTime: Number,
  averageFPS: Number,
  minFPS: Number,
  maxFPS: Number,
  averageFrameTime: Number,
}, { timestamps: true });

export default mongoose.models.PerformanceSession || 
  mongoose.model('PerformanceSession', PerformanceSessionSchema);
```

2. Zaktualizuj `/api/performance/route.ts`:
```typescript
import PerformanceSession from '@/models/PerformanceSession';

// W POST:
await PerformanceSession.create(session);

// W GET:
const sessions = await PerformanceSession.find().limit(limit);
```

### Eksport danych

Możesz dodać funkcję eksportu do CSV/JSON:

```typescript
const exportToCSV = (sessions: PerformanceSession[]) => {
  // Implementacja eksportu
};
```

## Troubleshooting

### Monitor nie pokazuje metryk
- Sprawdź czy Canvas jest w pełni załadowany
- Upewnij się, że `PerformanceMonitor` jest wewnątrz `<Canvas>`
- Sprawdź konsolę przeglądarki pod kątem błędów

### Brak informacji o GPU
- Niektóre przeglądarki nie udostępniają informacji o GPU
- Spróbuj w innej przeglądarce (Chrome zwykle ma najlepsze wsparcie)

### Brak metryk pamięci
- Metryki pamięci są dostępne tylko w Chrome
- W innych przeglądarkach te metryki będą puste

### Sesje nie są zapisywane
- Sprawdź czy endpoint `/api/performance` działa
- Sprawdź konsolę przeglądarki pod kątem błędów sieciowych
- W trybie dev sesje są przechowywane w pamięci (znikną po restarcie)

## Przyszłe rozszerzenia

- [ ] Wykresy wydajności w czasie rzeczywistym
- [ ] Eksport danych do CSV/JSON
- [ ] Integracja z bazą danych MongoDB
- [ ] Porównywanie sesji side-by-side
- [ ] Alerty o niskiej wydajności
- [ ] Automatyczne testy wydajności
- [ ] Benchmark mode z automatycznymi scenariuszami

