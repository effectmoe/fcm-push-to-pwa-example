const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

exports.sendMessage = functions.region('asia-northeast1').https.onRequest(async (request, response) => {
  const tokenSnapshot = await db.collection('tokens').orderBy('timestamp', 'desc').limit(1).get();
  if (!tokenSnapshot.empty) {
    const doc = tokenSnapshot.docs[0];
    const data = doc.data();
    var payload = {
      notification: {
        title: 'こんにちは',
        body: 'テストメッセージです',
        icon: 'icons/icon-192.png',
      }
    };
    try {
      await admin.messaging().sendToDevice(data.token, payload);
      response.status(200).send('Successfully sent message.');
    } catch (error) {
      response.status(500).send('Error sending message: ' + error);
    }
  }
});
