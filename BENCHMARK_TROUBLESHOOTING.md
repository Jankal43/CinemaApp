# Rozwiązywanie problemów z benchmarkami

## Błąd: "Failed to generate session report"

### Przyczyny:

1. **Canvas nie jest dostępny**
   - Benchmarki wymagają aktywnej sceny 3D z Canvas
   - Canvas musi być w pełni załadowany i renderować się

2. **Brak metryk**
   - Monitorowanie nie zebrało żadnych metryk
   - Może się zdarzyć jeśli Canvas nie jest aktywny

3. **Hardware info nie jest dostępne**
   - Informacje o sprzęcie nie zostały wykryte
   - Może się zdarzyć w niektórych przeglądarkach

### Rozwiązania:

#### Krok 1: Upewnij się że jesteś na stronie z wizualizacją 3D

1. Przejdź do strony głównej
2. Wybierz film z listy
3. Wybierz miejsce w sali kinowej
4. **Poczekaj aż scena 3D się w pełni załaduje** (powinieneś widzieć salę kinową)
5. Wróć do strony `/benchmark`
6. Kliknij "Start Benchmark"

#### Krok 2: Sprawdź konsolę przeglądarki

Otwórz DevTools (F12) i sprawdź:
- Czy są błędy w konsoli?
- Czy Canvas jest widoczny w Elements?
- Czy WebGL jest dostępny?

#### Krok 3: Sprawdź wsparcie WebGL

Otwórz: https://get.webgl.org/
- Jeśli widzisz animację - WebGL działa
- Jeśli widzisz komunikat o błędzie - WebGL nie jest dostępny

#### Krok 4: Spróbuj w innej przeglądarce

- Chrome/Edge - najlepsze wsparcie
- Firefox - dobre wsparcie
- Safari - może mieć ograniczenia

### Szczegółowe komunikaty błędów:

#### "Canvas not found"
**Rozwiązanie:** Przejdź do wizualizacji 3D i poczekaj aż scena się załaduje.

#### "No metrics collected"
**Rozwiązanie:** 
- Upewnij się że Canvas jest aktywny
- Sprawdź czy strona nie jest w tle (benchmarki wymagają aktywnej strony)
- Spróbuj odświeżyć stronę

#### "Hardware information not available"
**Rozwiązanie:**
- Odśwież stronę
- Sprawdź czy przeglądarka obsługuje WebGL
- Spróbuj w innej przeglądarce

### Debugowanie:

1. Otwórz konsolę przeglądarki (F12)
2. Uruchom benchmarki
3. Sprawdź komunikaty w konsoli:
   - `PerformanceMonitor: No metrics collected` - brak metryk
   - `PerformanceMonitor: Hardware info not available` - brak info o sprzęcie
   - `Failed to generate session report: {...}` - szczegóły błędu

### Najlepsze praktyki:

1. **Zawsze uruchamiaj benchmarki z aktywnej sceny 3D**
2. **Nie zamykaj okna przeglądarki podczas testów**
3. **Upewnij się że strona jest w pełni załadowana**
4. **Używaj Chrome lub Edge dla najlepszej kompatybilności**

### Jeśli problem nadal występuje:

1. Sprawdź logi w konsoli przeglądarki
2. Sprawdź czy inne funkcje 3D działają (ruch kamery, wideo)
3. Spróbuj w trybie incognito (wyklucza problemy z rozszerzeniami)
4. Sprawdź czy nie ma błędów w Network tab (DevTools)

