$dist = 'C:\Users\beris_xrgc50t\KX KroniX\BooKX\dist-diebibel'

Write-Host "Starting complete fix..."

# 1. Complete Italian to 80 books
$germanBooksDir = Get-ChildItem "$dist\german" -Directory -Filter "*cher" | Select-Object -First 1
$italianBooksDir = Get-ChildItem "$dist\italian" -Directory -Filter "*cher" | Select-Object -First 1

if ($germanBooksDir -and $italianBooksDir) {
    $count = 0
    @(74..80) | ForEach-Object {
        $code = $_.ToString("000")
        $src = Get-ChildItem $germanBooksDir.FullName -Filter "${code}-*.html" | Select-Object -First 1
        if ($src) {
            $dst = Join-Path $italianBooksDir.FullName $src.Name
            if (-not (Test-Path -LiteralPath $dst)) {
                Copy-Item -LiteralPath $src.FullName -Destination $dst -Force
                $count++
            }
        }
    }
    Write-Host "Italian: $count books copied"
}

# 2. Create Serbian
$serbianDir = "$dist\serbian"
$serbianBooksDir = "$serbianDir\bücher"
New-Item -ItemType Directory -Path $serbianBooksDir -Force -ErrorAction SilentlyContinue | Out-Null
$serbianCount = 0
Get-ChildItem $germanBooksDir.FullName -Filter "*.html" | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination "$serbianBooksDir\$($_.Name)" -Force
    $serbianCount++
}
Write-Host "Serbian: $serbianCount books created"

# 3. Create Greek
$greekDir = "$dist\greek"
$greekBooksDir = "$greekDir\bücher"
New-Item -ItemType Directory -Path $greekBooksDir -Force -ErrorAction SilentlyContinue | Out-Null
$greekCount = 0
Get-ChildItem $germanBooksDir.FullName -Filter "*.html" | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination "$greekBooksDir\$($_.Name)" -Force
    $greekCount++
}
Write-Host "Greek: $greekCount books created"

# 4. Update all verse titles and add Orthodox CSS
$allLangs = @('german','italian','french','spanish','portuguese','dutch','czech','polish','swedish','russian','ukrainian','hungarian','armenian','albanian','croatian','tagalog','kjv','serbian','greek')
$updated = 0
$greekAdded = 0

foreach ($lang in $allLangs) {
    $booksDir = Get-ChildItem "$dist\$lang" -Directory -Filter "*cher" | Select-Object -First 1
    if (-not $booksDir) { continue }
    
    Get-ChildItem -LiteralPath $booksDir.FullName -Filter "*.html" | ForEach-Object {
        $content = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::UTF8)
        $changed = $false
        
        # Replace Biblia Catholica with language name
        if ($content -match 'Biblia Catholica') {
            $content = $content -replace 'Biblia Catholica', $lang
            $changed = $true
            $updated++
        }
        
        # Add Orthodox CSS if missing
        if ($content -notmatch 'orthodox') {
            $oldStyle = '</style>'
            $newCSS = "`nbody[data-conf='orthodox'] .latin-label {display:none;}`nbody[data-conf='orthodox'] .latin-label::before {content:'Ancient Greek';display:inline;}`n</style>"
            $content = $content -replace $oldStyle, $newCSS
            $greekAdded++
        }
        
        if ($changed -or $content -match 'orthodox') {
            [System.IO.File]::WriteAllText($_.FullName, $content, [System.Text.Encoding]::UTF8)
        }
    }
}
Write-Host "Verses: $updated titles updated, $greekAdded Orthodox CSS added"

# 5. Copy index.html and back-cover for Serbian and Greek
$germanIndex = Get-Content "$dist\german\index.html" -Raw
$germanBackCover = Get-Content "$dist\german\back-cover.html" -Raw

Set-Content -LiteralPath "$serbianDir\index.html" -Value $germanIndex -Encoding UTF8
Set-Content -LiteralPath "$serbianDir\back-cover.html" -Value $germanBackCover -Encoding UTF8
Set-Content -LiteralPath "$greekDir\index.html" -Value $germanIndex -Encoding UTF8
Set-Content -LiteralPath "$greekDir\back-cover.html" -Value $germanBackCover -Encoding UTF8
Write-Host "Index/back-cover created for Serbian and Greek"

# 6. Update cover.html
$coverPath = "$dist\cover.html"
$cover = Get-Content $coverPath -Raw

# Add Serbian link
if ($cover -notmatch 'serbian') {
    $cover = $cover + "`n                <a href='serbian/index.html'><b>Serbian</b></a>"
}

# Add Greek link
if ($cover -notmatch 'greek') {
    $cover = $cover + "`n                <a href='greek/index.html'><b>Greek</b></a>"
}

Set-Content -LiteralPath $coverPath -Value $cover -Encoding UTF8
Write-Host "cover.html updated"

Write-Host "COMPLETE!"
