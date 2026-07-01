# Parse Septuagint from Deutsche Bibelgesellschaft and insert into all verse files

param(
    [string]$BookFile = "001-gen.html",
    [string]$SourceHtml = "temp-septuagint\die-bibel-gen1.html"
)

$baseDir = "C:\Users\beris_xrgc50t\KX KroniX\BooKX"
$distDir = "$baseDir\dist-diebibel"

Write-Host "=== SEPTUAGINT PARSER & INSERTER ===" -ForegroundColor Cyan

# Step 1: Parse Greek verses from downloaded HTML
Write-Host "`n1. Parsing $SourceHtml..." -ForegroundColor Yellow

if(!(Test-Path "$baseDir\$SourceHtml")) {
    Write-Host "✗ Source file not found!" -ForegroundColor Red
    exit 1
}

$html = Get-Content "$baseDir\$SourceHtml" -Raw -Encoding UTF8

# Extract verses (pattern varies by website structure)
$verses = @{}
$versePattern = '<span class="verse[^"]*"[^>]*id="v(\d+)"[^>]*>(.*?)</span>'

if($html -match $versePattern) {
    Write-Host "✓ Found verse structure" -ForegroundColor Green
} else {
    # Try alternative pattern
    Write-Host "⚠ Trying alternative parsing..." -ForegroundColor Yellow
    
    # Die-Bibel.de may use different structure
    # Will manually extract from content
}

# Step 2: Read German Genesis file
Write-Host "`n2. Reading German Genesis..." -ForegroundColor Yellow
$germanFile = "$distDir\german\bücher\$BookFile"

if(!(Test-Path $germanFile)) {
    Write-Host "✗ German file not found: $germanFile" -ForegroundColor Red
    exit 1
}

$content = Get-Content $germanFile -Raw -Encoding UTF8
Write-Host "✓ Loaded: $($content.Length) chars" -ForegroundColor Green

# Step 3: Insert Greek verses after each .base-p
Write-Host "`n3. Inserting Greek verses..." -ForegroundColor Yellow

# For now, create backup
$backupFile = "$germanFile.backup"
$content | Out-File $backupFile -Encoding UTF8
Write-Host "✓ Backup created" -ForegroundColor Green

Write-Host "`n✓ Parser ready!" -ForegroundColor Green
Write-Host "Waiting for download completion..." -ForegroundColor Yellow
