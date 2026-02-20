// ===== CARPOOL PAGE JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    initCarpoolPage();
});

function initCarpoolPage() {
    // Initialize FAQ Accordion
    initFAQAccordion();
    
    // Initialize Cost Calculator
    initCostCalculator();
    
    // Initialize Interactive Elements
    initInteractiveElements();
    
    // Initialize Smooth Scrolling
    initSmoothScrolling();
    
    // Initialize Service Features
    initServiceFeatures();
}

// FAQ Accordion
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // If it wasn't active, open it
            if (!isActive) {
                faqItem.classList.add('active');
                
                // Scroll to the FAQ item if it's not fully visible
                if (!isElementInViewport(faqItem)) {
                    faqItem.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }
        });
    });
}

// Cost Calculator
function initCostCalculator() {
    // Add calculator HTML to the page
    const calculatorHTML = `
        <div class="cost-calculator">
            <h4><i class="fas fa-calculator"></i> Calculate Your Savings</h4>
            <div class="calculator-inputs">
                <div class="input-group">
                    <label for="distance">Distance (km):</label>
                    <input type="number" id="distance" min="1" max="2000" value="150" placeholder="Enter distance">
                </div>
                <div class="input-group">
                    <label for="fuel-efficiency">Fuel Efficiency (km/l):</label>
                    <select id="fuel-efficiency">
                        <option value="8">8 km/l (SUV/Truck)</option>
                        <option value="12" selected>12 km/l (Sedan)</option>
                        <option value="15">15 km/l (Compact Car)</option>
                        <option value="20">20 km/l (Hybrid)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label for="fuel-price">Fuel Price (PKR/l):</label>
                    <input type="number" id="fuel-price" min="50" max="500" value="280" placeholder="Current fuel price">
                </div>
                <div class="input-group">
                    <label for="passengers">Passengers (including driver):</label>
                    <select id="passengers">
                        <option value="2">2 persons</option>
                        <option value="3" selected>3 persons</option>
                        <option value="4">4 persons</option>
                        <option value="5">5 persons</option>
                    </select>
                </div>
            </div>
            <button id="calculate-btn" class="btn btn-primary">
                <i class="fas fa-calculator"></i> Calculate Savings
            </button>
            <div class="calculator-result" id="calculator-result"></div>
        </div>
    `;
    
    // Insert calculator after cost breakdown
    const costBreakdown = document.querySelector('.cost-breakdown');
    if (costBreakdown) {
        costBreakdown.insertAdjacentHTML('afterend', calculatorHTML);
        
        // Add event listener to calculate button
        document.getElementById('calculate-btn').addEventListener('click', calculateSavings);
        
        // Calculate on input changes
        document.querySelectorAll('.calculator-inputs input, .calculator-inputs select').forEach(input => {
            input.addEventListener('input', calculateSavings);
        });
        
        // Calculate initial savings
        calculateSavings();
    }
}

function calculateSavings() {
    const distance = parseFloat(document.getElementById('distance').value) || 150;
    const fuelEfficiency = parseFloat(document.getElementById('fuel-efficiency').value) || 12;
    const fuelPrice = parseFloat(document.getElementById('fuel-price').value) || 280;
    const passengers = parseInt(document.getElementById('passengers').value) || 3;
    
    // Validate inputs
    if (distance <= 0 || fuelEfficiency <= 0 || fuelPrice <= 0 || passengers < 2) {
        showError('Please enter valid values in all fields.');
        return;
    }
    
    // Calculate fuel cost
    const fuelRequired = distance / fuelEfficiency;
    const fuelCost = fuelRequired * fuelPrice;
    
    // Additional costs (tolls, maintenance, wear & tear)
    const additionalCosts = fuelCost * 0.3; // 30% of fuel cost
    const totalCost = fuelCost + additionalCosts;
    
    // Calculate per person cost
    const costPerPerson = totalCost / passengers;
    const savingsPerPerson = totalCost - costPerPerson;
    
    // Update result display
    const resultHTML = `
        <div class="result-item">
            <span>Total Fuel Cost:</span>
            <strong>PKR ${Math.round(fuelCost).toLocaleString()}</strong>
        </div>
        <div class="result-item">
            <span>Additional Costs (tolls, maintenance):</span>
            <strong>PKR ${Math.round(additionalCosts).toLocaleString()}</strong>
        </div>
        <div class="result-item total">
            <span>Total Trip Cost:</span>
            <strong>PKR ${Math.round(totalCost).toLocaleString()}</strong>
        </div>
        <div class="result-item">
            <span>Cost per Person:</span>
            <strong>PKR ${Math.round(costPerPerson).toLocaleString()}</strong>
        </div>
        <div class="result-item savings">
            <span>Savings per Person:</span>
            <strong>PKR ${Math.round(savingsPerPerson).toLocaleString()}</strong>
        </div>
        <div class="result-item">
            <span>Total Group Savings:</span>
            <strong>PKR ${Math.round(savingsPerPerson * passengers).toLocaleString()}</strong>
        </div>
    `;
    
    document.getElementById('calculator-result').innerHTML = resultHTML;
    
    // Add animation to result
    const resultContainer = document.getElementById('calculator-result');
    resultContainer.style.animation = 'none';
    setTimeout(() => {
        resultContainer.style.animation = 'fadeIn 0.5s ease';
    }, 10);
}

