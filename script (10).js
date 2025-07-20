// Global variables
let cart = [];
let selectedVariant = '';
let currentProduct = '';
let quantity = 1;
let couponDiscount = 0;
let uploadedFile = null;
let currentAdmin = null;
let allOrders = [];
let filteredOrders = [];
let currentPage = 1;
let itemsPerPage = 10;
let sortField = 'timestamp';
let sortDirection = 'desc';

// Admin credentials - multiple admins supported
const adminCredentials = [
    {
        email: 'miguglugug@gmail.com',
        password: '12334567899Pm@',
        name: 'Administrador Principal',
        role: 'super_admin'
    },
    {
        email: 'shopeemigug@gmail.com',
        password: '12334567899Pm@',
        name: 'Administrador',
        role: 'admin'
    }
];

// Available coupons
const coupons = {
    'MIGUG10': { discount: 0.1, description: '10% de desconto' },
    'PRIMEIRA': { discount: 0.15, description: '15% de desconto (primeira compra)' },
    'STREAMER': { discount: 0.2, description: '20% de desconto (streamers)' }
};

// Product Data
const productData = {
    vtuber: {
        title: 'Modelo VTuber',
        category: 'Personagem Digital',
        basePrice: 90,
        limit: 2,
        variants: {
            'Basico': { price: 90, description: 'Modelo basico com 5 expressÃµes' },
            'Kit Completo': { price: 150, description: 'Modelo + overlays + Ã­cones' }
        },
        description: 'Modelos VTuber de alta qualidade para suas streams. Inclui rigging e expressões faciais personalizadas para maior interatividade com sua audiencia.',
        features: [
            'Design original personalizado',
            'Rigging profissional',
            '2 expressões faciais (basico) ou 4 expressões (kit completo)',
            'Arquivos em formato .png e .psd',
            'Suporte para entrega e garantia contra bugs e erros'
        ],
        images: [
            'https://i.imgur.com/4AqDx0r.gif',
            'https://i.imgur.com/IVvlENx.gif',
            'https://i.imgur.com/lzV5Sat.png'
        ],
        videoUrl: null,
        tutorial: `
            <div class="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mt-6">
                <h4 class="font-bold text-blue-800 dark:text-blue-200 mb-3">
                    <i class="fas fa-graduation-cap mr-2"></i>Tutorial - Como Usar seu VTuber
                </h4>
                <div class="space-y-3 text-blue-700 dark:text-blue-300">
                    <div>
                        <h5 class="font-semibold">1. Configuraçãoo Inicial:</h5>
                        <p class="text-sm">1 Baixe e instale o VTube Studio pela Steam</p>
                        <p class="text-sm">2 Importe o arquivo do seu modelo na pasta do VTube Studio</p>
                    </div>
                    <div>
                        <h5 class="font-semibold">2. Configuração de Tracking:</h5>
                        <p class="text-sm">1 Use webcam para captura facial</p>
                        <p class="text-sm">2 Configure as expressões no software</p>
                    </div>
                    <div>
                        <h5 class="font-semibold">3. Stream Setup:</h5>
                        <p class="text-sm">1 Adicione como fonte no OBS</p>
                        <p class="text-sm">2 Ajuste o chroma key se necessÃ¡rio</p>
                    </div>
                    <div class="mt-3 p-2 bg-blue-100 dark:bg-blue-800 rounded">
                        <p class="text-xs"><strong>Dica:</strong> Fornecemos suporte completo por 10 dias apos a entrega!</p>
                    </div>
                </div>
            </div>
        `
    },
    pngtuber: {
        title: 'PNGTuber',
        category: 'Personagem Digital',
        basePrice: 40,
        limit: 2,
        variants: {
            'Basico': { price: 40, description: 'Modelo com 6 expressões' },
            'Kit Completo': { price: 80, description: 'Modelo + overlays + Icones' }
        },
        description: 'PNGTubers perfeitos para iniciantes. Uma alternativa mais acessivel aos VTubers completos, mantendo uma presença visual dinamica em suas streams.',
        features: [
            'Design original personalizado',
            '3 expressões faciais (basico) ou 6 expressões (kit completo)',
            'Arquivos em formato .png e .psd',
            'Compatativel com os principais programas de streaming'
        ],
        images: [
            'https://i.imgur.com/jST8YL3.jpeg',
            
        ],
        videoUrl: null
    },
    website: {
        title: 'Website Personalizado',
        category: 'Desenvolvimento Web',
        basePrice: 0,
        customPrice: true,
        minPrice: 100,
        limit: 10,
        description: 'Sites profissionais para empresas, lojas, serviços, streamers e criadores de conteudo. Design responsivo e otimizado para mostrar seu trabalho e conectar com sua audiencia.',
        features: [
            'Design responsivo (mobile-friendly)',
            'Otimizado para SEO',
            'Integração com html, css e javascript',
            'Formulario de contato',
            ' pronto para Hospedagem(deploy)',
            'Suporte tecnico contra bugs e erros'
        ],
        images: [
            'https://i.imgur.com/TnT4mgk.jpeg',
            'https://i.imgur.com/xi7fptP.png',
            'https://i.imgur.com/ZCUimhY.png'
        ],
        videoUrl: null
    },
    icons: {
        title: 'icones Personalizados',
        category: 'Stream Assets',
        basePrice: 5,
        perUnit: true,
        limit: 8,
        description: 'icones personalizados para suas streams e redes sociais. perfeito se junto com botões, alertas e emotes.',
        features: [
            'Design original personalizado',
            'Arquivos em formato .png e .jpg',
            'Resolução para todas as plataformas',
        ],
        images: [
            'https://i.imgur.com/RGCufrM.png',
            'https://i.imgur.com/qjZDmci.png'
        ],
        videoUrl: null
    },
    overlays: {
        title: 'stream assets',
        category: 'Stream Assets',
        basePrice: 30,
        limit: 3,
        variants: {
            'Pacote Basico': { price: 30, description: 'Set com 10 icones + 1 overlay' },
            'Pacote Completo': { price: 60, description: 'Set com 20 icones + 3 overlays + alertas' },
            'Personalizado': { price: 100, description: 'Kit completo personalizado com tema especÃ­fico' }
        },
        description: 'Pacotes completos de icones e overlays para deixar sua stream com visual profissional. Inclui elementos para alertas, notificações e interface.',
        features: [
            'Icones para alertas e notificações',
            'Overlays para tela de stream',
            'Elementos para interface (webcam, chat)',
            'Compativel com OBS e Streamlabs',
            'Arquivos em formato .png e .psd',
            'Diferentes resoluções inclusas'
        ],
        images: [
            'https://i.imgur.com/VZE1bCe.png',
            
        ],
        videoUrl: null
    },
    art: {
        title: 'Arte Digital',
        category: 'Ilustração',
        basePrice: 10,
        limit: 4,
        variants: {
            'Sketch': { price: 10, description: 'Desenho em preto e branco' },
            'Completa': { price: 25, description: 'Ilustração colorida detalhada' }
        },
        description: 'Ilustrações digitais personalizadas para suas necessidades. Ideal para banners, telas de espera, overlays e muito mais.',
        features: [
            'Estilo personalizado',
            'Arquivos em alta resoluo',
            'Formatos .png, .jpg e .psd'
        ],
        images: [
            'https://i.imgur.com/ioeQ2Yj.png',
            
        ],
        videoUrl: null
    }
};



// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    // Initialize theme
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark');
    }
    
    // Load existing orders
    loadOrdersFromStorage();
    
    // Initialize event listeners
    setupEventListeners();
    
    // Populate product grid
    populateProductGrid();
    
    // Check for existing admin session
    checkAdminSession();

   
}

// Setup all event listeners
function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Cart functionality
    document.getElementById('cartBtn').addEventListener('click', toggleCart);
    document.getElementById('closeCartBtn').addEventListener('click', toggleCart);
    document.getElementById('checkoutBtn').addEventListener('click', checkout);
    
    // Checkout modal functionality
    document.getElementById('closeCheckoutModalBtn').addEventListener('click', closeCheckoutModal);
    document.getElementById('cancelCheckoutBtn').addEventListener('click', closeCheckoutModal);
    document.querySelector('#checkoutModal .modal-backdrop').addEventListener('click', closeCheckoutModal);
    
    // Success modal functionality
    document.getElementById('closeSuccessModalBtn').addEventListener('click', closeSuccessModal);
    document.querySelector('#successModal .modal-backdrop').addEventListener('click', closeSuccessModal);
    
    // Checkout form submission
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckoutSubmission);
    
    // Admin functionality
    setupAdminEventListeners();
    
    // Coupon functionality
    document.getElementById('applyCouponBtn').addEventListener('click', applyCoupon);
    
    // File upload functionality
    document.getElementById('uploadArea').addEventListener('click', () => {
        document.getElementById('receiptUpload').click();
    });
    document.getElementById('receiptUpload').addEventListener('change', handleFileUpload);
    
    // Notes character counter
    document.getElementById('notes').addEventListener('input', updateNotesCounter);
    
    // Add event listeners to Add to Cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            const product = button.getAttribute('data-product');
            addToCart(product);
        });
    });
    
    // Search functionality
    if (document.getElementById('searchInput')) {
        document.getElementById('searchInput').addEventListener('input', handleSearch);
    }
}

// Chat Bot Functions
function initializeChatBot() {
    // Chat toggle
    document.getElementById('chatToggle').addEventListener('click', toggleChat);
    document.getElementById('chatClose').addEventListener('click', toggleChat);
    
    // Chat send
    document.getElementById('chatSend').addEventListener('click', sendChatMessage);
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    // Quick replies
    document.querySelectorAll('.quick-reply').forEach(button => {
        button.addEventListener('click', () => {
            const message = button.getAttribute('data-message');
            sendChatMessage(message);
        });
    });
}

function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    
    if (chatWindow.classList.contains('scale-0')) {
        chatWindow.classList.remove('scale-0');
        chatWindow.classList.add('scale-100');
    } else {
        chatWindow.classList.remove('scale-100');
        chatWindow.classList.add('scale-0');
    }
}

