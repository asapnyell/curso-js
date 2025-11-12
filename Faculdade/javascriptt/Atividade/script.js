// --- 1. SELEÇÃO DOS ELEMENTOS DO DOM ---
const form = document.getElementById('formTarefa');
const descricao = document.getElementById('descricao');
const prioridade = document.getElementById('prioridade');
const resultado = document.getElementById('resultado');

// --- 2. O VETOR (ARRAY) QUE ARMAZENA AS TAREFAS ---
let tarefas = []; // 

// --- 3. FUNÇÕES DE VALIDAÇÃO ---

// Valida se a descrição tem mais de 3 caracteres
function validarDescricao(valor) {
    return valor.trim().length > 3; 
}

// Valida se uma prioridade foi selecionada
function validarPrioridade(valor) {
    return valor !== ""; // Verifica se o valor não é "Selecione..."
}

// --- 4. FUNÇÕES DE UTILIDADE E MANIPULAÇÃO DO VETOR ---

// Adiciona um objeto {descricao, prioridade} ao vetor
function adicionarTarefa(desc, prio) {
    tarefas.push({ 
        descricao: desc, 
        prioridade: prio 
    });
    console.log(tarefas); // Opcional: ver o array no console
}

// Formata e exibe a lista de tarefas
function listarTarefas() {
    if (tarefas.length === 0) {
        return "<em>Nenhuma tarefa cadastrada.</em>";
    }

    return tarefas.map((t, idx) => {
        // Adicionamos um botão "Excluir" com um 'data-index'
        return `
            <div class="alert alert-info d-flex justify-content-between align-items-center mb-2">
                <span><strong>${idx + 1}. ${t.descricao}</strong> (Prioridade: ${t.prioridade})</span>
                <button class="btn btn-danger btn-sm btn-excluir" data-index="${idx}">
                    Excluir
                </button>
            </div>`;
    }).join("");
}

// Remove uma tarefa do vetor pelo seu índice
function removerTarefa(index) {
    tarefas.splice(index, 1); // Remove 1 item na posição 'index'
    
    // Atualiza a lista na tela
    mostrarResultado(listarTarefas());
}

// Função para exibir mensagens na div 'resultado'

function mostrarResultado(html, tipo = "info") {
    // Se não houver tarefas, o 'tipo' deve ser 'info' padrão
    if (tarefas.length === 0) {
        resultado.innerHTML = `<div class="alert alert-light">${html}</div>`;
    } else {
        resultado.innerHTML = `<div class_exists="alert alert-${tipo}">${html}</div>`;
    }
}

// Função para feedback visual (verde/vermelho)

function marcarCampo(inputEl, valido) {
    inputEl.classList.remove("is-valid", "is-invalid");
    
    if (valido) {
        inputEl.classList.add("is-valid");
    } else {
        inputEl.classList.add("is-invalid");
    }
}

// --- 5. EVENT LISTENERS (OUVIDORES DE EVENTOS) ---

// A. OUVINDOR PRINCIPAL (SUBMIT DO FORMULÁRIO)

form.addEventListener("submit", function(event) {
    event.preventDefault(); // Evita o reload da página

    // 1. Validar os dados
    const descValida = validarDescricao(descricao.value);
    const prioValida = validarPrioridade(prioridade.value);

    // 2. Aplicar o feedback visual 
    marcarCampo(descricao, descValida);
    marcarCampo(prioridade, prioValida);

    // 3. Se for válido, adicione e mostre
    if (descValida && prioValida) {
        adicionarTarefa(descricao.value, prioridade.value);
        
        // Mostrar a lista atualizada
        mostrarResultado(listarTarefas(), "success");

        form.reset(); // Limpa o formulário

        // Limpar classes visuais após o reset
        [descricao, prioridade].forEach(i => i.classList.remove("is-valid", "is-invalid"));
    
    // 4. Se for inválido, mostre o erro
    } else {
        // Mostra erro genérico, pois os campos já estão vermelhos
        // (Não usamos mostrarResultado para não apagar a lista de tarefas)
        console.log("Erro no formulário");
    }
});

// B. OUVIDORES PARA VALIDAÇÃO EM TEMPO REAL

descricao.addEventListener("input", () => {
    marcarCampo(descricao, validarDescricao(descricao.value));
});

prioridade.addEventListener("change", () => { // Usamos 'change' para <select>
    marcarCampo(prioridade, validarPrioridade(prioridade.value));
});


// C. OUVIDOR PARA OS BOTÕES DE EXCLUIR (DELEGAÇÃO DE EVENTOS)
// Ouve cliques na 'div' PAI (resultado)
resultado.addEventListener("click", function(event) {
    // Verifica se o item clicado tem a classe 'btn-excluir'
    if (event.target.classList.contains("btn-excluir")) {
        
        // Pega o 'data-index' que colocamos no botão
        const indexParaRemover = Number(event.target.dataset.index);
        
        // Chama a função de remoção
        removerTarefa(indexParaRemover);
    }
});