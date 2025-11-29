# Git Information Script
$output = @()

$output += "═══════════════════════════════════════════════"
$output += "GIT CONFIGURATION CHECK"
$output += "═══════════════════════════════════════════════"
$output += ""

Set-Location "C:\goooog"

$output += "[1] Git User Name:"
try {
    $userName = git config --global user.name 2>&1
    $output += "    $userName"
} catch {
    $output += "    Not set"
}
$output += ""

$output += "[2] Git User Email:"
try {
    $userEmail = git config --global user.email 2>&1
    $output += "    $userEmail"
} catch {
    $output += "    Not set"
}
$output += ""

$output += "[3] Git Remote URL:"
try {
    $remote = git remote -v 2>&1
    $output += $remote
} catch {
    $output += "    Error getting remote"
}
$output += ""

$output += "[4] Git Status:"
try {
    $status = git status --short 2>&1
    if ($status) {
        $output += $status
    } else {
        $output += "    Working tree clean"
    }
} catch {
    $output += "    Error getting status"
}
$output += ""

$output += "[5] Git Branch:"
try {
    $branch = git branch 2>&1
    $output += $branch
} catch {
    $output += "    Error getting branch"
}
$output += ""

$output += "[6] Last Commit:"
try {
    $lastCommit = git log -1 --oneline 2>&1
    $output += "    $lastCommit"
} catch {
    $output += "    No commits yet"
}
$output += ""

$output += "[7] Checking for sensitive files in Git:"
try {
    $sensitiveFiles = git ls-files | Select-String -Pattern "keypair|secret|ADMIN_PASSWORDS|wallet-admin" 2>&1
    if ($sensitiveFiles) {
        $output += "    ❌ WARNING! Sensitive files found:"
        $output += $sensitiveFiles
    } else {
        $output += "    ✅ GOOD! No sensitive files tracked!"
    }
} catch {
    $output += "    ✅ GOOD! No sensitive files tracked!"
}
$output += ""

$output += "═══════════════════════════════════════════════"

# Save to file
$output | Out-File -FilePath "git_status.txt" -Encoding UTF8

# Display
$output | ForEach-Object { Write-Host $_ }

Write-Host ""
Write-Host "✓ Result saved to git_status.txt" -ForegroundColor Green

