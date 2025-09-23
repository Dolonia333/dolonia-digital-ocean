# Dolonia Cybersecurity WordPress Theme - Installation Guide

## Quick Installation

1. **Download Theme Files**
   - Download all files from the `wordpress-theme` folder
   - Keep the folder structure intact

2. **Upload to WordPress**
   ```
   wp-content/
   └── themes/
       └── dolonia-cybersecurity/
           ├── style.css
           ├── index.php
           ├── functions.php
           ├── header.php
           ├── footer.php
           ├── page.php
           ├── single.php
           ├── archive.php
           ├── 404.php
           ├── search.php
           ├── searchform.php
           ├── single-testimonials.php
           ├── single-services.php
           ├── archive-testimonials.php
           ├── archive-services.php
           ├── js/
           │   └── main.js
           ├── screenshot.html
           └── README.txt
   ```

3. **Activate Theme**
   - Go to `Appearance > Themes` in WordPress admin
   - Find "Dolonia Cybersecurity" theme
   - Click "Activate"

## Post-Installation Setup

### 1. Upload Your Logo
- Go to `Appearance > Customize > Site Identity`
- Upload your company logo (recommended: 200x200px PNG with transparent background)
- The theme will automatically apply glitch effects to your logo

### 2. Configure Hero Section
- Go to `Appearance > Customize > Hero Section`
- Set hero title (e.g., "Secure Your Digital Future")
- Set hero subtitle (e.g., "Advanced cybersecurity solutions for modern businesses")

### 3. Add Contact Information
- Go to `Appearance > Customize > Contact Information`
- Add your phone number
- Add your email address
- These will appear in the footer and structured data

### 4. Create Sample Content

#### Add Testimonials:
1. Go to `Testimonials > Add New`
2. Add testimonial content
3. Fill in the testimonial details meta box:
   - Company name
   - Person's position
   - Rating (1-5 stars)
4. Upload a photo (optional)
5. Publish

#### Add Services:
1. Go to `Services > Add New`
2. Add service title and description
3. Fill in the service details meta box
4. Upload a featured image
5. Publish

### 5. Create Essential Pages

Create these pages for full functionality:

#### Contact Page:
- Create a page called "Contact"
- Add contact form shortcode or use a contact form plugin
- The theme has built-in contact styling

#### About Page:
- Create a page called "About"
- Add your company information

#### Services Page:
- Create a page called "Services"
- Add `[services_archive]` shortcode to display all services

#### Testimonials Page:
- Create a page called "Testimonials"
- Add `[testimonials_archive]` shortcode to display all testimonials

### 6. Menu Setup

#### Primary Menu:
- Go to `Appearance > Menus`
- Create a new menu called "Primary Menu"
- Add your main navigation items
- Assign to "Primary Menu" location

#### Footer Menu:
- Create a new menu called "Footer Menu"
- Add footer links (Privacy Policy, Terms, etc.)
- Assign to "Footer Menu" location

### 7. Theme Features

#### Binary Rain Effect:
- Automatically enabled on homepage
- Customizable through theme options (coming in future updates)

#### Glitch Logo Effect:
- Applied automatically to custom logo
- Works best with PNG logos with transparent backgrounds

#### Responsive Design:
- Fully responsive on all devices
- Mobile-optimized navigation and layouts

#### SEO Optimized:
- Proper meta tags and structured data
- Schema.org markup for business information
- Open Graph and Twitter Card support

### 8. Customization Options

#### Colors:
- Ocean-themed color scheme
- CSS custom properties for easy customization
- Gradient backgrounds and glow effects

#### Typography:
- Inter font family from Google Fonts
- Responsive font scaling
- Proper heading hierarchy

#### Animations:
- Smooth transitions and hover effects
- Binary rain background animation
- Glitch effects on interactive elements

### 9. Performance Optimization

#### Fast Loading:
- Optimized CSS and JavaScript
- Lazy loading for images
- Minimal HTTP requests

#### SEO Ready:
- Semantic HTML structure
- Proper heading hierarchy
- Alt text for images
- Meta descriptions and titles

### 10. Troubleshooting

#### Theme Not Activating:
- Check PHP version (requires 7.4+)
- Check WordPress version (requires 5.0+)
- Check file permissions

#### Styles Not Loading:
- Clear browser cache
- Check if child theme is active
- Verify theme files are uploaded correctly

#### Custom Post Types Not Showing:
- Go to `Settings > Permalinks`
- Click "Save Changes" to flush rewrite rules
- Check if custom post types are registered

#### Logo Not Showing Glitch Effect:
- Ensure logo is PNG with transparent background
- Check logo dimensions (recommended 200x200px)
- Clear browser cache

### 11. Development

