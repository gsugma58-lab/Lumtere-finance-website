/**
 * Lumtere Finance - Forms JavaScript
 * Form validation, calculators, and interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================================================
    // ELIGIBILITY CHECKER
    // ==========================================================================
    
    window.nextStep = function(step) {
        const currentStep = document.querySelector('.form-step.active');
        const nextStepElement = document.getElementById(`step${step}`);
        
        if (currentStep && nextStepElement) {
            currentStep.classList.remove('active');
            nextStepElement.classList.add('active');
            
            const dots = document.querySelectorAll('.step-dot');
            dots.forEach((dot, index) => {
                if (index < step) dot.classList.add('active');
                else dot.classList.remove('active');
            });
        }
    };
    
    window.prevStep = function(step) {
        const currentStep = document.querySelector('.form-step.active');
        const prevStepElement = document.getElementById(`step${step}`);
        
        if (currentStep && prevStepElement) {
            currentStep.classList.remove('active');
            prevStepElement.classList.add('active');
            
            const dots = document.querySelectorAll('.step-dot');
            dots.forEach((dot, index) => {
                if (index < step) dot.classList.add('active');
                else dot.classList.remove('active');
            });
        }
    };
    
    window.checkEligibility = function() {
        const timeInBusiness = document.querySelector('input[name="timeInBusiness"]:checked');
        if (!timeInBusiness) {
            alert('Please complete all steps first');
            return;
        }
        
        const timeValue = timeInBusiness.value;
        let resultAmount = '', resultRate = '';
        
        if (timeValue === '<6') {
            resultAmount = 'K1,000 - K2,500';
            resultRate = '28% - 30%';
        } else if (timeValue === '6-12') {
            resultAmount = 'K1,000 - K5,000';
            resultRate = '25% - 30%';
        } else if (timeValue === '1-2') {
            resultAmount = 'K2,500 - K15,000';
            resultRate = '20% - 28%';
        } else {
            resultAmount = 'K5,000 - K25,000';
            resultRate = '14% - 25%';
        }
        
        document.getElementById('resultAmount').textContent = resultAmount;
        document.getElementById('resultRate').textContent = resultRate;
        
        document.getElementById('step3').classList.remove('active');
        document.getElementById('resultsPanel').classList.add('show');
    };
    
    window.showTab = function(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        
        const clickedBtn = Array.from(document.querySelectorAll('.tab-btn')).find(
            btn => btn.textContent.toLowerCase().includes(tabName)
        );
        if (clickedBtn) clickedBtn.classList.add('active');
        
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
    const hiddenLoanAmount = document.getElementById('hiddenLoanAmount');
    const hiddenLoanTerm = document.getElementById('hiddenLoanTerm');
    
    if (loanSlider) {
        let currentTerm = 6;
        
        termOptions.forEach(option => {
            option.addEventListener('click', function() {
                termOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                currentTerm = this.dataset.term;
                const summaryTerm = document.getElementById('summaryTerm');
                if (summaryTerm) summaryTerm.textContent = currentTerm + ' months';
                if (hiddenLoanTerm) hiddenLoanTerm.value = currentTerm;
                calculateLoan();
            });
        });
        
        loanSlider.addEventListener('input', calculateLoan);
        
        function calculateLoan() {
            const amount = parseInt(loanSlider.value);
            let rate = 0;
            
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
            
            const total = amount + (amount * rate / 100);
            
            // Format with commas
            const formattedAmount = amount.toLocaleString();
            
            if (loanAmount) loanAmount.textContent = 'K' + formattedAmount;
            if (summaryAmount) summaryAmount.textContent = 'K' + formattedAmount;
            if (summaryRate) summaryRate.textContent = rate + '%';
            if (summaryTotal) summaryTotal.textContent = 'K' + Math.round(total).toLocaleString();
            
            // Update hidden fields for form submission
            if (hiddenLoanAmount) hiddenLoanAmount.value = amount;
        }
        
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
        fileUpload.addEventListener('click', () => fileInput.click());
        
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
            handleFiles(Array.from(e.dataTransfer.files));
        });
        
        fileInput.addEventListener('change', () => {
            handleFiles(Array.from(fileInput.files));
        });
        
        function handleFiles(newFiles) {
            // Filter for allowed file types
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            const validFiles = newFiles.filter(file => allowedTypes.includes(file.type));
            
            if (validFiles.length !== newFiles.length) {
                alert('Some files were rejected. Only PDF, JPG, and PNG files are allowed.');
            }
            
            files.push(...validFiles);
            displayFiles();
            
            // Update file input for FormSubmit
            // Note: FormSubmit's free plan doesn't support file uploads
            // This will still work but files won't be attached in free version
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
                        <div><i class="fas fa-check-circle"></i> ${file.name} (${(file.size/1024).toFixed(1)} KB)</div>
                        <div class="remove" onclick="removeFile(${index})"><i class="fas fa-times"></i></div>
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
    // FORM SUBMISSION HANDLING - UPDATED FOR FORMSUBMIT
    // ==========================================================================
    const applicationForm = document.getElementById('applicationForm');
    
    if (applicationForm) {
        applicationForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Stop normal form submission
            
            // Validate terms checkbox
            const termsCheckbox = document.getElementById('terms');
            if (!termsCheckbox.checked) {
                alert('Please accept the Terms & Conditions to continue.');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;
            
            try {
                // Update application date
                const dateField = document.getElementById('applicationDate');
                if (dateField) {
                    dateField.value = new Date().toLocaleString();
                }
                
                // Create FormData from the form
                const formData = new FormData(this);
                
                // Add files to FormData
                files.forEach((file, index) => {
                    formData.append(`documents_${index}`, file);
                });
                
                // Use the AJAX endpoint for FormSubmit
                const response = await fetch('https://formsubmit.co/ajax/gparak37@gmail.com', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Show success modal
                    const modal = document.getElementById('successModal');
                    if (modal) modal.classList.add('active');
                    
                    // Reset form
                    this.reset();
                    
                    // Clear file list
                    files.length = 0;
                    displayFiles();
                    
                    // Reset loan calculator to default
                    if (loanSlider) {
                        loanSlider.value = 7500;
                        calculateLoan();
                    }
                    
                    // Reset term selection
                    if (termOptions.length > 0) {
                        termOptions.forEach(opt => opt.classList.remove('selected'));
                        termOptions[0]?.classList.add('selected');
                        if (hiddenLoanTerm) hiddenLoanTerm.value = '6';
                    }
                    
                } else {
                    alert('Submission failed. Please try again or email us directly.');
                    console.error('FormSubmit error:', result);
                }
                
            } catch (error) {
                console.error('Submission error:', error);
                
                // Fallback: Try regular form submission if AJAX fails
                const useFallback = confirm('Network error. Would you like to submit via email instead?');
                if (useFallback) {
                    // Remove the AJAX handler and submit normally
                    applicationForm.removeEventListener('submit', arguments.callee);
                    applicationForm.submit();
                } else {
                    alert('Please try again or contact us at +675 7946 0138');
                }
            } finally {
                // Restore button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // ==========================================================================
    // MODAL HANDLING
    // ==========================================================================
    window.closeModal = function() {
        const modal = document.getElementById('successModal');
        if (modal) modal.classList.remove('active');
    };
    
    window.startChat = function() {
        alert('Live chat would open here. For demo purposes, please call or email us.');
        return false;
    };
    
    // Print functionality
    const downloadBtn = document.querySelector('.download-btn');
    if (downloadBtn && downloadBtn.getAttribute('href') === '#') {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.print();
        });
    }
    
    // ==========================================================================
    // ADDITIONAL VALIDATION
    // ==========================================================================
    
    // Phone number validation for PNG format
    const phoneInput = document.querySelector('input[name="Phone Number"]');
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            const phone = this.value.replace(/\D/g, '');
            if (phone && !phone.match(/^(675|0)?[7-8]\d{6}$/)) {
                this.style.borderColor = 'red';
                // Optional: show warning but don't prevent submission
                const warning = document.createElement('small');
                warning.style.color = 'red';
                warning.textContent = 'Please enter a valid PNG phone number';
                if (!this.nextElementSibling?.classList.contains('phone-warning')) {
                    warning.classList.add('phone-warning');
                    this.parentNode.appendChild(warning);
                }
            } else {
                this.style.borderColor = '';
                const warning = this.parentNode.querySelector('.phone-warning');
                if (warning) warning.remove();
            }
        });
    }
    
    // Email validation
    const emailInput = document.querySelector('input[name="Email"]');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value;
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email && !emailPattern.test(email)) {
                this.style.borderColor = 'red';
            } else {
                this.style.borderColor = '';
            }
        });
    }
});