# INSERT SEPTUAGINT VERSES - SIMPLE VERSION
# Inserts Greek verses after .base-p in all verse files

param(
    [switch]$TestOnly = $false
)

$baseDir = "C:\Users\beris_xrgc50t\KX KroniX\BooKX"
$lxxDir = "$baseDir\temp-septuagint"
$distDir = "$baseDir\dist-diebibel"

Write-Host "=== SEPTUAGINT INSERTION ===" -ForegroundColor Cyan

# OLD TESTAMENT BOOKS (39 total)
$books = @(
    @{File="001-gen"; LXX="grcbrent_002_GEN"},
    @{File="002-exo"; LXX="grcbrent_003_EXO"},
    @{File="003-lev"; LXX="grcbrent_004_LEV"},
    @{File="004-num"; LXX="grcbrent_005_NUM"},
    @{File="005-deu"; LXX="grcbrent_006_DEU"},
    @{File="006-jos"; LXX="grcbrent_007_JOS"},
    @{File="007-jdg"; LXX="grcbrent_008_JDG"},
    @{File="008-rut"; LXX="grcbrent_009_RUT"},
    @{File="009-1sa"; LXX="grcbrent_010_1SA"},
    @{File="010-2sa"; LXX="grcbrent_011_2SA"},
    @{File="011-1ki"; LXX="grcbrent_012_1KI"},
    @{File="012-2ki"; LXX="grcbrent_013_2KI"},
    @{File="013-1ch"; LXX="grcbrent_014_1CH"},
    @{File="014-2ch"; LXX="grcbrent_015_2CH"},
    @{File="015-ezr"; LXX="grcbrent_016_EZR"},
    @{File="016-neh"; LXX="grcbrent_017_NEH"},
    @{File="017-est"; LXX="grcbrent_018_EST"},
    @{File="018-job"; LXX="grcbrent_019_JOB"},
    @{File="019-psa"; LXX="grcbrent_020_PSA"},
    @{File="020-pro"; LXX="grcbrent_021_PRO"},
    @{File="021-ecc"; LXX="grcbrent_022_ECC"},
    @{File="022-sng"; LXX="grcbrent_023_SNG"},
    @{File="023-isa"; LXX="grcbrent_024_ISA"},
    @{File="024-jer"; LXX="grcbrent_025_JER"},
    @{File="025-lam"; LXX="grcbrent_026_LAM"},
    @{File="026-ezk"; LXX="grcbrent_027_EZK"},
    @{File="027-dan"; LXX="grcbrent_028_DAN"},
    @{File="028-hos"; LXX="grcbrent_029_HOS"},
    @{File="029-jol"; LXX="grcbrent_030_JOL"},
    @{File="030-amo"; LXX="grcbrent_031_AMO"},
    @{File="031-oba"; LXX="grcbrent_032_OBA"},
    @{File="032-jon"; LXX="grcbrent_033_JON"},
    @{File="033-mic"; LXX="grcbrent_034_MIC"},
    @{File="034-nam"; LXX="grcbrent_035_NAM"},
    @{File="035-hab"; LXX="grcbrent_036_HAB"},
    @{File="036-zep"; LXX="grcbrent_037_ZEP"},
    @{File="037-hag"; LXX="grcbrent_038_HAG"},
    @{File="038-zec"; LXX="grcbrent_039_ZEC"},
    @{File="039-mal"; LXX="grcbrent_040_MAL"}
)

$languages = @(
    "german", "italian", "french", "spanish", "portuguese", "dutch",
    "czech", "polish", "swedish", "russian", "ukrainian", "hungarian",
    "armenian", "albanian", "croatian", "tagalog", "kjv", "serbian", "greek"
)

if($TestOnly) {
    Write-Host "TEST MODE: Genesis only`n" -ForegroundColor Yellow
    $books = @(@{File="001-gen"; LXX="grcbrent_002_GEN"})
    $languages = @("german")
}

$totalInserted = 0

foreach($lang in $languages) {
    Write-Host "`n→ $lang" -ForegroundColor Cyan
    
    foreach($book in $books) {
        $bookFile = "$($book.File).html"
        $bookPath = "$distDir\$lang\bücher\$bookFile"
        
        if(!(Test-Path $bookPath)) {
            Write-Host "  ⚠ $bookFile not found" -ForegroundColor Yellow
            continue
        }
        
        Write-Host "  $bookFile..." -NoNewline
        
        # Read file
        $content = Get-Content $bookPath -Raw -Encoding UTF8
        
        # Check if already has Greek verses
        if($content -match '<p class="base base-o">') {
            Write-Host " Already has Greek verses, skipping" -ForegroundColor Gray
            continue
        }
        
        # Get all LXX chapter files
        $lxxFiles = Get-ChildItem "$lxxDir" -Filter "$($book.LXX)_*_read.txt" | Sort-Object Name
        
        if($lxxFiles.Count -eq 0) {
            Write-Host " No LXX files" -ForegroundColor Red
            continue
        }
        
        $versesThisBook = 0
        $modified = $content
        
        # Process each chapter
        foreach($lxxFile in $lxxFiles) {
            # Extract chapter number
            if($lxxFile.Name -match '_(\d+)_read\.txt$') {
                $chNum = [int]$matches[1]
            } else {
                continue
            }
            
            # Read verses
            $verses = Get-Content $lxxFile.FullName -Encoding UTF8 | Select-Object -Skip 2 | Where-Object { $_.Trim() }
            
            if($verses.Count -eq 0) { continue }
            
            # Insert each verse
            for($vNum = 1; $vNum -le $verses.Count; $vNum++) {
                $greekText = $verses[$vNum - 1].Trim()
                if(!$greekText) { continue }
                
                # Find pattern: </p> followed by whitespace then <p class="tra">
                # Within the verse block id="v{ch}-{v}"
                
                # Build search string (simple approach)
                $searchStr = "</p>`r`n    <p class=""tra"">"
                $replaceStr = "</p>`r`n    <p class=""base base-o"">$greekText</p>`r`n    <p class=""tra"">"
                
                # Find verse block
                $verseId = "id=""v$chNum-$vNum"""
                $startPos = $modified.IndexOf($verseId)
                
                if($startPos -gt 0) {
                    # Find the next occurrence of search string after this position
                    $nextPos = $modified.IndexOf($searchStr, $startPos)
                    
                    if($nextPos -gt $startPos -and $nextPos -lt $startPos + 800) {
                        # Replace this specific occurrence
                        $before = $modified.Substring(0, $nextPos)
                        $after = $modified.Substring($nextPos + $searchStr.Length)
                        $modified = $before + $replaceStr + $after
                        $versesThisBook++
                    }
                }
            }
        }
        
        if($versesThisBook -gt 0) {
            $modified | Out-File $bookPath -Encoding UTF8 -NoNewline
            Write-Host " ✓ $versesThisBook verses" -ForegroundColor Green
            $totalInserted += $versesThisBook
        } else {
            Write-Host " ⚠ 0 verses" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n=== DONE ===" -ForegroundColor Cyan
Write-Host "Total verses inserted: $totalInserted" -ForegroundColor Green

if($TestOnly) {
    Write-Host "`nCheck german/buecher/001-gen.html" -ForegroundColor Yellow
    Write-Host "If OK run without -TestOnly to process all books" -ForegroundColor Yellow
}
