Write-Host "Installing Extra Extensions..." -ForegroundColor Cyan

$extras = @(
    "PKief.material-icon-theme",
    "zhuangtongfa.material-theme",
    "oderwat.indent-rainbow",
    "aaron-bond.better-comments",
    "christian-kohler.path-intellisense",
    "christian-kohler.npm-intellisense",
    "mhutchie.git-graph",
    "mtxr.sqltools",
    "mtxr.sqltools-driver-pg"
)

foreach ($ext in $extras) {
    Write-Host "Installing: $ext" -ForegroundColor Yellow
    cursor --install-extension $ext
}

Write-Host ""
Write-Host "Extra extensions installed!" -ForegroundColor Green



