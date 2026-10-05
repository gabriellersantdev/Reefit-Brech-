// Funções para gerenciar o localStorage
function getCart() {
  return JSON.parse(localStorage.getItem('brecho_cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('brecho_cart', JSON.stringify(cart));
  updateCartBadge();
}

// Atualiza o contador de itens no cabeçalho
function updateCartBadge() {
  const cart = getCart();
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.innerText = totalCount;
  });
}

// Adiciona um produto e redireciona para a sacola
function addToCart(product) {
  let cart = getCart();
  const existingItemIndex = cart.findIndex(item => item.id === product.id);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  window.location.href = 'sacola.html';
}

// Altera quantidade no carrinho
function changeQuantity(id, delta) {
  let cart = getCart();
  const item = cart.find(item => item.id === id);

  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(item => item.id !== id);
    }
  }

  saveCart(cart);
  renderCartPage();
}

// Remove item do carrinho
function removeItem(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  renderCartPage();
}

// Renderiza os produtos na página da sacola
function renderCartPage() {
  const container = document.getElementById('cartItemsContainer');
  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="padding: 2rem; text-align: center; background: #fff; border-radius: 8px;">
        <p style="font-size: 1.2rem; margin-bottom: 1rem;">Sua sacola está vazia.</p>
        <a href="index.html#catalogo" style="color: #1b2a4a; font-weight: bold; text-decoration: underline;">Voltar às compras</a>
      </div>
    `;
    document.getElementById('subtotalDisplay').innerText = 'R$ 0,00';
    document.getElementById('totalDisplay').innerText = 'R$ 0,00';
    return;
  }

  container.innerHTML = '';
  let subtotal = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    itemElement.innerHTML = `
      <div class="item-img">${item.img}</div>
      <div class="item-details">
        <h3>${item.name}</h3>
        <p class="item-tag">${item.tag}</p>
        <span class="item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
      </div>
      <div class="item-actions">
        <div class="quantity-control">
          <button class="qty-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
        </div>
        <button class="remove-btn" onclick="removeItem('${item.id}')">Remover</button>
      </div>
    `;
    container.appendChild(itemElement);
  });

  const formattedTotal = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
  document.getElementById('subtotalDisplay').innerText = formattedTotal;
  document.getElementById('totalDisplay').innerText = formattedTotal;
}

// Inicialização da página
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();

  // Scroll suave no banner da home
  const ctaBtn = document.getElementById('ctaBtn');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
      document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Eventos nos botões "Adicionar à Sacola" na Home
  const addButtons = document.querySelectorAll('.add-cart-btn');
  addButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const button = e.currentTarget;
      const product = {
        id: button.getAttribute('data-id'),
        name: button.getAttribute('data-name'),
        tag: button.getAttribute('data-tag'),
        price: parseFloat(button.getAttribute('data-price')),
        img: button.getAttribute('data-img')
      };
      addToCart(product);
    });
  });

  // Renderiza itens se estiver na página da sacola
  renderCartPage();
});