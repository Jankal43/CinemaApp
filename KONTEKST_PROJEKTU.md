# KONTEKST PROJEKTU - CINEMA APP

## 1. OPIS PROJEKTU

**CinemaApp** to nowoczesna aplikacja webowa do zarządzania kinem, która łączy tradycyjne funkcje systemu rezerwacji miejsc z zaawansowaną wizualizacją 3D sali kinowej. Projekt wykorzystuje technologie React, Next.js oraz Three.js do stworzenia interaktywnego doświadczenia użytkownika.

### Główne cele projektu:
- Prezentacja filmów z zewnętrznego API (The Movie Database - TMDB)
- Interaktywna wizualizacja 3D sali kinowej
- System wyboru miejsc z podglądem w czasie rzeczywistym
- Odtwarzanie wideo w środowisku 3D z przestrzennym dźwiękiem
- Responsywny interfejs użytkownika

---

## 2. ARCHITEKTURA I STOS TECHNOLOGICZNY

### Frontend:
- **Next.js 15.1.7** - Framework React z App Router
- **React 19.0.0** - Biblioteka UI
- **TypeScript 5** - Typowanie statyczne
- **Tailwind CSS 3.4.1** - Stylowanie
- **Three.js 0.173.0** - Grafika 3D
- **@react-three/fiber** - React renderer dla Three.js
- **@react-three/drei** - Pomocnicze komponenty dla Three.js
- **React Icons** - Ikony

### Backend/API:
- **Next.js API Routes** - Endpointy API
- **The Movie Database API** - Zewnętrzne źródło danych filmowych

### Narzędzia deweloperskie:
- **Jest** - Testy jednostkowe
- **Playwright** - Testy end-to-end
- **ESLint** - Linting kodu
- **Turbopack** - Bundler (w trybie dev)

---

## 3. STRUKTURA PROJEKTU

```
CinemaApp/
├── src/
│   ├── app/                          # Główna aplikacja Next.js (App Router)
│   │   ├── page.tsx                  # Strona główna z karuzelą i sliderami filmów
│   │   ├── layout.tsx                # Główny layout z Header i Footer
│   │   ├── types.ts                  # Definicje typów TypeScript
│   │   ├── globals.css               # Globalne style CSS
│   │   │
│   │   ├── components/               # Komponenty 3D
│   │   │   ├── CinemaModel.tsx       # Model 3D sali kinowej (GLTF)
│   │   │   ├── VideoScreen.tsx       # Ekran wideo w scenie 3D
│   │   │   ├── AudioSystem.tsx       # System przestrzennego dźwięku
│   │   │   ├── CinemaLighting.tsx    # Oświetlenie sceny 3D
│   │   │   └── FPSControls.tsx       # Kontrola kamery FPS
│   │   │
│   │   ├── api/                      # API Routes
│   │   │   ├── moviesAPI/route.ts    # Endpoint do pobierania listy filmów
│   │   │   └── movieAPI/route.ts     # Endpoint do szczegółów filmu
│   │   │
│   │   ├── movies/[movieId]/         # Dynamiczna strona szczegółów filmu
│   │   │   └── page.tsx
│   │   │
│   │   ├── scene/                    # Strona z czystą sceną 3D
│   │   │   └── page.tsx
│   │   │
│   │   ├── header.tsx                # Komponent nagłówka
│   │   ├── footer.tsx                # Komponent stopki
│   │   ├── carousel.tsx              # Karuzela z filmami (trending)
│   │   ├── movieSlider.tsx           # Poziomy slider z filmami
│   │   ├── movieCard.tsx             # Karta szczegółów filmu
│   │   ├── movieLabel.tsx            # Etykieta filmu w sliderze
│   │   ├── arrowButton.tsx           # Przycisk strzałki nawigacyjnej
│   │   ├── seatMap.tsx               # Mapa miejsc w kinie
│   │   ├── cinemaLayout.tsx          # Layout z wyborem miejsc i podglądem 3D
│   │   └── ThreeScene.tsx            # Główny komponent sceny 3D
│   │
│   ├── __tests__/                    # Testy jednostkowe
│   │   ├── components/
│   │   └── utils/
│   │
│   └── utils/                        # Narzędzia pomocnicze
│
├── public/
│   ├── cinema/                       # Zasoby 3D
│   │   ├── scene.gltf                # Model 3D sali kinowej
│   │   ├── scene.bin                 # Dane binarne modelu
│   │   └── textures/                 # Tekstury modelu
│   ├── videos/                       # Pliki wideo do odtwarzania
│   └── logo.png                      # Logo aplikacji
│
├── e2e/                              # Testy end-to-end (Playwright)
├── package.json                      # Zależności i skrypty
├── tsconfig.json                     # Konfiguracja TypeScript
├── next.config.ts                    # Konfiguracja Next.js
├── tailwind.config.ts                # Konfiguracja Tailwind CSS
└── jest.config.js                    # Konfiguracja Jest
```

