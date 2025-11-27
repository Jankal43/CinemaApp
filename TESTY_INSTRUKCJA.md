# Instrukcja Uruchamiania Testów

Projekt zawiera dwa typy testów:
1. **Testy jednostkowe (Jest)** - testują pojedyncze komponenty i funkcje
2. **Testy end-to-end (Playwright)** - testują aplikację w przeglądarce

## Testy Jednostkowe (Jest)

### Podstawowe uruchomienie

```bash
npm test
```

Uruchamia wszystkie testy jednostkowe raz.

### Tryb watch (automatyczne uruchamianie przy zmianach)

```bash
npm run test:watch
```

Testy będą automatycznie uruchamiane za każdym razem, gdy zmienisz plik.

### Testy z raportem pokrycia

```bash
npm run test:coverage
```

Generuje raport pokrycia kodu testami. Wyniki będą w folderze `coverage/`.

### Testy dla CI/CD

```bash
npm run test:ci
```

Uruchamia testy w trybie CI z raportem pokrycia i ograniczoną liczbą workerów.

## Testy End-to-End (Playwright)

**Uwaga:** Testy Playwright są obecnie zakomentowane. Aby je uruchomić, musisz najpierw je odkomentować.

### Krok 1: Odkomentuj konfigurację Playwright

Otwórz plik `playwright.config.ts` i odkomentuj całą konfigurację (usuń `//` z początku linii).

### Krok 2: Odkomentuj testy

Otwórz plik `e2e/scene.e2e.spec.ts` i odkomentuj testy.

### Krok 3: Zainstaluj przeglądarki Playwright (pierwszy raz)

```bash
npx playwright install
```

To pobierze przeglądarki potrzebne do testów (Chromium, Firefox, WebKit).

### Krok 4: Uruchom testy E2E

```bash
npm run test:e2e
```

Uruchamia wszystkie testy end-to-end w trybie headless (bez widocznej przeglądarki).

### Testy E2E z interfejsem graficznym

```bash
npm run test:e2e:ui
```

Otwiera interfejs graficzny Playwright, gdzie możesz:
- Zobaczyć testy w czasie rzeczywistym
- Debugować testy
- Uruchamiać pojedyncze testy

### Testy E2E z widoczną przeglądarką

```bash
npm run test:e2e:headed
```

Uruchamia testy z widoczną przeglądarką (przydatne do debugowania).

### Debugowanie testów E2E

```bash
npm run test:e2e:debug
```

Uruchamia testy w trybie debugowania z Playwright Inspector.

## Struktura Testów

### Testy jednostkowe

```
src/__tests__/
├── components/
│   └── CinemaModel.test.tsx    # Test komponentu CinemaModel
└── utils/
    └── cinema-api.test.ts       # Test funkcji API
```

### Testy E2E

```
e2e/
└── scene.e2e.spec.ts           # Testy sceny 3D
```

## Przykładowe uruchomienie

### 1. Uruchom testy jednostkowe

```bash
npm test
```

Oczekiwany wynik:
```
 PASS  src/__tests__/components/CinemaModel.test.tsx
 PASS  src/__tests__/utils/cinema-api.test.ts

Test Suites: 2 passed, 2 total
Tests:       4 passed, 4 total
```

### 2. Uruchom testy z pokryciem

```bash
npm run test:coverage
```

Otwórz `coverage/lcov-report/index.html` w przeglądarce, aby zobaczyć szczegółowy raport.

### 3. Uruchom testy E2E (po odkomentowaniu)

```bash
# Najpierw upewnij się, że aplikacja działa
npm run dev

# W innym terminalu uruchom testy
npm run test:e2e
```

## Rozwiązywanie problemów

### Problem: Testy Jest nie znajdują modułów

**Rozwiązanie:** Upewnij się, że wszystkie zależności są zainstalowane:
```bash
npm install
```

### Problem: Playwright nie może znaleźć przeglądarek

**Rozwiązanie:** Zainstaluj przeglądarki:
```bash
npx playwright install
```

### Problem: Testy E2E nie mogą połączyć się z serwerem

**Rozwiązanie:** Upewnij się, że aplikacja działa na `http://localhost:3000`:
```bash
npm run dev
```

### Problem: Błędy związane z Three.js w testach

**Rozwiązanie:** Testy używają mocków dla Three.js. Sprawdź `jest.setup.js` czy wszystkie potrzebne mocki są zdefiniowane.

## Dodawanie nowych testów

### Test jednostkowy

1. Utwórz plik `*.test.tsx` lub `*.test.ts` w folderze `src/__tests__/`
2. Użyj składni Jest:

```typescript
import { render } from '@testing-library/react';
import MyComponent from '@/app/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    const { container } = render(<MyComponent />);
    expect(container).toBeDefined();
  });
});
```

### Test E2E

1. Utwórz plik `*.e2e.spec.ts` w folderze `e2e/`
2. Użyj składni Playwright:

```typescript
import { test, expect } from '@playwright/test';

test('should load page', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Cinema/);
});
```

## Przydatne linki

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)


