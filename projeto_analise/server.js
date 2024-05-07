const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());

// Função para ler arquivos JSON de forma recursiva e segura
function readJsonFiles(dir, allData = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            readJsonFiles(fullPath, allData);
        } else if (path.extname(fullPath) === '.json' && !fullPath.includes('package.json')) {
            try {
                const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
                if (Array.isArray(data)) {
                    allData.push(...data.filter(item => item !== null && typeof item === 'object'));
                }
            } catch (error) {
                console.error(`Erro ao processar o arquivo ${fullPath}: ${error.message}`);
            }
        }
    });
    return allData;
}

// Definir o caminho do diretório a partir do qual leremos os arquivos JSON
const directoryPath = '/';
const allData = readJsonFiles(directoryPath);

// Endpoint para fornecer dados (podemos usar isso depois para o chartSetup.js)
app.get('/data', (req, res) => {
    res.json(allData);
});

// Funções de Análise de Dados
function produtosPorCategoria(data) {
    return data.reduce((acc, item) => {
        acc[item.Categoria] = (acc[item.Categoria] || 0) + 1;
        return acc;
    }, {});
}

function produtosAtivosInativos(data) {
    return data.reduce((acc, item) => {
        const key = item['Situação'] === 'ATIVO' ? 'Ativos' : 'Inativos';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
}

function frequenciaDeRegistrosPorEmpresa(data) {
    return data.reduce((acc, item) => {
        acc[item['Nome da Empresa']] = (acc[item['Nome da Empresa']] || 0) + 1;
        return acc;
    }, {});
}

function correlacaoVencimentoSituacao(data) {
    return data.reduce((acc, item) => {
        const key = `${item['Vencimento']} | ${item['Situação']}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
}

// Função para Mostrar Dados no Console
function mostrarDadosNoConsole() {
    console.log("Distribuição de produtos por categoria:");
    console.table(produtosPorCategoria(allData));

    console.log("Comparação entre produtos ativos e inativos:");
    console.table(produtosAtivosInativos(allData));

    console.log("Frequência de registro de produtos por empresa:");
    console.table(frequenciaDeRegistrosPorEmpresa(allData));

    console.log("Correlação entre datas de vencimento e situações dos produtos:");
    console.table(correlacaoVencimentoSituacao(allData));
}

mostrarDadosNoConsole();

app.use(express.static('public'));

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