function sendChatMessage(predefinedMessage = null) {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const message = predefinedMessage || chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user-message mb-3 text-right';
    userMessage.innerHTML = `
        <div class="bg-primary-600 text-white p-3 rounded-lg shadow-sm inline-block max-w-xs">
            <p class="text-sm">${message}</p>
        </div>
        <div class="text-xs text-gray-500 mt-1">Agora</div>
    `;
    chatMessages.appendChild(userMessage);
    
    // Clear input
    chatInput.value = '';
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Generate bot response after delay
    setTimeout(() => {
        const botResponse = chatBot.processMessage(message);
        const botMessage = document.createElement('div');
        botMessage.className = 'chat-message bot-message mb-3';
        botMessage.innerHTML = `
            <div class="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                <p class="text-sm">${botResponse}</p>
            </div>
            <div class="text-xs text-gray-500 mt-1">Agora</div>
        `;
        chatMessages.appendChild(botMessage);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

// Setup admin-specific event listeners
function setupAdminEventListeners() {
    // Admin menu functionality
    document.getElementById('adminMenuBtn').addEventListener('click', toggleAdminMenu);
    if (document.getElementById('adminLoginBtn')) {
        document.getElementById('adminLoginBtn').addEventListener('click', openAdminLogin);
    }
    document.getElementById('closeAdminLoginBtn').addEventListener('click', closeAdminLogin);
    document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);
    document.querySelector('#adminLoginModal .modal-backdrop').addEventListener('click', closeAdminLogin);
    
    // Admin panel functionality
    document.getElementById('closeAdminPanelBtn').addEventListener('click', closeAdminPanel);
    document.getElementById('logoutAdminBtn').addEventListener('click', logoutAdmin);
    document.getElementById('exportDataBtn').addEventListener('click', exportData);
    document.querySelector('#adminPanel .modal-backdrop').addEventListener('click', closeAdminPanel);
    
    // Admin panel controls
    document.getElementById('searchOrders').addEventListener('input', filterOrders);
    document.getElementById('filterStatus').addEventListener('change', filterOrders);
    document.getElementById('filterDate').addEventListener('change', filterOrders);
    document.getElementById('clearFilters').addEventListener('click', clearFilters);
    document.getElementById('refreshData').addEventListener('click', refreshAdminData);
    document.getElementById('markAllRead').addEventListener('click', markAllOrdersRead);
    document.getElementById('selectAll').addEventListener('change', toggleSelectAll);
    document.getElementById('prevPage').addEventListener('click', () => changePage(currentPage - 1));
    document.getElementById('nextPage').addEventListener('click', () => changePage(currentPage + 1));
}

// Admin Authentication Functions
function handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('adminLoginError');
    
    const admin = adminCredentials.find(a => a.email === email && a.password === password);
    
    if (admin) {
        currentAdmin = admin;
        localStorage.setItem('adminSession', JSON.stringify({
            admin: admin,
            loginTime: Date.now()
        }));
        
        closeAdminLogin();
        openAdminPanel();
        updateAdminUI();
    } else {
        errorDiv.textContent = 'Email ou senha incorretos.';
        errorDiv.classList.remove('hidden');
    }
}

function checkAdminSession() {
    const session = localStorage.getItem('adminSession');
    if (session) {
        try {
            const sessionData = JSON.parse(session);
            const loginTime = sessionData.loginTime;
            const currentTime = Date.now();
            const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
            
            if (currentTime - loginTime < sessionDuration) {
                currentAdmin = sessionData.admin;
                updateAdminUI();
            } else {
                localStorage.removeItem('adminSession');
            }
        } catch (e) {
            localStorage.removeItem('adminSession');
        }
    }
}

function updateAdminUI() {
    const adminIcon = document.getElementById('adminIcon');
    const adminMenuItems = document.getElementById('adminMenuItems');
    
    if (currentAdmin) {
        adminIcon.className = 'fas fa-user-check text-green-600';
        adminMenuItems.innerHTML = `
            <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                <p class="text-sm font-medium">${currentAdmin.name}</p>
                <p class="text-xs text-gray-500">${currentAdmin.role}</p>
            </div>
            <button id="openAdminPanelBtn" class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                <i class="fas fa-tachometer-alt mr-2"></i>
                Painel Admin
            </button>
            <button id="logoutAdminBtnMenu" class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-red-600">
                <i class="fas fa-sign-out-alt mr-2"></i>
                Sair
            </button>
        `;
        
        // Re-add event listeners for new elements
        document.getElementById('openAdminPanelBtn').addEventListener('click', () => {
            toggleAdminMenu();
            openAdminPanel();
        });
        document.getElementById('logoutAdminBtnMenu').addEventListener('click', () => {
            toggleAdminMenu();
            logoutAdmin();
        });
    } else {
        adminIcon.className = 'fas fa-user-shield';
        adminMenuItems.innerHTML = `
            <button id="adminLoginBtn" class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                <i class="fas fa-sign-in-alt mr-2"></i>
                Login Admin
            </button>
        `;
        
        // Re-add event listener
        document.getElementById('adminLoginBtn').addEventListener('click', openAdminLogin);
    }
}

function logoutAdmin() {
    currentAdmin = null;
    localStorage.removeItem('adminSession');
    updateAdminUI();
    closeAdminPanel();
}

// Admin Panel Functions
function openAdminPanel() {
    if (!currentAdmin) {
        openAdminLogin();
        return;
    }
    
    const modal = document.getElementById('adminPanel');
    const modalContent = document.getElementById('adminPanelContent');
    
    // Update welcome message
    document.getElementById('adminWelcome').textContent = `Bem-vindo, ${currentAdmin.name}`;
    
    // Load admin data
    loadAdminData();
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        document.querySelector('#adminPanel .modal-backdrop').classList.add('opacity-100');
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function closeAdminPanel() {
    const modal = document.getElementById('adminPanel');
    const modalContent = document.getElementById('adminPanelContent');
    
    document.querySelector('#adminPanel .modal-backdrop').classList.remove('opacity-100');
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

function loadAdminData() {
    allOrders = JSON.parse(localStorage.getItem('migugOrders') || '[]');
    filteredOrders = [...allOrders];
    updateAdminStats();
    renderOrdersTable();
}

function updateAdminStats() {
    const totalOrdersElement = document.getElementById('totalOrders');
    const todaySalesElement = document.getElementById('todaySales');
    const topProductElement = document.getElementById('topProduct');
    const avgOrderValueElement = document.getElementById('avgOrderValue');
    
    // Calculate statistics
    const totalOrders = allOrders.length;
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = allOrders.filter(order => order.timestamp.split('T')[0] === today);
    const todaySales = todayOrders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = totalOrders > 0 ? allOrders.reduce((sum, order) => sum + order.total, 0) / totalOrders : 0;
    
    // Calculate top product
    const productCounts = {};
    allOrders.forEach(order => {
        order.items.forEach(item => {
            const product = productData[item.product];
            if (product) {
                productCounts[product.title] = (productCounts[product.title] || 0) + 1;
            }
        });
    });
    
    const topProduct = Object.keys(productCounts).length > 0 ? 
        Object.keys(productCounts).reduce((a, b) => productCounts[a] > productCounts[b] ? a : b) : '-';
    
    // Update UI
    totalOrdersElement.textContent = totalOrders;
    todaySalesElement.textContent = `R$ ${todaySales.toFixed(2)}`;
    topProductElement.textContent = topProduct;
    avgOrderValueElement.textContent = `R$ ${avgOrderValue.toFixed(2)}`;
}

function renderOrdersTable() {
    const ordersTableBody = document.getElementById('ordersTableBody');
    
    if (filteredOrders.length === 0) {
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center py-8 text-gray-500 dark:text-gray-400">
                    <div class="flex flex-col items-center">
                        <i class="fas fa-inbox text-4xl mb-2"></i>
                        <p>Nenhum pedido encontrado.</p>
                        <p class="text-sm mt-2">Pedidos aparecerãoo aqui conforme forem sendo realizados.</p>
                    </div>
                </td>
            </tr>
        `;
        updatePagination(0, 0, 0);
        return;
    }
    
    // Sort orders
    const sortedOrders = [...filteredOrders].sort((a, b) => {
        let aVal = a[sortField] || '';
        let bVal = b[sortField] || '';
        
        if (sortField === 'customer') {
            aVal = `${a.customer.firstName} ${a.customer.lastName}`;
            bVal = `${b.customer.firstName} ${b.customer.lastName}`;
        } else if (sortField === 'date') {
            aVal = new Date(a.timestamp);
            bVal = new Date(b.timestamp);
        }
        
        if (sortDirection === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
    
    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedOrders = sortedOrders.slice(startIndex, endIndex);
    
    ordersTableBody.innerHTML = '';
    
    paginatedOrders.forEach(order => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700';
        
        const itemsList = order.items.map(item => item.name).join(', ');
        const date = new Date(order.timestamp).toLocaleDateString('pt-BR');
        const status = order.status || 'pending';
        const statusColors = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        };
        
        row.innerHTML = `
            <td class="py-2 px-2">
                <input type="checkbox" class="order-checkbox rounded" data-order-id="${order.orderNumber}">
            </td>
            <td class="py-2 font-mono text-sm">#${order.orderNumber}</td>
            <td class="py-2">${order.customer.firstName} ${order.customer.lastName}</td>
            <td class="py-2">${order.customer.email}</td>
            <td class="py-2 max-w-xs truncate" title="${itemsList}">${itemsList}</td>
            <td class="py-2 font-bold">R$ ${order.total.toFixed(2)}</td>
            <td class="py-2">${date}</td>
            <td class="py-2">
                <span class="px-2 py-1 text-xs rounded-full ${statusColors[status] || statusColors.pending}">
                    ${status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
            </td>
            <td class="py-2">
                <div class="flex space-x-2">
                    <button onclick="viewOrderDetails('${order.orderNumber}')" class="text-blue-600 hover:text-blue-800">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="updateOrderStatus('${order.orderNumber}')" class="text-green-600 hover:text-green-800">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteOrder('${order.orderNumber}')" class="text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        ordersTableBody.appendChild(row);
    });
    
    updatePagination(startIndex + 1, Math.min(endIndex, filteredOrders.length), filteredOrders.length);
}

function updatePagination(from, to, total) {
    document.getElementById('showingFrom').textContent = from;
    document.getElementById('showingTo').textContent = to;
    document.getElementById('totalResults').textContent = total;
    
    const totalPages = Math.ceil(total / itemsPerPage);
    document.getElementById('currentPage').textContent = currentPage;
    
    document.getElementById('prevPage').disabled = currentPage <= 1;
    document.getElementById('nextPage').disabled = currentPage >= totalPages;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderOrdersTable();
    }
}

function sortOrders(field) {
    if (sortField === field) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortField = field;
        sortDirection = 'desc';
    }
    currentPage = 1;
    renderOrdersTable();
}

function filterOrders() {
    const searchTerm = document.getElementById('searchOrders').value.toLowerCase();
    const statusFilter = document.getElementById('filterStatus').value;
    const dateFilter = document.getElementById('filterDate').value;
    
    filteredOrders = allOrders.filter(order => {
        const matchesSearch = !searchTerm || 
            order.orderNumber.toLowerCase().includes(searchTerm) ||
            `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase().includes(searchTerm) ||
            order.customer.email.toLowerCase().includes(searchTerm);
        
        const matchesStatus = !statusFilter || (order.status || 'pending') === statusFilter;
        
        const matchesDate = !dateFilter || order.timestamp.split('T')[0] === dateFilter;
        
        return matchesSearch && matchesStatus && matchesDate;
    });
    
    currentPage = 1;
    renderOrdersTable();
}

function clearFilters() {
    document.getElementById('searchOrders').value = '';
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterDate').value = '';
    filteredOrders = [...allOrders];
    currentPage = 1;
    renderOrdersTable();
}

function refreshAdminData() {
    loadAdminData();
    showNotification('Dados atualizados com sucesso!', 'success');
}

function markAllOrdersRead() {
    const checkboxes = document.querySelectorAll('.order-checkbox:checked');
    if (checkboxes.length === 0) {
        showNotification('Selecione pelo menos um pedido.', 'warning');
        return;
    }
    
    checkboxes.forEach(checkbox => {
        const orderNumber = checkbox.getAttribute('data-order-id');
        updateOrderStatusInStorage(orderNumber, 'completed');
    });
    
    loadAdminData();
    showNotification(`${checkboxes.length} pedido(s) marcado(s) como concluido(s).`, 'success');
}

function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.order-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
}

function viewOrderDetails(orderNumber) {
    const order = allOrders.find(o => o.orderNumber === orderNumber);
    if (!order) return;
    
    const modal = document.getElementById('orderDetailModal');
    const content = document.getElementById('orderDetailContent');
    
    const itemsList = order.items.map(item => `
        <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
            <div>
                <p class="font-medium">${item.name}</p>
                ${item.quantity > 1 ? `<p class="text-sm text-gray-500">Quantidade: ${item.quantity}</p>` : ''}
            </div>
            <span class="font-medium">R$ ${item.price.toFixed(2)}</span>
        </div>
    `).join('');
    
    const characteristics = Object.entries(order.characteristics || {}).map(([index, char], i) => `
        <div class="mb-3">
            <p class="font-medium text-sm">${order.items[i]?.name}:</p>
            <p class="text-gray-600 dark:text-gray-400 text-sm">${char}</p>
        </div>
    `).join('');
    
    content.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold">Detalhes do Pedido #${order.orderNumber}</h3>
            <button onclick="closeOrderDetailModal()" class="text-gray-500 hover:text-gray-700">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h4 class="font-bold mb-3">InformaÃ§Ãµes do Cliente</h4>
                <div class="space-y-2 text-sm">
                    <p><strong>Nome:</strong> ${order.customer.firstName} ${order.customer.lastName}</p>
                    <p><strong>Email:</strong> ${order.customer.email}</p>
                    <p><strong>Telefone:</strong> ${order.customer.phone || 'NÃ£o informado'}</p>
                    <p><strong>Data:</strong> ${new Date(order.timestamp).toLocaleString('pt-BR')}</p>
                </div>
            </div>
            
            <div>
                <h4 class="font-bold mb-3">Resumo do Pedido</h4>
                <div class="text-sm">
                    ${itemsList}
                    <div class="pt-3 mt-3 border-t border-gray-200 dark:border-gray-600">
                        ${order.discount > 0 ? `<p class="text-green-600">Desconto: -R$ ${order.discount.toFixed(2)}</p>` : ''}
                        <p class="font-bold text-lg">Total: R$ ${order.total.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
        
        ${characteristics ? `
            <div class="mt-6">
                <h4 class="font-bold mb-3">CaracterÃ­sticas dos Produtos</h4>
                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    ${characteristics}
                </div>
            </div>
        ` : ''}
        
        ${order.customer.notes ? `
            <div class="mt-6">
                <h4 class="font-bold mb-3">ObservaÃ§Ãµes</h4>
                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p class="text-sm">${order.customer.notes}</p>
                </div>
            </div>
        ` : ''}
        
        <div class="mt-6 flex space-x-4">
            <button onclick="updateOrderStatus('${orderNumber}')" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
                Atualizar Status
            </button>
            <button onclick="exportOrder('${orderNumber}')" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                Exportar Pedido
            </button>
            <button onclick="closeOrderDetailModal()" class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
                Fechar
            </button>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function closeOrderDetailModal() {
    document.getElementById('orderDetailModal').classList.add('hidden');
}

function updateOrderStatus(orderNumber) {
    const newStatus = prompt('Novo status do pedido (pending/processing/completed/cancelled):', 'pending');
    if (newStatus && ['pending', 'processing', 'completed', 'cancelled'].includes(newStatus)) {
        updateOrderStatusInStorage(orderNumber, newStatus);
        loadAdminData();
        showNotification('Status atualizado com sucesso!', 'success');
        closeOrderDetailModal();
    } else if (newStatus) {
        showNotification('Status invalido! Use: pending, processing, completed ou cancelled', 'error');
    }
}

function updateOrderStatusInStorage(orderNumber, newStatus) {
    const orders = JSON.parse(localStorage.getItem('migugOrders') || '[]');
    const orderIndex = orders.findIndex(o => o.orderNumber === orderNumber);
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        orders[orderIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('migugOrders', JSON.stringify(orders));
    }
}

function deleteOrder(orderNumber) {
    if (confirm('Tem certeza que deseja excluir este pedido? Esta alteração não pode ser desfeita.')) {
        const orders = JSON.parse(localStorage.getItem('migugOrders') || '[]');
        const filteredOrders = orders.filter(o => o.orderNumber !== orderNumber);
        localStorage.setItem('migugOrders', JSON.stringify(filteredOrders));
        loadAdminData();
        showNotification('Pedido excluÃ­do com sucesso!', 'success');
        closeOrderDetailModal();
    }
}

function exportOrder(orderNumber) {
    const order = allOrders.find(o => o.orderNumber === orderNumber);
    if (!order) return;
    
    const exportData = JSON.stringify(order, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pedido-${orderNumber}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Pedido exportado com sucesso!', 'success');
}

function exportData() {
    const exportData = {
        orders: allOrders,
        exportDate: new Date().toISOString(),
        totalOrders: allOrders.length,
        totalRevenue: allOrders.reduce((sum, order) => sum + order.total, 0),
        summary: {
            byStatus: {},
            byProduct: {},
            monthlyStats: {}
        }
    };
    
    // Calculate summary statistics
    allOrders.forEach(order => {
        const status = order.status || 'pending';
        exportData.summary.byStatus[status] = (exportData.summary.byStatus[status] || 0) + 1;
        
        const month = order.timestamp.substring(0, 7); // YYYY-MM
        if (!exportData.summary.monthlyStats[month]) {
            exportData.summary.monthlyStats[month] = { orders: 0, revenue: 0 };
        }
        exportData.summary.monthlyStats[month].orders++;
        exportData.summary.monthlyStats[month].revenue += order.total;
        
        order.items.forEach(item => {
            const productName = item.name;
            if (!exportData.summary.byProduct[productName]) {
                exportData.summary.byProduct[productName] = { count: 0, revenue: 0 };
            }
            exportData.summary.byProduct[productName].count++;
            exportData.summary.byProduct[productName].revenue += item.price;
        });
    });
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `migug-dados-completos-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Dados exportados com sucesso!', 'success');
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 transform translate-x-full`;
    
    const bgColors = {
        success: 'bg-green-600 text-white',
        error: 'bg-red-600 text-white',
        warning: 'bg-yellow-600 text-white',
        info: 'bg-blue-600 text-white'
    };
    
    notification.className += ` ${bgColors[type] || bgColors.info}`;
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function loadOrdersFromStorage() {
    allOrders = JSON.parse(localStorage.getItem('migugOrders') || '[]');
}

// Existing functions (keep all the original functionality)
function toggleAdminMenu() {
    const dropdown = document.getElementById('adminDropdown');
    dropdown.classList.toggle('hidden');
}

function openAdminLogin() {
    const modal = document.getElementById('adminLoginModal');
    const modalContent = document.getElementById('adminLoginContent');
    
    toggleAdminMenu(); // Close menu
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        document.querySelector('#adminLoginModal .modal-backdrop').classList.add('opacity-100');
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function closeAdminLogin() {
    const modal = document.getElementById('adminLoginModal');
    const modalContent = document.getElementById('adminLoginContent');
    
    document.querySelector('#adminLoginModal .modal-backdrop').classList.remove('opacity-100');
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        document.getElementById('adminLoginError').classList.add('hidden');
        document.getElementById('adminLoginForm').reset();
    }, 300);
}

// Handle checkout form submission
function handleCheckoutSubmission(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Validate required fields
    const required = ['firstName', 'lastName', 'email', 'notes', 'terms'];
    const missing = required.filter(field => !formData.get(field));
    
    if (missing.length > 0) {
        showNotification('Por favor, preencha todos os campos obrigatÃ³rios.', 'error');
        return;
    }
    
    // Validate notes length
    if (formData.get('notes').length < 20) {
        showNotification('As observaÃ§Ãµes devem ter pelo menos 20 caracteres.', 'error');
        return;
    }
    
    // Validate receipt upload
    if (!uploadedFile) {
        showNotification('Por favor, envie o comprovante de pagamento.', 'error');
        return;
    }
    
    processOrder(formData);
}

// Keep all existing product and cart functionality
function populateProductGrid() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    Object.keys(productData).forEach(key => {
        const product = productData[key];
        const card = document.createElement('div');
        card.className = 'bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition product-card';
        card.setAttribute('data-product', key);
        card.setAttribute('data-title', product.title);
        card.setAttribute('data-category', product.category);
        
        let priceDisplay = '';
        if (product.customPrice) {
            priceDisplay = `A partir de R$ ${product.minPrice}`;
        } else if (product.perUnit) {
            priceDisplay = `R$ ${product.basePrice} cada`;
        } else if (product.variants) {
            const prices = Object.values(product.variants).map(v => v.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            priceDisplay = minPrice === maxPrice ? `R$ ${minPrice}` : `R$ ${minPrice} - R$ ${maxPrice}`;
        } else {
            priceDisplay = `R$ ${product.basePrice}`;
        }
        
        card.innerHTML = `
            <img src="${product.images[0]}" alt="${product.title}" class="w-full h-48 object-cover">
            <div class="p-4">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-bold text-lg">${product.title}</h3>
                    <span class="bg-gray-200 dark:bg-gray-700 text-xs px-2 py-1 rounded">${product.category}</span>
                </div>
                <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">${product.description}</p>
                <div class="flex justify-between items-center">
                    <span class="font-bold text-primary-600 dark:text-primary-400">${priceDisplay}</span>
                    <button class="bg-primary-600 text-white px-4 py-2 rounded-full hover:bg-primary-700 transition view-details-btn">
                        Detalhes
                    </button>
                </div>
            </div>
        `;
        
        card.querySelector('.view-details-btn').addEventListener('click', () => {
            openProductModal(key);
        });
        
        productsGrid.appendChild(card);
    });
}

// Open product modal
function openProductModal(productKey) {
    currentProduct = productKey;
    const product = productData[productKey];
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('modalContent');
    
    // Reset variant and quantity
    selectedVariant = product.variants ? Object.keys(product.variants)[0] : '';
    quantity = 1;
    
    // Create modal content
    let variantOptions = '';
    let priceDisplay = '';
    let quantityControl = '';
    
    if (product.variants) {
        variantOptions = `
            <div class="mb-4">
                <label class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Opções:</label>
                <div class="flex flex-wrap gap-2">
                    ${Object.keys(product.variants).map(variant => `
                        <button class="variant-btn ${variant === selectedVariant ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'} px-4 py-2 rounded-lg hover:bg-primary-500 hover:text-white transition" data-variant="${variant}">
                            ${variant}
                        </button>
                    `).join('')}
                </div>
            </div>
            <p id="variantDescription" class="text-gray-600 dark:text-gray-400 mb-4">
                ${product.variants[selectedVariant].description}
            </p>
        `;
        priceDisplay = `R$ ${product.variants[selectedVariant].price}`;
    } else if (product.customPrice) {
        priceDisplay = `<div class="mb-4">
            <label class="block text-gray-700 dark:text-gray-300 font-medium mb-2">OrÃ§amento estimado:</label>
            <input type="number" id="customBudget" min="${product.minPrice}" step="10" value="${product.minPrice}" 
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700">
            <p class="text-gray-600 dark:text-gray-400 mt-1">Valor mÃ­nimo: R$ ${product.minPrice}</p>
        </div>`;
    } else if (product.perUnit) {
        quantityControl = `
            <div class="flex items-center mb-4">
                <label class="block text-gray-700 dark:text-gray-300 font-medium mr-4">Quantidade:</label>
                <div class="flex items-center">
                    <button id="decreaseQty" class="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-l-lg">-</button>
                    <input type="number" id="quantityInput" min="1" value="1" 
                        class="w-16 text-center border-y border-gray-300 dark:border-gray-600 dark:bg-gray-700 py-1">
                    <button id="increaseQty" class="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-r-lg">+</button>
                </div>
            </div>
        `;
        priceDisplay = `R$ ${product.basePrice} cada`;
    } else {
        priceDisplay = `R$ ${product.basePrice}`;
    }
    
    // Create the modal HTML
    modalContent.innerHTML = `
        <button id="closeModalBtn" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <i class="fas fa-times text-xl"></i>
        </button>
        
        <div class="flex flex-col md:flex-row">
            <div class="md:w-1/2 p-6">
                <div class="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
                    <img id="mainProductImage" src="${product.images[0]}" alt="${product.title}" class="w-full h-64 object-contain">
                </div>
                
                ${product.images.length > 1 ? `
                    <div class="flex space-x-2 overflow-x-auto pb-2">
                        ${product.images.map((img, index) => `
                            <div class="thumbnail-container w-20 h-20 flex-shrink-0 cursor-pointer ${index === 0 ? 'ring-2 ring-primary-500' : ''}">
                                <img src="${img}" alt="Thumbnail ${index + 1}" class="w-full h-full object-cover rounded" data-index="${index}">
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${product.videoUrl ? `
                    <div class="mt-4">
                        <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Video de demonstração:</h4>
                        <div class="rounded-lg overflow-hidden">
                            <video src="${product.videoUrl}" controls class="w-full"></video>
                        </div>
                    </div>
                ` : ''}
            </div>
            
            <div class="md:w-1/2 p-6">
                <div class="mb-2 flex items-center">
                    <span class="bg-gray-200 dark:bg-gray-700 text-xs px-2 py-1 rounded mr-2">${product.category}</span>
                    ${product.limit ? `<span class="bg-orange-200 dark:bg-orange-700 text-xs px-2 py-1 rounded">Limite: ${product.limit} por pedido</span>` : ''}
                </div>
                <h2 class="text-2xl font-bold mb-4">${product.title}</h2>
                
                <p class="text-gray-700 dark:text-gray-300 mb-6">${product.description}</p>
                
                ${variantOptions}
                ${quantityControl}
                
                <div class="mb-6">
                    <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2">CaracterÃ­sticas:</h4>
                    <ul class="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                        ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                
                ${product.tutorial ? product.tutorial : ''}
                
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <span class="text-sm text-gray-500 dark:text-gray-400">PreÃ§o:</span>
                        <div class="text-2xl font-bold text-primary-600 dark:text-primary-400" id="productPrice">${priceDisplay}</div>
                    </div>
                    
                    <button id="addToCartModalBtn" class="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition flex items-center">
                        <i class="fas fa-cart-plus mr-2"></i>
                        <span>Adicionar ao Carrinho</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Show the modal
    modal.classList.remove('hidden');
    setTimeout(() => {
        document.querySelector('#productModal .modal-backdrop').classList.add('opacity-100');
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
    
    // Add event listeners
    document.getElementById('closeModalBtn').addEventListener('click', closeProductModal);
    document.querySelector('#productModal .modal-backdrop').addEventListener('click', closeProductModal);
    
    // Thumbnail navigation
    const thumbnails = document.querySelectorAll('.thumbnail-container img');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const index = thumb.getAttribute('data-index');
            document.getElementById('mainProductImage').src = product.images[index];
            
            thumbnails.forEach(t => {
                t.parentElement.classList.remove('ring-2', 'ring-primary-500');
            });
            thumb.parentElement.classList.add('ring-2', 'ring-primary-500');
        });
    });
    
    // Variant selection
    const variantBtns = document.querySelectorAll('.variant-btn');
    variantBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedVariant = btn.getAttribute('data-variant');
            
            variantBtns.forEach(b => {
                b.classList.remove('bg-primary-600', 'text-white');
                b.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-white');
            });
            
            btn.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-white');
            btn.classList.add('bg-primary-600', 'text-white');
            
            document.getElementById('variantDescription').textContent = product.variants[selectedVariant].description;
            document.getElementById('productPrice').textContent = `R$ ${product.variants[selectedVariant].price}`;
        });
    });
    
    // Quantity controls
    if (product.perUnit) {
        document.getElementById('decreaseQty').addEventListener('click', () => {
            const input = document.getElementById('quantityInput');
            if (parseInt(input.value) > 1) {
                input.value = parseInt(input.value) - 1;
                quantity = parseInt(input.value);
            }
        });
        
        document.getElementById('increaseQty').addEventListener('click', () => {
            const input = document.getElementById('quantityInput');
            input.value = parseInt(input.value) + 1;
            quantity = parseInt(input.value);
        });
        
        document.getElementById('quantityInput').addEventListener('change', (e) => {
            quantity = parseInt(e.target.value);
        });
    }
    
    // Add to cart from modal
    document.getElementById('addToCartModalBtn').addEventListener('click', () => {
        let customPrice = null;
        
        if (product.customPrice) {
            customPrice = parseInt(document.getElementById('customBudget').value);
        }
        
        addToCartFromModal(customPrice);
        closeProductModal();
    });
}

