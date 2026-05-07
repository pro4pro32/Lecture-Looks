# LectureLooks

Aplikacja Next.js do przegladania i zapisywania inspiracji outfitowych.

## Wymagania

- Node.js 20+
- konto Supabase
- konto Vercel

## Uruchomienie lokalne

1. Zainstaluj zaleznosci:

```bash
npm install
```

2. Skopiuj plik srodowiskowy i uzupelnij wartosci:

```bash
cp .env.example .env.local
```

3. Uruchom projekt:

```bash
npm run dev
```

## Zmienne srodowiskowe

Wszystkie potrzebne klucze znajdziesz w `.env.example`.

- `NEXT_PUBLIC_SUPABASE_URL` - URL projektu Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - publiczny anon key Supabase
- `OPENAI_API_KEY` - klucz do endpointu auto-tagowania
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - publiczny klucz Stripe
- `NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID` - ID ceny planu premium w Stripe
- `NEXT_PUBLIC_APP_URL` - publiczny URL aplikacji (np. `https://twoja-appka.vercel.app`)
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID` - ID strony w Umami
- `NEXT_PUBLIC_UMAMI_SCRIPT_URL` - adres skryptu Umami (domyslnie `https://cloud.umami.is/script.js`)

## Analytics (Umami)

Tracking jest prosty i opcjonalny. Dziala globalnie z `app/layout.tsx`.

1. Utworz strone w Umami.
2. Skopiuj `website-id`.
3. Ustaw na Vercel:
   - `NEXT_PUBLIC_UMAMI_WEBSITE_ID`
   - `NEXT_PUBLIC_UMAMI_SCRIPT_URL` (zostaw domyslne `https://cloud.umami.is/script.js` dla Umami Cloud)
4. Zrob redeploy.

Jesli zmienne Umami nie sa ustawione, skrypt analytics nie jest ladowany.

## Deploy na Vercel + Supabase

1. **Supabase**
   - Utworz projekt Supabase.
   - Skopiuj `Project URL` oraz `anon public key`.
   - W razie potrzeby uruchom SQL migracje z folderu `supabase`.

2. **Vercel**
   - Importuj repozytorium do Vercel.
   - Framework: Next.js (konfiguracja jest w `vercel.json`).
   - Dodaj Environment Variables zgodnie z `.env.example`.
   - Ustaw co najmniej:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `NEXT_PUBLIC_APP_URL` (adres docelowy Vercel)

3. **Build i runtime**
   - Build command: `npm run build`
   - Install command: `npm install`
   - Output: domyslne ustawienia Next.js

4. **Po wdrozeniu**
   - Sprawdz logowanie i odczyt/zapis danych z Supabase.
   - Sprawdz czy eventy pageview wpadaja do Umami.

## Przydatne komendy

```bash
npm run dev
npm run lint
npm run build
npm run start
```
