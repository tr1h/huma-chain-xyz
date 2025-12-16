# UTF-8 Helper Script
# Use this to avoid encoding issues!

function Save-UTF8NoBOM {
    param(
        [Parameter(Mandatory=$true)]
        [string]$FilePath,
        
        [Parameter(Mandatory=$true)]
        [string]$Content
    )
    
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($FilePath, $Content, $utf8NoBom)
    Write-Host "✅ Saved: $FilePath (UTF-8 no BOM)" -ForegroundColor Green
}

function Convert-AllToUTF8NoBOM {
    param([string]$Directory = ".")
    
    Get-ChildItem -Path $Directory -Include *.html,*.js,*.css -Recurse | ForEach-Object {
        $content = [System.IO.File]::ReadAllText($_.FullName)
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText($_.FullName, $content, $utf8NoBom)
        Write-Host "✅ Converted: $($_.Name)" -ForegroundColor Green
    }
}

# Export functions
Export-ModuleMember -Function Save-UTF8NoBOM, Convert-AllToUTF8NoBOM

Write-Host @"

📝 UTF-8 Helper Loaded!

Usage:
  # Save file without BOM
  Save-UTF8NoBOM -FilePath "file.html" -Content $content
  
  # Convert all files in directory
  Convert-AllToUTF8NoBOM -Directory "."

"@ -ForegroundColor Cyan
