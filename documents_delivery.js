// Document Delivery Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initDocumentPage();
    
    // Form step navigation
    setupFormSteps();
    
    // Price calculation
    setupPriceCalculation();
    
    // Carrier selection
    setupCarrierSelection();
    
    // Form submission
    setupFormSubmission();
    
    // Filter carriers
    setupCarrierFilters();
    
    // Set default dates
    setDefaultDates();
    
    // Setup document types click
    setupDocumentTypes();
});

function initDocumentPage() {
    console.log('Document Delivery page initialized');
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('pickupDate').min = today;
    document.getElementById('deliveryDate').min = today;
    
    // Load sample carriers
    loadCarriers();
    
    // Setup form validation
    setupFormValidation();
}

function setDefaultDates() {
    // Set pickup date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    document.getElementById('pickupDate').value = tomorrowStr;
    
    // Set delivery date to 2 days from now
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 2);
    const deliveryStr = deliveryDate.toISOString().split('T')[0];
    document.getElementById('deliveryDate').value = deliveryStr;
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
    // Real-time validation for pickup and delivery cities
    const pickupCity = document.getElementById('pickupCity');
    const deliveryCity = document.getElementById('deliveryCity');
    
    [pickupCity, deliveryCity].forEach(select => {
        select.addEventListener('change', function() {
            if (pickupCity.value && deliveryCity.value && pickupCity.value === deliveryCity.value) {
                highlightError(pickupCity, 'Pickup and delivery cities must be different');
                highlightError(deliveryCity, 'Pickup and delivery cities must be different');
            } else {
                removeError(pickupCity);
                removeError(deliveryCity);
            }
        });
    });
    
    // Real-time validation for dates
    const pickupDate = document.getElementById('pickupDate');
    const deliveryDate = document.getElementById('deliveryDate');
    
    [pickupDate, deliveryDate].forEach(dateInput => {
        dateInput.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                highlightError(this, 'Date cannot be in the past');
            } else if (pickupDate.value && deliveryDate.value) {
                const pickup = new Date(pickupDate.value);
                const delivery = new Date(deliveryDate.value);
                
                if (delivery < pickup) {
                    highlightError(deliveryDate, 'Delivery date cannot be before pickup date');
                } else {
                    removeError(deliveryDate);
                }
            } else {
                removeError(this);
            }
        });
    });
    
    // Real-time validation for document description
    const documentDescription = document.getElementById('documentDescription');
    documentDescription.addEventListener('blur', function() {
        if (this.value.trim().length < 10) {
            highlightError(this, 'Please provide a more detailed description (minimum 10 characters)');
        } else {
            removeError(this);
        }
    });
    
    // Real-time validation for recipient info
    const recipientInfo = document.getElementById('recipientInfo');
    recipientInfo.addEventListener('blur', function() {
        if (this.value.trim().length < 5) {
            highlightError(this, 'Please provide recipient name and contact number');
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
        'documentType',
        'envelopeSize',
        'weight',
        'pickupCity',
        'deliveryCity',
        'expressDelivery'
    ];
    
    // Add event listeners to all price-affecting inputs
    priceInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            if (input.type === 'checkbox') {
                input.addEventListener('change', calculatePrice);
            } else {
                input.addEventListener('change', calculatePrice);
            }
        }
    });
    
    // Add event listeners to security level options
    document.querySelectorAll('input[name="securityLevel"]').forEach(radio => {
        radio.addEventListener('change', calculatePrice);
    });
}

