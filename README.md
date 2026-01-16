# Book Reader - GitHub Pages

A beautiful, responsive book reading interface for GitHub Pages that automatically loads chapters from markdown files.

## Features

- 📚 Automatic chapter detection from markdown files
- 📱 Responsive design (works on mobile, tablet, and desktop)
- 🎨 Clean, readable interface
- 🔄 Automatic updates when new chapters are pushed
- 📖 Table of contents sidebar
- 🔗 Direct chapter linking via URL parameters
- ⚡ Fast loading with GitHub CDN

## Setup Instructions

### 1. Fork or Create Repository

1. Create a new GitHub repository or fork this one
2. Enable GitHub Pages in repository settings:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` (or `master`)
   - Folder: `/ (root)`

### 2. Configure the Site

Edit `script.js` and update the configuration:

```javascript
const config = {
    bookTitle: 'Your Book Title',  // Change to your book's title
    chaptersFolder: 'chapters',
    chapterFilePattern: /^chapter-(\d+)\.md$/
};
```

Also update the `getRepoInfo()` function fallback:

```javascript
return 'YOUR-USERNAME/YOUR-REPO-NAME';
```

### 3. Add Your Chapters

Create markdown files in the `chapters/` folder with the naming pattern:
- `chapter-1.md`
- `chapter-2.md`
- `chapter-3.md`
- etc.

Each chapter should start with a title (h1):

```markdown
# Chapter Title

Your chapter content here...
```

The first h1 heading will be automatically extracted and displayed in the table of contents.

### 4. Push Changes

```bash
git add .
git commit -m "Add new chapter"
git push origin main
```

GitHub Pages will automatically rebuild your site (usually takes 1-2 minutes).

## File Structure

```
your-repo/
├── index.html          # Main HTML file
├── styles.css          # Styling
├── script.js           # JavaScript for loading chapters
├── chapters/           # Your chapter files
│   ├── chapter-1.md
│   ├── chapter-2.md
│   └── chapter-3.md
└── README.md          # This file
```

## Chapter Format

Each chapter is a standard markdown file. Example:

```markdown
# Chapter Title

## Section Heading

Your content here with **bold**, *italic*, and [links](url).

- Bullet points
- Work great

> Blockquotes too!

## Another Section

More content...
```

## Adding New Chapters

Simply create a new file following the pattern `chapter-N.md` in the `chapters/` folder and push to GitHub. The site will automatically:

1. Detect the new chapter
2. Add it to the table of contents
3. Make it available for reading

No code changes needed!

## Customization

### Change Colors

Edit `styles.css` and modify the CSS variables:

```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #34495e;
    --accent-color: #3498db;
    --text-color: #333;
    --bg-color: #f8f9fa;
}
```

### Change Layout

Adjust spacing, fonts, and other layout properties in `styles.css`.

## Browser Support

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Troubleshooting

**Chapters not loading?**
- Make sure GitHub Pages is enabled
- Check that the repository info in `script.js` is correct
- Verify chapter files are in the `chapters/` folder
- Ensure chapter files follow the naming pattern `chapter-N.md`

**Styling looks broken?**
- Clear your browser cache
- Wait a few minutes for GitHub Pages to rebuild
- Check browser console for errors

## License

Free to use and modify for your own projects.

## Credits

Built with:
- [Marked.js](https://marked.js.org/) - Markdown parser
- GitHub Pages
- GitHub API
