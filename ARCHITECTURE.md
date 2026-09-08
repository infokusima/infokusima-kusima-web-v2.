# KUSIMA Web V2 – architektúra

V2 vzniká ako nový samostatný web. Pôvodný repozitár `infokusima/kusima-web` zostáva referenčná a funkčná záloha.

## Zásady

1. **HTML drží stabilnú štruktúru stránok.** Hlavné sekcie sa nevytvárajú až po načítaní JavaScriptom.
2. **CSS nemení JavaScript.** Žiadne dynamické pripájanie stylesheetov, `<style>` blokov ani opravné override vrstvy.
3. **Jedna zodpovednosť = jedno miesto.**
   - `theme.css` – farby, tiene, rádiusy, vizuálne tokeny
   - `site-core.css` – rozloženie, komponenty, stránky, responzivita
   - `content.js` – editovateľné texty a dátový obsah
   - `app.js` – navigácia a stav rozhrania
   - `dynamic.js` – čas, meniny, počasie, RSS, hero slideshow
   - `articles.js` – články a ich zobrazenie
   - `forms.js` – formuláre/PDF a kancelárske funkcie
4. **Dynamické skripty menia obsah existujúcich prvkov, nie geometriu ani dizajn.**
5. **Žiadne post-load opravovanie textov.** Schválený text musí byť priamo v HTML alebo `content.js`.
6. **Žiadne reťazenie wrapperov jednej funkcie.** Každá akcia má jedného vlastníka.
7. **Cache-busting pri deployi** sa rieši verziou podľa commitu, nie ručne písanými dátumami.

## Cieľ prvej migrácie

- vizuálne zachovať schválený súčasný web,
- zachovať schválené texty, fakturačné údaje, ceny a funkcie,
- odstrániť preblikávanie starých stavov,
- následné úpravy robiť bez „patch na patch“ systému.

## Vetvy

- `main` – neskôr publikovaná schválená V2
- `build-v2` – pracovná vetva počas stavby a porovnávania
