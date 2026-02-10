// Shopping Delivery Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initShoppingPage();
    
    // Form step navigation
    setupFormSteps();
    
    // Price calculation
    setupPriceCalculation();
    
    // Shopper selection
    setupShopperSelection();
    
    // Form submission
    setupFormSubmission();
    
    // Filter shoppers
    setupShopperFilters();
    
    // Set default dates
    setDefaultDates();
    
    // Setup popular items click
    setupPopularItems();
});

function initShoppingPage() {
    console.log('Shopping Delivery page initialized');
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('deliveryDate').min = today;
    
    // Load sample shoppers
    loadShoppers();
    
    // Setup form validation
    setupFormValidation();
}

function setDefaultDates() {
    // Set delivery date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    document.getElementById('deliveryDate').value = tomorrowStr;
}

function setupFormSteps() {
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
    // Next step buttons
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.form-step');
            const nextStepId = this.getAttribute('data-next');
            const nextStep = document.getElementById(nextStepId);
            
            // Validate current step before proceeding
            if (validateStep(currentStep.id)) {
                currentStep.classList.remove('active');
                nextStep.classList.add('active');
                
                // Update UI indicators
                updateStepProgress(nextStepId);
                
                // If moving to step 3, calculate price
                if (nextStepId === 'step3') {
                    calculatePrice();
                }
            }
        });
    });
    
    // Previous step buttons
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.form-step');
            const prevStepId = this.getAttribute('data-prev');
            const prevStep = document.getElementById(prevStepId);
            
            currentStep.classList.remove('active');
            prevStep.classList.add('active');
            
            // Update UI indicators
            updateStepProgress(prevStepId);
        });
    });
}

function updateStepProgress(stepId) {
    // Remove active class from all step indicators
    document.querySelectorAll('.step-indicator').forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    // Add active class to current step indicator
    const currentIndicator = document.querySelector(`[data-step="${stepId}"]`);
    if (currentIndicator) {
        currentIndicator.classList.add('active');
    }
    
    // Update progress bar if exists
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        let progress = 0;
        if (stepId === 'step1') progress = 33;
        else if (stepId === 'step2') progress = 66;
        else if (stepId === 'step3') progress = 100;
        
        progressBar.style.width = `${progress}%`;
    }
}

function setupFormValidation() {
    // Real-time validation for item price
    const itemPriceInput = document.getElementById('itemPrice');
    itemPriceInput.addEventListener('blur', function() {
        const price = parseFloat(this.value);
        if (price < 100) {
            highlightError(this, 'Minimum item budget is ₹ 100');
        } else {
            removeError(this);
        }
    });
    
    // Real-time validation for quantity
    const quantityInput = document.getElementById('quantity');
    quantityInput.addEventListener('blur', function() {
        const quantity = parseInt(this.value);
        if (quantity < 1 || quantity > 10) {
            highlightError(this, 'Quantity must be between 1 and 10');
        } else {
            removeError(this);
        }
    });
    
    // Real-time validation for delivery date
    const deliveryDate = document.getElementById('deliveryDate');
    deliveryDate.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            highlightError(this, 'Delivery date cannot be in the past');
        } else {
            removeError(this);
        }
    });
    
    // Real-time validation for item description
    const itemDescription = document.getElementById('itemDescription');
    itemDescription.addEventListener('blur', function() {
        if (this.value.trim().length < 10) {
            highlightError(this, 'Please provide a more detailed description (minimum 10 characters)');
        } else {
            removeError(this);
        }
    });
}

function validateStep(stepId) {
    let isValid = true;
    const step = document.getElementById(stepId);
    
    // Get all required inputs in this step
    const requiredInputs = step.querySelectorAll('[required]');
    
    requiredInputs.forEach(input => {
        // Check if input is empty
        if (!input.value.trim()) {
            isValid = false;
            highlightError(input, 'This field is required');
        } else {
            removeError(input);
        }
    });
    
    return isValid;
}

