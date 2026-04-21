const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function expandClasses(content) {
    const replacements = {
        'bg-white': 'bg-white dark:bg-neutral-900',
        'bg-neutral-50': 'bg-neutral-50 dark:bg-neutral-950',
        'text-neutral-900': 'text-neutral-900 dark:text-neutral-100',
        'text-neutral-800': 'text-neutral-800 dark:text-neutral-200',
        'text-neutral-500': 'text-neutral-500 dark:text-neutral-400',
        'border-neutral-100': 'border-neutral-100 dark:border-neutral-800',
        'border-neutral-200': 'border-neutral-200 dark:border-neutral-700',
    };

    let updated = content;
    for (const [light, dark] of Object.entries(replacements)) {
        // Look for the light class standing alone (not already followed by its dark pair)
        // using negative lookahead for the dark class to avoid duplicates
        const regex = new RegExp(`\\b${light}\\b(?!\\s+${dark.split(' ')[1]})`, 'g');
        updated = updated.replace(regex, dark);
    }
    return updated;
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const updatedContent = expandClasses(content);
            if (content !== updatedContent) {
                fs.writeFileSync(fullPath, updatedContent, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDirectory(directoryPath);
console.log('Dark mode classes applied successfully.');
