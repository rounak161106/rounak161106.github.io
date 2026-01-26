# 🚀 Deployment Instructions for GitHub Pages

## Prerequisites
- GitHub account
- Git installed on your computer
- Your portfolio files ready

## Step-by-Step Deployment

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the '+' icon → 'New repository'
3. **Important:** Name it exactly `rounak161106.github.io`
   - Replace `rounak161106` with your GitHub username
4. Keep it Public
5. Don't initialize with README, .gitignore, or license
6. Click 'Create repository'

### Step 2: Prepare Your Files

1. Download all your portfolio files
2. Add your profile image to `static/images/profile.jpeg`
3. Update your personal information in `index.html`:
   - Email addresses (search for "@example.com")
   - Phone number if you want to display it
   - Location details

### Step 3: Initialize Git and Push

Open terminal/command prompt in your portfolio folder:

```bash
# Navigate to your portfolio folder
cd path/to/modern-portfolio

# Initialize git repository
git init

# Add all files
git add .

# Make first commit
git commit -m "Initial commit: Modern Data Science Portfolio"

# Set main branch
git branch -M main

# Add your GitHub repository as remote
git remote add origin https://github.com/rounak161106/rounak161106.github.io.git

# Push to GitHub
git push -u origin main
```

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click 'Settings' (top menu)
3. Scroll down to 'Pages' (left sidebar)
4. Under 'Source':
   - Branch: select 'main'
   - Folder: select '/ (root)'
5. Click 'Save'

### Step 5: Wait for Deployment

- GitHub Pages will build your site (takes 1-5 minutes)
- You'll see a message: "Your site is live at https://rounak161106.github.io"
- Click the link to view your portfolio!

## 🔄 Making Updates After Initial Deployment

Whenever you want to update your portfolio:

```bash
# Make your changes to the files

# Stage the changes
git add .

# Commit with a descriptive message
git commit -m "Added new project: Sentiment Analysis"

# Push to GitHub
git push
```

Wait 1-2 minutes, then refresh your website to see the changes!

## 🎯 Important Notes

### Custom Domain (Optional)
If you want to use a custom domain like `www.rounakprasad.com`:

1. Buy a domain from Namecheap, GoDaddy, etc.
2. In your repository, create a file named `CNAME`
3. Add your domain: `www.rounakprasad.com`
4. In your domain registrar's DNS settings, add these records:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   
   Type: A
   Name: @
   Value: 185.199.109.153
   
   Type: A
   Name: @
   Value: 185.199.110.153
   
   Type: A
   Name: @
   Value: 185.199.111.153
   
   Type: CNAME
   Name: www
   Value: rounak161106.github.io
   ```
5. Wait 24-48 hours for DNS propagation

### Repository Name Must Match
- Your repository MUST be named: `[your-username].github.io`
- Example: If your username is `johndoe`, name it `johndoe.github.io`
- This creates a User Page (your main portfolio site)

### Accessing Your Site
- After deployment, your site will be at: `https://[your-username].github.io`
- Example: `https://rounak161106.github.io`

## 🐛 Troubleshooting

### Site Not Loading?
- Wait 5 minutes after first deployment
- Check GitHub Pages settings are correct
- Ensure repository name matches your username
- Try accessing in incognito mode
- Clear browser cache (Ctrl+Shift+R)

### 404 Error?
- Make sure `index.html` is in the root directory (not in a subfolder)
- Check file names are correct (case-sensitive on Linux servers)
- Verify GitHub Pages is enabled in Settings

### Images Not Showing?
- Check file paths in `index.html`
- Ensure images are in `static/images/` or `static/certificates/`
- File names must match exactly (case-sensitive)

### Changes Not Appearing?
- Wait 1-2 minutes after pushing
- Hard refresh browser (Ctrl+Shift+R)
- Check GitHub Actions tab for build status
- Clear browser cache

### Build Failed?
- Check for typos in HTML/CSS/JS files
- Validate HTML at https://validator.w3.org
- Check browser console for JavaScript errors

## 📱 Testing Checklist Before Going Live

- [ ] Profile image displays correctly
- [ ] All personal information is updated
- [ ] All links work (GitHub, LinkedIn, etc.)
- [ ] Projects load and display properly
- [ ] Certificates display in correct categories
- [ ] Contact form appears (even if not functional yet)
- [ ] Site is responsive on mobile (test with browser dev tools)
- [ ] No console errors (check with F12)
- [ ] All sections scroll smoothly
- [ ] Back to top button appears when scrolling

## 🔐 Security Tips

- Never commit sensitive data (API keys, passwords)
- Use environment variables for sensitive info
- Don't expose personal phone numbers publicly
- Be careful with email addresses (consider using a contact form)

## 📊 After Deployment

### Add Google Analytics (Optional)
1. Create Google Analytics account
2. Get your tracking ID
3. Add tracking code to `index.html` before `</head>`

### Submit to Search Engines
1. **Google Search Console:**
   - Go to https://search.google.com/search-console
   - Add your property
   - Verify ownership
   - Submit sitemap (optional)

2. **Bing Webmaster Tools:**
   - Go to https://www.bing.com/webmasters
   - Add your site
   - Verify ownership

### Share Your Portfolio
- Add to LinkedIn profile
- Include in resume
- Share on Twitter/Reddit
- Add to your email signature
- Include in GitHub profile README

## 🎉 Congratulations!

Your portfolio is now live! Remember to:
- Keep it updated with new projects
- Add new certificates as you earn them
- Update your skills as you learn
- Share it with recruiters and potential employers

Your portfolio URL: `https://rounak161106.github.io`

---

Need help? Check the README.md or QUICK_UPDATE_GUIDE.md files!
