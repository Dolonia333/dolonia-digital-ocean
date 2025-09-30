<?php
/**
 * The template for displaying all pages
 */

get_header(); ?>

<main class="main-content">
    <div class="container">
        <?php while (have_posts()) : the_post(); ?>
            <article class="page-content">
                <header class="page-header">
                    <h1><?php the_title(); ?></h1>
                </header>

                <div class="page-body">
                    <?php the_content(); ?>
                </div>
            </article>
        <?php endwhile; ?>
    </div>
</main>

<?php get_footer(); ?>