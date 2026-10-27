
const produtos = [
    {
        id: 1,
        nome: "Fone Bluetooth Premium",
        preco: 199.90,
        categoria: "audio",
        imagem: "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/thumbnail.webp"
    },
    {
        id: 2,
        nome: "Mouse Gamer RGB",
        preco: 149.90,
        categoria: "perifericos",
        imagem: "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/thumbnail.webp"
    },
    {
        id: 3,
        nome: "Notebook Profissional",
        preco: 3499.90,
        categoria: "acessorios",
        imagem: "https://cdn.dummyjson.com/product-images/laptops/macbook-pro/thumbnail.webp"
    },
    {
        id: 4,
        nome: "Smartphone Premium",
        preco: 2299.90,
        categoria: "acessorios",
        imagem: "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/thumbnail.webp"
    }
];

const listaProdutos = document.getElementById("lista-produtos");
const pesquisa = document.getElementById("pesquisa");
const filtro = document.getElementById("filtro");
const contador = document.getElementById("contador");
const painel = document.getElementById("painel-carrinho");
const overlay = document.getElementById("overlay");
const itensCarrinho = document.getElementById("itens-carrinho");
const totalElemento = document.getElementById("total");

let carrinho = JSON.parse(localStorage.getItem("techstore_carrinho")) || [];

function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function mostrarProdutos() {
    const busca = pesquisa.value.toLowerCase();
    const categoria = filtro.value;

    const filtrados = produtos.filter(produto => {
        const correspondeBusca = produto.nome.toLowerCase().includes(busca);
        const correspondeCategoria =
            categoria === "todos" || produto.categoria === categoria;

        return correspondeBusca && correspondeCategoria;
    });

    listaProdutos.innerHTML = "";

    if (filtrados.length === 0) {
        listaProdutos.innerHTML =
            '<p class="mensagem-vazia">Nenhum produto encontrado.</p>';
        return;
    }

    filtrados.forEach(produto => {
        const card = document.createElement("div");
        card.className = "produto";

        card.innerHTML = `
            <div class="produto-imagem">
                <img src="${produto.imagem}" alt="${produto.nome}">
            </div>
            <div class="produto-info">
                <span class="categoria">${produto.categoria.toUpperCase()}</span>
                <h3>${produto.nome}</h3>
                <p class="preco">${formatarPreco(produto.preco)}</p>
                <button class="btn-comprar" data-id="${produto.id}">
                    Adicionar ao carrinho
                </button>
            </div>
        `;

        listaProdutos.appendChild(card);
    });
}

function salvarCarrinho() {
    localStorage.setItem("techstore_carrinho", JSON.stringify(carrinho));
}

function adicionarCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;

    const item = carrinho.find(p => p.id === id);

    if (item) {
        item.quantidade++;
    } else {
        carrinho.push({ id, quantidade: 1 });
    }

    salvarCarrinho();
    atualizarCarrinho();
    abrirCarrinho();
}

function alterarQuantidade(id, quantidade) {
    const item = carrinho.find(p => p.id === id);
    if (!item) return;

    item.quantidade += quantidade;

    if (item.quantidade <= 0) {
        carrinho = carrinho.filter(p => p.id !== id);
    }

    salvarCarrinho();
    atualizarCarrinho();
}

function atualizarCarrinho() {
    itensCarrinho.innerHTML = "";
    let total = 0;
    let quantidadeTotal = 0;

    carrinho.forEach(item => {
        const produto = produtos.find(p => p.id === item.id);
        if (!produto) return;

        total += produto.preco * item.quantidade;
        quantidadeTotal += item.quantidade;

        const div = document.createElement("div");
        div.className = "item-carrinho";

        div.innerHTML = `
            <strong>${produto.nome}</strong>
            <p>${formatarPreco(produto.preco)}</p>
            <button data-id="${produto.id}" data-acao="diminuir">−</button>
            <span>${item.quantidade}</span>
            <button data-id="${produto.id}" data-acao="aumentar">+</button>
        `;

        itensCarrinho.appendChild(div);
    });

    if (quantidadeTotal === 0) {
        itensCarrinho.innerHTML = "<p>Seu carrinho está vazio.</p>";
    }

    contador.textContent = quantidadeTotal;
    totalElemento.textContent = formatarPreco(total);
}

function abrirCarrinho() {
    painel.classList.add("ativo");
    overlay.classList.add("ativo");
}

function fecharCarrinho() {
    painel.classList.remove("ativo");
    overlay.classList.remove("ativo");
}

listaProdutos.addEventListener("click", event => {
    const botao = event.target.closest(".btn-comprar");

    if (botao) {
        adicionarCarrinho(Number(botao.dataset.id));
    }
});

itensCarrinho.addEventListener("click", event => {
    const botao = event.target.closest("button[data-acao]");
    if (!botao) return;

    const id = Number(botao.dataset.id);
    const quantidade = botao.dataset.acao === "aumentar" ? 1 : -1;

    alterarQuantidade(id, quantidade);
});

document.getElementById("botao-carrinho").addEventListener("click", abrirCarrinho);
document.getElementById("fechar-carrinho").addEventListener("click", fecharCarrinho);
overlay.addEventListener("click", fecharCarrinho);

pesquisa.addEventListener("input", mostrarProdutos);
filtro.addEventListener("change", mostrarProdutos);

document.getElementById("finalizar").addEventListener("click", () => {
    if (carrinho.length === 0) {
        alert("Adicione produtos ao carrinho primeiro.");
        return;
    }

    alert("Checkout demonstrativo. Pagamentos ainda não estão disponíveis.");
});

mostrarProdutos();
atualizarCarrinho();
