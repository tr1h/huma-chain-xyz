Write-Host "Installing Cursor Extensions..." -ForegroundColor Cyan

$extensions = @(
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-python.python",
    "ms-python.vscode-pylance",
    "ms-python.black-formatter",
    "bmewburn.vscode-intelephense-client",
    "eamodio.gitlens",
    "usernamehw.errorlens",
    "gruntfuggly.todo-tree",
    "formulahendry.auto-rename-tag",
    "formulahendry.auto-close-tag",
    "naumovs.color-highlight",
    "mechatroner.rainbow-csv",
    "ritwickdey.liveserver",
    "humao.rest-client",
    "cweijan.vscode-database-client2"
)

$count = 0
foreach ($ext in $extensions) {
    Write-Host "Installing: $ext" -ForegroundColor Yellow
    cursor --install-extension $ext
    $count++
}

Write-Host ""
Write-Host "Done! Installed $count extensions" -ForegroundColor Green
Write-Host "Restart Cursor (Ctrl+Shift+P -> Reload Window)" -ForegroundColor Yellow