---

## 4. FUNKCJONALNOŚĆ APLIKACJI

### 4.1. Strona Główna (`page.tsx`)

**Funkcjonalność:**
- Pobiera filmy z trzech kategorii:
  - **Trending** - Popularne filmy dnia
  - **Airing** - Filmy aktualnie wyświetlane
  - **Upcoming** - Nadchodzące premiery
- Wyświetla karuzelę z 5 najpopularniejszymi filmami
- Renderuje poziome slidery dla kategorii "Airing" i "Upcoming"

**Implementacja:**
- Używa `useEffect` do pobierania danych przy montowaniu komponentu
- Wykorzystuje `Promise.all` do równoległego pobierania wszystkich kategorii
- Obsługuje stany ładowania i błędów

### 4.2. System Nawigacji

**Header (`header.tsx`):**
- Sticky navigation bar
- Logo aplikacji "CINEMA PLANET"
- Przyciski do sekcji: Home, Airing, Upcoming, Contact
- Smooth scroll do sekcji

**Footer (`footer.tsx`):**
- Informacje kontaktowe
- Linki do social media
- Szybkie linki nawigacyjne
- Informacje prawne

### 4.3. Wyświetlanie Filmów

**Carousel (`carousel.tsx`):**
- Karuzela z automatyczną nawigacją
- Wyświetla backdrop images filmów
- Przyciski strzałek do nawigacji
- Wskaźniki paginacji (kropki)
- Linki do szczegółów filmu

**MovieSlider (`movieSlider.tsx`):**
- Poziomy slider z filmami
- Przewijanie w lewo/prawo
- Wyświetla plakaty filmów
- Linki do szczegółów

**MovieLabel (`movieLabel.tsx`):**
- Karta filmu z plakatem
- Tytuł filmu
- Link do szczegółów

### 4.4. Strona Szczegółów Filmu (`movies/[movieId]/page.tsx`)

**Funkcjonalność:**
- Pobiera szczegóły filmu z API na podstawie ID
- Wyświetla kartę filmu z:
  - Plakatem
  - Tytułem
  - Gatunkami
  - Językami
- Renderuje `CinemaLayout` do wyboru miejsc

**MovieCard (`movieCard.tsx`):**
- Wyświetla szczegóły filmu
- Formatuje gatunki i języki jako tagi

### 4.5. System Rezerwacji Miejsc

**CinemaLayout (`cinemaLayout.tsx`):**
- Zarządza dwoma widokami:
  1. **Wybór miejsc** (`SeatMap`)
  2. **Podgląd 3D** (`ThreeScene`)
- Przełączanie między widokami
- Przekazuje pozycję wybranego miejsca do sceny 3D

**SeatMap (`seatMap.tsx`):**
- Wyświetla mapę miejsc w układzie rzędów (A-E)
- Statusy miejsc:
  - **Available** (czerwony) - dostępne
  - **Reserved** (niebieski) - zarezerwowane
- Kliknięcie na miejsce oblicza współrzędne 3D i aktualizuje pozycję kamery
- Funkcja `calculateCoordinates` mapuje miejsce na pozycję w przestrzeni 3D

