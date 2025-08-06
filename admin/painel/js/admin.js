document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('loggedIn') !== 'true') {
        window.location.href = '../login.html';
        return;
    }

    let services = [];
    let clients = [];
    let currentEditIndex = null;

    const serviceList = document.getElementById('service-list');
    const clientList = document.getElementById('client-list');
    
    const editServiceModal = document.getElementById('edit-service-modal');
    const editClientModal = document.getElementById('edit-client-modal');
    
    const addServiceForm = document.getElementById('add-service-form');
    const addClientForm = document.getElementById('add-client-form');
    const editServiceForm = document.getElementById('edit-service-form');
    const editClientForm = document.getElementById('edit-client-form');

    async function loadData() {
        try {
            const localServices = localStorage.getItem('mc6_services');
            const localClients = localStorage.getItem('mc6_clients');

            services = localServices ? JSON.parse(localServices) : await (await fetch('../../data/services.json')).json();
            clients = localClients ? JSON.parse(localClients) : await (await fetch('../../data/clients.json')).json();
            
            renderServices();
            renderClients();
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            alert('Não foi possível carregar os arquivos de dados. Verifique o console.');
        }
    }

    function renderServices() {
        serviceList.innerHTML = '';
        services.forEach((service, index) => {
            serviceList.innerHTML += `<li><span>${service.title}</span><button class="edit-btn" data-type="service" data-index="${index}">Editar</button></li>`;
        });
    }

    function renderClients() {
        clientList.innerHTML = '';
        clients.forEach((client, index) => {
            clientList.innerHTML += `<li><span>${client.alt}</span><button class="edit-btn" data-type="client" data-index="${index}">Editar</button></li>`;
        });
    }

    addServiceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newService = {
            title: document.getElementById('service-title').value,
            description: document.getElementById('service-desc').value,
            image: document.getElementById('service-image').value,
            icon: 'fas fa-cogs'
        };
        services.push(newService);
        renderServices();
        saveServicesToLocal();
        e.target.reset();
    });

    addClientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newClient = {
            alt: document.getElementById('client-alt').value,
            image: document.getElementById('client-image').value
        };
        clients.push(newClient);
        renderClients();
        saveClientsToLocal();
        e.target.reset();
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            currentEditIndex = parseInt(e.target.dataset.index);
            const type = e.target.dataset.type;
            if (type === 'service') {
                const service = services[currentEditIndex];
                document.getElementById('edit-service-title').value = service.title;
                document.getElementById('edit-service-desc').value = service.description;
                document.getElementById('edit-service-image').value = service.image;
                document.getElementById('edit-service-icon').value = service.icon;
                editServiceModal.style.display = 'block';
            } else if (type === 'client') {
                const client = clients[currentEditIndex];
                document.getElementById('edit-client-alt').value = client.alt;
                document.getElementById('edit-client-image').value = client.image;
                editClientModal.style.display = 'block';
            }
        }
    });

    editServiceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedService = {
            title: document.getElementById('edit-service-title').value,
            description: document.getElementById('edit-service-desc').value,
            image: document.getElementById('edit-service-image').value,
            icon: document.getElementById('edit-service-icon').value || 'fas fa-cogs'
        };
        services[currentEditIndex] = updatedService;
        renderServices();
        saveServicesToLocal();
        closeAllModals();
    });

    editClientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedClient = {
            alt: document.getElementById('edit-client-alt').value,
            image: document.getElementById('edit-client-image').value
        };
        clients[currentEditIndex] = updatedClient;
        renderClients();
        saveClientsToLocal();
        closeAllModals();
    });
    
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            if (confirm('Tem certeza que deseja remover este item?')) {
                if (editServiceModal.style.display === 'block') {
                    services.splice(currentEditIndex, 1);
                    renderServices();
                    saveServicesToLocal();
                } else if (editClientModal.style.display === 'block') {
                    clients.splice(currentEditIndex, 1);
                    renderClients();
                    saveClientsToLocal();
                }
                closeAllModals();
            }
        }
    });

    function saveServicesToLocal() {
        localStorage.setItem('mc6_services', JSON.stringify(services));
        alert('Serviço atualizado! Atualize a página principal para ver a mudança.');
    }

    function saveClientsToLocal() {
        localStorage.setItem('mc6_clients', JSON.stringify(clients));
        alert('Cliente atualizado! Atualize a página principal para ver a mudança.');
    }

    function closeAllModals() {
        editServiceModal.style.display = 'none';
        editClientModal.style.display = 'none';
        currentEditIndex = null;
    }

    document.querySelectorAll('.close-btn').forEach(btn => btn.addEventListener('click', closeAllModals));
    window.addEventListener('click', (e) => {
        if (e.target === editServiceModal || e.target === editClientModal) {
            closeAllModals();
        }
    });

    loadData();
});