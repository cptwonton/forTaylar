// Agent Decision Tree JavaScript

// Sample decision tree data - replace with your actual troubleshooting flow
const decisionTree = {
    nodes: {
        'start': {
            question: 'Ask customer: "Does your TV turn on when you press the power button?"',
            guidance: 'Wait for a clear response before proceeding',
            options: [
                { text: 'Yes - TV turns on normally', next: 'tv-on', hotkey: '1' },
                { text: 'No - TV does not turn on', next: 'power-issue', hotkey: '2' },
                { text: 'Partially - Shows some signs of power', next: 'partial-power', hotkey: '3' }
            ]
        },
        'tv-on': {
            question: 'Ask customer: "Do you currently have an active subscription service?"',
            guidance: 'Check their account status if they are unsure',
            options: [
                { text: 'Yes - Active subscription', next: 'signal-check', hotkey: '1' },
                { text: 'No - No subscription', article: 'subscription-setup', hotkey: '2' },
                { text: 'Unsure - Need to check', next: 'account-verify', hotkey: '3' }
            ]
        },
        'power-issue': {
            question: 'Ask customer: "Is the power cord securely connected to both the TV and wall outlet?"',
            guidance: 'Have them physically check both connections',
            options: [
                { text: 'Yes - Connections are secure', next: 'outlet-test', hotkey: '1' },
                { text: 'No - Found loose connection', next: 'reconnect-power', hotkey: '2' },
                { text: 'Unsure - Will check now', next: 'power-check-guide', hotkey: '3' }
            ]
        },
        'signal-check': {
            question: 'Ask customer: "Are you seeing any picture or just a black/blue screen?"',
            guidance: 'Determine if this is a signal or display issue',
            options: [
                { text: 'Black screen - No picture', next: 'no-signal', hotkey: '1' },
                { text: 'Blue screen or "No Signal"', next: 'input-check', hotkey: '2' },
                { text: 'Picture but poor quality', next: 'signal-quality', hotkey: '3' }
            ]
        },
        'outlet-test': {
            question: 'Ask customer: "Can you try plugging another device into the same outlet?"',
            guidance: 'This tests if the outlet is working properly',
            options: [
                { text: 'Other device works - Outlet is fine', article: 'tv-hardware-issue', hotkey: '1' },
                { text: 'Other device does not work', article: 'electrical-issue', hotkey: '2' },
                { text: 'No other device available', next: 'different-outlet', hotkey: '3' }
            ]
        }
    }
};

// Application state
let currentState = {
    currentNode: 'start',
    history: [],
    stepCount: 1
};

// DOM elements
let elements = {};

// Initialize the application
function init() {
    // Cache DOM elements
    elements = {
        questionText: document.getElementById('agent-question'),
        guidanceText: document.getElementById('agent-guidance'),
        optionsGrid: document.getElementById('options-grid'),
        backBtn: document.getElementById('back-btn'),
        repeatBtn: document.getElementById('repeat-btn'),
        startOverBtn: document.getElementById('start-over-btn'),
        stepCounter: document.getElementById('step-counter'),
        statusMessage: document.getElementById('status-message')
    };

    // Set up event listeners
    setupEventListeners();
    
    // Load the first node
    loadNode(currentState.currentNode);
}

// Set up all event listeners
function setupEventListeners() {
    // Navigation buttons
    elements.backBtn.addEventListener('click', goBack);
    elements.repeatBtn.addEventListener('click', repeatQuestion);
    elements.startOverBtn.addEventListener('click', startOver);

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
}

// Handle keyboard shortcuts
function handleKeyboard(event) {
    // Prevent shortcuts when typing in input fields
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
    }

    const key = event.key;
    
    // Number keys for options (1-9)
    if (key >= '1' && key <= '9') {
        const optionIndex = parseInt(key) - 1;
        const optionBtns = document.querySelectorAll('.option-btn');
        if (optionBtns[optionIndex]) {
            optionBtns[optionIndex].click();
        }
        event.preventDefault();
    }
    
    // Spacebar to repeat question
    if (key === ' ') {
        repeatQuestion();
        event.preventDefault();
    }
    
    // Escape to go back
    if (key === 'Escape') {
        goBack();
        event.preventDefault();
    }
    
    // R to start over
    if (key.toLowerCase() === 'r' && event.ctrlKey) {
        startOver();
        event.preventDefault();
    }
}

