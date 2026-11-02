/* HRH COLLECTION - Local Storage State Manager */

const STORAGE_KEYS = {
  PRODUCTS: 'hrh_products_v1',
  CART: 'hrh_cart_v1',
  ORDERS: 'hrh_orders_v1',
  STATS: 'hrh_stats_v1',
  SETTINGS: 'hrh_settings_v1',
  ADMIN_AUTH: 'hrh_admin_auth_v1'
};

const Store = {
  // Initialize state with default data if empty
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      const defaultSettings = {
        whatsappPhone: "0675786899",
        siteName: "HRH COLLECTION",
        contactAddress: "Triangle d'Or, Maarif, Casablanca",
        contactEmail: "contact@hrh-collection.ma"
      };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      const initialOrders = [
        {
          id: "ORD-9821",
          date: "2026-10-01 19:40",
          customerName: "Kharbouch Youssef",
          phone: "0661234567",
          address: "124 Boulevard d'Anfa, Maarif",
          city: "Casablanca",
          items: [
            { productId: "hrh-ph-01", name: "HRH Black Diamond Musk", price: 1490, qty: 1 }
          ],
          total: 1490,
          status: "Nouvelle"
        },
        {
          id: "ORD-9818",
          date: "2026-09-30 14:15",
          customerName: "Sofia Bennani",
          phone: "0668991122",
          address: "45 Avenue de France, Agdal",
          city: "Rabat",
          items: [
            { productId: "hrh-pf-01", name: "HRH Royal Rose Imperiale", price: 1390, qty: 1 },
            { productId: "hrh-fm-01", name: "HRH Poudre d'Or 24K", price: 650, qty: 1 }
          ],
          total: 2040,
          status: "En cours"
        },
        {
          id: "ORD-9805",
          date: "2026-09-29 11:00",
          customerName: "Amine El Amrani",
          phone: "0677553311",
          address: "Hivernage Rue des Palmiers",
          city: "Marrakech",
          items: [
            { productId: "hrh-hf-01", name: "HRH Pro Grip Socks Football Gold Edition", price: 249, qty: 2 }
          ],
          total: 498,
          status: "Livrée"
        }
      ];
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STATS)) {
      const initialStats = {
        weeklyVisitors: [120, 185, 240, 310, 290, 450, 520],
        monthlyVisitors: [2400, 3800, 5100, 6900, 8400, 11200, 14500],
        totalVisits: 14500
      };
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(initialStats));
    }
    this.recordVisitor();
  },

  // PRODUCTS API
  getProducts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
  },
  getProductById(id) {
    return this.getProducts().find(p => p.id === id);
  },
  saveProducts(products) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new Event('hrh_products_changed'));
  },
  addProduct(productData) {
    const products = this.getProducts();
    const newProduct = {
      id: 'hrh-' + Date.now().toString().slice(-6),
      rating: 5.0,
      reviewsCount: 1,
      isNew: true,
      ...productData
    };
    products.unshift(newProduct);
    this.saveProducts(products);
    return newProduct;
  },
  updateProduct(id, updatedData) {
    const products = this.getProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...updatedData };
      this.saveProducts(products);
    }
  },
  deleteProduct(id) {
    const products = this.getProducts().filter(p => p.id !== id);
    this.saveProducts(products);
  },
  decrementStock(productId, qty) {
    const products = this.getProducts();
    const p = products.find(prod => prod.id === productId);
    if (p) {
      p.stock = Math.max(0, p.stock - qty);
      this.saveProducts(products);
    }
  },

  // CART API
  getCart() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
  },
  saveCart(cart) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    window.dispatchEvent(new Event('hrh_cart_changed'));
  },
  addToCart(productId, qty = 1) {
    const cart = this.getCart();
    const existing = cart.find(item => item.productId === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ productId, qty });
    }
    this.saveCart(cart);
  },
  updateCartQty(productId, qty) {
    let cart = this.getCart();
    if (qty <= 0) {
      cart = cart.filter(item => item.productId !== productId);
    } else {
      const item = cart.find(i => i.productId === productId);
      if (item) item.qty = qty;
    }
    this.saveCart(cart);
  },
  removeFromCart(productId) {
    const cart = this.getCart().filter(item => item.productId !== productId);
    this.saveCart(cart);
  },
  clearCart() {
    this.saveCart([]);
  },

  // ORDERS API
  getOrders() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  },
  createOrder(customerDetails, cartItems) {
    const orders = this.getOrders();
    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').slice(0, 16);
    
    let orderTotal = 0;
    const itemsDetails = cartItems.map(item => {
      const prod = this.getProductById(item.productId);
      const price = prod ? (prod.promoPrice || prod.price) : 0;
      const subtotal = price * item.qty;
      orderTotal += subtotal;

      // INSTANT STOCK DECREMENT
      this.decrementStock(item.productId, item.qty);

      return {
        productId: item.productId,
        name: prod ? prod.name : 'Produit',
        price: price,
        qty: item.qty
      };
    });

    const newOrder = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      date: formattedDate,
      customerName: customerDetails.name,
      phone: customerDetails.phone,
      address: customerDetails.address,
      city: customerDetails.city || 'Casablanca',
      items: itemsDetails,
      total: orderTotal,
      status: 'Nouvelle'
    };

    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.clearCart();
    window.dispatchEvent(new Event('hrh_orders_changed'));
    return newOrder;
  },
  updateOrderStatus(orderId, newStatus) {
    const orders = this.getOrders();
    const ord = orders.find(o => o.id === orderId);
    if (ord) {
      ord.status = newStatus;
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      window.dispatchEvent(new Event('hrh_orders_changed'));
    }
  },

  // STATS API
  getVisitorStats() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STATS) || '{}');
  },
  recordVisitor() {
    const stats = this.getVisitorStats();
    if (stats.totalVisits) {
      stats.totalVisits += 1;
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    }
  },

  // ADMIN AUTH
  isAdminAuthenticated() {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  },
  loginAdmin(username, pin) {
    if ((username.trim().toLowerCase() === 'hrh2007' || username.trim().toLowerCase() === 'admin') && pin.trim() === '1902') {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  },
  logoutAdmin() {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  },

  // SETTINGS API
  getSettings() {
    const defaults = {
      whatsappPhone: "0675786899",
      siteName: "HRH COLLECTION",
      contactAddress: "Triangle d'Or, Maarif, Casablanca",
      contactEmail: "contact@hrh-collection.ma"
    };
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}');
      return { ...defaults, ...stored };
    } catch(e) {
      return defaults;
    }
  },
  saveSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    window.dispatchEvent(new Event('hrh_settings_changed'));
    return updated;
  }
};

// Auto Initialize
Store.init();
