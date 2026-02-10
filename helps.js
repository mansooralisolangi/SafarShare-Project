// Help Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // FAQ Toggle Functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all other FAQ items
            document.querySelectorAll('.faq-item.active').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                }
            });
            
            // Toggle current FAQ item
            faqItem.classList.toggle('active', !isActive);
        });
    });

    // Search Functionality
    const helpSearch = document.getElementById('helpSearch');
    const searchButton = document.querySelector('.search-box button');
    
    function performSearch() {
        const searchTerm = helpSearch.value.trim().toLowerCase();
        
        if (searchTerm) {
            // Scroll to FAQ section
            document.getElementById('faq').scrollIntoView({
                behavior: 'smooth'
            });
            
            // Highlight relevant FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                const question = item.querySelector('.faq-question span').textContent.toLowerCase();
                const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
                
                if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                    item.classList.add('active');
                    item.style.backgroundColor = 'var(--green-lighter)';
                    
                    // Scroll to the found item
                    setTimeout(() => {
                        item.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }, 500);
                }
            });
            
            // Show search results message
            showNotification(`Showing results for: "${searchTerm}"`, 'info');
        }
    }
    
    helpSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    searchButton.addEventListener('click', performSearch);

    // Support Form Submission
    const supportForm = document.getElementById('supportForm');
    
    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: this.querySelector('#name').value,
                email: this.querySelector('#email').value,
                category: this.querySelector('#category').value,
                message: this.querySelector('#message').value
            };
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Show success message
                showNotification('Support request submitted successfully! We\'ll contact you within 24 hours.', 'success');
                
                // Reset form
                this.reset();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Chat Widget Functionality
    const chatWidget = document.getElementById('chatWidget');
    const closeChat = document.getElementById('closeChat');
    const startChatBtn = document.querySelector('.start-chat');
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');
    
    // Create chat toggle button
    const chatToggle = document.createElement('div');
    chatToggle.className = 'chat-toggle';
    chatToggle.innerHTML = '<i class="fas fa-comments"></i>';
    document.body.appendChild(chatToggle);
    
    // Toggle chat widget
    function toggleChat() {
        chatWidget.classList.toggle('active');
        chatToggle.style.display = chatWidget.classList.contains('active') ? 'none' : 'flex';
        
        if (chatWidget.classList.contains('active')) {
            chatInput.focus();
        }
    }
    
    // Open chat when start chat button is clicked
    if (startChatBtn) {
        startChatBtn.addEventListener('click', toggleChat);
    }
    
    // Toggle chat with button
    chatToggle.addEventListener('click', toggleChat);
    
    // Close chat
    closeChat.addEventListener('click', toggleChat);
    
    // Send message function
    function sendMessage() {
        const message = chatInput.value.trim();
        
        if (message) {
            // Add user message
            addMessage(message, 'user');
            
            // Clear input
            chatInput.value = '';
            
            // Simulate bot response
            setTimeout(() => {
                const botResponse = getBotResponse(message);
                addMessage(botResponse, 'bot');
            }, 1000);
        }
    }
    
    // Send message on button click
    sendMessageBtn.addEventListener('click', sendMessage);
    
    // Send message on Enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
            </div>
            <span class="message-time">${timeString}</span>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Bot response logic
    function getBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        const responses = {
            greetings: ['Hello!', 'Hi there!', 'Greetings!'],
            help: 'I can help you with: booking rides, payment issues, account problems, or safety concerns. What specifically do you need help with?',
            booking: 'For booking issues, please check our FAQ section or contact our support team at support@safarshare.com',
            payment: 'Payment issues are usually resolved within 24 hours. Please provide your transaction ID for faster assistance.',
            account: 'For account-related issues, please visit the Account Help section in our help center.',
            safety: 'For safety concerns, please call our emergency line immediately: +92 322 5844067',
            default: 'I understand you\'re asking about: "' + userMessage + '". For detailed assistance, please contact our support team or check the relevant section in our help center.'
        };
        
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
        } else if (message.includes('book') || message.includes('ride')) {
            return responses.booking;
        } else if (message.includes('payment') || message.includes('money') || message.includes('refund')) {
            return responses.payment;
        } else if (message.includes('account') || message.includes('login') || message.includes('password')) {
            return responses.account;
        } else if (message.includes('safety') || message.includes('emergency') || message.includes('danger')) {
            return responses.safety;
        } else if (message.includes('help')) {
            return responses.help;
        } else {
            return responses.default;
        }
    }

    // Category Card Click
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Scroll to relevant FAQ category
            const faqSection = document.querySelector(`.faq-category h3`);
            document.getElementById('faq').scrollIntoView({
                behavior: 'smooth'
            });
            
            // Highlight the category
            showNotification(`Showing help articles for: ${this.querySelector('h3').textContent}`, 'info');
        });
    });

    // Article Card Click
    const articleLinks = document.querySelectorAll('.article-link');
    
    articleLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // In a real implementation, this would navigate to the article page
            // For now, show a notification
            const articleTitle = this.parentElement.querySelector('h3').textContent;
            showNotification(`Opening article: "${articleTitle}"`, 'info');
            
            // Simulate article loading
            setTimeout(() => {
                // Here you would load the actual article content
                console.log(`Loading article: ${articleTitle}`);
            }, 500);
        });
    });

    // Notification System
    function showNotification(message, type) {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--pure-white);
                padding: 15px 20px;
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-lg);
                border-left: 4px solid var(--primary-green);
                display: flex;
                align-items: center;
                gap: 15px;
                z-index: 10000;
                animation: slideIn 0.3s ease;
                max-width: 400px;
            }
            
            .notification.success {
                border-left-color: var(--primary-green);
            }
            
            .notification.info {
                border-left-color: var(--green-light);
            }
            
            .notification i {
                font-size: 1.2rem;
                color: var(--primary-green);
            }
            
            .notification span {
                flex: 1;
                color: var(--text-dark);
                font-weight: 500;
            }
            
            .notification-close {
                background: transparent;
                border: none;
                color: var(--text-gray);
                cursor: pointer;
                padding: 5px;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        // Add close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize chat with welcome message
    setTimeout(() => {
        if (!chatWidget.classList.contains('active')) {
            // Show chat toggle after 30 seconds
            setTimeout(() => {
                chatToggle.style.display = 'flex';
            }, 30000);
        }
    }, 1000);
});