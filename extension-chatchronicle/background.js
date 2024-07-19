browser.runtime.onInstalled.addListener(() => {
  console.log("ChatGPT History Tracker extension installed.");
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkLoginStatus') {
    console.log('checklogin')
    browser.cookies.get({ url: 'http://localhost', name: 'auth_token' }, (cookie) => {
      if (cookie && cookie.value) {
        console.log('logged in')
        sendResponse({ loggedIn: true });
      } else {
        console.log('not logged in')
        sendResponse({ loggedIn: false });
      }
    });
    return true; // Required to use sendResponse asynchronously
  }
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received data from content script:", message);
    sendDataToBackend(message);
});

const sendDataToBackend = (data) => {
  fetch('http://localhost:3001/store-chat', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ text: data }),
  })
  .then(response => {
    if (!response.ok) {
        console.log(response);
      throw new Error('Failed to store data on the backend');
    }
    console.log('Data stored successfully on the backend');
  })
  .catch(error => {
    console.error('Error storing data on the backend:', error.message);
  });
};

