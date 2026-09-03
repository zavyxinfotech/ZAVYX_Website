const fs = require('fs');
const glob = require('glob');
const path = require('path');
const { execSync } = require('child_process');

const indexHTML = fs.readFileSync('d:/ZAVYX_InfoTech/zavyx-website/zavyx-website/index.html', 'utf8');
const match = indexHTML.match(/<ul class=\"nav-links\">([\s\S]*?)<\/ul>/);
if(!match) { console.error('Nav block not found'); process.exit(1); }

let newNav = match[0];

const isWindows = process.platform === 'win32';
const findCmd = isWindows ? 'powershell -Command "Get-ChildItem -Path . -Recurse -Filter *.html | Select-Object -ExpandProperty FullName"' : 'find . -name "*.html"';
const output = execSync(findCmd, { cwd: 'd:/ZAVYX_InfoTech/zavyx-website/zavyx-website' }).toString();
const files = output.trim().split(/\r?\n/).filter(f => f);

for(const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if(content.includes('<ul class="nav-links">')) {
    let baseName = path.basename(file);
    let navReplaced = newNav;
    
    // reset active class everywhere for cleanup
    navReplaced = navReplaced.replace(/nav-dropdown-btn active/g, 'nav-dropdown-btn');
    
    // determine active base on file
    if(baseName === 'index.html') {
      navReplaced = navReplaced.replace(/href="index.html" class="nav-dropdown-btn"/, 'href="index.html" class="nav-dropdown-btn active"');
    } else if(baseName === 'about.html') {
      navReplaced = navReplaced.replace(/href="about.html" class="nav-dropdown-btn"/, 'href="about.html" class="nav-dropdown-btn active"');
    } else if(baseName === 'services.html' || file.includes('services')) {
      navReplaced = navReplaced.replace(/href="(\.\.\/)?services.html" class="nav-dropdown-btn"/, 'href="$1services.html" class="nav-dropdown-btn active"');
    } else if(baseName === 'contact.html') {
      navReplaced = navReplaced.replace(/href="contact.html" class="nav-dropdown-btn contact-special-btn"/, 'href="contact.html" class="nav-dropdown-btn contact-special-btn active"');
    }
    
    // Adjust paths if the file is inside the /services/ subdirectory
    if(file.includes('services\\') || file.includes('services/')) {
        // Change root links to ../
        navReplaced = navReplaced.replace(/href="index\.html/g, 'href="../index.html');
        navReplaced = navReplaced.replace(/href="about\.html/g, 'href="../about.html');
        navReplaced = navReplaced.replace(/href="services\.html/g, 'href="../services.html');
        navReplaced = navReplaced.replace(/href="contact\.html/g, 'href="../contact.html');
        // Wait, the services inside mega: href="services/..." needs to be href="..."
        navReplaced = navReplaced.replace(/href="services\//g, 'href="');
    }
    
    // Replace the block in the file
    content = content.replace(/<ul class=\"nav-links\">([\s\S]*?)<\/ul>/, navReplaced);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
}
