/*
 * editar-reserva.js - tela única de edição de reserva (editar-reserva.html?id=...).
 *
 * Mostra sempre os mesmos campos; o bloco da nota fiscal só aparece quando o
 * status é "Finalizada". O gerente pode editar a reserva em qualquer status.
 */

const formularioReserva = document.getElementById('formulario-reserva');
const avisoPagina = document.getElementById('mensagem-pagina');
const campos = formularioReserva.elements;
const totalDiarias = document.getElementById('total-diarias');
const miniaturas = document.getElementById('miniaturas');
const blocoNota = document.getElementById('bloco-nota');
const linkRecibo = document.getElementById('link-recibo');

const reservaAtual = Dados.reservas.buscar(Dados.parametro('id'));

// O que ainda não foi salvo: imagens e recibo escolhidos nesta tela
let imagens = [];
let recibo = null;

// Lista de pets: "Max (José da Silva)"
function preencherPets() {
    const select = campos['pet'];
    while (select.options.length > 1) select.remove(1);
    Dados.pets.listar().forEach((pet) => {
        const dono = Dados.usuarios.buscar(pet.proprietarioId);
        const opcao = document.createElement('option');
        opcao.value = pet.id;
        opcao.textContent = dono ? `${pet.nome} (${Dados.usuarios.nomeCompleto(dono)})` : pet.nome;
        select.appendChild(opcao);
    });
}

function atualizarProprietario() {
    const pet = Dados.pets.buscar(campos['pet'].value);
    const dono = pet ? Dados.usuarios.buscar(pet.proprietarioId) : null;
    campos['proprietario'].value = dono ? Dados.usuarios.nomeCompleto(dono) : '';
}

// Se o período não mudou, mostra o total já salvo; se mudou, calcula de novo
function atualizarTotal() {
    const mudou = campos['data-entrada'].value !== reservaAtual.chegada || campos['data-saida'].value !== reservaAtual.partida;
    const total = mudou
        ? Dados.reservas.calcularTotal(campos['data-entrada'].value, campos['data-saida'].value)
        : reservaAtual.total;
    totalDiarias.textContent = Dados.formatarMoeda(total);
}

function desenharMiniaturas() {
    miniaturas.innerHTML = imagens
        .map((src, i) => `<img class="miniatura" src="${src}" alt="Imagem ${i + 1} da hospedagem">`)
        .join('');
}

function desenharRecibo() {
    blocoNota.hidden = campos['status'].value !== 'finalizada';
    linkRecibo.hidden = !recibo;
    if (recibo) {
        linkRecibo.textContent = recibo.nome;
        linkRecibo.href = recibo.dados;
        linkRecibo.download = recibo.nome;
    }
}

function preencher() {
    preencherPets();
    campos['pet'].value = reservaAtual.petId;
    campos['data-entrada'].value = reservaAtual.chegada;
    campos['data-saida'].value = reservaAtual.partida;
    campos['notas'].value = reservaAtual.notas || '';
    campos['status'].value = reservaAtual.status;
    campos['anotacoes'].value = reservaAtual.anotacoes || '';
    campos['imagem'].value = '';
    campos['nota'].value = '';

    imagens = (reservaAtual.imagens || []).slice();
    recibo = reservaAtual.recibo || null;

    atualizarProprietario();
    atualizarTotal();
    desenharMiniaturas();
    desenharRecibo();
}

if (!reservaAtual) {
    formularioReserva.hidden = true;
    Dados.mostrar(avisoPagina, 'Reserva não encontrada. Volte para a lista de reservas e escolha uma.', true);
} else {
    preencher();

    campos['pet'].addEventListener('change', atualizarProprietario);
    campos['data-entrada'].addEventListener('input', atualizarTotal);
    campos['data-saida'].addEventListener('input', atualizarTotal);
    campos['status'].addEventListener('change', desenharRecibo);

    // Nova imagem da hospedagem
    campos['imagem'].addEventListener('change', async () => {
        const arquivo = campos['imagem'].files[0];
        if (!arquivo) return;
        Dados.mostrar(avisoPagina, '');
        try {
            imagens.push(await Dados.lerImagem(arquivo));
            desenharMiniaturas();
        } catch (erro) {
            Dados.mostrar(avisoPagina, erro.message, true);
        }
        campos['imagem'].value = '';
    });

    // Nota fiscal / recibo (até 300 KB, porque os dados ficam no navegador)
    campos['nota'].addEventListener('change', async () => {
        const arquivo = campos['nota'].files[0];
        if (!arquivo) return;
        Dados.mostrar(avisoPagina, '');
        try {
            recibo = await Dados.lerArquivo(arquivo, 300 * 1024);
            desenharRecibo();
        } catch (erro) {
            Dados.mostrar(avisoPagina, erro.message, true);
        }
        campos['nota'].value = '';
    });

    // "Limpar" volta aos dados salvos da reserva
    formularioReserva.addEventListener('reset', (evento) => {
        evento.preventDefault();
        Dados.mostrar(avisoPagina, '');
        preencher();
    });

    formularioReserva.addEventListener('submit', (evento) => {
        evento.preventDefault();
        Dados.mostrar(avisoPagina, '');

        try {
            Dados.reservas.atualizar(reservaAtual.id, {
                petId: campos['pet'].value,
                chegada: campos['data-entrada'].value,
                partida: campos['data-saida'].value,
                notas: campos['notas'].value.trim(),
                status: campos['status'].value,
                anotacoes: campos['anotacoes'].value.trim(),
                imagens: imagens,
                recibo: recibo,
            });
            Dados.irPara('reservas.html?aviso=salvo');
        } catch (erro) {
            Dados.mostrar(avisoPagina, erro.message, true);
        }
    });
}
