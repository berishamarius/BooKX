# Canva API Integration - BooKX Design Generator

## 🎯 Übersicht

Dieses System generiert automatisch Design-Templates für alle **38 Übersetzungen** (19 Quran + 19 Bible) mit konsistentem Pattern:

- **Arabisch**: Scheherazade Bold, 25px, Gold (#C9A84C)
- **Englisch**: Georgia, 15px, Cream (#F0E6C0)  
- **Abstand**: 12pt
- **Hintergrund**: Dunkelgrün (#0B2414)

---

## 📋 Setup-Schritte

### 1. Canva Developer App erstellen

1. Gehe zu: https://www.canva.com/developers/
2. Melde dich an mit: **berishamarius179@gmail.com**
3. Klicke "Create an app"
4. Wähle: **OAuth 2.0**
5. Setze **Redirect URI**: `http://localhost:3000/callback`
6. Speichere **Client ID** und **Client Secret**

### 2. .env.canva erstellen

Kopiere `.env.canva.example` zu `.env.canva`:

```bash
cp .env.canva.example .env.canva
```

Fülle die Werte ein:

```env
CANVA_CLIENT_ID=dein_client_id
CANVA_CLIENT_SECRET=dein_client_secret
CANVA_REDIRECT_URI=http://localhost:3000/callback
CANVA_AUTH_CODE=wird_später_gesetzt
CANVA_EMAIL=berishamarius179@gmail.com
```

### 3. OAuth Authorization durchführen

```bash
node canva-client.js --auth-url
```

Dieser Befehl gibt dir eine Authorization URL. Öffne sie im Browser und:

1. Klicke "Authorize"
2. Du wirst umgeleitet zu: `http://localhost:3000/callback?code=XXXX&state=XXXX`
3. Kopiere den **code** Parameter
4. Füge ihn in `.env.canva` ein: `CANVA_AUTH_CODE=XXXX`

### 4. Token tauschen

```bash
node canva-client.js --auth <AUTH_CODE>
```

Beispiel:
```bash
node canva-client.js --auth 8f4e2c9a1b5d7e3f6a2c
```

---

## 🎨 Alle 38 Designs generieren

### Struktur

**Quran (19 Sprachen)**:
- Deutsch (Bubenheim)
- Englisch (Saheeh Intl.)
- Albanisch (Ahmeti)
- Bengalisch (Tawheed)
- Bosnisch (Mehanović)
- Chinesisch (Ma Jian)
- Französisch (Montada)
- Hausa (Gumi)
- Hindi (al-Umari)
- Indonesisch (KFQC)
- Kasachisch (Altai)
- Persisch (IslamHouse)
- Russisch (Abu Adel)
- Spanisch (Isa Garcia)
- Tagalog (Dar Al-Salam)
- Thailändisch (Zakaria)
- Türkisch (Diyanet)
- Urdu (Maududi)
- Uygurisch (Saleh)

**Bible (19 Sprachen)**:
- English (KJV 1611)
- Deutsch (Textbibel 1899)
- Français (Crampon 1923)
- Español (RV 1909)
- Português (Bíblia Livre)
- Polski (Gdańska 1632)
- Русский (Synodal 1876)
- Hrvatski (Šarića)
- Nederlands (SV 1637)
- Magyar (Károli)
- Čeština (Kralická)
- Svenska (Svenska Bibeln)
- Tagalog (Ang Biblia)
- Українська (Огієнко)
- Shqip (UFSHB)
- Română (Cornilescu)
- Italiano (Riveduta)
- ܣܘܪܝܬ (Peshitta)
- Հայերեն (Eastern)

---

## 📁 Output

Designs werden gespeichert unter:

```
dist-alquran/Übersetzungen/[SPRACHE]/cover/
  ├── cover.png
  ├── cover.svg
  └── cover.json (Metadata)
```

---

## 🔧 Dateien

- `canva-api-setup.js` - Setup & Konfiguration
- `canva-client.js` - Canva API Client
- `.env.canva.example` - Environment Vorlage
- `_canva-design-config.json` - Design-Konfiguration (Auto-generiert)

---

## 💡 Tipps

### Local Testing

```bash
# OAuth URL anzeigen
node canva-client.js --auth-url

# Design-Übersicht
node canva-client.js
```

### API Dokumentation

https://www.canva.com/developers/api-doc

### Rate Limits

- 60 Requests pro Minute
- 10.000 Requests pro Tag

---

## ⚠️ Häufige Probleme

**Problem**: "Client ID not found"
- Lösung: Überprüfe CANVA_CLIENT_ID in .env.canva

**Problem**: "Redirect URI mismatch"
- Lösung: URI in Canva App Settings muss genau `http://localhost:3000/callback` sein

**Problem**: "Access Token expired"
- Lösung: OAuth Flow neu durchführen

---

## 📞 Support

Email: berishamarius179@gmail.com

---

## ✅ Checkliste

- [ ] Canva Developer App erstellt
- [ ] Client ID & Secret kopiert
- [ ] .env.canva ausgefüllt
- [ ] OAuth Authorization durchgeführt
- [ ] Auth Code in .env.canva gespeichert
- [ ] Token erfolgreich getauscht
- [ ] Designs generiert
- [ ] PNG/SVG in Ordnern vorhanden
- [ ] Ready für Koranseiten-Integration
