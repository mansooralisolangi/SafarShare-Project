// Daily Commute Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initCommutePage();
    
    // Form submissions
    setupFindCommuteForm();
    setupCreateScheduleForm();
    
    // Commute selection
    setupCommuteSelection();
    
    // View toggle
    setupViewToggle();
    
    // Filter commutes
    setupCommuteFilters();
    
    // Savings calculator
    setupSavingsCalculator();
    
    // Set default times
    setDefaultTimes();
    
    // Setup popular routes click
    setupPopularRoutes();
});

function initCommutePage() {
    console.log('Daily Commute page initialized');
    
    // Load sample commutes
    loadCommutes();
    
    // Setup form validation
    setupFormValidation();
}

function setDefaultTimes() {
    // Set default start time to 8:00 AM
    document.getElementById('startTime').value = '08:00';
    
    // Set default return time to 5:00 PM
    document.getElementById('returnTime').value = '17:00';
}

function setupFormValidation() {
    // Real-time validation for start location
    const startLocation = document.getElementById('startLocation');
    startLocation.addEventListener('blur', function() {
        if (this.value.trim().length < 3) {
            highlightError(this, 'Please enter a valid start location');
        } else {
            removeError(this);
        }
    });
    
    // Real-time validation for end location
    const endLocation = document.getElementById('endLocation');
    endLocation.addEventListener('blur', function() {
        if (this.value.trim().length < 3) {
            highlightError(this, 'Please enter a valid destination');
        } else {
            removeError(this);
        }
    });
    
    // Real-time validation for schedule name
    const scheduleName = document.getElementById('scheduleName');
    scheduleName.addEventListener('blur', function() {
        if (this.value.trim().length < 3) {
            highlightError(this, 'Please enter a valid schedule name');
        } else {
            removeError(this);
        }
    });
    
    // Real-time validation for price
    const pricePerSeat = document.getElementById('pricePerSeat');
    pricePerSeat.addEventListener('blur', function() {
        const price = parseFloat(this.value);
        if (price < 100 || price > 10000) {
            highlightError(this, 'Price must be between pkr  100 and pkr  10,000');
        } else {
            removeError(this);
        }
    });
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

function setupFindCommuteForm() {
    const form = document.getElementById('findCommuteForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        let isValid = true;
        const requiredInputs = form.querySelectorAll('[required]');
        
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                highlightError(input, 'This field is required');
            } else {
                removeError(input);
            }
        });
        
        if (!isValid) {
            showNotification('Please fill all required fields', 'error');
            return;
        }
        
        // Get form data
        const formData = {
            startLocation: document.getElementById('startLocation').value,
            endLocation: document.getElementById('endLocation').value,
            commuteTime: document.getElementById('commuteTime').value,
            days: document.getElementById('days').value,
            commuteType: document.querySelector('input[name="commuteType"]:checked').value,
            genderPreference: document.getElementById('genderPreference').value,
            timestamp: new Date().toISOString()
        };
        
        console.log('Find commute submission:', formData);
        
        // Filter commutes based on search
        filterCommutesBySearch(formData);
        
        // Show success message
        showNotification(`Searching for commutes on ${formData.startLocation} → ${formData.endLocation}`, 'info');
    });
}

