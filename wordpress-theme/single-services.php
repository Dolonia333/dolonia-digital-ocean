<?php
/**
 * Template for displaying single services
 */

get_header(); ?>

<main class="main-content">
    <div class="container">
        <?php while (have_posts()) : the_post(); ?>
            <article class="service-single">
                <header class="service-header">
                    <?php if (has_post_thumbnail()): ?>
                        <div class="service-thumbnail">
                            <?php the_post_thumbnail('large'); ?>
                        </div>
                    <?php endif; ?>

                    <div class="service-title-section">
                        <h1><?php the_title(); ?></h1>
                        <?php if (has_excerpt()): ?>
                            <div class="service-excerpt">
                                <?php the_excerpt(); ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </header>

                <div class="service-content">
                    <?php the_content(); ?>
                </div>

                <div class="service-cta">
                    <h3>Ready to Get Started?</h3>
                    <p>Contact us today to discuss your cybersecurity needs and get a custom solution for your business.</p>
                    <div class="cta-buttons">
                        <a href="#contact" class="btn btn-primary">Get Quote</a>
                        <a href="#services" class="btn btn-outline">View All Services</a>
                    </div>
                </div>
            </article>
        <?php endwhile; ?>

        <div class="related-services">
            <h2>Related Services</h2>
            <div class="services-grid">
                <?php
                $related_services = get_posts(array(
                    'post_type' => 'services',
                    'posts_per_page' => 3,
                    'post__not_in' => array(get_the_ID()),
                    'orderby' => 'rand'
                ));

                foreach ($related_services as $service):
                ?>
                    <div class="service-card">
                        <?php if (has_post_thumbnail($service->ID)): ?>
                            <div class="service-thumbnail">
                                <?php echo get_the_post_thumbnail($service->ID, 'medium'); ?>
                            </div>
                        <?php endif; ?>

                        <div class="service-content">
                            <h3><a href="<?php echo get_permalink($service->ID); ?>"><?php echo esc_html($service->post_title); ?></a></h3>
                            <?php if ($service->post_excerpt): ?>
                                <p><?php echo esc_html($service->post_excerpt); ?></p>
                            <?php else: ?>
                                <p><?php echo wp_trim_words($service->post_content, 20); ?></p>
                            <?php endif; ?>
                            <a href="<?php echo get_permalink($service->ID); ?>" class="read-more">Learn More</a>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</main>

<style>
.service-single {
    padding: 4rem 0;
}

.service-header {
    margin-bottom: 3rem;
}

.service-thumbnail {
    margin-bottom: 2rem;
}

.service-thumbnail img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: var(--shadow-cyber);
}

.service-title-section h1 {
    font-size: 3rem;
    font-weight: 700;
    color: hsl(var(--foreground));
    margin-bottom: 1rem;
    background: var(--gradient-cyber);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.service-excerpt {
    font-size: 1.25rem;
    color: hsl(var(--muted));
    max-width: 600px;
}

.service-content {
    max-width: 800px;
    margin: 0 auto 4rem;
    line-height: 1.7;
}

.service-content h2 {
    color: hsl(var(--foreground));
    margin: 2rem 0 1rem;
    font-size: 1.875rem;
}

.service-content h3 {
    color: hsl(var(--foreground));
    margin: 1.5rem 0 0.75rem;
    font-size: 1.5rem;
}

.service-content p {
    margin-bottom: 1rem;
    color: hsl(var(--muted));
}

.service-content ul,
.service-content ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
}

.service-content li {
    margin-bottom: 0.5rem;
    color: hsl(var(--muted));
}

.service-cta {
    background: linear-gradient(135deg, hsl(var(--background)), hsl(var(--muted) / 0.1));
    border: 1px solid hsl(var(--muted) / 0.2);
    border-radius: 12px;
    padding: 3rem;
    text-align: center;
    margin-bottom: 4rem;
}

.service-cta h3 {
    color: hsl(var(--foreground));
    font-size: 1.875rem;
    margin-bottom: 1rem;
}

.service-cta p {
    color: hsl(var(--muted));
    font-size: 1.125rem;
    margin-bottom: 2rem;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
}

.cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.related-services {
    padding-top: 4rem;
    border-top: 1px solid hsl(var(--muted) / 0.2);
}

.related-services h2 {
    text-align: center;
    color: hsl(var(--foreground));
    margin-bottom: 3rem;
    font-size: 2.25rem;
}

.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.service-card {
    background: hsl(var(--background));
    border: 1px solid hsl(var(--muted) / 0.2);
    border-radius: 8px;
    overflow: hidden;
    transition: var(--transition-smooth);
}

.service-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-cyber);
}

.service-card .service-thumbnail img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.service-card .service-content {
    padding: 1.5rem;
    margin: 0;
}

.service-card h3 {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
}

.service-card h3 a {
    color: hsl(var(--foreground));
    text-decoration: none;
}

.service-card h3 a:hover {
    color: hsl(var(--primary));
}

.service-card p {
    color: hsl(var(--muted));
    margin-bottom: 1rem;
    font-size: 0.875rem;
}

.service-card .read-more {
    color: hsl(var(--primary));
    text-decoration: none;
    font-weight: 500;
}

.service-card .read-more:hover {
    text-decoration: underline;
}
</style>

<?php get_footer(); ?>