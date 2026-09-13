# AppNest

AppNest is a production-oriented Windows software discovery and installer platform inspired by the simplicity of Ninite, with an original brand and architecture.

## What is implemented

- Next.js full-stack application
- PostgreSQL + Prisma database
- Database-driven catalog with 48 seeded applications and 45 categories
- Application directory with instant client-side filtering and category filtering
- Application detail pages
- Publisher/source metadata
- Verification-aware installer manifest API
- Multi-application installer builder
- Public shareable bundles
- Personal authenticated dashboard
- Email/password authentication plus optional GitHub and Google OAuth
- Security trust center
- Update feed
- PWA manifest and responsive mobile UI
- Prisma relations for favorites, collections, installed inventory, reviews, notifications, downloads, security checks and installer manifests

## Important download policy

The seed catalog deliberately does **not** invent direct executable URLs, checksums, versions or signatures. Applications point to official publisher pages. A release can only enter an executable installer manifest after an administrator records a verified version, official download URL, SHA-256 checksum and available signature evidence.

This is intentional. Do not turn an unverified publisher page into a fake "Download" link or claim a release is safe without performing the checks.

## Local development

1. Install Node.js 20+ and PostgreSQL.
2. Copy `.env.example` to `.env` and set `DATABASE_URL` and `AUTH_SECRET`.
3. Install dependencies with `npm install`.
4. Create the schema with `npm run db:push`.
5. Seed the catalog with `npm run db:seed`.
6. Start with `npm run dev`.
7. Open `http://localhost:3000`.

For a production migration workflow use `npm run db:migrate` instead of relying on `db:push`.

## Production deployment

Deploy the Next.js application to Vercel, Render, or another Node-compatible platform. Use managed PostgreSQL such as Neon, Supabase, or another PostgreSQL provider. Configure all variables from `.env.example` as platform secrets.

Set `NEXT_PUBLIC_APP_URL` and `AUTH_URL` to the production origin. Configure GitHub and Google OAuth callback URLs through the selected provider and only enable providers for which credentials exist.

## Admin and catalog operations

The Prisma schema includes `Role.ADMIN`, publishers, application versions, security checks, reviews, notifications, installer records and audit-ready metadata. The next operational layer should expose authenticated admin mutations for publishing a version only after source, checksum and signature validation.

Do not give public users write access to catalog verification fields.

## Installer architecture

The web app generates a server-resolved installer manifest, not an arbitrary executable. The Windows client should:

1. Obtain a short-lived manifest token.
2. Validate the manifest signature and expiry.
3. Resolve only server-approved application/version IDs.
4. Confirm Windows version and architecture.
5. Download only the stored verified URL.
6. Verify SHA-256.
7. Verify Authenticode or other recorded signature evidence.
8. Run only the expected installer with publisher-specific arguments from a trusted catalog.
9. Continue after individual failures and produce a final report.

A production Windows client should be built as a separate signed component. This repository does not pretend that a web JSON response is itself a finished Windows installer.

## Security baseline

- HTTP-only Auth.js sessions
- Password hashing with bcrypt
- Zod request validation
- Server-side application resolution
- No client-controlled executable URLs
- Short-lived installer records
- Database constraints and indexes
- Verification status displayed explicitly

Before public launch, add CSRF/rate-limit middleware at the edge, a full admin audit-log model, 2FA for administrators, malware scanning integration, publisher verification workflows, background release polling, object storage for approved metadata, and signed Windows client releases.
