# 🤝 Contributing to Solana Tamagotchi

First off, **thank you** for considering contributing to Solana Tamagotchi! 🎉

This document provides guidelines for contributing to the project. Following these guidelines helps maintain code quality and makes the review process smoother.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Translation Guidelines](#translation-guidelines)
- [Security](#security)

---

## 📜 Code of Conduct

This project follows a simple code of conduct:

- 🤝 Be respectful and inclusive
- 💬 Provide constructive feedback
- 🎯 Stay focused on the project goals
- 🔐 Never share sensitive information publicly
- 🌍 Respect the global community (13 languages!)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16+ (for package management)
- **Python** 3.9+ (for Telegram bot)
- **PHP** 7.4+ (for API)
- **Git** (version control)
- **Code Editor** (VS Code/Cursor recommended)

### Initial Setup

1. **Fork the repository**
   ```bash
   # Visit: https://github.com/tr1h/huma-chain-xyz
   # Click "Fork" button
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/huma-chain-xyz.git
   cd huma-chain-xyz
   ```

3. **Install dependencies**
   ```bash
   # Node.js packages
   npm install
   
   # Python packages (bot)
   cd bot
   pip install -r requirements.txt
   cd ..
   ```

4. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials (see SECURITY.md)
   ```

5. **Read documentation**
   - 📘 `README.md` - Project overview
   - 📗 `SECURITY.md` - Security guidelines
   - 📙 `docs/guides/QUICK_START_DEV.md` - Development setup
   - 🤖 `.github/DROID_GUIDELINES.md` - Developer guidelines

---

## 🔄 Development Workflow

### 1. Create a Branch

Always work on a feature branch, never directly on `main`:

```bash
# For new features
git checkout -b feature/your-feature-name

# For bug fixes
git checkout -b fix/bug-description

# For documentation
git checkout -b docs/what-you-are-documenting
```

### 2. Make Changes

Follow the [Coding Standards](#coding-standards) below.

### 3. Test Your Changes

```bash
# Lint JavaScript
npm run lint
# or
eslint js/*.js --fix

# Format code
npx prettier --write "**/*.{js,html,css}"

# Test bot (if you changed bot code)
cd bot
python bot.py
```

### 4. Commit Changes

Follow [Commit Guidelines](#commit-guidelines).

```bash
git add .
git commit -m "feat: add new game mechanics"
```

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

Go to GitHub and create a PR from your fork to `main`.

---

## 📐 Coding Standards

### JavaScript

- **Style:** ESLint + Prettier (see `.eslintrc.json`, `.prettierrc`)
- **Quotes:** Single quotes (`'`)
- **Semicolons:** Always use
- **Indentation:** 2 spaces
- **Line length:** Max 100 characters

**Example:**
```javascript
// ✅ Good
const fetchUserData = async (userId) => {
  try {
    const response = await fetch(`/api/user/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// ❌ Bad
const fetchUserData=async(userId)=>{
try{
const response=await fetch("/api/user/"+userId)
const data=await response.json()
return data
}catch(error){
console.error(error)
return null
}}
```

### PHP

- **Style:** PSR-12
- **Error handling:** Always use try-catch
- **Comments:** Document complex logic
- **Security:** Validate all inputs

**Example:**
```php
<?php
// ✅ Good
function getUserBalance(string $telegramId): ?float {
    try {
        $result = queryDatabase('users', ['telegram_id' => $telegramId]);
        return $result['balance'] ?? null;
    } catch (Exception $e) {
        error_log("Error getting balance: " . $e->getMessage());
        return null;
    }
}

// ❌ Bad
function getUserBalance($id) {
    $result = queryDatabase('users', ['telegram_id' => $id]);
    return $result['balance'];
}
```

### Python

- **Style:** Black formatter (100 char line length)
- **Type hints:** Use when possible
- **Docstrings:** For public functions
- **Imports:** Group by standard lib → third party → local

**Example:**
```python
# ✅ Good
def send_welcome_message(user_id: int, language: str = "en") -> bool:
    """Send welcome message to user in their language.
    
    Args:
        user_id: Telegram user ID
        language: Language code (default: "en")
        
    Returns:
        True if message sent successfully
    """
    try:
        text = t("welcome", language)
        bot.send_message(user_id, text)
        return True
    except Exception as e:
        logging.error(f"Failed to send welcome: {e}")
        return False

# ❌ Bad
def send_welcome(user_id, lang="en"):
    text = t("welcome", lang)
    bot.send_message(user_id, text)
```

### HTML/CSS

- **HTML:** Semantic tags, proper indentation
- **CSS:** Follow existing patterns, use variables
- **Mobile-first:** Always test responsive design

---

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Maintenance tasks
- `i18n`: Translation updates

### Examples

```bash
# Feature
git commit -m "feat(slots): add progressive jackpot mechanic"

# Bug fix
git commit -m "fix(api): correct balance calculation in withdrawal"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Translation
git commit -m "i18n: add German translations for new features"

# Multiple changes
git commit -m "feat(wheel): improve spin animation

- Add smooth easing function
- Increase rotation speed
- Add confetti effect on win"
```

---

## 🔀 Pull Request Process

### Before Creating PR

1. ✅ Code follows style guidelines
2. ✅ All tests pass (linter, manual testing)
3. ✅ Translations updated (if text changed)
4. ✅ Documentation updated (if needed)
5. ✅ No sensitive data in commits
6. ✅ Branch is up to date with `main`

### PR Title Format

Use the same format as commit messages:

```
feat(component): short description
fix(component): short description
docs: update documentation
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Translation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing Done
- [ ] Tested on desktop browser
- [ ] Tested on mobile browser
- [ ] Tested in Telegram WebApp
- [ ] Tested with multiple languages
- [ ] Linter passed

## Screenshots (if applicable)
[Add screenshots here]

## Related Issues
Fixes #123
Related to #456

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No breaking changes (or documented)
- [ ] Translations updated (all 13 languages)
```

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, PR will be merged
4. Your contribution will be credited!

---

## 🌍 Translation Guidelines

**IMPORTANT:** All text changes require updates to **all 13 languages**!

### Supported Languages

EN (English) • RU (Russian) • ZH (Chinese) • ES (Spanish) • PT (Portuguese) • JA (Japanese) • FR (French) • HI (Hindi) • KO (Korean) • TR (Turkish) • DE (German) • AR (Arabic) • VI (Vietnamese)

### Files to Update

1. **Telegram Bot:**
   - `bot/translations.py` - Main translations
   - `bot/bot_translations.py` - Bot UI text

2. **Frontend:**
   - `js/i18n.js` - Website translations

3. **Landing Pages (SEO):**
   - `/ru/index.html` - Russian
   - `/zh/index.html` - Chinese
   - `/ja/index.html` - Japanese
   - `/ko/index.html` - Korean
   - `/es/index.html` - Spanish

### Translation Process

```python
# 1. Add to bot/translations.py
TRANSLATIONS = {
    "new_key": {
        "en": "English text",
        "ru": "Русский текст",
        "zh": "中文文本",
        "es": "Texto en español",
        "pt": "Texto em português",
        "ja": "日本語のテキスト",
        "fr": "Texte français",
        "hi": "हिंदी पाठ",
        "ko": "한국어 텍스트",
        "tr": "Türkçe metin",
        "de": "Deutscher Text",
        "ar": "النص العربي",
        "vi": "Văn bản tiếng Việt"
    }
}
```

### Need Help with Translations?

- Use DeepL or Google Translate for initial translation
- Ask native speakers to review
- Test with actual users if possible
- Mark uncertain translations with `# TODO: verify translation`

---

## 🔐 Security

### Critical Rules

1. **NEVER** commit secrets (API keys, passwords, private keys)
2. **ALWAYS** use `.env` for sensitive data
3. **CHECK** `SECURITY.md` before handling credentials
4. **VALIDATE** all user inputs
5. **REPORT** security issues privately (security@solanatamagotchi.com)

### Security Checklist

Before committing:
```bash
# Check for secrets
git diff | grep -i "password\|secret\|key\|token"

# Verify .env is ignored
git status | grep ".env"  # Should show nothing

# Review staged changes
git diff --cached
```

---

## 🐛 Reporting Bugs

Use GitHub Issues:

**Title:** Brief description  
**Labels:** `bug`

**Template:**
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: Chrome 120
- OS: Windows 11
- Language: English
- Telegram: Yes/No

## Screenshots
[Add if applicable]

## Additional Context
Any other relevant information
```

---

## 💡 Feature Requests

Use GitHub Issues:

**Title:** Brief feature description  
**Labels:** `enhancement`

**Template:**
```markdown
## Feature Description
Clear description of the feature

## Use Case
Who needs this and why?

## Proposed Solution
How you envision it working

## Alternatives Considered
Other approaches you thought about

## Additional Context
Mockups, examples, etc.
```

---

## 📞 Getting Help

- 📚 **Documentation:** Check `/docs` first
- 💬 **Telegram:** @gotchigamechat (community)
- 🐛 **Issues:** GitHub Issues for bugs
- 📧 **Email:** support@solanatamagotchi.com

---

## 🙏 Recognition

Contributors will be:
- Listed in project documentation
- Credited in release notes
- Thanked in our community channels

**Thank you for making Solana Tamagotchi better!** 🎮🚀

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Happy Contributing!** ✨

If you have questions about contributing, feel free to ask in our Telegram community or open a GitHub Discussion.
