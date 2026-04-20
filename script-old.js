// Configuração do Firebase
// SUBSTITUA ESTES VALORES PELOS SEUS DADOS REAIS DO FIREBASE
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
const auth = firebase.auth();

// Variáveis globais
let currentUser = null;
let openWindows = [];
let windowZIndex = 100;
let currentPath = '/';

// Sistema de arquivos virtual
const virtualFileSystem = {
    '/': {
        type: 'directory',
        children: {
            'home': {
                type: 'directory',
                children: {
                    'documents': { type: 'directory', children: {} },
                    'downloads': { type: 'directory', children: {} },
                    'desktop': { type: 'directory', children: {} }
                }
            },
            'system': {
                type: 'directory',
                children: {
                    'config.json': { type: 'file', content: '{"theme": "dark", "language": "pt-BR"}' },
                    'logs': { type: 'directory', children: {} }
                }
            },
            'tmp': { type: 'directory', children: {} }
        }
    }
};

// Inicialização do sistema
document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
    setupEventListeners();
    updateClock();
    setInterval(updateClock, 1000);
    
    // Verificar usuário autenticado
    auth.onAuthStateChanged(function(user) {
        currentUser = user;
        if (user) {
            loadUserData();
            showNotification(`Bem-vindo, ${user.email}!`);
        }
    });
});

function initializeSystem() {
    // Carregar dados do Firebase
    database.ref('system').once('value').then(function(snapshot) {
        const systemData = snapshot.val();
        if (systemData && systemData.fileSystem) {
            Object.assign(virtualFileSystem, systemData.fileSystem);
        }
    });
}

function setupEventListeners() {
    // Menu Iniciar
    document.getElementById('start-menu-btn').addEventListener('click', toggleStartMenu);
    
    // Clique fora do menu para fechar
    document.addEventListener('click', function(e) {
        const startMenu = document.getElementById('start-menu');
        const startMenuBtn = document.getElementById('start-menu-btn');
        
        if (!startMenu.contains(e.target) && e.target !== startMenuBtn) {
            startMenu.classList.add('hidden');
        }
    });
}

function toggleStartMenu() {
    const startMenu = document.getElementById('start-menu');
    startMenu.classList.toggle('hidden');
}

function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR');
    document.getElementById('clock').textContent = timeString;
}

// Sistema de janelas
function openApp(appName) {
    const existingWindow = openWindows.find(w => w.app === appName);
    if (existingWindow) {
        focusWindow(existingWindow.id);
        return;
    }
    
    const windowId = 'window-' + Date.now();
    const window = createWindow(windowId, appName);
    openWindows.push({ id: windowId, app: appName });
    
    document.getElementById('window-container').appendChild(window);
    focusWindow(windowId);
}

function createWindow(windowId, appName) {
    const window = document.createElement('div');
    window.className = 'window';
    window.id = windowId;
    window.style.left = Math.random() * 200 + 'px';
    window.style.top = Math.random() * 200 + 'px';
    
    let content = '';
    let title = '';
    
    switch(appName) {
        case 'terminal':
            title = 'Terminal';
            content = createTerminalContent();
            break;
        case 'fileManager':
            title = 'Gerenciador de Arquivos';
            content = createFileManagerContent();
            break;
        case 'textEditor':
            title = 'Editor de Texto';
            content = createTextEditorContent();
            break;
        case 'settings':
            title = 'Configurações';
            content = createSettingsContent();
            break;
    }
    
    window.innerHTML = `
        <div class="window-header" onmousedown="startDrag(event, '${windowId}')">
            <div class="window-title">${title}</div>
            <div class="window-controls">
                <div class="window-control minimize" onclick="minimizeWindow('${windowId}')"></div>
                <div class="window-control maximize" onclick="maximizeWindow('${windowId}')"></div>
                <div class="window-control close" onclick="closeWindow('${windowId}')"></div>
            </div>
        </div>
        <div class="window-content">
            ${content}
        </div>
    `;
    
    return window;
}

function createTerminalContent() {
    return `
        <div class="terminal">
            <div class="terminal-output" id="terminal-output">Bem-vindo ao WebOS Terminal v1.0
Digite 'help' para ver os comandos disponíveis.</div>
            <div class="terminal-input">
                <span class="terminal-prompt">$</span>
                <input type="text" id="terminal-input" onkeypress="handleTerminalInput(event)" autofocus>
            </div>
        </div>
    `;
}

