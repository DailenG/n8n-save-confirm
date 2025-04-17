# Privacy Policy for n8n Save Confirmation Chrome Extension

**Last Updated:** April 17, 2025

Thank you for using the "n8n Save Confirmation" Chrome Extension (the "Extension"). This policy outlines how the Extension handles information.

## 1. Extension Purpose

The sole purpose of this Extension is to enhance your n8n workflow editing experience. It checks if any node in your currently open n8n workflow has its execution data pinned before you save the workflow. If a pinned node is detected, it presents a confirmation dialog (`confirm()`) asking if you are sure you want to save.

## 2. Information Handling

**The Extension does NOT collect, store, transmit, or share any personally identifiable information (PII) or any other user data.**

* **No Data Collection:** We do not collect any personal information, browsing history, workflow content, credentials, or usage statistics.
* **Local Processing Only:** The Extension operates entirely locally within your browser on n8n workflow pages (`*/workflow/*`).
* **DOM Interaction:** To function, the Extension needs to interact with the Document Object Model (DOM) of the n8n workflow page you are viewing. It specifically looks for:
    * The save button element (`[data-test-id="workflow-save-button"] button`).
    * Workflow node elements (`div[data-canvas-node-render-type]`).
    * The indicator for pinned data within a node (`[data-test-id="canvas-node-status-pinned"]`).
    This interaction is solely to identify these elements and trigger the confirmation prompt. The content of your workflow or the data within nodes is not read, stored, or transmitted by the Extension.
* **No Storage:** The Extension does not store any data locally (beyond Chrome's storage of the extension code itself) or remotely.
* **No Transmission:** The Extension does not send any data from your browser to any external server or third party.

## 3. Permissions Justification

The Extension requires the following permissions, solely to enable its core functionality:

* **Host Permission (`*://*/workflow/*`):** Allows the Extension to run its content script (`content.js`) automatically *only* on n8n workflow pages to detect save actions and check for pinned nodes.
* **`scripting` / `activeTab`:** Required by Chrome (Manifest V3) to allow the content script to interact with the page's DOM as described above.

## 4. Third-Party Services

The Extension does not utilize any third-party services, analytics, or APIs.

## 5. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy within the Extension's description or repository. You are advised to review this Privacy Policy periodically for any changes.

## 6. Contact Us

If you have any questions about this Privacy Policy, please contact [Your Name/Contact Email or Link to GitHub Issues].