// Close product modal
function closeProductModal() {
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('modalContent');
    
    document.querySelector('#productModal .modal-backdrop').classList.remove('opacity-100');
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// Add to cart from modal
function addToCartFromModal(customPrice = null) {
    const product = productData[currentProduct];
    
    // Check product limit
    if (!checkProductLimit(currentProduct, product.perUnit ? quantity : 1)) {
        showNotification(`Limite maximo de ${product.limit} ${product.title} por pedido.`, 'warning');
        return;
    }
    
    let price = 0;
    let name = product.title;
    
    if (customPrice) {
        price = customPrice;
        name = `${product.title} (Orçamento Personalizado)`;
    } else if (product.variants && selectedVariant) {
        price = product.variants[selectedVariant].price;
        name = `${product.title} - ${selectedVariant}`;
    } else if (product.perUnit) {
        price = product.basePrice * quantity;
        name = `${product.title} (${quantity} unidades)`;
    } else {
        price = product.basePrice;
    }
    
    cart.push({
        id: Date.now().toString(),
        product: currentProduct,
        name,
        price,
        quantity: product.perUnit ? quantity : 1,
        variant: selectedVariant
    });
    
    updateCartUI();
    showNotification('Produto adicionado ao carrinho!', 'success');
}

// Add to cart from grid
function addToCart(product) {
    const productInfo = productData[product];
    
    if (productInfo.variants || productInfo.customPrice || productInfo.perUnit) {
        openProductModal(product);
    } else {
        // Check product limit
        if (!checkProductLimit(product)) {
            showNotification(`Limite maximo de ${productInfo.limit} ${productInfo.title} por pedido.`, 'warning');
            return;
        }
        
        cart.push({
            id: Date.now().toString(),
            product,
            name: productInfo.title,
            price: productInfo.basePrice,
            quantity: 1,
            variant: ''
        });
        
        updateCartUI();
        showNotification('Produto adicionado ao carrinho!', 'success');
    }
}

// Update cart UI
function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (cart.length === 0) {
        emptyCartMessage.classList.remove('hidden');
        cartItems.innerHTML = '';
        cartTotal.textContent = 'R$ 0';
        return;
    }
    
    emptyCartMessage.classList.add('hidden');
    
    let total = 0;
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        total += item.price;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'flex items-center py-4 border-b border-gray-200 dark:border-gray-700 cart-item';
        cartItem.innerHTML = `
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg mr-4 flex items-center justify-center">
                <i class="fas fa-image text-gray-400 text-xl"></i>
            </div>
            <div class="flex-grow">
                <h4 class="font-medium">${item.name}</h4>
                <p class="text-gray-600 dark:text-gray-400">R$ ${item.price.toFixed(2)}</p>
                ${item.quantity > 1 ? `<p class="text-sm text-gray-500">Quantidade: ${item.quantity}</p>` : ''}
            </div>
            <div class="flex flex-col items-center space-y-2">
                <button class="quantity-btn-plus text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition" data-id="${item.id}">
                    <i class="fas fa-plus"></i>
                </button>
                <span class="text-sm font-medium">${item.quantity}</span>
                <button class="quantity-btn-minus text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition" data-id="${item.id}">
                    <i class="fas fa-minus"></i>
                </button>
            </div>
            <button class="remove-from-cart-btn text-gray-500 hover:text-red-500 ml-2 transition" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = `R$ ${total.toFixed(2)}`;
    
    // Add event listeners to cart buttons
    document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            removeFromCart(id);
        });
    });
    
    document.querySelectorAll('.quantity-btn-plus').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            updateCartQuantity(id, 1);
        });
    });
    
    document.querySelectorAll('.quantity-btn-minus').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            updateCartQuantity(id, -1);
        });
    });
}

// Remove from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
    showNotification('Produto removido do carrinho', 'info');
}

// Update cart quantity
function updateCartQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        const product = productData[item.product];
        const newQuantity = item.quantity + change;
        
        if (newQuantity <= 0) {
            removeFromCart(id);
            return;
        }
        
        // Check product limit
        if (product.limit) {
            const currentProductCount = cart.filter(cartItem => cartItem.product === item.product)
                .reduce((sum, cartItem) => sum + (cartItem.id === id ? newQuantity : cartItem.quantity), 0);
            
            if (currentProductCount > product.limit) {
                showNotification(`Limite maximo de ${product.limit} ${product.title} por pedido.`, 'warning');
                return;
            }
        }
        
        item.quantity = newQuantity;
        
        // Recalculate price if it's a per-unit item
        if (product.perUnit) {
            item.price = product.basePrice * item.quantity;
            item.name = `${product.title} (${item.quantity} unidades)`;
        }
        
        updateCartUI();
    }
}

// Toggle cart drawer
function toggleCart() {
    const cartDrawer = document.getElementById('cartDrawer');
    cartDrawer.classList.toggle('translate-x-full');
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Seu carrinho está vazio!', 'warning');
        return;
    }
    openCheckoutModal();
}

// Open checkout modal
function openCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const modalContent = document.getElementById('checkoutModalContent');
    const checkoutItems = document.getElementById('checkoutItems');
    
    // Populate order summary
    checkoutItems.innerHTML = '';
    
    cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'flex justify-between items-center';
        orderItem.innerHTML = `
            <div>
                <p class="font-medium">${item.name}</p>
                ${item.quantity > 1 ? `<p class="text-sm text-gray-500">Quantidade: ${item.quantity}</p>` : ''}
            </div>
            <span class="font-medium">R$ ${item.price.toFixed(2)}</span>
        `;
        checkoutItems.appendChild(orderItem);
    });
    
    // Populate product characteristics
    populateProductCharacteristics();
    
    // Update total
    updateCheckoutTotal();
    
    // Show modal
    modal.classList.remove('hidden');
    setTimeout(() => {
        document.querySelector('#checkoutModal .modal-backdrop').classList.add('opacity-100');
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
}

// Close checkout modal
function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const modalContent = document.getElementById('checkoutModalContent');
    
    document.querySelector('#checkoutModal .modal-backdrop').classList.remove('opacity-100');
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        // Reset form
        document.getElementById('checkoutForm').reset();
        couponDiscount = 0;
        uploadedFile = null;
        document.getElementById('couponMessage').classList.add('hidden');
        document.getElementById('uploadArea').classList.remove('hidden');
        document.getElementById('uploadedFile').classList.add('hidden');
        updateCheckoutTotal();
    }, 300);
}

// Open success modal
function openSuccessModal(orderNumber) {
    const modal = document.getElementById('successModal');
    const modalContent = document.getElementById('successModalContent');
    const orderNumberElement = document.getElementById('orderNumber');
    
    orderNumberElement.textContent = `#${orderNumber}`;
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        document.querySelector('#successModal .modal-backdrop').classList.add('opacity-100');
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
}

