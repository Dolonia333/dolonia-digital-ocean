<?php
/**
 * Template for displaying services archive
 */

get_header(); ?>

<main class="main-content">
    <div class="container">
        <header class="archive-header">
            <h1 class="archive-title">Our Cybersecurity Services</h1>
            <p class="archive-description">Comprehensive security solutions to protect your business from cyber threats.</p>
        </header>

        <div class="services-grid">
            <?php if (have_posts()) : ?>
                <?php while (have_posts()) : the_post(); ?>
                    <div class="service-card">
                        <?php if (has_post_thumbnail()): ?>
                            <div class="service-thumbnail">
                                <?php the_post_thumbnail('medium'); ?>
                            </div>
                        <?php endif; ?>

                        <div class="service-content">
                            <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>

                            <?php if (has_excerpt()): ?>
                                <div class="service-excerpt">
                                    <?php the_excerpt(); ?>
                                </div>
                            <?php else: ?>
                                <div class="service-excerpt">
                                    <?php echo wp_trim_words(get_the_content(), 30); ?>
                                </div>
                            <?php endif; ?>

                            <a href="<?php the_permalink(); ?>" class="read-more">Learn More</a>
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
                <div class="no-services">
                    <h2>No services found</h2>
                    <p>Services will appear here once they are added.</p>
                </div>
            <?php endif; ?>
        </div>

        <div class="services-cta">
            <div class="cta-content">
                <h2>Need a Custom Security Solution?</h2>
                <p>Every business is unique. Contact us to discuss your specific security requirements and get a tailored solution.</p>
                <div class="cta-buttons">
                    <a href="#contact" class="btn btn-primary">Get Custom Quote</a>
                    <a href="#calculator" class="btn btn-outline">Use Cost Calculator</a>
                </div>
            </div>
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

.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
}

.service-card {
    background: hsl(var(--background));
    border: 1px solid hsl(var(--muted) / 0.2);
    border-radius: 12px;
    overflow: hidden;
    transition: var(--transition-smooth);
    position: relative;
}

.service-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-cyber);
}

.service-thumbnail {
    position: relative;
    overflow: hidden;
}

.service-thumbnail img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: var(--transition-smooth);
}

.service-card:hover .service-thumbnail img {
    transform: scale(1.05);
}

.service-content {
    padding: 2rem;
}

.service-content h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
}

.service-content h2 a {
    color: hsl(var(--foreground));
    text-decoration: none;
    transition: var(--transition-smooth);
}

.service-content h2 a:hover {
    color: hsl(var(--primary));
}

.service-excerpt {
    color: hsl(var(--muted));
    line-height: 1.6;
    margin-bottom: 1.5rem;
}

.read-more {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: hsl(var(--primary));
    text-decoration: none;
    font-weight: 500;
    transition: var(--transition-smooth);
}

.read-more:hover {
    color: hsl(var(--primary-glow));
    text-decoration: underline;
}

.read-more:after {
    content: '→';
    transition: var(--transition-smooth);
}

.read-more:hover:after {
    transform: translateX(3px);
}

.pagination {
    display: flex;
    justify-content: center;
    margin-top: 3rem;
    grid-column: 1 / -1;
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

.no-services {
    text-align: center;
    padding: 4rem 0;
    grid-column: 1 / -1;
}

.no-services h2 {
    color: hsl(var(--foreground));
    margin-bottom: 1rem;
}

.no-services p {
    color: hsl(var(--muted));
}

.services-cta {
    background: linear-gradient(135deg, hsl(var(--background)), hsl(var(--muted) / 0.1));
    border: 1px solid hsl(var(--muted) / 0.2);
    border-radius: 16px;
    padding: 4rem 2rem;
    text-align: center;
    margin-top: 4rem;
}

.cta-content h2 {
    font-size: 2.25rem;
    color: hsl(var(--foreground));
    margin-bottom: 1rem;
}

.cta-content p {
    font-size: 1.125rem;
    color: hsl(var(--muted));
    max-width: 500px;
    margin: 0 auto 2rem;
}

.cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}
</style>

<?php get_footer(); ?>