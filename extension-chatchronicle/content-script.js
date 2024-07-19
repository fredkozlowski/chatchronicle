browser.runtime.sendMessage({ action: 'checkLoginStatus' }).then(response => {
  console.log(response.loggedIn ? "User is logged in." : "User is not logged in.");
});

let previousContent = "randint"; // To store the previous content state

const checkNodeContent = (node) => {
  console.log("checking node content")
  const currentContent = node.innerText; // Get the current content of the node

  if (currentContent === previousContent) { // Compare with the previous content
    console.log("Content has stopped changing:", currentContent);
    browser.runtime.sendMessage(currentContent).catch(error => console.error(`Error sending message: ${error}`));
  }
  else{
    previousContent = currentContent
  }
};

const monitorNodeContent = (node, interval = 200) => {
  setInterval(() => checkNodeContent(node), interval); // Check the node's content at regular intervals
};

// Initialize the content monitoring
const initializeContentMonitoring = () => {
  const chatContainer = document.querySelector('[role="presentation"]');
  if (chatContainer) {
    const markdownNodes = chatContainer.getElementsByClassName("markdown");
    if (markdownNodes.length > 0) {
      console.log("found markdown node, initting")
      monitorNodeContent(markdownNodes[markdownNodes.length - 1]); // Monitor the first markdown node found
    } else {
      console.error("No markdown nodes found in the chat container. Retrying...");
      setTimeout(initializeContentMonitoring, 1000); // Retry after 1 second
    }
  } else {
    console.error("Chat container not found. Retrying...");
    setTimeout(initializeContentMonitoring, 1000); // Retry after 1 second
  }
};


const chatObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("markdown")) {
        console.log("init monitor");
        initializeContentMonitoring();
      }
    });
  });
});


const chatContainer = document.querySelector('[role="presentation"]');
console.log("init chat container")
if (chatContainer) {
    chatObserver.observe(chatContainer, { childList: true, subtree: true });
  } else {
  console.error("Chat container not found.");
}


