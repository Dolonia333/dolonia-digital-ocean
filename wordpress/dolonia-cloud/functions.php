<?php<?php<?php

/**

 * Dolonia Cloud Theme Functions/**// Exit if accessed directly.

 * Minimal, clean functions.php for WordPress theme

 */ * Dolonia Cloud Theme Functionsif ( ! defined( 'ABSPATH' ) ) { exit; }



// Prevent direct access * Minimal, clean functions.php for WordPress theme

if ( ! defined( 'ABSPATH' ) ) {

    exit; *//**

}

 * Simple file mtime version helper (PHP 5.6+/7.x compatible).

/**

 * Theme Setup// Prevent direct access */

 */

function dolonia_theme_setup() {if ( ! defined( 'ABSPATH' ) ) {function dolonia_ver( $rel ) {

    // Add theme support

    add_theme_support( 'title-tag' );    exit;  $path = get_stylesheet_directory() . $rel;

    add_theme_support( 'post-thumbnails' );

    add_theme_support( 'custom-logo' );}  if ( file_exists( $path ) ) { return filemtime( $path ); }

    add_theme_support( 'html5', array(

        'search-form',  return null;

        'comment-form',

        'comment-list',/**}

        'gallery',

        'caption', * Theme Setup

    ) );

 *//**

    // Register navigation menus

    register_nav_menus( array(function dolonia_theme_setup() { * Theme Setup

        'primary' => __( 'Primary Menu', 'dolonia' ),

        'footer'  => __( 'Footer Menu', 'dolonia' ),    // Add theme support */

    ) );

}    add_theme_support( 'title-tag' );function dolonia_theme_setup() {

add_action( 'after_setup_theme', 'dolonia_theme_setup' );

    add_theme_support( 'post-thumbnails' );    // Add theme support

/**

 * Enqueue theme assets    add_theme_support( 'custom-logo' );    add_theme_support('title-tag');

 */

function dolonia_enqueue_assets() {    add_theme_support( 'html5', array(    add_theme_support('post-thumbnails');

    // Main stylesheet

    wp_enqueue_style(        'search-form',    add_theme_support('custom-logo');

        'dolonia-style',

        get_stylesheet_uri(),        'comment-form',    add_theme_support('html5', array(

        array(),

        filemtime( get_stylesheet_directory() . '/style.css' )        'comment-list',        'search-form',

    );

        'gallery',        'comment-form',

    // Google Fonts

    wp_enqueue_style(        'caption',        'comment-list',

        'dolonia-fonts',

        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',    ) );        'gallery',

        array(),

        null        'caption',

    );

}    // Register navigation menus    ));

add_action( 'wp_enqueue_scripts', 'dolonia_enqueue_assets' );
    register_nav_menus( array(    

        'primary' => __( 'Primary Menu', 'dolonia' ),    // Register navigation menus

        'footer'  => __( 'Footer Menu', 'dolonia' ),    register_nav_menus(array(

    ) );        'primary' => __('Primary Menu', 'dolonia'),

}        'footer' => __('Footer Menu', 'dolonia'),

add_action( 'after_setup_theme', 'dolonia_theme_setup' );    ));

}

/**add_action('after_setup_theme', 'dolonia_theme_setup');

 * Enqueue theme assets

 *//**

function dolonia_enqueue_assets() { * Enqueue theme assets.

    // Main stylesheet */

    wp_enqueue_style(function dolonia_enqueue_assets() {

        'dolonia-style',    // Enqueue Google Fonts

        get_stylesheet_uri(),    wp_enqueue_style(

        array(),        'dolonia-fonts',

        filemtime( get_stylesheet_directory() . '/style.css' )        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',

    );        array(),

        null

    // Google Fonts    );

    wp_enqueue_style(    

        'dolonia-fonts',    // Main stylesheet

        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',    wp_enqueue_style(

        array(),        'dolonia-style',

        null        get_stylesheet_uri(),

    );        array(),

}        dolonia_ver( '/style.css' )

add_action( 'wp_enqueue_scripts', 'dolonia_enqueue_assets' );    );
    
    // React build files
    $dist_path = get_template_directory_uri() . '/assets/dist/';
    
    // Main React styles
    if (file_exists(get_template_directory() . '/assets/dist/style.css')) {
        wp_enqueue_style(
            'dolonia-react-styles',
            $dist_path . 'style.css',
            array('dolonia-style'),
            dolonia_ver( '/assets/dist/style.css' )
        );
    }
    
    // React components scripts
    if (file_exists(get_template_directory() . '/assets/dist/main.js')) {
        wp_enqueue_script(
            'dolonia-react-main',
            $dist_path . 'main.js',
            array(),
            dolonia_ver( '/assets/dist/main.js' ),
            true
        );
    }
    
    // Binary Rain component
    if (file_exists(get_template_directory() . '/assets/dist/binary-rain.js')) {
        wp_enqueue_script(
            'dolonia-binary-rain',
            $dist_path . 'binary-rain.js',
            array(),
            dolonia_ver( '/assets/dist/binary-rain.js' ),
            true
        );
    }
    
    // Main theme JavaScript
    if (file_exists(get_template_directory() . '/js/main.js')) {
        wp_enqueue_script(
            'dolonia-main',
            get_template_directory_uri() . '/js/main.js',
            array('jquery'),
            dolonia_ver( '/js/main.js' ),
            true
        );
    }
    
    // Localize script with WordPress data and customizer settings
    wp_localize_script('dolonia-react-main', 'doloniaWP', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('dolonia_nonce'),
        'themeUrl' => get_template_directory_uri(),
        'settings' => array(
            'binaryRain' => array(
                'enabled' => get_theme_mod('dolonia_binary_rain_enabled', true),
                'performance' => get_theme_mod('dolonia_binary_rain_performance', 'high'),
                'patterns' => get_theme_mod('dolonia_binary_rain_patterns', 'fall,matrix,wave,spiral,glitch,cascade'),
                'colors' => get_theme_mod('dolonia_binary_rain_colors', 'default'),
            ),
            'liveChat' => array(
                'enabled' => get_theme_mod('dolonia_live_chat_enabled', true),
                'position' => get_theme_mod('dolonia_live_chat_position', 'bottom-right'),
                'greeting' => get_theme_mod('dolonia_live_chat_greeting', 'Hello! How can Dolonia help secure your business today?'),
            ),
            'navigation' => array(
                'showTop' => get_theme_mod('dolonia_show_top_nav', false),
                'sidebarOnly' => get_theme_mod('dolonia_sidebar_only', true),
            )
        )
    ));
}
add_action( 'wp_enqueue_scripts', 'dolonia_enqueue_assets' );

/**
 * Add React component containers to pages
 */
function dolonia_add_react_containers() {
    if (get_theme_mod('dolonia_binary_rain_enabled', true)) {
        echo '<div id="binary-rain-container"></div>';
    }
    
    if (get_theme_mod('dolonia_live_chat_enabled', true)) {
        echo '<div id="live-chat-container"></div>';
    }
}
add_action('wp_footer', 'dolonia_add_react_containers');

/**
 * Sanitization functions for customizer
 */
function dolonia_sanitize_checkbox($checked) {
    return ((isset($checked) && true == $checked) ? true : false);
}

function dolonia_sanitize_select($input, $setting) {
    $input = sanitize_key($input);
    $choices = $setting->manager->get_control($setting->id)->choices;
    return (array_key_exists($input, $choices) ? $input : $setting->default);
}

/**
 * Enhanced Customizer settings for React components
 */
function dolonia_customize_register($wp_customize) {
    
    // ===== BINARY RAIN SECTION =====
    $wp_customize->add_section('dolonia_binary_rain', array(
        'title' => __('Binary Rain Animation', 'dolonia'),
        'description' => __('Customize the dynamic binary rain background effect', 'dolonia'),
        'priority' => 30,
    ));

    // Enable Binary Rain
    $wp_customize->add_setting('dolonia_binary_rain_enabled', array(
        'default' => true,
        'sanitize_callback' => 'dolonia_sanitize_checkbox',
    ));
    $wp_customize->add_control('dolonia_binary_rain_enabled', array(
        'label' => __('Enable Binary Rain', 'dolonia'),
        'section' => 'dolonia_binary_rain',
        'type' => 'checkbox',
    ));

    // Performance Mode
    $wp_customize->add_setting('dolonia_binary_rain_performance', array(
        'default' => 'high',
        'sanitize_callback' => 'dolonia_sanitize_select',
    ));
    $wp_customize->add_control('dolonia_binary_rain_performance', array(
        'label' => __('Performance Mode', 'dolonia'),
        'section' => 'dolonia_binary_rain',
        'type' => 'select',
        'choices' => array(
            'low' => __('Low (Better for older devices)', 'dolonia'),
            'medium' => __('Medium (Balanced)', 'dolonia'),
            'high' => __('High (Best visual quality)', 'dolonia'),
        ),
    ));

    // Rain Patterns
    $wp_customize->add_setting('dolonia_binary_rain_patterns', array(
        'default' => 'fall,matrix,wave,spiral,glitch,cascade',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('dolonia_binary_rain_patterns', array(
        'label' => __('Active Patterns', 'dolonia'),
        'description' => __('Comma-separated: fall,matrix,wave,spiral,glitch,cascade', 'dolonia'),
        'section' => 'dolonia_binary_rain',
        'type' => 'text',
    ));

    // Color Scheme
    $wp_customize->add_setting('dolonia_binary_rain_colors', array(
        'default' => 'default',
        'sanitize_callback' => 'dolonia_sanitize_select',
    ));
    $wp_customize->add_control('dolonia_binary_rain_colors', array(
        'label' => __('Color Scheme', 'dolonia'),
        'section' => 'dolonia_binary_rain',
        'type' => 'select',
        'choices' => array(
            'default' => __('Default (Multi-color)', 'dolonia'),
            'matrix' => __('Matrix Green', 'dolonia'),
            'cyber_blue' => __('Cyber Blue', 'dolonia'),
            'neon_pink' => __('Neon Pink', 'dolonia'),
            'monochrome' => __('Monochrome', 'dolonia'),
        ),
    ));

    // ===== LIVE CHAT SECTION =====
    $wp_customize->add_section('dolonia_live_chat', array(
        'title' => __('Live Chat Widget', 'dolonia'),
        'description' => __('Configure the interactive chat widget', 'dolonia'),
        'priority' => 31,
    ));

    // Enable Live Chat
    $wp_customize->add_setting('dolonia_live_chat_enabled', array(
        'default' => true,
        'sanitize_callback' => 'dolonia_sanitize_checkbox',
    ));
    $wp_customize->add_control('dolonia_live_chat_enabled', array(
        'label' => __('Enable Live Chat', 'dolonia'),
        'section' => 'dolonia_live_chat',
        'type' => 'checkbox',
    ));

    // Chat Position
    $wp_customize->add_setting('dolonia_live_chat_position', array(
        'default' => 'bottom-right',
        'sanitize_callback' => 'dolonia_sanitize_select',
    ));
    $wp_customize->add_control('dolonia_live_chat_position', array(
        'label' => __('Chat Position', 'dolonia'),
        'section' => 'dolonia_live_chat',
        'type' => 'select',
        'choices' => array(
            'bottom-right' => __('Bottom Right', 'dolonia'),
            'bottom-left' => __('Bottom Left', 'dolonia'),
            'top-right' => __('Top Right', 'dolonia'),
            'top-left' => __('Top Left', 'dolonia'),
        ),
    ));

    // Greeting Message
    $wp_customize->add_setting('dolonia_live_chat_greeting', array(
        'default' => 'Hello! How can Dolonia help secure your business today?',
        'sanitize_callback' => 'sanitize_textarea_field',
    ));
    $wp_customize->add_control('dolonia_live_chat_greeting', array(
        'label' => __('Greeting Message', 'dolonia'),
        'section' => 'dolonia_live_chat',
        'type' => 'textarea',
    ));
}
add_action('customize_register', 'dolonia_customize_register');

/**
 * Theme Setup
 */
function dolonia_theme_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'dolonia'),
        'footer' => __('Footer Menu', 'dolonia'),
    ));
}
add_action('after_setup_theme', 'dolonia_theme_setup');

