<?php
// debug-info.php - Place in WordPress root to diagnose issues
echo "<h1>WordPress Debug Info</h1>";
echo "<h2>PHP Version:</h2><p>" . phpversion() . "</p>";
echo "<h2>WordPress Version:</h2><p>" . get_bloginfo('version') . "</p>";
echo "<h2>Theme:</h2><p>" . wp_get_theme()->get('Name') . "</p>";
echo "<h2>Active Plugins:</h2><pre>";
print_r(get_option('active_plugins'));
echo "</pre>";
echo "<h2>PHP Errors (last 20 lines):</h2><pre>";
$debug_log = WP_CONTENT_DIR . '/debug.log';
if (file_exists($debug_log)) {
    $lines = file($debug_log);
    $last_lines = array_slice($lines, -20);
    echo implode("", $last_lines);
} else {
    echo "No debug.log found. Enable WP_DEBUG_LOG in wp-config.php";
}
echo "</pre>";
?>