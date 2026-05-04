@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"

echo.
echo  ╔══════════════════════════════════════════╗
echo  ║    AL-QURAN AL-KARIM – BOOK BUILDER     ║
echo  ╠══════════════════════════════════════════╣
echo  ║  Ladet alle 6.236 Verse in 10 Sprachen  ║
echo  ║  Quelle: quran.com API v4 (kostenlos)   ║
echo  ╚══════════════════════════════════════════╝
echo.

:: ── Node.js prüfen ──────────────────────────────────────
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  FEHLER: Node.js wurde nicht gefunden!
    echo.
    echo  Bitte installiere Node.js (kostenlos, keine Registrierung nötig):
    echo  https://nodejs.org  →  LTS-Version herunterladen und installieren
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node --version 2^>nul') do set NODE_VER=%%v
echo  Node.js %NODE_VER% gefunden.
echo.

:: ── Internetverbindung grob prüfen ───────────────────────
echo  Prüfe Verbindung zu quran.com...
node -e "const h=require('https');const r=h.get('https://api.quran.com/api/v4/chapters?per_page=1',{headers:{'User-Agent':'test'}},res=>{process.stdout.write(res.statusCode===200?'OK':'FAIL');r.destroy();});r.on('error',()=>{process.stdout.write('ERR');});" 2>nul | find "OK" >nul
if %errorlevel% neq 0 (
    echo  WARNUNG: quran.com nicht erreichbar.
    echo  Bitte Internetverbindung prüfen und erneut versuchen.
    echo.
    pause
    exit /b 1
)
echo  Verbindung OK.
echo.

:: ── Menü ─────────────────────────────────────────────────
echo  Was möchtest du tun?
echo.
echo    [1]  Vollständigen Quran laden und bauen  (ca. 20–40 Min)
echo    [2]  Übersetzungs-IDs prüfen / anzeigen
echo    [3]  Abbrechen
echo.
set /p WAHL="  Deine Wahl (1/2/3): "

if "%WAHL%"=="2" goto CHECK_IDS
if "%WAHL%"=="3" goto END
if "%WAHL%"=="1" goto BUILD

echo  Ungültige Eingabe.
goto END

:: ── Übersetzungs-IDs prüfen ──────────────────────────────
:CHECK_IDS
echo.
echo  ── Verfügbare Übersetzungen von quran.com ──────────────
echo.
node fetch-translations.js
echo.
echo  Falls eine ID falsch ist: build.js öffnen und
echo  im Abschnitt TRANSLATIONS die id-Nummer anpassen.
echo.
pause
goto END

:: ── Haupt-Build ──────────────────────────────────────────
:BUILD
echo.
echo  ════════════════════════════════════════════
echo   STARTE BUILD  (bitte nicht abbrechen)
echo  ════════════════════════════════════════════
echo.
echo  Es werden geladen:
echo    - Arabischer Originaltext (alle 6.236 Verse)
echo    - 10 Übersetzungen × 114 Suren = 1.140 Dateien
echo.
echo  Internet muss während des gesamten Vorgangs
echo  aktiv bleiben. Resume möglich: bereits vorhandene
echo  Dateien werden automatisch übersprungen.
echo.

node build.js

if %errorlevel% equ 0 (
    echo.
    echo  ════════════════════════════════════════════
    echo   FERTIG! Öffne: AL-QURAN\cover.html
    echo  ════════════════════════════════════════════
    echo.

    :: Cover automatisch im Browser öffnen
    set /p OPEN="  Cover jetzt im Browser öffnen? (j/n): "
    if /i "%OPEN%"=="j" start "" "cover.html"
    if /i "%OPEN%"=="ja" start "" "cover.html"
) else (
    echo.
    echo  FEHLER beim Erstellen. Bitte Fehlermeldung oben prüfen.
    echo  Häufige Ursachen:
    echo    - Keine Internetverbindung
    echo    - Falsche Übersetzungs-ID (→ Option 2 wählen)
    echo    - Rate-Limit (kurz warten und erneut starten)
    echo.
)

:END
echo.
pause
