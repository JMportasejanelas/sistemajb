// Configuração do Firebase
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    databaseURL: "https://SEU_PROJETO-default-rtdb.firebaseio.com",
    projectId: "SEU_PROJETO",
    storageBucket: "SEU_PROJETO.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Variáveis globais
let currentUser = null;
let currentModule = 'dashboard';
let products = [];
let clients = [];
let suppliers = [];
let purchases = [];

// Sistema de autenticação local
const USERS = {
    'juan': {
        password: '9070',
        name: 'Juan',
        role: 'admin'
    }
};

// Inicialização do sistema
document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
    setupEventListeners();
    
    // Definir data atual no formulário de compras
    const today = new Date().toISOString().split('T')[0];
    const purchaseDate = document.getElementById('purchase-date');
    if (purchaseDate) {
        purchaseDate.value = today;
    }
});

function initializeSystem() {
    // Carregar dados do Firebase
    loadDataFromFirebase();
    
    // Verificar se já está logado
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainSystem();
    }
}

function setupEventListeners() {
    // Adicionar listeners para formulários
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    });
}

// Sistema de Login
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('login-error');
    
    if (USERS[username] && USERS[username].password === password) {
        currentUser = {
            username: username,
            name: USERS[username].name,
            role: USERS[username].role
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showMainSystem();
        showNotification('Bem-vindo, ' + currentUser.name + '!');
    } else {
        errorElement.textContent = 'Usuário ou senha incorretos';
        errorElement.classList.remove('hidden');
        
        setTimeout(() => {
            errorElement.classList.add('hidden');
        }, 3000);
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLoginScreen();
    showNotification('Você saiu do sistema');
}

function showLoginScreen() {
    document.getElementById('login-screen').classList.add('active');
    document.getElementById('main-system').classList.remove('active');
}

function showMainSystem() {
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('main-system').classList.add('active');
    
    // Atualizar informações do usuário
    if (currentUser) {
        document.getElementById('user-info').textContent = 'Usuário: ' + currentUser.name;
    }
    
    // Carregar dados iniciais
    loadDashboard();
}

// Sistema de Módulos
function showModule(moduleName) {
    // Esconder todos os módulos
    document.querySelectorAll('.module').forEach(module => {
        module.classList.remove('active');
    });
    
    // Remover classe active de todos os menus
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Mostrar módulo selecionado
    const module = document.getElementById(moduleName);
    if (module) {
        module.classList.add('active');
        currentModule = moduleName;
        
        // Adicionar classe active ao menu correspondente
        const menuItem = document.querySelector(`[onclick="showModule('${moduleName}')"]`);
        if (menuItem) {
            menuItem.classList.add('active');
        }
        
        // Carregar dados específicos do módulo
        loadModuleData(moduleName);
    }
}

function loadModuleData(moduleName) {
    switch(moduleName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'products':
            loadProducts();
            loadProductsTable();
            break;
        case 'clients':
            loadClients();
            loadClientsTable();
            break;
        case 'suppliers':
            loadSuppliers();
            loadSuppliersTable();
            break;
        case 'purchases':
            loadPurchases();
            loadPurchasesTable();
            loadPurchaseSelects();
            break;
        case 'costs':
            loadCosts();
            break;
        case 'pricing':
            loadPricing();
            break;
    }
}

// Firebase Functions
function loadDataFromFirebase() {
    // Carregar produtos
    database.ref('products').once('value').then(snapshot => {
        products = snapshot.val() || [];
        if (currentModule === 'products') {
            loadProductsTable();
        }
    });
    
    // Carregar clientes
    database.ref('clients').once('value').then(snapshot => {
        clients = snapshot.val() || [];
        if (currentModule === 'clients') {
            loadClientsTable();
        }
    });
    
    // Carregar fornecedores
    database.ref('suppliers').once('value').then(snapshot => {
        suppliers = snapshot.val() || [];
        if (currentModule === 'suppliers') {
            loadSuppliersTable();
        }
    });
    
    // Carregar compras
    database.ref('purchases').once('value').then(snapshot => {
        purchases = snapshot.val() || [];
        if (currentModule === 'purchases') {
            loadPurchasesTable();
        }
    });
}

function saveToFirebase(path, data) {
    database.ref(path).set(data);
}

// Dashboard
function loadDashboard() {
    document.getElementById('total-products').textContent = products.length;
    document.getElementById('total-clients').textContent = clients.length;
    document.getElementById('total-suppliers').textContent = suppliers.length;
    document.getElementById('total-purchases').textContent = purchases.length;
}

// Produtos
function loadProducts() {
    database.ref('products').once('value').then(snapshot => {
        products = snapshot.val() || [];
        loadProductsTable();
    });
}

function loadProductsTable() {
    const tbody = document.getElementById('products-list');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    products.forEach((product, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${product.code}</td>
            <td>${product.name}</td>
            <td>${getCategoryName(product.category)}</td>
            <td>${product.stock}</td>
            <td>${product.minStock}</td>
            <td>R$ ${parseFloat(product.price).toFixed(2)}</td>
            <td>
                <button class="btn-edit" onclick="editProduct(${index})">Editar</button>
                <button class="btn-delete" onclick="deleteProduct(${index})">Excluir</button>
            </td>
        `;
    });
}

function saveProduct(event) {
    event.preventDefault();
    
    const product = {
        code: document.getElementById('product-code').value,
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        stock: parseInt(document.getElementById('product-stock').value),
        minStock: parseInt(document.getElementById('product-min-stock').value),
        price: parseFloat(document.getElementById('product-price').value),
        createdAt: new Date().toISOString()
    };
    
    products.push(product);
    saveToFirebase('products', products);
    
    // Limpar formulário
    document.getElementById('product-form').reset();
    
    // Atualizar tabela
    loadProductsTable();
    
    showNotification('Produto cadastrado com sucesso!');
}

function editProduct(index) {
    const product = products[index];
    
    document.getElementById('product-code').value = product.code;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-min-stock').value = product.minStock;
    document.getElementById('product-price').value = product.price;
    
    // Remover produto antigo
    products.splice(index, 1);
    saveToFirebase('products', products);
    loadProductsTable();
}

function deleteProduct(index) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        products.splice(index, 1);
        saveToFirebase('products', products);
        loadProductsTable();
        showNotification('Produto excluído com sucesso!');
    }
}

function searchProducts() {
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    const tbody = document.getElementById('products-list');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.code.toLowerCase().includes(searchTerm)
    );
    
    filteredProducts.forEach((product, index) => {
        const originalIndex = products.indexOf(product);
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${product.code}</td>
            <td>${product.name}</td>
            <td>${getCategoryName(product.category)}</td>
            <td>${product.stock}</td>
            <td>${product.minStock}</td>
            <td>R$ ${parseFloat(product.price).toFixed(2)}</td>
            <td>
                <button class="btn-edit" onclick="editProduct(${originalIndex})">Editar</button>
                <button class="btn-delete" onclick="deleteProduct(${originalIndex})">Excluir</button>
            </td>
        `;
    });
}

// Clientes
function loadClients() {
    database.ref('clients').once('value').then(snapshot => {
        clients = snapshot.val() || [];
        loadClientsTable();
    });
}

function loadClientsTable() {
    const tbody = document.getElementById('clients-list');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    clients.forEach((client, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${client.name}</td>
            <td>${client.cpf}</td>
            <td>${client.email}</td>
            <td>${client.phone}</td>
            <td>${client.city}</td>
            <td>
                <button class="btn-edit" onclick="editClient(${index})">Editar</button>
                <button class="btn-delete" onclick="deleteClient(${index})">Excluir</button>
            </td>
        `;
    });
}

function saveClient(event) {
    event.preventDefault();
    
    const client = {
        name: document.getElementById('client-name').value,
        cpf: document.getElementById('client-cpf').value,
        email: document.getElementById('client-email').value,
        phone: document.getElementById('client-phone').value,
        address: document.getElementById('client-address').value,
        city: document.getElementById('client-city').value,
        createdAt: new Date().toISOString()
    };
    
    clients.push(client);
    saveToFirebase('clients', clients);
    
    // Limpar formulário
    document.getElementById('client-form').reset();
    
    // Atualizar tabela
    loadClientsTable();
    
    showNotification('Cliente cadastrado com sucesso!');
}

function editClient(index) {
    const client = clients[index];
    
    document.getElementById('client-name').value = client.name;
    document.getElementById('client-cpf').value = client.cpf;
    document.getElementById('client-email').value = client.email;
    document.getElementById('client-phone').value = client.phone;
    document.getElementById('client-address').value = client.address;
    document.getElementById('client-city').value = client.city;
    
    // Remover cliente antigo
    clients.splice(index, 1);
    saveToFirebase('clients', clients);
    loadClientsTable();
}

function deleteClient(index) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        clients.splice(index, 1);
        saveToFirebase('clients', clients);
        loadClientsTable();
        showNotification('Cliente excluído com sucesso!');
    }
}

function searchClients() {
    const searchTerm = document.getElementById('client-search').value.toLowerCase();
    const tbody = document.getElementById('clients-list');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const filteredClients = clients.filter(client => 
        client.name.toLowerCase().includes(searchTerm) ||
        client.cpf.toLowerCase().includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm)
    );
    
    filteredClients.forEach((client, index) => {
        const originalIndex = clients.indexOf(client);
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${client.name}</td>
            <td>${client.cpf}</td>
            <td>${client.email}</td>
            <td>${client.phone}</td>
            <td>${client.city}</td>
            <td>
                <button class="btn-edit" onclick="editClient(${originalIndex})">Editar</button>
                <button class="btn-delete" onclick="deleteClient(${originalIndex})">Excluir</button>
            </td>
        `;
    });
}

// Fornecedores
function loadSuppliers() {
    database.ref('suppliers').once('value').then(snapshot => {
        suppliers = snapshot.val() || [];
        loadSuppliersTable();
    });
}

function loadSuppliersTable() {
    const tbody = document.getElementById('suppliers-list');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    suppliers.forEach((supplier, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${supplier.name}</td>
            <td>${supplier.cnpj}</td>
            <td>${supplier.email}</td>
            <td>${supplier.phone}</td>
            <td>${getCategoryName(supplier.category)}</td>
            <td>
                <button class="btn-edit" onclick="editSupplier(${index})">Editar</button>
                <button class="btn-delete" onclick="deleteSupplier(${index})">Excluir</button>
            </td>
        `;
    });
}

function saveSupplier(event) {
    event.preventDefault();
    
    const supplier = {
        name: document.getElementById('supplier-name').value,
        cnpj: document.getElementById('supplier-cnpj').value,
        email: document.getElementById('supplier-email').value,
        phone: document.getElementById('supplier-phone').value,
        address: document.getElementById('supplier-address').value,
        category: document.getElementById('supplier-category').value,
        createdAt: new Date().toISOString()
    };
    
    suppliers.push(supplier);
    saveToFirebase('suppliers', suppliers);
    
    // Limpar formulário
    document.getElementById('supplier-form').reset();
    
    // Atualizar tabela
    loadSuppliersTable();
    
    showNotification('Fornecedor cadastrado com sucesso!');
}

function editSupplier(index) {
    const supplier = suppliers[index];
    
    document.getElementById('supplier-name').value = supplier.name;
    document.getElementById('supplier-cnpj').value = supplier.cnpj;
    document.getElementById('supplier-email').value = supplier.email;
    document.getElementById('supplier-phone').value = supplier.phone;
    document.getElementById('supplier-address').value = supplier.address;
    document.getElementById('supplier-category').value = supplier.category;
    
    // Remover fornecedor antigo
    suppliers.splice(index, 1);
    saveToFirebase('suppliers', suppliers);
    loadSuppliersTable();
}

function deleteSupplier(index) {
    if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
        suppliers.splice(index, 1);
        saveToFirebase('suppliers', suppliers);
        loadSuppliersTable();
        showNotification('Fornecedor excluído com sucesso!');
    }
}

function searchSuppliers() {
    const searchTerm = document.getElementById('supplier-search').value.toLowerCase();
    const tbody = document.getElementById('suppliers-list');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const filteredSuppliers = suppliers.filter(supplier => 
        supplier.name.toLowerCase().includes(searchTerm) ||
        supplier.cnpj.toLowerCase().includes(searchTerm) ||
        supplier.email.toLowerCase().includes(searchTerm)
    );
    
    filteredSuppliers.forEach((supplier, index) => {
        const originalIndex = suppliers.indexOf(supplier);
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${supplier.name}</td>
            <td>${supplier.cnpj}</td>
            <td>${supplier.email}</td>
            <td>${supplier.phone}</td>
            <td>${getCategoryName(supplier.category)}</td>
            <td>
                <button class="btn-edit" onclick="editSupplier(${originalIndex})">Editar</button>
                <button class="btn-delete" onclick="deleteSupplier(${originalIndex})">Excluir</button>
            </td>
        `;
    });
}

// Compras
function loadPurchases() {
    database.ref('purchases').once('value').then(snapshot => {
        purchases = snapshot.val() || [];
        loadPurchasesTable();
    });
}

function loadPurchasesTable() {
    const tbody = document.getElementById('purchases-list');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    purchases.forEach((purchase, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${formatDate(purchase.date)}</td>
            <td>${purchase.supplier}</td>
            <td>${purchase.product}</td>
            <td>${purchase.quantity}</td>
            <td>R$ ${parseFloat(purchase.unitPrice).toFixed(2)}</td>
            <td>R$ ${parseFloat(purchase.total).toFixed(2)}</td>
            <td>
                <button class="btn-delete" onclick="deletePurchase(${index})">Excluir</button>
            </td>
        `;
    });
}

function loadPurchaseSelects() {
    // Carregar fornecedores
    const supplierSelect = document.getElementById('purchase-supplier');
    if (supplierSelect) {
        supplierSelect.innerHTML = '<option value="">Selecione...</option>';
        suppliers.forEach(supplier => {
            supplierSelect.innerHTML += `<option value="${supplier.name}">${supplier.name}</option>`;
        });
    }
    
    // Carregar produtos
    const productSelect = document.getElementById('purchase-product');
    if (productSelect) {
        productSelect.innerHTML = '<option value="">Selecione...</option>';
        products.forEach(product => {
            productSelect.innerHTML += `<option value="${product.name}" data-price="${product.price}">${product.name}</option>`;
        });
    }
}

function savePurchase(event) {
    event.preventDefault();
    
    const purchase = {
        date: document.getElementById('purchase-date').value,
        supplier: document.getElementById('purchase-supplier').value,
        product: document.getElementById('purchase-product').value,
        quantity: parseInt(document.getElementById('purchase-quantity').value),
        unitPrice: parseFloat(document.getElementById('purchase-unit-price').value),
        total: parseFloat(document.getElementById('purchase-total').value),
        createdAt: new Date().toISOString()
    };
    
    purchases.push(purchase);
    saveToFirebase('purchases', purchases);
    
    // Atualizar estoque do produto
    updateProductStock(purchase.product, purchase.quantity);
    
    // Limpar formulário
    document.getElementById('purchase-form').reset();
    
    // Redefinir data atual
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('purchase-date').value = today;
    
    // Atualizar tabela
    loadPurchasesTable();
    
    showNotification('Compra registrada com sucesso!');
}

function updatePurchasePrice() {
    const productSelect = document.getElementById('purchase-product');
    const unitPriceInput = document.getElementById('purchase-unit-price');
    
    if (productSelect && unitPriceInput) {
        const selectedOption = productSelect.options[productSelect.selectedIndex];
        const price = selectedOption.getAttribute('data-price');
        
        if (price) {
            unitPriceInput.value = parseFloat(price).toFixed(2);
            updatePurchaseTotal();
        }
    }
}

function updatePurchaseTotal() {
    const quantity = parseFloat(document.getElementById('purchase-quantity').value) || 0;
    const unitPrice = parseFloat(document.getElementById('purchase-unit-price').value) || 0;
    const total = quantity * unitPrice;
    
    document.getElementById('purchase-total').value = total.toFixed(2);
}

function deletePurchase(index) {
    if (confirm('Tem certeza que deseja excluir esta compra?')) {
        const purchase = purchases[index];
        
        // Remover do estoque
        updateProductStock(purchase.product, -purchase.quantity);
        
        purchases.splice(index, 1);
        saveToFirebase('purchases', purchases);
        loadPurchasesTable();
        showNotification('Compra excluída com sucesso!');
    }
}

function searchPurchases() {
    const searchTerm = document.getElementById('purchase-search').value.toLowerCase();
    const tbody = document.getElementById('purchases-list');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const filteredPurchases = purchases.filter(purchase => 
        purchase.supplier.toLowerCase().includes(searchTerm) ||
        purchase.product.toLowerCase().includes(searchTerm)
    );
    
    filteredPurchases.forEach((purchase, index) => {
        const originalIndex = purchases.indexOf(purchase);
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${formatDate(purchase.date)}</td>
            <td>${purchase.supplier}</td>
            <td>${purchase.product}</td>
            <td>${purchase.quantity}</td>
            <td>R$ ${parseFloat(purchase.unitPrice).toFixed(2)}</td>
            <td>R$ ${parseFloat(purchase.total).toFixed(2)}</td>
            <td>
                <button class="btn-delete" onclick="deletePurchase(${originalIndex})">Excluir</button>
            </td>
        `;
    });
}

// Custos
function loadCosts() {
    const tbody = document.getElementById('costs-list');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    let totalCost = 0;
    
    products.forEach(product => {
        const productPurchases = purchases.filter(p => p.product === product.name);
        let lastPurchasePrice = 0;
        let averageCost = 0;
        
        if (productPurchases.length > 0) {
            lastPurchasePrice = productPurchases[productPurchases.length - 1].unitPrice;
            const totalQuantity = productPurchases.reduce((sum, p) => sum + p.quantity, 0);
            const totalValue = productPurchases.reduce((sum, p) => sum + p.total, 0);
            averageCost = totalValue / totalQuantity;
        }
        
        const totalProductCost = averageCost * product.stock;
        totalCost += totalProductCost;
        
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${product.name}</td>
            <td>R$ ${lastPurchasePrice.toFixed(2)}</td>
            <td>R$ ${averageCost.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>R$ ${totalProductCost.toFixed(2)}</td>
        `;
    });
    
    // Atualizar resumo
    document.getElementById('total-cost').textContent = 'R$ ' + totalCost.toFixed(2);
    document.getElementById('last-update').textContent = new Date().toLocaleString('pt-BR');
}

// Precificação
function loadPricing() {
    const tbody = document.getElementById('pricing-list');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const marginPercentage = parseFloat(document.getElementById('margin-percentage').value) || 30;
    const fixedCost = parseFloat(document.getElementById('fixed-cost').value) || 10;
    
    products.forEach(product => {
        const productPurchases = purchases.filter(p => p.product === product.name);
        let averageCost = 0;
        
        if (productPurchases.length > 0) {
            const totalQuantity = productPurchases.reduce((sum, p) => sum + p.quantity, 0);
            const totalValue = productPurchases.reduce((sum, p) => sum + p.total, 0);
            averageCost = totalValue / totalQuantity;
        }
        
        const suggestedPrice = averageCost * (1 + marginPercentage / 100) * (1 + fixedCost / 100);
        const currentPrice = parseFloat(product.price) || 0;
        const status = suggestedPrice > currentPrice ? 'Abaixo' : suggestedPrice < currentPrice ? 'Acima' : 'OK';
        const statusClass = status === 'OK' ? 'status-ok' : status === 'Abaixo' ? 'status-warning' : 'status-error';
        
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${product.name}</td>
            <td>R$ ${averageCost.toFixed(2)}</td>
            <td>${marginPercentage}%</td>
            <td>R$ ${suggestedPrice.toFixed(2)}</td>
            <td>R$ ${currentPrice.toFixed(2)}</td>
            <td class="${statusClass}">${status}</td>
            <td>
                <button class="btn-edit" onclick="updateProductPrice('${product.name}', ${suggestedPrice})">Atualizar</button>
            </td>
        `;
    });
}

function updatePricing(event) {
    event.preventDefault();
    loadPricing();
    showNotification('Tabela de preços atualizada!');
}

function updateProductPrice(productName, newPrice) {
    const productIndex = products.findIndex(p => p.name === productName);
    if (productIndex !== -1) {
        products[productIndex].price = newPrice;
        saveToFirebase('products', products);
        loadPricing();
        showNotification(`Preço do produto ${productName} atualizado!`);
    }
}

// Funções Utilitárias
function getCategoryName(category) {
    const categories = {
        'eletronicos': 'Eletrônicos',
        'vestuario': 'Vestuário',
        'alimentos': 'Alimentos',
        'outros': 'Outros'
    };
    return categories[category] || category;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    notification.textContent = message;
    
    // Adicionar ao topo do conteúdo principal
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(notification, mainContent.firstChild);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

function updateProductStock(productName, quantity) {
    const productIndex = products.findIndex(p => p.name === productName);
    if (productIndex !== -1) {
        products[productIndex].stock += quantity;
        saveToFirebase('products', products);
    }
}