function showError(message) {
    document.getElementById('calculator-result').innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        </div>
    `;
}

// Interactive Elements
function initInteractiveElements() {
    // Add hover effects to all cards
    const interactiveCards = document.querySelectorAll('.feature, .safety-card, .step');
    
    interactiveCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 15px 30px rgba(40, 167, 69, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
    
    // Add click effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Add statistics counter animation
    initStatisticsCounter();
}

// Statistics Counter Animation
function initStatisticsCounter() {
    const stats = document.querySelectorAll('.stat h3');
    
    stats.forEach(stat => {
        const finalValue = parseFloat(stat.textContent.replace(/[^0-9.]/g, ''));
        const suffix = stat.textContent.replace(/[0-9.]/g, '');
        let currentValue = 0;
        const increment = finalValue / 50; // 50 steps
        const duration = 1500; // 1.5 seconds
        
        const counter = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(counter);
            }
            
            // Format the number
            let displayValue;
            if (suffix.includes('★')) {
                displayValue = currentValue.toFixed(1) + suffix;
            } else {
                displayValue = Math.round(currentValue).toLocaleString() + suffix;
            }
            
            stat.textContent = displayValue;
        }, duration / 50);
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal page anchors
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Service Features
function initServiceFeatures() {
    // Add animation delay to feature cards
    const featureCards = document.querySelectorAll('.feature');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animation = 'fadeInUp 0.5s ease forwards';
        card.style.opacity = '0';
    });
    
    // Add intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Utility Functions
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add CSS animations
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        
        .error-message {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 15px;
            background: #f8d7da;
            color: #721c24;
            border-radius: var(--radius-md);
            border: 1px solid #f5c6cb;
            margin-top: 15px;
        }
        
        .error-message i {
            font-size: 1.2rem;
        }
    `;
    document.head.appendChild(style);
}

// Initialize animation styles
addAnimationStyles();

// Update header navigation to show active service
function updateNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPath || 
            link.getAttribute('href').includes('carpool')) {
            link.classList.add('active');
        }
    });
}

// Initialize on page load
window.addEventListener('load', function() {
    updateNavigation();
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
// ===== CARPOOL PAGE JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    initCarpoolPage();
});

function initCarpoolPage() {
    // Initialize FAQ Accordion
    initFAQAccordion();
    
    // Initialize Cost Calculator
    initCostCalculator();
    
    // Initialize Interactive Elements
    initInteractiveElements();
    
    // Initialize Smooth Scrolling
    initSmoothScrolling();
    
    // Initialize Service Features
    initServiceFeatures();
}

// FAQ Accordion
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // If it wasn't active, open it
            if (!isActive) {
                faqItem.classList.add('active');
                
                // Scroll to the FAQ item if it's not fully visible
                if (!isElementInViewport(faqItem)) {
                    faqItem.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }
        });
    });
}

// Cost Calculator
function initCostCalculator() {
    // Add calculator HTML to the page
    const calculatorHTML = `
        <div class="cost-calculator">
            <h4><i class="fas fa-calculator"></i> Calculate Your Savings</h4>
            <div class="calculator-inputs">
                <div class="input-group">
                    <label for="distance">Distance (km):</label>
                    <input type="number" id="distance" min="1" max="2000" value="150" placeholder="Enter distance">
                </div>
                <div class="input-group">
                    <label for="fuel-efficiency">Fuel Efficiency (km/l):</label>
                    <select id="fuel-efficiency">
                        <option value="8">8 km/l (SUV/Truck)</option>
                        <option value="12" selected>12 km/l (Sedan)</option>
                        <option value="15">15 km/l (Compact Car)</option>
                        <option value="20">20 km/l (Hybrid)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label for="fuel-price">Fuel Price (PKR/l):</label>
                    <input type="number" id="fuel-price" min="50" max="500" value="280" placeholder="Current fuel price">
                </div>
                <div class="input-group">
                    <label for="passengers">Passengers (including driver):</label>
                    <select id="passengers">
                        <option value="2">2 persons</option>
                        <option value="3" selected>3 persons</option>
                        <option value="4">4 persons</option>
                        <option value="5">5 persons</option>
                    </select>
                </div>
            </div>
            <button id="calculate-btn" class="btn btn-primary">
                <i class="fas fa-calculator"></i> Calculate Savings
            </button>
            <div class="calculator-result" id="calculator-result"></div>
        </div>
    `;
    
    // Insert calculator after cost breakdown
    const costBreakdown = document.querySelector('.cost-breakdown');
    if (costBreakdown) {
        costBreakdown.insertAdjacentHTML('afterend', calculatorHTML);
        
        // Add event listener to calculate button
        document.getElementById('calculate-btn').addEventListener('click', calculateSavings);
        
        // Calculate on input changes
        document.querySelectorAll('.calculator-inputs input, .calculator-inputs select').forEach(input => {
            input.addEventListener('input', calculateSavings);
        });
        
        // Calculate initial savings
        calculateSavings();
    }
}

