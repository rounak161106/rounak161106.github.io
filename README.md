# 🎯 Modern Data Science Portfolio

A stunning, modern, and fully responsive portfolio website for Rounak Prasad - Aspiring Data Scientist.

## ✨ Features

- 🎨 Modern dark theme with gradient accents
- 🎭 Custom animated cursor
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🎬 Smooth scroll animations
- 💼 Dynamic projects section
- 🏆 Organized certifications display
- 📧 Contact form
- ⚡ Fast loading with optimized assets
- 🔍 SEO optimized
- ♿ Accessible (WCAG compliant)

## 📁 Project Structure

```
modern-portfolio/
├── index.html                 # Main HTML file
├── static/
│   ├── css/
│   │   └── style.css         # All styles
│   ├── js/
│   │   ├── main.js           # Main JavaScript
│   │   └── projects-data.js  # Projects data
│   ├── images/
│   │   └── profile.jpeg      # Your profile image (add yours)
│   └── certificates/         # All certificate images
│       ├── IITM-Foundation.jpg
│       ├── ML_Specialization.jpg
│       └── ... (all other certificates)
└── README.md                 # This file
```

## 🚀 Getting Started

### 1. Replace Profile Image
- Add your profile image to `static/images/profile.jpeg`
- Recommended size: 500x500px or larger (square)
- Format: JPG or PNG

### 2. Update Personal Information

#### In `index.html`:
- Line 17: Update meta description
- Line 18: Update keywords
- Line 25: Update og:image URL
- Line 139: Update your email
- Line 681: Update your email and location

#### In `static/js/main.js`:
- Line 182-187: Update typing text with your own titles

### 3. Add More Projects

Edit `static/js/projects-data.js`:

```javascript
{
    id: 7,  // Increment ID
    title: "Your Project Title",
    description: "Project description here",
    category: "ml",  // Options: "ml", "dl", "web"
    technologies: ["Python", "TensorFlow", "etc"],
    image: "",  // Optional: add image path
    github: "https://github.com/yourusername/project",
    demo: "https://your-demo-link.com",  // Optional
    featured: true  // Set to true for featured projects
}
```

### 4. Add More Certificates

1. Add certificate images to `static/certificates/`
2. Update `index.html` in the certifications section:

```html
<div class="cert-card" data-aos="zoom-in">
    <div class="cert-image">
        <img src="static/certificates/YOUR_CERT.jpg" alt="Certificate Name">
        <div class="cert-overlay">
            <button class="cert-view-btn" onclick="openCertModal('static/certificates/YOUR_CERT.jpg')">
                <i class="fas fa-expand"></i>
            </button>
        </div>
    </div>
    <div class="cert-info">
        <h4>Certificate Title</h4>
        <p class="cert-issuer">
            <i class="fas fa-university"></i>
            Issuing Organization
        </p>
        <p class="cert-date">
            <i class="fas fa-calendar"></i>
            Month Year
        </p>
    </div>
</div>
```

Add this within the appropriate category:
- `data-category="academic"` - Academic achievements
- `data-category="ml"` - Machine Learning certificates
- `data-category="programming"` - Programming certificates
- `data-category="others"` - Other certificates

## 📝 Customization Guide

### Changing Colors

Edit CSS variables in `static/css/style.css` (lines 8-14):

```css
:root {
    --primary-color: #667eea;      /* Main brand color */
    --secondary-color: #764ba2;    /* Secondary brand color */
    --accent-color: #f093fb;       /* Accent color */
    /* ... etc */
}
```

### Updating Social Links

Find and update these sections in `index.html`:
- Hero section (lines 135-143)
- Contact section (lines 649-663)
- Footer (lines 690-700)

### Modifying Sections

To add/remove sections:
1. Update navigation links in `<nav>` (lines 86-94)
2. Add/remove corresponding `<section>` elements
3. Update footer links (lines 707-713)

## 🎨 Skills Section

To update your skills, edit the skills section in `index.html` (starting at line 374):

```html
<div class="skill-item">
    <div class="skill-header">
        <span>Skill Name</span>
        <span class="skill-percentage">95%</span>
    </div>
    <div class="skill-bar">
        <div class="skill-progress" data-progress="95"></div>
    </div>
</div>
```

For skill tags (tools), edit around line 490:
```html
<span class="skill-tag">Tool Name</span>
```

