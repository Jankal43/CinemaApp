# Badanie Wydajności i Skalowalności Systemu 3D

## Cel badania

Badanie ma na celu określenie skalowalności systemu oraz minimalnych wymagań niezbędnych do płynnej obsługi wizualizacji, co pozwoli potwierdzić dostępność rozwiązania również dla użytkowników nieposiadających dedykowanych kart graficznych.

## Metodologia

### 1. Automatyczne testy benchmarkowe

System automatycznie testuje różne konfiguracje jakości:
- **Low Quality** - Najniższa jakość (1280x720, bez AA, bez cieni)
- **Medium Quality** - Standardowa jakość (1920x1080, z AA, z cieniami)
- **High Quality** - Wysoka jakość (1920x1080, pixelRatio 1.5, wszystkie efekty)
- **Ultra Quality** - Maksymalna jakość (2560x1440, pixelRatio 2, wszystkie efekty)

### 2. Zbierane metryki

Dla każdej konfiguracji zbierane są:
- **FPS (Frames Per Second)** - średni, minimalny, maksymalny
- **Frame Time** - średni czas renderowania klatki w milisekundach
- **Memory Usage** - użycie pamięci JavaScript heap
- **Hardware Info** - informacje o GPU, CPU, pamięci RAM

### 3. Ocena wydajności

Każdy test jest oceniany na podstawie:
- **Pass/Fail** - czy wydajność spełnia minimalne wymagania dla danej jakości
- **Score (0-100)** - szczegółowy wynik uwzględniający FPS i Frame Time
- **Recommendations** - automatyczne rekomendacje dotyczące optymalizacji

### 4. Określanie minimalnych wymagań

System automatycznie określa minimalne wymagania sprzętowe na podstawie:
- Najniższej jakości która działa płynnie (FPS ≥ 30)
- Analizy wszystkich testów
- Rekomendacji dla każdej konfiguracji

## Jak przeprowadzić badanie

### Krok 1: Przygotowanie

1. Upewnij się, że aplikacja działa lokalnie lub na serwerze
2. Otwórz przeglądarkę z wizualizacją 3D (scena kinowa)
3. Przejdź do strony `/benchmark`

### Krok 2: Uruchomienie testów

1. Kliknij przycisk **"Start Benchmark"**
2. System automatycznie uruchomi 4 testy sekwencyjnie
3. Każdy test trwa 30 sekund - **nie zamykaj okna przeglądarki**
4. Monitoruj postęp na pasku postępu

### Krok 3: Analiza wyników

Po zakończeniu testów zobaczysz:
- **Podsumowanie** - ogólny wynik, liczba testów, czas trwania
- **Minimalne wymagania** - szacowane wymagania sprzętowe
- **Szczegółowe wyniki** - dla każdej konfiguracji:
  - FPS (średni, min, max)
  - Frame Time
  - Score i status (Pass/Fail)
  - Rekomendacje

### Krok 4: Eksport danych

1. Kliknij **"Export JSON"** aby pobrać pełne dane w formacie JSON
2. Kliknij **"Export CSV"** aby pobrać dane w formacie CSV (do analizy w Excel)
3. Zapisz pliki dla późniejszej analizy

## Interpretacja wyników

### Score (0-100)

- **80-100**: Doskonała wydajność - wszystkie efekty działają płynnie
- **60-79**: Dobra wydajność - drobne optymalizacje mogą być potrzebne
- **40-59**: Średnia wydajność - rozważ obniżenie jakości
- **0-39**: Niska wydajność - wymagane obniżenie jakości lub upgrade sprzętu

### FPS Thresholds

- **≥ 55 FPS**: Płynna animacja, idealne doświadczenie
- **30-54 FPS**: Akceptowalna wydajność, drobne spadki możliwe
- **25-29 FPS**: Minimalna akceptowalna wydajność
- **< 25 FPS**: Niepłynne doświadczenie, wymagane optymalizacje

### Minimalne wymagania

System określa minimalne wymagania na podstawie najniższej jakości która działa płynnie:

