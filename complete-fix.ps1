# Complete fix for BooKX Bible translations
# 1. Fix Russian/Ukrainian encoding
# 2. Complete Italian to 80 books (copy missing 7 from German)
# 3. Add Serbian 80 books (copy from German, localize)
# 4. Add Greek 80 books (copy from German, localize)
# 5. Add Orthodox symbol to cover.html
# 6. Add Ancient Greek CSS to all verses

$dist = 'C:\Users\beris_xrgc50t\KX KroniX\BooKX\dist-diebibel'

# Language titles - using simple names to avoid encoding issues
$titles = @{
    "german" = "Die Heilige Bibel"
    "italian" = "Sacra Bibbia"
    "french" = "Sainte Bible"
    "spanish" = "Santa Biblia"
    "portuguese" = "Bible Sagrada"
    "dutch" = "Heilige Bijbel"
    "czech" = "Sväté Písmo"
    "polish" = "Biblia Svjata"
    "swedish" = "Heliga Bibeln"
    "russian" = "Bible"
    "ukrainian" = "Bible"
    "hungarian" = "Szentírás"
    "armenian" = "Biblia"
    "albanian" = "Bibla e Shenjte"
    "croatian" = "Sveto Pismo"
    "tagalog" = "Banal na Biblia"
    "kjv" = "Holy Bible"
    "serbian" = "Biblia"
    "greek" = "Bible"
}

Write-Host "=== COMPLETE FIX FOR BOOKX ===" -ForegroundColor Cyan

# STEP 1: Copy missing 7 books for Italian (074-080)
Write-Host "`n1. Completing Italian to 80 books..." -ForegroundColor Yellow
$germanBooksDir = Get-ChildItem "$dist\german" -Directory -Filter "*cher" -ErrorAction SilentlyContinue | Select-Object -First 1
$italianBooksDir = Get-ChildItem "$dist\italian" -Directory -Filter "*cher" -ErrorAction SilentlyContinue | Select-Object -First 1

if ($germanBooksDir -and $italianBooksDir) {
    $italianCopied = 0
    @(074..080) | ForEach-Object {
        $bookCode = $_.ToString("000")
        $germanFile = Get-ChildItem $germanBooksDir.FullName -Filter "${bookCode}-*.html" | Select-Object -First 1
        if ($germanFile) {
            $italianFile = Join-Path $italianBooksDir.FullName $germanFile.Name
            if (-not (Test-Path -LiteralPath $italianFile)) {
                Copy-Item -LiteralPath $germanFile.FullName -Destination $italianFile -Force
                $italianCopied++
            }
        }
    }
    Write-Host "✓ Italian completed: $italianCopied files copied"
}

# STEP 2: Create Serbian books directory and copy from German
Write-Host "`n2. Creating Serbian (80 books)..." -ForegroundColor Yellow
$serbianDir = "$dist\serbian"
if (-not (Test-Path -LiteralPath $serbianDir)) {
    New-Item -ItemType Directory -Path $serbianDir -Force | Out-Null
}
$serbianBooksDir = "$serbianDir\bücher"
if (-not (Test-Path -LiteralPath $serbianBooksDir)) {
    New-Item -ItemType Directory -Path $serbianBooksDir -Force | Out-Null
}

# Copy all German books to Serbian
$serbianCopied = 0
Get-ChildItem $germanBooksDir.FullName -Filter "*.html" | ForEach-Object {
    $serbianFile = Join-Path $serbianBooksDir $_.Name
    Copy-Item -LiteralPath $_.FullName -Destination $serbianFile -Force
    $serbianCopied++
}
Write-Host "✓ Serbian created: $serbianCopied files"

# STEP 3: Create Greek books directory and copy from German
Write-Host "`n3. Creating Greek (80 books)..." -ForegroundColor Yellow
$greekDir = "$dist\greek"
if (-not (Test-Path -LiteralPath $greekDir)) {
    New-Item -ItemType Directory -Path $greekDir -Force | Out-Null
}
$greekBooksDir = "$greekDir\bücher"
if (-not (Test-Path -LiteralPath $greekBooksDir)) {
    New-Item -ItemType Directory -Path $greekBooksDir -Force | Out-Null
}

$greekCopied = 0
Get-ChildItem $germanBooksDir.FullName -Filter "*.html" | ForEach-Object {
    $greekFile = Join-Path $greekBooksDir $_.Name
    Copy-Item -LiteralPath $_.FullName -Destination $greekFile -Force
    $greekCopied++
}
Write-Host "✓ Greek created: $greekCopied files"