/**
 * Enqueue styles and scripts
 */
function dolonia_enqueue_assets() {
    // Enqueue Google Fonts
    wp_enqueue_style(
        'dolonia-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
        array(),
        null
    );
    
    // Enqueue main stylesheet
    wp_enqueue_style(
        'dolonia-style',
        get_stylesheet_uri(),
        array(),
        wp_get_theme()->get('Version')
    );
    
    // Enqueue React build files
    $dist_path = get_template_directory_uri() . '/assets/dist/';
    
    // Main React styles
    if (file_exists(get_template_directory() . '/assets/dist/style.css')) {
        wp_enqueue_style(
            'dolonia-react-styles',
            $dist_path . 'style.css',
            array('dolonia-style'),
            filemtime(get_template_directory() . '/assets/dist/style.css')
        );
    }
    
    // React components scripts
    if (file_exists(get_template_directory() . '/assets/dist/main.js')) {
        wp_enqueue_script(
            'dolonia-react-main',
            $dist_path . 'main.js',
            array(),
            filemtime(get_template_directory() . '/assets/dist/main.js'),
            true
        );
    }
    
    // Binary Rain component
    if (file_exists(get_template_directory() . '/assets/dist/binaryRain.js')) {
        wp_enqueue_script(
            'dolonia-binary-rain',
            $dist_path . 'binaryRain.js',
            array(),
            filemtime(get_template_directory() . '/assets/dist/binaryRain.js'),
            true
        );
    }
    
    // LiveChat component
    if (file_exists(get_template_directory() . '/assets/dist/liveChat.js')) {
        wp_enqueue_script(
            'dolonia-live-chat',
            $dist_path . 'liveChat.js',
            array(),
            filemtime(get_template_directory() . '/assets/dist/liveChat.js'),
            true
        );
    }
    
    // Localize script with WordPress data and customizer settings
    wp_localize_script('dolonia-react-main', 'doloniaWP', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('dolonia_nonce'),
        'themeUrl' => get_template_directory_uri(),
        'settings' => array(
            'binaryRain' => array(
                'enabled' => get_theme_mod('dolonia_binary_rain_enabled', true),
                'performance' => get_theme_mod('dolonia_binary_rain_performance', 'high'),
                'patterns' => get_theme_mod('dolonia_binary_rain_patterns', array('fall', 'matrix', 'wave')),
                'colors' => get_theme_mod('dolonia_binary_rain_colors', 'default'),
            ),
            'liveChat' => array(
                'enabled' => get_theme_mod('dolonia_live_chat_enabled', true),
                'position' => get_theme_mod('dolonia_live_chat_position', 'bottom-right'),
                'greeting' => get_theme_mod('dolonia_live_chat_greeting', 'Hello! How can Dolonia help secure your business today?'),
            ),
            'navigation' => array(
                'showTop' => get_theme_mod('dolonia_show_top_nav', false),
                'sidebarOnly' => get_theme_mod('dolonia_sidebar_only', true),
            )
        )
    ));
    
    // Main theme JavaScript
    wp_enqueue_script(
        'dolonia-main',
        get_template_directory_uri() . '/js/main.js',
        array('jquery'),
        wp_get_theme()->get('Version'),
        true
    );
        array('dolonia-fonts'),
        wp_get_theme()->get('Version')
    );
    
    // Enqueue custom JavaScript
    wp_enqueue_script(
        'dolonia-main',
        get_template_directory_uri() . '/js/main.js',
        array('jquery'),
        wp_get_theme()->get('Version'),
        true
    );
    
    // Localize script for AJAX
    wp_localize_script('dolonia-main', 'dolonia_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('dolonia_nonce'),
    ));
}
add_action('wp_enqueue_scripts', 'dolonia_enqueue_assets');

