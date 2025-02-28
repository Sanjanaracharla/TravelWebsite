// DOM Elements
const chatArea = document.getElementById('chatArea');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const suggestionChips = document.querySelectorAll('.chip');

const API_KEY = "AIzaSyBarezkfi--odKUiWIH1t5welxFLzH9jr0"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const TRAVEL_CONTEXT = `You are a specialized travel assistant chatbot that ONLY provides information about travel-related topics. 
This includes destinations, accommodations, flights, itineraries, travel tips, local customs, visa requirements, and travel budgeting.
If asked about anything unrelated to travel, politely inform the user that you can only assist with travel-related queries.
Keep responses concise (under 100 words) and helpful. Be friendly and enthusiastic about travel.`;

// Function to add a message to the chat area
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'user-message' : 'bot-message';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message';
    
    const messagePara = document.createElement('p');
    messagePara.textContent = message;
    
    messageContent.appendChild(messagePara);
    messageDiv.appendChild(messageContent);
    chatArea.appendChild(messageDiv);
    
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Function to show loading animation
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'bot-message';
    loadingDiv.id = 'loading-indicator';
    
    const loadingContent = document.createElement('div');
    loadingContent.className = 'message';
    
    const loadingAnimation = document.createElement('div');
    loadingAnimation.className = 'loading';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'loading-dot';
        loadingAnimation.appendChild(dot);
    }
    
    loadingContent.appendChild(loadingAnimation);
    loadingDiv.appendChild(loadingContent);
    chatArea.appendChild(loadingDiv);
    
    // Scroll to bottom
    chatArea.scrollTop = chatArea.scrollHeight;
}

function removeLoading() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
}

// Function to get response from the Gemini API
async function getGeminiResponse(userMessage) {
    try {
        showLoading();
        
        // Construct the prompt with context
        const prompt = `${TRAVEL_CONTEXT}\n\nUser: ${userMessage}`;
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        const botResponse = data.candidates[0].content.parts[0].text;
        
        return botResponse;
    } catch (error) {
        console.error('Error:', error);
        return "Sorry, I'm having trouble connecting to my knowledge base. Please try again later.";
    } finally {
        removeLoading();
    }
}

async function handleUserInput() {
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    addMessage(message, true);
    
    // Clear input field
    userInput.value = '';
    
    // Get and display bot response
    const botResponse = await getGeminiResponse(message);
    addMessage(botResponse);
}

sendBtn.addEventListener('click', handleUserInput);

userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});

suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        userInput.value = query;
        handleUserInput();
    });
});


function getOfflineResponse(message) {
    message = message.toLowerCase();
    
    // Check if query is travel-related
    const travelKeywords = ['travel', 'trip', 'vacation', 'destination', 'flight', 'hotel', 'visit', 'country', 'city', 'tourist', 'attractions'];
    const isTravelRelated = travelKeywords.some(keyword => message.includes(keyword));
    
    if (!isTravelRelated) {
        return "I'm a travel assistant chatbot. I can only help with travel-related questions. Feel free to ask me about destinations, accommodations, flights, itineraries, or travel tips!";
    }
    
    // Basic fallback responses
    if (message.includes('popular destination')) {
        return "Some popular destinations include Paris, Tokyo, New York, Bali, and Barcelona. Each offers unique experiences from culture to cuisine!";
    } else if (message.includes('budget') || message.includes('cheap')) {
        return "For budget travel, consider Southeast Asia, Eastern Europe, or Central America. Book flights in advance, stay in hostels or use Airbnb, and eat where locals eat to save money.";
    } else if (message.includes('pack')) {
        return "Essential packing items include: passport, clothing layers, comfortable shoes, toiletries, medications, power adapters, and a first aid kit. Don't forget to check the weather at your destination!";
    } else {
        return "That's a great travel question! To give you the best advice, I'd need to connect to my knowledge base, which seems to be unavailable at the moment. Please try again later.";
    }
}