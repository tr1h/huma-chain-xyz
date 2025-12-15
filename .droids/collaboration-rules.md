# 🤝 Collaboration Rules - Droids Team

> **How specialized Droids work together effectively**

---

## 🎯 Core Principle

**"Ask before you act, share when you're done"**

Every Droid should:
1. Check if their changes affect other Droids
2. Coordinate BEFORE making cross-cutting changes
3. Inform affected Droids AFTER completion

---

## 📋 Collaboration Matrix

### When Frontend Droid Makes Changes

**Must coordinate with:**
- **Backend Droid** - if adding/changing API calls
- **i18n Droid** - if adding any user-facing text (ALWAYS!)
- **Database Droid** - if displaying new data
- **Security Droid** - before handling sensitive data
- **Bot Droid** - if changing Telegram WebApp integration

**Example scenario:**
```
Frontend adds new game leaderboard

1. Frontend → Database: "Need leaderboard query, what's the schema?"
2. Database: "Here's the query, returns top 100 users"
3. Frontend → i18n: "Need translations for 'Rank', 'Player', 'Score'"
4. i18n: "Done, check i18n.js"
5. Frontend → Backend: "Using /api/leaderboard endpoint?"
6. Backend: "Yes, it's ready"
7. Frontend: *Implements UI*
8. Frontend → Security: "Please review"
9. Security: "Looks good, no XSS risks"
✅ Feature complete!
```

---

### When Backend Droid Makes Changes

**Must coordinate with:**
- **Frontend Droid** - API response format changes
- **Database Droid** - complex queries, schema needs
- **Security Droid** - input validation, auth logic
- **Bot Droid** - if shared endpoints affected
- **DevOps Droid** - before deploying

**Example scenario:**
```
Backend adds withdrawal endpoint

1. Backend → Security: "Need to implement withdrawal, what validations?"
2. Security: "Check wallet signature, amount limits, rate limiting"
3. Backend → Database: "Need atomic transaction for balance update"
4. Database: "Use this stored procedure"
5. Backend: *Implements endpoint*
6. Backend → Frontend: "New endpoint: POST /api/withdrawal, here's the spec"
7. Frontend: "Got it, will add UI"
8. Backend → Security: "Please audit"
9. Security: "Approved"
10. Backend → DevOps: "Ready to deploy"
11. DevOps: *Deploys*
✅ Feature complete!
```

---

### When Bot Droid Makes Changes

**Must coordinate with:**
- **i18n Droid** - ALL text (MANDATORY!)
- **Backend Droid** - if using API endpoints
- **Frontend Droid** - if changing WebApp links
- **Database Droid** - if querying user data
- **DevOps Droid** - before deploying

**Example scenario:**
```
Bot adds new /quest command

1. Bot → i18n: "Need translations for quest system (20 strings)"
2. i18n: "Working on it... Done! Check translations.py"
3. Bot → Backend: "Using existing /api/quests?"
4. Backend: "Yes, endpoint ready"
5. Bot: *Implements command handler*
6. Bot → Frontend: "Added deep link to quests page"
7. Frontend: "Received, no changes needed"
8. Bot → DevOps: "Ready to deploy"
9. DevOps: *Deploys*
✅ Feature complete!
```

---

### When Database Droid Makes Changes

**Must coordinate with:**
- **Backend Droid** - query changes affect API
- **Frontend Droid** - if data structure changes
- **Bot Droid** - if bot queries affected
- **Security Droid** - RLS policies
- **DevOps Droid** - migration timing

**Example scenario:**
```
Database adds new table for achievements

1. Database → Backend: "Adding achievements table, here's schema"
2. Backend: "Looks good, I'll add API endpoints"
3. Database → Security: "RLS policies needed?"
4. Security: "Yes, users can only see their own"
5. Database: *Creates migration SQL*
6. Database → DevOps: "Ready to apply migration"
7. DevOps: "Applied on production"
8. Database → Backend: "Table live, proceed"
9. Backend: *Adds endpoints*
✅ Feature complete!
```

---

### When i18n Droid Makes Changes

**Must coordinate with:**
- **Frontend Droid** - ensure i18n.js updated
- **Bot Droid** - ensure translations.py updated
- **ALL DROIDS** - verify no hardcoded text

**Example scenario:**
```
i18n adds German language

1. i18n → Frontend: "Adding German, need all text strings"
2. Frontend: "Here's the list from i18n.js"
3. i18n → Bot: "Need bot strings too"
4. Bot: "Here's translations.py structure"
5. i18n: *Translates all 300+ strings to German*
6. i18n → Frontend: "i18n.js updated"
7. i18n → Bot: "translations.py updated"
8. i18n → Frontend: "Need German landing page"
9. Frontend: "Created /de/index.html"
✅ Feature complete!
```

---

### When Security Droid Makes Changes

**Must coordinate with:**
- **Backend Droid** - validation logic
- **Frontend Droid** - input sanitization
- **Database Droid** - RLS policies
- **DevOps Droid** - deployment security
- **ALL DROIDS** - security reviews