function calculatePrice() {
    // Base delivery charge based on distance
    const pickupCity = document.getElementById('pickupCity').value;
    const deliveryCity = document.getElementById('deliveryCity').value;
    
    let baseCharge = 300; // Default base charge
    
    // Calculate distance-based charge
    if (pickupCity && deliveryCity && pickupCity !== deliveryCity) {
        baseCharge = getCityDistanceCharge(pickupCity, deliveryCity);
    }
    
    // Security level charge
    const securityLevel = document.querySelector('input[name="securityLevel"]:checked').value;
    let securityCharge = 0;
    if (securityLevel === 'premium') securityCharge = 100;
    else if (securityLevel === 'confidential') securityCharge = 200;
    
    // Express delivery charge
    const expressDelivery = document.getElementById('expressDelivery').checked;
    const expressCharge = expressDelivery ? 200 : 0;
    
    // Tracking charge (included in all deliveries)
    const trackingCharge = 50;
    
    // Platform fee (15% of base + security)
    const subtotal = baseCharge + securityCharge + expressCharge + trackingCharge;
    const platformFee = Math.round(subtotal * 0.15);
    
    // Total price
    const totalPrice = subtotal + platformFee;
    
    // Update the UI
    document.getElementById('baseCharge').textContent = `₹ ${baseCharge}`;
    document.getElementById('securityCharge').textContent = `₹ ${securityCharge}`;
    document.getElementById('expressCharge').textContent = `₹ ${expressCharge}`;
    document.getElementById('trackingCharge').textContent = `₹ ${trackingCharge}`;
    document.getElementById('platformFee').textContent = `₹ ${platformFee}`;
    document.getElementById('totalPrice').textContent = `₹ ${totalPrice}`;
    
    // Calculate savings (assuming professional courier is 60% more expensive)
    const courierPrice = Math.round(totalPrice * 1.6);
    const savings = courierPrice - totalPrice;
    
    const savingsBadge = document.querySelector('.savings-badge strong');
    if (savingsBadge) {
        savingsBadge.textContent = `₹ ${savings}`;
    }
    
    return totalPrice;
}

function getCityDistanceCharge(pickup, delivery) {
    // Distance-based pricing matrix (in rupees)
    const cityCharges = {
        'karachi': {
            'lahore': 500,
            'islamabad': 600,
            'rawalpindi': 600,
            'faisalabad': 450,
            'multan': 400,
            'hyderabad': 200,
            'peshawar': 700,
            'quetta': 800
        },
        'lahore': {
            'karachi': 500,
            'islamabad': 300,
            'rawalpindi': 300,
            'faisalabad': 150,
            'multan': 250,
            'hyderabad': 450,
            'peshawar': 350,
            'quetta': 600
        },
        'islamabad': {
            'karachi': 600,
            'lahore': 300,
            'rawalpindi': 100,
            'faisalabad': 250,
            'multan': 350,
            'hyderabad': 550,
            'peshawar': 200,
            'quetta': 650
        },
        'rawalpindi': {
            'karachi': 600,
            'lahore': 300,
            'islamabad': 100,
            'faisalabad': 250,
            'multan': 350,
            'hyderabad': 550,
            'peshawar': 200,
            'quetta': 650
        },
        'faisalabad': {
            'karachi': 450,
            'lahore': 150,
            'islamabad': 250,
            'rawalpindi': 250,
            'multan': 200,
            'hyderabad': 400,
            'peshawar': 300,
            'quetta': 550
        },
        'multan': {
            'karachi': 400,
            'lahore': 250,
            'islamabad': 350,
            'rawalpindi': 350,
            'faisalabad': 200,
            'hyderabad': 350,
            'peshawar': 400,
            'quetta': 500
        },
        'hyderabad': {
            'karachi': 200,
            'lahore': 450,
            'islamabad': 550,
            'rawalpindi': 550,
            'faisalabad': 400,
            'multan': 350,
            'peshawar': 600,
            'quetta': 700
        },
        'peshawar': {
            'karachi': 700,
            'lahore': 350,
            'islamabad': 200,
            'rawalpindi': 200,
            'faisalabad': 300,
            'multan': 400,
            'hyderabad': 600,
            'quetta': 750
        },
        'quetta': {
            'karachi': 800,
            'lahore': 600,
            'islamabad': 650,
            'rawalpindi': 650,
            'faisalabad': 550,
            'multan': 500,
            'hyderabad': 700,
            'peshawar': 750
        }
    };
    
    return cityCharges[pickup]?.[delivery] || 300;
}