**Dane miejsc:**
- Statyczna struktura danych `roomInfo`
- Zawiera: ID seansu, ID filmu, ID sali, datę/czas, listę miejsc

### 4.6. Wizualizacja 3D

**ThreeScene (`ThreeScene.tsx`):**
- Główny komponent sceny 3D
- Zarządza:
  - Canvas Three.js
  - Pozycją kamery (zależną od wybranego miejsca)
  - Trybem oglądania (pointer lock)
  - Kontrolą audio (włącz/wyłącz)
- Stany:
  - `isLoading` - ładowanie sceny
  - `showEnterPrompt` - prompt do wejścia w tryb oglądania
  - `isViewingMode` - aktywny tryb oglądania
  - `isAudioEnabled` - stan audio

**CinemaModel (`components/CinemaModel.tsx`):**
- Ładuje model 3D sali kinowej z pliku GLTF
- Używa `useGLTF` z `@react-three/drei`
- Wyświetla loading state podczas ładowania

**VideoScreen (`components/VideoScreen.tsx`):**
- Renderuje ekran wideo w scenie 3D
- Używa `useVideoTexture` do wyświetlania wideo na płaszczyźnie
- Pozycja ekranu: `[3.95, 2, 5]`
- Rozmiar: `[9.5, 4.8]`
- Odbicie tekstury (flip horizontal)
- Przekazuje referencję do elementu video dla AudioSystem
- Obsługuje włączanie/wyłączanie audio

**AudioSystem (`components/AudioSystem.tsx`):**
- Implementuje przestrzenny dźwięk 5.1 surround
- 5 źródeł dźwięku w pozycjach:
  - Left Front: `[9.4, 1.3, 0]`
  - Right Front: `[-1, 1.3, 0]`
  - Center: `[4.2, 0, 2.3]`
  - Left Rear: `[9.4, 4.1, 0]`
  - Right Rear: `[-1, 4.1, 0]`
- Używa `THREE.PositionalAudio` i `PannerNode`
- Konfiguruje parametry:
  - `refDistance`: 20
  - `maxDistance`: 50
  - `rolloffFactor`: 1
- Synchronizuje z elementem video

**CinemaLighting (`components/CinemaLighting.tsx`):**
- System oświetlenia sceny:
  - `ambientLight` - ciemne światło otoczenia (intensity: 0.15)
  - `spotLight` - światło projektora na ekran (intensity: 40)
  - `pointLight` - świecący ekran z animacją (intensity: 0.3-0.4, pulsuje)
- Animacja świecenia ekranu używając `useFrame`

**FPSControls (`components/FPSControls.tsx`):**
- Kontrola kamery w trybie FPS
- Używa `PointerLockControls` z `@react-three/drei`
- Blokuje kursor i umożliwia poruszanie się myszką
- Inicjalizuje kamerę patrząc na `[5, 1.3, 5]`
- Cleanup przy odmontowaniu

### 4.7. API Routes

**`/api/moviesAPI` (`api/moviesAPI/route.ts`):**
- Endpoint GET z parametrem `category`
- Obsługiwane kategorie:
  - `upcoming` - nadchodzące filmy
  - `trending` - popularne filmy
  - `airing` - aktualnie wyświetlane
- Pobiera dane z The Movie Database API
- Wymaga zmiennej środowiskowej `API_KEY`
- Zwraca listę filmów w formacie `MovieApiResponse[]`

**`/api/movieAPI` (`api/movieAPI/route.ts`):**
- Endpoint GET z parametrem `movieId`
- Pobiera szczegóły pojedynczego filmu
- Zwraca obiekt `MovieApiResponse` z pełnymi danymi

### 4.8. Typy Danych

**MovieApiResponse (`types.ts`):**
```typescript
interface MovieApiResponse {
    adult: boolean;
    backdrop_path: string;
    genres: { id: string; name: string; }[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    spoken_languages: { english_name: string; iso_639_1: string; name: string; }[];
    runtime: number;
}
```

