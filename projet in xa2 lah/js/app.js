/* HRH COLLECTION - Client Site Application Engine */

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  activeCategory: 'Tous',
  activeGenderMode: 'All', // 'Femme', 'Homme', 'All'
  currentSearchQuery: '',

  init() {
    this.initHeroSlider();
    this.initParallaxBackground();
    this.renderProducts();
    this.updateCartUI();
    this.bindEvents();
    this.checkRouteHash();

    // Listen for hash changes (#admin, #homme, #femme, etc.)
    window.addEventListener('hashchange', () => this.checkRouteHash());
    window.addEventListener('hrh_cart_changed', () => this.updateCartUI());
    window.addEventListener('hrh_products_changed', () => this.renderProducts());
  },

  checkRouteHash() {
    const hash = window.location.hash;
    if (hash === '#admin' || hash === '#/admin-hrh-secure' || hash === '#admin-hrh-secure') {
      Admin.showAdminModal();
    } else if (hash === '#femme') {
      this.setGenderMode('Femme');
    } else if (hash === '#homme') {
      this.setGenderMode('Homme');
    } else if (hash === '#parfums') {
      this.setCategory('Parfums Femme');
    } else if (hash === '#promotions') {
      this.setCategory('Promo');
    }
  },

  // HERO SLIDER
  initHeroSlider() {
    const slides = document.querySelectorAll('.slide-item');
    if (!slides.length) return;
    let current = 0;

    setInterval(() => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 5000);
  },

  // DYNAMIC PARALLAX BACKGROUND (Petals for Femme, Canvas Grass for Homme)
  initParallaxBackground() {
    const container = document.getElementById('parallax-container');
    if (!container) return;

    this.renderPetals(container);
    this.initGrassCanvas(container);
  },

  renderPetals(container) {
    let petalsBox = document.getElementById('petals-box');
    if (!petalsBox) {
      petalsBox = document.createElement('div');
      petalsBox.id = 'petals-box';
      petalsBox.style.position = 'absolute';
      petalsBox.style.inset = '0';
      container.appendChild(petalsBox);
    }
    petalsBox.innerHTML = '';

    // Create 18 floating petals
    for (let i = 0; i < 18; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal';
      const size = Math.random() * 14 + 10;
      petal.style.width = size + 'px';
      petal.style.height = (size * 1.5) + 'px';
      petal.style.left = Math.random() * 100 + 'vw';
      petal.style.animationDuration = (Math.random() * 8 + 8) + 's';
      petal.style.animationDelay = (Math.random() * 5) + 's';
      petalsBox.appendChild(petal);
    }
  },

  initGrassCanvas(container) {
    let canvas = document.getElementById('homme-grass-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'homme-grass-canvas';
      container.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    let step = 0;
    const drawGrassGrid = () => {
      if (this.activeGenderMode !== 'Homme') {
        canvas.style.display = 'none';
        requestAnimationFrame(drawGrassGrid);
        return;
      }
      canvas.style.display = 'block';
      ctx.clearRect(0, 0, width, height);
      step += 0.02;

      ctx.strokeStyle = 'rgba(212, 175, 55, 0.12)';
      ctx.lineWidth = 1.2;

      // Draw dynamic glowing football pitch mesh / light wave
      const lines = 24;
      for (let i = 0; i < lines; i++) {
        ctx.beginPath();
        const y = (height / lines) * i;
        ctx.moveTo(0, y);
        for (let x = 0; x < width; x += 40) {
          const wave = Math.sin(x * 0.005 + step + i * 0.3) * 15;
          ctx.lineTo(x, y + wave);
        }
        ctx.stroke();
      }

      requestAnimationFrame(drawGrassGrid);
    };

    drawGrassGrid();
  },

  setGenderMode(gender) {
    this.activeGenderMode = gender;
    const petalsBox = document.getElementById('petals-box');
    const canvas = document.getElementById('homme-grass-canvas');

    if (gender === 'Femme') {
      if (petalsBox) petalsBox.style.display = 'block';
      if (canvas) canvas.style.display = 'none';
    } else if (gender === 'Homme') {
      if (petalsBox) petalsBox.style.display = 'none';
      if (canvas) canvas.style.display = 'block';
    } else {
      if (petalsBox) petalsBox.style.display = 'block';
      if (canvas) canvas.style.display = 'block';
    }

    this.renderProducts();
  },

  setCategory(cat) {
    this.activeCategory = cat;

    // Auto set gender mode background if category matches
    if (cat.includes('Femme') || cat === 'Maquillage' || cat === 'Soin Visage' || cat === 'Cheveux') {
      this.setGenderMode('Femme');
    } else if (cat.includes('Homme') || cat.includes('Foot') || cat.includes('Sport') || cat.includes('Chaussettes')) {
      this.setGenderMode('Homme');
    }

    // Update active filter button styling
    document.querySelectorAll('.filter-btn').forEach(btn => {
      if (btn.dataset.category === cat) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    this.renderProducts();

    // Smooth scroll to products section
    const sec = document.getElementById('catalog-section');
    if (sec) sec.scrollIntoView({ behavior: 'smooth' });
  },

  // RENDER PRODUCTS GRID
  renderProducts() {
    const grid = document.getElementById('products-grid-container');
    if (!grid) return;

    let products = Store.getProducts();

    // Filter by Category
    if (this.activeCategory && this.activeCategory !== 'Tous') {
      if (this.activeCategory === 'Promo') {
        products = products.filter(p => p.isPromo || p.promoPrice < p.price);
      } else {
        products = products.filter(p => p.category.toLowerCase().includes(this.activeCategory.toLowerCase()));
      }
    }

    // Filter by Gender Mode
    if (this.activeGenderMode !== 'All') {
      products = products.filter(p => p.gender === this.activeGenderMode);
    }

    // Filter by Search Query
    if (this.currentSearchQuery.trim() !== '') {
      const q = this.currentSearchQuery.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }

    if (products.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <i data-lucide="search-x" style="width: 48px; height: 48px; margin-bottom: 12px; color: var(--gold-main);"></i>
          <h3 class="font-serif" style="font-size: 1.3rem; margin-bottom: 8px;">Aucun produit trouvé</h3>
          <p style="font-size: 0.85rem;">Essayez un autre mot-clé ou modifiez la catégorie sélectionnée.</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    grid.innerHTML = products.map(product => {
      const isLowStock = product.stock > 0 && product.stock < 10;
      const isOutOfStock = product.stock <= 0;

      return `
        <div class="product-card">
          <div class="product-img-box" onclick="App.openProductModal('${product.id}')">
            <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
            ${isOutOfStock ? `<span class="badge-stock" style="background:#444;">Épuisé</span>` : 
              isLowStock ? `<span class="badge-stock">Il ne reste que ${product.stock}</span>` : ''}
            ${product.promoPrice ? `<span class="badge-promo">PROMO</span>` : ''}
          </div>
          
          <div class="product-details">
            <span class="product-category">${product.category}</span>
            <h4 class="product-name" onclick="App.openProductModal('${product.id}')">${product.name}</h4>
            
            <div class="product-rating">
              <i data-lucide="star" style="fill: var(--gold-main); width: 14px; height: 14px;"></i>
              <span>${product.rating.toFixed(1)} (${product.reviewsCount})</span>
            </div>

            <div class="product-price-row">
              <span class="price-promo">${product.promoPrice || product.price} DH</span>
              ${product.promoPrice ? `<span class="price-original">${product.price} DH</span>` : ''}
            </div>

            <button class="btn-add-cart" ${isOutOfStock ? 'disabled style="opacity: 0.5;"' : ''} onclick="App.addToCart('${product.id}')">
              <i data-lucide="shopping-bag" style="width: 16px; height: 16px;"></i>
              ${isOutOfStock ? 'Épuisé' : 'Ajouter Au Panier'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    lucide.createIcons();
  },

  // PRODUCT DETAIL MODAL
  openProductModal(productId) {
    const product = Store.getProductById(productId);
    if (!product) return;

    const modal = document.getElementById('product-modal');
    const body = document.getElementById('product-modal-body');

    body.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px;">
        <div>
          <img src="${product.images[0]}" id="main-product-img" style="width: 100%; aspect-ratio: 1/1; object-fit: cover; border-radius: 6px; border: 1px solid var(--border-gold);" alt="${product.name}">
          ${product.images.length > 1 ? `
            <div style="display: flex; gap: 10px; margin-top: 12px;">
              ${product.images.map((img, i) => `
                <img src="${img}" onclick="document.getElementById('main-product-img').src='${img}'" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-gold); cursor: pointer;">
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div>
          <span style="font-size: 0.75rem; letter-spacing: 2px; color: var(--gold-main); text-transform: uppercase;">${product.category}</span>
          <h2 class="font-serif" style="font-size: 1.6rem; margin: 6px 0 12px 0;">${product.name}</h2>
          
          <div style="display: flex; align-items: center; gap: 8px; color: var(--gold-main); margin-bottom: 16px; font-size: 0.85rem;">
            <i data-lucide="star" style="fill: var(--gold-main); width: 16px;"></i>
            <span>${product.rating.toFixed(1)} (${product.reviewsCount} avis vérifiés)</span>
          </div>

          <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 18px;">
            <span style="font-family: var(--font-serif); font-size: 1.8rem; font-weight: 700; color: #FFF;">${product.promoPrice || product.price} DH</span>
            ${product.promoPrice ? `<span style="font-size: 1rem; text-decoration: line-through; color: var(--text-muted);">${product.price} DH</span>` : ''}
          </div>

          <div style="margin-bottom: 20px; font-size: 0.85rem; color: #BBB; line-height: 1.6;">
            ${product.description}
          </div>

          <div style="background: rgba(212, 175, 55, 0.1); border: 1px solid var(--border-gold); padding: 12px; border-radius: 4px; margin-bottom: 20px; font-size: 0.8rem; color: var(--gold-light);">
            <i data-lucide="shield-check" style="width: 16px; vertical-align: middle; margin-right: 6px;"></i>
            Produit 100% Authentique & Certifié HRH Collection | Stock restant : <strong>${product.stock} unités</strong>
          </div>

          <div style="display: flex; gap: 12px;">
            <button class="btn-gold" style="flex: 1; justify-content: center;" onclick="App.addToCart('${product.id}'); App.closeModal('product-modal'); App.toggleCart(true);">
              <i data-lucide="shopping-bag"></i> Commander Maintenant
            </button>
            <a href="https://wa.me/${App.getWhatsAppPhone()}?text=Bonjour%20HRH%20Collection,%20je%20souhaite%20commander%20:%20${encodeURIComponent(product.name)}" target="_blank" class="btn-outline-gold" style="padding: 14px 18px; border-color: #25D366; color: #25D366;">
              <i data-lucide="message-circle"></i> WhatsApp
            </a>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
    lucide.createIcons();
  },

  closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('active');
  },

  // CART DRAWER ACTIONS
  addToCart(productId, qty = 1) {
    Store.addToCart(productId, qty);
    this.showNotification("Produit ajouté à votre panier d'exception.");
  },

  toggleCart(open = null) {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) return;
    if (open === true) {
      drawer.classList.add('active');
    } else if (open === false) {
      drawer.classList.remove('active');
    } else {
      drawer.classList.toggle('active');
    }
  },

  updateCartUI() {
    const cart = Store.getCart();
    const badge = document.getElementById('cart-badge-count');
    const body = document.getElementById('cart-drawer-body');
    const footer = document.getElementById('cart-drawer-footer');

    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    if (badge) badge.innerText = totalQty;

    if (cart.length === 0) {
      if (body) {
        body.innerHTML = `
          <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
            <i data-lucide="shopping-bag" style="width: 48px; height: 48px; margin-bottom: 12px; color: var(--gold-main);"></i>
            <p class="font-serif" style="font-size: 1.1rem; color: #FFF; margin-bottom: 6px;">Votre panier est vide</p>
            <p style="font-size: 0.8rem;">Découvrez nos pièces de haute couture et accessoires d'exception.</p>
          </div>
        `;
      }
      if (footer) footer.style.display = 'none';
      lucide.createIcons();
      return;
    }

    if (footer) footer.style.display = 'block';

    let totalSum = 0;
    if (body) {
      body.innerHTML = cart.map(item => {
        const product = Store.getProductById(item.productId);
        if (!product) return '';
        const price = product.promoPrice || product.price;
        const subtotal = price * item.qty;
        totalSum += subtotal;

        return `
          <div class="cart-item">
            <img src="${product.images[0]}" alt="${product.name}">
            <div style="flex-grow: 1;">
              <h5 style="font-family: var(--font-serif); font-size: 0.9rem; margin-bottom: 4px;">${product.name}</h5>
              <div style="font-size: 0.8rem; color: var(--gold-main); margin-bottom: 8px;">${price} DH x ${item.qty} = <strong>${subtotal} DH</strong></div>
              
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="display: flex; align-items: center; border: 1px solid var(--border-gold); border-radius: 4px; overflow: hidden;">
                  <button onclick="Store.updateCartQty('${product.id}', ${item.qty - 1})" style="background: transparent; border: none; color: #FFF; padding: 2px 8px; cursor: pointer;">-</button>
                  <span style="padding: 2px 8px; font-size: 0.8rem; background: rgba(255,255,255,0.05);">${item.qty}</span>
                  <button onclick="Store.updateCartQty('${product.id}', ${item.qty + 1})" style="background: transparent; border: none; color: #FFF; padding: 2px 8px; cursor: pointer;">+</button>
                </div>

                <button onclick="Store.removeFromCart('${product.id}')" style="background: transparent; border: none; color: #777; cursor: pointer;" title="Supprimer">
                  <i data-lucide="trash-2" style="width: 16px;"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    const totalEl = document.getElementById('cart-total-amount');
    if (totalEl) totalEl.innerText = totalSum + ' DH';

    lucide.createIcons();
  },

  // CHECKOUT MODAL
  openCheckoutModal() {
    this.toggleCart(false);
    const modal = document.getElementById('checkout-modal');
    if (modal) {
      const cart = Store.getCart();
      let totalSum = 0;
      cart.forEach(item => {
        const prod = Store.getProductById(item.productId);
        if (prod) {
          totalSum += (prod.promoPrice || prod.price) * item.qty;
        }
      });
      const summaryEl = document.getElementById('checkout-summary-total');
      if (summaryEl) summaryEl.innerText = totalSum + ' DH';
      modal.classList.add('active');
    }
  },

  handleCityChange(cityVal) {
    const group = document.getElementById('custom-city-group');
    const input = document.getElementById('checkout-custom-city');
    if (cityVal === 'Autre Ville') {
      if (group) group.style.display = 'block';
      if (input) {
        input.required = true;
        input.focus();
      }
    } else {
      if (group) group.style.display = 'none';
      if (input) {
        input.required = false;
        input.value = '';
      }
    }
  },

  getWhatsAppPhone() {
    const s = Store.getSettings();
    let raw = (s && s.whatsappPhone) ? s.whatsappPhone : '0675786899';
    return raw.replace(/[^0-9]/g, '').replace(/^0/, '212');
  },

  getFormattedPhone() {
    const s = Store.getSettings();
    return (s && s.whatsappPhone) ? s.whatsappPhone : '0675786899';
  },

  buildWhatsAppOrderMessage(order) {
    const itemsText = order.items.map(i => `• ${i.name} (x${i.qty}) - ${i.price * i.qty} DH`).join('%0A');
    
    const msg = `👑 *NOUVELLE COMMANDE HRH COLLECTION*%0A` +
      `----------------------------------------%0A` +
      `🆔 *N° Commande:* ${order.id}%0A` +
      `👤 *Client:* ${encodeURIComponent(order.customerName)}%0A` +
      `📞 *Téléphone:* ${encodeURIComponent(order.phone)}%0A` +
      `📍 *Ville:* ${encodeURIComponent(order.city)}%0A` +
      `🏠 *Adresse:* ${encodeURIComponent(order.address)}%0A%0A` +
      `📦 *PRODUITS COMMANDÉS:*%0A${itemsText}%0A%0A` +
      `💰 *TOTAL COMMANDE:* *${order.total} DH*%0A` +
      `💳 *Mode de Paiement:* Cash on Delivery (COD)%0A` +
      `----------------------------------------%0A` +
      `Merci de me confirmer la livraison de ma commande !`;

    return msg;
  },

  handleCheckoutSubmit(e) {
    e.preventDefault();
    const cart = Store.getCart();
    if (cart.length === 0) return;

    const name = document.getElementById('checkout-name').value;
    const phone = document.getElementById('checkout-phone').value;
    const address = document.getElementById('checkout-address').value;
    let city = document.getElementById('checkout-city').value;

    if (city === 'Autre Ville') {
      const customCity = document.getElementById('checkout-custom-city').value.trim();
      if (customCity) {
        city = customCity;
      }
    }

    const order = Store.createOrder({ name, phone, address, city }, cart);

    this.closeModal('checkout-modal');

    // Build WhatsApp direct URL with dynamic receiver phone
    const waText = this.buildWhatsAppOrderMessage(order);
    const waUrl = `https://wa.me/${this.getWhatsAppPhone()}?text=${waText}`;

    // Auto-open WhatsApp in new window/tab
    try {
      window.open(waUrl, '_blank');
    } catch (err) {
      console.log('Popup blocked, fall back to button link');
    }
    
    // Show order confirmation modal
    const confModal = document.getElementById('order-success-modal');
    const confBody = document.getElementById('order-success-body');
    
    if (confModal && confBody) {
      const itemsListHtml = order.items.map(i => `<li style="margin-bottom: 4px;">• <strong>${i.name}</strong> (x${i.qty}) — ${i.price * i.qty} DH</li>`).join('');

      confBody.innerHTML = `
        <div style="text-align: center; padding: 10px 0;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--gold-subtle); border: 1px solid var(--gold-main); color: var(--gold-main); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto;">
            <i data-lucide="check-circle-2" style="width: 36px; height: 36px;"></i>
          </div>
          <h3 class="font-serif" style="font-size: 1.5rem; margin-bottom: 6px;">Commande Confirmée !</h3>
          <p style="font-size: 0.9rem; color: var(--gold-light); margin-bottom: 14px;">Numéro de commande : <strong>${order.id}</strong></p>

          <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-gold); padding: 14px; border-radius: 6px; text-align: left; margin-bottom: 20px; font-size: 0.85rem; color: #DDD;">
            <div style="margin-bottom: 6px;"><strong>Client :</strong> ${order.customerName} (${order.phone})</div>
            <div style="margin-bottom: 6px;"><strong>Livraison :</strong> ${order.address}, <strong>${order.city}</strong></div>
            <div style="margin-bottom: 10px;"><strong>Total :</strong> <span class="gold-text" style="font-size: 1.1rem; font-weight: 700;">${order.total} DH</span> (Paiement à la livraison)</div>
            <div style="font-size: 0.8rem; color: #AAA; margin-bottom: 4px;"><strong>Articles commandés :</strong></div>
            <ul style="list-style: none; padding-left: 0; font-size: 0.8rem; color: var(--gold-light);">
              ${itemsListHtml}
            </ul>
          </div>

          <p style="font-size: 0.85rem; color: #AAA; line-height: 1.5; margin-bottom: 20px;">
            La commande a été transmise à notre Espace Admin et sur WhatsApp. Notre service concierge vous contactera très rapidement.
          </p>

          <a href="${waUrl}" target="_blank" class="btn-gold" style="justify-content: center; width: 100%;">
            <i data-lucide="message-circle"></i> Envoyer / Ouvrir sur WhatsApp
          </a>
        </div>
      `;
      confModal.classList.add('active');
      lucide.createIcons();
    }
  },

  // NOTIFICATION TOAST
  showNotification(msg) {
    let toast = document.getElementById('hrh-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'hrh-toast';
      toast.style.position = 'fixed';
      toast.style.bottom = '30px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.background = 'rgba(15, 15, 15, 0.95)';
      toast.style.border = '1px solid var(--border-gold)';
      toast.style.color = 'var(--gold-light)';
      toast.style.padding = '12px 24px';
      toast.style.borderRadius = '30px';
      toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.8), 0 0 15px rgba(212,175,55,0.3)';
      toast.style.fontSize = '0.85rem';
      toast.style.letterSpacing = '1px';
      toast.style.zIndex = '300';
      toast.style.transition = 'all 0.3s ease';
      document.body.appendChild(toast);
    }

    toast.innerText = msg;
    toast.style.opacity = '1';
    toast.style.visibility = 'visible';

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.visibility = 'hidden';
    }, 3000);
  },

  // BIND EVENT LISTENERS
  bindEvents() {
    // Central Search Input Live Search
    const searchInput = document.getElementById('central-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentSearchQuery = e.target.value;
        this.renderProducts();
      });
    }

    // Checkout form submit
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => this.handleCheckoutSubmit(e));
    }
  }
};
