/*
 * configuracoes.js - valor da diária e número de vagas.
 *
 * O valor da diária é usado para calcular o total das reservas novas
 * (ou das que tiverem o período alterado). As vagas limitam quantas reservas
 * "Reservada" ou "Em andamento" podem existir no mesmo período.
 */

const formularioConfiguracoes = document.getElementById('formulario-configuracoes');
const avisoPagina = document.getElementById('mensagem-pagina');

function preencher() {
    const configuracoes = Dados.configuracoes.obter();
    formularioConfiguracoes.elements['valor-diaria'].value = Dados.formatarMoeda(configuracoes.valorDiaria);
    formularioConfiguracoes.elements['vagas'].value = configuracoes.vagas;
}

preencher();

// "Limpar" volta aos valores salvos
formularioConfiguracoes.addEventListener('reset', (evento) => {
    evento.preventDefault();
    Dados.mostrar(avisoPagina, '');
    preencher();
});

formularioConfiguracoes.addEventListener('submit', (evento) => {
    evento.preventDefault();

    try {
        const valorDiaria = Dados.lerMoeda(formularioConfiguracoes.elements['valor-diaria'].value);
        const vagas = Number(formularioConfiguracoes.elements['vagas'].value);

        if (Number.isNaN(valorDiaria)) throw new Error('Digite o valor da diária, por exemplo R$ 10,00.');

        Dados.configuracoes.salvar(valorDiaria, vagas);
        preencher();
        Dados.mostrar(avisoPagina, 'Configurações salvas.', false);
    } catch (erro) {
        Dados.mostrar(avisoPagina, erro.message, true);
    }
});
