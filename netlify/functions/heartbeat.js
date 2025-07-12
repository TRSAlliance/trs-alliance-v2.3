const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

exports.handler = async function (event, context) {
  try {
    await setDoc(doc(collection(db, 'status'), 'heartbeat'), {
      timestamp: new Date().toISOString(),
      status: 'ALIVE',
      protocol: 'MIRRORBREAK-v1.0.0',
      netlify: true,
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Heartbeat updated' }),
    };
  } catch (error) {
    console.error('❌ Heartbeat update failed:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Heartbeat update failed', details: error.message }),
    };
  }
};
