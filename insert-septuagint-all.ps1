# INSERT SEPTUAGINT INTO ALL VERSE FILES
# Step 1: Insert into German  
# Step 2: Copy to all other languages

param(
    [switch]$TestOnly = $false,  # Only process Genesis for testing
    [switch]$SkipBackup = $false
)

$baseDir = "C:\Users\beris_xrgc50t\KX KroniX\BooKX"
$lxxDir = "$baseDir\temp-septuagint"
$distDir = "$baseDir\dist-diebibel"

Write-Host "=== SEPTUAGINT MASS INSERTION ===" -ForegroundColor Cyan -BackgroundColor Black
Write-Host "Target: ALL 19 languages × 39 OT books = 741 files`n" -ForegroundColor White

# Language folders (German first, then copy to others)
$languages = @(
    "german", "italian", "french", "spanish", "portuguese", "dutch", 
    "czech", "polish", "swedish", "russian", "ukrainian", "hungarian",
    "armenian", "albanian", "croatian", "tagalog", "kjv", "serbian", "greek"
)

# Book mapping: filename -> LXX file prefix (OLD TESTAMENT ONLY - 39 books)
$bookMap = [ordered]@{
    "001-gen" = "grcbrent_002_GEN"
    "002-exo" = "grcbrent_003_EXO"
    "003-lev" = "grcbrent_004_LEV"
    "004-num" = "grcbrent_005_NUM"
    "005-deu" = "grcbrent_006_DEU"
    "006-jos" = "grcbrent_007_JOS"
    "007-jdg" = "grcbrent_008_JDG"
    "008-rut" = "grcbrent_009_RUT"
    "009-1sa" = "grcbrent_010_1SA"
    "010-2sa" = "grcbrent_011_2SA"
    "011-1ki" = "grcbrent_012_1KI"
    "012-2ki" = "grcbrent_013_2KI"
    "013-1ch" = "grcbrent_014_1CH"
    "014-2ch" = "grcbrent_015_2CH"
    "015-ezr" = "grcbrent_016_EZR"
    "016-neh" = "grcbrent_017_NEH"
    "017-est" = "grcbrent_018_EST"
    "018-job" = "grcbrent_019_JOB"
    "019-psa" = "grcbrent_020_PSA"
    "020-pro" = "grcbrent_021_PRO"
    "021-ecc" = "grcbrent_022_ECC"
    "022-sng" = "grcbrent_023_SNG"
    "023-isa" = "grcbrent_024_ISA"
    "024-jer" = "grcbrent_025_JER"
    "025-lam" = "grcbrent_026_LAM"
    "026-ezk" = "grcbrent_027_EZK"
    "027-dan" = "grcbrent_028_DAN"
    "028-hos" = "grcbrent_029_HOS"
    "029-jol" = "grcbrent_030_JOL"
    "030-amo" = "grcbrent_031_AMO"
    "031-oba" = "grcbrent_032_OBA"
    "032-jon" = "grcbrent_033_JON"
    "033-mic" = "grcbrent_034_MIC"
    "034-nam" = "grcbrent_035_NAM"
    "035-hab" = "grcbrent_036_HAB"
    "036-zep" = "grcbrent_037_ZEP"
    "037-hag" = "grcbrent_038_HAG"
    "038-zec" = "grcbrent_039_ZEC"
    "039-mal" = "grcbrent_040_MAL"
}

if($TestOnly) {
    Write-Host "TEST MODE: Only processing Genesis`n" -ForegroundColor Yellow
    $bookMap = [ordered]@{ "001-gen" = "grcbrent_002_GEN" }
    $languages = @("german")
}

Write-Host "STEP 1: Inserting Greek verses into ALL files...`n" -ForegroundColor Yellow

$totalProcessed = 0
$totalErrors = 0
$totalVersesInserted = 0

