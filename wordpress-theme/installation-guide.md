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
           ├── js/
           │   └── main.js
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