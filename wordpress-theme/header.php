<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="<?php bloginfo('description'); ?>">
    <meta name="keywords" content="cybersecurity, penetration testing, security audit, threat detection, cyber defense">
    <meta name="author" content="<?php bloginfo('name'); ?>">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="<?php wp_title('|', true, 'right'); bloginfo('name'); ?>">
    <meta property="og:description" content="<?php bloginfo('description'); ?>">
    <meta property="og:url" content="<?php echo home_url(); ?>">
    <meta property="og:site_name" content="<?php bloginfo('name'); ?>">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php wp_title('|', true, 'right'); bloginfo('name'); ?>">
    <meta name="twitter:description" content="<?php bloginfo('description'); ?>">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="<?php echo home_url(); ?>">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="<?php echo get_template_directory_uri(); ?>/favicon.ico">
    
    <!-- Font Awesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <?php wp_head(); ?>
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "<?php bloginfo('name'); ?>",
        "description": "<?php bloginfo('description'); ?>",
        "url": "<?php echo home_url(); ?>",
        "logo": "<?php echo get_template_directory_uri(); ?>/assets/logo.png",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "<?php echo get_theme_mod('contact_phone'); ?>",
            "contactType": "customer service",
            "email": "<?php echo get_theme_mod('contact_email'); ?>"
        },
        "sameAs": [
            "https://www.linkedin.com/company/<?php bloginfo('name'); ?>",
            "https://twitter.com/<?php bloginfo('name'); ?>"
        ]
    }
    </script>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header">
    <div class="container">
        <nav class="nav-container">
            <!-- Logo -->
            <div class="nav-logo">
                <?php 
                if (has_custom_logo()) {
                    the_custom_logo();
                } else {
                    echo '<a href="' . home_url() . '">' . get_bloginfo('name') . '</a>';
                }
                ?>
            </div>
            
            <!-- Navigation Menu -->
            <?php
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'container' => false,
                'menu_class' => 'nav-menu',
                'fallback_cb' => 'dolonia_fallback_menu',
            ));
            ?>
            
            <!-- CTA Button -->
            <a href="#contact" class="btn btn-primary">Get Started</a>
            
            <!-- Mobile Menu Toggle (for future mobile implementation) -->
            <button class="mobile-menu-toggle" id="mobileMenuToggle" style="display: none;">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </nav>
    </div>
</header>

<?php
/**
 * Fallback menu if no menu is set
 */
function dolonia_fallback_menu() {
    echo '<ul class="nav-menu">';
    echo '<li><a href="#services">Services</a></li>';
    echo '<li><a href="#about">About</a></li>';
    echo '<li><a href="#contact">Contact</a></li>';
    echo '</ul>';
}
?>