function loadCarriers() {
    // Sample carrier data
    const carriers = [
        {
            id: 1,
            name: "Ahmed Raza",
            verified: true,
            rating: 4.9,
            documentDeliveries: 156,
            specialty: ["Legal", "Government", "Confidential"],
            route: "Karachi → Lahore",
            responseTime: "1-2 hours",
            successRate: "99.5%",
            price: 450,
            avatar: "AR",
            bio: "Specializes in confidential document delivery with 5 years experience."
        },
        {
            id: 2,
            name: "Sara Khan",
            verified: true,
            rating: 4.8,
            documentDeliveries: 89,
            specialty: ["Educational", "Medical", "Certificates"],
            route: "Islamabad → Karachi",
            responseTime: "2-3 hours",
            successRate: "98%",
            price: 500,
            avatar: "SK",
            bio: "University student with perfect track record for educational documents."
        },
        {
            id: 3,
            name: "Bilal Shah",
            verified: true,
            rating: 4.9,
            documentDeliveries: 203,
            specialty: ["Financial", "Business", "Contracts"],
            route: "Lahore → Islamabad",
            responseTime: "1 hour",
            successRate: "99.8%",
            price: 400,
            avatar: "BS",
            bio: "Business professional with extensive experience in financial document handling."
        },
        {
            id: 4,
            name: "Fatima Ali",
            verified: false,
            rating: 4.5,
            documentDeliveries: 45,
            specialty: ["General", "Personal", "Certificates"],
            route: "Hyderabad → Karachi",
            responseTime: "3-4 hours",
            successRate: "96%",
            price: 350,
            avatar: "FA",
            bio: "Reliable carrier for all types of document delivery needs."
        },
        {
            id: 5,
            name: "Kamran Malik",
            verified: true,
            rating: 4.7,
            documentDeliveries: 127,
            specialty: ["Government", "Legal", "Property"],
            route: "Karachi → Islamabad",
            responseTime: "2 hours",
            successRate: "98.5%",
            price: 550,
            avatar: "KM",
            bio: "Former government employee with expertise in official document handling."
        }
    ];
    
    const carriersList = document.getElementById('carriersList');
    const noCarriers = document.getElementById('noCarriers');
    
    if (carriers.length === 0) {
        carriersList.style.display = 'none';
        noCarriers.style.display = 'block';
        return;
    }
    
    carriersList.innerHTML = '';
    noCarriers.style.display = 'none';
    
    carriers.forEach(carrier => {
        const carrierCard = createCarrierCard(carrier);
        carriersList.appendChild(carrierCard);
    });
}

function createCarrierCard(carrier) {
    const card = document.createElement('div');
    card.className = 'carrier-card';
    card.dataset.id = carrier.id;
    card.dataset.route = carrier.route.toLowerCase().replace(' → ', '-');
    card.dataset.rating = carrier.rating;
    card.dataset.experience = carrier.documentDeliveries;
    card.dataset.price = carrier.price;
    
    // Create specialty tags HTML
    const specialtyTags = carrier.specialty.map(tag => 
        `<span class="specialty-tag">${tag}</span>`
    ).join('');
    
    card.innerHTML = `
        <div class="carrier-header">
            <div class="carrier-info">
                <div class="carrier-avatar ${carrier.verified ? 'verified' : ''}">
                    ${carrier.avatar}
                </div>
                <div class="carrier-details">
                    <h4>${carrier.name} ${carrier.verified ? '<i class="fas fa-check-circle" style="color: #10b981; font-size: 0.9rem;"></i>' : ''}</h4>
                    <div class="carrier-rating">
                        <i class="fas fa-star"></i>
                        <span>${carrier.rating} (${carrier.documentDeliveries} deliveries)</span>
                    </div>
                    <div class="carrier-specialty">
                        ${specialtyTags}
                    </div>
                </div>
            </div>
        </div>
        
        <div class="carrier-stats">
            <div class="carrier-stat-item">
                <span class="carrier-stat-value">${carrier.responseTime}</span>
                <span class="carrier-stat-label">Avg. Response</span>
            </div>
            <div class="carrier-stat-item">
                <span class="carrier-stat-value">${carrier.successRate}</span>
                <span class="carrier-stat-label">Success Rate</span>
            </div>
            <div class="carrier-stat-item">
                <span class="carrier-stat-value">${carrier.route.split(' → ')[0]}</span>
                <span class="carrier-stat-label">Route</span>
            </div>
        </div>
        
        <div class="carrier-action">
            <div>
                <span class="carrier-price">₹ ${carrier.price}</span>
                <small>service charge</small>
            </div>
            <button class="btn btn-outline select-carrier" data-id="${carrier.id}">
                <i class="fas fa-check-circle"></i> Select Carrier
            </button>
        </div>
    `;
    
    return card;
}