function setupCreateScheduleForm() {
    const form = document.getElementById('createScheduleForm');
    const successModal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');
    const viewSchedule = document.getElementById('viewSchedule');
    const createScheduleBtn = document.getElementById('createScheduleBtn');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        let isValid = true;
        const requiredInputs = form.querySelectorAll('[required]');
        
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                highlightError(input, 'This field is required');
            } else {
                removeError(input);
            }
        });
        
        // Check if at least one day is selected
        const selectedDays = form.querySelectorAll('input[name="day"]:checked');
        if (selectedDays.length === 0) {
            isValid = false;
            showNotification('Please select at least one day', 'error');
        }
        
        if (!isValid) {
            return;
        }
        
        // Get form data
        const selectedDaysArray = Array.from(selectedDays).map(day => day.value);
        
        const formData = {
            scheduleName: document.getElementById('scheduleName').value,
            pickupPoint: document.getElementById('pickupPoint').value,
            dropPoint: document.getElementById('dropPoint').value,
            startTime: document.getElementById('startTime').value,
            returnTime: document.getElementById('returnTime').value || null,
            operatingDays: selectedDaysArray,
            availableSeats: document.getElementById('availableSeats').value,
            pricePerSeat: document.getElementById('pricePerSeat').value,
            scheduleNotes: document.getElementById('scheduleNotes').value,
            timestamp: new Date().toISOString()
        };
        
        console.log('Create schedule submission:', formData);
        
        // Save to localStorage for demo purposes
        const schedules = JSON.parse(localStorage.getItem('commuteSchedules') || '[]');
        const scheduleId = 'CM-' + Date.now().toString().slice(-8);
        formData.scheduleId = scheduleId;
        formData.status = 'active';
        formData.joinedMembers = 0;
        schedules.push(formData);
        localStorage.setItem('commuteSchedules', JSON.stringify(schedules));
        
        // Generate schedule ID for display
        document.getElementById('scheduleId').textContent = scheduleId;
        
        // Show success modal
        successModal.classList.add('active');
        
        // Add new schedule to the list
        addNewCommuteToDisplay(formData);
        
        // Reset form after 5 seconds
        setTimeout(() => {
            resetCreateForm();
        }, 5000);
    });
    
    // Create schedule button from no results
    createScheduleBtn.addEventListener('click', function() {
        // Scroll to create schedule form
        document.querySelector('#createScheduleForm').scrollIntoView({ behavior: 'smooth' });
        document.getElementById('scheduleName').focus();
    });
    
    // Close modal
    closeModal.addEventListener('click', function() {
        successModal.classList.remove('active');
        resetCreateForm();
    });
    
    // View schedule button
    viewSchedule.addEventListener('click', function() {
        const scheduleId = document.getElementById('scheduleId').textContent;
        successModal.classList.remove('active');
        showNotification(`Viewing schedule: ${scheduleId}`, 'info');
        
        // In real app, would redirect to schedule details
        setTimeout(() => {
            alert(`Schedule details page would open for: ${scheduleId}\n\nIn a real application, this would redirect to schedule management.`);
        }, 500);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === successModal) {
            successModal.classList.remove('active');
            resetCreateForm();
        }
    });
}

