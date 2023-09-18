// vapidKeyは、Firebaseプロジェクトの[プロジェクトの概要]からWebアプリを開き、[Cloud Messaging]タブの[ウェブプッシュ証明書] > [鍵ペア]の値に置き換えます。
const VAPI_KEY = 'BBK34ujS8-aUi0GTrdDqCbW_W0i2A618IEOIHWrcbR4mWp-v8JwESsTgid9eZCaz0iK3nUfBs5zh4dAtinWvJpg';

document.addEventListener('DOMContentLoaded', function () {
  const loadEl = document.querySelector('#load');

  try {
    let app = firebase.app();
    let features = [
      'firestore',
      'messaging',
    ].filter(feature => typeof app[feature] === 'function');
    loadEl.textContent = `Firebase SDK loaded with ${features.join(', ')}`;

    initMessaging();
  } catch (e) {
    console.error(e);
    loadEl.textContent = 'Error loading the Firebase SDK, check the console.';
  }

});

function initMessaging() {
  const messaging = firebase.messaging();

  // デバイス登録トークンを取得し、Firestoreに保存
  messaging.getToken({ vapidKey: VAPI_KEY}).then((currentToken) => {
    if (currentToken) {
      storeToken(currentToken);

    } else {
      // Show permission request.
      alert('No registration token available. Request permission to generate one.');
    }
  }).catch((err) => {
    alert('An error occurred while retrieving token. ' + err);
  });
}

async function storeToken(currentToken) {
  const db = firebase.firestore();
  const docRef = await db.collection("tokens").doc("anonymous_user");
  docRef.set({
    token: currentToken,
    timestamp: new Date()
  });
  console.log("Document save with ID: ", docRef.id);
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then(function (registration) {
      console.log('sw.js registration successful with scope: ', registration.scope);
    }, function (err) {
      alert('sw.js registration failed: ' + err);
    });
}