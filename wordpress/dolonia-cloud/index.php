<?php
/**
 * The main template file
 * This is the most generic template file in a WordPress theme
 */

get_header();
?>

<main class="site-main">
    <?php if ( have_posts() ) : ?>
        <?php while ( have_posts() ) : the_post(); ?>
            <article class="post">
                <h1 class="post-title"><?php the_title(); ?></h1>
                <div class="post-content">
                    <?php the_content(); ?>
                </div>
            </article>
        <?php endwhile; ?>

        <?php the_posts_navigation(); ?>

    <?php else : ?>
        <div class="no-posts">
            <h1>Welcome to Dolonia Cloud</h1>
            <p>Secure, modern infrastructure with an ocean-calm UX.</p>
        </div>
    <?php endif; ?>
</main>

<?php get_footer();

<?php get_footer(); ?>get_header(); ?>

<!-- Binary Rain Background -->
<div class="binary-rain" id="binaryRain"></div>

<!-- Hero Section -->
<section class="hero-section">
    <div class="container">
        <!-- Logo with Glitch Effect -->
        <div class="hero-logo">
            <?php 
            $custom_logo_id = get_theme_mod('custom_logo');
            if ($custom_logo_id) {
                $logo_url = wp_get_attachment_image_url($custom_logo_id, 'full');
                echo '<div class="glitch-container">';
                echo '<img src="' . esc_url($logo_url) . '" alt="' . get_bloginfo('name') . '">';
                echo '<div class="glitch-overlay">';
                echo '<img src="' . esc_url($logo_url) . '" alt="" class="glitch-red">';
                echo '<img src="' . esc_url($logo_url) . '" alt="" class="glitch-cyan">';
                echo '<img src="' . esc_url($logo_url) . '" alt="" class="glitch-purple">';
                echo '</div>';
                echo '</div>';
            } else {
                echo '<div class="glitch-container">';
                echo '<div style="width: 200px; height: 200px; background: linear-gradient(135deg, #0ea5e9, #10b981); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3rem; font-weight: bold; color: white;">';
                echo substr(get_bloginfo('name'), 0, 1);
                echo '</div>';
                echo '</div>';
            }
            ?>
        </div>

        <!-- Hero Content -->
        <div class="hero-content fade-in">
            <h1><?php echo esc_html(get_theme_mod('hero_title', 'Secure Your Digital Future')); ?></h1>
            <p class="text-center mb-4" style="font-size: 1.25rem; max-width: 600px; margin: 0 auto 2rem;">
                <?php echo esc_html(get_theme_mod('hero_subtitle', 'Advanced cybersecurity solutions for modern businesses. Protect your assets with cutting-edge technology and expert analysis.')); ?>
            </p>
            
            <div class="flex justify-center gap-4 mb-4">
                <a href="#services" class="btn btn-primary">Get Started</a>
                <a href="#contact" class="btn btn-outline">Learn More</a>
            </div>
        </div>

        <!-- Feature Cards -->
        <div class="features-grid fade-in">
            <div class="feature-card">
                <div class="feature-icon">🛡️</div>
                <h3>Advanced Protection</h3>
                <p>Military-grade encryption and real-time threat detection to keep your business secure 24/7.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">⚡</div>
                <h3>Lightning Fast</h3>
                <p>Deploy security solutions in minutes, not months. Our streamlined process gets you protected quickly.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">☁️</div>
                <h3>Cloud-Native</h3>
                <p>Built for the modern cloud infrastructure with seamless integration and automatic scaling.</p>
            </div>
        </div>
    </div>
</section>

