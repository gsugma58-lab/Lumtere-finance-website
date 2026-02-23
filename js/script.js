javascript
/**
 * Lumtere Finance - Forms JavaScript
 * Form validation, calculators, and interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================================================
    // ELIGIBILITY CHECKER
    // ==========================================================================
    
    // Step navigation
    window.nextStep = function(step) {
        const currentStep = document.querySelector('.form-step.active');
        const nextStepElement = document.getElementById(`step${step}`);
        
        if (currentStep && nextStepElement) {
            currentStep.classList.remove('active');
            nextStepElement.classList.add('active');
            
            // Update step indicators
            const dots = document.querySelectorAll('.step-dot');
            dots.forEach((dot, index) => {
                if (index < step) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    };
    
    window.prevStep = function(step) {
        const currentStep = document.querySelector('.form-step.active');
        const prevStepElement = document.getElementById(`step${step}`);
        
        if (currentStep && prevStepElement) {
            currentStep.classList.remove('active');
            prevStepElement.classList.add('active');
            
            // Update step indicators
            const dots = document.querySelectorAll('.step-dot');
            dots.forEach((dot, index) => {
                if (index < step) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    };
    
    window.checkEligibility = function() {
        // Get form values
        const businessType = document.querySelector('input[name="businessType"]:checked');
        const timeInBusiness = document.querySelector('input[name="timeInBusiness"]:checked');
        const loanAmount = document.getElementById('loanAmount');
        
        if (!businessType || !timeInBusiness || !loanAmount) {
            alert('Please complete all steps first');
            return;
        }
        
        const businessTypeValue = businessType.value;
        const timeInBusinessValue = timeInBusiness.value;
        const loanAmountValue = loanAmount.value;
        
        // Simple logic based on time in business
        let resultAmount = '';
        let resultRate = '';
        
        if (timeInBusinessValue === '<6') {
            resultAmount = 'K1,000 - K2,500';
            resultRate = '28% - 30%';
        } else if (timeInBusinessValue === '6-12') {
            resultAmount = 'K1,000 - K5,000';
            resultRate = '25% - 30%';
        } else if (timeInBusinessValue === '1-2') {
            resultAmount = 'K2,500 - K15,000';
            resultRate = '20% - 28%';
        } else {
            resultAmount = 'K5,000 - K25,000';
            resultRate = '14% - 25%';
        }
        
        // Update results
        const resultAmountEl = document.getElementById('resultAmount');
        const resultRateEl = document.getElementById('resultRate');
        
        if (resultAmountEl) resultAmountEl.textContent = resultAmount;
        if (resultRateEl) resultRateEl.textContent = resultRate;
        
        // Hide step 3 and show results
        const step3 = document.getElementById('step3');
        const resultsPanel = document.getElementById('resultsPanel');
        
        if (step3) step3.classList.remove('active');
        if (resultsPanel) resultsPanel.classList.add('show');
    };
    
    // Tab switching for requirements
    window.showTab = function(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Find the clicked button and add active class
        const clickedBtn = Array.from(document.querySelectorAll('.tab-btn')).find(
            btn => btn.textContent.toLowerCase().includes(tabName)
        );
        if (clickedBtn) clickedBtn.classList.add('active');
        
        // Show selected tab
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        
        const targetTab = document.getElementById(`tab-${tabName}`);
        if (targetTab) targetTab.classList.add('active');
    };
    
    // ==========================================================================
    // LOAN CALCULATOR (APPLY PAGE)
    // ==========================================================================
    const loanSlider = document.getElementById('loanSlider');
    const loanAmount = document.getElementById('loanAmount');
    const summaryAmount = document.getElementById('summaryAmount');
    const summaryRate = document.getElementById('summaryRate');
    const summaryTotal = document.getElementById('summaryTotal');
    const termOptions = document.querySelectorAll('.term-option');
    
    if (loanSlider) {
        // Set default term
        let currentTerm = 6;
        
        // Term option click handlers
        termOptions.forEach(option => {
            option.addEventListener('click', function() {
                termOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                currentTerm = this.dataset.term;
                
                const summaryTerm = document.getElementById('summaryTerm');
                if (summaryTerm) summaryTerm.textContent = currentTerm + ' months';
                
                calculateLoan();
            });
        });
        
        // Slider input handler
        loanSlider.addEventListener('input', calculateLoan);
        
        function calculateLoan() {
            const amount = parseInt(loanSlider.value);
            let rate = 0;
            
            // Determine rate based on amount
            if (amount <= 2500) rate = 30;
            else if (amount <= 5000) rate = 28;
            else if (amount <= 7500) rate = 25;
            else if (amount <= 10000) rate = 22;
            else if (amount <= 12500) rate = 20;
            else if (amount <= 15000) rate = 18;
            else if (amount <= 17500) rate = 17;
            else if (amount <= 20000) rate = 16;
            else if (amount <= 22500) rate = 15;
            else rate = 14;
            
            const interest = amount * (rate / 100);
            const total = amount + interest;
            
            // Format currency
            const formattedAmount = 'K' + amount.toLocaleString();
            const formattedTotal = 'K' + total.toLocaleString();
            
            // Update UI
            if (loanAmount) loanAmount.textContent = formattedAmount;
            if (summaryAmount) summaryAmount.textContent = formattedAmount;
            if (summaryRate) summaryRate.textContent = rate + '%';
            if (summaryTotal) summaryTotal.textContent = formattedTotal;
        }
        
        // Initial calculation
        calculateLoan();
    }
    
    // ==========================================================================
    // FILE UPLOAD HANDLER (APPLY PAGE)
    // ==========================================================================
    const fileUpload = document.getElementById('fileUpload');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const files = [];
    
    if (fileUpload && fileInput) {
        fileUpload.addEventListener('click', () => {
            fileInput.click();
        });
        
        fileUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUpload.style.borderColor = 'var(--brand)';
            fileUpload.style.background = 'var(--brand-light)';
        });
        
        fileUpload.addEventListener('dragleave', () => {
            fileUpload.style.borderColor = 'rgba(45,126,233,0.3)';
            fileUpload.style.background = 'transparent';
        });
        
        fileUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUpload.style.borderColor = 'rgba(45,126,233,0.3)';
            fileUpload.style.background = 'transparent';
            
            const droppedFiles = Array.from(e.dataTransfer.files);
            handleFiles(droppedFiles);
        });
        
        fileInput.addEventListener('change', () => {
            const selectedFiles = Array.from(fileInput.files);
            handleFiles(selectedFiles);
        });
        
        function handleFiles(newFiles) {
            files.push(...newFiles);
            displayFiles();
        }
        
        function displayFiles() {
            if (!fileList) return;
            
            if (files.length > 0) {
                fileList.style.display = 'block';
                fileList.innerHTML = '';
                
                files.forEach((file, index) => {
                    const fileItem = document.createElement('div');
                    fileItem.className = 'file-item';
                    fileItem.innerHTML = `
                        <div>
                            <i class="fas fa-check-circle"></i>
                            ${file.name}
                        </div>
                        <div class="remove" onclick="removeFile(${index})">
                            <i class="fas fa-times"></i>
                        </div>
                    `;
                    fileList.appendChild(fileItem);
                });
            } else {
                fileList.style.display = 'none';
            }
        }
        
        window.removeFile = function(index) {
            files.splice(index, 1);
            displayFiles();
        };
    }
    
    // ==========================================================================
    // CONTACT FORM SUBMISSION
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const firstName = document.getElementById('firstName');
            const lastName = document.getElementById('lastName');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');
            const consent = document.getElementById('consent');
            
            if (!firstName || !lastName || !email || !subject || !message || !consent) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Show success modal
            const modal = document.getElementById('successModal');
            if (modal) {
                modal.classList.add('active');
            }
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // ==========================================================================
    // APPLICATION FORM SUBMISSION
    // ==========================================================================
    const applicationForm = document.getElementById('applicationForm');
    
    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check terms agreement
            const termsCheckbox = document.getElementById('terms');
            if (!termsCheckbox || !termsCheckbox.checked) {
                alert('Please agree to the Terms & Conditions');
                return;
            }
            
            // Generate reference number
            const ref = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
            const refSpan = document.getElementById('refNumber');
            if (refSpan) refSpan.textContent = ref;
            
            // Show modal
            const modal = document.getElementById('successModal');
            if (modal) {
                modal.classList.add('active');
            }
        });
    }
    
    // ==========================================================================
    // MODAL HANDLING
    // ==========================================================================
    window.closeModal = function() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.remove('active');
        }
        
        // Redirect to home if specified
        if (window.location.pathname.includes('apply.html') || 
            window.location.pathname.includes('contact.html')) {
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        }
    };
    
    // ==========================================================================
    // LIVE CHAT FUNCTION
    // ==========================================================================
    window.startChat = function() {
        alert('Live chat would open here. For demo purposes, please call or email us.');
        return false;
    };
    
    // ==========================================================================
    // PRINT FUNCTIONALITY
    // ==========================================================================
    const downloadBtn = document.querySelector('.download-btn');
    if (downloadBtn && downloadBtn.getAttribute('href') === '#') {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.print();
        });
    }