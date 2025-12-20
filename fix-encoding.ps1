# Fix encoding in legal-consent.js
$filePath = "js\legal-consent.js"
$content = Get-Content $filePath -Raw -Encoding UTF8

# Replace broken emoji
$content = $content -creplace '(вљ|рџљЁ|вЂ"|вљ–|рџ"''|пёЏ)([а-яА-Я]+\s?)+', {
    param($match)
    $text = $match.Value
    if ($text -like '*Important*') {
        return '⚠️'
    } elseif ($text -like '*GAME*') {
        return '🚨 THIS IS A GAME—NOT AN INVESTMENT OPPORTUNITY.'
    } elseif ($text -like '*Terms*') {
        return '⚖️'
    } elseif ($text -like '*Privacy*') {
        return '🔒'
    } elseif ($text -like '*Risk*') {
        return '⚠️'
    }
    return $text
}

# Manual replacements
$replacements = @{
    'вљ пёЏ Important' = '⚠️ Important'
    'рџљЁ THIS IS A GAMEвЂ"NOT' = '🚨 THIS IS A GAME—NOT'
    'вљ–пёЏ Terms of Service' = '⚖️ Terms of Service'
    'рџ"'' Privacy Policy' = '🔒 Privacy Policy'
    'вљ пёЏ Risk Warning' = '⚠️ Risk Warning'
}

foreach ($old in $replacements.Keys) {
    $new = $replacements[$old]
    $content = $content.Replace($old, $new)
}

# Save with UTF-8 NO BOM
[System.IO.File]::WriteAllText((Resolve-Path $filePath).Path, $content, (New-Object System.Text.UTF8Encoding $false))

Write-Host "✅ Fixed encoding in $filePath" -ForegroundColor Green
