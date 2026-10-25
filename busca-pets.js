/*
 * busca-pets.js - pesquisa na tabela da tela de Pets.
 *
 * Lê os valores do formulário de filtros e esconde as linhas da tabela
 * que não combinam. Os dados são os que já estão escritos no HTML.
 */

const formulario = document.querySelector('.filtros');
const linhas = document.querySelectorAll('#tabela-pets tr');
const mensagem = document.getElementById('mensagem-busca');

// Posição de cada coluna na tabela (começa em 0)
const COLUNAS = {
    id: 1,
    nome: 2,
    tipo: 3,
    raca: 4,
    tamanho: 5,
};

/* ---------- Funções de apoio ---------- */

// Deixa o texto em minúsculas e sem acentos: "Médio" -> "medio"
function normalizar(texto) {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

// Texto da célula de uma coluna
function textoDaCelula(linha, coluna) {
    return linha.cells[coluna].textContent.trim();
}

// Campos digitados: basta conter o texto
function contem(textoDaCelulaAtual, busca) {
    return normalizar(textoDaCelulaAtual).includes(normalizar(busca));
}

// Listas de opções: precisa ser igual (assim "Grande" não pega outro valor parecido)
function igual(textoDaCelulaAtual, busca) {
    return normalizar(textoDaCelulaAtual) === normalizar(busca);
}

/* ---------- Filtro de uma linha ---------- */

function linhaCombina(linha, filtros) {
    if (filtros.id && !contem(textoDaCelula(linha, COLUNAS.id), filtros.id)) return false;
    if (filtros.nome && !contem(textoDaCelula(linha, COLUNAS.nome), filtros.nome)) return false;
    if (filtros.raca && !contem(textoDaCelula(linha, COLUNAS.raca), filtros.raca)) return false;
    if (filtros.tipo && !igual(textoDaCelula(linha, COLUNAS.tipo), filtros.tipo)) return false;
    if (filtros.tamanho && !igual(textoDaCelula(linha, COLUNAS.tamanho), filtros.tamanho)) return false;

    return true;
}

/* ---------- Pesquisa ---------- */

function lerFiltros() {
    return {
        id: formulario.elements['id'].value,
        nome: formulario.elements['nome'].value,
        tipo: formulario.elements['tipo'].value,
        raca: formulario.elements['raca'].value,
        tamanho: formulario.elements['tamanho'].value,
    };
}

function mostrarMensagem(texto) {
    mensagem.textContent = texto;
}

function pesquisar() {
    const filtros = lerFiltros();

    let encontrados = 0;
    linhas.forEach((linha) => {
        const combina = linhaCombina(linha, filtros);
        linha.hidden = !combina;
        if (combina) encontrados++;
    });

    if (encontrados === 0) {
        mostrarMensagem('Nenhum pet encontrado.');
    } else if (encontrados === 1) {
        mostrarMensagem('1 pet encontrado.');
    } else {
        mostrarMensagem(`${encontrados} pets encontrados.`);
    }
}

/* ---------- Eventos ---------- */

// "Pesquisar" (ou Enter): filtra sem recarregar a página
formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    pesquisar();
});

// "Limpar": o navegador limpa os campos e depois mostramos todas as linhas
formulario.addEventListener('reset', () => {
    setTimeout(() => {
        linhas.forEach((linha) => {
            linha.hidden = false;
        });
        mostrarMensagem('');
    }, 0);
});
