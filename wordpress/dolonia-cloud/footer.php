<?php
/**
 * The template for displaying the footer
 */
if ( ! defined('ABSPATH') ) exit;
?>

    <footer class="site-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3><?php bloginfo('name'); ?></h3>
                    <p><?php bloginfo('description'); ?></p>
                </div>
                <div class="footer-section">
                    <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. All rights reserved.</p>
                </div>
            </div>
        </div>
    </footer>

    <?php wp_footer(); ?>
</body>
</html>
                    <div style="margin-top: 1rem;">
                        <?php if (get_theme_mod('contact_phone')): ?>
                            <p><strong>Phone:</strong> <?php echo esc_html(get_theme_mod('contact_phone')); ?></p>
                        <?php endif; ?>
                        <?php if (get_theme_mod('contact_email')): ?>
                            <p><strong>Email:</strong> <?php echo esc_html(get_theme_mod('contact_email')); ?></p>
                        <?php endif; ?>
                    </div>
                </div>
                
                <!-- Quick Links -->
                <div class="footer-section">
                    <h3>Services</h3>
                    <a href="#services">Security Assessment</a>
                    <a href="#services">Penetration Testing</a>
                    <a href="#services">24/7 Monitoring</a>
                    <a href="#services">Compliance Audit</a>
                    <a href="#services">Incident Response</a>
                </div>
                
                <!-- Resources -->
                <div class="footer-section">
                    <h3>Resources</h3>
                    <a href="#about">About Us</a>
                    <a href="#contact">Contact</a>
                    <a href="/privacy-policy/">Privacy Policy</a>
                    <a href="/terms-of-service/">Terms of Service</a>
                    <a href="#calculator">Cost Calculator</a>
                </div>
                
                <!-- Contact Info -->
                <div class="footer-section">
                    <h3>Get In Touch</h3>
                    <p>Ready to secure your business?</p>
                    <a href="#contact" class="btn btn-primary" style="margin-top: 1rem;">Contact Us</a>
                    
                    <!-- Social Links (if needed) -->
                    <div style="margin-top: 1rem;">
                        <a href="#" style="margin-right: 1rem; color: hsl(var(--primary-glow));">
                            <i class="fab fa-linkedin"></i>
                        </a>
                        <a href="#" style="margin-right: 1rem; color: hsl(var(--primary-glow));">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="#" style="color: hsl(var(--primary-glow));">
                            <i class="fab fa-github"></i>
                        </a>
                    </div>
                </div>
            </div>
            
            <!-- Copyright -->
            <div style="text-align: center; padding-top: 2rem; border-top: 1px solid hsl(var(--primary) / 0.2); margin-top: 2rem;">
                <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. All rights reserved. | 
                Built with advanced cybersecurity in mind.</p>
            </div>
        </div>
    </footer>

    <!-- Live Chat Widget (placeholder) -->
    <div id="liveChatWidget" style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
        <button class="btn btn-primary cyber-glow" style="border-radius: 50%; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
            💬
        </button>
    </div>

    <?php wp_footer(); ?>
    
    <!-- Custom JavaScript -->
    <script>
    // Binary Rain Effect
    document.addEventListener('DOMContentLoaded', function() {
        createBinaryRain();
        initializeInteractions();
    });

    function createBinaryRain() {
        const binaryRain = document.getElementById('binaryRain');
        if (!binaryRain) return;
        
        const columns = Math.floor(window.innerWidth / 20);
        
        for (let i = 0; i < columns; i++) {
            const column = document.createElement('div');
            column.className = 'binary-column';
            column.style.left = i * 20 + 'px';
            column.style.animationDuration = (Math.random() * 3 + 2) + 's';
            column.style.animationDelay = Math.random() * 2 + 's';
            
            let content = '';
            for (let j = 0; j < 50; j++) {
                content += Math.random() > 0.5 ? '1' : '0';
                if (j % 10 === 9) content += '<br>';
            }
            column.innerHTML = content;
            
            binaryRain.appendChild(column);
        }
    }

    // Cost Calculator
    function calculateCost() {
        const companySize = document.getElementById('companySize').value;
        const industry = document.getElementById('industry').value;
        const services = document.getElementById('services').value;
        
        let baseCost = 0;
        
        // Base cost by company size
        switch (companySize) {
            case 'startup': baseCost = 2000; break;
            case 'small': baseCost = 5000; break;
            case 'medium': baseCost = 15000; break;
            case 'large': baseCost = 50000; break;
        }
        
        // Industry multiplier
        const industryMultiplier = {
            'finance': 1.5,
            'healthcare': 1.4,
            'technology': 1.2,
            'retail': 1.1,
            'manufacturing': 1.0,
            'other': 1.0
        };
        
        baseCost *= industryMultiplier[industry] || 1.0;
        
        // Service multiplier
        const serviceMultiplier = {
            'assessment': 0.5,
            'penetration': 0.8,
            'monitoring': 1.2,
            'compliance': 0.9,
            'full': 1.5
        };
        
        baseCost *= serviceMultiplier[services] || 1.0;
        
        // Display result
        document.getElementById('costDisplay').textContent = '$' + Math.round(baseCost).toLocaleString();
        document.getElementById('costResult').style.display = 'block';
    }

    // Form Handlers
    function initializeInteractions() {
        // Newsletter Form
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData(this);
                formData.append('action', 'newsletter_signup');
                formData.append('nonce', dolonia_ajax.nonce);
                
                fetch(dolonia_ajax.ajax_url, {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    if (data.success) {
                        newsletterForm.reset();
                    }
                })
                .catch(error => {
                    alert('Error: ' + error.message);
                });
            });
        }
        
        // Contact Form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData(this);
                formData.append('action', 'contact_form');
                formData.append('nonce', dolonia_ajax.nonce);
                
                fetch(dolonia_ajax.ajax_url, {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    if (data.success) {
                        contactForm.reset();
                    }
                })
                .catch(error => {
                    alert('Error: ' + error.message);
                });
            });
        }
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Live Chat Widget
        const liveChatWidget = document.getElementById('liveChatWidget');
        if (liveChatWidget) {
            liveChatWidget.addEventListener('click', function() {
                alert('Live chat feature coming soon! Please use the contact form for now.');
            });
        }
    }

    // Add fade-in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all sections
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.section, .feature-card, .testimonial-card').forEach(el => {
            observer.observe(el);
        });
    });
    </script>
</body>
</html>