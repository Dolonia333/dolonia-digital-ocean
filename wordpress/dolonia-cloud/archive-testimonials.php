<?php
/**
 * Template for displaying testimonials archive
 */

get_header(); ?>

<main class="main-content">
    <div class="container">
        <header class="archive-header">
            <h1 class="archive-title">Client Testimonials</h1>
            <p class="archive-description">See what our clients say about our cybersecurity services and solutions.</p>
        </header>

        <div class="testimonials-grid">
            <?php if (have_posts()) : ?>
                <?php while (have_posts()) : the_post(); ?>
                    <div class="testimonial-card">
                        <div class="testimonial-quote">
                            <?php the_content(); ?>
                        </div>

                        <div class="testimonial-author">
                            <?php if (has_post_thumbnail()): ?>
                                <div class="testimonial-avatar">
                                    <?php the_post_thumbnail('thumbnail'); ?>
                                </div>
                            <?php endif; ?>

                            <div class="author-info">
                                <h3><?php the_title(); ?></h3>
                                <?php
                                $company = get_post_meta(get_the_ID(), '_testimonial_company', true);
                                $position = get_post_meta(get_the_ID(), '_testimonial_position', true);
                                $rating = get_post_meta(get_the_ID(), '_testimonial_rating', true);
                                ?>
                                <?php if ($position && $company): ?>
                                    <p><?php echo esc_html($position); ?> at <?php echo esc_html($company); ?></p>
                                <?php elseif ($position): ?>
                                    <p><?php echo esc_html($position); ?></p>
                                <?php elseif ($company): ?>
                                    <p><?php echo esc_html($company); ?></p>
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
                <?php endwhile; ?>

                <div class="pagination">
                    <?php
                    the_posts_pagination(array(
                        'mid_size' => 2,
                        'prev_text' => 'Previous',
                        'next_text' => 'Next',
                    ));
                    ?>
                </div>

            <?php else : ?>
                <div class="no-testimonials">
                    <h2>No testimonials found</h2>
                    <p>Testimonials will appear here once they are added.</p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</main>

<style>
.archive-header {
    text-align: center;
    margin-bottom: 4rem;
}

.archive-title {
    font-size: 3rem;
    font-weight: 700;
    color: hsl(var(--foreground));
    margin-bottom: 1rem;
    background: var(--gradient-cyber);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.archive-description {
    font-size: 1.25rem;
    color: hsl(var(--muted));
    max-width: 600px;
    margin: 0 auto;
}

.testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
}

.testimonial-card {
    background: hsl(var(--background));
    border: 1px solid hsl(var(--muted) / 0.2);
    border-radius: 12px;
    padding: 2rem;
    position: relative;
    transition: var(--transition-smooth);
}

.testimonial-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-cyber);
}

.testimonial-quote {
    font-size: 1.125rem;
    line-height: 1.6;
    color: hsl(var(--foreground));
    margin-bottom: 2rem;
    position: relative;
}

.testimonial-quote:before {
    content: '"';
    font-size: 3rem;
    color: hsl(var(--primary));
    position: absolute;
    top: -20px;
    left: -20px;
    opacity: 0.3;
}

.testimonial-author {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.testimonial-avatar img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 2px solid hsl(var(--primary));
    flex-shrink: 0;
}

.author-info h3 {
    font-size: 1.125rem;
    color: hsl(var(--foreground));
    margin-bottom: 0.25rem;
}

.author-info p {
    color: hsl(var(--muted));
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
}

.testimonial-rating {
    margin-top: 0.5rem;
}

.testimonial-rating .fa-star {
    color: hsl(var(--muted));
    margin-right: 0.125rem;
    font-size: 0.875rem;
}

.testimonial-rating .fa-star.filled {
    color: hsl(var(--primary));
}

.pagination {
    display: flex;
    justify-content: center;
    margin-top: 3rem;
}

.pagination .page-numbers {
    display: inline-block;
    padding: 0.5rem 1rem;
    margin: 0 0.25rem;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--muted) / 0.2);
    border-radius: 4px;
    color: hsl(var(--foreground));
    text-decoration: none;
    transition: var(--transition-smooth);
}

.pagination .page-numbers:hover,
.pagination .page-numbers.current {
    background: hsl(var(--primary));
    color: white;
    border-color: hsl(var(--primary));
}

.no-testimonials {
    text-align: center;
    padding: 4rem 0;
    grid-column: 1 / -1;
}

.no-testimonials h2 {
    color: hsl(var(--foreground));
    margin-bottom: 1rem;
}

.no-testimonials p {
    color: hsl(var(--muted));
}
</style>

<?php get_footer(); ?>