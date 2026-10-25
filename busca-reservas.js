/*
 * busca-reservas.js - pesquisa na tabela da tela de Reservas.
 *
 * Lê os valores do formulário de filtros e esconde as linhas da tabela
 * que não combinam. Os dados são os que já estão escritos no HTML.
 */

const formulario = document.querySelector('.filtros');
const linhas = document.querySelectorAll('#tabela-reservas tr');
const mensagem = document.getElementById('mensagem-busca');

// Posição de cada coluna na tabela (começa em 0)
const COLUNAS = {
    id: 1,
    pet: 2,
    proprietario: 3,
    chegada: 4,
    partida: 5,
    status: 6,
    total: 7,
};

/* ---------- Funções de apoio ---------- */

// Deixa o texto em minúsculas e sem acentos: "Proprietário" -> "proprietario"
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

// "02/05/2021" -> "2021-05-02" (mesmo formato do input type="date")
function dataParaISO(texto) {
    const [dia, mes, ano] = texto.split('/');
    return `${ano}-${mes}-${dia}`;
}

// "R$ 1.040,50" -> 1040.5
function valorParaNumero(texto) {
    return parseFloat(texto.replace(/[^\d,]/g, '').replace(',', '.'));
}

function contem(textoDaCelulaAtual, busca) {
    return normalizar(textoDaCelulaAtual).includes(normalizar(busca));
}

/* ---------- Filtro de uma linha ---------- */

function linhaCombina(linha, filtros) {
    // Campos de texto: basta conter o que foi digitado
    if (filtros.id && !contem(textoDaCelula(linha, COLUNAS.id), filtros.id)) return false;
    if (filtros.pet && !contem(textoDaCelula(linha, COLUNAS.pet), filtros.pet)) return false;
    if (filtros.proprietario && !contem(textoDaCelula(linha, COLUNAS.proprietario), filtros.proprietario)) return false;

    // Status: "andamento" combina com "Em andamento"
    if (filtros.status && !contem(textoDaCelula(linha, COLUNAS.status), filtros.status)) return false;

    // Período: a reserva combina se ela se sobrepõe ao período pesquisado
    const chegada = dataParaISO(textoDaCelula(linha, COLUNAS.chegada));
    const partida = dataParaISO(textoDaCelula(linha, COLUNAS.partida));
    if (filtros.dataInicial && partida < filtros.dataInicial) return false;
    if (filtros.dataFinal && chegada > filtros.dataFinal) return false;

    // Total
    const total = valorParaNumero(textoDaCelula(linha, COLUNAS.total));
    if (filtros.totalMinimo !== '' && total < Number(filtros.totalMinimo)) return false;
    if (filtros.totalMaximo !== '' && total > Number(filtros.totalMaximo)) return false;

    return true;
}

/* ---------- Pesquisa ---------- */

function lerFiltros() {
    return {
        id: formulario.elements['id'].value,
        pet: formulario.elements['pet'].value,
        proprietario: formulario.elements['proprietario'].value,
        status: formulario.elements['status'].value,
        dataInicial: formulario.elements['data-inicial'].value,
        dataFinal: formulario.elements['data-final'].value,
        totalMinimo: formulario.elements['total-minimo'].value,
        totalMaximo: formulario.elements['total-maximo'].value,
    };
}

function mostrarMensagem(texto, ehErro) {
    mensagem.textContent = texto;
    mensagem.classList.toggle('erro', Boolean(ehErro));
}

function pesquisar() {
    const filtros = lerFiltros();

    // Valida os intervalos antes de filtrar
    if (filtros.dataInicial && filtros.dataFinal && filtros.dataInicial > filtros.dataFinal) {
        mostrarMensagem('A data inicial não pode ser depois da data final.', true);
        return;
    }
    if (
        filtros.totalMinimo !== '' &&
        filtros.totalMaximo !== '' &&
        Number(filtros.totalMinimo) > Number(filtros.totalMaximo)
    ) {
        mostrarMensagem('O valor mínimo não pode ser maior que o valor máximo.', true);
        return;
    }

    let encontradas = 0;
    linhas.forEach((linha) => {
        const combina = linhaCombina(linha, filtros);
        linha.hidden = !combina;
        if (combina) encontradas++;
    });

    if (encontradas === 0) {
        mostrarMensagem('Nenhuma reserva encontrada.');
    } else if (encontradas === 1) {
        mostrarMensagem('1 reserva encontrada.');
    } else {
        mostrarMensagem(`${encontradas} reservas encontradas.`);
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
