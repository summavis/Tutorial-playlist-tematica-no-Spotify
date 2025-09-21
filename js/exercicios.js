//Requisição no github para buscar os repositórios de framework Javascript mais bem votados
async function buscarFrameworksGitHub() {
  try {
    const resposta = await fetch("https://api.github.com/search/repositories?q=framework+language:JavaScript&sort=stars&order=desc&per_page=3");
    const dados = await resposta.json();
    const opcoes = dados.items.map(repo => repo.full_name);

    //retorna a pergunta e os dados coletados com a requisição e avisa erro caso falhe
    return {
      id: "ex3",
      tipo: "combobox",
      pergunta: "Qual desses é o repositório com mais estrelas no Github?",
      opcoes,
      correta: [0]
    };
  } catch (erro) {
    console.error("Erro ao buscar dados do GitHub:", erro);
    return null;
  }
}

//Carrega os exercicios inclusive o com requisição ao Github
async function carregarExercicios() {
  const exercicioAPI = await buscarFrameworksGitHub();

  // cria o restante dos exercícios sem requisição externa em formato JSON para facilitar o acesso aos dados da próxima função
  const exercicios = [
    {
      id: "ex1",
      tipo: "escolhaUnica",
      pergunta: "Qual é a função principal do HTML em uma aplicação front-end?",
      opcoes: [
        "Definir o conteúdo e a estrutura da página",
        "Criar a lógica de back-end",
        "Estilizar os elementos da página",
        "Gerenciar o banco de dados"
      ],
      correta: [0]
    },
    {
      id: "ex2",
      tipo: "multiplaEscolha",
      pergunta: "Quais dessas tecnologias são usadas no front-end?",
      opcoes: [
        "HTML",
        "CSS",
        "JavaScript",
        "Node.js",
        "MongoDB"
      ],
      correta: [0, 1, 2]
    },
    exercicioAPI
  ].filter(Boolean);

  return exercicios;
}


//inicializa o Quizz
async function initQuiz() {
  const exercicios = await carregarExercicios();

  //insere os exercicios dinamicamente na pagina (facilitando no caso de precisar adicionar novos exercicios)
  exercicios.forEach(ex => {
    const container = document.getElementById(ex.id);
    if (!container) return;    
    container.classList.add("exercicio");

    //leitura dos dados resgatados e fornecidos anteriormente
    let estado = JSON.parse(localStorage.getItem(ex.id)) || { tentativas: 0, concluido: false };

    const perguntaEl = document.createElement("h3");
    perguntaEl.textContent = ex.pergunta;
    container.appendChild(perguntaEl);


    //criação dinamica do exercicios de 3 tipos diferentes
    if (ex.tipo === "escolhaUnica" || ex.tipo === "multiplaEscolha") {
      ex.opcoes.forEach((op, i) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = ex.tipo === "escolhaUnica" ? "radio" : "checkbox";
        input.name = ex.id;
        input.value = i;
        label.appendChild(input);
        label.appendChild(document.createTextNode(op));
        container.appendChild(label);
      });
    } else if (ex.tipo === "combobox") {
      const select = document.createElement("select");
      select.id = ex.id + "_select";
      ex.opcoes.forEach((op, i) => {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = op;
        select.appendChild(option);
      });
      container.appendChild(select);
    }

    // Botão de checagem
    const btn = document.createElement("button");
    btn.textContent = "Verificar resposta";
    btn.disabled = estado.concluido;
    btn.classList.add("btn");
    btn.addEventListener("click", () => verificarResposta(ex));
    container.appendChild(btn);

    // Div para feedback
    const feedback = document.createElement("div");
    feedback.id = ex.id + "_feedback";
    feedback.classList.add("feedback");
    container.appendChild(feedback);

    // Div para tentativas
    const tentativasEl = document.createElement("div");
    tentativasEl.id = ex.id + "_tentativas";
    tentativasEl.classList.add("tentativas");
    container.appendChild(tentativasEl);
  });

  // Verifica ao carregar se todos os exercícios já foram concluídos
  checarPontuacao();
}

//Faz a verificação das respostas
function verificarResposta(ex) {
  let selecionados = [];

  if (ex.tipo === "escolhaUnica" || ex.tipo === "multiplaEscolha") {
    const inputs = document.getElementsByName(ex.id);
    inputs.forEach(input => {
      if (input.checked) selecionados.push(parseInt(input.value));
    });
  } else if (ex.tipo === "combobox") {
    const select = document.getElementById(ex.id + "_select");
    selecionados.push(parseInt(select.value));
  }

  //le os dados em JSON para verificar se a questão esta correta
  let estado = JSON.parse(localStorage.getItem(ex.id)) || { tentativas: 0, concluido: false, acertou: false };
  if (estado.concluido) return;

  estado.tentativas++;

  const feedback = document.getElementById(ex.id + "_feedback");
  const tentativasEl = document.getElementById(ex.id + "_tentativas");

  //revela os elementos escondidos
  feedback.style.display = "block";
  tentativasEl.style.display = "block";

  //verifica acerto
  const acertou = selecionados.length === ex.correta.length &&
                  ex.correta.every(val => selecionados.includes(val));

  //resposta visual para o usuário sobre o acerto ou erro respeitando as 3 vezes de limite de erro antes de bloquear a questão
  if (acertou) {
    feedback.textContent = "✅ Correto! Parabéns!";
    estado.concluido = true;
    estado.acertou = true;
    tentativasEl.textContent = "";
  } else if (estado.tentativas >= 3) {
    feedback.textContent = `❌ Número máximo de tentativas atingido. Resposta correta: ${ex.opcoes.filter((_, i) => ex.correta.includes(i)).join(", ")}`;
    estado.concluido = true;
    estado.acertou = false;
    tentativasEl.textContent = "";
  } else {
    feedback.textContent = "❌ Incorreto! Tente novamente.";
    tentativasEl.textContent = `Tentativas restantes: ${3 - estado.tentativas}`;
    estado.acertou = false;
  }

  //registro no localstorage para gravar as respostas e as tentativas
  localStorage.setItem(ex.id, JSON.stringify(estado));
  checarPontuacao();
}

//Checa as pontuações de dos execicios
function checarPontuacao() {
  const exerciciosIds = ["ex1", "ex2", "ex3"];
  let acertos = 0;

  exerciciosIds.forEach(id => {
    const estado = JSON.parse(localStorage.getItem(id));
    if (estado && estado.concluido && estado.acertou) {
      acertos++;
    }
  });

  if (exerciciosIds.every(id => {
    const estado = JSON.parse(localStorage.getItem(id));
    return estado && estado.concluido;
  })) {
    mostrarPopupPontuacao(acertos, exerciciosIds.length);
  }
}

//revela o popup com a pontuação
function mostrarPopupPontuacao(acertos, total) {
  const popup = document.getElementById("popup-pontuacao");
  const texto = document.getElementById("pontuacao-texto");
  texto.textContent = `Você concluiu o quiz!\nPontuação: ${acertos} de ${total}`;
  popup.style.display = "flex";

  const btnFechar = document.getElementById("fechar-popup");
  btnFechar.onclick = () => {
    popup.style.display = "none";
  };
}


//inicializa o quizz
initQuiz();