function salvarProgresso(chave, valor) { localStorage.setItem(chave, JSON.stringify(valor)); }
function carregarProgresso(chave) { return JSON.parse(localStorage.getItem(chave)); }

const explicacaoLida = localStorage.getItem("explicacaoLida") === "true";

//Header e Footer das das páginas para alteração dinâmica
const header = `
<nav class="navbar">
    <ul class="menu">
      <li><a href="index.html">Início</a></li>
      <li><a href="tutorial.html">Tutorial</a></li>
      <li><a href="exercicios.html">Exercícios</a></li>
    </ul>
    <a id="btn-tema" class="btn-tema"><img src="./imgs/buttons/button_temaclaro.svg"></a>
  </nav>`;

const footer = `<p><a href="http://www.freepik.com">Personagem criado por Katemangostar / Freepik</a> e animado por Willian Colombo</p>`;



document.getElementsByTagName('header')[0].innerHTML = header;
document.getElementsByTagName('footer')[0].innerHTML = footer;


//Função para aplicar o tema claro/escuro
function aplicarTema(tema) {
  const body = document.body;
  const botao = document.getElementById("btn-tema");
  var img = document.getElementsByClassName('personagem') || document.getElementsByClassName('personagemsobreposta');

  if (tema === "claro") {
    body.classList.add("tema-claro");
    if (botao) botao.innerHTML = '<a id="btn-tema" class="btn-tema"><img src="./imgs/buttons/button_temaclaro.svg">';
    document.querySelectorAll("img.personagem").forEach(img => {
      const baseSrc = img.getAttribute("src").replace("_modoclaro", "");
      img.src = baseSrc.replace(/(\.[a-z]+)$/i, "_modoclaro$1");
    });
  } else {
    body.classList.remove("tema-claro");
    if (botao) botao.innerHTML = '<a id="btn-tema" class="btn-tema"><img src="./imgs/buttons/button_temaescuro.svg">';
    document.querySelectorAll("img.personagem").forEach(img => {
      //adicionar sulfixo no nome da imagem para trocar para a personagem modo claro/modo escuro
      const baseSrc = img.getAttribute("src").replace("_modoclaro", "");
      img.src = baseSrc;
    });
  }
  localStorage.setItem("tema", tema);
}


//Carrega a preferência do tema escolhido pelo usuário (Tema escuro padrão)
document.addEventListener("DOMContentLoaded", () => {
  const temaSalvo = localStorage.getItem("tema") || "escuro";
  aplicarTema(temaSalvo);
  const botaoTema = document.getElementById("btn-tema");
  if (botaoTema) {
    botaoTema.addEventListener("click", () => {
      const temaAtual = document.body.classList.contains("tema-claro") ? "claro" : "escuro";
      aplicarTema(temaAtual === "claro" ? "escuro" : "claro");
    });
  }
});