function highlightError(input, message) {
    // Remove any existing error
    removeError(input);
    
    // Add error class to input
    input.classList.add('error');
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '8px';
    errorDiv.style.fontWeight = '500';
    
    // Insert after input
    input.parentNode.insertBefore(errorDiv, input.nextSibling);
    
    // Add shake animation
    input.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        input.style.animation = '';
    }, 500);
}

function removeError(input) {
    input.classList.remove('error');
    
    // Remove any existing error message
    const errorDiv = input.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function setupPriceCalculation() {
    // Get all inputs that affect price
    const priceInputs = [
        'itemPrice',
        'quantity',
        'itemType',
        'shoppingCity'
    ];
    
    // Add event listeners to all price-affecting inputs
    priceInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', calculatePrice);
        }
    });
}

function calculatePrice() {
    // Base service fee
    let serviceFee = 250;
    
    // Item budget
    const itemPrice = parseFloat(document.getElementById('itemPrice').value) || 0;
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const itemBudget = itemPrice * quantity;
    
    // Traveler commission (5% of item budget, minimum ₹50)
    let travelerCommission = Math.max(itemBudget * 0.05, 50);
    
    // Platform fee (10% of service fee + traveler commission)
    const platformFee = Math.round((serviceFee + travelerCommission) * 0.10);
    
    // Total price
    const totalPrice = serviceFee + itemBudget + travelerCommission + platformFee;
    
    // Update the UI
    document.getElementById('serviceFee').textContent = `₹ ${serviceFee}`;
    document.getElementById('itemBudget').textContent = `₹ ${itemBudget}`;
    document.getElementById('travelerCommission').textContent = `₹ ${Math.round(travelerCommission)}`;
    document.getElementById('platformFee').textContent = `₹ ${platformFee}`;
    document.getElementById('totalPrice').textContent = `₹ ${totalPrice}`;
    
    // Calculate savings (assuming travel cost would be ₹350)
    const travelSavings = 350;
    const savingsBadge = document.querySelector('.savings-badge strong');
    if (savingsBadge) {
        savingsBadge.textContent = `₹ ${travelSavings}`;
    }
    
    return totalPrice;
}

function loadShoppers() {
    // Sample shopper data
    const shoppers = [
        {
            id: 1,
            name: "Fatima Ahmed",
            verified: true,
            rating: 4.9,
            completedOrders: 127,
            expertise: ["Electronics", "Fashion", "Groceries"],
            city: "Karachi",
            responseTime: "1-2 hours",
            successRate: "98%",
            price: 300,
            avatar: "FA",
            bio: "Expert shopper with 3 years experience. Specializes in electronics and fashion."
        },
        {
            id: 2,
            name: "Ali Raza",
            verified: true,
            rating: 4.7,
            completedOrders: 89,
            expertise: ["Books", "Stationery", "Gifts"],
            city: "Lahore",
            responseTime: "2-3 hours",
            successRate: "95%",
            price: 280,
            avatar: "AR",
            bio: "University student with excellent knowledge of book markets and gifts."
        },
        {
            id: 3,
            name: "Sara Khan",
            verified: true,
            rating: 4.8,
            completedOrders: 156,
            expertise: ["Fashion", "Accessories", "Home Decor"],
            city: "Karachi",
            responseTime: "1 hour",
            successRate: "99%",
            price: 320,
            avatar: "SK",
            bio: "Fashion enthusiast with connections to best clothing markets."
        },
        {
            id: 4,
            name: "Bilal Shah",
            verified: false,
            rating: 4.3,
            completedOrders: 45,
            expertise: ["Electronics", "Gaming", "Mobile"],
            city: "Islamabad",
            responseTime: "3-4 hours",
            successRate: "92%",
            price: 250,
            avatar: "BS",
            bio: "Tech expert who knows all the best deals in electronics markets."
        },
        {
            id: 5,
            name: "Zainab Malik",
            verified: true,
            rating: 4.9,
            completedOrders: 203,
            expertise: ["Groceries", "Medicines", "Home Items"],
            city: "Hyderabad",
            responseTime: "2 hours",
            successRate: "97%",
            price: 270,
            avatar: "ZM",
            bio: "Reliable shopper for daily needs, groceries, and medical supplies."
        }
    ];
    
    const shoppersList = document.getElementById('shoppersList');
    const noShoppers = document.getElementById('noShoppers');
    
    if (shoppers.length === 0) {
        shoppersList.style.display = 'none';
        noShoppers.style.display = 'block';
        return;
    }
    
    shoppersList.innerHTML = '';
    noShoppers.style.display = 'none';
    
    shoppers.forEach(shopper => {
        const shopperCard = createShopperCard(shopper);
        shoppersList.appendChild(shopperCard);
    });
}