function createFileManagerContent() {
    return `
        <div class="file-manager">
            <div class="file-toolbar">
                <button class="file-btn" onclick="createFile()">Novo Arquivo</button>
                <button class="file-btn" onclick="createFolder()">Nova Pasta</button>
                <button class="file-btn" onclick="deleteFile()">Excluir</button>
                <button class="file-btn" onclick="refreshFiles()">Atualizar</button>
            </div>
            <div class="file-list" id="file-list">
                ${renderFileList(currentPath)}
            </div>
        </div>
    `;
}

function createTextEditorContent() {
    return `
        <div class="text-editor">
            <div class="editor-toolbar">
                <button class="editor-btn" onclick="newFile()">Novo</button>
                <button class="editor-btn" onclick="saveFile()">Salvar</button>
                <button class="editor-btn" onclick="openFile()">Abrir</button>
            </div>
            <textarea class="editor-textarea" id="editor-content" placeholder="Digite seu texto aqui..."></textarea>
        </div>
    `;
}

function createSettingsContent() {
    return `
        <div class="settings">
            <div class="setting-item">
                <span class="setting-label">Tema</span>
                <select class="setting-input" onchange="changeTheme(this.value)">
                    <option value="dark">Escuro</option>
                    <option value="light">Claro</option>
                </select>
            </div>
            <div class="setting-item">
                <span class="setting-label">Idioma</span>
                <select class="setting-input">
                    <option value="pt-BR">Português</option>
                    <option value="en-US">English</option>
                </select>
            </div>
            <div class="setting-item">
                <span class="setting-label">Backup Automático</span>
                <input type="checkbox" class="setting-input" checked onchange="toggleAutoBackup(this.checked)">
            </div>
        </div>
    `;
}

// Funcionalidades do Terminal
function handleTerminalInput(event) {
    if (event.key === 'Enter') {
        const input = document.getElementById('terminal-input');
        const output = document.getElementById('terminal-output');
        const command = input.value.trim();
        
        if (command) {
            output.textContent += '\n$ ' + command;
            const result = executeCommand(command);
            output.textContent += '\n' + result;
            output.scrollTop = output.scrollHeight;
        }
        
        input.value = '';
    }
}

function executeCommand(command) {
    const parts = command.split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);
    
    switch(cmd) {
        case 'help':
            return `Comandos disponíveis:
help - Mostra esta ajuda
ls - Lista arquivos e diretórios
cd [dir] - Navega para diretório
mkdir [name] - Cria diretório
touch [name] - Cria arquivo
cat [file] - Mostra conteúdo do arquivo
whoami - Mostra usuário atual
clear - Limpa terminal
date - Mostra data e hora`;
        
        case 'ls':
            return listFiles(currentPath);
        
        case 'cd':
            if (args[0]) {
                return changeDirectory(args[0]);
            }
            return 'Uso: cd [diretório]';
        
        case 'mkdir':
            if (args[0]) {
                return createDirectory(args[0]);
            }
            return 'Uso: mkdir [nome]';
        
        case 'touch':
            if (args[0]) {
                return createFileInPath(args[0]);
            }
            return 'Uso: touch [nome]';
        
        case 'cat':
            if (args[0]) {
                return readFile(args[0]);
            }
            return 'Uso: cat [arquivo]';
        
        case 'whoami':
            return currentUser ? currentUser.email : 'visitante';
        
        case 'clear':
            document.getElementById('terminal-output').textContent = '';
            return '';
        
        case 'date':
            return new Date().toLocaleString('pt-BR');
        
        default:
            return `Comando não encontrado: ${cmd}`;
    }
}

function listFiles(path) {
    const node = traversePath(path);
    if (!node || node.type !== 'directory') {
        return 'Diretório não encontrado';
    }
    
    const files = Object.keys(node.children || {});
    return files.length > 0 ? files.join('\n') : 'Diretório vazio';
}

function changeDirectory(dir) {
    if (dir === '..') {
        const parts = currentPath.split('/').filter(p => p);
        parts.pop();
        currentPath = '/' + parts.join('/');
        return currentPath === '/' ? '/' : currentPath;
    }
    
    const newPath = currentPath === '/' ? '/' + dir : currentPath + '/' + dir;
    const node = traversePath(newPath);
    
    if (node && node.type === 'directory') {
        currentPath = newPath;
        return currentPath;
    }
    
    return 'Diretório não encontrado';
}

