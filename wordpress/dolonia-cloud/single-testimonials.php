<?php
/**
 * Template for displaying single testimonials
 */

get_header(); ?>

<main class="main-content">
    <div class="container">
        <?php while (have_posts()) : the_post(); ?>
            <article class="testimonial-single">
                <div class="testimonial-content">
                    <div class="testimonial-quote">
                        <?php the_content(); ?>
                    </div>

                    <div class="testimonial-author">
                        <div class="author-info">
                            <?php if (has_post_thumbnail()): ?>
                                <div class="author-avatar">
                                    <?php the_post_thumbnail('thumbnail'); ?>
                                </div>
                            <?php endif; ?>

                            <div class="author-details">
                                <h1><?php the_title(); ?></h1>
                                <?php
                                $company = get_post_meta(get_the_ID(), '_testimonial_company', true);
                                $position = get_post_meta(get_the_ID(), '_testimonial_position', true);
                                $rating = get_post_meta(get_the_ID(), '_testimonial_rating', true);
                                ?>
                                <?php if ($position && $company): ?>
                                    <p class="author-position"><?php echo esc_html($position); ?> at <?php echo esc_html($company); ?></p>
                                <?php elseif ($position): ?>
                                    <p class="author-position"><?php echo esc_html($position); ?></p>
                                <?php elseif ($company): ?>
                                    <p class="author-position"><?php echo esc_html($company); ?></p>
                                <?php endif; ?>

                                <?php if ($rating): ?>
                                    <div class="testimonial-rating">
                                        <?php for ($i = 1; $i <= 5; $i++): ?>
                                            <i class="fas fa-star <?php echo $i <= $rating ? 'filled' : ''; ?>"></i>
                                        <?php endfor; ?>
                                    </div>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        <?php endwhile; ?>

        <div class="related-testimonials">
            <h2>More Testimonials</h2>
            <div class="testimonials-grid">
                <?php
                $related_testimonials = get_posts(array(
                    'post_type' => 'testimonials',
                    'posts_per_page' => 3,
                    'post__not_in' => array(get_the_ID()),
                    'orderby' => 'rand'
                ));

                foreach ($related_testimonials as $testimonial):
                ?>
                    <div class="testimonial-card">
                        <div class="testimonial-quote">
                            <?php echo wp_trim_words($testimonial->post_content, 30); ?>
                        </div>
                        <div class="testimonial-author">
                            <strong><?php echo esc_html($testimonial->post_title); ?></strong>
                            <?php
                            $company = get_post_meta($testimonial->ID, '_testimonial_company', true);
                            if ($company) echo '<br><small>' . esc_html($company) . '</small>';
                            ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</main>

<style>
.testimonial-single {
    padding: 4rem 0;
}

.testimonial-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
}

.testimonial-quote {
    font-size: 1.5rem;
    line-height: 1.6;
    color: hsl(var(--foreground));
    margin-bottom: 3rem;
    position: relative;
}

.testimonial-quote:before,
.testimonial-quote:after {
    content: '"';
    font-size: 4rem;
    color: hsl(var(--primary));
    position: absolute;
    top: -20px;
}

.testimonial-quote:before {
    left: -40px;
}

.testimonial-quote:after {
    right: -40px;
}

.author-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.author-avatar img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 3px solid hsl(var(--primary));
}

.author-details h1 {
    font-size: 1.5rem;
    color: hsl(var(--foreground));
    margin-bottom: 0.5rem;
}

.author-position {
    color: hsl(var(--muted));
    font-size: 1.125rem;
}

.testimonial-rating {
    margin-top: 1rem;
}

.testimonial-rating .fa-star {
    color: hsl(var(--muted));
    margin-right: 0.25rem;
}

.testimonial-rating .fa-star.filled {
    color: hsl(var(--primary));
}

.related-testimonials {
    margin-top: 4rem;
    padding-top: 4rem;
    border-top: 1px solid hsl(var(--muted) / 0.2);
}

.related-testimonials h2 {
    text-align: center;
    color: hsl(var(--foreground));
    margin-bottom: 2rem;
}

.testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.testimonial-card {
    background: hsl(var(--background));
    border: 1px solid hsl(var(--muted) / 0.2);
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
}

.testimonial-card .testimonial-quote {
    font-size: 1.125rem;
    margin-bottom: 1.5rem;
    position: relative;
}

.testimonial-card .testimonial-quote:before,
.testimonial-card .testimonial-quote:after {
    font-size: 2rem;
    top: -10px;
}

.testimonial-card .testimonial-author {
    color: hsl(var(--muted));
}
</style>

<?php get_footer(); ?>