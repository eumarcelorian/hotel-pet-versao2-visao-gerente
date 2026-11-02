/*
 * cadastrar-usuario.js - salva o novo usuário e volta para a lista.
 */

const formularioUsuario = document.getElementById('formulario-usuario');
const avisoPagina = document.getElementById('mensagem-pagina');

formularioUsuario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    Dados.mostrar(avisoPagina, '');

    try {
        const campos = {
            email: formularioUsuario.elements['email'].value.trim(),
            nome: formularioUsuario.elements['nome'].value.trim(),
            sobrenome: formularioUsuario.elements['sobrenome'].value.trim(),
            telefone: formularioUsuario.elements['telefone'].value.trim(),
            funcao: formularioUsuario.elements['funcao'].value,
            status: 'ativo',
            foto: '',
        };

        const arquivo = formularioUsuario.elements['foto'].files[0];
        if (arquivo) campos.foto = await Dados.lerImagem(arquivo);

        Dados.usuarios.adicionar(campos);
        Dados.irPara('usuarios.html?aviso=cadastrado');
    } catch (erro) {
        Dados.mostrar(avisoPagina, erro.message, true);
    }
});
