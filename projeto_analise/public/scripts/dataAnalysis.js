const fs = require('fs');
const path = require('path');

function readJsonFiles(dir, allData = []) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            readJsonFiles(fullPath, allData);
        } else if (path.extname(fullPath) === '.json' && !fullPath.includes('package.json') && !fullPath.includes('historico.json')) {
            try {
                const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
                if (Array.isArray(data)) {
                    allData.push(...data);
                } else {
                    console.error(`O arquivo não contém um array: ${fullPath}`);
                }
            } catch (error) {
                console.error(`Erro ao processar o arquivo ${fullPath}: ${error.message}`);
            }
        }
    });
    return allData;
}

const directoryPath = path.join(__dirname, '../../');
const allData = readJsonFiles(directoryPath);
console.log(allData);
