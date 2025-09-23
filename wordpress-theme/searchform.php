<?php
/**
 * Template for displaying search forms
 */
?>

<form role="search" method="get" class="search-form" action="<?php echo home_url('/'); ?>">
    <label>
        <span class="screen-reader-text"><?php echo _x('Search for:', 'label', 'dolonia'); ?></span>
        <input type="search" class="search-field"
               placeholder="<?php echo esc_attr_x('Search...', 'placeholder', 'dolonia'); ?>"
               value="<?php echo get_search_query(); ?>" name="s"
               title="<?php echo esc_attr_x('Search for:', 'label', 'dolonia'); ?>" />
    </label>
    <button type="submit" class="search-submit">
        <i class="fas fa-search"></i>
        <span class="screen-reader-text"><?php echo _x('Search', 'submit button', 'dolonia'); ?></span>
    </button>
</form>