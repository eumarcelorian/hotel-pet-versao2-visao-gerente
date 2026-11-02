/*
 * dados.js - "banco de dados" do Hotel Pet, guardado no navegador.
 *
 * Como não existe backend, os dados ficam no localStorage. Na primeira vez
 * que o site abre, ele é preenchido com os dados de exemplo abaixo; depois
 * disso, tudo que for cadastrado, editado ou removido é salvo ali.
 *
 * Todas as telas usam o objeto Dados (ex.: Dados.pets.listar()).
 * Para voltar aos dados de exemplo: aumente VERSAO ou limpe o localStorage
 * do site nas ferramentas do navegador.
 */

const Dados = (function () {
    const CHAVE = 'hotelpet-dados';
    const VERSAO = 2;

    // Usuário que está "logado" (o mesmo do cabeçalho, em layout.js)
    const USUARIO_LOGADO_ID = '12349984501';

    /* ---------- Textos de cada valor (o que aparece na tela) ---------- */

    const TIPOS = { cachorro: 'Cachorro', gato: 'Gato', outro: 'Outro' };
    const TAMANHOS = { pequeno: 'Pequeno', medio: 'Médio', grande: 'Grande' };
    const STATUS_RESERVA = { reservada: 'Reservada', andamento: 'Em andamento', finalizada: 'Finalizada' };
    const FUNCOES = { gerente: 'Gerente', funcionario: 'Funcionário', cliente: 'Cliente' };
    const STATUS_USUARIO = { ativo: 'Ativo', inativo: 'Inativo' };

    // Mensagens mostradas depois de uma ação (vêm na URL: pets.html?aviso=cadastrado)
    const AVISOS = {
        cadastrado: 'Cadastro realizado com sucesso.',
        salvo: 'Alterações salvas com sucesso.',
        removido: 'Removido com sucesso.',
    };

    /* ---------- Dados de exemplo ---------- */

    function dadosIniciais() {
        const reserva = (id, petId, status, anotacoes, atualizadaEm) => ({
            id: id, petId: petId, chegada: '2021-05-02', partida: '2021-05-07', status: status, total: 40,
            notas: 'Informações sobre a estadia do pet.', anotacoes: anotacoes,
            imagens: [], recibo: null, criadaEm: '2021-05-02', atualizadaEm: atualizadaEm,
        });

        return {
            versao: VERSAO,
            usuarios: [
                { id: '12349984501', email: 'joaodasilva@pet.com', nome: 'João', sobrenome: 'da Silva', telefone: '+55 (73) 99876-8943', funcao: 'gerente', status: 'ativo', criadoEm: '2020-02-19', foto: '' },
                { id: '12349984502', email: 'maria@pet.com', nome: 'Maria', sobrenome: 'da Silva', telefone: '+55 (73) 99111-2222', funcao: 'funcionario', status: 'inativo', criadoEm: '2020-02-19', foto: '' },
                { id: '12349984503', email: 'josedasilva@pet.com', nome: 'José', sobrenome: 'da Silva', telefone: '+55 (73) 99222-3333', funcao: 'cliente', status: 'ativo', criadoEm: '2020-02-19', foto: '' },
                { id: '12349984504', email: 'ana.costa@pet.com', nome: 'Ana', sobrenome: 'Costa', telefone: '+55 (73) 99333-4444', funcao: 'funcionario', status: 'ativo', criadoEm: '2021-03-10', foto: '' },
                { id: '12349984505', email: 'carlos@pet.com', nome: 'Carlos', sobrenome: 'Pereira', telefone: '+55 (73) 99444-5555', funcao: 'cliente', status: 'ativo', criadoEm: '2022-07-05', foto: '' },
                { id: '12349984506', email: 'paula@pet.com', nome: 'Paula', sobrenome: 'Souza', telefone: '+55 (73) 99555-6666', funcao: 'cliente', status: 'inativo', criadoEm: '2023-11-22', foto: '' },
            ],
            pets: [
                { id: '12349984501', proprietarioId: '12349984503', nome: 'Max', tipo: 'cachorro', raca: 'Pastor Alemão', tamanho: 'grande', imagem: 'imagens/max.jpg' },
                { id: '12349984502', proprietarioId: '12349984505', nome: 'Ginger', tipo: 'gato', raca: 'Não definida', tamanho: 'pequeno', imagem: '' },
                { id: '12349984503', proprietarioId: '12349984503', nome: 'Thor', tipo: 'cachorro', raca: 'Golden Retriever', tamanho: 'medio', imagem: 'imagens/thor.jpg' },
            ],
            reservas: [
                reserva('12349984501', '12349984501', 'reservada', '', '2021-05-02'),
                reserva('12349984502', '12349984502', 'andamento', 'Pet bem adaptado à hospedagem.', '2021-05-04'),
                reserva('12349984503', '12349984501', 'finalizada', 'Pet bem adaptado à hospedagem.', '2021-05-07'),
            ],
            configuracoes: { valorDiaria: 10, vagas: 3 },
        };
    }

    /* ---------- Leitura e gravação no navegador ---------- */

    let banco = carregar();

    function carregar() {
        try {
            const texto = localStorage.getItem(CHAVE);
            if (texto) {
                const lido = JSON.parse(texto);
                if (lido && lido.versao === VERSAO) return lido;
            }
        } catch (erro) {
            // dados ilegíveis ou localStorage bloqueado: usa os dados de exemplo
        }

        const inicial = dadosIniciais();
        try {
            localStorage.setItem(CHAVE, JSON.stringify(inicial));
        } catch (erro) {
            // sem localStorage, os dados valem só para esta página
        }
        return inicial;
    }

    function salvar() {
        try {
            localStorage.setItem(CHAVE, JSON.stringify(banco));
        } catch (erro) {
            throw new Error('Não foi possível guardar os dados neste navegador (talvez o espaço tenha acabado).');
        }
    }

    // Próximo id: o maior número já usado na lista + 1 (mesmo formato dos ids de exemplo)
    function proximoId(lista) {
        const maior = lista.reduce((m, item) => Math.max(m, Number(item.id)), 12349984500);
        return String(maior + 1);
    }

    // Data de hoje no formato "2026-11-02"
    function hoje() {
        const d = new Date();
        const dois = (n) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`;
    }

    /* ---------- Usuários ---------- */

    function nomeCompleto(usuario) {
        return `${usuario.nome} ${usuario.sobrenome || ''}`.trim();
    }

    function buscarUsuario(id) {
        return banco.usuarios.find((u) => u.id === id) || null;
    }

    function validarUsuario(campos, ignorarId) {
        const email = (campos.email || '').trim().toLowerCase();
        if (!email) throw new Error('Informe o e-mail.');
        if (banco.usuarios.some((u) => u.id !== ignorarId && u.email.toLowerCase() === email)) {
            throw new Error('Já existe um usuário com este e-mail.');
        }
        if (!(campos.nome || '').trim()) throw new Error('Informe o nome.');
        if (!FUNCOES[campos.funcao]) throw new Error('Escolha uma função.');
        if (!STATUS_USUARIO[campos.status]) throw new Error('Escolha um status.');
    }

    function adicionarUsuario(campos) {
        const usuario = Object.assign({ status: 'ativo', criadoEm: hoje(), foto: '' }, campos);
        validarUsuario(usuario, null);
        usuario.id = proximoId(banco.usuarios);
        usuario.email = usuario.email.trim().toLowerCase();
        banco.usuarios.push(usuario);
        salvar();
        return usuario;
    }

    function atualizarUsuario(id, campos) {
        const usuario = buscarUsuario(id);
        if (!usuario) throw new Error('Usuário não encontrado.');

        const mudaFuncao = campos.funcao && campos.funcao !== usuario.funcao;
        const mudaStatus = campos.status && campos.status !== usuario.status;
        if (id === USUARIO_LOGADO_ID && (mudaFuncao || mudaStatus)) {
            throw new Error('Você não pode alterar a sua própria função nem o seu status.');
        }

        const novo = Object.assign({}, usuario, campos);
        validarUsuario(novo, id);
        novo.email = novo.email.trim().toLowerCase();
        Object.assign(usuario, novo);
        salvar();
        return usuario;
    }

    // Devolve o motivo pelo qual o usuário não pode ser removido (ou null se pode)
    function erroRemocaoUsuario(id) {
        const usuario = buscarUsuario(id);
        if (!usuario) return 'Usuário não encontrado.';
        if (id === USUARIO_LOGADO_ID) return 'Você não pode remover o seu próprio usuário.';
        if (banco.pets.some((p) => p.proprietarioId === id)) {
            return `${nomeCompleto(usuario)} tem pets cadastrados e não pode ser removido.`;
        }
        return null;
    }

    // Só remove se todos puderem ser removidos
    function removerUsuarios(ids) {
        ids.forEach((id) => {
            const erro = erroRemocaoUsuario(id);
            if (erro) throw new Error(erro);
        });
        banco.usuarios = banco.usuarios.filter((u) => !ids.includes(u.id));
        salvar();
    }

    // Ativo vira inativo e inativo vira ativo
    function alternarStatusUsuarios(ids) {
        if (ids.includes(USUARIO_LOGADO_ID)) {
            throw new Error('Você não pode alterar o status do seu próprio usuário.');
        }
        banco.usuarios.forEach((u) => {
            if (ids.includes(u.id)) u.status = u.status === 'ativo' ? 'inativo' : 'ativo';
        });
        salvar();
    }

    function petsDoUsuario(id) {
        return banco.pets.filter((p) => p.proprietarioId === id);
    }

    // Clientes ativos (mais o dono atual do pet, mesmo que esteja inativo)
    function donosPossiveis(donoAtualId) {
        return banco.usuarios.filter(
            (u) => u.funcao === 'cliente' && (u.status === 'ativo' || u.id === donoAtualId)
        );
    }

    /* ---------- Pets ---------- */

    function buscarPet(id) {
        return banco.pets.find((p) => p.id === id) || null;
    }

    function validarPet(campos) {
        if (!buscarUsuario(campos.proprietarioId)) throw new Error('Escolha o proprietário.');
        if (!(campos.nome || '').trim()) throw new Error('Informe o nome do pet.');
        if (!TIPOS[campos.tipo]) throw new Error('Escolha o tipo do pet.');
        if (!(campos.raca || '').trim()) throw new Error('Informe a raça do pet.');
        if (!TAMANHOS[campos.tamanho]) throw new Error('Escolha o tamanho do pet.');
    }

    function adicionarPet(campos) {
        validarPet(campos);
        const pet = Object.assign({ id: proximoId(banco.pets) }, campos);
        banco.pets.push(pet);
        salvar();
        return pet;
    }

    function atualizarPet(id, campos) {
        const pet = buscarPet(id);
        if (!pet) throw new Error('Pet não encontrado.');
        const novo = Object.assign({}, pet, campos);
        validarPet(novo);
        Object.assign(pet, novo);
        salvar();
        return pet;
    }

    // Um pet com reserva "Reservada" ou "Em andamento" não pode ser removido
    function podeRemoverPet(id) {
        return !banco.reservas.some((r) => r.petId === id && r.status !== 'finalizada');
    }

    // Remove o pet e as reservas finalizadas dele
    function removerPet(id) {
        if (!podeRemoverPet(id)) {
            throw new Error('Este pet tem reserva "Reservada" ou "Em andamento" e não pode ser deletado.');
        }
        banco.pets = banco.pets.filter((p) => p.id !== id);
        banco.reservas = banco.reservas.filter((r) => r.petId !== id);
        salvar();
    }

    /* ---------- Configurações ---------- */

    function obterConfiguracoes() {
        return Object.assign({}, banco.configuracoes);
    }

    function salvarConfiguracoes(valorDiaria, vagas) {
        if (!(valorDiaria > 0)) throw new Error('O valor da diária deve ser maior que zero.');
        if (!Number.isInteger(vagas) || vagas < 0) throw new Error('O número de vagas deve ser um número inteiro, de zero para cima.');
        banco.configuracoes = { valorDiaria: Math.round(valorDiaria * 100) / 100, vagas: vagas };
        salvar();
    }

    /* ---------- Reservas ---------- */

    function buscarReserva(id) {
        return banco.reservas.find((r) => r.id === id) || null;
    }

    function reservasDoPet(petId) {
        return banco.reservas
            .filter((r) => r.petId === petId)
            .sort((a, b) => a.chegada.localeCompare(b.chegada));
    }

    // Quantas diárias existem entre a chegada e a partida (as duas em "aaaa-mm-dd")
    function contarDiarias(chegada, partida) {
        const dia = 24 * 60 * 60 * 1000;
        return Math.round((Date.parse(partida + 'T00:00:00Z') - Date.parse(chegada + 'T00:00:00Z')) / dia);
    }

    // Total = número de diárias x valor da diária das configurações
    function calcularTotal(chegada, partida) {
        const diarias = contarDiarias(chegada, partida);
        if (!(diarias > 0)) return 0;
        return Math.round(diarias * banco.configuracoes.valorDiaria * 100) / 100;
    }

    // Reservas que ainda ocupam vaga (não finalizadas) e se sobrepõem ao período
    function vagasOcupadas(chegada, partida, ignorarId) {
        return banco.reservas.filter(
            (r) => r.id !== ignorarId && r.status !== 'finalizada' && r.chegada < partida && r.partida > chegada
        ).length;
    }

    function validarReserva(reserva, ignorarId) {
        if (!buscarPet(reserva.petId)) throw new Error('Escolha um pet.');
        if (!STATUS_RESERVA[reserva.status]) throw new Error('Escolha um status.');
        if (!reserva.chegada || !reserva.partida) throw new Error('Informe as datas de entrada e de saída.');
        if (!(contarDiarias(reserva.chegada, reserva.partida) > 0)) {
            throw new Error('A data de saída deve ser depois da data de entrada.');
        }
        if (
            reserva.status !== 'finalizada' &&
            vagasOcupadas(reserva.chegada, reserva.partida, ignorarId) >= banco.configuracoes.vagas
        ) {
            throw new Error('Não há vagas disponíveis neste período.');
        }
    }

    function adicionarReserva(campos) {
        const reserva = {
            id: proximoId(banco.reservas),
            petId: campos.petId,
            chegada: campos.chegada,
            partida: campos.partida,
            status: 'reservada',
            total: 0,
            notas: (campos.notas || '').trim(),
            anotacoes: '',
            imagens: [],
            recibo: null,
            criadaEm: hoje(),
            atualizadaEm: hoje(),
        };
        validarReserva(reserva, null);
        reserva.total = calcularTotal(reserva.chegada, reserva.partida);
        banco.reservas.push(reserva);
        salvar();
        return reserva;
    }

    function atualizarReserva(id, campos) {
        const reserva = buscarReserva(id);
        if (!reserva) throw new Error('Reserva não encontrada.');

        const nova = Object.assign({}, reserva, campos);
        validarReserva(nova, id);

        // O total só é recalculado se o período mudou (assim o valor antigo se mantém)
        if (nova.chegada !== reserva.chegada || nova.partida !== reserva.partida) {
            nova.total = calcularTotal(nova.chegada, nova.partida);
        }
        nova.atualizadaEm = hoje();

        Object.assign(reserva, nova);
        salvar();
        return reserva;
    }

    /* ---------- Auxiliares de tela ---------- */

    // Valor de um parâmetro da URL (ex.: editar-pet.html?id=123 -> "123")
    function parametro(nome) {
        return new URLSearchParams(window.location.search).get(nome);
    }

    // Texto do aviso que veio na URL (?aviso=cadastrado), ou ""
    function aviso() {
        return AVISOS[parametro('aviso')] || '';
    }

    // Vai para outra página (fica aqui para as telas usarem sempre o mesmo caminho)
    function irPara(endereco) {
        window.location.href = endereco;
    }

    // "2021-05-02" -> "02/05/2021"
    function formatarData(iso) {
        const [ano, mes, dia] = iso.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    // 40 -> "R$ 40,00"
    function formatarMoeda(valor) {
        return 'R$ ' + Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // "R$ 1.040,50" -> 1040.5 (ou NaN se não for um número)
    function lerMoeda(texto) {
        let limpo = String(texto).replace(/[^\d,.]/g, '');
        if (limpo.includes(',')) limpo = limpo.replace(/\./g, '').replace(',', '.');
        return limpo === '' ? NaN : Number(limpo);
    }

    // Evita que um texto digitado vire HTML ao montar linhas com innerHTML
    function escapar(texto) {
        const trocas = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
        return String(texto).replace(/[&<>"']/g, (c) => trocas[c]);
    }

    // Mostra (ou esconde, se o texto for vazio) uma mensagem em um parágrafo da página
    function mostrar(elemento, texto, ehErro) {
        elemento.textContent = texto;
        elemento.hidden = !texto;
        elemento.classList.toggle('erro', Boolean(ehErro));
    }

    // Preenche a lista de proprietários (a primeira opção, "Selecione...", é mantida)
    function preencherDonos(select, donoAtualId) {
        while (select.options.length > 1) select.remove(1);
        donosPossiveis(donoAtualId).forEach((usuario) => {
            const opcao = document.createElement('option');
            opcao.value = usuario.id;
            opcao.textContent = nomeCompleto(usuario);
            select.appendChild(opcao);
        });
    }

    // Lê a imagem escolhida e devolve um texto (data URL) reduzido para caber no localStorage
    function lerImagem(arquivo) {
        return new Promise((resolve, reject) => {
            const leitor = new FileReader();
            leitor.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
            leitor.onload = () => {
                const imagem = new Image();
                imagem.onerror = () => reject(new Error('O arquivo escolhido não é uma imagem válida.'));
                imagem.onload = () => {
                    const LIMITE = 400;
                    const escala = Math.min(1, LIMITE / Math.max(imagem.width, imagem.height));
                    const canvas = document.createElement('canvas');
                    canvas.width = Math.round(imagem.width * escala);
                    canvas.height = Math.round(imagem.height * escala);
                    const contexto = canvas.getContext('2d');
                    contexto.fillStyle = '#ffffff';
                    contexto.fillRect(0, 0, canvas.width, canvas.height);
                    contexto.drawImage(imagem, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL('image/jpeg', 0.8));
                };
                imagem.src = leitor.result;
            };
            leitor.readAsDataURL(arquivo);
        });
    }

    // Lê um arquivo qualquer (ex.: recibo em PDF) como texto, se for pequeno o bastante
    function lerArquivo(arquivo, limiteEmBytes) {
        return new Promise((resolve, reject) => {
            if (arquivo.size > limiteEmBytes) {
                reject(new Error(`O arquivo é grande demais (máximo ${Math.round(limiteEmBytes / 1024)} KB).`));
                return;
            }
            const leitor = new FileReader();
            leitor.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));
            leitor.onload = () => resolve({ nome: arquivo.name, dados: leitor.result });
            leitor.readAsDataURL(arquivo);
        });
    }

    return {
        usuarioLogadoId: USUARIO_LOGADO_ID,
        rotulos: {
            tipo: TIPOS,
            tamanho: TAMANHOS,
            statusReserva: STATUS_RESERVA,
            funcao: FUNCOES,
            statusUsuario: STATUS_USUARIO,
        },
        usuarios: {
            listar: () => banco.usuarios.slice(),
            buscar: buscarUsuario,
            nomeCompleto: nomeCompleto,
            adicionar: adicionarUsuario,
            atualizar: atualizarUsuario,
            remover: removerUsuarios,
            alternarStatus: alternarStatusUsuarios,
            pets: petsDoUsuario,
        },
        pets: {
            listar: () => banco.pets.slice(),
            buscar: buscarPet,
            adicionar: adicionarPet,
            atualizar: atualizarPet,
            podeRemover: podeRemoverPet,
            remover: removerPet,
        },
        reservas: {
            listar: () => banco.reservas.slice(),
            buscar: buscarReserva,
            doPet: reservasDoPet,
            adicionar: adicionarReserva,
            atualizar: atualizarReserva,
            calcularTotal: calcularTotal,
        },
        configuracoes: {
            obter: obterConfiguracoes,
            salvar: salvarConfiguracoes,
        },
        parametro: parametro,
        aviso: aviso,
        irPara: irPara,
        formatarData: formatarData,
        formatarMoeda: formatarMoeda,
        lerMoeda: lerMoeda,
        escapar: escapar,
        mostrar: mostrar,
        preencherDonos: preencherDonos,
        lerImagem: lerImagem,
        lerArquivo: lerArquivo,
    };
})();
