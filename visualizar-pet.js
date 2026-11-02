/*
 * visualizar-pet.js - mostra o pet escolhido (visualizar-pet.html?id=...),
 * o histórico de reservas dele e o botão Deletar.
 */

const avisoPagina = document.getElementById('mensagem-pagina');
const petAtual = Dados.pets.buscar(Dados.parametro('id'));

function texto(id, valor) {
    document.getElementById(id).textContent = valor;
}

if (!petAtual) {
    Dados.mostrar(avisoPagina, 'Pet não encontrado. Volte para a lista de pets e escolha um.', true);
    document.querySelector('.barra-acoes').hidden = true;
    document.querySelector('.detalhes').hidden = true;
    document.querySelector('.historico').hidden = true;
} else {
    const dono = Dados.usuarios.buscar(petAtual.proprietarioId);

    texto('ver-proprietario', dono ? Dados.usuarios.nomeCompleto(dono) : '—');
    texto('ver-id', petAtual.id);
    texto('ver-nome', petAtual.nome);
    texto('ver-tipo', Dados.rotulos.tipo[petAtual.tipo]);
    texto('ver-raca', petAtual.raca);
    texto('ver-tamanho', Dados.rotulos.tamanho[petAtual.tamanho]);

    const campoImagem = document.getElementById('ver-imagem');
    if (petAtual.imagem) {
        const imagem = document.createElement('img');
        imagem.className = 'imagem-grande';
        imagem.src = petAtual.imagem;
        imagem.alt = `Foto do pet ${petAtual.nome}`;
        campoImagem.appendChild(imagem);
    } else {
        campoImagem.textContent = 'Sem imagem';
    }

    document.getElementById('botao-editar').href = `editar-pet.html?id=${petAtual.id}`;

    // Histórico de reservas do pet
    const lista = document.getElementById('lista-reservas');
    const reservas = Dados.reservas.doPet(petAtual.id);
    lista.innerHTML = reservas.length
        ? reservas.map((r) => `
            <li><a href="ver-reserva.html?id=${r.id}">${Dados.formatarData(r.chegada)} - ${Dados.formatarData(r.partida)} (${Dados.rotulos.statusReserva[r.status].toLowerCase()})</a></li>`).join('')
        : '<li>Este pet ainda não tem reservas.</li>';

    // Deletar
    document.getElementById('botao-deletar').addEventListener('click', () => {
        Dados.mostrar(avisoPagina, '');
        if (!window.confirm(`Deletar o pet ${petAtual.nome}? As reservas finalizadas dele também serão apagadas.`)) return;

        try {
            Dados.pets.remover(petAtual.id);
            Dados.irPara('pets.html?aviso=removido');
        } catch (erro) {
            Dados.mostrar(avisoPagina, erro.message, true);
        }
    });
}
