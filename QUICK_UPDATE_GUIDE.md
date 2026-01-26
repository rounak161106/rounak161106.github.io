# 🚀 Quick Update Guide

This guide shows you how to quickly update different parts of your portfolio.

## 📝 Daily/Weekly Updates

### Adding a New Project

1. Open `static/js/projects-data.js`
2. Add a new project object to the array:

```javascript
{
    id: 7,  // Next available ID
    title: "Sentiment Analysis Dashboard",
    description: "Real-time sentiment analysis of social media posts using NLP and deep learning.",
    category: "dl",  // "ml", "dl", or "web"
    technologies: ["Python", "BERT", "Flask", "React"],
    image: "static/images/projects/sentiment-dashboard.jpg",  // Optional
    github: "https://github.com/rounak161106/sentiment-analysis",
    demo: "https://sentiment-dashboard.herokuapp.com",  // Optional
    featured: true
}
```

3. Save the file
4. If you have an image, add it to `static/images/projects/`
5. Push to GitHub - changes will appear automatically!

### Adding a New Certificate

1. Save certificate image to `static/certificates/your-cert.jpg`
2. Open `index.html`
3. Find the section with comment `<!-- [Category] -->`
4. Copy this template and paste it:

```html
<div class="cert-card" data-aos="zoom-in">
    <div class="cert-image">
        <img src="static/certificates/your-cert.jpg" alt="Certificate Title">
        <div class="cert-overlay">
            <button class="cert-view-btn" onclick="openCertModal('static/certificates/your-cert.jpg')">
                <i class="fas fa-expand"></i>
            </button>
        </div>
    </div>
    <div class="cert-info">
        <h4>AWS Solutions Architect</h4>
        <p class="cert-issuer">
            <i class="fas fa-cloud"></i>
            Amazon Web Services
        </p>
        <p class="cert-date">
            <i class="fas fa-calendar"></i>
            February 2026
        </p>
    </div>
</div>
```

5. Update the details and save
6. Push to GitHub!

## 🎨 Styling Updates

### Changing Theme Colors

Edit `static/css/style.css` - find the `:root` section and update:

```css
:root {
    --primary-color: #YOUR_COLOR;
    --secondary-color: #YOUR_COLOR;
}
```

Popular color schemes:
- **Blue/Purple:** `#667eea` & `#764ba2` (current)
- **Green/Teal:** `#11998e` & `#38ef7d`
- **Red/Orange:** `#ff6b6b` & `#ffa07a`
- **Cyan/Blue:** `#4facfe` & `#00f2fe`

### Updating Profile Image

1. Replace `static/images/profile.jpeg` with your new image
2. Keep filename same OR update these lines in `index.html`:
   - Line 148: Hero section
   - Line 25: Open Graph meta tag

## 📧 Contact Info Updates

Update your contact information in these places:

**Email:**
- Line 139 in `index.html` (Hero section)
- Line 624 in `index.html` (Contact section)
- Line 697 in `index.html` (Footer)

**Location:**
- Line 637 in `index.html` (Contact section)

**Social Media:**
- Lines 135-143: Hero social links
- Lines 649-663: Contact social links
- Lines 690-700: Footer social links

## 🏆 Stats Updates

Update your statistics in `index.html` around line 358:

```html
<h3 class="stat-number" data-target="12">0</h3>  <!-- Number of certificates -->
<h3 class="stat-number" data-target="20">0</h3>  <!-- Projects completed -->
<h3 class="stat-number" data-target="2000">0</h3>  <!-- Hours of coding -->
<h3 class="stat-number" data-target="9">0</h3>  <!-- CGPA -->
```

## 🎓 Education Updates

Update CGPA and status in `index.html` around line 246:

```html
<span class="edu-status">Foundation Level • CGPA: 8.88/10</span>
```

## 📱 Skills Updates

### Adding a New Skill Bar

In `index.html`, find the skills section and add:

```html
<div class="skill-item">
    <div class="skill-header">
        <span>TensorFlow</span>
        <span class="skill-percentage">85%</span>
    </div>
    <div class="skill-bar">
        <div class="skill-progress" data-progress="85"></div>
    </div>
</div>
```

### Adding a New Skill Tag (Tool)

In `index.html`, find `.skill-tags` and add:

```html
<span class="skill-tag">Docker</span>
```

## 🔄 Git Commands Cheat Sheet

After making changes:

```bash
# Check what changed
git status

# Add all changes
git add .

# Commit with message
git commit -m "Updated projects and certificates"

# Push to GitHub
git push origin main

# Or if it's your first push
git push -u origin main
```

## ⚡ Quick Deploy to GitHub Pages

**First time setup:**
```bash
cd modern-portfolio
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/rounak161106/rounak161106.github.io.git
git push -u origin main
```

**After first setup (regular updates):**
```bash
git add .
git commit -m "Updated portfolio with new projects"
git push
```

Your site will update automatically at: https://rounak161106.github.io

## 🔍 Testing Before Push

Always test locally:
1. Open `index.html` in a web browser
2. Check all sections load correctly
3. Test all links
4. Test on mobile (browser dev tools)
5. Check console for errors (F12)

## 📋 Monthly Maintenance Checklist

- [ ] Update projects with new work
- [ ] Add new certificates earned
- [ ] Update CGPA/academic info
- [ ] Check all links still work
- [ ] Update skills if learned new ones
- [ ] Review and update About section
- [ ] Update resume file if changed
- [ ] Check analytics (if enabled)
- [ ] Test on different devices
- [ ] Backup your code

## 🎯 Common Mistakes to Avoid

1. ❌ Don't forget to update image paths when adding new images
2. ❌ Don't use spaces in filenames (use hyphens: `my-project.jpg`)
3. ❌ Don't forget to increment project IDs
4. ❌ Don't delete the certificate modal code
5. ❌ Don't forget to test after changes
6. ❌ Don't push without committing
7. ❌ Don't have multiple projects with same ID

## 🆘 Quick Fixes

**Portfolio not updating on GitHub Pages?**
```bash
# Force refresh:
git commit --allow-empty -m "Trigger rebuild"
git push
```
Then wait 2-5 minutes and hard refresh your browser (Ctrl+Shift+R)

**Images not showing?**
- Check file path is correct (case-sensitive!)
- Ensure image is in the right folder
- Try clearing browser cache

**Animations not working?**
- Check browser console (F12)
- Ensure AOS library is loading
- Try incognito mode

## 📞 Need More Help?

Check the main `README.md` for detailed information on:
- Full customization options
- SEO optimization
- Analytics setup
- Contact form backends
- Advanced features

---

Remember: Make small changes, test locally, then push to GitHub! 🚀
