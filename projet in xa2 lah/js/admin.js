/* HRH COLLECTION - Secret Admin Suite / Mol Chi Engine */

const Admin = {
  chartInstance: null,

  init() {
    window.addEventListener('hrh_products_changed', () => {
      if (Store.isAdminAuthenticated()) this.renderProductsTable();
    });
    window.addEventListener('hrh_orders_changed', () => {
      if (Store.isAdminAuthenticated()) {
        this.renderStats();
        this.renderOrdersTable();
      }
    });
  },

  showAdminModal() {
    const modal = document.getElementById('admin-modal');
    if (!modal) return;

    modal.classList.add('active');

    if (!Store.isAdminAuthenticated()) {
      this.renderLoginScreen();
    } else {
      this.renderDashboard();
    }
  },

  renderLoginScreen() {
    const body = document.getElementById('admin-modal-body');
    if (!body) return;

    body.innerHTML = `
      <div style="max-width: 380px; margin: 40px auto; text-align: center;">
        <img src="assets/logo.jpg" alt="HRH Monogram" style="height: 70px; width: 70px; border-radius: 8px; border: 1px solid var(--border-gold); margin-bottom: 16px;">
        <h2 class="font-serif gold-text" style="font-size: 1.6rem; margin-bottom: 6px;">ESPACE MOL CHI</h2>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 24px; letter-spacing: 1px;">Accès Administrateur Sécurisé HRH COLLECTION</p>

        <form onsubmit="Admin.handleLogin(event)">
          <div class="form-group" style="text-align: left;">
            <label for="admin-username">Nom d'Utilisateur</label>
            <input type="text" id="admin-username" class="form-input" placeholder="ex: hrh2007" required style="font-size: 0.95rem;">
          </div>

          <div class="form-group" style="text-align: left;">
            <label for="admin-pin">Code PIN Secret</label>
            <input type="password" id="admin-pin" class="form-input" placeholder="••••" required style="text-align: center; letter-spacing: 4px; font-size: 1.2rem;">
          </div>
          
          <div id="login-error" style="color: #FF4D4D; font-size: 0.8rem; margin-bottom: 14px; display: none;">Nom d'utilisateur ou Code PIN incorrect.</div>

          <button type="submit" class="btn-gold" style="width: 100%; justify-content: center;">
            <i data-lucide="lock"></i> Déverrouiller Dashboard
          </button>
        </form>
      </div>
    `;
    lucide.createIcons();
  },

  handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('admin-username').value;
    const pin = document.getElementById('admin-pin').value;
    if (Store.loginAdmin(username, pin)) {
      this.renderDashboard();
    } else {
      const err = document.getElementById('login-error');
      if (err) err.style.display = 'block';
    }
  },

  logout() {
    Store.logoutAdmin();
    this.renderLoginScreen();
  },

  renderDashboard() {
    const body = document.getElementById('admin-modal-body');
    if (!body) return;

    body.innerHTML = `
      <div class="admin-container">
        <!-- Admin Header -->
        <div class="admin-header">
          <div>
            <h2 class="font-serif gold-text" style="font-size: 1.8rem;">DASHBOARD MOL CHI</h2>
            <span style="font-size: 0.75rem; color: var(--text-muted); letter-spacing: 1.5px; text-transform: uppercase;">HRH COLLECTION Admin Control Center</span>
          </div>

          <div style="display: flex; gap: 12px;">
            <button class="btn-gold" onclick="Admin.openAddProductModal()" style="font-size: 0.75rem; padding: 10px 16px;">
              <i data-lucide="plus-circle"></i> Ajouter Produit
            </button>
            <button class="btn-outline-gold" onclick="Admin.logout()" style="font-size: 0.75rem; padding: 10px 16px; border-color: #555; color: #AAA;">
              <i data-lucide="log-out"></i> Déconnexion
            </button>
          </div>
        </div>

        <!-- KPI Stats Cards -->
        <div class="stats-grid" id="admin-kpi-grid"></div>

        <!-- Visitor & Revenue Analytics Chart -->
        <div class="chart-box">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h4 class="font-serif" style="font-size: 1.1rem; color: var(--gold-light);">Statistiques des Visiteurs par Semaine & Mois</h4>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Mise à jour f temps réel</div>
          </div>
          <div style="position: relative; height: 260px; width: 100%;">
            <canvas id="admin-analytics-chart"></canvas>
          </div>
        </div>

        <!-- Products Management Table -->
        <div class="chart-box">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h4 class="font-serif" style="font-size: 1.1rem; color: var(--gold-light);">Gestion des Produits (Stock Live)</h4>
            <span style="font-size: 0.75rem; color: #FF4D4D;"><i data-lucide="alert-triangle" style="width: 14px; vertical-align: middle;"></i> Stock &lt; 5 en Alerte Rouge</span>
          </div>
          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Nom du Produit</th>
                  <th>Catégorie</th>
                  <th>Prix (DH)</th>
                  <th>Stock Restant</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="admin-products-table-body"></tbody>
            </table>
          </div>
        </div>

        <!-- Site Configuration & Control Total Box -->
        <div class="chart-box" style="border-color: var(--gold-main); background: rgba(20, 20, 20, 0.95);">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
            <i data-lucide="settings" style="color: var(--gold-main); width: 22px; height: 22px;"></i>
            <h4 class="font-serif gold-text" style="font-size: 1.2rem;">CONFIGURATION & CONTROL TOTAL DU SITE</h4>
          </div>
          <p style="font-size: 0.8rem; color: #AAA; margin-bottom: 20px;">Modifiez le numéro WhatsApp receveur des commandes, le nom de la boutique et les informations du site à tout moment.</p>

          <form onsubmit="Admin.saveSiteSettingsForm(event)">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
              <div class="form-group">
                <label for="admin-set-phone">📱 Numéro WhatsApp Récepteur de Commandes</label>
                <input type="text" id="admin-set-phone" class="form-input" required value="${Store.getSettings().whatsappPhone}" style="color: var(--gold-light); font-weight: 700; letter-spacing: 1px;">
              </div>

              <div class="form-group">
                <label for="admin-set-name">👑 Nom de la Boutique / Marque</label>
                <input type="text" id="admin-set-name" class="form-input" required value="${Store.getSettings().siteName}">
              </div>

              <div class="form-group">
                <label for="admin-set-address">📍 Adresse de la Boutique</label>
                <input type="text" id="admin-set-address" class="form-input" required value="${Store.getSettings().contactAddress}">
              </div>

              <div class="form-group">
                <label for="admin-set-email">✉️ Email de Contact</label>
                <input type="email" id="admin-set-email" class="form-input" required value="${Store.getSettings().contactEmail}">
              </div>
            </div>

            <button type="submit" class="btn-gold" style="font-size: 0.8rem; padding: 10px 24px; margin-top: 10px;">
              <i data-lucide="save"></i> Enregistrer la Configuration du Site
            </button>
          </form>
        </div>

        <!-- Orders Management Table -->
        <div class="chart-box">
          <h4 class="font-serif" style="font-size: 1.1rem; color: var(--gold-light); margin-bottom: 16px;">Commandes Clients Enregistrées</h4>
          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>N° Commande</th>
                  <th>Date</th>
                  <th>Client & Téléphone</th>
                  <th>Adresse & Ville</th>
                  <th>Produits Commandés</th>
                  <th>Total (DH)</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="admin-orders-table-body"></tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    this.renderStats();
    this.renderChart();
    this.renderProductsTable();
    this.renderOrdersTable();
    lucide.createIcons();
  },

  saveSiteSettingsForm(e) {
    e.preventDefault();
    const phone = document.getElementById('admin-set-phone').value.trim();
    const name = document.getElementById('admin-set-name').value.trim();
    const address = document.getElementById('admin-set-address').value.trim();
    const email = document.getElementById('admin-set-email').value.trim();

    Store.saveSettings({
      whatsappPhone: phone,
      siteName: name,
      contactAddress: address,
      contactEmail: email
    });

    App.showNotification("Configuration du site enregistrée avec succès !");
  },

  renderStats() {
    const grid = document.getElementById('admin-kpi-grid');
    if (!grid) return;

    const orders = Store.getOrders();
    const products = Store.getProducts();
    const stats = Store.getVisitorStats();

    const totalOrders = orders.length;
    const totalCA = orders.reduce((sum, o) => sum + o.total, 0);
    const lowStockCount = products.filter(p => p.stock < 5).length;

    grid.innerHTML = `
      <div class="stat-card">
        <div class="stat-icon"><i data-lucide="users"></i></div>
        <div>
          <div class="stat-val">${stats.totalVisits || 14500}</div>
          <div class="stat-lbl">Visiteurs Totaux</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon"><i data-lucide="shopping-cart"></i></div>
        <div>
          <div class="stat-val">${totalOrders}</div>
          <div class="stat-lbl">Commandes Totales</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon"><i data-lucide="circle-dollar-sign"></i></div>
        <div>
          <div class="stat-val">${totalCA} DH</div>
          <div class="stat-lbl">Chiffre d'Affaires (CA)</div>
        </div>
      </div>

      <div class="stat-card" style="${lowStockCount > 0 ? 'border-color: #FF4D4D;' : ''}">
        <div class="stat-icon" style="${lowStockCount > 0 ? 'background: rgba(230,57,70,0.2); color: #FF4D4D;' : ''}"><i data-lucide="package-warning"></i></div>
        <div>
          <div class="stat-val" style="${lowStockCount > 0 ? 'color: #FF4D4D;' : ''}">${lowStockCount}</div>
          <div class="stat-lbl">Alerte Stock (&lt; 5)</div>
        </div>
      </div>
    `;
    lucide.createIcons();
  },

  renderChart() {
    const canvas = document.getElementById('admin-analytics-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (this.chartInstance) this.chartInstance.destroy();

    const stats = Store.getVisitorStats();
    const weeklyData = stats.weeklyVisitors || [120, 185, 240, 310, 290, 450, 520];

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        datasets: [{
          label: 'Visiteurs de la Semaine',
          data: weeklyData,
          borderColor: '#D4AF37',
          backgroundColor: 'rgba(212, 175, 55, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#F3E5AB'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#FFF' } }
        },
        scales: {
          x: { ticks: { color: '#888' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#888' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  },

  renderProductsTable() {
    const tbody = document.getElementById('admin-products-table-body');
    if (!tbody) return;

    const products = Store.getProducts();

    tbody.innerHTML = products.map(p => {
      const isRedAlert = p.stock < 5;

      return `
        <tr>
          <td><img src="${p.images[0]}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-gold);" alt="${p.name}"></td>
          <td><strong>${p.name}</strong></td>
          <td><span style="color: var(--gold-main); font-size: 0.8rem;">${p.category}</span></td>
          <td>${p.promoPrice ? `<strong style="color: #FFF;">${p.promoPrice} DH</strong> <span style="text-decoration: line-through; font-size: 0.75rem; color:#777;">${p.price} DH</span>` : `${p.price} DH`}</td>
          <td>
            ${isRedAlert ? `<span class="alert-red"><i data-lucide="alert-circle" style="width: 12px; vertical-align: middle;"></i> ${p.stock} restant(s)</span>` : `<span style="color: #4E5;">${p.stock} unités</span>`}
          </td>
          <td>
            <div style="display: flex; gap: 8px;">
              <button onclick="Admin.openEditProductModal('${p.id}')" style="background: transparent; border: 1px solid var(--border-gold); color: var(--gold-light); padding: 4px 8px; border-radius: 3px; cursor: pointer;" title="Modifier">
                <i data-lucide="edit-3" style="width: 14px;"></i>
              </button>
              <button onclick="Admin.deleteProduct('${p.id}')" style="background: transparent; border: 1px solid rgba(230,57,70,0.5); color: #FF4D4D; padding: 4px 8px; border-radius: 3px; cursor: pointer;" title="Supprimer">
                <i data-lucide="trash-2" style="width: 14px;"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    lucide.createIcons();
  },

  renderOrdersTable() {
    const tbody = document.getElementById('admin-orders-table-body');
    if (!tbody) return;

    const orders = Store.getOrders();

    tbody.innerHTML = orders.map(o => {
      const itemsHtml = o.items.map(i => `<div style="font-size: 0.78rem; color: var(--gold-light); margin-bottom: 2px;">• <strong>${i.name}</strong> (x${i.qty}) — ${i.price * i.qty} DH</div>`).join('');

      const cleanPhone = o.phone ? o.phone.replace(/[^0-9]/g, '').replace(/^0/, '212') : '';
      const waMsg = encodeURIComponent(
        `Bonjour ${o.customerName}, concernant votre commande HRH ${o.id} (${o.total} DH) à destination de ${o.city} (${o.address})...`
      );
      const waUrl = `https://wa.me/${cleanPhone}?text=${waMsg}`;

      return `
        <tr>
          <td>
            <strong style="color: var(--gold-main); font-family: var(--font-serif);">${o.id}</strong>
          </td>
          <td style="font-size: 0.75rem; color: #888;">${o.date}</td>
          <td>
            <div><strong style="color: #FFF;">${o.customerName}</strong></div>
            <a href="tel:${o.phone}" style="font-size: 0.8rem; color: var(--gold-light); text-decoration: none;">${o.phone}</a>
          </td>
          <td>
            <div style="font-size: 0.85rem; color: #EEE;">${o.address}</div>
            <span style="font-size: 0.75rem; background: rgba(212,175,55,0.15); color: var(--gold-main); padding: 2px 6px; border-radius: 4px; border: 1px solid var(--border-gold);">${o.city}</span>
          </td>
          <td style="max-width: 250px;">
            ${itemsHtml}
          </td>
          <td><strong style="font-size: 1rem; color: #FFF; font-family: var(--font-serif);">${o.total} DH</strong></td>
          <td>
            <select class="form-select" onchange="Store.updateOrderStatus('${o.id}', this.value)" style="padding: 4px 8px; font-size: 0.75rem; background: #161616;">
              <option value="Nouvelle" ${o.status === 'Nouvelle' ? 'selected' : ''}>🔵 Nouvelle</option>
              <option value="En cours" ${o.status === 'En cours' ? 'selected' : ''}>🟠 En cours</option>
              <option value="Livrée" ${o.status === 'Livrée' ? 'selected' : ''}>🟢 Livrée</option>
            </select>
          </td>
          <td>
            <a href="${waUrl}" target="_blank" class="btn-gold" style="padding: 6px 12px; font-size: 0.72rem; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
              <i data-lucide="message-circle" style="width: 14px;"></i> Contacter
            </a>
          </td>
        </tr>
      `;
    }).join('');

    lucide.createIcons();
  },

  // ADD / EDIT PRODUCT MODAL
  openAddProductModal() {
    this.openProductFormModal();
  },

  openEditProductModal(productId) {
    const product = Store.getProductById(productId);
    if (product) this.openProductFormModal(product);
  },

  openProductFormModal(product = null) {
    const modal = document.getElementById('product-form-modal');
    const title = document.getElementById('product-form-title');
    const form = document.getElementById('product-crud-form');

    if (!modal || !form) return;

    title.innerText = product ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit Luxe';

    form.innerHTML = `
      <input type="hidden" id="form-prod-id" value="${product ? product.id : ''}">
      
      <div class="form-group">
        <label>Nom du Produit (FR)</label>
        <input type="text" id="form-prod-name" class="form-input" required value="${product ? product.name : ''}" placeholder="ex: HRH Royal Rose Imperiale">
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label>Catégorie</label>
          <select id="form-prod-category" class="form-select">
            <option value="Parfums Femme" ${product && product.category === 'Parfums Femme' ? 'selected' : ''}>Parfums Femme</option>
            <option value="Parfums Homme" ${product && product.category === 'Parfums Homme' ? 'selected' : ''}>Parfums Homme</option>
            <option value="Maquillage" ${product && product.category === 'Maquillage' ? 'selected' : ''}>Femme - Maquillage</option>
            <option value="Soin Visage" ${product && product.category === 'Soin Visage' ? 'selected' : ''}>Femme - Soin Visage</option>
            <option value="Cheveux" ${product && product.category === 'Cheveux' ? 'selected' : ''}>Femme - Cheveux</option>
            <option value="Chaussettes Foot" ${product && product.category === 'Chaussettes Foot' ? 'selected' : ''}>Homme - Chaussettes Foot</option>
            <option value="Bandeaux Cheveux Sport" ${product && product.category === 'Bandeaux Cheveux Sport' ? 'selected' : ''}>Homme - Bandeaux Sport</option>
            <option value="Accessoires Football" ${product && product.category === 'Accessoires Football' ? 'selected' : ''}>Homme - Accessoires Football</option>
          </select>
        </div>

        <div class="form-group">
          <label>Genre</label>
          <select id="form-prod-gender" class="form-select">
            <option value="Femme" ${product && product.gender === 'Femme' ? 'selected' : ''}>Femme</option>
            <option value="Homme" ${product && product.gender === 'Homme' ? 'selected' : ''}>Homme</option>
          </select>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label>Prix Initial (DH)</label>
          <input type="number" id="form-prod-price" class="form-input" required value="${product ? product.price : ''}">
        </div>

        <div class="form-group">
          <label>Prix Promo (DH)</label>
          <input type="number" id="form-prod-promo" class="form-input" value="${product && product.promoPrice ? product.promoPrice : ''}" placeholder="Optionnel">
        </div>

        <div class="form-group">
          <label>Stock Initial</label>
          <input type="number" id="form-prod-stock" class="form-input" required value="${product ? product.stock : 10}">
        </div>
      </div>

      <div class="form-group">
        <label>URL Photos (séparées par une virgule)</label>
        <input type="text" id="form-prod-images" class="form-input" required value="${product ? product.images.join(', ') : ''}" placeholder="https://image1.jpg, https://image2.jpg">
      </div>

      <div class="form-group">
        <label>Description Complète</label>
        <textarea id="form-prod-desc" class="form-textarea" rows="3" required placeholder="Description haute couture du produit...">${product ? product.description : ''}</textarea>
      </div>

      <button type="submit" class="btn-gold" style="width: 100%; justify-content: center; margin-top: 10px;">
        <i data-lucide="check"></i> ${product ? 'Enregistrer les Modifications' : 'Créer le Produit'}
      </button>
    `;

    modal.classList.add('active');
    lucide.createIcons();
  },

  handleProductFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('form-prod-id').value;
    const name = document.getElementById('form-prod-name').value;
    const category = document.getElementById('form-prod-category').value;
    const gender = document.getElementById('form-prod-gender').value;
    const price = parseFloat(document.getElementById('form-prod-price').value);
    const promoVal = document.getElementById('form-prod-promo').value;
    const promoPrice = promoVal ? parseFloat(promoVal) : null;
    const stock = parseInt(document.getElementById('form-prod-stock').value, 10);
    const imagesStr = document.getElementById('form-prod-images').value;
    const images = imagesStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const description = document.getElementById('form-prod-desc').value;

    const data = {
      name, category, gender, price, promoPrice, stock, images, description,
      isPromo: promoPrice ? true : false
    };

    if (id) {
      Store.updateProduct(id, data);
    } else {
      Store.addProduct(data);
    }

    App.closeModal('product-form-modal');
    this.renderProductsTable();
    this.renderStats();
  },

  deleteProduct(id) {
    if (confirm("Êtes-vous sûr de vouloir supprimer définitivement ce produit du catalogue ?")) {
      Store.deleteProduct(id);
      this.renderProductsTable();
      this.renderStats();
    }
  }
};

// Initialize Admin engine
Admin.init();
