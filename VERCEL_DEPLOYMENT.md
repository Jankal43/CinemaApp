# Wdrożenie na Vercel - Informacje o Benchmarkach

## ✅ Czy benchmarki działają na Vercel?

**TAK!** Wszystko działa w pełni na Vercel, ponieważ:

1. **Działają po stronie klienta** - benchmarki używają WebGL i Performance API przeglądarki
2. **Nie wymagają serwera** - testy są wykonywane w przeglądarce użytkownika
3. **Eksport działa lokalnie** - JSON/CSV są pobierane bezpośrednio do komputera

## ⚠️ Ważne informacje

### Sesje w API (`/api/performance`)

- **Obecnie**: Sesje są przechowywane w pamięci serwera
- **Na Vercel**: Sesje znikną po restarcie serwera (serverless functions)
- **Rozwiązanie**: 
  - ✅ Eksportuj wyniki do JSON/CSV (działa zawsze)
  - ✅ Benchmarki są zapisywane w localStorage przeglądarki
  - ✅ Możesz dodać MongoDB dla trwałego przechowywania (opcjonalnie)

### Zapisywanie wyników

1. **Automatyczny backup w localStorage**:
   - Ostatni benchmark jest automatycznie zapisywany
   - Wczytuje się przy następnym wejściu na stronę
   - Działa tylko w tej samej przeglądarce

2. **Eksport do plików**:
   - Kliknij "Export JSON" lub "Export CSV"
   - Pliki są pobierane do komputera
   - Możesz je zapisać i użyć w pracy inżynierskiej

## 🚀 Jak wdrożyć na Vercel

1. **Zaloguj się do Vercel**:
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Wdróż projekt**:
   ```bash
   vercel
   ```

3. **Lub użyj GitHub integration**:
   - Połącz repozytorium z Vercel
   - Automatyczne wdrożenia przy każdym push

4. **Sprawdź działanie**:
   - Otwórz `https://twoja-aplikacja.vercel.app/benchmark`
   - Kliknij "Start Benchmark"
   - Testy powinny działać identycznie jak lokalnie

## 📊 Użycie w pracy inżynierskiej

### Zalecany workflow:

1. **Przeprowadź testy na Vercel**:
   - Różne urządzenia
   - Różne przeglądarki
   - Różne konfiguracje sprzętu

2. **Eksportuj wyniki**:
   - Dla każdego testu kliknij "Export JSON" lub "Export CSV"
   - Zapisz pliki z nazwą zawierającą informacje o sprzęcie
   - Przykład: `benchmark_laptop_integrated_gpu.json`

3. **Analizuj dane**:
   - Wczytaj pliki JSON/CSV do Excel lub Python
   - Stwórz wykresy i tabele
   - Porównaj wyniki z różnych urządzeń

4. **Dokumentuj w pracy**:
   - Wklej tabele wyników
   - Dodaj wykresy wydajności
   - Opisz wnioski i minimalne wymagania

## 🔧 Opcjonalne: Trwałe przechowywanie w MongoDB

Jeśli chcesz zapisywać sesje w bazie danych (dla wielu użytkowników):

1. **Dodaj zmienną środowiskową na Vercel**:
   - `MONGODB_URI` - connection string do MongoDB

2. **Zaktualizuj `/api/performance/route.ts`**:
   ```typescript
   import connectDB from '@/utils/db';
   import PerformanceSession from '@/models/PerformanceSession';
   
   // W POST:
   await connectDB();
   await PerformanceSession.create(session);
   
   // W GET:
   await connectDB();
   const sessions = await PerformanceSession.find().limit(limit);
   ```

3. **Stwórz model** (jeśli jeszcze nie istnieje):
   ```typescript
   // src/models/PerformanceSession.ts
   import mongoose from 'mongoose';
   
   const PerformanceSessionSchema = new mongoose.Schema({
     sessionId: String,
     hardwareInfo: Object,
     metrics: Array,
     // ... reszta pól
   }, { timestamps: true });
   
   export default mongoose.models.PerformanceSession || 
     mongoose.model('PerformanceSession', PerformanceSessionSchema);
   ```

## ✅ Checklist przed wdrożeniem

- [ ] Projekt działa lokalnie (`npm run dev`)
- [ ] Benchmarki działają na `/benchmark`
- [ ] Eksport JSON/CSV działa
- [ ] Sprawdź czy nie ma błędów w konsoli
- [ ] Przetestuj na różnych przeglądarkach

## 🎯 Podsumowanie

**Benchmarki działają w pełni na Vercel!** 

- ✅ Testy wykonują się w przeglądarce
- ✅ Eksport działa lokalnie
- ✅ Backup w localStorage
- ⚠️ Sesje w API są tymczasowe (ale to nie problem - eksportuj wyniki)

**Dla pracy inżynierskiej**: Eksportuj wyniki do plików i analizuj je lokalnie. To najlepsze rozwiązanie!

