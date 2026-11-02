/*
 * cadastrar-pet.js - salva o novo pet e volta para a lista.
 */

const formularioPet = document.getElementById('formulario-pet');
const avisoPagina = document.getElementById('mensagem-pagina');

Dados.preencherDonos(formularioPet.elements['proprietario'], null);

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
            imagem: '',
        };

        const arquivo = formularioPet.elements['imagem'].files[0];
        if (arquivo) campos.imagem = await Dados.lerImagem(arquivo);

        Dados.pets.adicionar(campos);
        Dados.irPara('pets.html?aviso=cadastrado');
    } catch (erro) {
        Dados.mostrar(avisoPagina, erro.message, true);
    }
});
