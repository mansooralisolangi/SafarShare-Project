// Parcel Delivery Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initParcelPage();
    
    // Form step navigation
    setupFormSteps();
    
    // Price calculation
    setupPriceCalculation();
    
    // Traveler selection
    setupTravelerSelection();
    
    // Form submission
    setupFormSubmission();
    
    // Filter travelers
    setupTravelerFilters();
});

function initParcelPage() {
    console.log('Parcel Delivery page initialized');
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('pickupDate').min = today;
    document.getElementById('deliveryDate').min = today;
    
    // Load sample travelers
    loadTravelers();
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
                
                // If moving to step 3, calculate price
                if (nextStepId === 'step3') {
                    calculatePrice();
                }
                
                // Update step indicator in header if you have one
                updateStepIndicator(nextStepId);
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
            
            // Update step indicator in header if you have one
            updateStepIndicator(prevStepId);
        });
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
        
        // Additional validation for specific fields
        if (input.id === 'weight') {
            const weight = parseFloat(input.value);
            if (weight < 0.1 || weight > 20) {
                isValid = false;
                highlightError(input, 'Weight must be between 0.1kg and 20kg');
            }
        }
        
        if (input.id === 'pickupDate' || input.id === 'deliveryDate') {
            const date = new Date(input.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (date < today) {
                isValid = false;
                highlightError(input, 'Date cannot be in the past');
            }
        }
        
        if (input.id === 'pickupCity' && input.id === 'deliveryCity') {
            const pickupCity = document.getElementById('pickupCity').value;
            const deliveryCity = document.getElementById('deliveryCity').value;
            
            if (pickupCity === deliveryCity) {
                isValid = false;
                highlightError(input, 'Pickup and delivery cities must be different');
            }
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
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '5px';
    
    // Insert after input
    input.parentNode.insertBefore(errorDiv, input.nextSibling);
}

function removeError(input) {
    input.classList.remove('error');
    
    // Remove any existing error message
    const errorDiv = input.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function updateStepIndicator(stepId) {
    // This function would update a visual step indicator if you have one
    // For now, we'll just log it
    console.log(`Now on step: ${stepId}`);
}

function setupPriceCalculation() {
    // Get all inputs that affect price
    const priceInputs = [
        'parcelType',
        'weight',
        'fragile',
        'perishable',
        'liquid',
        'pickupCity',
        'deliveryCity'
    ];
    
    // Add event listeners to all price-affecting inputs
    priceInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            if (input.type === 'checkbox') {
                input.addEventListener('change', calculatePrice);
            } else {
                input.addEventListener('input', calculatePrice);
            }
        }
    });
}

function calculatePrice() {
    // Base price based on distance (simplified)
    const pickupCity = document.getElementById('pickupCity').value;
    const deliveryCity = document.getElementById('deliveryCity').value;
    
    let basePrice = 300; // Default base price
    
    // Calculate distance-based price (simplified)
    if (pickupCity && deliveryCity) {
        // In a real app, you'd calculate actual distance
        basePrice = getCityDistancePrice(pickupCity, deliveryCity);
    }
    
    // Weight charge (pkr 30 per kg after first 1kg)
    const weight = parseFloat(document.getElementById('weight').value) || 2.5;
    let weightCharge = 0;
    if (weight > 1) {
        weightCharge = Math.floor((weight - 1) * 30);
    }
    
    // Special handling charges
    let handlingCharge = 0;
    if (document.getElementById('fragile').checked) {
        handlingCharge += 50;
    }
    if (document.getElementById('perishable').checked) {
        handlingCharge += 75;
    }
    if (document.getElementById('liquid').checked) {
        handlingCharge += 25;
    }
    
    // Platform fee (15% of base + weight)
    const platformFee = Math.round((basePrice + weightCharge + handlingCharge) * 0.15);
    
    // Total price
    const totalPrice = basePrice + weightCharge + handlingCharge + platformFee;
    
    // Update the UI
    document.getElementById('basePrice').textContent = `pkr ${basePrice}`;
    document.getElementById('weightPrice').textContent = `pkr ${weightCharge}`;
    document.getElementById('handlingPrice').textContent = `pkr ${handlingCharge}`;
    document.getElementById('platformFee').textContent = `pkr ${platformFee}`;
    document.getElementById('totalPrice').textContent = `pkr ${totalPrice}`;
    
    // Update savings estimate (assuming traditional courier is 60% more expensive)
    const traditionalPrice = Math.round(totalPrice * 1.6);
    const savings = traditionalPrice - totalPrice;
    
    const savingsBadge = document.querySelector('.savings-badge strong');
    if (savingsBadge) {
        savingsBadge.textContent = `pkr ${savings}`;
    }
    
    return totalPrice;
}

