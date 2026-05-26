const fs = require('fs');
const path = require('path');

function getAllImages(dir, baseDir) {
    if (!fs.existsSync(dir)) return [];
    
    let results = [];
    const list = fs.readdirSync(dir);
    
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat && stat.isDirectory()) {
            if (file !== '__MACOSX' && file !== '.DS_Store') {
                results = results.concat(getAllImages(filePath, baseDir));
            }
        } else {
            if (/\.(jpg|jpeg|png|webp|svg)$/i.test(file)) {
                const relativePath = path.relative(baseDir, filePath);
                results.push('/' + relativePath.replace(/\\/g, '/'));
            }
        }
    });
    return results;
}

const publicDir = path.join(process.cwd(), 'public');
const cityFolders = ['Ahmedabad', 'Bengalore', 'Chennai', 'Goa', 'Indore', 'Kochi', 'delhi'];

const galleryData = cityFolders.map(city => {
    const cityPath = path.join(publicDir, city);
    if (fs.existsSync(cityPath)) {
        const images = getAllImages(cityPath, publicDir);
        return {
            city: city.charAt(0).toUpperCase() + city.slice(1),
            images: images
        };
    }
    return { city, images: [] };
}).filter(item => item.images.length > 0);

const outputPath = path.join(process.cwd(), 'src/app/gallery/galleryData.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(galleryData, null, 2), 'utf-8');
console.log('✅ Generated galleryData.json for build optimization.');
