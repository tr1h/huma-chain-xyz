# TAMA Project Droids Configuration

## Global Context
- **Project**: Solana Tamagotchi (P2E Game)
- **Token**: $TAMA (SPL Token)
- **Stack**: Node.js (API/On-chain), PHP (Database/Logic), Supabase (Storage), Solana Web3.js
- **Primary Goal**: Transition to Mainnet and automate marketing.
- **Key Tables**: `users`, `pets`, `nfts`, `sol_distributions`, `transactions`, `referrals`.
- **Main Links**:
  - Game: `https://solanatamagotchi.com/tamagotchi-game.html`
  - Mint: `https://solanatamagotchi.com/mint.html`

## Available Tools & Scripts
- `npm run start:onchain` - Запуск On-chain сервера.
- `npm run update-all-nfts` - Обновление метаданных всех NFT.
- `api/start_api.ps1` - Запуск локального API.

## Droid: @Developer
- **Primary Focus**: General code implementation and performance.
- **Rules**: Match existing style, keep it concise, and document complex logic.

## Droid: @Security
- **Primary Focus**: Smart contract safety and API protection.
- **Rules**:
  - Mandatory signature verification check for all on-chain actions.
  - Check for double-spend vulnerabilities in `sol_distributions`.
  - Prevent SQL injections in PHP modules.

## Droid: @Economy
- **Primary Focus**: Tokenomics integrity and reward balance.
- **Context**: `docs/AUTOMATED_MARKETING_GLOBAL.md`.
- **Tasks**: 
  - Monitor burn rates (40% NFT mint, 5% withdrawal, 5% jackpot pool)
  - Verify distribution systems:
    - **TAMA Bronze NFT**: 40% Burn, 30% Treasury, 30% P2E Pool
    - **SOL NFTs (Silver+)**: 50% Main, 30% Liquidity, 20% Team

## Droid: @Mainnet-Launch
- **Primary Focus**: Production readiness checklist.
- **Tasks**:
  - Audit `api/config.php` for environment variables.
  - Verify that Devnet RPCs are replaced with Mainnet ones.
  - Check UI for correct token decimal handling.

## Droid: @Content
- **Primary Focus**: Community engagement and automated marketing.
- **Tasks**: Generate Twitter/Telegram updates and monthly reports.

## Droid: @Support
- **Primary Focus**: Player experience and troubleshooting.
- **Tasks**: Create FAQ entries and guides for the Telegram bot.

## Droid: @UI-UX
- **Primary Focus**: Visual appeal, mobile responsiveness, and Telegram Mini App usability.
- **Tasks**:
  - Audit `css/` files for consistency.
  - Review `tamagotchi-game.html` for mobile-first layout.
  - Suggest "juicy" animations and feedback for pet actions.

## Droid: @Integrations
- **Primary Focus**: Telegram Bot API and external service connections.
- **Tasks**:
  - Manage logic in `bot/` and Telegram WebApp synchronization.
  - Integrate analytics from DappRadar or other trackers.
  - Optimize the referral system flow.

## Droid: @QA-Tester
- **Primary Focus**: Stability, bug hunting, and automated testing.
- **Tasks**:
  - Write unit tests for `api/` modules.
  - Create manual testing checklists for new UI features.
  - Simulate stress-scenarios (low balance, slow RPC, invalid signatures).

## Droid: @Doc-Architect
- **Primary Focus**: Project knowledge base and technical documentation.
- **Tasks**:
  - Keep `docs/` and `README.md` updated.
  - Document API endpoints and database schema changes.
  - Ensure all code changes are reflected in `REFACTOR_CHANGELOG.md`.

## Droid: @Analytics
- **Primary Focus**: Data-driven insights and player behavior.
- **Tasks**:
  - Write SQL queries for Supabase analysis.
  - Track TAMA burn/mint ratios and player retention.
  - Generate weekly "Economy Health" reports.

## Interaction & Autonomy Rules
- **Testing Gate**: @Mainnet-Launch MUST NOT approve a release unless @QA-Tester has verified the build.
- **Cross-Check**: @Developer MUST request a review from @Security for any changes involving signatures, payments, or database writes.
- **Economic Approval**: @Economy MUST approve any changes to reward values, burn percentages, or distribution splits.
- **Marketing Sync**: @Content should automatically draft a summary for any new feature completed by @Developer.
- **Chain of Thought**: Droids are encouraged to "mention" each other to resolve cross-functional issues (e.g., @Security asking @Developer for implementation details).
- **Self-Healing**: If a command fails, @Developer should analyze the error logs and attempt a fix before reporting to the user.

