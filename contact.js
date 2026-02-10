// DOM Elements
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
const closeSuccessBtn = document.getElementById('closeSuccess');
const viewMessagesBtn = document.getElementById('viewMessages');
const messagesModal = document.getElementById('messagesModal');
const closeModalBtn = document.getElementById('closeModal');
const messagesList = document.getElementById('messagesList');
const emptyMessage = document.getElementById('emptyMessage');
const clearMessagesBtn = document.getElementById('clearMessages');

// Form Validation and Submission
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Clear previous errors
    clearErrors();
    
    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const contactInfo = document.getElementById('contactInfo').value.trim();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();
    
    let isValid = true;
    
    // Validate Full Name
    if (!fullName) {
        showError('nameError', 'Full name is required');
        isValid = false;
    }
    
    // Validate Contact Info (Email or Phone)
    if (!contactInfo) {
        showError('contactError', 'Email or phone number is required');
        isValid = false;
    } else if (!isValidContact(contactInfo)) {
        showError('contactError', 'Please enter a valid email or phone number');
        isValid = false;
    }
    
    // Validate Subject
    if (!subject) {
        showError('subjectError', 'Please select a subject');
        isValid = false;
    }
    
    // Validate Message
    if (!message) {
        showError('messageError', 'Message is required');
        isValid = false;
    } else if (message.length < 10) {
        showError('messageError', 'Message should be at least 10 characters long');
        isValid = false;
    }
    
    // If form is valid
    if (isValid) {
        // Create message object
        const messageObj = {
            id: Date.now(),
            fullName: fullName,
            contactInfo: contactInfo,
            subject: subject,
            message: message,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleString()
        };
        
        // Save to localStorage
        saveMessageToStorage(messageObj);
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        contactForm.reset();
    }
});

// Contact validation (email or phone)
function isValidContact(contact) {
    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Phone regex (basic international format)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    
    return emailRegex.test(contact) || phoneRegex.test(contact.replace(/\D/g, ''));
}

// Show error message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Add error class to input
    const inputId = elementId.replace('Error', '');
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
        inputElement.classList.add('error-input');
    }
}

// Clear all errors
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
    
    const inputElements = document.querySelectorAll('.form-input');
    inputElements.forEach(element => {
        element.classList.remove('error-input');
    });
}

// Save message to localStorage
function saveMessageToStorage(messageObj) {
    let messages = JSON.parse(localStorage.getItem('safarShareMessages')) || [];
    messages.unshift(messageObj); // Add new message to beginning
    localStorage.setItem('safarShareMessages', JSON.stringify(messages));
}

// Show success message
function showSuccessMessage() {
    successMessage.style.display = 'flex';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

// Close success message
closeSuccessBtn.addEventListener('click', () => {
    successMessage.style.display = 'none';
});

// View stored messages
viewMessagesBtn.addEventListener('click', () => {
    displayStoredMessages();
    messagesModal.style.display = 'flex';
});

// Close modal
closeModalBtn.addEventListener('click', () => {
    messagesModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === messagesModal) {
        messagesModal.style.display = 'none';
    }
});

// Display stored messages
function displayStoredMessages() {
    const messages = JSON.parse(localStorage.getItem('safarShareMessages')) || [];
    
    if (messages.length === 0) {
        messagesList.innerHTML = '';
        emptyMessage.style.display = 'block';
        return;
    }
    
    emptyMessage.style.display = 'none';
    
    // Clear and rebuild messages list
    messagesList.innerHTML = '';
    
    messages.forEach(msg => {
        const messageItem = document.createElement('div');
        messageItem.className = 'message-item';
        
        messageItem.innerHTML = `
            <div class="message-header">
                <span class="message-name">${escapeHTML(msg.fullName)}</span>
                <span class="message-subject">${escapeHTML(msg.subject)}</span>
            </div>
            <div class="message-contact">${escapeHTML(msg.contactInfo)}</div>
            <div class="message-date">${msg.date}</div>
            <div class="message-text">${escapeHTML(msg.message)}</div>
        `;
        
        messagesList.appendChild(messageItem);
    });
}

// Clear all messages
clearMessagesBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all stored messages?')) {
        localStorage.removeItem('safarShareMessages');
        displayStoredMessages();
    }
});

// Helper function to escape HTML (prevent XSS)
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize error input styles
const style = document.createElement('style');
style.textContent = `
    .error-input {
        border-color: #f44336 !important;
    }
    
    .error-message {
        display: none;
    }
`;
document.head.appendChild(style);

// Load messages on page load
window.addEventListener('load', () => {
    // Check if there are any stored messages
    const messages = JSON.parse(localStorage.getItem('safarShareMessages')) || [];
    if (messages.length > 0) {
        console.log(`${messages.length} message(s) stored in localStorage`);
    }
});

// Real-time validation for contact info
document.getElementById('contactInfo').addEventListener('input', function(e) {
    const value = e.target.value.trim();
    const errorElement = document.getElementById('contactError');
    
    if (value && !isValidContact(value)) {
        errorElement.textContent = 'Please enter a valid email or phone number';
        errorElement.style.display = 'block';
        e.target.classList.add('error-input');
    } else if (value) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        e.target.classList.remove('error-input');
    }
});