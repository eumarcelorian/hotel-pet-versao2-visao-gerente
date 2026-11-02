/*
 * usuarios-lista.js - monta a tabela da tela de Usuários a partir do dados.js
 * e faz funcionar os botões Remover e Mudar status.
 *
 * Depois de montada, a busca (busca-usuarios.js) filtra as linhas.
 */

const corpoUsuarios = document.getElementById('tabela-usuarios');
const mensagemLista = document.getElementById('mensagem-busca');
const formularioBusca = document.querySelector('.filtros');

function linhaDoUsuario(usuario) {
    const nome = Dados.escapar(Dados.usuarios.nomeCompleto(usuario));
    const foto = usuario.foto
        ? `<img class="foto-tabela" src="${usuario.foto}" alt="">`
        : '<span class="foto-tabela" aria-hidden="true">👤</span>';

    return `
        <tr>
            <td>
                <input type="checkbox" id="usuario-${usuario.id}" name="usuario-selecionado" value="${usuario.id}">
                <label class="texto-oculto" for="usuario-${usuario.id}">Selecionar ${nome}</label>
            </td>
            <td>${foto}</td>
            <td>${usuario.id}</td>
            <td>${Dados.escapar(usuario.email)}</td>
            <td>${nome}</td>
            <td>${Dados.rotulos.funcao[usuario.funcao]}</td>
            <td><span class="status status-${usuario.status}">${Dados.rotulos.statusUsuario[usuario.status]}</span></td>
            <td>${Dados.formatarData(usuario.criadoEm)}</td>
            <td>
                <a href="editar-usuario.html?id=${usuario.id}">Editar</a>
                <a href="visualizar-usuario.html?id=${usuario.id}">Visualizar</a>
            </td>
        </tr>`;
}

function desenharTabela() {
    corpoUsuarios.innerHTML = Dados.usuarios.listar().map(linhaDoUsuario).join('');
}

function mostrarMensagemLista(texto, ehErro) {
    mensagemLista.textContent = texto;
    mensagemLista.classList.toggle('erro', Boolean(ehErro));
}

// Ids dos usuários marcados na tabela
function idsSelecionados() {
    return Array.from(corpoUsuarios.querySelectorAll('input[type="checkbox"]:checked')).map((c) => c.value);
}

// Redesenha a tabela, aplica de novo a pesquisa que estava ativa e mostra o resultado da ação
function atualizarDepoisDeAcao(texto) {
    desenharTabela();
    formularioBusca.requestSubmit();
    mostrarMensagemLista(texto, false);
}

document.getElementById('botao-remover').addEventListener('click', () => {
    const ids = idsSelecionados();
    if (ids.length === 0) {
        mostrarMensagemLista('Marque pelo menos um usuário para remover.', true);
        return;
    }
    if (!window.confirm(`Remover ${ids.length} usuário(s)?`)) return;

    try {
        Dados.usuarios.remover(ids);
        atualizarDepoisDeAcao(ids.length === 1 ? '1 usuário removido.' : `${ids.length} usuários removidos.`);
    } catch (erro) {
        mostrarMensagemLista(erro.message, true);
    }
});

document.getElementById('botao-status').addEventListener('click', () => {
    const ids = idsSelecionados();
    if (ids.length === 0) {
        mostrarMensagemLista('Marque pelo menos um usuário para mudar o status.', true);
        return;
    }

    try {
        Dados.usuarios.alternarStatus(ids);
        atualizarDepoisDeAcao(ids.length === 1 ? 'Status de 1 usuário alterado.' : `Status de ${ids.length} usuários alterado.`);
    } catch (erro) {
        mostrarMensagemLista(erro.message, true);
    }
});

desenharTabela();
mostrarMensagemLista(Dados.aviso(), false);