<!-- Services Section -->
<section id="services" class="section">
    <div class="container">
        <div class="text-center mb-4">
            <h2>Our Services</h2>
            <p>Comprehensive cybersecurity solutions tailored to your business needs</p>
        </div>
        
        <div class="features-grid">
            <?php
            $services = dolonia_get_services(6);
            if ($services) {
                foreach ($services as $service) {
                    $icon = get_post_meta($service->ID, '_service_icon', true);
                    $price = get_post_meta($service->ID, '_service_price', true);
                    ?>
                    <div class="feature-card">
                        <div class="feature-icon">
                            <?php if ($icon): ?>
                                <i class="<?php echo esc_attr($icon); ?>"></i>
                            <?php else: ?>
                                🔐
                            <?php endif; ?>
                        </div>
                        <h3><?php echo esc_html($service->post_title); ?></h3>
                        <p><?php echo esc_html($service->post_excerpt ?: wp_trim_words($service->post_content, 20)); ?></p>
                        <?php if ($price): ?>
                            <div style="color: #10b981; font-weight: 600; margin-top: 1rem;">
                                Starting at <?php echo esc_html($price); ?>
                            </div>
                        <?php endif; ?>
                    </div>
                    <?php
                }
            } else {
                // Default services if none are created
                ?>
                <div class="feature-card">
                    <div class="feature-icon">🔒</div>
                    <h3>Penetration Testing</h3>
                    <p>Comprehensive security assessments to identify vulnerabilities before attackers do.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🛡️</div>
                    <h3>Security Audits</h3>
                    <p>Detailed analysis of your security posture with actionable recommendations.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🚨</div>
                    <h3>Incident Response</h3>
                    <p>24/7 emergency response team ready to handle security incidents.</p>
                </div>
                <?php
            }
            ?>
        </div>
    </div>
</section>

<!-- Testimonials Section -->
<section class="testimonials-section section">
    <div class="container">
        <div class="text-center mb-4">
            <h2>What Our Clients Say</h2>
            <p>Trusted by businesses worldwide</p>
        </div>
        
        <div class="features-grid">
            <?php
            $testimonials = dolonia_get_testimonials(3);
            if ($testimonials) {
                foreach ($testimonials as $testimonial) {
                    $company = get_post_meta($testimonial->ID, '_testimonial_company', true);
                    $position = get_post_meta($testimonial->ID, '_testimonial_position', true);
                    $rating = get_post_meta($testimonial->ID, '_testimonial_rating', true) ?: 5;
                    ?>
                    <div class="testimonial-card">
                        <div class="testimonial-stars mb-2">
                            <?php for ($i = 0; $i < $rating; $i++): ?>
                                ⭐
                            <?php endfor; ?>
                        </div>
                        <p>"<?php echo esc_html($testimonial->post_content); ?>"</p>
                        <div style="margin-top: 1rem;">
                            <strong><?php echo esc_html($testimonial->post_title); ?></strong>
                            <?php if ($position): ?>
                                <div style="font-size: 0.9rem; opacity: 0.8;">
                                    <?php echo esc_html($position); ?>
                                    <?php if ($company): ?>
                                        at <?php echo esc_html($company); ?>
                                    <?php endif; ?>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php
                }
            } else {
                // Default testimonials if none are created
                ?>
                <div class="testimonial-card">
                    <div class="testimonial-stars mb-2">⭐⭐⭐⭐⭐</div>
                    <p>"Dolonia's cybersecurity solutions transformed our business. We've had zero incidents since implementation."</p>
                    <div style="margin-top: 1rem;">
                        <strong>Sarah Johnson</strong>
                        <div style="font-size: 0.9rem; opacity: 0.8;">CTO at TechCorp</div>
                    </div>
                </div>
                <div class="testimonial-card">
                    <div class="testimonial-stars mb-2">⭐⭐⭐⭐⭐</div>
                    <p>"Professional, reliable, and incredibly effective. Their team is always available when we need them."</p>
                    <div style="margin-top: 1rem;">
                        <strong>Michael Chen</strong>
                        <div style="font-size: 0.9rem; opacity: 0.8;">IT Director at GlobalFinance</div>
                    </div>
                </div>
                <div class="testimonial-card">
                    <div class="testimonial-stars mb-2">⭐⭐⭐⭐⭐</div>
                    <p>"The best investment we've made in our company's security. Dolonia delivers results."</p>
                    <div style="margin-top: 1rem;">
                        <strong>Emily Rodriguez</strong>
                        <div style="font-size: 0.9rem; opacity: 0.8;">CEO at SecureStart</div>
                    </div>
                </div>
                <?php
            }
            ?>
        </div>
    </div>