function createDirectory(name) {
    const node = traversePath(currentPath);
    if (node && node.type === 'directory') {
        node.children[name] = { type: 'directory', children: {} };
        saveFileSystem();
        return `Diretório '${name}' criado`;
    }
    return 'Erro ao criar diretório';
}

function createFileInPath(name) {
    const node = traversePath(currentPath);
    if (node && node.type === 'directory') {
        node.children[name] = { type: 'file', content: '' };
        saveFileSystem();
        return `Arquivo '${name}' criado`;
    }
    return 'Erro ao criar arquivo';
}

function readFile(name) {
    const node = traversePath(currentPath);
    if (node && node.type === 'directory' && node.children[name]) {
        const file = node.children[name];
        if (file.type === 'file') {
            return file.content || '(arquivo vazio)';
        }
        return `'${name}' é um diretório';
    }
    return 'Arquivo não encontrado';
}

function traversePath(path) {
    const parts = path.split('/').filter(p => p);
    let current = virtualFileSystem['/'];
    
    for (const part of parts) {
        if (current.children && current.children[part]) {
            current = current.children[part];
        } else {
            return null;
        }
    }
    
    return current;
}

// Gerenciamento de janelas
function focusWindow(windowId) {
    const window = document.getElementById(windowId);
    if (window) {
        windowZIndex++;
        window.style.zIndex = windowZIndex;
    }
}

function closeWindow(windowId) {
    const window = document.getElementById(windowId);
    if (window) {
        window.remove();
        openWindows = openWindows.filter(w => w.id !== windowId);
    }
}

function minimizeWindow(windowId) {
    const window = document.getElementById(windowId);
    if (window) {
        window.style.display = 'none';
    }
}

function maximizeWindow(windowId) {
    const window = document.getElementById(windowId);
    if (window) {
        if (window.style.width === '100%') {
            window.style.width = '';
            window.style.height = '';
            window.style.left = '';
            window.style.top = '';
        } else {
            window.style.width = '100%';
            window.style.height = 'calc(100% - 48px)';
            window.style.left = '0';
            window.style.top = '0';
        }
    }
}

// Drag and drop para janelas
let draggedWindow = null;
let dragOffset = { x: 0, y: 0 };

function startDrag(event, windowId) {
    draggedWindow = document.getElementById(windowId);
    const rect = draggedWindow.getBoundingClientRect();
    dragOffset.x = event.clientX - rect.left;
    dragOffset.y = event.clientY - rect.top;
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    
    focusWindow(windowId);
}

function drag(event) {
    if (draggedWindow) {
        draggedWindow.style.left = (event.clientX - dragOffset.x) + 'px';
        draggedWindow.style.top = (event.clientY - dragOffset.y) + 'px';
    }
}

function stopDrag() {
    draggedWindow = null;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
}

// Sistema de autenticação
function showLogin() {
    document.getElementById('login-modal').classList.remove('hidden');
    document.getElementById('start-menu').classList.add('hidden');
}

function closeLogin() {
    document.getElementById('login-modal').classList.add('hidden');
}

function login() {
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    
    if (!email || !password) {
        showNotification('Preencha todos os campos');
        return;
    }
    
    auth.signInWithEmailAndPassword(email, password)
        .then(function(userCredential) {
            closeLogin();
            showNotification('Login realizado com sucesso!');
        })
        .catch(function(error) {
            showNotification('Erro no login: ' + error.message);
        });
}

function register() {
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    
    if (!email || !password) {
        showNotification('Preencha todos os campos');
        return;
    }
    
    auth.createUserWithEmailAndPassword(email, password)
        .then(function(userCredential) {
            closeLogin();
            showNotification('Conta criada com sucesso!');
        })
        .catch(function(error) {
            showNotification('Erro ao criar conta: ' + error.message);
        });
}

// Firebase functions
function saveFileSystem() {
    database.ref('system/fileSystem').set(virtualFileSystem);
}

function loadUserData() {
    if (currentUser) {
        database.ref('users/' + currentUser.uid).once('value').then(function(snapshot) {
            const userData = snapshot.val();
            if (userData) {
                // Carregar configurações do usuário
                if (userData.settings) {
                    applySettings(userData.settings);
                }
            }
        });
    }
}

function saveUserData() {
    if (currentUser) {
        const userData = {
            email: currentUser.email,
            lastLogin: new Date().toISOString(),
            settings: getUserSettings()
        };
        database.ref('users/' + currentUser.uid).set(userData);
    }
}

// Gerenciador de arquivos
function renderFileList(path) {
    const node = traversePath(path);
    if (!node || node.type !== 'directory') {
        return '<div>Diretório não encontrado</div>';
    }
    
    let html = '';
    if (path !== '/') {
        html += `<div class="file-item" onclick="navigateToParent()">
            <span>📁 ..</span>
        </div>`;
    }
    
    const items = node.children || {};
    for (const [name, item] of Object.entries(items)) {
        const icon = item.type === 'directory' ? '📁' : '📄';
        html += `<div class="file-item" onclick="openFileItem('${name}')">
            <span>${icon} ${name}</span>
        </div>`;
    }
    
    return html || '<div>Diretório vazio</div>';
}

function refreshFiles() {
    const fileList = document.getElementById('file-list');
    if (fileList) {
        fileList.innerHTML = renderFileList(currentPath);
    }
}

function openFileItem(name) {
    const node = traversePath(currentPath);
    if (node && node.children && node.children[name]) {
        const item = node.children[name];
        if (item.type === 'directory') {
            currentPath = currentPath === '/' ? '/' + name : currentPath + '/' + name;
            refreshFiles();
        } else {
            // Abrir arquivo no editor
            openApp('textEditor');
            setTimeout(() => {
                const textarea = document.getElementById('editor-content');
                if (textarea) {
                    textarea.value = item.content || '';
                }
            }, 100);
        }
    }
}

function navigateToParent() {
    changeDirectory('..');
    refreshFiles();
}

function createFile() {
    const name = prompt('Nome do arquivo:');
    if (name) {
        createFileInPath(name);
        refreshFiles();
    }
}

function createFolder() {
    const name = prompt('Nome da pasta:');
    if (name) {
        createDirectory(name);
        refreshFiles();
    }
}

function deleteFile() {
    const name = prompt('Nome do arquivo/pasta para excluir:');
    if (name) {
        const node = traversePath(currentPath);
        if (node && node.children && node.children[name]) {
            delete node.children[name];
            saveFileSystem();
            refreshFiles();
            showNotification(`'${name}' excluído com sucesso`);
        }
    }
}

// Editor de texto
function newFile() {
    const textarea = document.getElementById('editor-content');
    if (textarea) {
        textarea.value = '';
        textarea.dataset.filename = '';
    }
}

function saveFile() {
    const textarea = document.getElementById('editor-content');
    if (textarea) {
        const content = textarea.value;
        const filename = textarea.dataset.filename || prompt('Nome do arquivo:');
        
        if (filename) {
            const node = traversePath(currentPath);
            if (node && node.type === 'directory') {
                node.children[filename] = { type: 'file', content: content };
                saveFileSystem();
                textarea.dataset.filename = filename;
                showNotification(`Arquivo '${filename}' salvo`);
            }
        }
    }
}

function openFile() {
    const name = prompt('Nome do arquivo:');
    if (name) {
        const node = traversePath(currentPath);
        if (node && node.children && node.children[name]) {
            const file = node.children[name];
            if (file.type === 'file') {
                const textarea = document.getElementById('editor-content');
                if (textarea) {
                    textarea.value = file.content || '';
                    textarea.dataset.filename = name;
                }
            }
        }
    }
}

// Configurações
function changeTheme(theme) {
    if (theme === 'light') {
        document.body.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
    } else {
        document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    saveUserData();
}

function toggleAutoBackup(enabled) {
    if (enabled) {
        setInterval(saveFileSystem, 30000); // Backup a cada 30 segundos
        showNotification('Backup automático ativado');
    } else {
        showNotification('Backup automático desativado');
    }
    saveUserData();
}

function getUserSettings() {
    return {
        theme: document.body.style.background.includes('667eea') ? 'dark' : 'light',
        autoBackup: true
    };
}

function applySettings(settings) {
    if (settings.theme) {
        changeTheme(settings.theme);
    }
}

// Notificações
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(30, 30, 40, 0.95);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Adicionar animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);