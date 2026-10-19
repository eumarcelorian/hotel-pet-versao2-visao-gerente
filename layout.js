/*
 * layout.js - menu lateral e cabeçalho compartilhados.
 *
 * Cada página interna tem no HTML:
 *   <body data-secao="pets">
 *     <aside class="menu-lateral"></aside>
 *     <header class="cabecalho"></header>
 *
 * Este script preenche os dois e marca no menu a seção atual.
 * Para mudar o menu em todas as telas, edite só este arquivo.
 */

const USUARIO = { nome: 'João da Silva' };

const MENU = [
    { secao: 'pets',          href: 'pets.html',          icone: '🐾', texto: 'Pets' },
    { secao: 'usuarios',      href: 'usuarios.html',      icone: '👥', texto: 'Usuários' },
    { secao: 'configuracoes', href: 'configuracoes.html', icone: '⚙️', texto: 'Configurações' },
    { secao: 'reservas',      href: 'reservas.html',      icone: '📅', texto: 'Reservas' },
];

function montarMenu() {
    const menu = document.querySelector('.menu-lateral');
    if (!menu) return;

    const secaoAtual = document.body.dataset.secao;

    const itens = MENU.map((item) => {
        const atual = item.secao === secaoAtual ? ' aria-current="page"' : '';
        return `
            <li>
                <a href="${item.href}"${atual}>
                    <span aria-hidden="true">${item.icone}</span>
                    ${item.texto}
                </a>
            </li>`;
    }).join('');

    menu.innerHTML = `
        <a class="logo" href="reservas.html">Hotel Pet</a>
        <nav aria-label="Menu principal">
            <ul>${itens}
            </ul>
        </nav>`;
}

function montarCabecalho() {
    const cabecalho = document.querySelector('.cabecalho');
    if (!cabecalho) return;

    cabecalho.innerHTML = `
        <a class="perfil" href="editar-perfil.html">
            <span class="foto-perfil" aria-hidden="true">👤</span>
            <span>${USUARIO.nome}</span>
        </a>
        <a class="sair" href="index.html">Sair</a>`;
}

montarMenu();
montarCabecalho();
