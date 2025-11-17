# Security Policy

## Known Vulnerabilities

### bigint-buffer Buffer Overflow (GHSA-3gc7-fjrx-p6mg)

**Status:** Acknowledged (No fix available)  
**Severity:** High  
**Risk Level:** Low (for our use case)

#### Description
A Buffer Overflow vulnerability exists in `bigint-buffer` package via the `toBigIntLE()` function. This is a transitive dependency through:
- `@solana/web3.js` (v1.x)
- `@solana/spl-token`
- `@metaplex-foundation/js`

#### Why Not Fixed?
1. **No official patch available** - This is a known issue in the Solana ecosystem
2. **Breaking changes** - Updating to @solana/web3.js v2.x breaks @metaplex-foundation/js compatibility
3. **Industry-wide issue** - Affects virtually all Solana projects using v1.x SDK

#### Risk Assessment
**Exploitation Requirements:**
- Sending specially crafted malicious binary data to vulnerable functions
- Direct manipulation of BigInt buffer operations

**Our Use Case:**
- Server-side API only
- No direct processing of untrusted binary data
- All inputs are validated JSON/strings from known sources (Telegram Bot API, Supabase)

**Actual Risk:** **MINIMAL**

#### Mitigation
- ✅ Input validation on all API endpoints
- ✅ No direct user file uploads
- ✅ All blockchain operations use validated parameters
- 📊 Monitoring for updates to @solana/web3.js and @metaplex-foundation/js

#### Action Plan
- Monitor official Solana SDK releases for patches
- Update to @solana/web3.js v2.x when @metaplex-foundation/js supports it
- Track GitHub Advisory: https://github.com/advisories/GHSA-3gc7-fjrx-p6mg

---

## Reporting a Vulnerability

If you discover a security vulnerability, please email: **[your-email]**

**Please do not open public issues for security vulnerabilities.**

---

Last Updated: 2025-11-16


