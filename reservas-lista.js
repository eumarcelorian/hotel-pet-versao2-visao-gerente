/*
 * reservas-lista.js - monta a tabela da tela de Reservas a partir do dados.js.
 *
 * Depois de montada, a busca (busca-reservas.js) filtra as linhas.
 */

const corpoReservas = document.getElementById('tabela-reservas');

function linhaDaReserva(reserva) {
    const pet = Dados.pets.buscar(reserva.petId);
    const dono = pet ? Dados.usuarios.buscar(pet.proprietarioId) : null;

    const celulaPet = pet
        ? `<a href="visualizar-pet.html?id=${pet.id}">${Dados.escapar(pet.nome)}</a>`
        : '—';

    return `
        <tr>
            <td>
                <input type="checkbox" id="reserva-${reserva.id}" name="reserva-selecionada" value="${reserva.id}">
                <label class="texto-oculto" for="reserva-${reserva.id}">Selecionar reserva ${reserva.id}</label>
            </td>
            <td>${reserva.id}</td>
            <td>${celulaPet}</td>
            <td>${dono ? Dados.escapar(Dados.usuarios.nomeCompleto(dono)) : '—'}</td>
            <td>${Dados.formatarData(reserva.chegada)}</td>
            <td>${Dados.formatarData(reserva.partida)}</td>
            <td>${Dados.rotulos.statusReserva[reserva.status]}</td>
            <td>${Dados.formatarMoeda(reserva.total)}</td>
            <td>
                <a href="editar-reserva.html?id=${reserva.id}">Editar</a>
                <a href="ver-reserva.html?id=${reserva.id}">Visualizar</a>
            </td>
        </tr>`;
}

corpoReservas.innerHTML = Dados.reservas.listar().map(linhaDaReserva).join('');

// Aviso depois de cadastrar ou editar (vem na URL)
document.getElementById('mensagem-busca').textContent = Dados.aviso();
