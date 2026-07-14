// Elementos da página
const form = document.getElementById("formMovimentacao");
const historico = document.getElementById("historico");

const saldo = document.getElementById("saldo");
const receitas = document.getElementById("receitas");
const despesas = document.getElementById("despesas");

const mensagemAuxiliar = document.getElementById("mensagemAuxiliar");


// Buscar dados salvos
let movimentacoes = JSON.parse(localStorage.getItem("movimentacoes")) || [];


// Quando abrir o site, carregar dados
mostrarMovimentacoes();


// Adicionar movimentação
form.addEventListener("submit", function(e){

    e.preventDefault();


    const tipo = document.getElementById("tipo").value;
    const categoria = document.getElementById("categoria").value;
    const descricao = document.getElementById("descricao").value;
    const valor = Number(document.getElementById("valor").value);
    const data = document.getElementById("data").value;


    if(descricao === "" || valor <= 0 || data === ""){

        alert("Preencha todos os campos corretamente.");
        return;

    }


    const novaMovimentacao = {

        id: Date.now(),

        tipo: tipo,

        categoria: categoria,

        descricao: descricao,

        valor: valor,

        data: data

    };


    movimentacoes.push(novaMovimentacao);


    salvarDados();


    mostrarMovimentacoes();


    form.reset();


});



// Mostrar movimentações na tabela

function mostrarMovimentacoes(){


    historico.innerHTML = "";


    let totalReceitas = 0;
    let totalDespesas = 0;



    movimentacoes.forEach(function(item){


        const linha = document.createElement("tr");


        linha.innerHTML = `

        <td>${item.tipo}</td>

        <td>${item.categoria}</td>

        <td>${item.descricao}</td>

        <td>R$ ${item.valor.toFixed(2)}</td>

        <td>${item.data}</td>

        <td>

        <button onclick="excluir(${item.id})">
        🗑️
        </button>

        </td>

        `;


        historico.appendChild(linha);



        if(item.tipo === "Receita"){

            totalReceitas += item.valor;

        }else{

            totalDespesas += item.valor;

        }


    });



    atualizarCards(totalReceitas,totalDespesas);


    atualizarMensagem(totalReceitas,totalDespesas);



}



// Atualizar valores dos cards

function atualizarCards(receita,despesa){


    receitas.innerHTML =
    `R$ ${receita.toFixed(2)}`;


    despesas.innerHTML =
    `R$ ${despesa.toFixed(2)}`;


    saldo.innerHTML =
    `R$ ${(receita-despesa).toFixed(2)}`;


}




// Salvar no navegador

function salvarDados(){

    localStorage.setItem(
        "movimentacoes",
        JSON.stringify(movimentacoes)
    );

}




// Excluir movimentação

function excluir(id){


    movimentacoes = movimentacoes.filter(function(item){

        return item.id !== id;

    });



    salvarDados();


    mostrarMovimentacoes();


}





// Mensagens do auxiliar

function atualizarMensagem(receita,despesa){


    const saldoAtual = receita - despesa;



    if(movimentacoes.length === 0){

        mensagemAuxiliar.innerHTML =
        "Adicione seus gastos para receber dicas.";

    }


    else if(saldoAtual < 0){


        mensagemAuxiliar.innerHTML =
        "⚠️ Atenção! Seus gastos estão maiores que suas receitas.";

    }


    else if(despesa > receita * 0.7){


        mensagemAuxiliar.innerHTML =
        "💡 Você já gastou uma grande parte da sua renda.";

    }


    else{


        mensagemAuxiliar.innerHTML =
        "🎉 Ótimo! Suas finanças estão equilibradas.";

    }


}



// Service Worker (preparação para virar app)

if("serviceWorker" in navigator){

    navigator.serviceWorker.register("service-worker.js")
    .then(function(){

        console.log("Aplicativo pronto!");

    });

}// Todo o seu código do sistema fica acima
// (adicionar gastos, LocalStorage, excluir, cálculos etc.)


// Ativar aplicativo PWA
if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker.register("service-worker.js")
        .then(() => {

            console.log("PWA instalado com sucesso!");

        })
        .catch((erro)=>{

            console.log("Erro no PWA:", erro);

        });

    });

}