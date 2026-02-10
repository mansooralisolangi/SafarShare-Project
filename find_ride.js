// Tab Switching Functionality
const tabButtons = document.querySelectorAll('.tab-btn');
const searchForms = document.querySelectorAll('.search-form');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and forms
        tabButtons.forEach(btn => btn.classList.remove('active'));
        searchForms.forEach(form => form.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Show corresponding form
        const tabId = button.getAttribute('data-tab');
        const formToShow = document.getElementById(`${tabId}-form`);
        if (formToShow) {
            formToShow.classList.add('active');
        }
    });
});

// Price Range Slider
const priceSlider = document.getElementById('price-slider');
const priceValues = document.querySelector('.price-values');
const priceSpans = priceValues.querySelectorAll('span');

priceSlider.addEventListener('input', function() {
    const value = this.value;
    priceSpans[1].textContent = `PKR ${parseInt(value).toLocaleString()}`;
});

// Filter Tag Removal
const filterTags = document.querySelectorAll('.filter-tag i');
filterTags.forEach(icon => {
    icon.addEventListener('click', function() {
        this.parentElement.remove();
    });
});

// Clear All Filters
const clearAllBtn = document.querySelector('.clear-all');
clearAllBtn.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.remove();
    });
});

// Sort Functionality
const sortSelect = document.querySelector('.sort-select');
sortSelect.addEventListener('change', function() {
    const sortValue = this.value;
    // In a real app, this would trigger an API call or re-sort the results
    console.log(`Sorting by: ${sortValue}`);
});

// Book Ride Functionality
const bookButtons = document.querySelectorAll('.ride-actions .btn-primary');
bookButtons.forEach(button => {
    button.addEventListener('click', function() {
        const rideCard = this.closest('.ride-card');
        const driverName = rideCard.querySelector('.driver-details h3').textContent;
        const price = rideCard.querySelector('.price').textContent;
        
        // Show booking modal (in a real app)
        alert(`Booking ride with ${driverName} for ${price}`);
        
        // Here you would typically show a booking modal
        // showBookingModal(driverName, price);
    });
});

// Message Driver Functionality
const messageButtons = document.querySelectorAll('.ride-actions .btn-outline');
messageButtons.forEach(button => {
    if (button.textContent.includes('Message')) {
        button.addEventListener('click', function() {
            const rideCard = this.closest('.ride-card');
            const driverName = rideCard.querySelector('.driver-details h3').textContent;
            
            // In a real app, this would open a chat interface
            alert(`Opening chat with ${driverName}`);
        });
    }
});

// Load More Rides
const loadMoreBtn = document.querySelector('.load-more .btn');
loadMoreBtn.addEventListener('click', function() {
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    this.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // In a real app, you would append new ride cards here
        alert('More rides loaded! (This is a demo)');
        this.innerHTML = '<i class="fas fa-redo"></i> Load More Rides';
        this.disabled = false;
    }, 1500);
});

// Map Toggle Functionality
const mapToggleBtn = document.querySelector('.map-toggle-btn');
mapToggleBtn.addEventListener('click', function() {
    const icon = this.querySelector('i');
    const text = this.querySelector('span');
    
    if (icon.classList.contains('fa-map-marked-alt')) {
        icon.classList.remove('fa-map-marked-alt');
        icon.classList.add('fa-list');
        text.textContent = ' Show List View';
    } else {
        icon.classList.remove('fa-list');
        icon.classList.add('fa-map-marked-alt');
        text.textContent = ' Show Map View';
    }
    
    // In a real app, this would toggle between map and list views
    alert('Switching between map and list views would happen here');
});

// Initialize date inputs with today's date
const dateInputs = document.querySelectorAll('input[type="date"]');
const today = new Date().toISOString().split('T')[0];
dateInputs.forEach(input => {
    if (!input.value) {
        input.value = today;
    }
    
    // Set min date to today
    input.min = today;
});

// Form Validation
const searchFormsAll = document.querySelectorAll('.search-form form');
searchFormsAll.forEach(form => {
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fromInput = this.querySelector('input[placeholder*="from"], input[placeholder*="From"]');
            const toInput = this.querySelector('input[placeholder*="to"], input[placeholder*="To"]');
            
            if (!fromInput.value.trim() || !toInput.value.trim()) {
                alert('Please enter both pickup and destination locations');
                return;
            }
            
            // In a real app, submit the form or make API call
            console.log('Search submitted:', {
                from: fromInput.value,
                to: toInput.value
            });
        });
    }
});

// Initialize tooltips
const initTooltips = () => {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            
            this.tooltipElement = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltipElement) {
                this.tooltipElement.remove();
                this.tooltipElement = null;
            }
        });
    });
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initTooltips();
    
    // Update result count based on filters (simulated)
    const resultCount = document.querySelector('.result-count');
    const checkboxes = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    
    const updateResultCount = () => {
        // In a real app, this would be based on actual filtered results
        const baseCount = 12;
        const activeFilters = document.querySelectorAll('.filter-tag').length;
        const newCount = Math.max(4, baseCount - activeFilters * 2);
        resultCount.textContent = `(${newCount} rides found)`;
    };
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateResultCount);
    });
});