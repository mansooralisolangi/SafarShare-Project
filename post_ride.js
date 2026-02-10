// Post Your Journey JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const form = document.getElementById('postJourneyForm');
    const previewBtn = document.getElementById('previewBtn');
    const previewModal = document.getElementById('previewModal');
    const closeModal = document.querySelector('.close-modal');
    const previewContent = document.getElementById('previewContent');
    const useCurrentLocationBtn = document.getElementById('useCurrentLocation');
    const progressSteps = document.querySelectorAll('.step');
    
    // Use Current Location
    useCurrentLocationBtn.addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                // In a real app, you would reverse geocode to get address
                // For demo, we'll show a success message
                const fromInput = document.getElementById('from');
                fromInput.value = "Current Location";
                showNotification('success', 'Location detected', 'Your current location has been set as starting point.');
            }, function(error) {
                showNotification('error', 'Location Error', 'Unable to get your location. Please enter manually.');
            });
        } else {
            showNotification('error', 'Not Supported', 'Geolocation is not supported by your browser.');
        }
    });
    
    // Form Validation
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate required fields
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#e74c3c';
                field.parentElement.classList.add('error');
            } else {
                field.style.borderColor = '#ddd';
                field.parentElement.classList.remove('error');
            }
        });
        
        if (!isValid) {
            showNotification('error', 'Missing Information', 'Please fill all required fields.');
            return;
        }
        
        // Validate phone number
        const phone = document.getElementById('phone').value;
        if (!/^\+92\s?\d{10}$/.test(phone.replace(/\s/g, ''))) {
            showNotification('error', 'Invalid Phone', 'Please enter a valid Pakistani phone number (+92 XXX XXXXXXX).');
            return;
        }
        
        // Validate date
        const date = new Date(document.getElementById('date').value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (date < today) {
            showNotification('error', 'Invalid Date', 'Journey date cannot be in the past.');
            return;
        }
        
        // If all validations pass
        submitJourney();
    });
    
    // Preview Button
    previewBtn.addEventListener('click', function() {
        generatePreview();
        previewModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close Modal
    closeModal.addEventListener('click', closePreviewModal);
    previewModal.addEventListener('click', function(e) {
        if (e.target === previewModal) {
            closePreviewModal();
        }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && previewModal.classList.contains('active')) {
            closePreviewModal();
        }
    });
    
    // Progress Steps Animation
    function updateProgressSteps() {
        const sections = document.querySelectorAll('.form-section');
        let activeSection = 0;
        
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
                activeSection = index;
            }
        });
        
        progressSteps.forEach((step, index) => {
            if (index <= activeSection) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    // Service Checkbox Toggle
    const serviceCheckboxes = document.querySelectorAll('.service-option input[type="checkbox"]');
    serviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const priceCard = this.id + 'Price';
            const priceInput = document.getElementById(priceCard);
            
            if (this.checked && priceInput) {
                priceInput.disabled = false;
                priceInput.closest('.price-card').style.opacity = '1';
            } else if (priceInput) {
                priceInput.disabled = true;
                priceInput.closest('.price-card').style.opacity = '0.5';
            }
        });
    });
    
    // Initialize service toggles
    serviceCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            checkbox.dispatchEvent(new Event('change'));
        }
    });
    
    // Generate Preview
    function generatePreview() {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Services list
        const services = [];
        if (document.getElementById('carpool').checked) services.push('Carpool');
        if (document.getElementById('parcel').checked) services.push('Parcel Delivery');
        if (document.getElementById('documents').checked) services.push('Document Delivery');
        if (document.getElementById('shopping').checked) services.push('Shopping Delivery');
        
        // Payment method
        const paymentMethod = form.querySelector('input[name="payment"]:checked').value;
        const paymentLabels = {
            'cash': 'Cash',
            'easypaisa': 'EasyPaisa',
            'jazzcash': 'JazzCash',
            'bank': 'Bank Transfer'
        };
        
        // Format date
        const formatDate = (dateString) => {
            if (!dateString) return 'Not specified';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };
        
        const formatTime = (timeString) => {
            if (!timeString) return '';
            return new Date('1970-01-01T' + timeString + 'Z').toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        };
        
        // Build preview HTML
        previewContent.innerHTML = `
            <div class="preview-section">
                <h3><i class="fas fa-info-circle"></i> Basic Information</h3>
                <div class="preview-details">
                    <div class="preview-item">
                        <strong>Name:</strong>
                        <span>${data.name || 'Not specified'}</span>
                    </div>
                    <div class="preview-item">
                        <strong>Phone:</strong>
                        <span>${data.phone || 'Not specified'}</span>
                    </div>
                    <div class="preview-item">
                        <strong>Vehicle:</strong>
                        <span>${document.getElementById('vehicle').options[document.getElementById('vehicle').selectedIndex].text}</span>
                    </div>
                    <div class="preview-item">
                        <strong>Available Seats:</strong>
                        <span>${document.getElementById('seats').value || '0'} seats</span>
                    </div>
                </div>
            </div>
            
            <div class="preview-section">
                <h3><i class="fas fa-route"></i> Journey Details</h3>
                <div class="preview-details">
                    <div class="preview-item">
                        <strong>From:</strong>
                        <span>${data.from || 'Not specified'}</span>
                    </div>
                    <div class="preview-item">
                        <strong>To:</strong>
                        <span>${data.to || 'Not specified'}</span>
                    </div>
                    <div class="preview-item">
                        <strong>Departure:</strong>
                        <span>${formatDate(data.date)} at ${formatTime(data.time)}</span>
                    </div>
                    ${data.returnDate ? `
                    <div class="preview-item">
                        <strong>Return:</strong>
                        <span>${formatDate(data.returnDate)} at ${formatTime(data.returnTime)}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="preview-section">
                <h3><i class="fas fa-concierge-bell"></i> Services Offered</h3>
                <div class="preview-details">
                    <div class="preview-item">
                        <strong>Services:</strong>
                        <span>${services.length > 0 ? services.join(', ') : 'No services selected'}</span>
                    </div>
                </div>
            </div>
            
            <div class="preview-section">
                <h3><i class="fas fa-tags"></i> Pricing</h3>
                <div class="preview-details">
                    ${document.getElementById('carpool').checked ? `
                    <div class="preview-item">
                        <strong>Per Passenger:</strong>
                        <span>Rs ${document.getElementById('passengerPrice').value || '0'}</span>
                    </div>
                    ` : ''}
                    ${document.getElementById('parcel').checked ? `
                    <div class="preview-item">
                        <strong>Small Parcel:</strong>
                        <span>Rs ${document.getElementById('smallParcelPrice').value || '0'}</span>
                    </div>
                    <div class="preview-item">
                        <strong>Medium Parcel:</strong>
                        <span>Rs ${document.getElementById('mediumParcelPrice').value || '0'}</span>
                    </div>
                    ` : ''}
                    ${document.getElementById('documents').checked ? `
                    <div class="preview-item">
                        <strong>Documents:</strong>
                        <span>Rs ${document.getElementById('documentsPrice').value || '0'}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="preview-section">
                <h3><i class="fas fa-edit"></i> Additional Information</h3>
                <div class="preview-details">
                    ${data.description ? `
                    <div class="preview-item">
                        <strong>Description:</strong>
                        <span>${data.description}</span>
                    </div>
                    ` : ''}
                    ${data.rules ? `
                    <div class="preview-item">
                        <strong>Rules:</strong>
                        <span>${data.rules}</span>
                    </div>
                    ` : ''}
                    <div class="preview-item">
                        <strong>Payment Method:</strong>
                        <span>${paymentLabels[paymentMethod] || 'Cash'}</span>
                    </div>
                </div>
            </div>
            
            <div class="preview-actions">
                <button type="button" class="btn btn-outline" id="editPreviewBtn">
                    <i class="fas fa-edit"></i> Edit Details
                </button>
                <button type="button" class="btn btn-primary" id="confirmPostBtn">
                    <i class="fas fa-check-circle"></i> Confirm & Post
                </button>
            </div>
        `;
        
        // Add event listeners to preview buttons
        document.getElementById('editPreviewBtn')?.addEventListener('click', closePreviewModal);
        document.getElementById('confirmPostBtn')?.addEventListener('click', submitJourney);
    }
    
    // Close Preview Modal
    function closePreviewModal() {
        previewModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Submit Journey
    function submitJourney() {
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showNotification('success', 'Journey Posted!', 'Your journey has been successfully posted and is now visible to other users.');
            
            // Reset form
            form.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Close modal if open
            closePreviewModal();
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Show success message with journey ID
            const journeyId = 'JRN' + Math.random().toString(36).substr(2, 9).toUpperCase();
            setTimeout(() => {
                showNotification('info', 'Journey ID: ' + journeyId, 'Share this ID with people interested in your journey.');
            }, 1000);
        }, 2000);
    }
    
    // Notification System
    function showNotification(type, title, message) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            </div>
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Add styles
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 8px;
                    padding: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 10000;
                    max-width: 400px;
                    animation: slideIn 0.3s ease;
                    border-left: 4px solid;
                }
                
                .notification.success {
                    border-color: #2ecc71;
                }
                
                .notification.error {
                    border-color: #e74c3c;
                }
                
                .notification.info {
                    border-color: #3498db;
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
                
                .notification-icon {
                    font-size: 1.5rem;
                }
                
                .notification.success .notification-icon {
                    color: #2ecc71;
                }
                
                .notification.error .notification-icon {
                    color: #e74c3c;
                }
                
                .notification.info .notification-icon {
                    color: #3498db;
                }
                
                .notification-content {
                    flex: 1;
                }
                
                .notification-content h4 {
                    margin: 0 0 0.25rem 0;
                    color: #333;
                }
                
                .notification-content p {
                    margin: 0;
                    color: #666;
                    font-size: 0.9rem;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    color: #999;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // Scroll event for progress steps
    window.addEventListener('scroll', updateProgressSteps);
    
    // Initialize
    updateProgressSteps();
});