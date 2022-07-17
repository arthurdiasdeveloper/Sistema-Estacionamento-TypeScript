(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTempo(mil) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);
        return `${min}m e ${sec} sec`;
    }
    function patio() {
        function ler() {
            // ler as informcao do patio que estao contidas no local storage. 
            // o local Storage salva em uma string, entao preciso converser com o parse para json
            //para ser lido pelo meu codigo
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        //vou salvar as informacoes no patio
        // passei veiculos como parametro porque ele ira esperar veiculos
        //os veiculos é um array de todos os veiculos. Ele esta eperando um array da interface
        //veiculo.
        function salvar(veiculos) {
            //quando o veiculo chegar aqui, irei pegar o localStorage
            //irei fazer um setItem. O JSON.stringify transforma em string para salvarmos
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }
        function adicionar(veiculo, salva) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${veiculo.entrada}</td>
            <td><button class="delete" data-placa="${veiculo.placa}">X</button></td>
         

            `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remover(this.dataset.placa);
            });
            (_b = $("#patio")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            //se o salva for true, ele salva no banco de dados
            if (salva)
                salvar([...ler(), veiculo]);
            //nesse salvar, apos a concatenacao acima
            // eu vou salvar todos os antigos e ja vou salvar o novo também.
        }
        //esse metodo ficara responsavle por retirar o veiculo do patio
        //vamos aproveitar o row e adicionar um evento de esculta no delete
        //sempre que o botao for clicado buscarmos pela placa e remove-la
        function remover(placa) {
            const { entrada, nome } = ler().find(veiculo => veiculo.placa === placa);
            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());
            if (!confirm(`O veiculo ${nome} permaneceu por ${tempo} Deseja encerrar?`))
                return;
            salvar(ler().filter(veiculo => veiculo.placa !== placa));
            //para refazer todas as funcao da funcao render
            render();
        }
        function render() {
            //o ponto de exclamaçao fora o carregamento de patio 
            // fiz isso porque tenho certeza de que o patio existe.
            $("#patio").innerHTML = "";
            const patio = ler();
            if (patio.length) {
                patio.forEach(veiculo => adicionar(veiculo));
            }
        }
        return { ler, adicionar, remover, salvar, render };
    }
    //toda vez que carregar o projeto na pagina web ira renderizar todos os aquivos salvos no localStorage
    //ou seja "banco de dados ira enviar os arquivos para a tela".
    patio().render();
    //quando eu clicar em adicionar, aqui em cadastrar, ele chamara a funcao adicionar do patio
    //assim ele vai renderizar mais um row no index hmtl.
    (_a = $("#cadastrar")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const nome = (_a = $("#nome")) === null || _a === void 0 ? void 0 : _a.value;
        const placa = (_b = $("#placa")) === null || _b === void 0 ? void 0 : _b.value;
        console.log({ nome, placa });
        if (!nome || !placa) {
            alert("OS campos nome e placa sao obrigatorios!");
            return;
        }
        console.log(Date());
        patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);
    });
})();
