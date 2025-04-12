// OpenAI Configuration
const AI_CONFIG = {
    apiKey: "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", // Replace with your actual OpenAI API key
    model: "gpt-3.5-turbo",      // You can use "gpt-4" for better responses if you have access
    maxTokens: 150,              // Increase for longer responses
    temperature: 0.7,            // 0-1: Lower for more deterministic, higher for more creative
    systemPrompt: "You are an AI interviewer named Interview Ninja. You're professional, helpful, and focused on conducting a job interview. Ask relevant follow-up questions based on the candidate's responses. Keep your responses concise and focused on the interview process.",
    debug: true                  // Set to true to see API details in the console
};

// Messages for AI responses (fallback in case API fails)
const messages = [
    "That's a great point. Could you elaborate on your experience with team leadership?",
    "Interesting approach. How would you handle a disagreement with a colleague?",
    "Tell me about a time when you had to adapt to a significant change at work.",
    "How do you prioritize your tasks when facing multiple deadlines?",
    "What's your approach to learning new technologies or skills?",
    "Can you describe a project where you overcame a significant challenge?",
    "How do you handle feedback, both positive and constructive?",
    "What are your long-term career goals?",
    "Tell me about a situation where you had to make a difficult decision.",
    "How do you stay motivated during repetitive or challenging tasks?"
];

// Buzzwords to detect
const buzzwords = [
    "synergy", "circle back", "reach out", "touch base", "bandwidth", "low-hanging fruit",
    "paradigm shift", "think outside the box", "on the same page", "win-win", "leverage",
    "at the end of the day", "game changer", "bring to the table", "move the needle"
];

// Variables
let cameraActive = false;
let micActive = false;

// Store conversation history for context
let conversationHistory = [
    {
        role: "system",
        content: AI_CONFIG.systemPrompt
    },
    {
        role: "assistant",
        content: "Welcome to your interview simulation! I am your AI interviewer today. Could you start by introducing yourself and telling me about your background?"
    }
];

// Initialize on document load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Document loaded, initializing components...');
    initFeatureCards();
    initFlashcardAlbum();
    setupFeatureHover();
    initNinjaProgress();
    loadApiKey();
    
    // Additional direct call to ensure flashcards are initialized
    setTimeout(() => {
        console.log('Running delayed flashcard initialization...');
        initFlashcardAlbum();
    }, 1000);
});

