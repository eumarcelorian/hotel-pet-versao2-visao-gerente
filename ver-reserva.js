/*
 * ver-reserva.js - mostra a reserva escolhida (ver-reserva.html?id=...).
 */

const avisoPagina = document.getElementById('mensagem-pagina');
const reservaAtual = Dados.reservas.buscar(Dados.parametro('id'));

function texto(id, valor) {
    document.getElementById(id).textContent = valor;
}

if (!reservaAtual) {
    Dados.mostrar(avisoPagina, 'Reserva não encontrada. Volte para a lista de reservas e escolha uma.', true);
    document.querySelector('.barra-acoes').hidden = true;
    document.querySelector('.detalhes').hidden = true;
} else {
    const pet = Dados.pets.buscar(reservaAtual.petId);
    const dono = pet ? Dados.usuarios.buscar(pet.proprietarioId) : null;

    texto('ver-id', reservaAtual.id);
    texto('ver-proprietario', dono ? Dados.usuarios.nomeCompleto(dono) : '—');
    texto('ver-chegada', Dados.formatarData(reservaAtual.chegada));
    texto('ver-partida', Dados.formatarData(reservaAtual.partida));
    texto('ver-notas', reservaAtual.notas || '—');
    texto('ver-anotacoes', reservaAtual.anotacoes || '—');
    texto('ver-status', Dados.rotulos.statusReserva[reservaAtual.status]);
    texto('ver-total', Dados.formatarMoeda(reservaAtual.total));
    texto('ver-criada', Dados.formatarData(reservaAtual.criadaEm));
    texto('ver-atualizada', Dados.formatarData(reservaAtual.atualizadaEm));

    // Pet (link para a tela dele)
    const campoPet = document.getElementById('ver-pet');
    if (pet) {
        const link = document.createElement('a');
        link.href = `visualizar-pet.html?id=${pet.id}`;
        link.textContent = pet.nome;
        campoPet.appendChild(link);
    } else {
        campoPet.textContent = '—';
    }

    // Imagens da hospedagem
    const campoImagens = document.getElementById('ver-imagens');
    const imagens = reservaAtual.imagens || [];
    if (imagens.length) {
        imagens.forEach((src, i) => {
            const imagem = document.createElement('img');
            imagem.src = src;
            imagem.alt = `Imagem ${i + 1} da hospedagem`;
            campoImagens.appendChild(imagem);
        });
    } else {
        campoImagens.textContent = 'Nenhuma imagem';
    }

    // Recibo (só existe em reservas finalizadas)
    const campoRecibo = document.getElementById('ver-recibo');
    if (reservaAtual.recibo) {
        const link = document.createElement('a');
        link.href = reservaAtual.recibo.dados;
        link.download = reservaAtual.recibo.nome;
        link.textContent = reservaAtual.recibo.nome;
        campoRecibo.appendChild(link);
    } else {
        campoRecibo.textContent = reservaAtual.status === 'finalizada' ? 'Nenhum recibo anexado' : '—';
    }

    document.getElementById('botao-editar').href = `editar-reserva.html?id=${reservaAtual.id}`;
}
