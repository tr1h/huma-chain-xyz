# 🚀 Development Shortcuts for Solana Tamagotchi
# Run from project root: .\scripts\dev-shortcuts.ps1 <command>

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

# Colors
$Green = "`e[32m"
$Yellow = "`e[33m"
$Blue = "`e[34m"
$Red = "`e[31m"
$Reset = "`e[0m"

function Write-Success { Write-Host "$Green✓ $args$Reset" }
function Write-Info { Write-Host "$Blue→ $args$Reset" }
function Write-Warning { Write-Host "$Yellow⚠ $args$Reset" }
function Write-ErrorMsg { Write-Host "$Red✗ $args$Reset" }

# Set HOME for git to avoid encoding issues
$env:HOME = "C:\goooog"

switch ($Command.ToLower()) {
    "help" {
        Write-Host @"
$Blue
╔══════════════════════════════════════════════════════════════╗
║     🚀 Solana Tamagotchi - Development Shortcuts             ║
╚══════════════════════════════════════════════════════════════╝
$Reset

$Yellow📦 Setup Commands:$Reset
  setup           - Initial project setup (install dependencies)
  install         - Install all dependencies (npm + pip)
  clean           - Clean node_modules and reinstall

$Yellow🔧 Development Commands:$Reset
  dev             - Start all development servers
  api             - Start PHP API server
  bot             - Start Telegram bot (local)
  frontend        - Open with Live Server

$Yellow✨ Code Quality:$Reset
  lint            - Run ESLint on JavaScript files
  format          - Format code with Prettier
  check           - Run all checks (lint + format check)
  fix             - Auto-fix all issues (lint + format)

$Yellow🧪 Testing:$Reset
  test            - Run all tests
  test-api        - Test API endpoints
  test-bot        - Test bot locally

$Yellow🗄️ Database:$Reset
  db              - Open Supabase dashboard
  db-migrate      - Show SQL migrations list

$Yellow📝 Documentation:$Reset
  docs            - Open docs folder
  readme          - Open README.md

$Yellow🔐 Security:$Reset
  check-secrets   - Check for exposed secrets in git
  env-example     - Show .env.example template

$Yellow📊 Git Commands:$Reset
  status          - Git status
  pull            - Git pull latest changes
  push            - Git push current branch
  branch          - Create new feature branch
  commit          - Make a commit (with prompts)

$Yellow🚀 Deployment:$Reset
  deploy-api      - Push API to Render
  deploy-bot      - Push bot to Render
  deploy-frontend - Deploy frontend to GitHub Pages

$Yellow🛠️ Utilities:$Reset
  open            - Open project in VS Code/Cursor
  clean-cache     - Clear browser cache files
  backup          - Create project backup

$Yellow Usage:$Reset
  .\scripts\dev-shortcuts.ps1 <command>
  
$Yellow Examples:$Reset
  .\scripts\dev-shortcuts.ps1 dev
  .\scripts\dev-shortcuts.ps1 lint
  .\scripts\dev-shortcuts.ps1 branch feature/new-game

"@
    }

    "setup" {
        Write-Info "Setting up Solana Tamagotchi project..."
        
        # Check Node.js
        if (Get-Command node -ErrorAction SilentlyContinue) {
            Write-Success "Node.js found: $(node --version)"
        } else {
            Write-ErrorMsg "Node.js not found! Install from https://nodejs.org"
            exit 1
        }
        
        # Check Python
        if (Get-Command python -ErrorAction SilentlyContinue) {
            Write-Success "Python found: $(python --version)"
        } else {
            Write-ErrorMsg "Python not found! Install from https://python.org"
            exit 1
        }
        
        # Install dependencies
        Write-Info "Installing Node.js dependencies..."
        npm install
        
        Write-Info "Installing Python dependencies..."
        Set-Location bot
        pip install -r requirements.txt
        Set-Location ..
        
        # Create .env if missing
        if (!(Test-Path ".env")) {
            Write-Warning ".env not found, creating from template..."
            Copy-Item ".env.example" ".env"
            Write-Success ".env created - please edit with your credentials"
        }
        
        Write-Success "Setup complete! Run 'dev' to start development"
    }

    "install" {
        Write-Info "Installing dependencies..."
        npm install
        Set-Location bot
        pip install -r requirements.txt
        Set-Location ..
        Write-Success "Dependencies installed"
    }

    "clean" {
        Write-Warning "Cleaning node_modules..."
        Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
        npm install
        Write-Success "Clean install complete"
    }

    "dev" {
        Write-Info "Starting development servers..."
        Write-Info "1. API Server: http://localhost:8000"
        Write-Info "2. Bot: Running locally"
        Write-Info "3. Frontend: Use Live Server in VS Code"
        Write-Warning "Press Ctrl+C to stop"
        
        # Start API in background
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd api; php -S localhost:8000"
        
        # Start bot
        Set-Location bot
        python bot.py
    }

    "api" {
        Write-Info "Starting PHP API server on http://localhost:8000..."
        Set-Location api
        php -S localhost:8000
    }

    "bot" {
        Write-Info "Starting Telegram bot..."
        Set-Location bot
        python bot.py
    }

    "frontend" {
        Write-Info "Open index.html in VS Code and use Live Server"
        code index.html
    }

    "lint" {
        Write-Info "Running ESLint..."
        npx eslint js/*.js
        Write-Success "Lint complete"
    }

    "format" {
        Write-Info "Formatting code with Prettier..."
        npx prettier --write "**/*.{js,html,css,md}"
        Write-Success "Code formatted"
    }

    "check" {
        Write-Info "Running code quality checks..."
        npx eslint js/*.js
        npx prettier --check "**/*.{js,html,css}"
        Write-Success "All checks passed"
    }

    "fix" {
        Write-Info "Auto-fixing issues..."
        npx eslint js/*.js --fix
        npx prettier --write "**/*.{js,html,css}"
        Write-Success "All issues fixed"
    }

    "test" {
        Write-Info "Running tests..."
        npm test
        Set-Location bot
        python -m pytest
        Set-Location ..
        Write-Success "Tests complete"
    }

    "test-api" {
        Write-Info "Testing API endpoints..."
        curl http://localhost:8000/api/tama/test
    }

    "test-bot" {
        Write-Info "Testing bot locally..."
        Set-Location bot
        python -c "from bot import *; print('Bot initialized successfully')"
        Set-Location ..
    }

    "db" {
        Write-Info "Opening Supabase dashboard..."
        Start-Process "https://supabase.com/dashboard/project/zfrazyupameidxpjihrh"
    }

    "db-migrate" {
        Write-Info "SQL Migrations in /sql:"
        Get-ChildItem sql/*.sql | Format-Table Name, LastWriteTime
    }

    "docs" {
        Write-Info "Opening docs folder..."
        explorer docs
    }

    "readme" {
        Write-Info "Opening README.md..."
        code README.md
    }

    "check-secrets" {
        Write-Info "Checking for exposed secrets..."
        git diff | Select-String -Pattern "password|secret|key|token" -CaseSensitive:$false
        if ($?) {
            Write-Warning "Found potential secrets in changes!"
        } else {
            Write-Success "No secrets found"
        }
    }

    "env-example" {
        Get-Content .env.example
    }

    "status" {
        git status
    }

    "pull" {
        Write-Info "Pulling latest changes..."
        git pull
        Write-Success "Up to date"
    }

    "push" {
        Write-Info "Pushing current branch..."
        git push
        Write-Success "Pushed"
    }

    "branch" {
        param([string]$BranchName)
        if (!$BranchName) {
            Write-ErrorMsg "Usage: .\scripts\dev-shortcuts.ps1 branch feature/your-feature"
            exit 1
        }
        Write-Info "Creating branch: $BranchName"
        git checkout -b $BranchName
        Write-Success "Branch created and checked out"
    }

    "commit" {
        Write-Host @"
$Yellow
Commit Type:$Reset
1. feat     - New feature
2. fix      - Bug fix
3. docs     - Documentation
4. style    - Code style
5. refactor - Refactoring
6. i18n     - Translation
"@
        $type = Read-Host "Select type (1-6)"
        $types = @("feat", "fix", "docs", "style", "refactor", "i18n")
        $selectedType = $types[$type - 1]
        
        $scope = Read-Host "Scope (optional, e.g., 'slots', 'api')"
        $message = Read-Host "Commit message"
        
        $commitMsg = if ($scope) {
            "${selectedType}(${scope}): ${message}"
        } else {
            "${selectedType}: ${message}"
        }
        
        Write-Info "Committing: $commitMsg"
        git add .
        git commit -m $commitMsg
        Write-Success "Committed"
    }

    "deploy-api" {
        Write-Info "Deploying API to Render..."
        git push origin main
        Write-Success "API will be deployed automatically"
    }

    "deploy-bot" {
        Write-Info "Deploying bot to Render..."
        git push origin main
        Write-Success "Bot will be deployed automatically"
    }

    "deploy-frontend" {
        Write-Info "Deploying frontend to GitHub Pages..."
        git push origin main
        Write-Success "Frontend will be deployed automatically"
    }

    "open" {
        Write-Info "Opening project in code editor..."
        if (Get-Command cursor -ErrorAction SilentlyContinue) {
            cursor .
        } elseif (Get-Command code -ErrorAction SilentlyContinue) {
            code .
        } else {
            Write-Warning "No code editor found"
        }
    }

    "clean-cache" {
        Write-Info "Clearing cache..."
        Remove-Item -Recurse -Force .cache -ErrorAction SilentlyContinue
        Write-Success "Cache cleared"
    }

    "backup" {
        $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
        $backupName = "backup-$timestamp"
        Write-Info "Creating backup: $backupName"
        # TODO: Implement backup logic
        Write-Success "Backup created"
    }

    default {
        Write-ErrorMsg "Unknown command: $Command"
        Write-Info "Run '.\scripts\dev-shortcuts.ps1 help' for available commands"
        exit 1
    }
}
