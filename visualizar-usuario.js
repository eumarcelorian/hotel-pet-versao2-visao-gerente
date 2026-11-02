/*
 * visualizar-usuario.js - mostra o usuário escolhido (visualizar-usuario.html?id=...)
 * e os pets dele.
 */

const avisoPagina = document.getElementById('mensagem-pagina');
const usuarioAtual = Dados.usuarios.buscar(Dados.parametro('id'));

function texto(id, valor) {
    document.getElementById(id).textContent = valor;
}

if (!usuarioAtual) {
    Dados.mostrar(avisoPagina, 'Usuário não encontrado. Volte para a lista de usuários e escolha um.', true);
    document.querySelector('.barra-acoes').hidden = true;
    document.querySelector('.detalhes').hidden = true;
    document.querySelector('.historico').hidden = true;
} else {
    const nome = Dados.usuarios.nomeCompleto(usuarioAtual);

    texto('ver-id', usuarioAtual.id);
    texto('ver-email', usuarioAtual.email);
    texto('ver-nome', nome);
    texto('ver-telefone', usuarioAtual.telefone || '—');
    texto('ver-funcao', Dados.rotulos.funcao[usuarioAtual.funcao]);
    texto('ver-status', Dados.rotulos.statusUsuario[usuarioAtual.status]);
    texto('ver-criado', Dados.formatarData(usuarioAtual.criadoEm));

    const campoFoto = document.getElementById('ver-foto');
    if (usuarioAtual.foto) {
        const imagem = document.createElement('img');
        imagem.className = 'imagem-grande';
        imagem.src = usuarioAtual.foto;
        imagem.alt = `Foto de ${nome}`;
        campoFoto.appendChild(imagem);
    } else {
        campoFoto.textContent = 'Sem foto';
    }

    document.getElementById('botao-editar').href = `editar-usuario.html?id=${usuarioAtual.id}`;

    const pets = Dados.usuarios.pets(usuarioAtual.id);
    document.getElementById('lista-pets').innerHTML = pets.length
        ? pets.map((p) => `<li><a href="visualizar-pet.html?id=${p.id}">${Dados.escapar(p.nome)}</a> (${Dados.rotulos.tipo[p.tipo]})</li>`).join('')
        : '<li>Este usuário não tem pets cadastrados.</li>';
}
