/*
 * fazer-reserva.js - cria uma reserva. O total das diárias é calculado
 * na hora: número de diárias x valor da diária das Configurações.
 */

const formularioReserva = document.getElementById('formulario-reserva');
const avisoPagina = document.getElementById('mensagem-pagina');
const totalDiarias = document.getElementById('total-diarias');
const campoPet = formularioReserva.elements['pet'];
const campoEntrada = formularioReserva.elements['data-entrada'];
const campoSaida = formularioReserva.elements['data-saida'];

// Lista de pets: "Max (José da Silva)"
Dados.pets.listar().forEach((pet) => {
    const dono = Dados.usuarios.buscar(pet.proprietarioId);
    const opcao = document.createElement('option');
    opcao.value = pet.id;
    opcao.textContent = dono ? `${pet.nome} (${Dados.usuarios.nomeCompleto(dono)})` : pet.nome;
    campoPet.appendChild(opcao);
});

function atualizarTotal() {
    const total = Dados.reservas.calcularTotal(campoEntrada.value, campoSaida.value);
    totalDiarias.textContent = Dados.formatarMoeda(total);
}

campoEntrada.addEventListener('input', atualizarTotal);
campoSaida.addEventListener('input', atualizarTotal);
formularioReserva.addEventListener('reset', () => setTimeout(atualizarTotal, 0));

formularioReserva.addEventListener('submit', (evento) => {
    evento.preventDefault();
    Dados.mostrar(avisoPagina, '');

    try {
        Dados.reservas.adicionar({
            petId: campoPet.value,
            chegada: campoEntrada.value,
            partida: campoSaida.value,
            notas: formularioReserva.elements['notas'].value,
        });
        Dados.irPara('reservas.html?aviso=cadastrado');
    } catch (erro) {
        Dados.mostrar(avisoPagina, erro.message, true);
    }
});
