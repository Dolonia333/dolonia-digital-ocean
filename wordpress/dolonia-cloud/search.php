<?php
/**
 * The template for displaying search results
 */

get_header(); ?>

<main class="main-content">
    <div class="container">
        <header class="search-header">
            <h1 class="search-title">
                Search Results for: "<?php echo get_search_query(); ?>"
            </h1>
            <div class="search-form-container">
                <?php get_search_form(); ?>
            </div>
        </header>

        <div class="search-results">
            <?php if (have_posts()) : ?>
                <div class="results-count">
                    Found <?php echo $wp_query->found_posts; ?> result(s)
                </div>

                <div class="posts-grid">
                    <?php while (have_posts()) : the_post(); ?>
                        <article class="post-card search-result">
                            <?php if (has_post_thumbnail()): ?>
                                <div class="post-thumbnail">
                                    <a href="<?php the_permalink(); ?>">
                                        <?php the_post_thumbnail('medium'); ?>
                                    </a>
                                </div>
                            <?php endif; ?>

                            <div class="post-content">
                                <header class="post-header">
                                    <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                                    <div class="post-meta">
                                        <span class="post-date"><?php echo get_the_date(); ?></span>
                                        <span class="post-type"><?php echo get_post_type(); ?></span>
                                    </div>
                                </header>

                                <div class="post-excerpt">
                                    <?php the_excerpt(); ?>
                                </div>

                                <a href="<?php the_permalink(); ?>" class="read-more">Read More</a>
                            </div>
                        </article>
                    <?php endwhile; ?>
                </div>

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
                <div class="no-results">
                    <h2>No results found</h2>
                    <p>Sorry, no content matches your search term. Please try again with different keywords.</p>

                    <div class="search-suggestions">
                        <h3>Search Suggestions:</h3>
                        <ul>
                            <li>Make sure all words are spelled correctly</li>
                            <li>Try different keywords</li>
                            <li>Try more general keywords</li>
                            <li>Try fewer keywords</li>
                        </ul>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </div>
</main>

<style>
.search-header {
    text-align: center;
    margin-bottom: 3rem;
}

.search-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: hsl(var(--foreground));
    margin-bottom: 2rem;
}

.search-form-container {
    max-width: 500px;
    margin: 0 auto;
}

.results-count {
    font-size: 1.125rem;
    color: hsl(var(--muted));
    margin-bottom: 2rem;
    text-align: center;
}

.no-results {
    text-align: center;
    padding: 3rem 0;
}

.no-results h2 {
    color: hsl(var(--foreground));
    margin-bottom: 1rem;
}

.search-suggestions {
    margin-top: 2rem;
    text-align: left;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
}

.search-suggestions h3 {
    color: hsl(var(--foreground));
    margin-bottom: 1rem;
}

.search-suggestions ul {
    list-style: disc;
    padding-left: 1.5rem;
}

.search-suggestions li {
    color: hsl(var(--muted));
    margin-bottom: 0.5rem;
}
</style>

<?php get_footer(); ?>