function getCityDistancePrice(pickup, delivery) {
    // Simplified distance-based pricing
    const cityPrices = {
        'kandiaro-karachi': 400,
        'hyderabad-karachi': 250,
        'sukkur-karachi': 500,
        'kandiaro-hyderabad': 200,
        'default': 300
    };
    
    const route = `${pickup}-${delivery}`;
    return cityPrices[route] || cityPrices[`${delivery}-${pickup}`] || cityPrices['default'];
}

function loadTravelers() {
    // Sample traveler data
    const travelers = [
        {
            id: 1,
            name: "Mansoor Ahmed",
            verified: true,
            rating: 4.8,
            trips: 42,
            vehicle: "Toyota Corolla",
            from: "Kandiaro",
            to: "Karachi",
            departure: "2023-12-15 07:00",
            arrival: "2023-12-15 13:00",
            price: 350,
            availableWeight: 15,
            profileImg: "M"
        },
        {
            id: 2,
            name: "Ali Raza",
            verified: true,
            rating: 4.5,
            trips: 28,
            vehicle: "Honda Civic",
            from: "Hyderabad",
            to: "Karachi",
            departure: "2023-12-15 09:00",
            arrival: "2023-12-15 12:30",
            price: 280,
            availableWeight: 10,
            profileImg: "A"
        },
        {
            id: 3,
            name: "Kamran Khan",
            verified: false,
            rating: 4.2,
            trips: 15,
            vehicle: "Suzuki Cultus",
            from: "Sukkur",
            to: "Karachi",
            departure: "2023-12-16 06:00",
            arrival: "2023-12-16 15:00",
            price: 450,
            availableWeight: 8,
            profileImg: "K"
        },
        {
            id: 4,
            name: "Bilal Siddiqui",
            verified: true,
            rating: 4.9,
            trips: 67,
            vehicle: "Toyota Fortuner",
            from: "Kandiaro",
            to: "Karachi",
            departure: "2023-12-14 10:00",
            arrival: "2023-12-14 16:00",
            price: 380,
            availableWeight: 20,
            profileImg: "B"
        }
    ];
    
    const travelersList = document.getElementById('travelersList');
    const noTravelers = document.getElementById('noTravelers');
    
    if (travelers.length === 0) {
        travelersList.style.display = 'none';
        noTravelers.style.display = 'block';
        return;
    }
    
    travelersList.innerHTML = '';
    noTravelers.style.display = 'none';
    
    travelers.forEach(traveler => {
        const travelerCard = createTravelerCard(traveler);
        travelersList.appendChild(travelerCard);
    });
}

function createTravelerCard(traveler) {
    const card = document.createElement('div');
    card.className = 'traveler-card';
    card.dataset.id = traveler.id;
    card.dataset.route = `${traveler.from.toLowerCase()}-${traveler.to.toLowerCase()}`;
    
    // Format time
    const departureTime = formatTime(traveler.departure);
    const arrivalTime = formatTime(traveler.arrival);
    
    card.innerHTML = `
        <div class="traveler-header">
            <div class="traveler-name">
                <div class="avatar">${traveler.profileImg}</div>
                <h4>${traveler.name}</h4>
                ${traveler.verified ? '<span class="traveler-verified"><i class="fas fa-check"></i> Verified</span>' : ''}
            </div>
            <div class="traveler-rating">
                <i class="fas fa-star"></i>
                <span>${traveler.rating} (${traveler.trips} trips)</span>
            </div>
        </div>
        
        <div class="traveler-details">
            <div class="detail-item">
                <span class="detail-label">Vehicle</span>
                <span class="detail-value">${traveler.vehicle}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Available Space</span>
                <span class="detail-value">${traveler.availableWeight} kg</span>
            </div>
        </div>
        
        <div class="route">
            <div class="city">
                <span class="city-name">${traveler.from}</span>
                <span class="city-time">${departureTime}</span>
            </div>
            <div class="route-arrow">
                <i class="fas fa-long-arrow-alt-right"></i>
            </div>
            <div class="city">
                <span class="city-name">${traveler.to}</span>
                <span class="city-time">${arrivalTime}</span>
            </div>
        </div>
        
        <div class="traveler-price">
            <div>
                <span class="price">pkr ${traveler.price}</span>
                <small>per parcel</small>
            </div>
            <button class="btn btn-outline select-traveler" data-id="${traveler.id}">Select</button>
        </div>
    `;
    
    return card;
}

function formatTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function setupTravelerSelection() {
    // Delegate event listener to travelers list
    document.getElementById('travelersList').addEventListener('click', function(e) {
        if (e.target.classList.contains('select-traveler') || 
            e.target.closest('.select-traveler')) {
            
            const button = e.target.classList.contains('select-traveler') ? 
                          e.target : e.target.closest('.select-traveler');
            
            const travelerId = button.getAttribute('data-id');
            selectTraveler(travelerId);
        }
        
        // Also allow selecting by clicking anywhere on the card
        if (e.target.closest('.traveler-card')) {
            const card = e.target.closest('.traveler-card');
            const travelerId = card.dataset.id;
            selectTraveler(travelerId);
        }
    });
}