</section>

<!-- Cost Calculator Section -->
<section id="calculator" class="calculator-section section">
    <div class="container">
        <div class="text-center mb-4">
            <h2>Security Assessment Calculator</h2>
            <p>Get an instant estimate for your cybersecurity needs</p>
        </div>
        
        <div class="calculator-card">
            <form id="costCalculator">
                <div class="form-group">
                    <label class="form-label" for="companySize">Company Size</label>
                    <select class="form-select" id="companySize" name="companySize">
                        <option value="startup">Startup (1-10 employees)</option>
                        <option value="small">Small Business (11-50 employees)</option>
                        <option value="medium">Medium Business (51-200 employees)</option>
                        <option value="large">Large Enterprise (200+ employees)</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="industry">Industry</label>
                    <select class="form-select" id="industry" name="industry">
                        <option value="technology">Technology</option>
                        <option value="finance">Finance</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="retail">Retail</option>
                        <option value="manufacturing">Manufacturing</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="services">Services Needed</label>
                    <select class="form-select" id="services" name="services">
                        <option value="assessment">Security Assessment</option>
                        <option value="penetration">Penetration Testing</option>
                        <option value="monitoring">24/7 Monitoring</option>
                        <option value="compliance">Compliance Audit</option>
                        <option value="full">Complete Security Package</option>
                    </select>
                </div>
                
                <button type="button" class="btn btn-primary" onclick="calculateCost()" style="width: 100%;">
                    Calculate Estimate
                </button>
                
                <div id="costResult" class="mt-4 text-center" style="display: none;">
                    <h3 style="color: #10b981;">Estimated Cost</h3>
                    <div id="costDisplay" style="font-size: 2rem; font-weight: bold; color: #0ea5e9;"></div>
                    <p style="font-size: 0.9rem; opacity: 0.8;">*Final pricing may vary based on specific requirements</p>
                </div>
            </form>
        </div>
    </div>
</section>

<!-- Contact Section -->
<section id="contact" class="section">
    <div class="container">
        <div class="text-center mb-4">
            <h2>Get In Touch</h2>
            <p>Ready to secure your business? Contact our experts today</p>
        </div>
        
        <div class="calculator-card">
            <form id="contactForm">
                <div class="form-group">
                    <label class="form-label" for="contactName">Name *</label>
                    <input type="text" class="form-input" id="contactName" name="name" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="contactEmail">Email *</label>
                    <input type="email" class="form-input" id="contactEmail" name="email" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="contactCompany">Company</label>
                    <input type="text" class="form-input" id="contactCompany" name="company">
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="contactMessage">Message *</label>
                    <textarea class="form-input" id="contactMessage" name="message" rows="5" style="height: auto;" required></textarea>
                </div>
                
                <button type="submit" class="btn btn-primary" style="width: 100%;">
                    Send Message
                </button>
            </form>
        </div>
    </div>
</section>

<!-- Newsletter Section -->
<section class="newsletter-section section">
    <div class="container text-center">
        <h2>Stay Updated</h2>
        <p style="margin-bottom: 2rem;">Get the latest cybersecurity insights and updates</p>
        
        <form id="newsletterForm" class="newsletter-form">
            <input type="email" name="email" placeholder="Enter your email" class="newsletter-input" required>
            <button type="submit" class="btn btn-primary">Subscribe</button>
        </form>
    </div>
</section>

<?php get_footer(); ?>