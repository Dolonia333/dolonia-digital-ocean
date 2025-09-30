<?php
/* Front Page Template */
get_header();
?>
<main class="dolonia-hero">
  <div id="jelly-specks" data-jelly="<?php echo esc_url( get_template_directory_uri() . '/assets/jellyfish.svg' ); ?>"></div>

  <div class="hero-inner">
    <h1>Dolonia.cloud</h1>
    <p>Secure, modern infrastructure with an ocean-calm UX. We design and ship websites, automations, and managed hosting built for real-world scale.</p>

    <div class="cta">
      <a class="btn-primary" href="<?php echo esc_url( site_url('/contact') ); ?>">Get Started</a>
      <a class="btn-ghost" href="<?php echo esc_url( site_url('/services') ); ?>">View Services</a>
    </div>

    <ul class="stats">
      <li><span>99.9%</span> Uptime</li>
      <li><span>50+</span> Projects</li>
      <li><span>&lt;100ms</span> Avg. TTFB</li>
      <li><span>OKC &amp; Beyond</span> Clients</li>
    </ul>
  </div>
</main>
<?php get_footer();