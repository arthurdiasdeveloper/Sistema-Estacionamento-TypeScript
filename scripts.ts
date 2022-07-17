// CONCEITO INTERFACE

interface Veiculo {
    nome: string;
    placa: string;
    entrada: Date | string;
    clientId?: string;

}

interface Pessoa  {
    nome: string;
    cpf: string;
}

//exemplo

interface Cliente extends Pessoa{
    veiculo: Veiculo[];
}

/* //exmplo
const cliente: Cliente */

//TIPANDO COM HTML

(function() {
    const $ = (query: string):HTMLInputElement | null => document.querySelector(query);

    function calcTempo(mil: number){
        const min = Math.floor(mil/60000);
        const  sec = Math.floor((mil % 60000) / 1000 );

        return `${min}m e ${sec} sec`;

    }

    function patio(){
        function ler(): Veiculo[]{
            // ler as informcao do patio que estao contidas no local storage. 
            // o local Storage salva em uma string, entao preciso converser com o parse para json
            //para ser lido pelo meu codigo
            return localStorage.patio ? JSON.parse(localStorage.patio) : []; 

        }
 
        //vou salvar as informacoes no patio
        // passei veiculos como parametro porque ele ira esperar veiculos
        //os veiculos é um array de todos os veiculos. Ele esta eperando um array da interface
        //veiculo.
        function salvar(veiculos: Veiculo[]){
            //quando o veiculo chegar aqui, irei pegar o localStorage
            //irei fazer um setItem. O JSON.stringify transforma em string para salvarmos
            localStorage.setItem("patio", JSON.stringify(veiculos));


        }



        function adicionar(veiculo: Veiculo & { cupom?: string}, salva?: boolean){
            const row = document.createElement("tr");

            row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${veiculo.entrada}</td>
            <td><button class="delete" data-placa="${veiculo.placa}">X</button></td>
         

            `;
            row.querySelector(".delete")?.addEventListener("click", function(){
                remover(this.dataset.placa);
            })

            $("#patio")?.appendChild(row);

            //se o salva for true, ele salva no banco de dados
            if(salva) salvar([...ler(), veiculo]);

            //nesse salvar, apos a concatenacao acima
            // eu vou salvar todos os antigos e ja vou salvar o novo também.

        }

        //esse metodo ficara responsavle por retirar o veiculo do patio
        //vamos aproveitar o row e adicionar um evento de esculta no delete
        //sempre que o botao for clicado buscarmos pela placa e remove-la
        function remover(placa: string){
            const { entrada, nome} = ler().find(veiculo => veiculo.placa ===placa );

            const tempo = calcTempo(  new Date().getTime() - new Date(entrada).getTime());

            if(!confirm(`O veiculo ${nome} permaneceu por ${tempo} Deseja encerrar?`)) return;

            salvar(ler().filter(veiculo => veiculo.placa !== placa));
            //para refazer todas as funcao da funcao render
            render()

        }
        
        function render(){
            //o ponto de exclamaçao fora o carregamento de patio 
            // fiz isso porque tenho certeza de que o patio existe.
            $("#patio")!.innerHTML = "";
            const patio = ler();
            if(patio.length){
                patio.forEach(veiculo => adicionar(veiculo));

            }

        }
        return { ler, adicionar, remover, salvar, render};
    }

    //toda vez que carregar o projeto na pagina web ira renderizar todos os aquivos salvos no localStorage
    //ou seja "banco de dados ira enviar os arquivos para a tela".
    patio().render();
    //quando eu clicar em adicionar, aqui em cadastrar, ele chamara a funcao adicionar do patio
    //assim ele vai renderizar mais um row no index hmtl.
    $("#cadastrar")?.addEventListener("click", () => {
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;
        console.log({nome, placa});

        if(!nome || !placa){
            alert("OS campos nome e placa sao obrigatorios!");
            return;
        }
        console.log(Date())
        patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);

    });
})();