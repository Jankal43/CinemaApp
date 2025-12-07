# System Benchmarków Wydajności

## Szybki start

1. Przejdź do `/benchmark` w aplikacji
2. Kliknij **"Start Benchmark"**
3. Poczekaj ~2 minuty na zakończenie testów
4. Zobacz wyniki i eksportuj dane

## Co testuje system?

System automatycznie testuje 4 konfiguracje jakości:
- **Low** - Minimalne wymagania (720p, bez efektów)
- **Medium** - Standardowa jakość (1080p, podstawowe efekty)
- **High** - Wysoka jakość (1080p, wszystkie efekty)
- **Ultra** - Maksymalna jakość (1440p, wszystkie efekty)

## Metryki zbierane

- FPS (średni, min, max)
- Frame Time (czas renderowania klatki)
- Użycie pamięci
- Informacje o sprzęcie (GPU, CPU, RAM)

## Wyniki

Każdy test otrzymuje:
- **Score (0-100)** - ogólna ocena wydajności
- **Pass/Fail** - czy spełnia wymagania
- **Rekomendacje** - sugestie optymalizacji
- **Minimalne wymagania** - szacowane wymagania sprzętowe

## Eksport danych

Możesz eksportować wyniki do:
- **JSON** - pełne dane dla dalszej analizy
- **CSV** - dane tabelaryczne do Excel/Python

## Wykorzystanie w pracy inżynierskiej

System automatycznie generuje dane potrzebne do:
- Analizy skalowalności
- Określenia minimalnych wymagań
- Porównania wydajności na różnych konfiguracjach
- Wykresów i tabel w pracy

Zobacz `PERFORMANCE_RESEARCH.md` dla szczegółowej dokumentacji metodologii.

