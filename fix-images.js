import fs from "fs";

const filePath = "data/products.ts";
let content = fs.readFileSync(filePath, "utf-8");

const picsumUrls = Array.from({ length: 50 }, (_, i) => `https://picsum.photos/800/800?random=${i + 1}`);
let counter = 0;

// Replace all unsplash URLs
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-[^?]+\?[^"]+/g, () => {
  const url = picsumUrls[counter % picsumUrls.length];
  counter++;
  return url;
});

content = content.replace(/https:\/\/plus\.unsplash\.com\/photo-[^?]+\?[^"]+/g, () => {
  const url = picsumUrls[counter % picsumUrls.length];
  counter++;
  return url;
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log('✓ Successfully replaced all Unsplash URLs with picsum.photos');
