// Shared Authentication Functions

// Notification System
class NotificationSystem {
    constructor() {
        this.notification = document.getElementById('notification');
        this.notificationMessage = document.getElementById('notificationMessage');
        this.notificationClose = document.getElementById('notificationClose');
        this.init();
    }

    init() {
        this.notificationClose.addEventListener('click', () => this.hide());
    }

    show(message, type = 'success', duration = 5000) {
        // Update notification content
        this.notificationMessage.textContent = message;
        
        // Update icon based on type
        const icon = this.notification.querySelector('.notification-icon');
        switch(type) {
            case 'success':
                icon.className = 'fas fa-check-circle notification-icon';
                this.notification.className = 'notification success show';
                break;
            case 'error':
                icon.className = 'fas fa-exclamation-circle notification-icon';
                this.notification.className = 'notification error show';
                break;
            case 'info':
                icon.className = 'fas fa-info-circle notification-icon';
                this.notification.className = 'notification info show';
                break;
        }

        // Auto-hide after duration
        setTimeout(() => this.hide(), duration);
    }

    hide() {
        this.notification.classList.remove('show');
    }
}

// Loading Overlay
class LoadingOverlay {
    constructor() {
        this.overlay = document.getElementById('loadingOverlay');
        this.loadingText = document.getElementById('loadingText');
    }

    show(message = 'Processing...') {
        this.loadingText.textContent = message;
        this.overlay.classList.add('active');
    }

    hide() {
        this.overlay.classList.remove('active');
    }
}

// Password Strength Calculator
class PasswordStrength {
    constructor() {
        this.levels = [
            { min: 0, max: 30, text: 'Weak', color: '#dc3545' },
            { min: 31, max: 60, text: 'Fair', color: '#fd7e14' },
            { min: 61, max: 80, text: 'Good', color: '#ffc107' },
            { min: 81, max: 100, text: 'Strong', color: '#28a745' }
        ];
    }

    calculate(password) {
        let score = 0;
        
        // Length check (max 25 points)
        if (password.length >= 8) score += 10;
        if (password.length >= 12) score += 10;
        if (password.length >= 16) score += 5;
        
        // Character variety (max 50 points)
        if (/[A-Z]/.test(password)) score += 10;
        if (/[a-z]/.test(password)) score += 10;
        if (/[0-9]/.test(password)) score += 10;
        if (/[^A-Za-z0-9]/.test(password)) score += 20;
        
        // Bonus for mixed case with numbers and symbols (25 points)
        if (/[A-Z]/.test(password) && /[a-z]/.test(password) && 
            /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
            score += 25;
        }

        // Cap at 100
        score = Math.min(score, 100);

        // Find level
        const level = this.levels.find(l => score >= l.min && score <= l.max);
        
        return {
            score,
            text: level ? level.text : 'Weak',
            color: level ? level.color : '#dc3545',
            percentage: score
        };
    }
}

// Form Validation
class FormValidator {
    constructor() {
        this.passwordStrength = new PasswordStrength();
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    }

    validatePassword(password, confirmPassword = null) {
        const strength = this.passwordStrength.calculate(password);
        
        if (password.length < 8) {
            return { valid: false, message: 'Password must be at least 8 characters' };
        }
        
        if (confirmPassword !== null && password !== confirmPassword) {
            return { valid: false, message: 'Passwords do not match' };
        }

        return { 
            valid: strength.score >= 60, 
            message: strength.score >= 60 ? 'Password is strong enough' : 'Password is too weak',
            strength 
        };
    }

    validateName(name) {
        return name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);
    }
}

// Initialize shared components
document.addEventListener('DOMContentLoaded', () => {
    // Initialize notification system
    window.notification = new NotificationSystem();
    
    // Initialize loading overlay
    window.loading = new LoadingOverlay();
    
    // Initialize form validator
    window.validator = new FormValidator();
    
    // Password toggle functionality
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });

    // Real-time password strength indicator
    const registerPassword = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordStrength = document.getElementById('passwordStrength');
    const strengthText = document.getElementById('strengthText');
    const confirmText = document.getElementById('confirmText');

    if (registerPassword) {
        registerPassword.addEventListener('input', function() {
            const strength = window.validator.passwordStrength.calculate(this.value);
            passwordStrength.style.width = `${strength.percentage}%`;
            passwordStrength.style.backgroundColor = strength.color;
            strengthText.textContent = `Password strength: ${strength.text}`;
            strengthText.style.color = strength.color;
            
            // Update confirm password validation
            if (confirmPassword && confirmPassword.value) {
                updateConfirmPasswordValidation();
            }
        });
    }

    if (confirmPassword) {
        confirmPassword.addEventListener('input', updateConfirmPasswordValidation);
    }

    function updateConfirmPasswordValidation() {
        const password = registerPassword ? registerPassword.value : '';
        const confirm = confirmPassword.value;
        
        if (confirm === '') {
            confirmText.textContent = 'Passwords must match';
            confirmText.style.color = 'var(--text-gray)';
        } else if (password === confirm) {
            confirmText.textContent = '✓ Passwords match';
            confirmText.style.color = 'var(--primary-green)';
        } else {
            confirmText.textContent = '✗ Passwords do not match';
            confirmText.style.color = '#dc3545';
        }
    }

    // Real-time email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !window.validator.validateEmail(this.value)) {
                this.style.borderColor = '#dc3545';
                this.parentElement.insertAdjacentHTML('beforeend', 
                    '<div class="input-hint" style="color: #dc3545; font-size: 0.85rem; margin-top: 5px;">Please enter a valid email address</div>');
            } else if (this.value) {
                this.style.borderColor = 'var(--primary-green)';
            }
        });
        
        input.addEventListener('input', function() {
            this.style.borderColor = 'var(--border-color)';
            const hint = this.parentElement.querySelector('.input-hint');
            if (hint) hint.remove();
        });
    });

    // Check if user is already logged in
    function checkAuthStatus() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && window.location.pathname.includes('login.html')) {
            window.location.href = 'index.html';
        }
    }

    checkAuthStatus();
});