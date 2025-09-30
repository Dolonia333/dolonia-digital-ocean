<?php if ( ! defined('ABSPATH') ) exit; ?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php wp_title('|', true, 'right'); bloginfo('name'); ?>">
    <meta name="twitter:description" content="<?php bloginfo('description'); ?>">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="<?php echo home_url(); ?>">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="<?php echo get_template_directory_uri(); ?>/favicon.ico">
    
    <!-- React Components CSS -->
    <style>
        /* Binary Rain Base Styles */
        .binary-digit {
            position: absolute;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            pointer-events: none;
            text-shadow: 0 0 5px currentColor;
            user-select: none;
            z-index: 1;
        }

        #binary-rain-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        }

        #live-chat-container {
            position: fixed;
            z-index: 9999;
        }

        .chat-position-bottom-right { bottom: 20px; right: 20px; }
        .chat-position-bottom-left { bottom: 20px; left: 20px; }
        .chat-position-top-right { top: 20px; right: 20px; }
        .chat-position-top-left { top: 20px; left: 20px; }

        /* WordPress Admin Bar Compatibility */
        .admin-bar #binary-rain-container {
            top: 32px;
            height: calc(100% - 32px);
        }

        @media screen and (max-width: 782px) {
            .admin-bar #binary-rain-container {
                top: 46px;
                height: calc(100% - 46px);
            }
        }
    </style>
    
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