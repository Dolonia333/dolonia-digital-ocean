<?php
/**
 * The template for displaying 404 pages (not found)
 */

get_header(); ?>

<main class="main-content">
    <div class="container">
        <section class="error-404">
            <div class="error-content">
                <h1 class="error-title">404</h1>
                <h2 class="error-subtitle">Page Not Found</h2>
                <p class="error-message">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <div class="error-actions">
                    <a href="<?php echo home_url(); ?>" class="btn btn-primary">Go Home</a>
                    <a href="javascript:history.back()" class="btn btn-outline">Go Back</a>
                </div>

                <div class="error-search">
                    <h3>Search Our Site</h3>
                    <?php get_search_form(); ?>
                </div>
            </div>
        </section>
    </div>
</main>

<style>
.error-404 {
    text-align: center;
    padding: 4rem 0;
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.error-title {
    font-size: 8rem;
    font-weight: 900;
    background: var(--gradient-cyber);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1rem;
    text-shadow: var(--shadow-glow);
}

.error-subtitle {
    font-size: 2.5rem;
    font-weight: 700;
    color: hsl(var(--foreground));
    margin-bottom: 1rem;
}

.error-message {
    font-size: 1.25rem;
    color: hsl(var(--muted));
    margin-bottom: 2rem;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
}

.error-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 3rem;
    flex-wrap: wrap;
}

.error-search {
    max-width: 400px;
    margin: 0 auto;
}

.error-search h3 {
    color: hsl(var(--foreground));
    margin-bottom: 1rem;
}
</style>

<?php get_footer(); ?>