---

## 5. PRZEPŁYW DANYCH

### 5.1. Pobieranie Filmów

```
Użytkownik → Strona główna
    ↓
useEffect → fetch("/api/moviesAPI?category=...")
    ↓
API Route → The Movie Database API
    ↓
Response → setMoviesByCategory
    ↓
Render → Carousel + MovieSliders
```

### 5.2. Wybór Miejsca i Podgląd 3D

```
Użytkownik → CinemaLayout
    ↓
Kliknięcie miejsca → SeatMap.calculateCoordinates()
    ↓
setPosition({x, y, z}) → CinemaLayout
    ↓
Przełączenie na widok 3D → ThreeScene
    ↓
ThreeScene → Canvas z camera position = {x, y, z}
    ↓
Render → Scena 3D z kamerą na wybranym miejscu
```

### 5.3. Odtwarzanie Wideo i Audio

```
ThreeScene → VideoScreen
    ↓
useVideoTexture → Ładuje wideo
    ↓
videoRef.current → AudioSystem
    ↓
AudioSystem → Tworzy 5 PositionalAudio sources
    ↓
MediaElementSource → PannerNode → PositionalAudio
    ↓
Render → Przestrzenny dźwięk 5.1
```

---

## 6. KONFIGURACJA

### 6.1. Next.js (`next.config.ts`)
- React Strict Mode włączony
- Konfiguracja obrazów: dozwolone domeny `image.tmdb.org`
- Turbopack w trybie dev

### 6.2. TypeScript (`tsconfig.json`)
- Target: ES2017
- Module: ESNext
- JSX: preserve
- Path aliases: `@/*` → `./src/*`
- Strict mode włączony

### 6.3. Tailwind CSS (`tailwind.config.ts`)
- Custom colors: background, foreground
- Font: Inter (z Next.js font optimization)
- Content paths: wszystkie pliki w `src/app` i `src/components`

