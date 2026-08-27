# Payments & Invoices Dashboard — Setup Guide

Multi-platform payment tracking for Shopify and Amazon channels. Built with Next.js, deployed on Vercel.

## Quick Start

### 1. Google Sheet Setup

Create a **PAYMENTS** tab in your Google Sheet (or use an existing one) with these columns starting at **A4**:

```
Date | Platform | Transaction ID | Amount | Currency | Status | Fees | Net Proceeds | Payment Method | Notes
```

Example data:
```
2024-08-27 | Shopify Main | ORD-12345 | 250.00 | USD | Completed | 15.00 | 235.00 | Credit Card | Test order
2024-08-26 | Amazon US | AMZ-98765 | 120.50 | USD | Pending | 8.50 | 112.00 | Bank Transfer | Marketplace
```

**Platform names** (as they'll appear in the dashboard):
- Shopify Main
- Amazon US
- Amazon UK
- Shopify NL
- Shopify UK
- (Or any custom names you use)

**Status values**: `Completed`, `Pending` (or any custom status)

### 2. Local Setup

```bash
npm install
npm run dev
```

1. Copy `.env.local.example` → `.env.local`
2. Fill in `GOOGLE_SHEET_ID` and `GOOGLE_SHEETS_API_KEY`
3. Visit `http://localhost:3000`

### 3. Get Google Credentials

**GOOGLE_SHEET_ID:**
- Open your Google Sheet
- Copy the ID from the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`

**GOOGLE_SHEETS_API_KEY:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Enable **Google Sheets API** (Search → Enable)
4. Create API Key: Credentials → Create Credentials → API Key
5. Restrict it to **Google Sheets API**
6. Copy the key to `.env.local`

**Important:** Share your Google Sheet as "Anyone with the link can view" so the API key can read it.

---

## Deploy to Vercel

### Option 1: Git-based (Recommended)

1. Push this repo to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/payments-dashboard.git
   git push -u origin main
   ```

2. Go to [Vercel](https://vercel.com)
3. Click "New Project" → Import your GitHub repo
4. Add Environment Variables:
   - `GOOGLE_SHEET_ID` = your_sheet_id
   - `GOOGLE_SHEETS_API_KEY` = your_api_key
5. Deploy

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel
```

Follow the prompts, add env vars at the end.

---

## Dashboard Features

- **KPIs** — Total revenue, fees, net proceeds, avg transaction, fee rate
- **Platform cards** — Revenue breakdown by channel (auto-detects from sheet)
- **Transaction table** — Full history with filters
- **Filters** — By status (pending/completed), platform, date range
- **Auto-refresh** — Updates every 5 minutes
- **Dark mode** — Built-in toggle

---

## Production Checklist

- [ ] Google Sheet shared as "Anyone with the link can view"
- [ ] Environment variables set in Vercel dashboard
- [ ] PAYMENTS tab exists in your sheet, data starts at A4
- [ ] Test with a few transactions first
- [ ] Share the Vercel URL with your team

---

## Troubleshooting

**"Failed to load data"**
- Check that Google Sheet is shared publicly
- Verify API key in Vercel dashboard
- Ensure PAYMENTS tab exists

**"No transactions in this view"**
- Confirm data starts at A4, not A1
- Check column headers match the spec above
- Verify date format (YYYY-MM-DD works best)

**Column headers look wrong**
- Dashboard auto-normalizes headers (spaces → underscores, lowercase)
- Example: "Transaction ID" becomes "transaction_id"

---

Enjoy! 🚀
