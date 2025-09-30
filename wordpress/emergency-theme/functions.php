<?php
function emergency_enqueue_assets() {
    wp_enqueue_style('emergency-style', get_stylesheet_uri());
}
add_action('wp_enqueue_scripts', 'emergency_enqueue_assets');