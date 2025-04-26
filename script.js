document.addEventListener('DOMContentLoaded', function() {
    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
    }
    
    // Toggle dark mode
    darkModeToggle.addEventListener('click', function() {
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    
    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target) && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    });
    
    // Image upload and preview
    const photoInput = document.getElementById('photoInput');
    const dropArea = document.getElementById('dropArea');
    const imagePreview = document.getElementById('imagePreview');
    const previewContainer = document.getElementById('previewContainer');
    const uploadPrompt = document.getElementById('uploadPrompt');
    const photoUploadForm = document.getElementById('photoUploadForm');
    const browseButton = document.getElementById('browseButton');
    const submitButton = document.getElementById('submitButton');
    
    if (photoInput && dropArea) {
        // Initialize submit button state
        if (submitButton) {
            submitButton.disabled = true;
        }
        
        // Click event for browse button
        if (browseButton) {
            browseButton.addEventListener('click', function() {
                photoInput.click();
            });
        }
        
        // File input change event
        photoInput.addEventListener('change', function() {
            handleFileSelect(this.files[0]);
        });
        
        // Drag and drop events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            dropArea.classList.add('dragover');
        }
        
        function unhighlight() {
            dropArea.classList.remove('dragover');
        }
        
        dropArea.addEventListener('drop', function(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFileSelect(files[0]);
        });
        
        // Handle file selection
        function handleFileSelect(file) {
            if (!file) return;
            
            if (!file.type.match('image.*')) {
                alert('Please select an image file (JPEG, PNG, etc.)');
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                uploadPrompt.classList.add('hidden');
                previewContainer.classList.remove('hidden');
                
                // Enable submit button
                if (submitButton) {
                    submitButton.disabled = false;
                }
            };
            
            reader.readAsDataURL(file);
        }
        
        // Handle outfit selection
        const outfitRadios = document.querySelectorAll('input[name="outfitType"]');
        
        outfitRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                // Remove selected class from all labels
                document.querySelectorAll('input[name="outfitType"] + label').forEach(label => {
                    label.parentNode.classList.remove('ring-2', 'ring-teal-500');
                });
                
                // Add selected class to checked radio's label
                if (this.checked) {
                    this.nextElementSibling.parentNode.classList.add('ring-2', 'ring-teal-500');
                }
            });
        });
        
        // Handle form submission
        if (photoUploadForm) {
            photoUploadForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const selectedOutfit = document.querySelector('input[name="outfitType"]:checked');
                
                if (!imagePreview.src || !selectedOutfit) {
                    alert('Please select an image and an outfit type');
                    return;
                }
                
                // Show loading state
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
                
                // Simulate processing (in real app, this would be an API call)
                setTimeout(() => {
                    // Display success message or redirect to results page
                    alert('Your photo has been processed! In a real app, this would show your image with the selected outfit.');
                    
                    // Reset form
                    resetForm();
                }, 2000);
            });
        }
        
        function resetForm() {
            if (photoUploadForm) {
                photoUploadForm.reset();
                uploadPrompt.classList.remove('hidden');
                previewContainer.classList.add('hidden');
                submitButton.disabled = true;
                submitButton.innerHTML = 'Try On Outfit';
                
                // Reset outfit selection
                document.querySelectorAll('input[name="outfitType"] + label').forEach(label => {
                    label.parentNode.classList.remove('ring-2', 'ring-teal-500');
                });
            }
        }
    }
    
    // Animation on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in, .slide-up').forEach(el => {
        observer.observe(el);
    });
    
});