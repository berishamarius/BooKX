@echo off
chcp 65001 >nul
title Biblia Catholica Interlinearis – Builder

echo.
echo  ╔═══════════════════════════════════════════════════════╗
echo  ║   BIBLIA CATHOLICA INTERLINEARIS – eBook Builder     ║
echo  ╚═══════════════════════════════════════════════════════╝
echo.
echo  Quelle: getbible.net API v2  ^|  Public Domain Texte
echo  Ausgabe: Übersetzungen\
echo.

:: Ins CATHOLIC-BIBLE Verzeichnis wechseln
cd /d "%~dp0"

:: Node.js prüfen
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  FEHLER: Node.js nicht gefunden!
    echo  Bitte von https://nodejs.org herunterladen und installieren.
    echo.
    pause
    exit /b 1
)

:: ─── SCHRITT 1: Texte herunterladen ───────────────────────
echo  [1/2] Lade Bibeltexte herunter...
echo        (Nur fehlende Dateien werden geladen)
echo.
node fetch-texts.js
if %errorlevel% neq 0 (
    echo.
    echo  FEHLER beim Herunterladen der Texte!
    pause
    exit /b 1
)

:: ─── SCHRITT 2: HTML generieren ───────────────────────────
echo.
echo  [2/2] Generiere HTML-eBook...
echo.
node build.js
if %errorlevel% neq 0 (
    echo.
    echo  FEHLER bei der HTML-Generierung!
    pause
    exit /b 1
)

:: ─── Fertig ───────────────────────────────────────────────
echo.
echo  ════════════════════════════════════════════════════════
echo.
echo  Das eBook ist fertig!
echo.
echo  Cover-Seite öffnen?  (J/N)
set /p OPEN="  Eingabe: "

if /i "%OPEN%"=="J" (
    start "" "%~dp0Übersetzungen\cover.html"
)

echo.
echo  Viel Freude mit der Biblia Catholica Interlinearis!
echo.
pause