### 6.4. Jest (`jest.config.js`)
- Test environment: node
- Coverage threshold: 70% dla wszystkich metryk
- Transform ignore: node_modules (z wyjątkiem @react-three/*)
- Module mapper: `@/*` → `./src/*`

---

## 7. ZASOBY 3D

### 7.1. Model Sali Kinowej
- Format: GLTF (scene.gltf + scene.bin)
- Lokalizacja: `/public/cinema/scene.gltf`
- Tekstury:
  - `floor_baseColor.png`, `floor_metallicRoughness.png`, `floor_normal.png`
  - `Red_cloth_baseColor.png`, `Red_cloth_metallicRoughness.png`, `Red_cloth_normal.png`

### 7.2. Wideo
- Lokalizacja: `/public/videos/`
- Pliki: `sample.mp4`, `sample2.mp4`
- Używane w VideoScreen: `sample2.mp4`

---

## 8. TESTY

### 8.1. Testy Jednostkowe (Jest)
- `src/__tests__/components/CinemaModel.test.tsx` - Test komponentu CinemaModel
- `src/__tests__/utils/cinema-api.test.ts` - Test funkcji API

### 8.2. Testy E2E (Playwright)
- `e2e/scene.e2e.spec.ts` - Test sceny 3D

### 8.3. Skrypty Testowe
- `npm test` - Uruchom testy jednostkowe
- `npm run test:watch` - Tryb watch
- `npm run test:coverage` - Raport pokrycia
- `npm run test:e2e` - Testy end-to-end

---

## 9. ZMIENNE ŚRODOWISKOWE

Wymagane zmienne:
- `API_KEY` - Klucz API The Movie Database

Plik `.env.local`:
```
API_KEY=your_tmdb_api_key_here
```

---

## 10. URUCHOMIENIE PROJEKTU

### Instalacja:
```bash
npm install
```

### Development:
```bash
npm run dev
```
Aplikacja dostępna na: `http://localhost:3000`

### Build:
```bash
npm run build
npm start
```

### Testy:
```bash
npm test              # Testy jednostkowe
npm run test:e2e      # Testy E2E
```

---

## 11. GŁÓWNE FUNKCJE I KOMPONENTY

### 11.1. Komponenty UI
- **Header** - Nawigacja główna
- **Footer** - Stopka z informacjami
- **Carousel** - Karuzela filmów
- **MovieSlider** - Poziomy slider
- **MovieCard** - Karta szczegółów filmu
- **MovieLabel** - Etykieta filmu
- **ArrowButton** - Przycisk nawigacyjny
- **SeatMap** - Mapa miejsc

### 11.2. Komponenty 3D
- **ThreeScene** - Główna scena 3D
- **CinemaModel** - Model sali
- **VideoScreen** - Ekran wideo
- **AudioSystem** - System dźwięku
- **CinemaLighting** - Oświetlenie
- **FPSControls** - Kontrola kamery

### 11.3. Layouty i Strony
- **page.tsx** - Strona główna
- **movies/[movieId]/page.tsx** - Szczegóły filmu
- **scene/page.tsx** - Czysta scena 3D
- **cinemaLayout.tsx** - Layout rezerwacji

---

## 12. OBSZARY DO ROZSZERZENIA

### 12.1. Funkcjonalności do dodania:
- Integracja z bazą danych (MongoDB - już w dependencies)
- System rezerwacji miejsc (zapis do bazy)
- System użytkowników i logowania
- Płatności online
- Powiadomienia email
- Historia rezerwacji
- System ocen i recenzji filmów

### 12.2. Ulepszenia techniczne:
- Optymalizacja wydajności 3D
- Lazy loading komponentów
- Cache'owanie danych API
- Error boundaries
- Loading states dla wszystkich operacji
- Responsywność na urządzeniach mobilnych

---

## 13. ARCHITEKTURA 3D

### 13.1. Układ Współrzędnych
- Oś X: lewo/prawo (ekran w centrum ~4.2)
- Oś Y: góra/dół (podłoga ~0, ekran ~2)
- Oś Z: przód/tył (ekran ~5, miejsca od 0 do -9.2)

### 13.2. Pozycje Kluczowych Elementów
- **Ekran wideo**: `[3.95, 2, 5]`
- **Miejsca**: Rzędy A-E, współrzędne obliczane dynamicznie
- **Kamera domyślna**: `[8.4, 4.1, -9.2]` (scena) lub `[3.6, 1.3, 0]` (domyślne miejsce)

### 13.3. System Dźwięku
- 5 źródeł dźwięku w układzie surround
- Positional audio z falloff distance
- Synchronizacja z elementem video HTML5

---

## 14. WZORCE PROJEKTOWE

### 14.1. Użyte wzorce:
- **Component-based architecture** - React komponenty
- **API Routes** - Next.js API endpoints
- **Custom Hooks** - React hooks (useEffect, useState, useRef)
- **Context API** - Potencjalnie do zarządzania stanem globalnym
- **Suspense** - Do ładowania asynchronicznego (VideoScreen)

### 14.2. Zarządzanie stanem:
- Lokalny stan komponentów (useState)
- Props drilling dla komunikacji między komponentami
- Ref dla referencji do DOM/Three.js obiektów

---

## 15. BEZPIECZEŃSTWO

### 15.1. Implementowane:
- API key przechowywany w zmiennych środowiskowych
- Next.js Image optimization dla zewnętrznych obrazów
- TypeScript dla type safety

### 15.2. Do rozważenia:
- Walidacja danych wejściowych
- Rate limiting dla API
- CORS configuration
- Sanityzacja danych użytkownika

---

## 16. WYDAJNOŚĆ

### 16.1. Optymalizacje:
- Next.js Image component z lazy loading
- Code splitting przez Next.js App Router
- Suspense dla asynchronicznych komponentów
- Canvas optimization (preserveDrawingBuffer, powerPreference)

### 16.2. Metryki:
- Coverage testów: 70% (threshold)
- DPR: [1, 2] dla Canvas (device pixel ratio)

---

## 17. DOKUMENTACJA KODU

### 17.1. Komentarze:
- Komentarze w języku polskim w niektórych komponentach
- Opisane funkcje pomocnicze
- Wyjaśnione parametry konfiguracyjne

### 17.2. TypeScript:
- Pełne typowanie wszystkich komponentów
- Interfejsy dla props
- Typy dla danych API

---

## 18. ROZWÓJ I UTRZYMANIE

### 18.1. Skrypty NPM:
- `dev` - Development server z Turbopack
- `build` - Production build
- `start` - Production server
- `lint` - ESLint
- `test` - Testy jednostkowe
- `test:e2e` - Testy end-to-end

### 18.2. Zależności:
- **Production**: React, Next.js, Three.js, React Three Fiber, Mongoose
- **Development**: Jest, Playwright, ESLint, TypeScript, Tailwind

---

## 19. WNIOSKI I OBSERWACJE

### 19.1. Mocne strony projektu:
- Nowoczesny stack technologiczny
- Integracja 3D z tradycyjnym UI
- Responsywny design
- Dobra struktura kodu
- TypeScript dla bezpieczeństwa typów

### 19.2. Wyzwania:
- Wydajność renderowania 3D
- Synchronizacja audio z wideo
- Zarządzanie stanem w złożonej aplikacji
- Optymalizacja ładowania zasobów 3D

### 19.3. Potencjał:
- Rozszerzenie o pełny system rezerwacji
- Integracja z systemami płatności
- Aplikacja mobilna
- VR/AR support
- Multiplayer experience

---

## 20. INSTRUKCJE DLA AI DO TWORZENIA PRACY INŻYNIERSKIEJ

### 20.1. Struktura pracy:
1. **Wstęp** - Opis problemu, cel pracy
2. **Przegląd literatury** - Technologie użyte w projekcie
3. **Analiza wymagań** - Funkcjonalne i niefunkcjonalne
4. **Projekt systemu** - Architektura, diagramy
5. **Implementacja** - Szczegóły techniczne, wybrane rozwiązania
6. **Testy** - Strategia testowania, wyniki
7. **Wnioski** - Podsumowanie, dalszy rozwój

### 20.2. Kluczowe tematy do omówienia:
- **Next.js App Router** - Nowoczesne podejście do routingu
- **React Three Fiber** - Integracja React z Three.js
- **Przestrzenny dźwięk** - Web Audio API, Positional Audio
- **3D Graphics** - GLTF, tekstury, oświetlenie
- **API Integration** - The Movie Database API
- **TypeScript** - Type safety w aplikacjach React
- **Responsive Design** - Tailwind CSS, mobile-first

### 20.3. Diagramy do stworzenia:
- Diagram architektury systemu
- Diagram przepływu danych
- Diagram komponentów React
- Diagram sceny 3D (układ współrzędnych)
- Diagram systemu audio (5.1 surround)
- Diagram API endpoints
- Diagram bazy danych (jeśli dodana)

### 20.4. Metryki i pomiary:
- Wydajność renderowania 3D (FPS)
- Czas ładowania komponentów
- Rozmiar bundle'a
- Pokrycie testami
- Metryki API (czas odpowiedzi)

---

## 21. DODATKOWE INFORMACJE

### 21.1. Licencje:
- Model 3D: Sprawdź `public/cinema/license.txt`

### 21.2. Zasoby zewnętrzne:
- The Movie Database API: https://www.themoviedb.org/
- Obrazy filmów: `https://image.tmdb.org/t/p/original/`

### 21.3. Przeglądarki:
- Chrome/Edge (zalecane dla WebGL)
- Firefox
- Safari (może wymagać dodatkowej konfiguracji)

---

**Data utworzenia dokumentu:** 2025-01-XX
**Wersja projektu:** 0.1.0
**Status:** W rozwoju

---

*Ten dokument zawiera pełny kontekst projektu CinemaApp i może być wykorzystany do stworzenia szczegółowej pracy inżynierskiej opisującej architekturę, implementację i funkcjonalność aplikacji.*

