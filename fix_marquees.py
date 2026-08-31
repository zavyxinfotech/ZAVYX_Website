import os
import re
import glob

services_dir = 'services'
html_files = glob.glob(os.path.join(services_dir, '*.html'))

def replace_marquee(match):
    content = match.group(0)
    # find row-right and row-left contents
    def duplicate_content(row_content):
        # find the inner spans
        spans = re.findall(r'<span class="tech-chip.*?</span>', row_content)
        # assuming the original set has 4 unique chips, and it was duplicated once to 8 chips.
        # let's just grab the first 4 chips
        if len(spans) >= 4:
            base_spans = spans[:(len(spans)//2)]
            # duplicate it so we have 4 sets (e.g. 16 chips if base is 4)
            return ' '.join(base_spans * 4)
        return row_content
    
    # regex to find the inner content of div.tech-ticker-row
    new_content = re.sub(
        r'(<div class="tech-ticker-row row-right">)(.*?)(</div>)',
        lambda m: m.group(1) + duplicate_content(m.group(2)) + m.group(3),
        content,
        flags=re.DOTALL
    )
    new_content = re.sub(
        r'(<div class="tech-ticker-row row-left">)(.*?)(</div>)',
        lambda m: m.group(1) + duplicate_content(m.group(2)) + m.group(3),
        new_content,
        flags=re.DOTALL
    )
    return new_content

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # replace inside tech-marquee-wrapper
    new_html = re.sub(
        r'<div class="tech-marquee-wrapper">.*?</div>\s*</div>\s*</section>',
        lambda m: replace_marquee(m),
        html,
        flags=re.DOTALL
    )
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(new_html)
    print(f"Updated {file}")
