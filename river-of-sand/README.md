# Those That Remain – Roman-Projekt (400 Seiten)

## 📚 Projekt-Übersicht

Dies ist die vollständige HTML-Strukturierung des literarischen Romans **"Those That Remain"** — ein tiefenpsychologisches Werk über den Schwarzen September 1970 in Jordanien/Palästina, erzählt aus der ungefilterten Perspektive des 9-jährigen Tariq.

**Zielumfang:** ca. 400 Seiten (16–18 umfangreiche Kapitel)  
**Stil:** Roh, poetisch, sensorisch dicht – ohne Klischees  
**Setting:** Amman, Jordanien / Palästina, Herbst 1970

---

## 📂 Dateistruktur

```
river-of-sand/
├── index.html                              # Gesamt-Index (START HIER)
├── 00-cover.html                           # Titelseite
├── 00-sensibilisierung-triggerwarnung.html # Triggerwarnung
├── 01-prolog-einleitung.html               # Prolog
├── 02-inhaltsverzeichnis.html              # Inhaltsverzeichnis
├── 03-kapitel-1.html                       # ✓ FERTIG: Der Duft von Kardamom und Staub
├── 04-kapitel-2.html                       # [ZU SCHREIBEN]
├── 05-kapitel-3.html                       # [ZU SCHREIBEN]
├── 06-kapitel-4.html                       # [ZU SCHREIBEN]
├── 07-kapitel-5.html                       # [ZU SCHREIBEN]
├── 08-kapitel-6.html                       # [ZU SCHREIBEN]
├── 09-kapitel-7.html                       # [ZU SCHREIBEN]
├── 10-kapitel-8.html                       # [ZU SCHREIBEN]
├── 11-kapitel-9.html                       # [ZU SCHREIBEN]
├── 12-kapitel-10.html                      # [ZU SCHREIBEN]
├── 13-kapitel-11.html                      # [ZU SCHREIBEN]
├── 14-kapitel-12.html                      # [ZU SCHREIBEN]
├── 15-kapitel-13.html                      # [ZU SCHREIBEN]
├── 16-epilog.html                          # [ZU SCHREIBEN]
└── README.md                               # Diese Datei
```

---

## 🎯 Verwendung

### Option 1: Einzelne HTML-Dateien anschauen
1. Öffne `index.html` im Browser
2. Klicke auf die Links der bereits geschriebenen Kapitel

### Option 2: PDF erstellen (Gesamtwerk)
**Mit Pandoc:**
```bash
pandoc 00-cover.html 00-sensibilisierung-triggerwarnung.html 01-prolog-einleitung.html 02-inhaltsverzeichnis.html 03-kapitel-1.html [...weitere Kapitel...] -o Those-That-Remain.pdf
```

**Mit Prince XML (professionellere Druckausgabe):**
```bash
prince index.html -o Those-That-Remain.pdf
```

### Option 3: ePub erstellen
**Mit Calibre:**
1. Öffne Calibre
2. Datei → Neu → Add HTML → Alle HTML-Dateien auswählen
3. Speichern unter → ePub-Format

Oder **mit Pandoc:**
```bash
pandoc *.html -o Those-That-Remain.epub
```

---

## ✍️ Schreibrichtlinien (Eiserne Regeln)

Damit das Buch literarisch wertvoll bleibt und nicht wie eine leblose KI-Geschichte klingt:

### 1. **Absolutes Verbot von Phrasen-Dialogen**
- Charaktere im Schock sprechen nicht aus, was sie fühlen
- Niemand sagt: „Ich habe solche Angst!" oder „Wir müssen fliehen!"
- Panik liegt im Subtext — abgehackte Halbsätze, Schweigen, Streit über belanglose Dinge

### 2. **Körperlichkeit statt Erklärungen (Show, don't tell)**
- Nie: „Tariq fühlte sich einsam" oder „Die Mutter war gestresst"
- Besser: Tariq zieht obsessiv Fäden an seinem Hemdsaum, bis die Finger bluten
- Besser: Die Mutter bürstet die Haare der Schwester so fest, bis die Kopfhaut rot wird