function selectTraveler(travelerId) {
    // Remove selected class from all travelers
    document.querySelectorAll('.traveler-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to clicked traveler
    const selectedCard = document.querySelector(`.traveler-card[data-id="${travelerId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        
        // Update button text
        const button = selectedCard.querySelector('.select-traveler');
        button.textContent = 'Selected';
        button.classList.remove('btn-outline');
        button.classList.add('btn-primary');
        
        // Store selected traveler in form data
        document.getElementById('parcelForm').dataset.selectedTraveler = travelerId;
        
        // Show confirmation message
        showNotification(`Traveler selected! Price: pkr ${selectedCard.querySelector('.price').textContent.split('pkr ')[1]}`);
    }
}

function setupFormSubmission() {
    const form = document.getElementById('parcelForm');
    const successModal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');
    const trackParcel = document.getElementById('trackParcel');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all steps
        if (!validateStep('step1') || !validateStep('step2') || !validateStep('step3')) {
            showNotification('Please fill all required fields correctly', 'error');
            return;
        }
        
        // Check if traveler is selected
        if (!form.dataset.selectedTraveler) {
            showNotification('Please select a traveler for your parcel', 'error');
            return;
        }
        
        // Check terms agreement
        if (!document.getElementById('terms').checked) {
            showNotification('You must agree to the terms and conditions', 'error');
            return;
        }
        
        // Get form data
        const formData = {
            parcelType: document.getElementById('parcelType').value,
            weight: document.getElementById('weight').value,
            dimensions: document.getElementById('dimensions').value,
            parcelValue: document.getElementById('parcelValue').value,
            fragile: document.getElementById('fragile').checked,
            perishable: document.getElementById('perishable').checked,
            liquid: document.getElementById('liquid').checked,
            pickupCity: document.getElementById('pickupCity').value,
            deliveryCity: document.getElementById('deliveryCity').value,
            pickupDate: document.getElementById('pickupDate').value,
            deliveryDate: document.getElementById('deliveryDate').value,
            instructions: document.getElementById('instructions').value,
            paymentMethod: document.getElementById('paymentMethod').value,
            selectedTraveler: form.dataset.selectedTraveler,
            totalPrice: calculatePrice()
        };
        
        // In a real app, you would send this data to your server
        console.log('Parcel submission:', formData);
        
        // Generate a random request ID
        const requestId = 'SRC-' + Math.floor(10000 + Math.random() * 90000);
        document.getElementById('requestId').textContent = requestId;
        
        // Show success modal
        successModal.classList.add('active');
        
        // Reset form after delay
        setTimeout(() => {
            form.reset();
            document.querySelectorAll('.form-step').forEach(step => {
                step.classList.remove('active');
            });
            document.getElementById('step1').classList.add('active');
            
            // Reset traveler selection
            document.querySelectorAll('.traveler-card').forEach(card => {
                card.classList.remove('selected');
                const button = card.querySelector('.select-traveler');
                button.textContent = 'Select';
                button.classList.remove('btn-primary');
                button.classList.add('btn-outline');
            });
            
            delete form.dataset.selectedTraveler;
        }, 3000);
    });
    
    // Close modal
    closeModal.addEventListener('click', function() {
        successModal.classList.remove('active');
    });
    
    // Track parcel button
    trackParcel.addEventListener('click', function() {
        successModal.classList.remove('active');
        showNotification('Tracking page would open here', 'info');
        // In real app: window.location.href = `tracking.html?id=${document.getElementById('requestId').textContent}`;
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
    });
}

function setupTravelerFilters() {
    const filterRoute = document.getElementById('filterRoute');
    
    filterRoute.addEventListener('change', function() {
        const selectedRoute = this.value;
        const allTravelers = document.querySelectorAll('.traveler-card');
        
        allTravelers.forEach(traveler => {
            if (selectedRoute === 'all' || traveler.dataset.route === selectedRoute) {
                traveler.style.display = 'block';
            } else {
                traveler.style.display = 'none';
            }
        });
        
        // Show/hide "no travelers" message
        const visibleTravelers = Array.from(allTravelers).filter(t => t.style.display !== 'none');
        const noTravelers = document.getElementById('noTravelers');
        
        if (visibleTravelers.length === 0) {
            noTravelers.style.display = 'block';
        } else {
            noTravelers.style.display = 'none';
        }
    });
    
    // Notify me button
    document.getElementById('notifyMe').addEventListener('click', function() {
        showNotification('We\'ll notify you when a traveler becomes available!', 'success');
    });
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 3000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}