/**
 * Custom post types and fields
 */
function dolonia_create_custom_post_types() {
    // Testimonials Post Type
    register_post_type('testimonials', array(
        'labels' => array(
            'name' => 'Testimonials',
            'singular_name' => 'Testimonial',
            'add_new_item' => 'Add New Testimonial',
            'edit_item' => 'Edit Testimonial',
            'new_item' => 'New Testimonial',
            'view_item' => 'View Testimonial',
        ),
        'public' => true,
        'has_archive' => false,
        'supports' => array('title', 'editor', 'thumbnail'),
        'menu_icon' => 'dashicons-format-quote',
    ));
    
    // Services Post Type
    register_post_type('services', array(
        'labels' => array(
            'name' => 'Services',
            'singular_name' => 'Service',
            'add_new_item' => 'Add New Service',
            'edit_item' => 'Edit Service',
            'new_item' => 'New Service',
            'view_item' => 'View Service',
        ),
        'public' => true,
        'has_archive' => true,
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
        'menu_icon' => 'dashicons-admin-tools',
    ));
}
add_action('init', 'dolonia_create_custom_post_types');

/**
 * Add custom meta boxes
 */
function dolonia_add_meta_boxes() {
    add_meta_box(
        'testimonial_details',
        'Testimonial Details',
        'dolonia_testimonial_meta_box',
        'testimonials',
        'normal',
        'high'
    );
    
    add_meta_box(
        'service_details',
        'Service Details',
        'dolonia_service_meta_box',
        'services',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'dolonia_add_meta_boxes');

/**
 * Testimonial meta box callback
 */
function dolonia_testimonial_meta_box($post) {
    wp_nonce_field('dolonia_testimonial_nonce', 'testimonial_nonce');
    
    $company = get_post_meta($post->ID, '_testimonial_company', true);
    $position = get_post_meta($post->ID, '_testimonial_position', true);
    $rating = get_post_meta($post->ID, '_testimonial_rating', true);
    
    echo '<table class="form-table">';
    echo '<tr><th><label for="testimonial_company">Company</label></th>';
    echo '<td><input type="text" id="testimonial_company" name="testimonial_company" value="' . esc_attr($company) . '" class="regular-text"></td></tr>';
    echo '<tr><th><label for="testimonial_position">Position</label></th>';
    echo '<td><input type="text" id="testimonial_position" name="testimonial_position" value="' . esc_attr($position) . '" class="regular-text"></td></tr>';
    echo '<tr><th><label for="testimonial_rating">Rating (1-5)</label></th>';
    echo '<td><select id="testimonial_rating" name="testimonial_rating">';
    for ($i = 1; $i <= 5; $i++) {
        echo '<option value="' . $i . '"' . selected($rating, $i, false) . '>' . $i . ' Star' . ($i > 1 ? 's' : '') . '</option>';
    }
    echo '</select></td></tr>';
    echo '</table>';
}

/**
 * Service meta box callback
 */
function dolonia_service_meta_box($post) {
    wp_nonce_field('dolonia_service_nonce', 'service_nonce');
    
    $icon = get_post_meta($post->ID, '_service_icon', true);
    $price = get_post_meta($post->ID, '_service_price', true);
    
    echo '<table class="form-table">';
    echo '<tr><th><label for="service_icon">Icon Class (e.g., fas fa-shield-alt)</label></th>';
    echo '<td><input type="text" id="service_icon" name="service_icon" value="' . esc_attr($icon) . '" class="regular-text"></td></tr>';
    echo '<tr><th><label for="service_price">Starting Price</label></th>';
    echo '<td><input type="text" id="service_price" name="service_price" value="' . esc_attr($price) . '" class="regular-text"></td></tr>';
    echo '</table>';
}

/**
 * Save meta box data
 */
function dolonia_save_meta_boxes($post_id) {
    // Testimonials
    if (isset($_POST['testimonial_nonce']) && wp_verify_nonce($_POST['testimonial_nonce'], 'dolonia_testimonial_nonce')) {
        if (isset($_POST['testimonial_company'])) {
            update_post_meta($post_id, '_testimonial_company', sanitize_text_field($_POST['testimonial_company']));
        }
        if (isset($_POST['testimonial_position'])) {
            update_post_meta($post_id, '_testimonial_position', sanitize_text_field($_POST['testimonial_position']));
        }
        if (isset($_POST['testimonial_rating'])) {
            update_post_meta($post_id, '_testimonial_rating', intval($_POST['testimonial_rating']));
        }
    }
    
    // Services
    if (isset($_POST['service_nonce']) && wp_verify_nonce($_POST['service_nonce'], 'dolonia_service_nonce')) {
        if (isset($_POST['service_icon'])) {
            update_post_meta($post_id, '_service_icon', sanitize_text_field($_POST['service_icon']));
        }
        if (isset($_POST['service_price'])) {
            update_post_meta($post_id, '_service_price', sanitize_text_field($_POST['service_price']));
        }
    }
}
add_action('save_post', 'dolonia_save_meta_boxes');

/**
 * Handle newsletter signup AJAX
 */
function dolonia_handle_newsletter_signup() {
    check_ajax_referer('dolonia_nonce', 'nonce');
    
    $email = sanitize_email($_POST['email']);
    
    if (!is_email($email)) {
        wp_die(json_encode(array('success' => false, 'message' => 'Invalid email address')));
    }
    
    // You can integrate with your email service here
    // For now, we'll just store in WordPress options or send an email
    
    $subscribers = get_option('dolonia_newsletter_subscribers', array());
    if (!in_array($email, $subscribers)) {
        $subscribers[] = $email;
        update_option('dolonia_newsletter_subscribers', $subscribers);
        
        // Send notification email to admin
        wp_mail(
            get_option('admin_email'),
            'New Newsletter Subscriber',
            'New subscriber: ' . $email
        );
        
        wp_die(json_encode(array('success' => true, 'message' => 'Successfully subscribed!')));
    } else {
        wp_die(json_encode(array('success' => false, 'message' => 'Email already subscribed')));
    }
}
add_action('wp_ajax_newsletter_signup', 'dolonia_handle_newsletter_signup');
add_action('wp_ajax_nopriv_newsletter_signup', 'dolonia_handle_newsletter_signup');

/**
 * Handle contact form AJAX
 */
function dolonia_handle_contact_form() {
    check_ajax_referer('dolonia_nonce', 'nonce');
    
    $name = sanitize_text_field($_POST['name']);
    $email = sanitize_email($_POST['email']);
    $message = sanitize_textarea_field($_POST['message']);
    $company = sanitize_text_field($_POST['company']);
    
    if (empty($name) || empty($email) || empty($message)) {
        wp_die(json_encode(array('success' => false, 'message' => 'All fields are required')));
    }
    
    if (!is_email($email)) {
        wp_die(json_encode(array('success' => false, 'message' => 'Invalid email address')));
    }
    
    // Send email
    $subject = 'New Contact Form Submission from ' . $name;
    $body = "Name: $name\n";
    $body .= "Email: $email\n";
    $body .= "Company: $company\n\n";
    $body .= "Message:\n$message";
    
    $headers = array('Content-Type: text/html; charset=UTF-8');
    
    if (wp_mail(get_option('admin_email'), $subject, nl2br($body), $headers)) {
        wp_die(json_encode(array('success' => true, 'message' => 'Message sent successfully!')));
    } else {
        wp_die(json_encode(array('success' => false, 'message' => 'Error sending message')));
    }
}
add_action('wp_ajax_contact_form', 'dolonia_handle_contact_form');
add_action('wp_ajax_nopriv_contact_form', 'dolonia_handle_contact_form');

/**
 * Enhanced Customizer settings for React components
 */
function dolonia_customize_register($wp_customize) {
    
    // ===== BINARY RAIN SECTION =====
    $wp_customize->add_section('dolonia_binary_rain', array(
        'title' => __('Binary Rain Animation', 'dolonia'),
        'description' => __('Customize the dynamic binary rain background effect', 'dolonia'),
        'priority' => 30,
    ));

    // Enable Binary Rain
    $wp_customize->add_setting('dolonia_binary_rain_enabled', array(
        'default' => true,
        'sanitize_callback' => 'dolonia_sanitize_checkbox',
    ));
    $wp_customize->add_control('dolonia_binary_rain_enabled', array(
        'label' => __('Enable Binary Rain', 'dolonia'),
        'section' => 'dolonia_binary_rain',
        'type' => 'checkbox',
    ));

    // Performance Mode
    $wp_customize->add_setting('dolonia_binary_rain_performance', array(
        'default' => 'high',
        'sanitize_callback' => 'dolonia_sanitize_select',
    ));
    $wp_customize->add_control('dolonia_binary_rain_performance', array(
        'label' => __('Performance Mode', 'dolonia'),
        'section' => 'dolonia_binary_rain',
        'type' => 'select',
        'choices' => array(
            'low' => __('Low (Better for older devices)', 'dolonia'),
            'medium' => __('Medium (Balanced)', 'dolonia'),
            'high' => __('High (Best visual quality)', 'dolonia'),
        ),
    ));

    // Rain Patterns
    $wp_customize->add_setting('dolonia_binary_rain_patterns', array(
        'default' => 'fall,matrix,wave,spiral,glitch,cascade',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('dolonia_binary_rain_patterns', array(
        'label' => __('Active Patterns', 'dolonia'),
        'description' => __('Comma-separated: fall,matrix,wave,spiral,glitch,cascade', 'dolonia'),
        'section' => 'dolonia_binary_rain',
        'type' => 'text',
    ));

    // Color Scheme
    $wp_customize->add_setting('dolonia_binary_rain_colors', array(
        'default' => 'default',
        'sanitize_callback' => 'dolonia_sanitize_select',
    ));
    $wp_customize->add_control('dolonia_binary_rain_colors', array(
        'label' => __('Color Scheme', 'dolonia'),
        'section' => 'dolonia_binary_rain',
        'type' => 'select',
        'choices' => array(
            'default' => __('Default (Multi-color)', 'dolonia'),
            'matrix' => __('Matrix Green', 'dolonia'),
            'cyber_blue' => __('Cyber Blue', 'dolonia'),
            'neon_pink' => __('Neon Pink', 'dolonia'),
            'monochrome' => __('Monochrome', 'dolonia'),
        ),
    ));

    // ===== LIVE CHAT SECTION =====
    $wp_customize->add_section('dolonia_live_chat', array(
        'title' => __('Live Chat Widget', 'dolonia'),
        'description' => __('Configure the interactive chat widget', 'dolonia'),
        'priority' => 31,
    ));

    // Enable Live Chat
    $wp_customize->add_setting('dolonia_live_chat_enabled', array(
        'default' => true,
        'sanitize_callback' => 'dolonia_sanitize_checkbox',
    ));
    $wp_customize->add_control('dolonia_live_chat_enabled', array(
        'label' => __('Enable Live Chat', 'dolonia'),
        'section' => 'dolonia_live_chat',
        'type' => 'checkbox',
    ));

    // Chat Position
    $wp_customize->add_setting('dolonia_live_chat_position', array(
        'default' => 'bottom-right',
        'sanitize_callback' => 'dolonia_sanitize_select',
    ));
    $wp_customize->add_control('dolonia_live_chat_position', array(
        'label' => __('Chat Position', 'dolonia'),
        'section' => 'dolonia_live_chat',
        'type' => 'select',
        'choices' => array(
            'bottom-right' => __('Bottom Right', 'dolonia'),
            'bottom-left' => __('Bottom Left', 'dolonia'),
            'top-right' => __('Top Right', 'dolonia'),
            'top-left' => __('Top Left', 'dolonia'),
        ),
    ));

    // Greeting Message
    $wp_customize->add_setting('dolonia_live_chat_greeting', array(
        'default' => 'Hello! How can Dolonia help secure your business today?',
        'sanitize_callback' => 'sanitize_textarea_field',
    ));
    $wp_customize->add_control('dolonia_live_chat_greeting', array(
        'label' => __('Greeting Message', 'dolonia'),
        'section' => 'dolonia_live_chat',
        'type' => 'textarea',
    ));

    // ===== NAVIGATION SECTION =====
    $wp_customize->add_section('dolonia_navigation', array(
        'title' => __('Navigation Settings', 'dolonia'),
        'description' => __('Configure navigation display options', 'dolonia'),
        'priority' => 32,
    ));

    // Show Top Navigation
    $wp_customize->add_setting('dolonia_show_top_nav', array(
        'default' => false,
        'sanitize_callback' => 'dolonia_sanitize_checkbox',
    ));
    $wp_customize->add_control('dolonia_show_top_nav', array(
        'label' => __('Show Top Navigation', 'dolonia'),
        'section' => 'dolonia_navigation',
        'type' => 'checkbox',
    ));

    // Sidebar Only Mode
    $wp_customize->add_setting('dolonia_sidebar_only', array(
        'default' => true,
        'sanitize_callback' => 'dolonia_sanitize_checkbox',
    ));
    $wp_customize->add_control('dolonia_sidebar_only', array(
        'label' => __('Sidebar Navigation Only', 'dolonia'),
        'description' => __('Use only the sidebar navigation (recommended)', 'dolonia'),
        'section' => 'dolonia_navigation',
        'type' => 'checkbox',
    ));

    // ===== EXISTING HERO SECTION =====
    $wp_customize->add_section('dolonia_hero', array(
        'title' => 'Hero Section',
        'priority' => 30,
    ));
    
    $wp_customize->add_setting('hero_title', array(
        'default' => 'Secure Your Digital Future',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('hero_title', array(
        'label' => 'Hero Title',
        'section' => 'dolonia_hero',
        'type' => 'text',
    ));
    
    $wp_customize->add_setting('hero_subtitle', array(
        'default' => 'Advanced cybersecurity solutions for modern businesses',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('hero_subtitle', array(
        'label' => 'Hero Subtitle',
        'section' => 'dolonia_hero',
        'type' => 'textarea',
    ));
    
    // Contact Information
    $wp_customize->add_section('dolonia_contact', array(
        'title' => 'Contact Information',
        'priority' => 35,
    ));
    
    $wp_customize->add_setting('contact_phone', array(
        'default' => '',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('contact_phone', array(
        'label' => 'Phone Number',
        'section' => 'dolonia_contact',
        'type' => 'text',
    ));
    
    $wp_customize->add_setting('contact_email', array(
        'default' => '',
        'sanitize_callback' => 'sanitize_email',
    ));
    
    $wp_customize->add_control('contact_email', array(
        'label' => 'Email Address',
        'section' => 'dolonia_contact',
        'type' => 'email',
    ));
}
add_action('customize_register', 'dolonia_customize_register');

/**
 * Get testimonials
 */
function dolonia_get_testimonials($limit = -1) {
    return get_posts(array(
        'post_type' => 'testimonials',
        'posts_per_page' => $limit,
        'post_status' => 'publish',
        'orderby' => 'menu_order',
        'order' => 'ASC',
    ));
}

/**
 * Get services
 */
function dolonia_get_services($limit = -1) {
    return get_posts(array(
        'post_type' => 'services',
        'posts_per_page' => $limit,
        'post_status' => 'publish',
        'orderby' => 'menu_order',
        'order' => 'ASC',
    ));
}

/**
 * Sanitization functions for customizer
 */
function dolonia_sanitize_checkbox($checked) {
    return ((isset($checked) && true == $checked) ? true : false);
}

function dolonia_sanitize_select($input, $setting) {
    $input = sanitize_key($input);
    $choices = $setting->manager->get_control($setting->id)->choices;
    return (array_key_exists($input, $choices) ? $input : $setting->default);
}

/**
 * AJAX handler for updating React component settings
 */
function dolonia_update_component_settings() {
    check_ajax_referer('dolonia_nonce', 'nonce');
    
    $component = sanitize_text_field($_POST['component']);
    $settings = $_POST['settings'];
    
    switch($component) {
        case 'binaryRain':
            set_theme_mod('dolonia_binary_rain_enabled', (bool)$settings['enabled']);
            set_theme_mod('dolonia_binary_rain_performance', sanitize_text_field($settings['performance']));
            set_theme_mod('dolonia_binary_rain_patterns', sanitize_text_field($settings['patterns']));
            break;
        case 'liveChat':
            set_theme_mod('dolonia_live_chat_enabled', (bool)$settings['enabled']);
            set_theme_mod('dolonia_live_chat_position', sanitize_text_field($settings['position']));
            set_theme_mod('dolonia_live_chat_greeting', sanitize_textarea_field($settings['greeting']));
            break;
    }
    
    wp_die(json_encode(array('success' => true)));
}
add_action('wp_ajax_dolonia_update_settings', 'dolonia_update_component_settings');

/**
 * Add React component containers to pages
 */
function dolonia_add_react_containers() {
    if (get_theme_mod('dolonia_binary_rain_enabled', true)) {
        echo '<div id="binary-rain-container"></div>';
    }
    
    if (get_theme_mod('dolonia_live_chat_enabled', true)) {
        echo '<div id="live-chat-container"></div>';
    }
}
add_action('wp_footer', 'dolonia_add_react_containers');
?>