// Close success modal
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    const modalContent = document.getElementById('successModalContent');
    
    document.querySelector('#successModal .modal-backdrop').classList.remove('opacity-100');
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// Process order
function processOrder(formData) {
    // Show loading state
    const submitBtn = document.querySelector('#checkoutForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner animate-spin mr-2"></i>Processando...';
    submitBtn.disabled = true;
    
    // Generate order number
    const orderNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    
    // Collect product characteristics
    const characteristics = {};
    cart.forEach((item, index) => {
        characteristics[index] = formData.get(`characteristics_${index}`);
    });
    
    // Calculate final total with coupon
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const discountAmount = subtotal * couponDiscount;
    const finalTotal = subtotal - discountAmount;
    
    // Create order data
    const orderData = {
        orderNumber: orderNumber,
        items: cart,
        customer: {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            notes: formData.get('notes')
        },
        characteristics: characteristics,
        paymentMethod: 'pix',
        subtotal: subtotal,
        discount: discountAmount,
        total: finalTotal,
        couponCode: couponDiscount > 0 ? document.getElementById('couponCode').value : null,
        receipt: uploadedFile ? uploadedFile.name : null,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    
    // Simulate API call delay
    setTimeout(() => {
        console.log('Order processed:', orderData);
        
        // Store order
        const existingOrders = JSON.parse(localStorage.getItem('migugOrders') || '[]');
        existingOrders.push(orderData);
        localStorage.setItem('migugOrders', JSON.stringify(existingOrders));
        
        // Reset form state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        closeCheckoutModal();
        openSuccessModal(orderNumber);
        
        // Clear cart and reset
        cart = [];
        couponDiscount = 0;
        uploadedFile = null;
        updateCartUI();
        toggleCart();
        
        // Show success notification
        showNotification('Pedido criado com sucesso! Entraremos em contato em breve.', 'success');
    }, 2000);
}

// Apply coupon
function applyCoupon() {
    const couponCode = document.getElementById('couponCode').value.toUpperCase();
    const messageDiv = document.getElementById('couponMessage');
    const applyBtn = document.getElementById('applyCouponBtn');
    
    if (!couponCode.trim()) {
        messageDiv.textContent = 'Digite um cÃ³digo de cupom.';
        messageDiv.className = 'mt-1 text-sm text-red-600 dark:text-red-400';
        messageDiv.classList.remove('hidden');
        return;
    }
    
    // Show loading state
    applyBtn.innerHTML = '<i class="fas fa-spinner animate-spin"></i>';
    applyBtn.disabled = true;
    
    setTimeout(() => {
        if (coupons[couponCode]) {
            couponDiscount = coupons[couponCode].discount;
            messageDiv.textContent = ` Cupom aplicado! ${coupons[couponCode].description}`;
            messageDiv.className = 'mt-1 text-sm text-green-600 dark:text-green-400';
            messageDiv.classList.remove('hidden');
            updateCheckoutTotal();
            applyBtn.innerHTML = '<i class="fas fa-check"></i>';
            applyBtn.disabled = true;
        } else {
            messageDiv.textContent = ' Cupom invalido ou expirado.';
            messageDiv.className = 'mt-1 text-sm text-red-600 dark:text-red-400';
            messageDiv.classList.remove('hidden');
            applyBtn.innerHTML = 'Aplicar';
            applyBtn.disabled = false;
        }
    }, 1000);
}

// Handle file upload
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Arquivo muito grande. Maximo 5MB.', 'error');
            e.target.value = '';
            return;
        }
        
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            showNotification('Tipo de arquivo nÃ£o permitido. Use PNG, JPG ou PDF.', 'error');
            e.target.value = '';
            return;
        }
        
        uploadedFile = file;
        document.getElementById('uploadArea').classList.add('hidden');
        document.getElementById('uploadedFile').classList.remove('hidden');
        document.getElementById('fileName').textContent = file.name;
        
        showNotification('Arquivo enviado com sucesso!', 'success');
    }
}

