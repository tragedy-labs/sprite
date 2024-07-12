// Constants
const CONTENT_CONTAINER_ID = "content";
const PARSER = new DOMParser();

// State
let historyStack = [];
let currentStateIndex = -1;

// Functions
async function fetchDocument(url) {
  try {
    const response = await fetch(url);
    return await response.text();
  } catch (error) {
    throw new Error(`Failed to fetch document: ${url}`, { cause: error });
  }
}

async function parseHtml(html) {
  return PARSER.parseFromString(html, "text/html");
}

async function updateContent(htmlDoc) {
  const title = htmlDoc.querySelector("title").textContent;
  const contentDiv = htmlDoc.getElementById(CONTENT_CONTAINER_ID);
  const target = document.getElementById(CONTENT_CONTAINER_ID);
  target.innerHTML = contentDiv.innerHTML;
  target.scrollTop = 0;
  document.title = title;

  // Reinitialize link click events for newly loaded content
  createLinkClickEvents(target);
}

function pushToHistory(url) {
  historyStack = historyStack.slice(0, currentStateIndex + 1);
  historyStack.push(url);
  currentStateIndex++;
  history.pushState({ index: currentStateIndex }, "", url);
}

async function navigate(url, addToHistory = true) {
  const urlObj = new URL(url, window.location.origin);

  if (urlObj)
    if (urlObj.hash && urlObj.pathname === window.location.pathname) {
      // Handle local page anchor navigation
      const anchor = document.querySelector(urlObj.hash);
      if (anchor) {
        anchor.scrollIntoView();
        addToHistory && pushToHistory(url);
        return;
      }
    }

  // Handle Local Navigation
  const html = await fetchDocument(url);
  const htmlDoc = await parseHtml(html);
  await updateContent(htmlDoc);

  addToHistory && pushToHistory(url);
}

function createLinkClickEvents(root) {
  const links = root.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const url = e.currentTarget.href;
      if (isLocalLink(url)) {
        e.preventDefault();
        navigate(url);
      }
    });
  });
}

function isLocalLink(url) {
  const linkUrl = new URL(url, window.location.origin);
  return linkUrl.origin === window.location.origin;
}

window.addEventListener("popstate", (e) => {
  if (e.state && e.state.index !== undefined) {
    currentStateIndex = e.state.index;
    navigate(historyStack[currentStateIndex], false);
  }
});

// Initialize
function initAjax() {
  createLinkClickEvents(document);
  // Initialize the first state
  historyStack.push(window.location.href);
  currentStateIndex++;
  history.replaceState({ index: currentStateIndex }, "", window.location.href);
}

// Call init
document.addEventListener("DOMContentLoaded", initAjax);
