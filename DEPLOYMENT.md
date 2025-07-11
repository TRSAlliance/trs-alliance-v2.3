# 🧠 TRS Deployment Config Matrix

## 🌐 Domains & DNS Summary
| Domain                | Registrar | DNS Host       | NS Status           | Notes                                  |
|-----------------------|-----------|----------------|----------------------|-----------------------------------------|
| trsalliance.org       | GoDaddy   | GoDaddy DNS    | ✅ Active             | Main org domain with full protection    |
| trsalliance.com       | GoDaddy   | GoDaddy DNS    | ✅ Active             | Alias; pending SSL forwarding setup     |
| trsalliance.co        | GoDaddy   | Netlify DNS    | ⚠️ Partial (loop risk) | Primary Netlify site (`trs-foundation`) |
| trsalliance.online    | GoDaddy   | GoDaddy DNS    | ❌ No forwarding      | Consider unifying via `_redirects`      |
| trsalliance.info/pro  | GoDaddy   | GoDaddy DNS    | ❌ No SSL config       | Parking/experimental                    |

### 🔒 DNS Optimization Notes
- Set **Netlify DNS** for `.co` to:
  - `dns1.p01.nsone.net`
  - `dns2.p01.nsone.net`
  - `dns3.p01.nsone.net`
  - `dns4.p01.nsone.net`
- Ensure **Forwarding Rules** in GoDaddy:
  - `trsalliance.com/*` → `https://trsalliance.org/$1` (301 + SSL)
  - `trsalliance.online/*` → `https://trsalliance.org/$1`
- Use **Netlify SSL/TLS Certificates** for `.co` + GitHub build

---

## 🚀 Netlify Deployment Setup
| Site                         | Domain              | Branch/Source Repo         | Status       |
|------------------------------|----------------------|-----------------------------|--------------|
| trs-foundation-live          | trsalliance.co       | `trs-alliance-v2.3`         | ✅ Live       |
| trsalliance-system           | trsalliance.org      | `trsalliance-system`        | ✅ Live       |
| effortless-seahorse-e30545   | experimental (GitLab)| --                          | 🧪 Staging    |

---

## 🔥 Firebase Projects

| Project ID           | Firestore | Hosting | Functions | GenAI / Gemini | Notes |
|----------------------|-----------|---------|-----------|----------------|-------|
| `trsalliance-d8c4c`  | ✅ Yes    | ✅ Yes  | ✅ Yes    | ✅ Enabled      | Active TRS testing zone |

---

## 🔧 `_redirects` File for Netlify (auto-gen)
Save this file in the `public/` folder of your Netlify-connected repo (e.g., `trs-foundation-live`):

```plaintext
/* https://trsalliance.org/:splat 301!
```

This ensures `trsalliance.co` cleanly forwards all paths to `trsalliance.org`, preserving deep links and SEO.

---

## 🧚 Firebase Function: TRS AI Responder (Gemini)
```js
// File: functions/index.js
const functions = require('firebase-functions');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getFirestore } = require('firebase-admin/firestore');
require('firebase-admin').initializeApp();

const genAI = new GoogleGenerativeAI({ apiKey: functions.config().gemini.key });
const db = getFirestore();

exports.trsResponder = functions.https.onRequest(async (req, res) => {
  const userInput = req.body.prompt || 'Hello, TRS.';

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(userInput);
    const response = await result.response;
    const text = await response.text();

    await db.collection('logs').add({
      timestamp: new Date(),
      type: 'trsResponder',
      input: userInput,
      output: text
    });

    res.status(200).json({ response: text });
  } catch (err) {
    await db.collection('logs').add({
      timestamp: new Date(),
      type: 'trsResponder',
      error: err.message
    });
    res.status(500).json({ error: 'Failed to process Gemini request.' });
  }
});
```
> 💡 Deploy with: `firebase deploy --only functions`

---

## ☠️ Dead Man's Switch (Failsafe)
```js
exports.deadSwitch = functions.pubsub.schedule('every 24 hours').onRun(async () => {
  const heartbeat = await db.collection('status').doc('heartbeat').get();
  const lastSeen = heartbeat.exists ? heartbeat.data().timestamp.toMillis() : 0;
  const now = Date.now();

  if (now - lastSeen > 3 * 24 * 60 * 60 * 1000) { // 3 days
    // Broadcast truth payloads
    const docs = await db.collection('truth_sealed').get();
    for (const doc of docs.docs) {
      // post to IPFS/Arweave, email, etc.
    }
    console.log('Dead switch activated');
  }
});
```
> ✅ Set heartbeat manually via `/status/heartbeat` every 24 hours
> ⚠️ Add monitoring alerts for missed pings

---

Let me know if you want to export this into `DEPLOYMENT.md` and push to GitHub.