// Remove uploaded file
function removeFile() {
    uploadedFile = null;
    document.getElementById('receiptUpload').value = '';
    document.getElementById('uploadArea').classList.remove('hidden');
    document.getElementById('uploadedFile').classList.add('hidden');
}

// Copy PIX key
function copyPixKey() {
    const pixKey = 'f4a6ea95-6c02-4903-bc4a-d6c94a92eb76';
    if (navigator.clipboard) {
        navigator.clipboard.writeText(pixKey).then(() => {
            showNotification('Chave PIX copiada para a area de transferencia!', 'success');
        }).catch(() => {
            fallbackCopyPixKey(pixKey);
        });
    } else {
        fallbackCopyPixKey(pixKey);
    }
}

function fallbackCopyPixKey(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showNotification('Chave PIX copiada!', 'success');
    } catch (err) {
        showNotification('Erro ao copiar. Use: ' + text, 'error');
    }
    document.body.removeChild(textArea);
}

// Check product limits
function checkProductLimit(productKey, requestedQuantity = 1) {
    const product = productData[productKey];
    if (!product.limit) return true;
    
    const currentCount = cart.filter(item => item.product === productKey)
        .reduce((sum, item) => sum + item.quantity, 0);
    
    return (currentCount + requestedQuantity) <= product.limit;
}