function calculateSavings() {
    const distance = parseFloat(document.getElementById('distance').value) || 150;
    const fuelEfficiency = parseFloat(document.getElementById('fuel-efficiency').value) || 12;
    const fuelPrice = parseFloat(document.getElementById('fuel-price').value) || 280;
    const passengers = parseInt(document.getElementById('passengers').value) || 3;
    
    // Validate inputs
    if (distance <= 0 || fuelEfficiency <= 0 || fuelPrice <= 0 || passengers < 2) {
        showError('Please enter valid values in all fields.');
        return;
    }
    
    // Calculate fuel cost
    const fuelRequired = distance / fuelEfficiency;
    const fuelCost = fuelRequired * fuelPrice;
    
    // Additional costs (tolls, maintenance, wear & tear)
    const additionalCosts = fuelCost * 0.3; // 30% of fuel cost
    const totalCost = fuelCost + additionalCosts;
    
    // Calculate per person cost
    const costPerPerson = totalCost / passengers;
    const savingsPerPerson = totalCost - costPerPerson;
    
    // Update result display
    const resultHTML = `
        <div class="result-item">
            <span>Total Fuel Cost:</span>
            <strong>PKR ${Math.round(fuelCost).toLocaleString()}</strong>
        </div>
        <div class="result-item">
            <span>Additional Costs (tolls, maintenance):</span>
            <strong>PKR ${Math.round(additionalCosts).toLocaleString()}</strong>
        </div>
        <div class="result-item total">
            <span>Total Trip Cost:</span>
            <strong>PKR ${Math.round(totalCost).toLocaleString()}</strong>
        </div>
        <div class="result-item">
            <span>Cost per Person:</span>
            <strong>PKR ${Math.round(costPerPerson).toLocaleString()}</strong>
        </div>
        <div class="result-item savings">
            <span>Savings per Person:</span>
            <strong>PKR ${Math.round(savingsPerPerson).toLocaleString()}</strong>
        </div>
        <div class="result-item">
            <span>Total Group Savings:</span>
            <strong>PKR ${Math.round(savingsPerPerson * passengers).toLocaleString()}</strong>
        </div>
    `;
    
    document.getElementById('calculator-result').innerHTML = resultHTML;
    
    // Add animation to result
    const resultContainer = document.getElementById('calculator-result');
    resultContainer.style.animation = 'none';
    setTimeout(() => {
        resultContainer.style.animation = 'fadeIn 0.5s ease';
    }, 10);
}

function showError(message) {
    document.getElementById('calculator-result').innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        </div>
    `;
}

// Interactive Elements
function initInteractiveElements() {
    // Add hover effects to all cards
    const interactiveCards = document.querySelectorAll('.feature, .safety-card, .step');
    
    interactiveCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 15px 30px rgba(40, 167, 69, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
    
    // Add click effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Add statistics counter animation
    initStatisticsCounter();
}

// Statistics Counter Animation
function initStatisticsCounter() {
    const stats = document.querySelectorAll('.stat h3');
    
    stats.forEach(stat => {
        const finalValue = parseFloat(stat.textContent.replace(/[^0-9.]/g, ''));
        const suffix = stat.textContent.replace(/[0-9.]/g, '');
        let currentValue = 0;
        const increment = finalValue / 50; // 50 steps
        const duration = 1500; // 1.5 seconds
        
        const counter = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(counter);
            }
            
            // Format the number
            let displayValue;
            if (suffix.includes('★')) {
                displayValue = currentValue.toFixed(1) + suffix;
            } else {
                displayValue = Math.round(currentValue).toLocaleString() + suffix;
            }
            
            stat.textContent = displayValue;
        }, duration / 50);
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal page anchors
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Service Features
function initServiceFeatures() {
    // Add animation delay to feature cards
    const featureCards = document.querySelectorAll('.feature');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animation = 'fadeInUp 0.5s ease forwards';
        card.style.opacity = '0';
    });
    
    // Add intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Utility Functions
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add CSS animations
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        
        .error-message {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 15px;
            background: #f8d7da;
            color: #721c24;
            border-radius: var(--radius-md);
            border: 1px solid #f5c6cb;
            margin-top: 15px;
        }
        
        .error-message i {
            font-size: 1.2rem;
        }
    `;
    document.head.appendChild(style);
}

// Initialize animation styles
addAnimationStyles();

// Update header navigation to show active service
function updateNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPath || 
            link.getAttribute('href').includes('carpool')) {
            link.classList.add('active');
        }
    });
}

// Initialize on page load
window.addEventListener('load', function() {
    updateNavigation();
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});