function createShopperCard(shopper) {
    const card = document.createElement('div');
    card.className = 'shopper-card';
    card.dataset.id = shopper.id;
    card.dataset.city = shopper.city.toLowerCase();
    card.dataset.rating = shopper.rating;
    card.dataset.price = shopper.price;
    
    // Create expertise tags HTML
    const expertiseTags = shopper.expertise.map(tag => 
        `<span class="expertise-tag">${tag}</span>`
    ).join('');
    
    card.innerHTML = `
        <div class="shopper-header">
            <div class="shopper-info">
                <div class="shopper-avatar ${shopper.verified ? 'verified' : ''}">
                    ${shopper.avatar}
                </div>
                <div class="shopper-details">
                    <h4>${shopper.name} ${shopper.verified ? '<i class="fas fa-check-circle" style="color: #3b82f6; font-size: 0.9rem;"></i>' : ''}</h4>
                    <div class="shopper-rating">
                        <i class="fas fa-star"></i>
                        <span>${shopper.rating} (${shopper.completedOrders} orders)</span>
                    </div>
                    <div class="shopper-expertise">
                        ${expertiseTags}
                    </div>
                </div>
            </div>
        </div>
        
        <div class="shopper-stats">
            <div class="stat-item">
                <span class="stat-value">${shopper.responseTime}</span>
                <span class="stat-label">Avg. Response</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${shopper.successRate}</span>
                <span class="stat-label">Success Rate</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${shopper.city}</span>
                <span class="stat-label">Location</span>
            </div>
        </div>
        
        <div class="shopper-action">
            <div>
                <span class="shopper-price">₹ ${shopper.price}</span>
                <small>service fee</small>
            </div>
            <button class="btn btn-outline select-shopper" data-id="${shopper.id}">
                <i class="fas fa-check-circle"></i> Select Shopper
            </button>
        </div>
    `;
    
    return card;
}

function setupShopperSelection() {
    // Delegate event listener to shoppers list
    document.getElementById('shoppersList').addEventListener('click', function(e) {
        const shopperCard = e.target.closest('.shopper-card');
        if (shopperCard) {
            const shopperId = shopperCard.dataset.id;
            selectShopper(shopperId);
        }
    });
}