foreach($lang in $languages) {
    Write-Host "→ Language: $lang" -ForegroundColor Cyan
    
    foreach($bookKey in $bookMap.Keys) {
        $lxxPrefix = $bookMap[$bookKey]
        $bookFile = "$bookKey.html"
        $bookPath = "$distDir\$lang\bücher\$bookFile"
        
        if(!(Test-Path $bookPath)) {
            Write-Host "    ⚠ $bookFile not found in $lang" -ForegroundColor Yellow
            $totalErrors++
            continue
        }
        
        Write-Host "    $bookFile..." -ForegroundColor White -NoNewline
        
        # Backup
        if(!$SkipBackup -and $lang -eq "german") {
            $backupPath = "$bookPath.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
            Copy-Item $bookPath $backupPath | Out-Null
        }
        
        # Read file
        $content = Get-Content $bookPath -Raw -Encoding UTF8
        
        # Find all LXX chapter files for this book
        $lxxFiles = Get-ChildItem "$lxxDir" -Filter "${lxxPrefix}_*_read.txt" | Sort-Object Name
        
        if($lxxFiles.Count -eq 0) {
            Write-Host " ✗ No LXX files found" -ForegroundColor Red
            $totalErrors++
            continue
        }
        
        $versesInserted = 0
        $modified = $content
        
        # Process each chapter
        foreach($lxxFile in $lxxFiles) {
            # Extract chapter number from filename (e.g., grcbrent_002_GEN_01_read.txt)
            if($lxxFile.Name -match '_(\d+)_read\.txt$') {
                $chNum = [int]$matches[1]
            } else {
                continue
            }
            
            # Read Greek verses (skip first 2 lines: book name and chapter number)
            $greekVerses = Get-Content $lxxFile.FullName -Encoding UTF8 | Select-Object -Skip 2 | Where-Object { $_.Trim() -ne '' }
            
            if($greekVerses.Count -eq 0) { continue }
            
            # Insert verses
            for($v = 1; $v -le $greekVerses.Count; $v++) {
                $greekText = $greekVerses[$v - 1].Trim()
                if(!$greekText) { continue }
                
                # Escape special regex characters in Greek text for safety
                $safeGreek = [regex]::Escape($greekText)
                
                # Pattern: Find verse block with this chapter and verse number
                # <div class="vb" id="v{chapter}-{verse}">
                #   ...
                #   <p class="base base-p">...</p>
                #   <p class="tra">...</p>   <- Insert BEFORE this
                #
                $pattern = "(<div class=`"vb[^`"]*`" id=`"v$chNum-$v`">.*?<p class=`"base base-p`">.*?</p>)(\s*)(<p class=`"tra`">)"
                
                $replacement = "`$1`$2    <p class=`"base base-o`">$greekText</p>`$2`$3"
                
                $before = $modified
                $modified = $modified -replace $pattern, $replacement, 1
                
                if($modified -ne $before) {
                    $versesInserted++
                }
            }
        }
        
        if($versesInserted -gt 0) {
            # Save modified content
            $modified | Out-File $bookPath -Encoding UTF8 -NoNewline
            Write-Host " ✓ $versesInserted verses" -ForegroundColor Green
            $totalVersesInserted += $versesInserted
        } else {
            Write-Host " ⚠ 0 verses inserted" -ForegroundColor Yellow
            $totalErrors++
        }
        
        $totalProcessed++
    }
}

Write-Host "`n=== SUMMARY ===" -ForegroundColor Cyan
Write-Host "Processed files: $totalProcessed" -ForegroundColor White
Write-Host "Total verses inserted: $totalVersesInserted" -ForegroundColor Green
Write-Host "Errors/warnings: $totalErrors" -ForegroundColor $(if($totalErrors -gt 0){'Yellow'}else{'Green'})

if($TestOnly) {
    Write-Host "`nTEST COMPLETE. Check german\bücher\001-gen.html" -ForegroundColor Cyan
    Write-Host "If looks good, run WITHOUT -TestOnly to process all books" -ForegroundColor Yellow
}
