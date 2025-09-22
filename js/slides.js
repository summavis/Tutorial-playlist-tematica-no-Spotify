//Slides dinâmicos deixando apenas o essencial na página
const slides = [
    `<div class="content">
      <img class="personagem" src="./imgs/personagem/personagem_explicando.svg">
      <div>
        <h1>Passo 1: Defina o tema da playlist</h1>
        <p>Primeiramente vamos pensar em qual vai ser o tema dessa playlist.</p>
        <p><b>Sua playlist vai ser trilha sonora de quê?</b>
        <br>Uma festa na sala?
        <br>Um dia chuvoso com café?
        <br>Treino insano?
        <br>Uma viagem de carro cantando desafinado?</p>
        <p><b>Decidiu? Então vamos para o próximo passo.</b></p>
      </div>
    </div>`,
    `<div class="content">
        <img class="telaexemplo" alt="guia botões criar playlist" src="./imgs/exemplos/tela1_spotify.png">
        <img class="personagem sobrepor" src="./imgs/personagem/personagem_sentada.svg">
        <div>
            <h1>Passo 2: Começe escolhendo um nome</h1>      
            <p>Clique nos botões <b>"Criar"</b> e depois em <b>"Playlist"</b> como mostrado na imagem e então é hora de escolher o nome da playslist.</p>      
            <div class="coluna">
                <img alt="guia botões criar playlist" src="./imgs/exemplos/tela2_spotify.png">
                <div>
                    <p> Eu escolhi <b>"Minha Playslist :)"</b>, mas você pode colocar qualquer nome que combine com o tema que escolheu</p>
                    <br>
                    <p> Depois que escolher, basta clicar no botão <b>"Criar"</b>.
                </div>            
            </div>
            <p><br><b>Tudo bem até aqui? Então vamos para o próximo passo.</b></p>
        </div>
    </div>`,
    `<div class="content">
        <img class="telaexemplo" alt="guia botões criar playlist" src="./imgs/exemplos/tela3_spotify.png">
        <img class="personagem sobrepor" src="./imgs/personagem/personagem_sentada.svg">
        <div>
            <h1>Passo 3: Adicione as músicas na playlist</h1>      
            <p>Clique no botão <b>"+ Adicionar a esta playlist"</b> e depois utilize a busca para encontrar as músicas que quer adicionar usando o nome da música ou o nome do artista/banda.</p>  
            <p></p>
            <p><br><b>Tenho certeza que sua playlist está demais, vamos para as últimas informções?</b></p>
        </div>
    </div>`,
    `<div class="content">
        <img class="telaexemplo" alt="guia botões criar playlist" src="./imgs/exemplos/tela4_spotify.png">
        <img class="personagem sobrepor" src="./imgs/personagem/personagem_sentada.svg">
        <div>
            <h1>Passo 4: Gerenciar e compartilhar</h1>            
            <p><b>Na área destacada em verde</b> na imagem, você tem os botões para <b>baixar todas as músicas no aparelho</b> e ouvir até no meio do nada, sem internet. E se quiser mostrar seu bom gosto musical, tem também os botões para <b>compartilhar a playlist</b> com os amigos.</p>  
            <p><b>Na área em azul</b>, é possível <b>adicionar</b> mais músicas, <b>reorganizar ou remover</b> algumas, <b>classificar</b> por título, artista, álbum ou pela data que foi adicionada, além de <b>trocar o nome e a descrição</b> da playlist. Também há a opção do mixer, mas ela é mais avançada e ficará para outro tutorial.</p>
            <p><b>Agora que você aprendeu tudo sobre como criar uma playlist temática, que tal uns exercícios para gravar o conteúdo?</b></p>
        </div>
    </div>`
];
3
//Sistema de controle dos Slides
let slideAtual = 0;

function mostrarSlide(index) {
    const container = document.getElementById("slides-container");
    container.classList.remove("mostrar");

    setTimeout(() => {
        container.innerHTML = slides[index];
        container.classList.add("mostrar");
        document.getElementById("btn-prev").style.opacity = index === 0 ? 0 : 1;
        document.getElementById("btn-next").textContent = index === slides.length - 1 ? "Finalizar" : "Próximo";
    }, 200);

    // reaplicar tema
    setTimeout(() => {
        aplicarTema(localStorage.getItem("tema"));
    }, 200);

    // salvar progresso no localStorage para voltar no mesmo slide caso atualize a pagina
    localStorage.setItem("slideAtual", index);
}

// --- PRÉ-CARREGAMENTO DAS IMAGENS ---
const imagensParaPrecarregar = [
    "./imgs/exemplos/tela3_spotify.png",
    "./imgs/exemplos/tela4_spotify.png",
    "./imgs/exemplos/tela1_spotify.png",
    "./imgs/exemplos/tela2_spotify.png",
    "./imgs/personagem/personagem_explicando_modoclaro.svg",
    "./imgs/personagem/personagem_explicando.svg",
    "./imgs/personagem/personagem_sentada_modoclaro.svg",
    "./imgs/personagem/personagem_sentada.svg",
    "./imgs/buttons/button_temaescuro.svg",
    "./imgs/buttons/button_temaclaro.svg"
];

function preCarregarImagens(lista) {
    return Promise.all(
        lista.map(src => new Promise(resolve => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve;
            img.src = src;
        }))
    );
}

document.addEventListener("DOMContentLoaded", async () => {
    // mostra loading até terminar de carregar imagens
    await preCarregarImagens(imagensParaPrecarregar);

    // recuperar progresso
    const progressoSalvo = localStorage.getItem("slideAtual");
    slideAtual = progressoSalvo ? parseInt(progressoSalvo) : 0;

    // esconde loading e mostra slides
    document.getElementById("loading").style.display = "none";
    mostrarSlide(slideAtual);


    document.getElementById("btn-prev").addEventListener("click", () => {
        if (slideAtual > 0) {
            slideAtual--;
            mostrarSlide(slideAtual);
        }
    });

    document.getElementById("btn-next").addEventListener("click", () => {
        if (slideAtual < slides.length - 1) {
            slideAtual++;
            mostrarSlide(slideAtual);
        } else {
            // Final dos slides
            localStorage.setItem("explicacaoLida", "true");
            localStorage.removeItem("slideAtual"); // limpa o progresso ao finalizar
            document.querySelector(".slides-controles").style.display = "none";
            document.getElementById("btn-entendi").style.display = "block";
        }
    });

    document.getElementById("btn-entendi").addEventListener("click", () => {
        window.location.href = "exercicios.html";
    });
});
