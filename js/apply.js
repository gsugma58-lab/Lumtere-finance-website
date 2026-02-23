// Apply page specific JavaScript - ALL form code goes here
(function() {
    // DOM elements
    const empRadios = document.querySelectorAll('input[name="empType"]');
    const loanTypeRadios = document.querySelectorAll('input[name="loantype"]');
    const employedBlock = document.getElementById('employedBlock');
    const selfBlock = document.getElementById('selfemployedBlock');
    const paySlipInput = document.getElementById('paySlip');
    const collateralText = document.getElementById('collateral');
    const agreeCheck = document.getElementById('agreeTerms');
    const submitBtn = document.getElementById('submitBtn');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const phoneNumber = document.getElementById('Number');
    const email = document.getElementById('Email');
    const occupation = document.getElementById('occupation');
    const locationField = document.getElementById('location');
    const address = document.getElementById('address');
    const reasonText = document.getElementById('Text');
    const feedbackDiv = document.getElementById('form-feedback');

    // --- toggle employment blocks ---
    function toggleEmploymentBlocks() {
        const selected = document.querySelector('input[name="empType"]:checked').value;
        if (selected === 'employed') {
            employedBlock.style.display = 'block';
            selfBlock.style.display = 'none';
            paySlipInput.setAttribute('required', 'required');
            collateralText.removeAttribute('required');
            collateralText.value = '';
        } else {
            employedBlock.style.display = 'none';
            selfBlock.style.display = 'block';
            paySlipInput.removeAttribute('required');
            paySlipInput.value = '';
            collateralText.setAttribute('required', 'required');
        }
        updateSubmitButton();
    }

    // Add change listeners to employment type radios
    empRadios.forEach(radio => {
        radio.addEventListener('change', toggleEmploymentBlocks);
    });

    // Add change listeners to loan type radios
    loanTypeRadios.forEach(radio => {
        radio.addEventListener('change', updateSubmitButton);
    });

    toggleEmploymentBlocks();

    // --- form validation ---
    function validateForm() {
        // Check if terms are agreed
        if (!agreeCheck.checked) {
            return false;
        }
        
        // Check all required text fields
        if (!firstName.value.trim() || 
            !lastName.value.trim() || 
            !phoneNumber.value.trim() || 
            !email.value.trim() || 
            !occupation.value.trim() || 
            !locationField.value.trim() || 
            !address.value.trim() || 
            !reasonText.value.trim()) {
            return false;
        }
        
        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value.trim())) {
            return false;
        }
        
        // Validate phone format
        const phonePattern = /^[0-9+\-\s]{5,}$/;
        if (!phonePattern.test(phoneNumber.value.trim())) {
            return false;
        }

        // Check employment-specific requirements
        const empType = document.querySelector('input[name="empType"]:checked').value;
        if (empType === 'employed') {
            // For employed: check if payslip is uploaded
            if (!paySlipInput.files || paySlipInput.files.length === 0) {
                return false;
            }
            
            const file = paySlipInput.files[0];
            if (file.size > 8 * 1024 * 1024) {
                feedbackDiv.innerText = 'File size must be less than 8MB';
                return false;
            }
            
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                feedbackDiv.innerText = 'Please upload PDF, JPG, or PNG file';
                return false;
            }
        } else {
            // For self-employed: check if collateral is described
            if (!collateralText.value.trim()) {
                return false;
            }
        }
        
        return true;
    }

    function updateSubmitButton() {
        const isValid = validateForm();
        submitBtn.disabled = !isValid;
        
        if (isValid) {
            feedbackDiv.innerHTML = '';
        }
    }

    // Add listeners to all input fields
    [firstName, lastName, phoneNumber, email, occupation, locationField, address, reasonText, collateralText].forEach(el => {
        if (el) {
            el.addEventListener('input', updateSubmitButton);
            el.addEventListener('change', updateSubmitButton);
        }
    });
    
    // Add listener to payslip file input
    if (paySlipInput) {
        paySlipInput.addEventListener('change', function() {
            // Show file info
            if (this.files && this.files.length > 0) {
                const file = this.files[0];
                const filePreview = document.getElementById('filePreview');
                const fileInfo = document.getElementById('fileInfo');
                filePreview.style.display = 'block';
                fileInfo.innerHTML = `<strong>${file.name}</strong><br>Size: ${(file.size / 1024).toFixed(2)} KB<br>Type: ${file.type}`;
            }
            updateSubmitButton();
        });
    }

    // Add listener to terms checkbox
    agreeCheck.addEventListener('change', updateSubmitButton);

    // --- Convert file to Base64 ---
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // --- Format loan types for display ---
    function getSelectedLoanType() {
        const selected = document.querySelector('input[name="loantype"]:checked');
        return selected ? selected.value : 'Not specified';
    }

    // --- Create application form PDF pages ---
    async function createApplicationPages(doc) {
        // Page 1 - Application Form
        doc.setFillColor(11, 79, 108);
        doc.rect(0, 0, 210, 22, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Lumtere FinanceGroup Loan Application', 15, 15);

        doc.setTextColor(20, 43, 60);
        doc.setFontSize(11);
        let y = 35;
        const lineH = 7;

        function addField(label, value) {
            doc.setFont('helvetica', 'bold');
            doc.text(label + ':', 15, y);
            doc.setFont('helvetica', 'normal');
            doc.text(value || '—', 70, y);
            y += lineH;
        }

        // Personal Information
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('PERSONAL INFORMATION', 15, y);
        y += lineH + 2;
        doc.setFontSize(11);
        
        addField('First name', firstName.value.trim());
        addField('Last name', lastName.value.trim());
        addField('Phone', phoneNumber.value.trim());
        addField('Email', email.value.trim());
        addField('Occupation', occupation.value.trim());
        addField('Location', locationField.value.trim());

        // Address
        doc.setFont('helvetica', 'bold');
        doc.text('Address:', 15, y);
        doc.setFont('helvetica', 'normal');
        const addrLines = doc.splitTextToSize(address.value.trim() || '—', 100);
        doc.text(addrLines, 70, y);
        y += lineH * addrLines.length;

        // Application Details
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('APPLICATION DETAILS', 15, y);
        y += lineH + 2;
        doc.setFontSize(11);
        
        addField('Loan type', getSelectedLoanType());
        
        // Reason
        doc.setFont('helvetica', 'bold');
        doc.text('Reason:', 15, y);
        doc.setFont('helvetica', 'normal');
        const reasonLines = doc.splitTextToSize(reasonText.value.trim() || '—', 100);
        doc.text(reasonLines, 70, y);
        y += lineH * reasonLines.length;

        const empType = document.querySelector('input[name="empType"]:checked').value;
        addField('Employment type', empType === 'employed' ? 'Employed' : 'Self‑employed');

        if (empType === 'selfemployed') {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.text('COLLATERAL DETAILS', 15, y);
            y += lineH + 2;
            doc.setFontSize(11);
            
            doc.setFont('helvetica', 'normal');
            const collateralLines = doc.splitTextToSize(collateralText.value.trim() || '—', 170);
            doc.text(collateralLines, 15, y);
            y += lineH * collateralLines.length + 5;
        }

        y += 5;
        addField('Terms accepted', 'Yes');
        y += 10;
        
        // Signature line
        doc.setFont('helvetica', 'bold');
        doc.text('Applicant Signature:', 15, y);
        doc.setFont('helvetica', 'normal');
        doc.text('_________________________', 70, y);
        y += 15;
        
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text('Application generated: ' + new Date().toLocaleString(), 15, y);

        // Add watermark/page number
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('Page 1', 180, 285);
        
        return doc;
    }

    // --- Main function to create merged PDF ---
    async function createMergedPDF() {
        const { jsPDF } = window.jspdf;
        
        // Create first page with application form
        const doc = new jsPDF();
        await createApplicationPages(doc);
        
        const empType = document.querySelector('input[name="empType"]:checked').value;
        
        // If employed and has file, merge the payslip
        if (empType === 'employed' && paySlipInput.files.length > 0) {
            const file = paySlipInput.files[0];
            
            // Add a new page for the payslip
            doc.addPage();
            
            // Add header for payslip attachment
            doc.setFillColor(11, 79, 108);
            doc.rect(0, 0, 210, 22, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('PAYSLIP ATTACHMENT', 15, 15);
            
            doc.setTextColor(20, 43, 60);
            doc.setFontSize(10);
            doc.text(`Uploaded by: ${firstName.value.trim()} ${lastName.value.trim()}`, 15, 35);
            doc.text(`File name: ${file.name}`, 15, 45);
            doc.text(`Upload date: ${new Date().toLocaleString()}`, 15, 55);
            
            try {
                if (file.type.match('image.*')) {
                    // Handle image files
                    const base64Data = await fileToBase64(file);
                    
                    // Add the image to the PDF
                    const img = new Image();
                    await new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = reject;
                        img.src = base64Data;
                    });
                    
                    // Calculate dimensions to fit within margins (180mm width max)
                    const maxWidth = 180;
                    const maxHeight = 220;
                    let imgWidth = maxWidth;
                    let imgHeight = (img.height * maxWidth) / img.width;
                    
                    if (imgHeight > maxHeight) {
                        imgHeight = maxHeight;
                        imgWidth = (img.width * maxHeight) / img.height;
                    }
                    
                    // Center the image
                    const xOffset = (210 - imgWidth) / 2;
                    
                    doc.addImage(base64Data, 'JPEG', xOffset, 70, imgWidth, imgHeight, undefined, 'FAST');
                    
                } else if (file.type === 'application/pdf') {
                    // For PDF files, add a note
                    doc.setFontSize(10);
                    doc.text('NOTE: This is a PDF file. For security reasons, please ensure the original PDF', 15, 75);
                    doc.text('is attached separately or contact our office for alternative submission methods.', 15, 85);
                    
                    doc.setDrawColor(200, 0, 0);
                    doc.setLineWidth(0.5);
                    doc.rect(15, 95, 180, 40);
                    doc.setTextColor(200, 0, 0);
                    doc.setFontSize(11);
                    doc.setFont('helvetica', 'bold');
                    doc.text('PDF PAYSLIP UPLOADED', 20, 110);
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(10);
                    doc.setTextColor(80, 80, 80);
                    doc.text('Original PDF file name: ' + file.name, 20, 125);
                    doc.text('Please ensure this PDF is attached when emailing the application.', 20, 140);
                    
                    doc.setTextColor(20, 43, 60);
                }
                
                // Add watermark/page number for payslip page
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text('Page 2', 180, 285);
                
            } catch (error) {
                console.error('Error embedding payslip:', error);
                doc.setTextColor(255, 0, 0);
                doc.text('⚠️ Error embedding payslip: ' + error.message, 15, 200);
            }
        }
        
        return doc;
    }

    // --- Submit application with merged PDF ---
    async function submitApplication() {
        feedbackDiv.innerHTML = '⏳ Generating merged PDF with application and payslip... Please wait.';
        feedbackDiv.style.color = '#0b4f6c';
        
        try {
            // Create the merged PDF
            const doc = await createMergedPDF();
            
            // Generate filename
            const empType = document.querySelector('input[name="empType"]:checked').value;
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
            const pdfFileName = `Lumtere_Finance_${firstName.value.trim()}_${lastName.value.trim()}_${timestamp}.pdf`;
            
            // Save the PDF
            doc.save(pdfFileName);
            
            // Prepare email
            const recipient = 'applications@lumterefinance.com';
            const subject = `Loan Application: ${firstName.value.trim()} ${lastName.value.trim()}`;
            
            let body = `Dear Lumtere FinanceGroup Officer,

A new loan application has been submitted:

APPLICANT DETAILS:
- Name: ${firstName.value.trim()} ${lastName.value.trim()}
- Phone: ${phoneNumber.value.trim()}
- Email: ${email.value.trim()}
- Location: ${locationField.value.trim()}
- Loan Type: ${getSelectedLoanType()}
- Employment Type: ${empType === 'employed' ? 'Employed' : 'Self‑employed'}

`;

            if (empType === 'employed') {
                const file = paySlipInput.files[0];
                body += `PAYSLIP:
- File name: ${file.name}
- File type: ${file.type}
- File size: ${(file.size / 1024).toFixed(2)} KB
- Status: ${file.type === 'application/pdf' ? 'PDF file - please attach separately' : 'Embedded in PDF'}

`;
            } else {
                body += `COLLATERAL DETAILS:
${collateralText.value.trim()}

`;
            }

            body += `APPLICATION PROCESSING:
The complete application file "${pdfFileName}" has been downloaded to your computer.
This PDF contains ${empType === 'employed' && paySlipInput.files[0] && paySlipInput.files[0].type.match('image.*') ? 'the application form and embedded payslip' : 'the application form'}.

Please process this application and contact the applicant if additional information is needed.

--
Lumtere FinanceGroup Application System
Generated: ${new Date().toLocaleString()}`;

            // Open email client
            window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            // Success message
            feedbackDiv.innerHTML = `
                <div style="background: #e8f5e9; padding: 1rem; border-radius: 10px; color: #2e7d32;">
                    <strong>✅ APPLICATION SUCCESSFULLY GENERATED!</strong><br><br>
                    📄 <strong>PDF Created:</strong> "${pdfFileName}"<br>
                    📎 <strong>Contains:</strong> Application form ${empType === 'employed' && paySlipInput.files[0] && paySlipInput.files[0].type.match('image.*') ? '+ embedded payslip' : ''}<br>
                    📧 <strong>Email draft opened</strong><br><br>
                    <strong>Next steps:</strong><br>
                    1. The PDF has been downloaded to your computer<br>
                    2. Attach the PDF to the email draft<br>
                    3. ${empType === 'employed' && paySlipInput.files[0] && paySlipInput.files[0].type === 'application/pdf' ? 
                       'IMPORTANT: Also attach the original PDF payslip file' : 
                       'Send the email to process your application'}<br>
                    4. Click send when ready
                </div>
            `;
            
        } catch (error) {
            console.error('Application error:', error);
            feedbackDiv.innerHTML = `
                <div style="background: #ffebee; padding: 1rem; border-radius: 10px; color: #c62828;">
                    <strong>❌ ERROR GENERATING APPLICATION</strong><br><br>
                    ${error.message}<br>
                    Please try again or contact support.
                </div>
            `;
        }
    }

    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        feedbackDiv.innerHTML = '';
        
        if (!validateForm()) {
            feedbackDiv.innerHTML = '<span style="color: #d32f2f;">⚠️ Please complete all required fields correctly and agree to terms.</span>';
            return;
        }
        
        submitApplication();
    });

    // Initialize button state
    updateSubmitButton();
})();