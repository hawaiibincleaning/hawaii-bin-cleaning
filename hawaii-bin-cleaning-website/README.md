# Hawaii Bin Cleaning Static Website

This is a static HTML/CSS/JS website designed for GitHub + Vercel hosting at:

**https://hawaiibincleaning.com**

The site uses clean URL paths such as `/about`, `/services`, `/faq`, and `/founders-discount`.

## Pages included

- `index.html` → `/` — homepage with brand story, truck-mounted cleaning positioning, launch CTA, and portal area
- `about.html` → `/about` — about page
- `services.html` → `/services` — bin cleaning, add-ons, and customer platform placeholder
- `founders-discount.html` → `/founders-discount` — native launch-list form page for QR codes and door hangers
- `forms.html` → `/forms` — internal forms hub / owner setup links
- `thank-you.html` → `/thank-you` — optional thank-you page
- `faq.html` → `/faq` — FAQ page
- `terms.html` → `/terms` — draft terms of service
- `privacy.html` → `/privacy` — draft privacy policy
- `404.html` — custom page-not-found screen
- `pricing.html` → `/pricing` — hidden draft pricing page
- `blog.html` → `/blog` — hidden draft blog page

## Domain URL structure

The site is configured around the domain:

```txt
https://hawaiibincleaning.com
```

Important public URLs:

```txt
https://hawaiibincleaning.com/
https://hawaiibincleaning.com/about
https://hawaiibincleaning.com/services
https://hawaiibincleaning.com/founders-discount
https://hawaiibincleaning.com/forms
https://hawaiibincleaning.com/faq
https://hawaiibincleaning.com/terms
https://hawaiibincleaning.com/privacy
```

SEO files were updated for the domain:

- Canonical URLs in page heads
- Open Graph URLs/images
- `sitemap.xml`
- `robots.txt`
- `vercel.json` clean URL routing

## Founders Discount / native Google Sheets form setup

The `/founders-discount` page now uses a native HTML form inside the website instead of an embedded Google Form.

Because this is a static GitHub/Vercel website, the browser cannot write directly to a private Google Sheet by itself. The package includes a lightweight Google Apps Script endpoint that receives the website form submission and appends it to your Google Sheet.

### Files added or updated

- `founders-discount.html` — customer-facing native form
- `forms.html` → `/forms` — internal form hub / owner links
- `thank-you.html` → `/thank-you` — optional thank-you page
- `apps-script/google-sheets-web-app.gs` — paste this into Google Apps Script
- `assets/js/site-config.js` — contains the Google Sheet URL and endpoint placeholder
- `assets/js/main.js` — submits the native form to the Apps Script endpoint

### Google Sheet

Responses are configured for this Google Sheet:

```txt
https://docs.google.com/spreadsheets/d/1PyIezZ0dCBFFLdjuHTehYTDU4E-6sOVnyPfHPNwOkK4/edit?resourcekey=&gid=1318085782#gid=1318085782
```

The Apps Script will create/use a sheet tab named:

```txt
Founders Discount Responses
```

### One-time setup to make submissions live

1. Open your Google Sheet.
2. Click **Extensions → Apps Script**.
3. Delete any starter code and paste the full contents of:

```txt
apps-script/google-sheets-web-app.gs
```

4. Click **Save**.
5. Click **Deploy → New deployment**.
6. Select **Web app**.
7. Set **Execute as** to **Me**.
8. Set **Who has access** to **Anyone**.
9. Click **Deploy** and approve permissions.
10. Copy the Web App URL ending in `/exec`.
11. Open `assets/js/site-config.js` and replace:

```js
googleAppsScriptEndpoint: "PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE"
```

with your copied Web App URL.

12. Commit the change to GitHub and let Vercel redeploy.

### Native form fields

The form captures:

- First name and last name
- Email and phone
- Service address
- City/neighborhood and ZIP code
- Property type
- Number of bins
- Desired service frequency
- Trash pickup day
- Bin types: trash, recycling, green waste, other/not sure
- Pressure washing add-ons
- HOA/community name
- Referral/source
- Notes
- SMS consent
- Contact consent

The original Google Form editor link is still stored in `assets/js/site-config.js` for reference, but the customer-facing page is now native HTML and not a Google embed.

## Hidden pages

`pricing.html` and `blog.html` are hidden at launch by default:

- They are not shown in the navigation because `showPricing` and `showBlog` are set to `false` in `assets/js/site-config.js`.
- They include `noindex, nofollow` meta tags.
- They are blocked in `robots.txt` using both clean and `.html` URLs.
- They are excluded from `sitemap.xml`.

To publish either page later:

1. Open `assets/js/site-config.js`.
2. Change `showPricing: false` to `showPricing: true`, or `showBlog: false` to `showBlog: true`.
3. Remove the noindex meta tag from that page.
4. Remove the related Disallow line from `robots.txt`.
5. Add the page to `sitemap.xml`.

## Connect Jobber, Jobatory, or another platform

Open `assets/js/site-config.js` and replace these placeholder values:

```js
bookingUrl: "/founders-discount",
customerPortalUrl: "/services#customer-portal",
quoteUrl: "/founders-discount"
```

Example Jobber-style placeholders:

```js
bookingUrl: "https://yourcompany.getjobber.com/request_work_request/new",
customerPortalUrl: "https://clienthub.getjobber.com/client_hubs/your-id/login"
```

Example Jobatory-style placeholders:

```js
bookingUrl: "https://yourcompany.jobatory.com",
customerPortalUrl: "https://yourcompany.jobatory.com/customer/login"
```

If your platform provides an embed script, paste it in the integration placeholder area in `services.html` or `founders-discount.html`.

## Subtle transitions

Scroll reveal transitions have been added in:

- `assets/css/styles.css`
- `assets/js/main.js`

They animate cards, callouts, form blocks, hero visuals, FAQ items, and split sections as visitors scroll. The animations respect `prefers-reduced-motion` for accessibility.

## Deploy to Vercel

1. Create a new GitHub repository.
2. Upload the full project folder contents.
3. Go to Vercel and import the GitHub repository.
4. Framework preset: **Other** or **Static**.
5. Build command: leave blank.
6. Output directory: leave blank or use `/`.
7. Deploy.
8. Add your custom domain `hawaiibincleaning.com` in Vercel.

## Brand assets

Images live in `assets/images/`:

- `hbc-logo-transparent.png`
- `hbc-wordmark-transparent.png`
- `hbc-mascot-transparent.png`
- `hbc-truck-transparent.png`
- `editable-truck-unit.svg`

The SVG truck is included as an editable code-based asset. The PNG truck is used on the website by default because it matches the provided hangtag/truck style.

## Legal note

The terms and privacy policy are draft starter copy only. Have a qualified professional review before publishing.