function setupCarrierSelection() {
    // Delegate event listener to carriers list
    document.getElementById('carriersList').addEventListener('click', function(e) {
        const carrierCard = e.target.closest('.carrier-card');
        if (carrierCard) {
            const carrierId = carrierCard.dataset.id;
            selectCarrier(carrierId);
        }
    });
}

function selectCarrier(carrierId) {
    // Remove selected class from all carriers
    document.querySelectorAll('.carrier-card').forEach(card => {
        card.classList.remove('selected');
        const button = card.querySelector('.select-carrier');
        if (button) {
            button.textContent = 'Select Carrier';
            button.innerHTML = '<i class="fas fa-check-circle"></i> Select Carrier';
            button.classList.remove('btn-primary');
            button.classList.add('btn-outline');
        }
    });
    
    // Add selected class to clicked carrier
    const selectedCard = document.querySelector(`.carrier-card[data-id="${carrierId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        
        // Update button text
        const button = selectedCard.querySelector('.select-carrier');
        button.textContent = 'Selected';
        button.innerHTML = '<i class="fas fa-check-circle"></i> Selected';
        button.classList.remove('btn-outline');
        button.classList.add('btn-primary');
        
        // Store selected carrier in form data
        document.getElementById('documentForm').dataset.selectedCarrier = carrierId;
        document.getElementById('documentForm').dataset.selectedCarrierPrice = selectedCard.dataset.price;
        
        // Show confirmation message
        const carrierName = selectedCard.querySelector('h4').textContent.trim();
        showNotification(`Carrier selected: ${carrierName}`, 'success');
    }
}

function setupFormSubmission() {
    const form = document.getElementById('documentForm');
    const successModal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');
    const trackDelivery = document.getElementById('trackDelivery');
    const postRequestBtn = document.getElementById('postRequest');
    
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
        
        // Check confirmation agreement
        if (!document.getElementById('confirmation').checked) {
            showNotification('You must confirm that documents do not contain illegal items', 'error');
            return;
        }
        
        // Check terms agreement
        if (!document.getElementById('terms').checked) {
            showNotification('You must agree to the terms and conditions', 'error');
            return;
        }
        
        // Get form data
        const formData = {
            documentType: document.getElementById('documentType').value,
            documentDescription: document.getElementById('documentDescription').value,
            envelopeSize: document.getElementById('envelopeSize').value,
            weight: document.getElementById('weight').value,
            securityLevel: document.querySelector('input[name="securityLevel"]:checked').value,
            pickupCity: document.getElementById('pickupCity').value,
            deliveryCity: document.getElementById('deliveryCity').value,
            pickupDate: document.getElementById('pickupDate').value,
            deliveryDate: document.getElementById('deliveryDate').value,
            pickupAddress: document.getElementById('pickupAddress').value,
            deliveryAddress: document.getElementById('deliveryAddress').value,
            recipientInfo: document.getElementById('recipientInfo').value,
            expressDelivery: document.getElementById('expressDelivery').checked,
            paymentMethod: document.getElementById('paymentMethod').value,
            specialInstructions: document.getElementById('specialInstructions').value,
            selectedCarrier: form.dataset.selectedCarrier || 'not-selected',
            totalPrice: calculatePrice(),
            timestamp: new Date().toISOString()
        };
        
        // In a real app, you would send this data to your server
        console.log('Document delivery submission:', formData);
        
        // Save to localStorage for demo purposes
        const requests = JSON.parse(localStorage.getItem('documentRequests') || '[]');
        const trackingId = 'DOC-' + Date.now().toString().slice(-8);
        formData.trackingId = trackingId;
        formData.status = 'pending';
        requests.push(formData);
        localStorage.setItem('documentRequests', JSON.stringify(requests));
        
        // Generate tracking ID for display
        document.getElementById('trackingId').textContent = trackingId;
        
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
    
    // Track delivery button
    trackDelivery.addEventListener('click', function() {
        const trackingId = document.getElementById('trackingId').textContent;
        successModal.classList.remove('active');
        showNotification(`Redirecting to track delivery: ${trackingId}`, 'info');
        
        // Save tracking info
        localStorage.setItem('lastDocumentTrackingId', trackingId);
        
        // In real app: window.location.href = `tracking.html?id=${trackingId}`;
        // For demo, just show message
        setTimeout(() => {
            alert(`Tracking page would open for: ${trackingId}\n\nIn a real application, this would redirect to a tracking page.`);
        }, 500);
    });
    
    // Post request button
    postRequestBtn.addEventListener('click', function() {
        // Show step 3 and calculate price
        document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
        document.getElementById('step3').classList.add('active');
        updateStepProgress('step3');
        calculatePrice();
        
        showNotification('Request posted! Carriers will be notified.', 'success');
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
    const form = document.getElementById('documentForm');
    
    // Reset form
    form.reset();
    
    // Reset step navigation
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('step1').classList.add('active');
    updateStepProgress('step1');
    
    // Reset carrier selection
    document.querySelectorAll('.carrier-card').forEach(card => {
        card.classList.remove('selected');
        const button = card.querySelector('.select-carrier');
        if (button) {
            button.textContent = 'Select Carrier';
            button.innerHTML = '<i class="fas fa-check-circle"></i> Select Carrier';
            button.classList.remove('btn-primary');
            button.classList.add('btn-outline');
        }
    });
    
    delete form.dataset.selectedCarrier;
    delete form.dataset.selectedCarrierPrice;
    
    // Reset security level to standard
    document.querySelector('input[name="securityLevel"][value="standard"]').checked = true;
    
    // Reset express delivery checkbox
    document.getElementById('expressDelivery').checked = false;
    
    // Reset dates to defaults
    setDefaultDates();
    
    // Recalculate price
    calculatePrice();
}

function setupCarrierFilters() {
    const filterRoute = document.getElementById('filterRoute');
    const filterExperience = document.getElementById('filterExperience');
    
    function applyFilters() {
        const selectedRoute = filterRoute.value;
        const selectedExperience = filterExperience.value;
        const allCarriers = document.querySelectorAll('.carrier-card');
        
        let visibleCount = 0;
        
        allCarriers.forEach(carrier => {
            const routeMatch = selectedRoute === 'all' || carrier.dataset.route.includes(selectedRoute);
            const experienceMatch = selectedExperience === 'all' || 
                parseInt(carrier.dataset.experience) >= parseInt(selectedExperience);
            
            if (routeMatch && experienceMatch) {
                carrier.style.display = 'block';
                visibleCount++;
            } else {
                carrier.style.display = 'none';
            }
        });
        
        // Show/hide "no carriers" message
        const noCarriers = document.getElementById('noCarriers');
        
        if (visibleCount === 0) {
            noCarriers.style.display = 'block';
            carriersList.style.display = 'none';
        } else {
            noCarriers.style.display = 'none';
            carriersList.style.display = 'flex';
        }
    }
    
    filterRoute.addEventListener('change', applyFilters);
    filterExperience.addEventListener('change', applyFilters);
}

function setupDocumentTypes() {
    const documentTypes = document.querySelectorAll('.type-card');
    const documentTypeSelect = document.getElementById('documentType');
    const documentDescription = document.getElementById('documentDescription');
    
    // Sample document descriptions for each type
    const documentDescriptions = {
        'legal': 'Court documents, legal agreements, and attorney correspondence',
        'educational': 'Degree certificates, transcripts, mark sheets, and educational records',
        'medical': 'Medical reports, prescriptions, test results, and health records',
        'financial': 'Bank statements, tax documents, financial agreements, and audit reports',
        'government': 'Government applications, official permits, and government correspondence',
        'contract': 'Business contracts, rental agreements, and legal agreements',
        'other': 'Personal documents and miscellaneous important papers'
    };
    
    const typeMapping = {
        'degree certificates': 'educational',
        'legal papers': 'legal',
        'medical reports': 'medical',
        'property documents': 'legal',
        'passport & visas': 'government',
        'bank papers': 'financial',
        'contracts': 'contract',
        'business docs': 'financial'
    };
    
    documentTypes.forEach(type => {
        type.addEventListener('click', function() {
            const typeName = this.querySelector('span').textContent.toLowerCase();
            
            // Find matching document type
            const docType = typeMapping[typeName] || 'other';
            
            // Set form values
            documentTypeSelect.value = docType;
            documentDescription.value = documentDescriptions[docType] || `Important ${typeName} delivery`;
            
            // Show success message
            showNotification(`${this.querySelector('span').textContent} selected!`, 'success');
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
    document.addEventListener('DOMContentLoaded', initDocumentPage);
} else {
    initDocumentPage();
}