function resetCreateForm() {
    const form = document.getElementById('createScheduleForm');
    
    // Reset form
    form.reset();
    
    // Uncheck all day checkboxes
    form.querySelectorAll('input[name="day"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reset times to defaults
    setDefaultTimes();
    
    // Reset price
    document.getElementById('pricePerSeat').value = '2000';
}

function loadCommutes() {
    // Sample commute data
    const commutes = [
        {
            id: 1,
            name: "Ahmed Raza",
            type: "driver",
            rating: 4.8,
            totalRides: 156,
            vehicle: "Toyota Corolla",
            pickup: "Clifton, Block 2",
            drop: "I.I. Chundrigar Road",
            startTime: "08:00 AM",
            returnTime: "05:30 PM",
            days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
            availableSeats: 2,
            price: 2500,
            joined: 1,
            avatar: "AR",
            gender: "male",
            notes: "Office commute, punctual, AC car"
        },
        {
            id: 2,
            name: "Sara Khan",
            type: "rider",
            rating: 4.9,
            totalRides: 89,
            pickup: "Gulshan-e-Iqbal",
            drop: "University of Karachi",
            startTime: "09:00 AM",
            returnTime: "03:00 PM",
            days: ["Mon", "Wed", "Fri"],
            availableSeats: 1,
            price: 1800,
            joined: 0,
            avatar: "SK",
            gender: "female",
            notes: "University student, needs ride for classes"
        },
        {
            id: 3,
            name: "Bilal Shah",
            type: "driver",
            rating: 4.7,
            totalRides: 203,
            vehicle: "Honda Civic",
            pickup: "Defence Phase 5",
            drop: "Korangi Industrial Area",
            startTime: "07:30 AM",
            returnTime: "06:00 PM",
            days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
            availableSeats: 3,
            price: 2200,
            joined: 2,
            avatar: "BS",
            gender: "male",
            notes: "Office commute, professional driver"
        },
        {
            id: 4,
            name: "Fatima Ali",
            type: "rider",
            rating: 4.5,
            totalRides: 45,
            pickup: "North Nazimabad",
            drop: "Saddar",
            startTime: "08:30 AM",
            returnTime: "05:00 PM",
            days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
            availableSeats: 1,
            price: 2000,
            joined: 0,
            avatar: "FA",
            gender: "female",
            notes: "Office worker, flexible with timing"
        },
        {
            id: 5,
            name: "Kamran Malik",
            type: "driver",
            rating: 4.9,
            totalRides: 127,
            vehicle: "Suzuki Cultus",
            pickup: "Gulistan-e-Jauhar",
            drop: "DHA Phase 8",
            startTime: "08:15 AM",
            returnTime: "05:45 PM",
            days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
            availableSeats: 1,
            price: 2300,
            joined: 3,
            avatar: "KM",
            gender: "male",
            notes: "Regular office commute, good conversation"
        }
    ];
    
    const commuteList = document.getElementById('commuteList');
    const noCommutes = document.getElementById('noCommutes');
    
    // Clear existing content
    commuteList.innerHTML = '';
    
    // Get saved schedules from localStorage
    const savedSchedules = JSON.parse(localStorage.getItem('commuteSchedules') || '[]');
    
    // Convert saved schedules to commute format and add to list
    savedSchedules.forEach((schedule, index) => {
        const savedCommute = {
            id: 100 + index,
            name: "You",
            type: "driver",
            rating: 5.0,
            totalRides: 0,
            vehicle: "Your Vehicle",
            pickup: schedule.pickupPoint,
            drop: schedule.dropPoint,
            startTime: formatTime(schedule.startTime),
            returnTime: schedule.returnTime ? formatTime(schedule.returnTime) : "Not specified",
            days: schedule.operatingDays.map(day => 
                day === 'mon' ? 'Mon' :
                day === 'tue' ? 'Tue' :
                day === 'wed' ? 'Wed' :
                day === 'thu' ? 'Thu' :
                day === 'fri' ? 'Fri' :
                day === 'sat' ? 'Sat' : 'Sun'
            ),
            availableSeats: schedule.availableSeats,
            price: schedule.pricePerSeat,
            joined: schedule.joinedMembers,
            avatar: "ME",
            gender: "mixed",
            notes: schedule.scheduleNotes || "My daily commute schedule",
            isMySchedule: true
        };
        commutes.unshift(savedCommute);
    });
    
    if (commutes.length === 0) {
        noCommutes.style.display = 'block';
        commuteList.style.display = 'none';
        return;
    }
    
    noCommutes.style.display = 'none';
    commuteList.style.display = 'flex';
    
    commutes.forEach(commute => {
        const commuteCard = createCommuteCard(commute);
        commuteList.appendChild(commuteCard);
    });
}

function createCommuteCard(commute) {
    const card = document.createElement('div');
    card.className = 'commute-card-item';
    card.dataset.id = commute.id;
    card.dataset.type = commute.type;
    card.dataset.pickup = commute.pickup.toLowerCase();
    card.dataset.price = commute.price;
    
    // Format days string
    const daysStr = commute.days.join(', ');
    
    card.innerHTML = `
        <div class="commute-header">
            <div class="commute-info">
                <div class="commute-avatar ${commute.type} ${commute.isMySchedule ? 'my-schedule' : ''}">
                    ${commute.avatar}
                    ${commute.isMySchedule ? '<span class="avatar-badge">YOU</span>' : ''}
                </div>
                <div class="commute-details">
                    <h4>${commute.name}</h4>
                    <span class="commute-type">${commute.type === 'driver' ? '🚗 Driver' : '👤 Rider'}</span>
                    <div class="commute-rating">
                        <i class="fas fa-star"></i>
                        <span>${commute.rating} (${commute.totalRides} rides)</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="commute-route">
            <div class="route-point">
                <div class="route-icon">
                    <i class="fas fa-map-marker-alt"></i>
                </div>
                <h5>Pickup</h5>
                <p>${commute.pickup}</p>
            </div>
            
            <div class="route-arrow">
                <i class="fas fa-long-arrow-alt-right"></i>
            </div>
            
            <div class="route-point">
                <div class="route-icon">
                    <i class="fas fa-flag-checkered"></i>
                </div>
                <h5>Drop</h5>
                <p>${commute.drop}</p>
            </div>
        </div>
        
        <div class="commute-schedule">
            <div class="schedule-item">
                <span class="schedule-value">${commute.startTime}</span>
                <span class="schedule-label">Start Time</span>
            </div>
            <div class="schedule-item">
                <span class="schedule-value">${commute.returnTime}</span>
                <span class="schedule-label">Return Time</span>
            </div>
            <div class="schedule-item">
                <span class="schedule-value">${commute.availableSeats}</span>
                <span class="schedule-label">Seats Left</span>
            </div>
        </div>
        
        ${commute.notes ? `<div class="commute-notes"><i class="fas fa-info-circle"></i> ${commute.notes}</div>` : ''}
        
        <div class="commute-action">
            <div>
                <span class="commute-price">pkr  ${commute.price}</span>
                <small>per month</small>
            </div>
            <button class="btn ${commute.isMySchedule ? 'btn-outline' : 'btn-primary'} join-commute" data-id="${commute.id}">
                <i class="fas ${commute.isMySchedule ? 'fa-edit' : 'fa-user-plus'}"></i>
                ${commute.isMySchedule ? 'Manage' : 'Join'}
            </button>
        </div>
    `;
    
    return card;
}

function formatTime(timeStr) {
    if (!timeStr) return 'Not specified';
    
    // If time is already formatted, return as is
    if (timeStr.includes('AM') || timeStr.includes('PM')) {
        return timeStr;
    }
    
    // Convert HH:MM to 12-hour format
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes.padStart(2, '0')} ${ampm}`;
}

function setupCommuteSelection() {
    // Delegate event listener to commute list
    document.getElementById('commuteList').addEventListener('click', function(e) {
        const joinButton = e.target.closest('.join-commute');
        if (joinButton) {
            const commuteId = joinButton.dataset.id;
            const commuteCard = joinButton.closest('.commute-card-item');
            const isMySchedule = commuteCard.querySelector('.commute-avatar.my-schedule');
            
            if (isMySchedule) {
                // Manage schedule
                const scheduleName = commuteCard.querySelector('h4').textContent;
                showNotification(`Managing your commute schedule`, 'info');
            } else {
                // Join commute
                joinCommute(commuteId);
            }
        }
    });
}

function joinCommute(commuteId) {
    // Get commute card
    const commuteCard = document.querySelector(`.commute-card-item[data-id="${commuteId}"]`);
    
    if (!commuteCard) return;
    
    const commuteName = commuteCard.querySelector('h4').textContent;
    const commutePrice = commuteCard.querySelector('.commute-price').textContent;
    const seatsElement = commuteCard.querySelector('.schedule-item:nth-child(3) .schedule-value');
    const availableSeats = parseInt(seatsElement.textContent);
    
    if (availableSeats <= 0) {
        showNotification('No seats available for this commute', 'error');
        return;
    }
    
    // Update UI
    const newSeats = availableSeats - 1;
    seatsElement.textContent = newSeats;
    
    // Update button
    const joinButton = commuteCard.querySelector('.join-commute');
    joinButton.innerHTML = '<i class="fas fa-check-circle"></i> Joined';
    joinButton.classList.remove('btn-primary');
    joinButton.classList.add('btn-success');
    joinButton.disabled = true;
    
    // Show success message
    showNotification(`Successfully joined ${commuteName}'s commute!`, 'success');
    
    // In real app, you would save this to backend
    const joinedCommutes = JSON.parse(localStorage.getItem('joinedCommutes') || '[]');
    joinedCommutes.push({
        commuteId: commuteId,
        commuteName: commuteName,
        price: commutePrice,
        joinedAt: new Date().toISOString()
    });
    localStorage.setItem('joinedCommutes', JSON.stringify(joinedCommutes));
}

function setupViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const listView = document.getElementById('listView');
    const mapView = document.getElementById('mapView');
    const showListBtn = document.getElementById('showList');
    
    // Initialize view
    listView.classList.add('active');
    mapView.classList.remove('active');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.dataset.view;
            
            // Update active button
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected view
            if (view === 'list') {
                listView.classList.add('active');
                mapView.classList.remove('active');
            } else {
                listView.classList.remove('active');
                mapView.classList.add('active');
            }
        });
    });
    
    // Show list button in map view
    showListBtn.addEventListener('click', function() {
        viewButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === 'list') btn.classList.add('active');
        });
        
        listView.classList.add('active');
        mapView.classList.remove('active');
    });
}

function setupCommuteFilters() {
    const filterRoute = document.getElementById('filterRoute');
    const filterTime = document.getElementById('filterTime');
    const filterType = document.getElementById('filterType');
    
    function applyFilters() {
        const selectedRoute = filterRoute.value;
        const selectedTime = filterTime.value;
        const selectedType = filterType.value;
        const allCommutes = document.querySelectorAll('.commute-card-item');
        const noCommutes = document.getElementById('noCommutes');
        const commuteList = document.getElementById('commuteList');
        
        let visibleCount = 0;
        
        allCommutes.forEach(commute => {
            const routeMatch = selectedRoute === 'all' || commute.dataset.pickup.includes(selectedRoute);
            const typeMatch = selectedType === 'all' || commute.dataset.type === selectedType;
            
            if (routeMatch && typeMatch) {
                commute.style.display = 'block';
                visibleCount++;
            } else {
                commute.style.display = 'none';
            }
        });
        
        // Show/hide "no commutes" message
        if (visibleCount === 0) {
            noCommutes.style.display = 'block';
            commuteList.style.display = 'none';
        } else {
            noCommutes.style.display = 'none';
            commuteList.style.display = 'flex';
        }
    }
    
    filterRoute.addEventListener('change', applyFilters);
    filterTime.addEventListener('change', applyFilters);
    filterType.addEventListener('change', applyFilters);
}

