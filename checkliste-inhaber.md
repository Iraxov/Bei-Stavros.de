# Bei Stavros: Checkliste für das Gespräch mit dem Inhaber

Alles Technische ist umgesetzt. Offen sind nur Angaben, die nur der Inhaber kennt. Hake sie im Gespräch ab und trage sie danach in impressum.html und datenschutz.html ein.

## A. Pflichtangaben (ohne diese darf die Seite nicht live gehen)
- [ ] Vollständiger Name des Inhabers (impressum.html und datenschutz.html, gelb markiert)
- [ ] Rechtsform und Firmenname, falls abweichend (z. B. GmbH, dann auch Vertretungsberechtigter und Handelsregister)
- [ ] USt-IdNr.: vorhanden? Wenn nein, Abschnitt „Umsatzsteuer-ID" im Impressum löschen
- [ ] Streitschlichtung: Soll der Satz lauten „Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen."? Inhaber entscheidet.
- [ ] Beide Telefonnummern veröffentlichen (Festnetz und Mobil 0173 / 2 13 32 56)? E-Mail-Adresse stavros-stamatis@t-online.de korrekt?
- [ ] Hosting-Anbieter mit Firmenname und Anschrift (Datenschutz). Bei Netlify die Speicherdauer der Logfiles aus deren Datenschutzhinweisen übernehmen.
- [ ] Darf die Seite überhaupt veröffentlicht werden? Texte und Speisekarte stammen von der alten Seite. Schriftliche Zustimmung einholen (Mail reicht).

## B. Inhalte bestätigen lassen (stehen so auf der Seite)
- [ ] Ruhetag Montag (Zeiten-Liste, gelb „bitte bestätigen")
- [ ] Öffnungszeiten: Di bis Sa 17:00 bis 23:00, So 11:30 bis 23:00, Feiertage wie Sonntag
- [ ] Sonntags-Mittagstisch 11:30 bis 14:30 Uhr für 20,00 € pro Person
- [ ] Sonderangebot Chefkoch Christos, 21,00 € pro Person ab 2 Personen
- [ ] Alle Preise der Speisekarte (151 Einträge) gegen die aktuelle gedruckte Karte prüfen. Preise müssen identisch sein.
- [ ] Zusatzstoff-Legende und Hinweis „Fragen zu Allergenen: Bedienung" stimmen mit dem Aushang im Lokal überein
- [ ] „Platz für bis zu 60 Personen" (kommt mehrfach vor)
- [ ] Kostenlose Parkplätze vor und hinter dem Restaurant
- [ ] Buslinien 94 und 201: Haltestelle in der Nähe (Text wurde bewusst abgeschwächt, ggf. Haltestellenname ergänzen)
- [ ] Stammtisch: Fans von Arminia Bielefeld, SC Paderborn, Schalke 04, Borussia Dortmund; Skat; Kickerraum
- [ ] Biergarten vorhanden und in welchen Monaten geöffnet
- [ ] Feiern auch außerhalb der Öffnungszeiten möglich (Taufe, Kommunion, Konfirmation)
- [ ] Anlässe in der Feier-Auswahl: Sollen alle 16 bleiben? Trauerfeier bewusst dabei?
- [ ] Bestellung zum Mitnehmen nur per Telefon? Reservierung nur per Telefon?

## C. Material vom Inhaber
- [ ] Eigene Fotos: Gastraum, Theke, Biergarten, Räume für Feiern, Kickerraum, Küche (WebP, 1200 x 900, max. 200 KB; Alt-Text pro Foto kurz beschreiben)
- [ ] Link zur Google-Bewertung (Place-ID), damit „Jetzt bei Google bewerten" direkt das Bewertungsfenster öffnet
- [ ] Domain: Hat der Inhaber eine (bei-stavros.de)? Wer zahlt und verwaltet sie?

## D. Beim Livegang selbst erledigen
- [ ] In allen 5 HTML-Dateien `<meta name="robots" content="noindex,nofollow">` auf `index,follow` stellen
- [ ] In netlify.toml den Block `X-Robots-Tag` löschen
- [ ] Footer-Zeile (in allen 5 Dateien) „Beispielentwurf einer neuen Website, keine offizielle Seite." entfernen
- [ ] Gelbe Hinweise „Entwurf: ..." im Impressum und Datenschutz entfernen, alle `platzhalter` ersetzt
- [ ] Stand-Datum im Datenschutz („November 2026") aktualisieren
- [ ] canonical-Link, `og:url` und `og:image` mit der echten Domain ergänzen
- [ ] Echte 404-Seite statt Weiterleitung auf die Startseite einrichten (netlify.toml, Block `[[redirects]]`)
- [ ] Google Maps nach dem Livegang testen (Karte laden). Falls leer: Einbettungs-Link über Google Maps „Teilen > Karte einbetten" holen.
- [ ] Impressum und Datenschutz vom Inhaber oder einem Generator (z. B. eRecht24) gegenlesen lassen. Das ist keine Rechtsberatung.

## E. Was sich später ändert
- Kommen Analytics, YouTube, Instagram oder ein Reservierungstool dazu, braucht die Seite einen Cookie-Banner und eine neue Datenschutzerklärung.
- Jede Preisänderung gleichzeitig auf der Seite und im Lokal ändern.
