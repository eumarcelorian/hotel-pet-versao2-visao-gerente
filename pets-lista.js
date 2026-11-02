/*
 * pets-lista.js - monta a tabela da tela de Pets a partir do dados.js.
 *
 * Depois de montada, a busca (busca-pets.js) filtra as linhas.
 */

const corpoPets = document.getElementById('tabela-pets');

function linhaDoPet(pet) {
    const nome = Dados.escapar(pet.nome);
    return `
        <tr>
            <td>
                <input type="checkbox" id="pet-${pet.id}" name="pet-selecionado" value="${pet.id}">
                <label class="texto-oculto" for="pet-${pet.id}">Selecionar ${nome}</label>
            </td>
            <td>${pet.id}</td>
            <td>${nome}</td>
            <td>${Dados.rotulos.tipo[pet.tipo]}</td>
            <td>${Dados.escapar(pet.raca)}</td>
            <td>${Dados.rotulos.tamanho[pet.tamanho]}</td>
            <td>
                <a href="editar-pet.html?id=${pet.id}">Editar</a>
                <a href="visualizar-pet.html?id=${pet.id}">Visualizar</a>
            </td>
        </tr>`;
}

corpoPets.innerHTML = Dados.pets.listar().map(linhaDoPet).join('');

// Aviso depois de cadastrar, editar ou deletar (vem na URL)
document.getElementById('mensagem-busca').textContent = Dados.aviso();
