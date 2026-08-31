const fs = require('fs');
const path = require('path');

const servicesDir = 'services';
const files = fs.readdirSync(servicesDir).filter(f => f.endsWith('.html'));

function replaceMarquee(content) {
    const rowRightRegex = /(<div class="tech-ticker-row row-right">)(.*?)(<\/div>)/s;
    const rowLeftRegex = /(<div class="tech-ticker-row row-left">)(.*?)(<\/div>)/s;
    
    function duplicateContent(rowStr) {
        let spans = [];
        const regex = /<span class="tech-chip.*?<\/span>/gs;
        let match;
        while ((match = regex.exec(rowStr)) !== null) {
            spans.push(match[0]);
        }
        if (spans.length >= 4) {
            let base = spans.slice(0, spans.length / 2); // original duplicated once
            let combined = '';
            for(let i=0; i<4; i++){
                combined += '\\n        ' + base.join('\\n        ') + '\\n';
            }
            return combined;
        }
        return rowStr;
    }

    let newContent = content;
    
    newContent = newContent.replace(rowRightRegex, (match, p1, p2, p3) => {
        return p1 + duplicateContent(p2) + p3;
    });

    newContent = newContent.replace(rowLeftRegex, (match, p1, p2, p3) => {
        return p1 + duplicateContent(p2) + p3;
    });

    return newContent;
}

for (const file of files) {
    const fullPath = path.join(servicesDir, file);
    let html = fs.readFileSync(fullPath, 'utf8');
    
    const sectionRegex = /(<div class="tech-marquee-wrapper">.*?<\/div>\s*<\/div>\s*<\/section>)/s;
    html = html.replace(sectionRegex, (match) => {
        return replaceMarquee(match);
    });
    
    fs.writeFileSync(fullPath, html, 'utf8');
    console.log(`Updated ${file}`);
}