### 3. **Sensorische Härte der Epoche**
- Angst schmeckt trocken wie Wüstenstaub
- Der flirrende, unerträgliche Khamsin-Wind
- Der Geschmack von warmem, metallischem Wasser aus rostigen Blechkanistern
- Der Geruch von ungewaschenem Cordstoff auf verschwitzter Kinderhaut

### 4. **Die kindliche Fehlinterpretation**
- Tariq versteht keine Geopolitik oder Begriffe wie „Souveränität"
- Der Krieg ist ein „grollendes Tier", das nachts die Wände atmen lässt
- Soldaten sind Figuren, die aus seinen Albträumen in die Realität treten

### 5. **Grausame Kontraste**
- Kinder spielen auch im Elend
- Zeige Tariq und seinen Freund, wie sie Sekunden vor einem Luftangriff lachen
- Diese Brüche machen den Schmerz für den Leser unerträglich

---

## 📖 Kapitel-Struktur (400-Seiten-Plan)

### **TEIL I: DER BRUCH** (Seiten 9–114)
- Kap. 1: Der Duft von Kardamom und Staub ✓
- Kap. 2: Die Löwen aus dem Radio
- Kap. 3: Wenn die Wände atmen
- Kap. 4: Das Diktat steht still

### **TEIL II: DAS ÜBERLEBEN** (Seiten 115–239)
- Kap. 5: Die Schritte des Wüstenriesen
- Kap. 6: Der Geschmack von bitterem Wasser
- Kap. 7: Das Spielzeug aus Messing (Kernbruch: Ziads Tod)
- Kap. 8: Kalte Nächte im Korridor

### **TEIL III: WAS BLEIBT** (Seiten 240–337)
- Kap. 9: Die Geometrie der Ruinen
- Kap. 10: Der weinende Soldat
- Kap. 11: Der Wüsten-Highway

### **TEIL IV: DIE WÜSTE VERGISST NIE** (Seiten 338–400)
- Kap. 12: Das Schweigen der Schlüssel
- Kap. 13: Das Entzaubern der Helden
- Epilog: Koffer aus Pappe

---

## 🎨 CSS-Styling (Einheitlich in allen Dateien)

Jede HTML-Datei enthält:
- **Schrift:** Georgia (Serif) für klassische Lesbarkeit
- **Zeilenabstand:** 1.8–1.9 für sensorische Dichte
- **Seitengröße:** Optimiert für DIN A4 (900px × 100vh)
- **Seitennummern:** Unten rechts, in subtiler Farbe
- **Druck-freundlich:** Weiße Hintergründe, schwarze Schrift

---

## 📋 Nächste Schritte

1. **Alle verbleibenden Kapitel schreiben** (2–16)
2. **Test:** Alle HTML-Dateien in einem Browser öffnen und Navigation testen
3. **PDF-Export:** Mit Pandoc oder Prince zu einer PDF-Gesamtdatei zusammenfassen
4. **ePub-Export:** Mit Calibre für E-Reader vorbereiten
5. **Print-Vorbereitung:** Bei Bedarf mit einem Druckerei-Service finalisieren

---

## 💭 Emotionale Kernmatrix

Das übergeordnete Gefühl des Romans ist **die Ohnmacht des Kindes vor dem unaufhaltsamen Ersticken seines Urvertrauens**.

Der Leser darf kein Mitleid aus sicherer Distanz spüren. Er muss die sensorische Überreizung und emotionale Taubheit von Tariq physisch teilen.

**Keine heroischen Kämpfe. Nur das leise, schmerzhafte Überbleiben inmitten der Trümmer.**

---

## 🛠️ Tools & Ressourcen

- **Pandoc:** Für PDF/ePub-Konvertierung
- **Prince XML:** Professionelle Druckausgabe
- **Calibre:** ePub-Erstellung und E-Reader-Simulation
- **Visual Studio Code:** Zum Bearbeiten der HTML-Dateien
- **GitHub:** Zur Versionskontrolle

---

## 📞 Versionshistorie

- **v0.1** (01.07.2026): Struktur angelegt, Kapitel 1 geschrieben
- **v0.2** (TBD): Kapitel 2–16 schreiben
- **v1.0** (TBD): Gesamtwerk vollständig, fertig für Druck/eBook

---

**© 2026 — Those That Remain**  
*Manche Narben heilen nicht*
