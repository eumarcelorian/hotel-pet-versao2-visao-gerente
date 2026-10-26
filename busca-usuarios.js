/*
 * busca-usuarios.js - pesquisa na tabela da tela de Usuários.
 *
 * Lê os valores do formulário de filtros e esconde as linhas da tabela
 * que não combinam. Os dados são os que já estão escritos no HTML.
 */

const formulario = document.querySelector('.filtros');
const linhas = document.querySelectorAll('#tabela-usuarios tr');
const mensagem = document.getElementById('mensagem-busca');

// Posição de cada coluna na tabela (começa em 0)
const COLUNAS = {
    id: 2,
    email: 3,
    nome: 4,
    funcao: 5,
    status: 6,
    criadoEm: 7,
};

/* ---------- Funções de apoio ---------- */

// Deixa o texto em minúsculas e sem acentos: "Funcionário" -> "funcionario"
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

// "19/02/2020" -> "2020-02-19" (mesmo formato do input type="date")
function dataParaISO(texto) {
    const [dia, mes, ano] = texto.split('/');
    return `${ano}-${mes}-${dia}`;
}

// Campos digitados: basta conter o texto
function contem(textoDaCelulaAtual, busca) {
    return normalizar(textoDaCelulaAtual).includes(normalizar(busca));
}

// Listas de opções: precisa ser igual ("Ativo" não pode pegar "Inativo")
function igual(textoDaCelulaAtual, busca) {
    return normalizar(textoDaCelulaAtual) === normalizar(busca);
}

/* ---------- Filtro de uma linha ---------- */

function linhaCombina(linha, filtros) {
    if (filtros.id && !contem(textoDaCelula(linha, COLUNAS.id), filtros.id)) return false;
    if (filtros.email && !contem(textoDaCelula(linha, COLUNAS.email), filtros.email)) return false;
    if (filtros.nome && !contem(textoDaCelula(linha, COLUNAS.nome), filtros.nome)) return false;
    if (filtros.status && !igual(textoDaCelula(linha, COLUNAS.status), filtros.status)) return false;
    if (filtros.funcao && !igual(textoDaCelula(linha, COLUNAS.funcao), filtros.funcao)) return false;

    // Criado em: entre a data inicial e a final, incluindo as duas
    const criadoEm = dataParaISO(textoDaCelula(linha, COLUNAS.criadoEm));
    if (filtros.dataInicial && criadoEm < filtros.dataInicial) return false;
    if (filtros.dataFinal && criadoEm > filtros.dataFinal) return false;

    return true;
}

/* ---------- Pesquisa ---------- */

function lerFiltros() {
    return {
        id: formulario.elements['id'].value,
        dataInicial: formulario.elements['data-inicial'].value,
        dataFinal: formulario.elements['data-final'].value,
        email: formulario.elements['email'].value,
        nome: formulario.elements['nome'].value,
        status: formulario.elements['status'].value,
        funcao: formulario.elements['funcao'].value,
    };
}

function mostrarMensagem(texto, ehErro) {
    mensagem.textContent = texto;
    mensagem.classList.toggle('erro', Boolean(ehErro));
}

function pesquisar() {
    const filtros = lerFiltros();

    // Valida o intervalo de datas antes de filtrar
    if (filtros.dataInicial && filtros.dataFinal && filtros.dataInicial > filtros.dataFinal) {
        mostrarMensagem('A data inicial não pode ser depois da data final.', true);
        return;
    }

    let encontrados = 0;
    linhas.forEach((linha) => {
        const combina = linhaCombina(linha, filtros);
        linha.hidden = !combina;
        if (combina) encontrados++;
    });

    if (encontrados === 0) {
        mostrarMensagem('Nenhum usuário encontrado.');
    } else if (encontrados === 1) {
        mostrarMensagem('1 usuário encontrado.');
    } else {
        mostrarMensagem(`${encontrados} usuários encontrados.`);
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
