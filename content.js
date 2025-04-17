/**
 * Content script for n8n Save Confirmation extension.
 * Injects into n8n workflow editor pages.
 */

console.log("n8n Save Confirmation script loaded.");

// --- Configuration ---
// Selectors updated based on user-provided HTML examples.

// Selector for the save button
const SAVE_BUTTON_SELECTOR = '[data-test-id="workflow-save-button"] button';

// Selector for identifying any node on the canvas
const NODE_SELECTOR = 'div[data-canvas-node-render-type]';

// Selector for the specific element indicating a node's response data is pinned
const PINNED_RESPONSE_INDICATOR_SELECTOR = '[data-test-id="canvas-node-status-pinned"]';

// Debounce flag to prevent multiple confirmations for one click
let isChecking = false;

/**
 * Checks if any node in the workflow has a pinned custom response.
 * @returns {boolean} True if a node with a pinned response is found, false otherwise.
 */
function checkForPinnedResponseNodes() {
  console.log(`Checking for pinned response nodes using node selector "${NODE_SELECTOR}"...`);
  const nodes = document.querySelectorAll(NODE_SELECTOR);
  if (!nodes || nodes.length === 0) {
    console.warn("No nodes found with selector:", NODE_SELECTOR);
    return false; // No nodes found
  }
  console.log(`Found ${nodes.length} nodes.`);

  for (const node of nodes) {
    // Check if this specific node contains the indicator element
    const indicator = node.querySelector(PINNED_RESPONSE_INDICATOR_SELECTOR);
    if (indicator) {
      // Found the indicator element within this node
      console.log("Found node with pinned response indicator:", node, "Indicator element:", indicator);
      return true; // Found a node with the indicator
    }
  }

  console.log("No nodes with pinned response indicators found using indicator selector:", PINNED_RESPONSE_INDICATOR_SELECTOR);
  return false; // No nodes with the indicator found
}

/**
 * Handles the click event on the save button.
 * @param {Event} event - The click event object.
 */
function handleSaveClick(event) {
  if (isChecking) {
    console.log("Already checking, ignoring duplicate click event.");
    return;
  }

  console.log("Save button clicked (intercepted).");
  isChecking = true; // Set flag

  try {
    if (checkForPinnedResponseNodes()) {
      console.log("Pinned response node detected. Prompting user.");
      // Found a node with a pinned response, show confirmation dialog
      if (!confirm("This workflow contains a node with a pinned custom response. Are you sure you want to save?")) {
        console.log("User cancelled save.");
        // User clicked "Cancel"
        event.preventDefault(); // Prevent the default save action
        event.stopImmediatePropagation(); // Stop other listeners (including n8n's own save handler)
        isChecking = false; // Reset flag
        return false; // Indicate cancellation
      } else {
        console.log("User confirmed save. Allowing default action.");
        // User clicked "OK", allow the save to proceed (do nothing here, default action will occur)
      }
    } else {
      console.log("No pinned response nodes found. Allowing save.");
      // No pinned responses found, allow save to proceed normally
    }
  } catch (error) {
    console.error("Error during save check:", error);
    // Ensure save proceeds if there's an error in our script
  } finally {
    // Reset the flag after a short delay to handle potential rapid clicks
    // or if the default action was prevented.
    setTimeout(() => {
        isChecking = false;
    }, 100);
  }
}

// --- Initialization ---

// Use MutationObserver to wait for the save button to appear in the DOM,
// as n8n might load elements dynamically.
let saveButtonListenerAttached = false; // Flag to prevent attaching multiple listeners
const observer = new MutationObserver((mutationsList, obs) => {
  // Check if listener already attached
  if (saveButtonListenerAttached) {
      // Optimization: If we already found the button and attached the listener,
      // we might not need the observer anymore, unless the button can be removed and re-added.
      // For now, let's keep observing but skip checks if already attached.
      // obs.disconnect(); // Uncomment if the button is guaranteed to stay once added.
      return;
  }

  const saveButton = document.querySelector(SAVE_BUTTON_SELECTOR);
  if (saveButton) {
    console.log("Save button found:", saveButton);
    // Add the event listener in the 'capture' phase to intercept the click
    // before n8n's own handlers might process it.
    saveButton.addEventListener('click', handleSaveClick, true); // Use capture phase
    saveButtonListenerAttached = true; // Set flag

    // Optional: Disconnect observer once the button is found and listener is attached
    // obs.disconnect(); // Consider if the button/UI is stable after initial load
    // console.log("Observer disconnected.");
    console.log("Listener attached to save button.");

  } else {
     // Button not found yet, keep observing...
     // console.log("Save button not found yet with selector:", SAVE_BUTTON_SELECTOR); // Uncomment for verbose debugging
  }
});

// Start observing the document body for changes
observer.observe(document.body, {
  childList: true,
  subtree: true
});

console.log("MutationObserver started, waiting for save button with selector:", SAVE_BUTTON_SELECTOR);

// Optional: Add cleanup if the script is ever unloaded (e.g., during development)
window.addEventListener('unload', () => {
  const saveButton = document.querySelector(SAVE_BUTTON_SELECTOR);
  if (saveButton && saveButtonListenerAttached) {
    saveButton.removeEventListener('click', handleSaveClick, true);
  }
  if (observer) {
    observer.disconnect();
  }
  console.log("n8n Save Confirmation script unloaded, listener removed, observer disconnected.");
});
