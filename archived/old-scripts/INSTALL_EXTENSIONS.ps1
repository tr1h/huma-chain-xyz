# 🚀 АВТОМАТИЧЕСКАЯ УСТАНОВКА ВСЕХ РАСШИРЕНИЙ ДЛЯ CURSOR
# Запустите этот скрипт в PowerShell

Write-Host "🚀 Установка расширений для Solana Tamagotchi..." -ForegroundColor Cyan
Write-Host ""

# Список расширений
$extensions = @(
    # 🌐 Web Development
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",

    # 🐍 Python
    "ms-python.python",
    "ms-python.vscode-pylance",
    "ms-python.black-formatter",
    "ms-python.debugpy",

    # 🐘 PHP
    "bmewburn.vscode-intelephense-client",
    "DEVSENSE.phptools-vscode",

    # 🔗 Solana
    "solana.solana-dev",

    # 📊 Database
    "mtxr.sqltools",
    "mtxr.sqltools-driver-pg",
    "cweijan.vscode-database-client2",

    # 🎨 HTML/CSS/JS
    "formulahendry.auto-rename-tag",
    "formulahendry.auto-close-tag",
    "zignd.html-css-class-completion",
    "ecmel.vscode-html-css",

    # 📝 Git
    "eamodio.gitlens",
    "mhutchie.git-graph",

    # 🔍 Code Quality
    "streetsidesoftware.code-spell-checker",
    "usernamehw.errorlens",
    "gruntfuggly.todo-tree",
    "aaron-bond.better-comments",

    # 🎯 Productivity
    "alefragnani.project-manager",
    "christian-kohler.path-intellisense",
    "christian-kohler.npm-intellisense",

    # 🎨 Visual
    "naumovs.color-highlight",
    "oderwat.indent-rainbow",
    "PKief.material-icon-theme",

    # 📊 Data
    "mechatroner.rainbow-csv",
    "zainchen.json",

    # 🌐 Server
    "ritwickdey.liveserver",
    "humao.rest-client",

    # 🎨 Theme
    "zhuangtongfa.material-theme"
)

$installed = 0
$failed = 0

foreach ($ext in $extensions) {
    Write-Host "📦 Устанавливаем: $ext" -ForegroundColor Yellow

    try {
        # Используем cursor --install-extension вместо code
        $result = cursor --install-extension $ext 2>&1

        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Установлено: $ext" -ForegroundColor Green
            $installed++
        } else {
            Write-Host "   ❌ Ошибка: $ext" -ForegroundColor Red
            $failed++
        }
    } catch {
        Write-Host "   ❌ Не удалось установить: $ext" -ForegroundColor Red
        $failed++
    }

    Write-Host ""
}

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "🎉 УСТАНОВКА ЗАВЕРШЕНА!" -ForegroundColor Green
Write-Host ""
Write-Host ("✅ Успешно установлено: {0} расширений" -f $installed) -ForegroundColor Green
if ($failed -gt 0) {
    Write-Host ("❌ Ошибки: {0} расширений" -f $failed) -ForegroundColor Red
} else {
    Write-Host ("❌ Ошибки: {0} расширений" -f $failed) -ForegroundColor Green
}
Write-Host ""
Write-Host "🔄 ПЕРЕЗАГРУЗИТЕ CURSOR ДЛЯ ПРИМЕНЕНИЯ ИЗМЕНЕНИЙ!" -ForegroundColor Yellow
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Дополнительные инструкции:" -ForegroundColor Cyan
Write-Host "1. Откройте Cursor" -ForegroundColor White
Write-Host "2. Нажмите Ctrl+Shift+P" -ForegroundColor White
Write-Host "3. Введите 'Reload Window'" -ForegroundColor White
Write-Host "4. Готово! 🚀" -ForegroundColor White
Write-Host ""

# Проверяем, есть ли команда cursor в PATH
if (-not (Get-Command cursor -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️  ВНИМАНИЕ: Команда 'cursor' не найдена в PATH" -ForegroundColor Red
    Write-Host "   Возможно, расширения не установлены." -ForegroundColor Red
    Write-Host "   Установите расширения вручную через Ctrl+Shift+X" -ForegroundColor Yellow
    Write-Host ""
}
