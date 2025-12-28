// WhatsApp Bot Logic
class WhatsAppBot {
    constructor() {
        this.messages = [];
        this.session = this.getSession();
        this.initializeBot();
        this.loadMessages();
    }

    getSession() {
        let session = localStorage.getItem('whatsapp_bot_session');
        if (!session) {
            session = {
                id: 'session_' + Date.now(),
                started: new Date().toISOString(),
                conversationCount: 0
            };
            localStorage.setItem('whatsapp_bot_session', JSON.stringify(session));
        } else {
            session = JSON.parse(session);
        }
        return session;
    }

    initializeBot() {
        // Initialize chat interface
        this.toggleBtn = document.getElementById('whatsapp-toggle');
        this.chatContainer = document.querySelector('.whatsapp-chat');
        this.closeBtn = document.querySelector('.close-chat');
        this.sendBtn = document.getElementById('send-btn');
        this.chatInput = document.getElementById('chat-input');
        this.chatMessages = document.getElementById('chat-messages');
        
        // Event listeners
        this.toggleBtn.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.closeChat());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Quick replies
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const msg = e.target.dataset.msg;
                this.addMessage(msg, 'user');
                setTimeout(() => this.handleMessage(msg), 500);
            });
        });

        // Show admin link after 3 clicks on logo
        let clickCount = 0;
        document.querySelector('.logo').addEventListener('click', () => {
            clickCount++;
            if (clickCount === 3) {
                document.getElementById('admin-link').classList.add('show');
                setTimeout(() => {
                    document.getElementById('admin-link').classList.remove('show');
                }, 5000);
            }
        });
    }

    toggleChat() {
        this.chatContainer.classList.toggle('active');
        if (this.chatContainer.classList.contains('active')) {
            this.chatInput.focus();
        }
    }

    closeChat() {
        this.chatContainer.classList.remove('active');
    }

    sendMessage() {
        const message = this.chatInput.value.trim();
        if (message) {
            this.addMessage(message, 'user');
            this.chatInput.value = '';
            setTimeout(() => this.handleMessage(message), 500);
        }
    }

    addMessage(text, sender) {
        const message = {
            id: Date.now(),
            text,
            sender,
            timestamp: new Date().toISOString()
        };

        this.messages.push(message);
        this.saveMessages();

        // Add to UI
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="avatar">${sender === 'bot' ? 'B' : 'U'}</div>
            <div class="content">
                <p>${this.escapeHtml(text)}</p>
                <span class="time">${time}</span>
            </div>
        `;

        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

        // Update conversation count
        if (sender === 'user') {
            this.session.conversationCount++;
            localStorage.setItem('whatsapp_bot_session', JSON.stringify(this.session));
        }
    }

    async handleMessage(userMessage) {
        const response = await this.generateResponse(userMessage.toLowerCase());
        setTimeout(() => {
            this.addMessage(response, 'bot');
        }, 1000);
    }

    async generateResponse(message) {
        // Store conversation for admin dashboard
        this.storeConversation(message);

        // Bot responses based on keywords
        const responses = {
            greetings: [
                "Hello! How can I assist you with BMW today?",
                "Hi there! Ready to explore the world of BMW?",
                "Welcome to BMW Assistant! What can I help you with?"
            ],
            models: [
                "We have several BMW series available:\n• 3 Series - Sporty sedan\n• 5 Series - Executive luxury\n• X5 - Sports Activity Vehicle\n• i8 - Hybrid sports car\n\nWhich one interests you?",
                "BMW offers various models from sporty sedans to luxury SUVs. Would you like details about a specific series?"
            ],
            'test drive': [
                "Great choice! To book a test drive:\n1. Visit our nearest dealership\n2. Call us at (555) 123-4567\n3. Fill out our online form\n\nWhen would you like to schedule?",
                "I can help you book a test drive! What's your preferred location and date?"
            ],
            contact: [
                "Contact our sales team:\n📞 Phone: (555) 123-4567\n📧 Email: sales@bimmerworld.com\n📍 Address: Munich, Germany\n\nWhen would you like us to contact you?",
                "Our sales team is available Monday-Friday, 9AM-6PM. Would you like their direct contact?"
            ],
            price: [
                "Prices vary by model and configuration. For accurate pricing, please visit our dealership or contact sales.",
                "BMW models start from $41,500 for the 3 Series up to $147,500 for the i8. Would you like specific pricing?"
            ],
            features: [
                "BMW features include:\n• M Sport Package\n• Live Cockpit Professional\n• Driving Assistant Professional\n• Panoramic Sunroof\n\nAny specific feature you'd like to know about?",
                "BMW vehicles come with premium features like iDrive 7, ConnectedDrive services, and advanced safety systems."
            ],
            default: [
                "I'm here to help with BMW models, test drives, and more! Could you please rephrase your question?",
                "I'm still learning about BMW. For detailed information, please contact our sales team at (555) 123-4567.",
                "That's an interesting question! Let me connect you with a human agent for better assistance."
            ]
        };

        // Check for keywords
        let category = 'default';
        
        if (message.includes('hello') || message.includes('hi')) {
            category = 'greetings';
        } else if (message.includes('model') || message.includes('series')) {
            category = 'models';
        } else if (message.includes('test drive') || message.includes('drive')) {
            category = 'test drive';
        } else if (message.includes('contact') || message.includes('sales')) {
            category = 'contact';
        } else if (message.includes('price') || message.includes('cost')) {
            category = 'price';
        } else if (message.includes('feature') || message.includes('spec')) {
            category = 'features';
        }

        const categoryResponses = responses[category];
        return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    }

    storeConversation(message) {
        let conversations = JSON.parse(localStorage.getItem('bot_conversations') || '[]');
        
        const conversation = {
            id: Date.now(),
            message,
            response: '',
            timestamp: new Date().toISOString(),
            ip: 'web-client'
        };

        conversations.push(conversation);
        
        // Keep only last 100 conversations
        if (conversations.length > 100) {
            conversations = conversations.slice(-100);
        }
        
        localStorage.setItem('bot_conversations', JSON.stringify(conversations));
    }

    saveMessages() {
        localStorage.setItem('chat_messages', JSON.stringify(this.messages.slice(-50)));
    }

    loadMessages() {
        const saved = localStorage.getItem('chat_messages');
        if (saved) {
            this.messages = JSON.parse(saved);
            this.messages.forEach(msg => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${msg.sender}`;
                const time = new Date(msg.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                
                messageDiv.innerHTML = `
                    <div class="avatar">${msg.sender === 'bot' ? 'B' : 'U'}</div>
                    <div class="content">
                        <p>${this.escapeHtml(msg.text)}</p>
                        <span class="time">${time}</span>
                    </div>
                `;
                this.chatMessages.appendChild(messageDiv);
            });
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Admin functions
    getStatistics() {
        const conversations = JSON.parse(localStorage.getItem('bot_conversations') || '[]');
        const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
        const session = JSON.parse(localStorage.getItem('whatsapp_bot_session') || '{}');
        
        return {
            totalConversations: conversations.length,
            totalMessages: messages.length,
            sessionCount: session.conversationCount || 0,
            popularQuestions: this.getPopularQuestions(conversations)
        };
    }

    getPopularQuestions(conversations) {
        const keywords = [
            'model', 'price', 'test drive', 'contact', 'feature',
            'hello', 'hi', 'help', 'information', 'buy'
        ];

        const counts = {};
        conversations.forEach(conv => {
            keywords.forEach(keyword => {
                if (conv.message.toLowerCase().includes(keyword)) {
                    counts[keyword] = (counts[keyword] || 0) + 1;
                }
            });
        });

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    }

    clearConversations() {
        localStorage.removeItem('bot_conversations');
        localStorage.removeItem('chat_messages');
        this.messages = [];
        this.chatMessages.innerHTML = '';
        this.addMessage("Hello! I'm your BMW Assistant. How can I help you today?", 'bot');
    }
}

// Initialize bot when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.bot = new WhatsAppBot();
});