// Scroll to demo section
function scrollToDemo() {
    const demoSection = document.getElementById('demo');
    if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Toggle microphone
function toggleMic() {
    const micButton = document.getElementById('micButton');
    const isMuted = micButton.querySelector('i').classList.contains('fa-microphone-slash');
    
    if (isMuted) {
        micButton.querySelector('i').classList.remove('fa-microphone-slash');
        micButton.querySelector('i').classList.add('fa-microphone');
        
        // Show emotion container
        if (document.getElementById('emotionContainer')) {
            document.getElementById('emotionContainer').style.display = 'block';
        }
    } else {
        micButton.querySelector('i').classList.remove('fa-microphone');
        micButton.querySelector('i').classList.add('fa-microphone-slash');
        
        // Hide emotion container
        if (document.getElementById('emotionContainer')) {
            document.getElementById('emotionContainer').style.display = 'none';
        }
    }
}

// Toggle camera
function toggleCamera() {
    const cameraButton = document.getElementById('cameraButton');
    const isOff = cameraButton.querySelector('i').classList.contains('fa-video-slash');
    
    if (isOff) {
        cameraButton.querySelector('i').classList.remove('fa-video-slash');
        cameraButton.querySelector('i').classList.add('fa-video');
        initEmotionDetection();
    } else {
        cameraButton.querySelector('i').classList.remove('fa-video');
        cameraButton.querySelector('i').classList.add('fa-video-slash');
        stopEmotionDetection();
    }
}

// Handle Enter key press in input field
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Initialize emotion detection (simulation)
function initEmotionDetection() {
    // Show emotion container
    const emotionContainer = document.getElementById('emotionContainer');
    if (emotionContainer) {
        emotionContainer.style.display = 'block';
    }
    
    // Start emotion detection simulation
    startEmotionSimulation();
}

// Simulate emotion detection
function startEmotionSimulation() {
    if (!window.emotionInterval) {
        window.emotionInterval = setInterval(() => {
            const emotion = getRandomEmotion();
            const confidence = Math.floor(60 + Math.random() * 40); // 60-100%
            
            updateEmotionUI(emotion, confidence);
            
            // Update droid expression based on detected emotion
            if (emotion === 'Confident' || emotion === 'Enthusiastic') {
                changeDroidExpression('happy');
            } else if (emotion === 'Nervous') {
                changeDroidExpression('sad');
            } else if (emotion === 'Thoughtful') {
                changeDroidExpression('confused');
            } else {
                changeDroidExpression('neutral');
            }
        }, 3000);
    }
}

// Update emotion UI
function updateEmotionUI(emotion, confidence) {
    const emotionText = document.getElementById('emotionText');
    const emotionBar = document.getElementById('emotionBar');
    
    if (emotionText && emotionBar) {
        emotionText.textContent = emotion;
        emotionBar.style.width = confidence + '%';
        
        // Change bar color based on emotion
        let color = 'var(--ninja-accent)'; // Default
        if (emotion === 'Confident' || emotion === 'Enthusiastic') {
            color = '#00c896'; // Green
        } else if (emotion === 'Neutral' || emotion === 'Focused') {
            color = '#3498db'; // Blue
        } else if (emotion === 'Nervous') {
            color = '#e74c3c'; // Red
        }
        
        emotionBar.style.backgroundColor = color;
    }
}

// Stop emotion detection
function stopEmotionDetection() {
    // Hide emotion container
    const emotionContainer = document.getElementById('emotionContainer');
    if (emotionContainer) {
        emotionContainer.style.display = 'none';
    }
    
    // Stop emotion detection simulation
    if (window.emotionInterval) {
        clearInterval(window.emotionInterval);
        window.emotionInterval = null;
    }
}

// Send message from user input
function sendMessage() {
    const userInput = document.getElementById('userInput').value.trim();
    if (userInput === '') return;
    
    // Add user message to chat
    const chatMessages = document.getElementById('chatMessages');
    const userMessageElement = document.createElement('div');
    userMessageElement.className = 'message user fade-in';
    userMessageElement.innerHTML = `
        <div class="message-sender">
            <i class="fas fa-user"></i> You
        </div>
        <div class="message-text">
            ${userInput}
        </div>
    `;
    chatMessages.appendChild(userMessageElement);
    
    // Add user message to conversation history
    conversationHistory.push({
        role: "user",
        content: userInput
    });
    
    // Clear input field
    document.getElementById('userInput').value = '';
    
    // Scroll to the bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Show typing indicator
    showTypingIndicator();
    
    // Generate AI response with OpenAI
    getAIResponse(userInput);
}

// Get response from OpenAI API with retry support
async function getAIResponse(userInput) {
    const maxRetries = 2;
    let retryCount = 0;
    let retryDelay = 2000; // Start with 2 seconds
    
    async function attemptRequest() {
        try {
            // Check if API key is set
            if (AI_CONFIG.apiKey === "YOUR_API_KEY_HERE" || !AI_CONFIG.apiKey) {
                document.getElementById('apiKeySection').style.display = 'block';
                throw new Error("API Key not configured - Please enter your OpenAI API key");
            }
            
            if (AI_CONFIG.debug) {
                console.log("Sending request to OpenAI API with config:", {
                    model: AI_CONFIG.model,
                    maxTokens: AI_CONFIG.maxTokens,
                    temperature: AI_CONFIG.temperature
                });
                console.log("Conversation history:", conversationHistory);
            }
            
            // Add rate limiting to prevent rate limit errors
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
            
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AI_CONFIG.apiKey}`
                },
                body: JSON.stringify({
                    model: AI_CONFIG.model,
                    messages: conversationHistory,
                    max_tokens: AI_CONFIG.maxTokens,
                    temperature: AI_CONFIG.temperature
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("API Error:", errorData);
                
                // Handle common API errors
                if (response.status === 401) {
                    // Show API key section if authentication failed
                    document.getElementById('apiKeySection').style.display = 'block';
                    throw new Error("Invalid API key - Please enter a valid OpenAI API key");
                } else if (response.status === 429) {
                    if (retryCount < maxRetries) {
                        retryCount++;
                        // Exponential backoff - double the delay each retry
                        retryDelay *= 2;
                        console.log(`Rate limit hit. Retrying in ${retryDelay/1000} seconds... (Attempt ${retryCount} of ${maxRetries})`);
                        displaySystemMessage(`Rate limit hit. Retrying in ${retryDelay/1000} seconds... (Attempt ${retryCount} of ${maxRetries})`);
                        await new Promise(resolve => setTimeout(resolve, retryDelay));
                        return attemptRequest(); // Retry the request
                    } else {
                        throw new Error(`Rate limit exceeded - Please try again later. We tried ${maxRetries} times.`);
                    }
                } else {
                    throw new Error(`API request failed: ${errorData.error?.message || 'Unknown error'}`);
                }
            }
            
            const data = await response.json();
            
            if (AI_CONFIG.debug) {
                console.log("API response:", data);
            }
            
            const aiMessage = data.choices[0].message.content;
            
            // Add AI response to conversation history
            conversationHistory.push({
                role: "assistant",
                content: aiMessage
            });
            
            // Hide typing indicator and show AI response
            hideTypingIndicator();
            displayAIMessage(aiMessage);
            
        } catch (error) {
            console.error("Error calling OpenAI API:", error);
            
            if (AI_CONFIG.debug) {
                // Show error in chat for debugging
                displayErrorMessage("API Error: " + error.message);
            } else {
                // Fallback to random response if API fails
                hideTypingIndicator();
                const randomResponse = messages[Math.floor(Math.random() * messages.length)];
                displayAIMessage(randomResponse);
            }
        }
    }
    
    return attemptRequest();
}

// Display AI message in the chat
function displayAIMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const aiMessageDiv = document.createElement('div');
    aiMessageDiv.className = 'message ai fade-in';
    aiMessageDiv.innerHTML = `
        <div class="message-sender">
            <i class="fas fa-robot"></i> AI Interviewer
        </div>
        <div class="message-text">
            ${message}
        </div>
    `;
    
    chatMessages.appendChild(aiMessageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Also handle emotion detection based on content
    updateEmotionBasedOnResponse(message);
}

// Update emotion UI based on AI response
function updateEmotionBasedOnResponse(response) {
    if (!document.getElementById('emotionContainer') || 
        document.getElementById('emotionContainer').style.display === 'none') {
        return;
    }
    
    let emotion = "Neutral";
    let confidence = 75;
    
    // Simple keyword-based emotion detection
    if (response.includes("great") || response.includes("excellent") || response.includes("impressive")) {
        emotion = "Confident";
        confidence = 90;
    } else if (response.includes("interesting") || response.includes("tell me more")) {
        emotion = "Thoughtful";
        confidence = 85;
    } else if (response.includes("challenge") || response.includes("difficult")) {
        emotion = "Focused";
        confidence = 80;
    }
    
    updateEmotionUI(emotion, confidence);
}

// Initialize feature cards
function initFeatureCards() {
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('slide-up');
        });
        
        card.addEventListener('mouseleave', () => {
            setTimeout(() => {
                card.classList.remove('slide-up');
            }, 300);
        });
    });
}

// Get random emotion for simulation
function getRandomEmotion() {
    const emotions = ['Neutral', 'Confident', 'Thoughtful', 'Enthusiastic', 'Calm', 'Focused', 'Nervous'];
    return emotions[Math.floor(Math.random() * emotions.length)];
}

// Control the background 3D droid expressions
function changeDroidExpression(emotion) {
    // Send a message to the 3D iframe to change the expression
    const splineIframe = document.getElementById('background-droid');
    if (splineIframe && splineIframe.contentWindow) {
        splineIframe.contentWindow.postMessage({
            type: 'changeExpression',
            emotion: emotion
        }, '*');
    }
}

// Initialize the background 3D droid
function initBackgroundDroid() {
    // Check if the element already exists
    let droidContainer = document.getElementById('background-droid-container');
    
    if (!droidContainer) {
        // Create container for the background 3D droid
        droidContainer = document.createElement('div');
        droidContainer.id = 'background-droid-container';
        droidContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
            overflow: hidden;
        `;
        
        // Create iframe to load the Spline scene
        const droidIframe = document.createElement('iframe');
        droidIframe.id = 'background-droid';
        droidIframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            transform: scale(1.2);
            pointer-events: none;
        `;
        droidIframe.src = "https://my.spline.design/untitled-f7wKH7YKen4Vd54K/";
        
        droidContainer.appendChild(droidIframe);
        document.body.insertBefore(droidContainer, document.body.firstChild);
        
        // Listen for messages from the iframe
        window.addEventListener('message', (event) => {
            // Handle any messages from the Spline scene if needed
            console.log('Message from Spline:', event.data);
        });
    }
}

// Show typing indicator
function showTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'flex';
    }
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
    }
}

// Function to setup feature section interactions
function setupFeatureHover() {
    const featuresSection = document.getElementById('features');
    const flashcardAlbum = document.getElementById('flashcardAlbum');
    
    if (featuresSection && flashcardAlbum) {
        // Add mouse move effect for interactive cards
        document.addEventListener('mousemove', (e) => {
            const flashcardContainer = document.getElementById('flashcardContainer');
            if (flashcardContainer) {
                const centerX = window.innerWidth / 2;
                const offsetX = (e.clientX - centerX) / (window.innerWidth / 2);
                
                // Apply subtle tilt based on mouse position
                flashcardContainer.style.transform = `rotateY(${offsetX * 10}deg)`;
            }
        });
        
        // Reset tilt when mouse leaves
        document.addEventListener('mouseleave', () => {
            const flashcardContainer = document.getElementById('flashcardContainer');
            if (flashcardContainer) {
                flashcardContainer.style.transform = '';
            }
        });
    }
}

// Initialize flashcard album
function initFlashcardAlbum() {
    const debugInfo = document.getElementById('debug-info');
    const flashcardAlbum = document.getElementById('flashcardAlbum');
    
    if (debugInfo) {
        debugInfo.textContent = 'Looking for flashcard album...';
    }
    
    if (!flashcardAlbum) {
        if (debugInfo) {
            debugInfo.textContent = 'ERROR: Flashcard album element not found!';
            debugInfo.style.color = 'red';
        }
        console.error('Flashcard album element not found!');
        return;
    }
    
    // Check if the container exists, if not create it
    let flashcardContainer = document.getElementById('flashcardContainer');
    if (!flashcardContainer) {
        if (debugInfo) {
            debugInfo.textContent = 'ERROR: Flashcard container not found!';
            debugInfo.style.color = 'red';
        }
        console.error('Flashcard container element not found!');
        return;
    }
    
    // Update debug info
    if (debugInfo) {
        debugInfo.textContent = 'Found flashcard elements, initializing...';
    }
    
    let centerCardIndex = 0;
    
    // Features data for flashcards
    const features = [
        { title: 'Voice Analysis', description: 'Advanced AI-powered voice recognition and sentiment analysis to understand tone and emotion.' },
        { title: 'Sentiment Detection', description: 'Real-time emotional analysis to gauge how you\'re coming across during the interview.' },
        { title: 'Language Processing', description: 'Natural language processing to identify keywords and improve your communication.' },
        { title: 'Performance Metrics', description: 'Detailed analytics on speech patterns, confidence levels, and overall performance.' },
        { title: 'Video Analysis', description: 'Computer vision to analyze body language, eye contact, and non-verbal cues.' },
        { title: 'Practice History', description: 'Track your progress over time and see how you\'ve improved in different areas.' },
        { title: 'Custom Scenarios', description: 'Practice with industry-specific questions and tailored interview scenarios.' },
        { title: 'Real-time Feedback', description: 'Instant suggestions and tips to improve your responses during practice.' },
        { title: 'Skill Assessment', description: 'Evaluation of technical and soft skills relevant to your target positions.' },
        { title: 'Quick Practice Mode', description: 'Short focused sessions for when you\'re limited on time but want to stay sharp.' }
    ];

    // Clear existing content if any
    flashcardContainer.innerHTML = '';
    
    if (debugInfo) {
        debugInfo.textContent = 'Adding ' + features.length + ' flashcards...';
    }

    // Add flashcards to the container
    features.forEach((feature, index) => {
        const card = document.createElement('div');
        card.className = 'flashcard';
        card.dataset.index = index;
        
        // Create shuriken icon
        const icon = document.createElement('div');
        icon.innerHTML = '<i class="fas fa-star shuriken-spin" style="color: var(--ninja-accent); font-size: 24px; margin-bottom: 15px;"></i>';
        
        const title = document.createElement('h4');
        title.textContent = feature.title;
        
        const description = document.createElement('p');
        description.textContent = feature.description;
        
        card.appendChild(icon);
        card.appendChild(title);
        card.appendChild(description);
        flashcardContainer.appendChild(card);
    });

    // Function to position cards horizontally along the x-axis
    function updateCardPositions() {
        const cards = flashcardContainer.querySelectorAll('.flashcard');
        const totalCards = cards.length;
        
        if (debugInfo) {
            debugInfo.textContent = 'Positioning ' + totalCards + ' cards, center card: ' + centerCardIndex;
        }
        
        cards.forEach((card, index) => {
            // Reset classes
            card.className = 'flashcard';
            
            // Calculate relative position (distance from center card)
            const relPos = (index - centerCardIndex + totalCards) % totalCards;
            
            // Determine position class based on horizontal arrangement
            if (relPos === 0) {
                card.classList.add('card-position-0'); // Center card
            } else if (relPos === 1) {
                card.classList.add('card-position-1'); // First right
            } else if (relPos === 2) {
                card.classList.add('card-position-2'); // Second right
            } else if (relPos === 3) {
                card.classList.add('card-position-3'); // Third right
            } else if (relPos === 4) {
                card.classList.add('card-position-4'); // Fourth right
            } else if (relPos === totalCards - 1) {
                card.classList.add('card-position-5'); // First left
            } else if (relPos === totalCards - 2) {
                card.classList.add('card-position-6'); // Second left
            } else if (relPos === totalCards - 3) {
                card.classList.add('card-position-7'); // Third left
            } else if (relPos === totalCards - 4) {
                card.classList.add('card-position-8'); // Fourth left
            } else {
                card.classList.add('card-hidden'); // Hide other cards
            }
        });
    }

    // Navigate to the next card (right)
    function nextCard() {
        centerCardIndex = (centerCardIndex + 1) % features.length;
        updateCardPositions();
    }
    
    // Navigate to the previous card (left)
    function prevCard() {
        centerCardIndex = (centerCardIndex - 1 + features.length) % features.length;
        updateCardPositions();
    }
    
    // Add event listeners for navigation buttons
    const prevButton = flashcardAlbum.querySelector('.prev-button');
    const nextButton = flashcardAlbum.querySelector('.next-button');
    
    if (prevButton) {
        prevButton.addEventListener('click', prevCard);
        if (debugInfo) debugInfo.textContent += ', prev button OK';
    } else {
        if (debugInfo) debugInfo.textContent += ', ERROR: prev button missing';
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', nextCard);
        if (debugInfo) debugInfo.textContent += ', next button OK';
    } else {
        if (debugInfo) debugInfo.textContent += ', ERROR: next button missing';
    }
    
    // Initialize cards position
    updateCardPositions();
    
    // Auto-rotate cards every 5 seconds
    let autoRotateInterval = setInterval(() => {
        nextCard();
    }, 5000);
    
    if (debugInfo) {
        debugInfo.textContent = 'Flashcard carousel initialized successfully with ' + features.length + ' cards';
        debugInfo.style.color = '#00ff00';
    }
    
    console.log('Flashcard album initialized successfully');
}

// Initialize 3D Image Carousel
function initImageCarousel() {
    // Create carousel elements
    const carousel = document.createElement('div');
    carousel.className = 'image-carousel';
    
    const container = document.createElement('div');
    container.className = 'carousel-container';
    
    const carouselNav = document.createElement('div');
    carouselNav.className = 'carousel-nav';
    carouselNav.innerHTML = `
        <div class="nav-arrow left-arrow"><i class="fas fa-chevron-left"></i></div>
        <div class="nav-arrow right-arrow"><i class="fas fa-chevron-right"></i></div>
    `;
    
    // Create circular indicators
    const indicator = document.createElement('div');
    indicator.className = 'carousel-indicator';
    
    carousel.appendChild(container);
    carousel.appendChild(carouselNav);
    carousel.appendChild(indicator);
    document.body.appendChild(carousel);
    
    // Image data for carousel
    const images = [
        { src: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', title: 'Interview Preparation' },
        { src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', title: 'Public Speaking' },
        { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', title: 'Career Planning' },
        { src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', title: 'Tech Skills' },
        { src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', title: 'Resume Building' },
        { src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', title: 'Team Collaboration' },
        { src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', title: 'Networking' },
        { src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', title: 'Leadership Skills' },
        { src: 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', title: 'Workplace Ethics' }
    ];
    
    // Variables for carousel control
    let centerIndex = 0;
    let isDragging = false;
    let startY = 0;
    let isScrolling = false;
    let autoRotateInterval = null;
    const visiblePositions = 9; // Total visible items (0-8) in the circle
    
    // Add indicator dots
    images.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'indicator-dot';
        dot.addEventListener('click', () => selectItem(index));
        indicator.appendChild(dot);
    });
    
    // Create carousel items
    images.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'carousel-item position-hidden';
        item.dataset.index = index;
        
        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.title;
        
        const shimmer = document.createElement('div');
        shimmer.className = 'shimmer';
        
        const title = document.createElement('div');
        title.className = 'carousel-item-title';
        title.textContent = image.title;
        
        item.appendChild(img);
        item.appendChild(shimmer);
        item.appendChild(title);
        item.addEventListener('click', () => selectItem(index));
        
        container.appendChild(item);
    });
    
    // Function to position carousel items in a circular pattern
    function updateCarouselPositions() {
        const items = container.querySelectorAll('.carousel-item');
        const totalItems = items.length;
        const dots = indicator.querySelectorAll('.indicator-dot');
        
        items.forEach((item, index) => {
            // Reset classes
            item.className = 'carousel-item';
            
            // Calculate relative position (distance from center item)
            const relPos = (index - centerIndex + totalItems) % totalItems;
            
            // Determine item's position in the circular pattern
            if (relPos === 0) {
                // Center item
                item.classList.add('position-0');
            } else if (relPos >= 1 && relPos <= 8) {
                // Items positioned around the circle
                item.classList.add(`position-${relPos}`);
            } else {
                // Hide items not in the visible circle
                item.classList.add('position-hidden');
            }
        });
        
        // Update indicator dots
        dots.forEach((dot, index) => {
            if (index === centerIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Initialize carousel positions
    updateCarouselPositions();
    
    // Function to select a specific item as center
    function selectItem(index) {
        if (index === centerIndex) {
            // If clicking the already centered item, do something special
            // e.g., open a modal or link to a page
            console.log('Center item clicked:', images[index].title);
            return;
        }
        
        // Stop auto-rotation when manually selecting an item
        stopAutoRotation();
        
        centerIndex = index;
        updateCarouselPositions();
    }
    
    // Function to navigate carousel left
    function navigateLeft() {
        stopAutoRotation();
        centerIndex = (centerIndex - 1 + images.length) % images.length;
        updateCarouselPositions();
    }
    
    // Function to navigate carousel right
    function navigateRight() {
        stopAutoRotation();
        centerIndex = (centerIndex + 1) % images.length;
        updateCarouselPositions();
    }
    
    // Start auto-rotation of the carousel
    function startAutoRotation() {
        if (!autoRotateInterval) {
            autoRotateInterval = setInterval(() => {
                centerIndex = (centerIndex + 1) % images.length;
                updateCarouselPositions();
            }, 5000); // Rotate every 5 seconds
        }
    }
    
    // Stop auto-rotation
    function stopAutoRotation() {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
            autoRotateInterval = null;
        }
    }
    
    // Add click event listeners to navigation arrows
    document.querySelector('.left-arrow').addEventListener('click', navigateLeft);
    document.querySelector('.right-arrow').addEventListener('click', navigateRight);
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            navigateLeft();
            e.preventDefault();
        } else if (e.key === 'ArrowRight') {
            navigateRight();
            e.preventDefault();
        }
    });
    
    // Add mouse wheel navigation
    container.addEventListener('wheel', (e) => {
        if (isScrolling) return;
        isScrolling = true;
        
        stopAutoRotation();
        
        if (e.deltaX > 0 || e.deltaY > 0) {
            navigateRight();
        } else {
            navigateLeft();
        }
        
        e.preventDefault();
        
        // Debounce scrolling
        setTimeout(() => {
            isScrolling = false;
        }, 300);
    });
    
    // Add cursor motion tracking for subtle movement
    document.addEventListener('mousemove', (e) => {
        // Calculate container center position
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate mouse distance from center (normalized from -1 to 1)
        const offsetX = (e.clientX - centerX) / (window.innerWidth / 2);
        const offsetY = (e.clientY - centerY) / (window.innerHeight / 2);
        
        // Apply subtle tilt to the container based on mouse position
        container.style.transform = `rotateY(${offsetX * 8}deg) rotateX(${-offsetY * 5}deg)`;
    });
    
    // Add drag functionality
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        startY = e.clientY;
        e.preventDefault();
        
        stopAutoRotation();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaY = e.clientY - startY;
        if (Math.abs(deltaY) > 50) {
            if (deltaY > 0) {
                navigateRight();
            } else {
                navigateLeft();
            }
            startY = e.clientY;
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Add touch support
    let touchStartY = 0;
    
    container.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        stopAutoRotation();
        e.preventDefault();
    }, { passive: false });
    
    container.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const deltaY = touchY - touchStartY;
        
        if (Math.abs(deltaY) > 50) {
            if (deltaY > 0) {
                navigateRight();
            } else {
                navigateLeft();
            }
            touchStartY = touchY;
        }
        e.preventDefault();
    }, { passive: false });
    
    // Start auto-rotation after a short delay
    setTimeout(() => {
        startAutoRotation();
    }, 2000);
    
    // Pause auto-rotation when hovering over carousel
    carousel.addEventListener('mouseenter', stopAutoRotation);
    
    // Resume auto-rotation when mouse leaves the carousel
    carousel.addEventListener('mouseleave', startAutoRotation);
}

// Initialize ninja progress bar
function initNinjaProgress() {
    const ninjaProgress = document.getElementById('ninjaProgress');
    
    if (ninjaProgress) {
        // Add ninja shadow elements
        const shadowCount = 3;
        for (let i = 0; i < shadowCount; i++) {
            const shadow = document.createElement('div');
            shadow.className = 'ninja-shadow';
            shadow.style.opacity = 0.3 - (i * 0.1);
            shadow.style.animationDelay = `${i * 0.15}s`;
            ninjaProgress.appendChild(shadow);
        }
        
        // Update progress bar based on scroll position with smoother animation
        let lastScrollPercent = 0;
        let animationFrame = null;
        
        const updateProgressBar = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            
            // Smooth transition
            const smoothScrollPercent = lastScrollPercent + (scrollPercent - lastScrollPercent) * 0.1;
            ninjaProgress.style.width = smoothScrollPercent + '%';
            
            if (Math.abs(scrollPercent - lastScrollPercent) > 0.1) {
                lastScrollPercent = smoothScrollPercent;
                animationFrame = requestAnimationFrame(updateProgressBar);
            } else {
                lastScrollPercent = scrollPercent;
                ninjaProgress.style.width = scrollPercent + '%';
                animationFrame = null;
            }
        };
        
        window.addEventListener('scroll', () => {
            if (!animationFrame) {
                animationFrame = requestAnimationFrame(updateProgressBar);
            }
        });
        
        // Initial update
        requestAnimationFrame(updateProgressBar);
    }
}

// Display error message in chat (for debug mode)
function displayErrorMessage(message) {
    hideTypingIndicator();
    const chatMessages = document.getElementById('chatMessages');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message system fade-in';
    errorDiv.innerHTML = `
        <div class="message-sender">
            <i class="fas fa-exclamation-triangle"></i> System
        </div>
        <div class="message-text" style="color: #ff5252;">
            ${message}
        </div>
    `;
    
    chatMessages.appendChild(errorDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Save API key to localStorage
function saveApiKey() {
    const apiKeyInput = document.getElementById('apiKeyInput');
    const apiKey = apiKeyInput.value.trim();
    
    if (apiKey === '') {
        displayErrorMessage("Please enter a valid API key");
        return;
    }
    
    // Save to localStorage
    localStorage.setItem('openai_api_key', apiKey);
    
    // Update the API_CONFIG
    AI_CONFIG.apiKey = apiKey;
    
    // Show success message
    displaySystemMessage("API key saved successfully! You can now use the chat.");
    
    // Hide the API key section
    document.getElementById('apiKeySection').style.display = 'none';
    
    console.log('API key saved');
}

// Load API key from localStorage
function loadApiKey() {
    const savedApiKey = localStorage.getItem('openai_api_key');
    
    if (savedApiKey) {
        // Update the API_CONFIG
        AI_CONFIG.apiKey = savedApiKey;
        
        // Hide the API key section
        document.getElementById('apiKeySection').style.display = 'none';
        
        console.log('API key loaded from localStorage');
    } else {
        // Show the API key section
        document.getElementById('apiKeySection').style.display = 'block';
        
        console.log('No API key found in localStorage');
    }
}

// Display system message in chat
function displaySystemMessage(message) {
    hideTypingIndicator();
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message system fade-in';
    messageDiv.innerHTML = `
        <div class="message-sender">
            <i class="fas fa-info-circle"></i> System
        </div>
        <div class="message-text" style="color: var(--ninja-success);">
            ${message}
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
} 