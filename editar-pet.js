/*
 * editar-pet.js - abre o pet escolhido (editar-pet.html?id=...) e salva as mudanças.
 */

const formularioPet = document.getElementById('formulario-pet');
const avisoPagina = document.getElementById('mensagem-pagina');
const fotoAtual = document.getElementById('foto-atual');

const petAtual = Dados.pets.buscar(Dados.parametro('id'));

function preencher() {
    Dados.preencherDonos(formularioPet.elements['proprietario'], petAtual.proprietarioId);
    formularioPet.elements['proprietario'].value = petAtual.proprietarioId;
    formularioPet.elements['nome'].value = petAtual.nome;
    formularioPet.elements['tipo'].value = petAtual.tipo;
    formularioPet.elements['raca'].value = petAtual.raca;
    formularioPet.elements['tamanho'].value = petAtual.tamanho;
    formularioPet.elements['imagem'].value = '';

    if (petAtual.imagem) {
        fotoAtual.src = petAtual.imagem;
        fotoAtual.alt = `Foto atual do pet ${petAtual.nome}`;
        fotoAtual.hidden = false;
    }
}

if (!petAtual) {
    formularioPet.hidden = true;
    Dados.mostrar(avisoPagina, 'Pet não encontrado. Volte para a lista de pets e escolha um.', true);
} else {
    preencher();

    // "Limpar" volta aos dados salvos do pet
    formularioPet.addEventListener('reset', (evento) => {
        evento.preventDefault();
        Dados.mostrar(avisoPagina, '');
        preencher();
    });

    formularioPet.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        Dados.mostrar(avisoPagina, '');

        try {
            const campos = {
                proprietarioId: formularioPet.elements['proprietario'].value,
                nome: formularioPet.elements['nome'].value.trim(),
                tipo: formularioPet.elements['tipo'].value,
                raca: formularioPet.elements['raca'].value.trim(),
                tamanho: formularioPet.elements['tamanho'].value,
            };

            // Só troca a imagem se uma nova foi escolhida
            const arquivo = formularioPet.elements['imagem'].files[0];
            if (arquivo) campos.imagem = await Dados.lerImagem(arquivo);

            Dados.pets.atualizar(petAtual.id, campos);
            Dados.irPara('pets.html?aviso=salvo');
        } catch (erro) {
            Dados.mostrar(avisoPagina, erro.message, true);
        }
    });
}
