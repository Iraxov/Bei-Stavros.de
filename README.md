# Bei Stavros: Beispielwebsite

Statische Seite ohne Build-Schritt und ohne externe Abhängigkeiten. Beispielentwurf, keine offizielle Seite des Restaurants.

## Dateien
- `index.html`: Startseite (Start, Feiern, Öffnungszeiten, Bewertung, Anfahrt)
- `speisekarte.html`, `galerie.html`, `impressum.html`, `datenschutz.html`: eigene Seiten
- `style.css`: Design, Farben oben in `:root`
- `script.js`: Menü, Öffnungszeiten, Feier-Anfrage, Karte nach Klick, Galerie, Speisekarte (jedes Modul läuft nur auf der Seite, auf der es gebraucht wird)
- `netlify.toml`: Netlify-Einstellungen, Sicherheits-Header, Indexsperre
- `apple-touch-icon.png`, `og-image.png`: Symbole (og-image erst beim Livegang einbinden)
- `checkliste-inhaber.md`: offene Angaben für das Gespräch mit dem Inhaber

## Veröffentlichen
- GitHub Pages: Repository anlegen, Dateien hochladen, unter Settings > Pages den Branch `main` und den Ordner `/ (root)` wählen.
- Netlify: Ordner per Drag and Drop hochladen oder das Repository verbinden. Kein Build-Befehl nötig.

## Fotos einbauen
Fotos als WebP (1200 x 900, max. 200 KB) in den Ordner `bilder/` legen. In `galerie.html` ein `<figure class="ph">` ersetzen durch:

```html
<figure class="gf"><a class="gl" href="bilder/x.webp" data-lb="0"><img src="bilder/x.webp" alt="Kurzer Text zum Bild" width="1200" height="900" loading="lazy"></a><figcaption>Titel</figcaption></figure>
```

`data-lb` ab 0 durchnummerieren. Die Bildansicht ist schon eingebaut.

## Vor dem Livegang
Siehe Abschnitt D in `checkliste-inhaber.md`.
