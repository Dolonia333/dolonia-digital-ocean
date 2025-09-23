/**
 * Dolonia Cybersecurity Theme JavaScript
 */

jQuery(document).ready(function($) {
    'use strict';
    
    // Initialize all components
    initBinaryRain();
    initScrollAnimations();
    initMobileMenu();
    initFormHandlers();
    initSmoothScrolling();
    
    /**
     * Binary Rain Background Effect
     */
    function initBinaryRain() {
        const binaryRain = $('#binaryRain');
        if (binaryRain.length === 0) return;
        
        const windowWidth = $(window).width();
        const columns = Math.floor(windowWidth / 20);
        
        // Clear existing columns
        binaryRain.empty();
        
        for (let i = 0; i < columns; i++) {
            const column = $('<div class="binary-column"></div>');
            column.css({
                left: i * 20 + 'px',
                animationDuration: (Math.random() * 3 + 2) + 's',
                animationDelay: Math.random() * 2 + 's'
            });
            
            let content = '';
            for (let j = 0; j < 50; j++) {
                content += Math.random() > 0.5 ? '1' : '0';
                if (j % 10 === 9) content += '<br>';
            }
            column.html(content);
            
            binaryRain.append(column);
        }
        
        // Regenerate on window resize
        $(window).on('resize', function() {
            clearTimeout(window.resizeTimer);
            window.resizeTimer = setTimeout(initBinaryRain, 250);
        });
    }
    
    /**
     * Scroll-triggered animations
     */
    function initScrollAnimations() {
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        $(entry.target).addClass('fade-in');
                    }
                });
            }, observerOptions);
            
            // Observe elements
            $('.section, .feature-card, .testimonial-card, .calculator-card').each(function() {
                observer.observe(this);
            });
        } else {
            // Fallback for older browsers
            $('.section, .feature-card, .testimonial-card, .calculator-card').addClass('fade-in');
        }
    }
    
    /**
     * Mobile Menu (if needed)
     */
    function initMobileMenu() {
        const mobileToggle = $('#mobileMenuToggle');
        const navMenu = $('.nav-menu');
        
        mobileToggle.on('click', function() {
            $(this).toggleClass('active');
            navMenu.toggleClass('mobile-active');
        });
        
        // Close menu when clicking outside
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.nav-container').length) {
                mobileToggle.removeClass('active');
                navMenu.removeClass('mobile-active');
            }
        });
        
        // Show mobile toggle on small screens
        function checkMobileMenu() {
            if ($(window).width() <= 768) {
                mobileToggle.show();
                navMenu.addClass('mobile-menu');
            } else {
                mobileToggle.hide();
                navMenu.removeClass('mobile-menu mobile-active');
            }
        }
        
        checkMobileMenu();
        $(window).on('resize', checkMobileMenu);
    }
    
    /**
     * Form Handlers
     */
    function initFormHandlers() {
        // Newsletter form
        $('#newsletterForm').on('submit', function(e) {
            e.preventDefault();
            
            const form = $(this);
            const email = form.find('input[name="email"]').val();
            const submitBtn = form.find('button[type="submit"]');
            const originalText = submitBtn.text();
            
            // Validate email
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.text('Subscribing...').prop('disabled', true);
            
            $.ajax({
                url: dolonia_ajax.ajax_url,
                type: 'POST',
                data: {
                    action: 'newsletter_signup',
                    email: email,
                    nonce: dolonia_ajax.nonce
                },
                success: function(response) {
                    const data = JSON.parse(response);
                    showMessage(data.message, data.success ? 'success' : 'error');
                    
                    if (data.success) {
                        form[0].reset();
                    }
                },
                error: function() {
                    showMessage('Error subscribing. Please try again.', 'error');
                },
                complete: function() {
                    submitBtn.text(originalText).prop('disabled', false);
                }
            });
        });
        
        // Contact form
        $('#contactForm').on('submit', function(e) {
            e.preventDefault();
            
            const form = $(this);
            const formData = form.serialize();
            const submitBtn = form.find('button[type="submit"]');
            const originalText = submitBtn.text();
            
            // Basic validation
            const name = form.find('input[name="name"]').val().trim();
            const email = form.find('input[name="email"]').val().trim();
            const message = form.find('textarea[name="message"]').val().trim();
            
            if (!name || !email || !message) {
                showMessage('Please fill in all required fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.text('Sending...').prop('disabled', true);
            
            $.ajax({
                url: dolonia_ajax.ajax_url,
                type: 'POST',
                data: formData + '&action=contact_form&nonce=' + dolonia_ajax.nonce,
                success: function(response) {
                    const data = JSON.parse(response);
                    showMessage(data.message, data.success ? 'success' : 'error');
                    
                    if (data.success) {
                        form[0].reset();
                    }
                },
                error: function() {
                    showMessage('Error sending message. Please try again.', 'error');
                },
                complete: function() {
                    submitBtn.text(originalText).prop('disabled', false);
                }
            });
        });
        
        // Cost Calculator
        window.calculateCost = function() {
            const companySize = $('#companySize').val();
            const industry = $('#industry').val();
            const services = $('#services').val();
            
            let baseCost = 0;
            
            // Base cost by company size
            const sizeCosts = {
                'startup': 2000,
                'small': 5000,
                'medium': 15000,
                'large': 50000
            };
            baseCost = sizeCosts[companySize] || 5000;
            
            // Industry multiplier
            const industryMultipliers = {
                'finance': 1.5,
                'healthcare': 1.4,
                'technology': 1.2,
                'retail': 1.1,
                'manufacturing': 1.0,
                'other': 1.0
            };
            baseCost *= industryMultipliers[industry] || 1.0;
            
            // Service multiplier
            const serviceMultipliers = {
                'assessment': 0.5,
                'penetration': 0.8,
                'monitoring': 1.2,
                'compliance': 0.9,
                'full': 1.5
            };
            baseCost *= serviceMultipliers[services] || 1.0;
            
            // Display result with animation
            const resultDiv = $('#costResult');
            const costDisplay = $('#costDisplay');
            
            costDisplay.text('$' + Math.round(baseCost).toLocaleString());
            resultDiv.hide().fadeIn(500);
            
            // Add some visual feedback
            costDisplay.addClass('cyber-glow');
            setTimeout(() => costDisplay.removeClass('cyber-glow'), 2000);
        };
    }
    
    /**
     * Smooth scrolling for anchor links
     */
    function initSmoothScrolling() {
        $('a[href^="#"]').on('click', function(e) {
            const target = $(this.getAttribute('href'));
            
            if (target.length) {
                e.preventDefault();
                
                $('html, body').animate({
                    scrollTop: target.offset().top - 80 // Account for fixed header
                }, 800, 'easeInOutCubic');
                
                // Close mobile menu if open
                $('.nav-menu').removeClass('mobile-active');
                $('#mobileMenuToggle').removeClass('active');
            }
        });
    }
    
    /**
     * Utility Functions
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showMessage(message, type) {
        // Remove existing messages
        $('.dolonia-message').remove();
        
        // Create message element
        const messageDiv = $('<div class="dolonia-message"></div>')
            .text(message)
            .addClass(type === 'success' ? 'message-success' : 'message-error');
        
        // Add CSS for messages
        if (!$('#dolonia-message-styles').length) {
            $('<style id="dolonia-message-styles">')
                .text(`
                    .dolonia-message {
                        position: fixed;
                        top: 100px;
                        right: 20px;
                        background: hsl(var(--background));
                        color: hsl(var(--foreground));
                        padding: 1rem 1.5rem;
                        border-radius: 0.5rem;
                        border-left: 4px solid;
                        box-shadow: var(--shadow-cyber);
                        z-index: 1000;
                        max-width: 400px;
                        word-wrap: break-word;
                        animation: slideInRight 0.3s ease;
                    }
                    .message-success { border-left-color: #10b981; }
                    .message-error { border-left-color: #ef4444; }
                    @keyframes slideInRight {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                `)
                .appendTo('head');
        }
        
        // Show message
        $('body').append(messageDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageDiv.fadeOut(300, function() {
                $(this).remove();
            });
        }, 5000);
    }
    
    /**
     * Live Chat Widget
     */
    $('#liveChatWidget').on('click', function() {
        showMessage('Live chat feature coming soon! Please use the contact form for now.', 'info');
    });
    
    /**
     * Header scroll effect
     */
    $(window).on('scroll', function() {
        const header = $('.site-header');
        const scrollTop = $(window).scrollTop();
        
        if (scrollTop > 100) {
            header.addClass('scrolled');
        } else {
            header.removeClass('scrolled');
        }
    });
    
    // Add CSS for scrolled header
    if (!$('#header-scroll-styles').length) {
        $('<style id="header-scroll-styles">')
            .text(`
                .site-header.scrolled {
                    background: hsl(var(--background) / 0.95);
                    backdrop-filter: blur(20px);
                    box-shadow: var(--shadow-cyber);
                }
            `)
            .appendTo('head');
    }
});

/**
 * Custom easing function
 */
jQuery.easing.easeInOutCubic = function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t + b;
    return c/2*((t-=2)*t*t + 2) + b;
};