## 📧 Contact Form Setup

### Option 1: Using Formspree (Recommended for GitHub Pages)
1. Sign up at [Formspree.io](https://formspree.io)
2. Get your form endpoint
3. Update form action in `static/js/main.js` (line 257)

### Option 2: Using EmailJS
1. Sign up at [EmailJS.com](https://www.emailjs.com)
2. Get your service ID, template ID, and user ID
3. Add EmailJS script to `index.html`
4. Update form handler in `static/js/main.js`

### Option 3: Custom Backend (Flask + MySQL)
If you want to use Flask with MySQL:
1. Create a separate backend repository
2. Deploy backend to Heroku/Railway/Render
3. Update form submission URL in `static/js/main.js`

## 🌐 Deployment to GitHub Pages

1. **Create a new repository** named `[your-username].github.io`

2. **Push your code:**
```bash
cd modern-portfolio
git init
git add .
git commit -m "Initial commit: Modern portfolio"
git branch -M main
git remote add origin https://github.com/[your-username]/[your-username].github.io.git
git push -u origin main
```

3. **Enable GitHub Pages:**
   - Go to repository Settings
   - Navigate to Pages
   - Select source: main branch
   - Click Save

4. **Your site will be live at:** `https://[your-username].github.io`

## 🔧 Maintenance

### Adding New Projects (Quick Steps):
1. Open `static/js/projects-data.js`
2. Copy an existing project object
3. Increment the `id`
4. Update all fields
5. Save and push to GitHub

### Adding New Certificates (Quick Steps):
1. Save certificate image to `static/certificates/`
2. Open `index.html`
3. Find the appropriate certification category
4. Copy an existing cert-card div
5. Update image path, title, issuer, and date
6. Save and push to GitHub

### Updating About Section:
Edit `index.html` starting at line 220. Update:
- Your description
- Education details (CGPA, dates)
- Skills list

## 📊 Analytics (Optional)

### Adding Google Analytics:
1. Get your GA tracking ID
2. Add this before `</head>` in `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## 🎯 SEO Tips

1. **Update meta tags** with your actual information
2. **Add sitemap.xml** for better indexing
3. **Create robots.txt** to guide search engines
4. **Use meaningful alt text** for all images
5. **Keep content fresh** by regularly updating projects
6. **Get backlinks** by sharing your portfolio
7. **Submit to Google Search Console**

## 🐛 Troubleshooting

**Issue: Images not loading**
- Check file paths are correct
- Ensure images are in the right directories
- Clear browser cache

**Issue: Animations not working**
- Check browser console for errors
- Ensure AOS library is loading
- Try hard refresh (Ctrl+Shift+R)

**Issue: Mobile menu not working**
- Check JavaScript console for errors
- Ensure main.js is loading correctly

**Issue: Contact form not working**
- Implement one of the contact form solutions above
- Check browser console for errors

## 📱 Browser Compatibility

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Opera (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎓 Technologies Used

- HTML5
- CSS3 (with CSS Grid & Flexbox)
- JavaScript (ES6+)
- AOS (Animate On Scroll)
- Font Awesome Icons
- Google Fonts (Poppins, Inter)

## 📄 License

This portfolio is free to use and modify for your own personal portfolio. Please give credit by linking back to the original if you use it.

## 🤝 Contributing

Found a bug or want to improve something? Feel free to:
1. Fork the repository
2. Make your changes
3. Submit a pull request

## 📞 Support

If you need help:
1. Check this README thoroughly
2. Look for solutions in browser console
3. Search for similar issues online
4. Contact via email or LinkedIn

## ✅ Checklist Before Going Live

- [ ] Added your profile image
- [ ] Updated all personal information
- [ ] Added all your projects
- [ ] Added all your certificates
- [ ] Updated social media links
- [ ] Tested contact form
- [ ] Checked all links work
- [ ] Tested on mobile devices
- [ ] Tested in different browsers
- [ ] Updated meta tags for SEO
- [ ] Removed placeholder content
- [ ] Enabled Google Analytics (optional)

## 🎉 Final Notes

Remember to:
- Keep your projects and certificates updated
- Maintain consistent branding
- Test regularly across devices
- Update your resume download link
- Share your portfolio link everywhere!

---

**Made with ❤️ and lots of ☕**

Good luck with your data science journey! 🚀