function filterCommutesBySearch(searchData) {
    const allCommutes = document.querySelectorAll('.commute-card-item');
    const searchStart = searchData.startLocation.toLowerCase();
    const searchEnd = searchData.endLocation.toLowerCase();
    const searchType = searchData.commuteType;
    const noCommutes = document.getElementById('noCommutes');
    const commuteList = document.getElementById('commuteList');
    
    let visibleCount = 0;
    
    allCommutes.forEach(commute => {
        const commutePickup = commute.dataset.pickup;
        const commuteType = commute.dataset.type;
        
        // Simplified matching for demo
        const matchesStart = commutePickup.includes(searchStart) || searchStart.includes('karachi');
        const matchesType = searchType === 'all' || commuteType === searchType;
        
        if (matchesStart && matchesType) {
            commute.style.display = 'block';
            visibleCount++;
        } else {
            commute.style.display = 'none';
        }
    });
    
    // Show/hide "no commutes" message
    if (visibleCount === 0) {
        noCommutes.style.display = 'block';
        commuteList.style.display = 'none';
    } else {
        noCommutes.style.display = 'none';
        commuteList.style.display = 'flex';
    }
    
    // Update filter dropdowns
    document.getElementById('filterType').value = searchType;
}

function setupSavingsCalculator() {
    const recalculateBtn = document.getElementById('recalculate');
    
    function calculateSavings() {
        const dailyDistance = parseFloat(document.getElementById('dailyDistance').value) || 20;
        const fuelRate = parseFloat(document.getElementById('fuelRate').value) || 280;
        const vehicleMileage = parseFloat(document.getElementById('vehicleMileage').value) || 12;
        const workingDays = parseFloat(document.getElementById('workingDays').value) || 22;
        
        // Calculate current cost
        const dailyFuel = dailyDistance / vehicleMileage;
        const dailyCost = dailyFuel * fuelRate;
        const monthlyCost = dailyCost * workingDays;
        
        // Calculate shared cost (assuming 4 people sharing)
        const sharedCost = monthlyCost / 4;
        
        // Calculate savings
        const savings = monthlyCost - sharedCost;
        const savingsPercentage = ((savings / monthlyCost) * 100).toFixed(0);
        
        // Update display
        document.getElementById('currentCost').textContent = `pkr  ${Math.round(monthlyCost).toLocaleString()}`;
        document.getElementById('sharedCost').textContent = `pkr  ${Math.round(sharedCost).toLocaleString()}`;
        document.getElementById('monthlySavings').textContent = `pkr  ${Math.round(savings).toLocaleString()}`;
        
        // Update savings percentage
        const savingsElement = document.querySelector('.result-card.highlight p');
        savingsElement.textContent = `You save ${savingsPercentage}%`;
    }
    
    // Initial calculation
    calculateSavings();
    
    // Recalculate on button click
    recalculateBtn.addEventListener('click', calculateSavings);
    
    // Recalculate on input change
    ['dailyDistance', 'fuelRate', 'vehicleMileage', 'workingDays'].forEach(id => {
        document.getElementById(id).addEventListener('input', calculateSavings);
    });
}

