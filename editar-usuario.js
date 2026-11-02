/*
 * editar-usuario.js - abre o usuário escolhido (editar-usuario.html?id=...)
 * e salva as mudanças. O gerente pode trocar a função e o status.
 */

const formularioUsuario = document.getElementById('formulario-usuario');
const avisoPagina = document.getElementById('mensagem-pagina');
const fotoAtual = document.getElementById('foto-atual');
const dicaProprio = document.getElementById('dica-proprio');

const usuarioAtual = Dados.usuarios.buscar(Dados.parametro('id'));

function preencher() {
    const campos = formularioUsuario.elements;
    campos['email'].value = usuarioAtual.email;
    campos['nome'].value = usuarioAtual.nome;
    campos['sobrenome'].value = usuarioAtual.sobrenome || '';
    campos['telefone'].value = usuarioAtual.telefone || '';
    campos['funcao'].value = usuarioAtual.funcao;
    campos['status'].value = usuarioAtual.status;
    campos['foto'].value = '';

    // O gerente logado não pode mudar a própria função nem o próprio status
    const ehOProprio = usuarioAtual.id === Dados.usuarioLogadoId;
    campos['funcao'].disabled = ehOProprio;
    campos['status'].disabled = ehOProprio;
    dicaProprio.hidden = !ehOProprio;

    if (usuarioAtual.foto) {
        fotoAtual.src = usuarioAtual.foto;
        fotoAtual.alt = `Foto atual de ${Dados.usuarios.nomeCompleto(usuarioAtual)}`;
        fotoAtual.hidden = false;
    }
}

if (!usuarioAtual) {
    formularioUsuario.hidden = true;
    Dados.mostrar(avisoPagina, 'Usuário não encontrado. Volte para a lista de usuários e escolha um.', true);
} else {
    preencher();

    // "Limpar" volta aos dados salvos do usuário
    formularioUsuario.addEventListener('reset', (evento) => {
        evento.preventDefault();
        Dados.mostrar(avisoPagina, '');
        preencher();
    });

    formularioUsuario.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        Dados.mostrar(avisoPagina, '');

        try {
            const campos = formularioUsuario.elements;
            const mudancas = {
                email: campos['email'].value.trim(),
                nome: campos['nome'].value.trim(),
                sobrenome: campos['sobrenome'].value.trim(),
                telefone: campos['telefone'].value.trim(),
                funcao: campos['funcao'].value,
                status: campos['status'].value,
            };

            // Só troca a foto se uma nova foi escolhida
            const arquivo = campos['foto'].files[0];
            if (arquivo) mudancas.foto = await Dados.lerImagem(arquivo);

            Dados.usuarios.atualizar(usuarioAtual.id, mudancas);
            Dados.irPara('usuarios.html?aviso=salvo');
        } catch (erro) {
            Dados.mostrar(avisoPagina, erro.message, true);
        }
    });
}