function selectShopper(shopperId) {
    // Remove selected class from all shoppers
    document.querySelectorAll('.shopper-card').forEach(card => {
        card.classList.remove('selected');
        const button = card.querySelector('.select-shopper');
        if (button) {
            button.textContent = 'Select Shopper';
            button.innerHTML = '<i class="fas fa-check-circle"></i> Select Shopper';
            button.classList.remove('btn-primary');
            button.classList.add('btn-outline');
        }
    });
    
    // Add selected class to clicked shopper
    const selectedCard = document.querySelector(`.shopper-card[data-id="${shopperId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        
        // Update button text
        const button = selectedCard.querySelector('.select-shopper');
        button.textContent = 'Selected';
        button.innerHTML = '<i class="fas fa-check-circle"></i> Selected';
        button.classList.remove('btn-outline');
        button.classList.add('btn-primary');
        
        // Store selected shopper in form data
        document.getElementById('shoppingForm').dataset.selectedShopper = shopperId;
        document.getElementById('shoppingForm').dataset.selectedShopperPrice = selectedCard.dataset.price;
        
        // Show confirmation message
        const shopperName = selectedCard.querySelector('h4').textContent.trim();
        showNotification(`Shopper selected: ${shopperName}`, 'success');
    }
}

function setupFormSubmission() {
    const form = document.getElementById('shoppingForm');
    const successModal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');
    const trackOrder = document.getElementById('trackOrder');
    const postAnywayBtn = document.getElementById('postAnyway');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all steps
        let allValid = true;
        ['step1', 'step2', 'step3'].forEach(stepId => {
            if (!validateStep(stepId)) {
                allValid = false;
                // Show the step with errors
                document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
                document.getElementById(stepId).classList.add('active');
                updateStepProgress(stepId);
            }
        });
        
        if (!allValid) {
            showNotification('Please fix all errors before submitting', 'error');
            return;
        }
        
        // Get payment method
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        
        // Check terms agreement
        if (!document.getElementById('terms').checked) {
            showNotification('You must agree to the terms and conditions', 'error');
            return;
        }
        
        // Get form data
        const formData = {
            itemType: document.getElementById('itemType').value,
            itemDescription: document.getElementById('itemDescription').value,
            itemPrice: document.getElementById('itemPrice').value,
            quantity: document.getElementById('quantity').value,
            storePreference: document.getElementById('storePreference').value,
            shoppingCity: document.getElementById('shoppingCity').value,
            deliveryAddress: document.getElementById('deliveryAddress').value,
            deliveryDate: document.getElementById('deliveryDate').value,
            timePreference: document.getElementById('timePreference').value,
            brandSpecific: document.getElementById('brandSpecific').checked,
            originalPackaging: document.getElementById('originalPackaging').checked,
            billRequired: document.getElementById('billRequired').checked,
            paymentMethod: paymentMethod,
            specialInstructions: document.getElementById('specialInstructions').value,
            selectedShopper: form.dataset.selectedShopper || 'not-selected',
            totalPrice: calculatePrice(),
            timestamp: new Date().toISOString()
        };
        
        // In a real app, you would send this data to your server
        console.log('Shopping request submission:', formData);
        
        // Save to localStorage for demo purposes
        const requests = JSON.parse(localStorage.getItem('shoppingRequests') || '[]');
        const requestId = 'SS-' + Date.now().toString().slice(-8);
        formData.requestId = requestId;
        formData.status = 'pending';
        requests.push(formData);
        localStorage.setItem('shoppingRequests', JSON.stringify(requests));
        
        // Generate a random request ID for display
        document.getElementById('requestId').textContent = requestId;
        
        // Show success modal
        successModal.classList.add('active');
        
        // Reset form after 5 seconds
        setTimeout(() => {
            resetForm();
        }, 5000);
    });
    
    // Close modal
    closeModal.addEventListener('click', function() {
        successModal.classList.remove('active');
        resetForm();
    });
    
    // Track order button
    trackOrder.addEventListener('click', function() {
        const requestId = document.getElementById('requestId').textContent;
        successModal.classList.remove('active');
        showNotification(`Redirecting to track order: ${requestId}`, 'info');
        
        // Save tracking info
        localStorage.setItem('lastShoppingRequestId', requestId);
        
        // In real app: window.location.href = `tracking.html?id=${requestId}`;
        // For demo, just show message
        setTimeout(() => {
            alert(`Tracking page would open for order: ${requestId}\n\nIn a real application, this would redirect to a tracking page.`);
        }, 500);
    });
    
    // Post anyway button
    postAnywayBtn.addEventListener('click', function() {
        // Show step 3 and calculate price
        document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
        document.getElementById('step3').classList.add('active');
        updateStepProgress('step3');
        calculatePrice();
        
        showNotification('Request posted! Shoppers will bid on your order.', 'success');
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === successModal) {
            successModal.classList.remove('active');
            resetForm();
        }
    });
}

function resetForm() {
    const form = document.getElementById('shoppingForm');
    
    // Reset form
    form.reset();
    
    // Reset step navigation
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('step1').classList.add('active');
    updateStepProgress('step1');
    
    // Reset shopper selection
    document.querySelectorAll('.shopper-card').forEach(card => {
        card.classList.remove('selected');
        const button = card.querySelector('.select-shopper');
        if (button) {
            button.textContent = 'Select Shopper';
            button.innerHTML = '<i class="fas fa-check-circle"></i> Select Shopper';
            button.classList.remove('btn-primary');
            button.classList.add('btn-outline');
        }
    });
    
    delete form.dataset.selectedShopper;
    delete form.dataset.selectedShopperPrice;
    
    // Reset dates to defaults
    setDefaultDates();
    
    // Reset payment method to cash
    document.querySelector('input[name="paymentMethod"][value="cash"]').checked = true;
    
    // Recalculate price
    calculatePrice();
}

function setupShopperFilters() {
    const filterCity = document.getElementById('filterCity');
    const filterRating = document.getElementById('filterRating');
    
    function applyFilters() {
        const selectedCity = filterCity.value;
        const selectedRating = filterRating.value;
        const allShoppers = document.querySelectorAll('.shopper-card');
        
        let visibleCount = 0;
        
        allShoppers.forEach(shopper => {
            const cityMatch = selectedCity === 'all' || shopper.dataset.city === selectedCity;
            const ratingMatch = selectedRating === 'all' || parseFloat(shopper.dataset.rating) >= parseFloat(selectedRating);
            
            if (cityMatch && ratingMatch) {
                shopper.style.display = 'block';
                visibleCount++;
            } else {
                shopper.style.display = 'none';
            }
        });
        
        // Show/hide "no shoppers" message
        const noShoppers = document.getElementById('noShoppers');
        
        if (visibleCount === 0) {
            noShoppers.style.display = 'block';
            shoppersList.style.display = 'none';
        } else {
            noShoppers.style.display = 'none';
            shoppersList.style.display = 'flex';
        }
    }
    
    filterCity.addEventListener('change', applyFilters);
    filterRating.addEventListener('change', applyFilters);
}

function setupPopularItems() {
    const popularItems = document.querySelectorAll('.item-card');
    const itemTypeSelect = document.getElementById('itemType');
    const itemDescription = document.getElementById('itemDescription');
    
    // Sample item descriptions for each category
    const itemDescriptions = {
        'electronics': 'Latest smartphone model, preferably Samsung or iPhone, with warranty',
        'clothing': 'Designer dress for wedding occasion, size M, preferably silk material',
        'groceries': 'Weekly groceries including fresh vegetables, fruits, and dairy products',
        'medical': 'Prescription medicines and general first aid supplies',
        'books': 'Latest bestseller novels and academic reference books',
        'home': 'Kitchen appliances and home decoration items',
        'sports': 'Sports equipment and fitness gear',
        'gifts': 'Birthday gift items suitable for different age groups'
    };
    
    popularItems.forEach(item => {
        item.addEventListener('click', function() {
            const itemName = this.querySelector('span').textContent.toLowerCase();
            
            // Find matching category
            let category = 'other';
            if (itemName.includes('mobile')) category = 'electronics';
            else if (itemName.includes('cloth')) category = 'clothing';
            else if (itemName.includes('laptop')) category = 'electronics';
            else if (itemName.includes('medic')) category = 'medical';
            else if (itemName.includes('book')) category = 'books';
            else if (itemName.includes('gaming')) category = 'electronics';
            else if (itemName.includes('food')) category = 'groceries';
            else if (itemName.includes('gift')) category = 'gifts';
            
            // Set form values
            itemTypeSelect.value = category;
            itemDescription.value = itemDescriptions[category] || `Looking to buy ${itemName}`;
            
            // Set reasonable price based on category
            const priceMap = {
                'electronics': 25000,
                'clothing': 5000,
                'groceries': 3000,
                'medical': 2000,
                'books': 1500,
                'home': 8000,
                'sports': 6000,
                'gifts': 4000
            };
            
            document.getElementById('itemPrice').value = priceMap[category] || 3000;
            
            // Show success message
            showNotification(`${this.querySelector('span').textContent} category selected!`, 'success');
        });
    });
}

function showNotification(message, type = 'success') {
    // Remove any existing notifications
    document.querySelectorAll('.notification').forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on type
    let icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'info') icon = 'info-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Add shake animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the page when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShoppingPage);
} else {
    initShoppingPage();
}