#### Theme Structure:
```
dolonia-cybersecurity/
├── style.css           # Main stylesheet
├── functions.php       # Theme functions and setup
├── index.php          # Homepage template
├── header.php         # Header template
├── footer.php         # Footer template
├── page.php           # Page template
├── single.php         # Single post template
├── archive.php        # Archive template
├── 404.php           # 404 error template
├── search.php         # Search results template
├── searchform.php     # Search form template
├── single-testimonials.php    # Testimonial single template
├── single-services.php        # Service single template
├── archive-testimonials.php   # Testimonials archive template
├── archive-services.php       # Services archive template
├── js/
│   └── main.js        # JavaScript functionality
├── screenshot.html    # Theme preview (convert to PNG)
└── README.txt         # Theme information
```

#### Customization:
- Edit `style.css` for visual changes
- Modify `functions.php` for functionality changes
- Update `js/main.js` for interactive features
- Create child theme for major customizations

### 12. Support

For support and updates:
- Check the theme documentation
- Visit the theme repository
- Contact the theme developer

---

**Theme Version:** 1.0
**Last Updated:** September 2025
**WordPress Compatibility:** 5.0+
**PHP Compatibility:** 7.4+
2. Create testimonials with:
   - Title: Customer name
   - Content: Testimonial quote
   - Company: Customer's company
   - Position: Customer's job title
   - Rating: 1-5 stars

#### Add Services:
1. Go to `Services > Add New`
2. Create services with:
   - Title: Service name
   - Content: Service description
   - Excerpt: Short description for cards
   - Icon: Font Awesome class (e.g., "fas fa-shield-alt")
   - Price: Starting price (e.g., "$2,999")

### 5. Set Up Navigation Menu
1. Go to `Appearance > Menus`
2. Create a new menu called "Primary Menu"
3. Add pages/links:
   - Home (#hero)
   - Services (#services)
   - About (#about)
   - Contact (#contact)
4. Assign to "Primary Menu" location

### 6. Create Essential Pages
Create these pages for a complete website:
- Privacy Policy
- Terms of Service  
- About Us (optional)

## Theme Features

### Visual Effects
- **Binary Rain Background**: Animated falling binary code
- **Logo Glitch Effects**: Cyberpunk-style logo animations
- **Smooth Animations**: Scroll-triggered fade-in effects
- **Hover Effects**: Interactive button and card animations

### Interactive Elements
- **Cost Calculator**: Automated pricing estimates
- **Contact Form**: AJAX-powered contact form
- **Newsletter Signup**: Email subscription form
- **Live Chat Widget**: Placeholder for future chat integration

### SEO Optimization
- Schema.org structured data
- Optimized meta tags
- Semantic HTML structure
- Fast loading performance

## Customization Options

### Color Scheme
Edit CSS variables in `style.css`:
```css
:root {
  --primary: 199 89% 48%;        /* Main brand color */
  --primary-glow: 194 100% 85%;  /* Glow effects */
  --accent: 158 64% 52%;         /* Accent color */
  /* ... more colors ... */
}
```

### Background Effects
Modify binary rain in `js/main.js`:
```javascript
// Adjust column count and animation speed
const columns = Math.floor(windowWidth / 20);
animationDuration: (Math.random() * 3 + 2) + 's';
```

### Content Sections
Edit sections in `index.php`:
- Hero section
- Services section
- Testimonials section
- Cost calculator
- Contact form
- Newsletter signup

## Troubleshooting

### Binary Rain Not Showing
- Ensure JavaScript is enabled
- Check browser console for errors
- Verify `js/main.js` is loading properly

### Forms Not Working
- Check that AJAX is working
- Verify WordPress nonce security
- Test with different browsers

### Logo Glitch Effect Not Working
- Upload logo via Customizer > Site Identity
- Ensure logo is properly sized (200x200px recommended)
- Check CSS animations are enabled

### Mobile Issues
- Clear browser cache
- Test responsive breakpoints
- Verify touch interactions work

## Performance Tips

1. **Optimize Images**: Use WebP format when possible
2. **Use Caching**: Install a caching plugin
3. **Minimize Plugins**: Only use necessary plugins
4. **CDN**: Consider using a content delivery network

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest) 
- ✅ Safari (latest)
- ✅ Edge (latest)
- ⚠️ Internet Explorer 11 (limited support)

## Support

For technical issues or customization help:
1. Check the browser console for JavaScript errors
2. Verify all theme files are uploaded correctly
3. Test with default WordPress content
4. Contact theme developer for advanced customization

## Security Considerations

This theme includes:
- CSRF protection via WordPress nonces
- Input sanitization for forms
- Secure AJAX handling
- XSS prevention measures

Always keep WordPress and plugins updated for security.

---

**Theme Version**: 1.0  
**WordPress Compatibility**: 5.0+  
**PHP Requirement**: 7.4+