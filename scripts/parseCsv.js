import fs from 'fs';

const csv = fs.readFileSync('../TheBackstory/Creative_Steeping_Social_Objects_v2.csv', 'utf8');

const lines = csv.split('\n').filter(line => line.trim().length > 0);

// Simple CSV parser that handles quotes
function parseCSVLine(text) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"' && text[i+1] === '"') {
            current += '"';
            i++;
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}

const headers = parseCSVLine(lines[0]);

const assets = {
    note: [],
    inquiry: [],
    exercise: [],
    science: []
};

function determineCategory(register, type) {
    register = (register || '').toLowerCase();
    type = (type || '').toLowerCase();
    
    if (type === 'practice') return 'exercise';
    if (type.includes('quote') || type.includes('opportunity') || type.includes('invitation')) return 'inquiry';
    if (type.includes('potentialized result') || register === 'research') return 'science';
    
    // Default to note for concepts, memes, koans, observations
    return 'note';
}

function getRandomCoords() {
    const stbl = Math.floor(Math.random() * 80) + 20;
    const prss = Math.floor(Math.random() * 60) + 40;
    const cohr = Math.floor(Math.random() * 50) + 50;
    const drft = Math.floor(Math.random() * 40) + 5;
    
    const pad = (n) => n.toString().padStart(2, '0');
    return `[ STBL: ${pad(stbl)} | PRSS: ${pad(prss)} | COHR: ${pad(cohr)} | DRFT: ${pad(drft)} ]`;
}

for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    if (row.length < 5) continue;
    
    const kicker = row[0] || '';
    const type = row[1] || '';
    const register = row[2] || '';
    const body = row[6] || '';
    
    if (!kicker || !body) continue;
    
    const category = determineCategory(register, type);
    
    let mechanism = `STEEPING ${category.toUpperCase()} :: ${type.toUpperCase()}`;
    if (category === 'science') mechanism = `SCIENCE OF THE STEEPING SPACE :: ${type.toUpperCase()}`;
    
    assets[category].push({
        id: `${category[0]}${assets[category].length + 1}`,
        kicker: kicker.toUpperCase(),
        body: body,
        mechanism: mechanism,
        color: category === 'science' || category === 'inquiry' ? 'm.text1' : 'm.accent', // We will replace these strings later
        coords: getRandomCoords()
    });
}

const jsContent = `// Auto-generated from Creative_Steeping_Social_Objects_v2.csv

export const generateAssets = (m) => ({
    note: ${JSON.stringify(assets.note, null, 8).replace(/"m\.accent"/g, 'm.accent').replace(/"m\.text1"/g, 'm.text1')},
    inquiry: ${JSON.stringify(assets.inquiry, null, 8).replace(/"m\.accent"/g, 'm.accent').replace(/"m\.text1"/g, 'm.text1')},
    exercise: ${JSON.stringify(assets.exercise, null, 8).replace(/"m\.accent"/g, 'm.accent').replace(/"m\.text1"/g, 'm.text1')},
    science: ${JSON.stringify(assets.science, null, 8).replace(/"m\.accent"/g, 'm.accent').replace(/"m\.text1"/g, 'm.text1')}
});
`;

fs.writeFileSync('../steeping-v5-laboratory/src/assetsData.js', jsContent);
console.log('Successfully generated src/assetsData.js with ' + (assets.note.length + assets.inquiry.length + assets.exercise.length + assets.science.length) + ' items.');
