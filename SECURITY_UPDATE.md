# Aktualizacja bezpieczeństwa - CVE-2025-66478

## Problem
Wykryto krytyczną podatność w Next.js (CVE-2025-66478) i React (CVE-2025-55182) która może prowadzić do zdalnego wykonania kodu (RCE).

## Zaktualizowane pakiety

### Next.js
- **Przed**: 15.1.7 (podatny)
- **Po**: 15.1.9 (bezpieczny)

### React
- **Przed**: 19.0.0 (podatny)
- **Po**: 19.2.1 (bezpieczny)

### React DOM
- **Przed**: 19.0.0 (podatny)
- **Po**: 19.2.1 (bezpieczny)

### ESLint Config Next
- **Przed**: 15.1.2
- **Po**: 15.1.9

## Bezpieczne wersje (zgodnie z CVE)

### React
- 19.0.1
- 19.1.2
- 19.2.1 ✅ (używamy tej)

### Next.js
- 15.0.5
- 15.1.9 ✅ (używamy tej)
- 15.2.6
- 15.3.6
- 15.4.8
- 15.5.7
- 15.6.0-canary.58
- 16.0.7

## Instalacja

```bash
npm install --legacy-peer-deps
```

## Weryfikacja

Po instalacji sprawdź wersje:
```bash
npm list next react react-dom
```

Powinny być:
- next: 15.1.9 lub nowsza
- react: 19.2.1 lub nowsza
- react-dom: 19.2.1 lub nowsza

## Testowanie

Po aktualizacji przetestuj aplikację:
```bash
npm run build
npm run dev
```

## Więcej informacji

- [Next.js GHSA](https://github.com/advisories/GHSA-9qr9-h5gf-34mp)
- [React GHSA](https://github.com/advisories/GHSA-xxx)
- [Vercel Security Advisory](https://vercel.com/security)

## Data aktualizacji
2025-12-07

