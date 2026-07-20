import re

# Read the file
with open('data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# List of reliable picsum URLs
picsum_urls = [f'https://picsum.photos/800/800?random={i}' for i in range(1, 50)]

# Replace all unsplash URLs
counter = 0
def replace_url(match):
    global counter
    url = picsum_urls[counter % len(picsum_urls)]
    counter += 1
    return url

# Replace all variations of unsplash URLs
pattern1 = r'https://images\.unsplash\.com/photo-[^?]+\?[^"]*'
pattern2 = r'https://plus\.unsplash\.com/photo-[^?]+\?[^"]*'

content = re.sub(pattern1, replace_url, content)

# Reset counter for second pass
counter = 0
content = re.sub(pattern2, replace_url, content)

# Write back
with open('data/products.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('✓ Successfully replaced all Unsplash URLs with picsum.photos')
