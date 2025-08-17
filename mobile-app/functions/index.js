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