function setupPopularRoutes() {
    const popularRoutes = document.querySelectorAll('.route-card');
    
    popularRoutes.forEach(route => {
        route.addEventListener('click', function() {
            const routeText = this.querySelector('h4').textContent;
            const [start, end] = routeText.split(' → ');
            
            // Fill search form
            document.getElementById('startLocation').value = start.trim();
            document.getElementById('endLocation').value = end.trim();
            
            // Show success message
            showNotification(`Route "${routeText}" selected!`, 'success');
            
            // Trigger search
            setTimeout(() => {
                const form = document.getElementById('findCommuteForm');
                const event = new Event('submit', { cancelable: true });
                form.dispatchEvent(event);
            }, 500);
        });
    });
}

function addNewCommuteToDisplay(scheduleData) {
    const commuteList = document.getElementById('commuteList');
    const noCommutes = document.getElementById('noCommutes');
    
    // Hide no commutes message if showing
    noCommutes.style.display = 'none';
    commuteList.style.display = 'flex';
    
    // Create commute object from schedule
    const newCommute = {
        id: Date.now(),
        name: "You",
        type: "driver",
        rating: 5.0,
        totalRides: 0,
        vehicle: "Your Vehicle",
        pickup: scheduleData.pickupPoint,
        drop: scheduleData.dropPoint,
        startTime: formatTime(scheduleData.startTime),
        returnTime: scheduleData.returnTime ? formatTime(scheduleData.returnTime) : "Not specified",
        days: scheduleData.operatingDays.map(day => 
            day === 'mon' ? 'Mon' :
            day === 'tue' ? 'Tue' :
            day === 'wed' ? 'Wed' :
            day === 'thu' ? 'Thu' :
            day === 'fri' ? 'Fri' :
            day === 'sat' ? 'Sat' : 'Sun'
        ),
        availableSeats: scheduleData.availableSeats,
        price: scheduleData.pricePerSeat,
        joined: 0,
        avatar: "ME",
        gender: "mixed",
        notes: scheduleData.scheduleNotes || "My daily commute schedule",
        isMySchedule: true
    };
    
    // Create and prepend commute card
    const commuteCard = createCommuteCard(newCommute);
    commuteList.prepend(commuteCard);
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

// Add additional CSS for avatar badge
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
    
    .commute-avatar.my-schedule {
        background: linear-gradient(135deg, #059669 0%, #047857 100%);
        position: relative;
    }
    
    .avatar-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background: var(--primary);
        color: white;
        font-size: 0.6rem;
        padding: 2px 6px;
        border-radius: 10px;
        font-weight: bold;
    }
    
    .commute-card-item {
        opacity: 1 !important;
        visibility: visible !important;
    }
`;
document.head.appendChild(style);

// Initialize the page when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommutePage);
} else {
    initCommutePage();
}