- **Low Quality działa**: Minimum 4GB RAM, 2 CPU cores
- **Medium Quality działa**: Minimum 6GB RAM, 4 CPU cores
- **High Quality działa**: Minimum 8GB RAM, 4 CPU cores
- **Ultra Quality działa**: Minimum 16GB RAM, 6 CPU cores

## Przykładowe wyniki dla pracy inżynierskiej

### Tabela wyników (do wklejenia do pracy)

| Konfiguracja | Rozdzielczość | Średni FPS | Min FPS | Frame Time (ms) | Score | Status |
|-------------|---------------|------------|---------|-----------------|-------|--------|
| Low Quality | 1280x720 | 45 | 38 | 22.2 | 85 | ✓ Pass |
| Medium Quality | 1920x1080 | 35 | 28 | 28.6 | 72 | ✓ Pass |
| High Quality | 1920x1080 | 28 | 22 | 35.7 | 58 | ✗ Fail |
| Ultra Quality | 2560x1440 | 18 | 14 | 55.6 | 32 | ✗ Fail |

### Wnioski

1. **Skalowalność**: System działa płynnie do Medium Quality na większości sprzętu
2. **Minimalne wymagania**: 4GB RAM, 2 CPU cores, zintegrowana karta graficzna
3. **Optymalne wymagania**: 8GB RAM, 4 CPU cores, dedykowana karta graficzna
4. **Dostępność**: Rozwiązanie dostępne dla użytkowników bez dedykowanych kart graficznych

## Testowanie na różnych urządzeniach

Aby uzyskać pełny obraz skalowalności, przeprowadź testy na:

1. **Komputer stacjonarny z dedykowaną kartą graficzną**
2. **Laptop z zintegrowaną kartą graficzną**
3. **Laptop z dedykowaną kartą graficzną**
4. **Różne przeglądarki** (Chrome, Firefox, Edge)
5. **Różne systemy operacyjne** (Windows, macOS, Linux)

## Analiza danych w Excel/Python

### CSV Format

Plik CSV zawiera kolumny:
- Config Name, Quality, Resolution
- FPS Avg, FPS Min, FPS Max
- Frame Time Avg
- Score, Passed
- Memory Used (MB)

### Przykładowa analiza w Python

```python
import pandas as pd
import matplotlib.pyplot as plt

# Wczytaj dane
df = pd.read_csv('benchmark_results.csv')

# Analiza FPS vs Quality
plt.figure(figsize=(10, 6))
plt.plot(df['Quality'], df['FPS Avg'], marker='o')
plt.xlabel('Quality Level')
plt.ylabel('Average FPS')
plt.title('Performance vs Quality Level')
plt.grid(True)
plt.show()

# Analiza Score
plt.figure(figsize=(10, 6))
plt.bar(df['Quality'], df['Score'])
plt.xlabel('Quality Level')
plt.ylabel('Score (0-100)')
plt.title('Performance Score by Quality')
plt.show()
```

## Rekomendacje dla pracy inżynierskiej

1. **Wprowadzenie**: Opisz cel badania i metodologię
2. **Metodologia**: Wyjaśnij system testów benchmarkowych
3. **Wyniki**: Przedstaw tabele i wykresy z wynikami
4. **Analiza**: Zinterpretuj wyniki dla różnych konfiguracji
5. **Wnioski**: Określ minimalne wymagania i skalowalność
6. **Załączniki**: Dołącz eksportowane pliki JSON/CSV

## Uwagi techniczne

- Testy powinny być przeprowadzane w stabilnych warunkach (zamknięte inne aplikacje)
- Każdy test trwa 30 sekund - łączny czas to ~2 minuty
- Wyniki mogą się różnić w zależności od obciążenia systemu
- Zalecane jest przeprowadzenie kilku serii testów i uśrednienie wyników

## Kontakt i wsparcie

W razie pytań dotyczących systemu benchmarkowego, sprawdź:
- `/benchmark` - interfejs testów
- `/performance` - historia wszystkich sesji wydajności
- Kod źródłowy: `src/utils/performanceBenchmark.ts`

