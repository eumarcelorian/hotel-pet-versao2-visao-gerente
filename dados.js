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
    const VERSAO = 1;

    /* ---------- Textos de cada valor (o que aparece na tela) ---------- */

    const TIPOS = { cachorro: 'Cachorro', gato: 'Gato', outro: 'Outro' };
    const TAMANHOS = { pequeno: 'Pequeno', medio: 'Médio', grande: 'Grande' };
    const STATUS_RESERVA = { reservada: 'Reservada', andamento: 'Em andamento', finalizada: 'Finalizada' };
    const FUNCOES = { gerente: 'Gerente', funcionario: 'Funcionário', cliente: 'Cliente' };
    const STATUS_USUARIO = { ativo: 'Ativo', inativo: 'Inativo' };

    /* ---------- Dados de exemplo ---------- */

    function dadosIniciais() {
        return {
            versao: VERSAO,
            usuarios: [
                { id: '12349984501', email: 'joaodasilva@pet.com', nome: 'João', sobrenome: 'da Silva', telefone: '+55 (73) 99876-8943', funcao: 'gerente', status: 'ativo', criadoEm: '2020-02-19' },
                { id: '12349984502', email: 'maria@pet.com', nome: 'Maria', sobrenome: 'da Silva', telefone: '+55 (73) 99111-2222', funcao: 'funcionario', status: 'inativo', criadoEm: '2020-02-19' },
                { id: '12349984503', email: 'josedasilva@pet.com', nome: 'José', sobrenome: 'da Silva', telefone: '+55 (73) 99222-3333', funcao: 'cliente', status: 'ativo', criadoEm: '2020-02-19' },
                { id: '12349984504', email: 'ana.costa@pet.com', nome: 'Ana', sobrenome: 'Costa', telefone: '+55 (73) 99333-4444', funcao: 'funcionario', status: 'ativo', criadoEm: '2021-03-10' },
                { id: '12349984505', email: 'carlos@pet.com', nome: 'Carlos', sobrenome: 'Pereira', telefone: '+55 (73) 99444-5555', funcao: 'cliente', status: 'ativo', criadoEm: '2022-07-05' },
                { id: '12349984506', email: 'paula@pet.com', nome: 'Paula', sobrenome: 'Souza', telefone: '+55 (73) 99555-6666', funcao: 'cliente', status: 'inativo', criadoEm: '2023-11-22' },
            ],
            pets: [
                { id: '12349984501', proprietarioId: '12349984503', nome: 'Max', tipo: 'cachorro', raca: 'Pastor Alemão', tamanho: 'grande', imagem: 'imagens/max.jpg' },
                { id: '12349984502', proprietarioId: '12349984505', nome: 'Ginger', tipo: 'gato', raca: 'Não definida', tamanho: 'pequeno', imagem: '' },
                { id: '12349984503', proprietarioId: '12349984503', nome: 'Thor', tipo: 'cachorro', raca: 'Golden Retriever', tamanho: 'medio', imagem: 'imagens/thor.jpg' },
            ],
            reservas: [
                { id: '12349984501', petId: '12349984501', chegada: '2021-05-02', partida: '2021-05-07', status: 'reservada', total: 40, notas: 'Informações sobre a estadia do pet.', anotacoes: '', criadaEm: '2021-05-02', atualizadaEm: '2021-05-02' },
                { id: '12349984502', petId: '12349984502', chegada: '2021-05-02', partida: '2021-05-07', status: 'andamento', total: 40, notas: 'Informações sobre a estadia do pet.', anotacoes: 'Pet bem adaptado à hospedagem.', criadaEm: '2021-05-02', atualizadaEm: '2021-05-04' },
                { id: '12349984503', petId: '12349984501', chegada: '2021-05-02', partida: '2021-05-07', status: 'finalizada', total: 40, notas: 'Informações sobre a estadia do pet.', anotacoes: 'Pet bem adaptado à hospedagem.', criadaEm: '2021-05-02', atualizadaEm: '2021-05-07' },
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
            throw new Error('Não foi possível guardar os dados neste navegador.');
        }
    }

    // Próximo id: o maior número já usado na lista + 1 (mesmo formato dos ids de exemplo)
    function proximoId(lista) {
        const maior = lista.reduce((m, item) => Math.max(m, Number(item.id)), 12349984500);
        return String(maior + 1);
    }

    /* ---------- Usuários ---------- */

    function nomeCompleto(usuario) {
        return `${usuario.nome} ${usuario.sobrenome || ''}`.trim();
    }

    function buscarUsuario(id) {
        return banco.usuarios.find((u) => u.id === id) || null;
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

    function adicionarPet(campos) {
        const pet = Object.assign({ id: proximoId(banco.pets) }, campos);
        banco.pets.push(pet);
        salvar();
        return pet;
    }

    function atualizarPet(id, campos) {
        const pet = buscarPet(id);
        if (!pet) throw new Error('Pet não encontrado.');
        Object.assign(pet, campos);
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

    /* ---------- Reservas ---------- */

    function reservasDoPet(petId) {
        return banco.reservas
            .filter((r) => r.petId === petId)
            .sort((a, b) => a.chegada.localeCompare(b.chegada));
    }

    /* ---------- Auxiliares de tela ---------- */

    // Valor de um parâmetro da URL (ex.: editar-pet.html?id=123 -> "123")
    function parametro(nome) {
        return new URLSearchParams(window.location.search).get(nome);
    }

    // "2021-05-02" -> "02/05/2021"
    function formatarData(iso) {
        const [ano, mes, dia] = iso.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    // Evita que um texto digitado vire HTML ao montar linhas com innerHTML
    function escapar(texto) {
        const trocas = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
        return String(texto).replace(/[&<>"']/g, (c) => trocas[c]);
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

    return {
        rotulos: {
            tipo: TIPOS,
            tamanho: TAMANHOS,
            statusReserva: STATUS_RESERVA,
            funcao: FUNCOES,
            statusUsuario: STATUS_USUARIO,
        },
        usuarios: {
            buscar: buscarUsuario,
            nomeCompleto: nomeCompleto,
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
            doPet: reservasDoPet,
        },
        parametro: parametro,
        formatarData: formatarData,
        escapar: escapar,
        preencherDonos: preencherDonos,
        lerImagem: lerImagem,
    };
})();