// Update checkout total with coupon
function updateCheckoutTotal() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const discountAmount = total * couponDiscount;
    const finalTotal = total - discountAmount;
    
    document.getElementById('checkoutTotal').innerHTML = `
        ${couponDiscount > 0 ? `
            <div class="text-sm text-gray-500 space-y-1">
                <div class="flex justify-between">
                    <span>Subtotal:</span>
                    <span>R$ ${total.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-green-600">
                    <span>Desconto:</span>
                    <span>-R$ ${discountAmount.toFixed(2)}</span>
                </div>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                <div class="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>R$ ${finalTotal.toFixed(2)}</span>
                </div>
            </div>
        ` : `R$ ${finalTotal.toFixed(2)}`}
    `;
}

// Populate product characteristics form
function populateProductCharacteristics() {
    const container = document.getElementById('productCharacteristics');
    container.innerHTML = '';
    
    cart.forEach((item, index) => {
        const product = productData[item.product];
        const div = document.createElement('div');
        div.className = 'border border-gray-300 dark:border-gray-600 rounded-lg p-3';
        div.innerHTML = `
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CaracterÃ­sticas para: ${item.name} *
            </label>
            <textarea name="characteristics_${index}" required minlength="10" rows="2"
                class="w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Descreva como voce quer este produto... (minimo 10 caracteres)"></textarea>
        `;
        container.appendChild(div);
    });
}

// Toggle theme
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        const title = card.getAttribute('data-title').toLowerCase();
        const category = card.getAttribute('data-category').toLowerCase();
        const product = productData[card.getAttribute('data-product')];
        const description = product.description.toLowerCase();
        
        if (title.includes(searchTerm) || category.includes(searchTerm) || description.includes(searchTerm)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// Update notes counter
function updateNotesCounter() {
    const notesInput = document.getElementById('notes');
    const counter = document.getElementById('notesCount');
    const length = notesInput.value.length;
    
    counter.textContent = length;
    
    if (length < 20) {
        counter.parentElement.classList.add('text-red-500');
        counter.parentElement.classList.remove('text-green-500');
    } else {
        counter.parentElement.classList.remove('text-red-500');
        counter.parentElement.classList.add('text-green-500');
    }
}