// Load a specific node
function loadNode(nodeId) {
    const node = decisionTree.nodes[nodeId];
    
    if (!node) {
        showError(`Node "${nodeId}" not found`);
        return;
    }

    // Update current state
    currentState.currentNode = nodeId;
    
    // Update UI
    elements.questionText.textContent = node.question;
    elements.guidanceText.textContent = node.guidance;
    elements.stepCounter.textContent = `Step ${currentState.stepCount}`;
    
    // Update back button state
    elements.backBtn.disabled = currentState.history.length === 0;
    
    // Clear and populate options
    elements.optionsGrid.innerHTML = '';
    
    node.options.forEach((option, index) => {
        const button = createOptionButton(option, index);
        elements.optionsGrid.appendChild(button);
    });

    // Hide any status messages
    hideStatus();
}

// Create an option button
function createOptionButton(option, index) {
    const button = document.createElement('button');
    button.className = 'option-btn';
    
    const textSpan = document.createElement('span');
    textSpan.textContent = option.text;
    
    const hotkeySpan = document.createElement('span');
    hotkeySpan.className = 'hotkey';
    hotkeySpan.textContent = option.hotkey || (index + 1);
    
    button.appendChild(textSpan);
    button.appendChild(hotkeySpan);
    
    // Add click handler
    button.addEventListener('click', () => handleOptionClick(option));
    
    return button;
}

// Handle option click
function handleOptionClick(option) {
    // Add current node to history
    currentState.history.push({
        nodeId: currentState.currentNode,
        stepCount: currentState.stepCount
    });
    
    // Increment step counter
    currentState.stepCount++;
    
    if (option.next) {
        // Navigate to next node
        loadNode(option.next);
    } else if (option.article) {
        // Handle article link (terminal state)
        handleArticleLink(option.article);
    } else {
        showError('Invalid option configuration');
    }
}

// Handle article links (customize for MindTouch)
function handleArticleLink(articleId) {
    showStatus(`Redirecting to article: ${articleId}`, 'success');
    
    // In MindTouch, you would replace this with actual article navigation
    // For now, we'll just show a message
    setTimeout(() => {
        if (confirm(`Would you like to open the article "${articleId}"?\n\nClick OK to simulate opening the article, or Cancel to continue troubleshooting.`)) {
            // Simulate article opening
            showStatus(`Article "${articleId}" opened in new tab`, 'success');
        }
    }, 500);
}

// Go back to previous node
function goBack() {
    if (currentState.history.length === 0) return;
    
    const previousState = currentState.history.pop();
    currentState.stepCount = previousState.stepCount;
    loadNode(previousState.nodeId);
}

// Repeat current question
function repeatQuestion() {
    const currentNode = decisionTree.nodes[currentState.currentNode];
    if (currentNode) {
        showStatus(`Repeat to customer: "${currentNode.question}"`, 'info');
        setTimeout(hideStatus, 3000);
    }
}

// Start over from beginning
function startOver() {
    if (confirm('Are you sure you want to start over? This will reset the entire troubleshooting session.')) {
        currentState = {
            currentNode: 'start',
            history: [],
            stepCount: 1
        };
        loadNode('start');
        showStatus('Started new troubleshooting session', 'success');
        setTimeout(hideStatus, 2000);
    }
}

// Show status message
function showStatus(message, type = 'info') {
    elements.statusMessage.textContent = message;
    elements.statusMessage.className = type === 'error' ? 'error' : '';
    elements.statusMessage.classList.remove('hidden');
}

// Hide status message
function hideStatus() {
    elements.statusMessage.classList.add('hidden');
}

// Show error message
function showError(message) {
    showStatus(message, 'error');
    console.error('Decision Tree Error:', message);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
