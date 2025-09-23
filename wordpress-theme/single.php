<?php
/**
 * The template for displaying all single posts
 */

get_header(); ?>

<main class="main-content">
    <div class="container">
        <?php while (have_posts()) : the_post(); ?>
            <article class="post-content">
                <header class="post-header">
                    <h1><?php the_title(); ?></h1>
                    <div class="post-meta">
                        <span class="post-date"><?php echo get_the_date(); ?></span>
                        <span class="post-author">by <?php the_author(); ?></span>
                        <?php if (get_the_category_list()): ?>
                            <span class="post-categories"><?php the_category(', '); ?></span>
                        <?php endif; ?>
                    </div>
                </header>

                <?php if (has_post_thumbnail()): ?>
                    <div class="post-thumbnail">
                        <?php the_post_thumbnail('large'); ?>
                    </div>
                <?php endif; ?>

                <div class="post-body">
                    <?php the_content(); ?>
                </div>

                <footer class="post-footer">
                    <?php the_tags('<div class="post-tags">Tags: ', ', ', '</div>'); ?>

                    <div class="post-navigation">
                        <?php
                        the_post_navigation(array(
                            'prev_text' => '<span class="nav-subtitle">Previous:</span> <span class="nav-title">%title</span>',
                            'next_text' => '<span class="nav-subtitle">Next:</span> <span class="nav-title">%title</span>',
                        ));
                        ?>
                    </div>
                </footer>
            </article>
        <?php endwhile; ?>
    </div>
</main>

<?php get_footer(); ?>