# 040 — Kitchen Tamer

**AppADay #040 — June 16, 2026**

Upload photos of your refrigerator, freezer, and pantry and Kitchen Tamer generates a realistic meal plan for 3, 5, or 7 days using what you already have on hand — plus a lean shopping list covering only what's missing. Email the plan directly from the app via your own Google Apps Script endpoint, no third-party services required.

[**Live App**](https://augustineiacopelli.github.io/appaday/appaday-040-kitchen-tamer/) | [**Portfolio**](https://augustineiacopelli.github.io/appaday/)

---

## What You Need Before Starting

- An **Anthropic account** with API access (for Claude vision)
- A **Google account** (for the Apps Script email endpoint)
- **Safari on iPhone** if you want to add it to your home screen

All three are free to obtain. The Claude API is pay-per-use but meal plan generation costs fractions of a cent per run.

---

## Part 1 — Get Your Claude API Key

1. Go to [console.anthropic.com](https://console.anthropic.com) and sign in or create an account
2. In the left sidebar, click **API Keys**
3. Click **Create Key**, give it a name (e.g. "Kitchen Tamer"), and copy the key — it starts with `sk-ant-`
4. Save it somewhere safe. You will not be able to see it again after closing the dialog.
5. You will need to add a payment method under **Billing** if you haven't already. There is no free tier for API access, but typical usage is well under $0.10 per session.

---

## Part 2 — Deploy the Email Endpoint (Google Apps Script)

This step is what allows the **Email Plan** button to work — including from an iPhone home screen app where browser pop-ups are blocked. If you only need the Print/PDF option on desktop, you can skip this part and come back to it later.

### 2a. Create the Script

1. Make sure you are signed into the Google account whose Gmail you want to send from
2. Go to [script.google.com](https://script.google.com)
3. Click **New project** in the top left
4. Click the project title ("Untitled project") and rename it to **Kitchen Tamer Mailer**
5. You will see a default `function myFunction() {}` in the editor — **delete all of it**
6. Open `KitchenTamerMailer.gs` from this repo and copy its entire contents
7. Paste it into the Apps Script editor
8. Click the **Save** icon (or press Cmd+S / Ctrl+S)

### 2b. Deploy as a Web App

1. Click **Deploy** in the top right corner, then **New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Fill in the deployment settings:
   - **Description:** Kitchen Tamer Mailer (optional but helpful)
   - **Execute as:** Me *(this means emails send from your Gmail)*
   - **Who has access:** Anyone *(this allows the app to call the endpoint without login)*
4. Click **Deploy**
5. A permissions dialog will appear — click **Authorize access**
6. Choose your Google account from the list
7. You may see a warning that says "Google hasn't verified this app" — click **Advanced**, then **Go to Kitchen Tamer Mailer (unsafe)**. This is expected for personal scripts you write yourself.
8. Click **Allow** to grant Gmail send permission
9. You will now see a **Web app URL** — it looks like `https://script.google.com/macros/s/AKfycb.../exec`. **Copy this URL.**

> **Important:** This URL is your permanent endpoint as long as you do not create a new deployment. If you ever edit the script and want the changes to take effect, you must click Deploy → **New deployment** again, which will generate a new URL. If that happens, update the URL in Kitchen Tamer's Settings.

### 2c. Test the Endpoint (Optional)

Paste your Web App URL directly into a browser address bar and press Enter. You should see:

```json
{"status":"ok","message":"Kitchen Tamer mailer is running."}
```

If you see that, the endpoint is live and working.

---

## Part 3 — Configure Kitchen Tamer

1. Open the app in your browser (or on your iPhone home screen — see Part 4)
2. Tap the **⚙ gear icon** in the top right corner
3. Fill in the Settings fields:

| Field | What to enter |
|---|---|
| **Claude API Key** | Your `sk-ant-...` key from Part 1 |
| **GAS Web App URL** | The `https://script.google.com/macros/s/.../exec` URL from Part 2 |
| **Send to** | The email address where you want plans delivered |
| **Dietary Restrictions & Preferences** | Any restrictions or preferences to apply to every plan — e.g. "gluten-free, no shellfish, prefer low-carb dinners" |

4. Tap **Save Settings**. Everything is stored locally on your device and never sent anywhere except to the Claude API (for the key) and your own GAS endpoint (for the email address and plan content).

---

## Part 4 — Add to iPhone Home Screen (Optional)

This turns Kitchen Tamer into a home screen app that runs full-screen without the Safari browser chrome.

1. Open the app in **Safari** — this will not work in Chrome, Firefox, or any other browser on iPhone
2. Tap the **Share icon** (the box with an arrow pointing up) at the bottom of the screen
3. Scroll down and tap **Add to Home Screen**
4. Edit the name if you like (it defaults to "Kitchen Tamer") and tap **Add**
5. The app icon will appear on your home screen and opens full-screen like a native app

> **Note:** The Web Speech API (microphone input) is not available in home screen mode on iOS. Kitchen Tamer does not use the microphone, so this does not affect anything.

---

## Using the App

1. Tap each panel (**Refrigerator**, **Freezer**, **Pantry**) to photograph that space — or drag and drop images on desktop. You can add multiple photos per space to make sure everything is visible.
2. Use the **+** button that appears after the first photo to add more shots of the same space
3. Tap the small **✕** on any thumbnail to remove it, or **clear all** to reset a panel
4. Choose your planning window: **3 days**, **5 days**, or **7 days**
5. Tap **Generate My Meal Plan** — Claude will analyze the photos and build the plan (takes 10–20 seconds depending on how many images you submitted)
6. Review the **Meal Plan** and **Shopping List**
7. Tap **✉ Email Plan** to send the plan to your saved address, or **Print / PDF** to open a print-ready version in a new tab

---

## Troubleshooting

**"Add your Claude API key in Settings first"**
You have not yet entered an API key, or it was cleared. Open ⚙ Settings and paste your `sk-ant-...` key.

**"API error 401"**
Your API key is invalid or has been revoked. Generate a new one at [console.anthropic.com](https://console.anthropic.com).

**"API error 429"**
You have hit a rate limit. Wait a minute and try again, or check your usage tier at [console.anthropic.com](https://console.anthropic.com).

**"Could not reach the email endpoint. Check your GAS URL in Settings."**
One of three things: the GAS URL in Settings is incorrect or incomplete, the Apps Script deployment was deleted, or you created a new deployment and the URL changed. Re-check the URL in [script.google.com](https://script.google.com) under Deploy → Manage deployments.

**"GAS error: ..."**
The endpoint was reached but something went wrong server-side. The most common cause is that the Gmail permission was not granted during deployment. Go back to Apps Script, click Deploy → Manage deployments, remove the existing deployment, and redeploy from scratch, making sure to click Allow when the permissions dialog appears.

**Email button does nothing / plan not arriving**
Check your spam folder first. If it is not there, open your GAS deployment URL directly in a browser to confirm it returns `{"status":"ok",...}`. If it does not, the deployment is not active.

**Print / PDF opens a blank tab or nothing happens on iPhone**
Safari on iPhone blocks `window.open()` calls that are not triggered directly by a tap. This is the expected behavior in iPhone standalone mode — use the **Email Plan** button instead, which does not require a pop-up.

**Photos are accepted but the plan seems generic or misses obvious ingredients**
Claude is reading the images — clearer, better-lit photos with less clutter yield better results. Try opening the fridge/pantry fully, stepping back slightly, and shooting in good light. Multiple photos of a crowded space help more than one wide shot.

---

## Tech

Single-file vanilla HTML/CSS/JS. No frameworks, no build step, no external dependencies beyond the Claude API and your own GAS endpoint.

- **AI:** Claude Sonnet (`claude-sonnet-4-20250514`) with vision input
- **Email:** Google Apps Script (`GmailApp.sendEmail`) — runs as your own Google account
- **Fonts:** Playfair Display, DM Mono (Google Fonts)
- **Storage:** `localStorage` only — nothing is stored on any server

---

## Part of AppADay

This is app #040 in the [AppADay](https://augustineiacopelli.github.io/appaday/) project — one complete, functional, mobile-friendly web app built and shipped every day.