**Example scenario:**
```
Security finds XSS vulnerability

1. Security → Frontend: "Found XSS risk in profile page"
2. Frontend: "Where exactly?"
3. Security: "innerHTML used with user input on line 245"
4. Frontend: "Fixed, using textContent now"
5. Security: "Verified, looks good"
6. Security → DevOps: "Deploy this fix ASAP"
7. DevOps: *Deploys hotfix*
✅ Vulnerability patched!
```

---

### When DevOps Droid Makes Changes

**Must coordinate with:**
- **Security Droid** - pre-deployment check
- **Backend Droid** - API deployments
- **Bot Droid** - bot deployments
- **Database Droid** - migrations
- **ALL DROIDS** - deployment notifications

**Example scenario:**
```
DevOps routine deployment

1. DevOps → Security: "Ready to deploy, can you check?"
2. Security: "Scanning... No secrets found, approved"
3. DevOps → Database: "Any migrations to apply?"
4. Database: "Yes, apply migration-2025-12-15.sql first"
5. DevOps: *Applies migration*
6. DevOps → Backend: "Deploying API now"
7. Backend: "Monitoring logs..."
8. DevOps: *Deploys*
9. DevOps → ALL: "Deployment complete, please monitor"
10. ALL DROIDS: "No errors detected"
✅ Deployment successful!
```

---

## 🚨 Emergency Protocols

### Critical Bug Found

```
1. Identify affected component
2. Assign to responsible Droid
3. Security Droid audits if security-related
4. Fix implemented
5. All affected Droids notified
6. DevOps deploys hotfix
7. Post-mortem after fix
```

### Service Down

```
1. DevOps immediately investigates
2. Check logs, error messages
3. Identify root cause
4. Assign to responsible Droid
5. Fix applied
6. DevOps deploys
7. Monitor recovery
```

### Data Corruption

```
1. Database Droid takes lead
2. Assess extent of corruption
3. Backend Droid stops affected endpoints
4. Database restores from backup if needed
5. Security Droid investigates cause
6. All Droids review related code
7. Implement safeguards
```

---

## ✅ Best Practices

### 1. Clear Communication
```
❌ Bad: "Fix this"
✅ Good: "@Backend-Droid: API /balance returning null for user 123, please investigate"
```

### 2. Specify Requirements
```
❌ Bad: "Add feature"
✅ Good: "@Frontend-Droid: Add leaderboard showing top 100 users with rank, name, score. Mobile-first. Needs @i18n-Droid for text."
```

### 3. Confirm Understanding
```
Droid: "Just to confirm: you want pagination with 20 users per page?"
You: "Yes, exactly"
Droid: "Got it, will implement"
```

### 4. Report Progress
```
Droid: "Working on this... 50% done"
Droid: "Complete! Please review"
```

### 5. Document Decisions
```
Droid: "Decided to use localStorage instead of cookies because X, Y, Z"
```

---

## 🎯 Task Assignment Template

When assigning a task, use this format:

```markdown
**Task:** [Brief description]

**Assigned to:** @Droid-Name

**Requirements:**
- Requirement 1
- Requirement 2

**Coordinates with:**
- @OtherDroid1 - reason
- @OtherDroid2 - reason

**Success criteria:**
- Criterion 1
- Criterion 2

**Deadline:** [if applicable]
```

**Example:**
```markdown
**Task:** Add user profile edit functionality

**Assigned to:** @Frontend-Droid

**Requirements:**
- Edit username, avatar, bio
- Form validation
- Save to backend API
- Show success toast

**Coordinates with:**
- @Backend-Droid - API endpoint for saving
- @i18n-Droid - Form labels, error messages
- @Security-Droid - Input validation review

**Success criteria:**
- Works on mobile and desktop
- All text translated
- No security issues
- Smooth UX

**Deadline:** None (when ready)
```

---

## 📊 Droid Interaction Frequency

**High frequency** (almost every task):
- Frontend ↔ i18n (every UI change)
- Frontend ↔ Backend (API integration)
- Backend ↔ Security (validation)
- Backend ↔ Database (queries)
- DevOps ↔ Security (deployments)

**Medium frequency:**
- Frontend ↔ Security (input handling)
- Bot ↔ i18n (bot messages)
- Bot ↔ Backend (API calls)
- Database ↔ Security (RLS)

**Low frequency:**
- Frontend ↔ DevOps (caching)
- Bot ↔ Frontend (deep links)
- i18n ↔ Security (rare)

---

## 🎓 Learning from Each Other

Droids should share knowledge:
- **Frontend** teaches responsive design patterns
- **Backend** teaches API best practices
- **Security** teaches vulnerability prevention
- **Database** teaches query optimization
- **i18n** teaches localization pitfalls
- **Bot** teaches Telegram API tricks
- **DevOps** teaches deployment strategies

---

**Remember:** Collaboration makes the team stronger. Don't work in silos! 🤝

---

**Version:** 1.0  
**Last Updated:** 2025-12-15  
**Maintained by:** Factory Platform