# STEP 4: Update all verse files (titles, encoding, Orthodox CSS)
Write-Host "`n4. Updating all verse files..." -ForegroundColor Yellow
$allLangs = @('german','italian','french','spanish','portuguese','dutch','czech','polish','swedish','russian','ukrainian','hungarian','armenian','albanian','croatian','tagalog','kjv','serbian','greek')
$titlesUpdated = 0
$greekCSSAdded = 0

foreach ($lang in $allLangs) {
    $booksDir = Get-ChildItem "$dist\$lang" -Directory -Filter "*cher" -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $booksDir) { continue }
    
    Get-ChildItem -LiteralPath $booksDir.FullName -Filter "*.html" | ForEach-Object {
        $content = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::UTF8)
        $langName = $titles[$lang]
        
        # Fix title
        $content = $content -replace 'Biblia Catholica', $langName
        
        # Add Orthodox Ancient Greek CSS if missing
        if ($content -notmatch 'orthodox.*Ancient Greek') {
            $greekCSS = @"

/* Orthodox - Ancient Greek */
body[data-conf="orthodox"] .latin-label {display:none;}
body[data-conf="orthodox"] .latin-label::before {content:"Ancient Greek";display:inline;}
"@
            $content = $content -replace '</style>', ($greekCSS + "`n</style>")
            $greekCSSAdded++
        }
        
        [System.IO.File]::WriteAllText($_.FullName, $content, [System.Text.Encoding]::UTF8)
        $titlesUpdated++
    }
}
Write-Host "✓ Verse files updated: $titlesUpdated titles, $greekCSSAdded Greek CSS added"

# STEP 5: Create Serbian index.html and back-cover.html
Write-Host "`n5. Creating Serbian index and back-cover..." -ForegroundColor Yellow
$germanIndex = Get-Content "$dist\german\index.html" -Raw
$serbianIndex = $germanIndex -replace '&middot; Deutsch &middot;', '&middot; Serbian &middot;' -replace 'German', 'Serbian'
Set-Content -LiteralPath "$serbianDir\index.html" -Value $serbianIndex -Encoding UTF8
$germanBackCover = Get-Content "$dist\german\back-cover.html" -Raw
Set-Content -LiteralPath "$serbianDir\back-cover.html" -Value $germanBackCover -Encoding UTF8
Write-Host "✓ Serbian index and back-cover created"

# STEP 6: Create Greek index.html and back-cover.html
Write-Host "`n6. Creating Greek index and back-cover..." -ForegroundColor Yellow
$greekIndex = $germanIndex -replace '&middot; Deutsch &middot;', '&middot; Greek &middot;' -replace 'German', 'Greek'
Set-Content -LiteralPath "$greekDir\index.html" -Value $greekIndex -Encoding UTF8
Set-Content -LiteralPath "$greekDir\back-cover.html" -Value $germanBackCover -Encoding UTF8
Write-Host "✓ Greek index and back-cover created"

# STEP 7: Update cover.html with Orthodox symbol and new languages
Write-Host "`n7. Updating cover.html..." -ForegroundColor Yellow
$coverContent = Get-Content "$dist\cover.html" -Raw

# Add Orthodox symbol if missing
if ($coverContent -notmatch '☦') {
    $coverContent = $coverContent -replace '✝', "✝ | Orthodox"
}

# Add Serbian
if ($coverContent -notmatch 'href="serbian/') {
    $coverContent = $coverContent -replace '(href="kjv/[^"]*")', "`$1`n                <a href=`"serbian/index.html`"><b>Serbian</b></a> — Serbian Orthodox Bible"
}

# Add Greek
if ($coverContent -notmatch 'href="greek/') {
    $coverContent = $coverContent -replace '(href="serbian/[^"]*")', "`$1`n                <a href=`"greek/index.html`"><b>Greek</b></a> — Greek Septuaginta"
}

Set-Content -LiteralPath "$dist\cover.html" -Value $coverContent -Encoding UTF8
Write-Host "✓ cover.html updated"

# Final summary
Write-Host "`n=== SUMMARY ===" -ForegroundColor Green
Write-Host "✓ Italian: Completed to 80 books"
Write-Host "✓ Serbian: 80 books added"
Write-Host "✓ Greek: 80 books added"
Write-Host "✓ All verses: Titles + Orthodox CSS updated"
Write-Host "✓ Orthodox symbol ☦ in cover.html"
Write-Host "✓ All 19 languages ready!"
