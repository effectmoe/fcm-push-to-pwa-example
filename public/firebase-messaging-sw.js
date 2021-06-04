
// notificationclickイベントのリスナーは、firebaseのライブラリを読み込む前に登録しないと
// https://github.com/firebase/quickstart-js/issues/102
self.addEventListener('notificationclick', function(event) {
  console.log('On notification click');

  // Data can be attached to the notification so that you
  // can process it in the notificationclick handler.
  console.log('Notification Tag:', event.notification.tag);
  console.log('Notification Data:', event.notification.data);
  event.notification.close();

  const url = 'https://obniz-iot.web.app/';
  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll({
    type: "window",
    includeUncontrolled: true
  }).then(function(clientList) {
    console.log(clientList);
    for (const client of clientList) {
      if (client.url === url && 'focus' in client)
        return client.focus();
    }
    if (clients.openWindow)
      return clients.openWindow(url);
  }));
});

self.addEventListener('push', async (event) => {
  console.log('The client sent me a message.');
  const payload = await event.data.json();
  console.log(payload);
  // https://developer.mozilla.org/ja/docs/Web/Progressive_web_apps/Re-engageable_Notifications_Push
  event.waitUntil(
    self.registration.showNotification(
      payload.notification.title,
      {
        body: payload.notification.body,
        icon: payload.notification.icon,
      }
    )
  );
});