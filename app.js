// Sandhu Mobile Accessories — shop logic (cart, search, categories, WhatsApp order)
const WHATSAPP = '923264953932';

const PRODUCTS = [
  { id: 1, name: 'M10 TWS Wireless Earbuds — Bluetooth, Charging Case', price: 999,  old: 1500, cat: 'earbuds',   img: 'earbuds.jpg',   rating: '★★★★★' },
  { id: 2, name: 'Fast Charging Data Cable — Type-C, Strong & Long',    price: 299,  old: 450,  cat: 'cable',     img: 'cable.jpg',     rating: '★★★★☆' },
  { id: 3, name: 'Fast Charger Adapter — Quick Charge Support',         price: 550,  old: 800,  cat: 'charger',   img: 'charger.jpg',   rating: '★★★★☆' },
  { id: 4, name: '9D Tempered Glass Protector — All Models',            price: 200,  old: 300,  cat: 'glass',     img: 'glass.jpg',     rating: '★★★★★' },
  { id: 5, name: 'Wired Handsfree — Clear Sound, Built-in Mic',         price: 350,  old: 500,  cat: 'handsfree', img: 'handsfree.jpg', rating: '★★★★☆' },
  { id: 6, name: 'Stylish Mobile Cover — Infinix, Samsung, Vivo, Redmi', price: 350, old: 500,  cat: 'cover',     img: 'cover.jpg',     rating: '★★★★☆' },
];

let cart = {}; // id -> qty
let activeCat = 'all';
let searchText = '';

function discount(p) { return Math.round((1 - p.price / p.old) * 100); }

function renderProducts() {
  const grid = document.getElementById('productGrid');
  const list = PRODUCTS.filter(p =>
    (activeCat === 'all' || p.cat === activeCat) &&
    p.name.toLowerCase().includes(searchText.toLowerCase())
  );
  document.getElementById('noResult').style.display = list.length ? 'none' : 'block';
  grid.innerHTML = list.map(p => `
    <div class="card">
      <span class="badge">-${discount(p)}%</span>
      <img src="${p.img}" alt="${p.name}">
      <div class="card-body">
        <h3>${p.name}</h3>
        <div><span class="price">Rs ${p.price}</span><span class="old-price">Rs ${p.old}</span></div>
        <div class="stars">${p.rating}</div>
        <div class="card-btns">
          <button class="buy-btn" onclick="buyNow(${p.id})">🛍️ Buy Now</button>
          <div class="btn-row">
            <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
            <a class="wa-btn" target="_blank" href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Assalamualaikum! Mujhe ye order karna hai: ' + p.name + ' — Rs ' + p.price)}">💬</a>
          </div>
        </div>
      </div>
    </div>`).join('');
}

function buyNow(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const msg = 'Assalamualaikum! Mujhe ye BUY karna hai:\n\n• ' + p.name.split('—')[0].trim() + ' — Rs ' + p.price + '\n\nTotal: Rs ' + p.price;
  window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg), '_blank');
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  updateCartUI();
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1500);
}

function changeQty(id, d) {
  cart[id] = (cart[id] || 0) + d;
  if (cart[id] <= 0) delete cart[id];
  updateCartUI();
}

function updateCartUI() {
  const ids = Object.keys(cart);
  const count = ids.reduce((s, id) => s + cart[id], 0);
  const total = ids.reduce((s, id) => s + cart[id] * PRODUCTS.find(p => p.id == id).price, 0);
  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartTotal').textContent = 'Rs ' + total;
  const box = document.getElementById('cartItems');
  if (!ids.length) { box.innerHTML = '<p class="empty-cart">Cart khaali hai.<br>Kuch add karein!</p>'; return; }
  box.innerHTML = ids.map(id => {
    const p = PRODUCTS.find(x => x.id == id);
    return `<div class="cart-item">
      <div><strong>${p.name.split('—')[0].trim()}</strong><br>Rs ${p.price} × ${cart[id]} = Rs ${p.price * cart[id]}</div>
      <div class="qty"><button onclick="changeQty(${id},-1)">−</button> <button onclick="changeQty(${id},1)">+</button></div>
    </div>`;
  }).join('');
}

function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('show');
}

function orderWhatsApp() {
  const ids = Object.keys(cart);
  if (!ids.length) { alert('Pehle cart mein kuch add karein.'); return; }
  let msg = 'Assalamualaikum! Mujhe ye order karna hai:\n';
  let total = 0;
  ids.forEach(id => {
    const p = PRODUCTS.find(x => x.id == id);
    msg += `\n• ${p.name.split('—')[0].trim()} — Rs ${p.price} × ${cart[id]} = Rs ${p.price * cart[id]}`;
    total += p.price * cart[id];
  });
  msg += `\n\nTotal: Rs ${total}`;
  window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg), '_blank');
}

function doSearch() {
  searchText = document.getElementById('searchInput').value;
  renderProducts();
}
document.getElementById('searchInput').addEventListener('input', doSearch);

document.querySelectorAll('.cat').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cat').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCat = btn.dataset.cat;
    renderProducts();
  });
});

renderProducts();
updateCartUI();
