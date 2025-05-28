// Popup script for Vinted Favoritos Extension

document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('extensionToggle');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');

    // Load current state
    loadExtensionState();

    // Handle toggle change
    toggle.addEventListener('change', function() {
        const isEnabled = toggle.checked;
        saveExtensionState(isEnabled);
        updateStatus(isEnabled);
        
        // Notify content script about the change
        notifyContentScript(isEnabled);
    });

    /**
     * Load the current extension state from storage
     */
    function loadExtensionState() {
        chrome.storage.local.get(['extensionEnabled'], function(result) {
            const isEnabled = result.extensionEnabled !== false; // Default to true
            toggle.checked = isEnabled;
            updateStatus(isEnabled);
        });
    }

    /**
     * Save the extension state to storage
     */
    function saveExtensionState(isEnabled) {
        chrome.storage.local.set({ extensionEnabled: isEnabled }, function() {
            console.log('Extension state saved:', isEnabled);
        });
    }

    /**
     * Update the status indicator
     */
    function updateStatus(isEnabled) {
        statusDot.className = 'status-dot ' + (isEnabled ? 'active' : 'inactive');
        statusText.textContent = isEnabled ? 'Extensão ativa' : 'Extensão desativada';
        
        // Add a subtle animation
        statusDot.style.transform = 'scale(1.2)';
        setTimeout(() => {
            statusDot.style.transform = 'scale(1)';
        }, 200);
    }

    /**
     * Notify content script about state change
     */
    function notifyContentScript(isEnabled) {
        // Query for active tab
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs[0] && tabs[0].url.includes('vinted.pt')) {
                // Send message to content script
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'toggleExtension',
                    enabled: isEnabled
                }, function(response) {
                    if (chrome.runtime.lastError) {
                        console.log('Content script not found or not ready');
                    }
                });
            }
        });
    }

    // Add smooth transitions for better UX
    document.querySelectorAll('.feature-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(4px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
});
