const fs = require('fs');
const path = require('path');

const GA_TAG = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-70PPEJM0GG"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-70PPEJM0GG');
</script>
`;

function injectGA(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');

  // Only inject if GA tag isn't already there in the right place
  const headIndex = html.indexOf('<head>');
  if (headIndex !== -1 && !html.substring(headIndex, headIndex + 200).includes('googletagmanager.com/gtag/js?id=G-70PPEJM0GG')) {
    // Insert GA tag immediately after <head>
    html = html.replace('<head>', '<head>\n' + GA_TAG);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✓ Injected GA into ${filePath}`);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.html')) {
      injectGA(filePath);
    }
  });
}

// Process the out directory
const outDir = path.join(__dirname, '..', 'out');
if (fs.existsSync(outDir)) {
  console.log('Injecting Google Analytics into HTML files...');
  processDirectory(outDir);
  console.log('Done!');
} else {
  console.error('Error: out directory not found. Run `npm run build` first.');
}
