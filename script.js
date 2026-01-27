document.addEventListener('DOMContentLoaded', () => {
    // Sidebar Elements
    const mainLogo = document.querySelector('.main-logo');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const pinToggle = document.getElementById('sidebar-pin');


    // Mobile Toggle
    if (mainLogo) {
        mainLogo.addEventListener('click', () => {
            // Only toggle on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('active');
            }
        });
    }

    // Pin Toggle Logic
    if (pinToggle) {
        pinToggle.addEventListener('change', () => {
            if (pinToggle.checked) {
                sidebar.classList.add('pinned');
                mainContent.classList.add('pinned');
            } else {
                sidebar.classList.remove('pinned');
                mainContent.classList.remove('pinned');
            }
        });
    }

    // Handle responsive sidebar on resize
    window.addEventListener('resize', () => {
        // Reset manual styles if returning to desktop
        if (window.innerWidth > 768) {
            sidebar.style.left = '0'; // Default visible
        } else {
            sidebar.classList.remove('active'); // Hide by default on mobile
        }
    });

    // Menu Active State & Navigation
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.section-content');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all
            menuItems.forEach(i => i.classList.remove('active'));
            // Add active to current
            item.classList.add('active');

            // Handle Navigation
            const target = item.getAttribute('data-target');
            if (target) {
                // Hide all sections
                sections.forEach(section => section.classList.add('d-none'));
                // Show target section
                const targetSection = document.getElementById(`${target}-section`);
                if (targetSection) {
                    targetSection.classList.remove('d-none');
                    if (target === 'products') {
                        initProductCharts();
                    } else if (target === 'customers') {
                        renderCustomers();
                    } else if (target === 'calendar') {
                        renderCalendar(currentMonth, currentYear);
                    } else if (target === 'tables') {
                        initTables();
                    }
                }
            }
        });
    });


    // Dark Mode Toggle
    const darkLightToggle = document.querySelector('.dark-light');
    const body = document.querySelector('body');
    const darkIcon = darkLightToggle.querySelector('i');

    if (darkLightToggle) {
        // Check for saved preference
        if (localStorage.getItem('mode') === 'dark') {
            body.classList.add('dark-mode');
            darkIcon.classList.replace('fa-moon', 'fa-sun');
        }

        darkLightToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('mode', 'dark');
                darkIcon.classList.replace('fa-moon', 'fa-sun');
            } else {
                localStorage.setItem('mode', 'light');
                darkIcon.classList.replace('fa-sun', 'fa-moon');
            }
        });
    }

    // Search Interaction
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('focus', () => {
        document.querySelector('.search-bar').style.boxShadow = '0 0 8px rgba(84, 119, 146, 0.5)';
        document.querySelector('.search-bar').style.border = '2px solid rgba(84, 119, 146, 0.5)';
    });
    searchInput.addEventListener('blur', () => {
        document.querySelector('.search-bar').style.boxShadow = 'none';
    });

    // Animation for stats on load
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease-in';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Chart Initialization
    let productSalesChartInstance = null;
    let stockStatusChartInstance = null;

    function initProductCharts() {
        // Prevent re-initialization
        if (productSalesChartInstance || stockStatusChartInstance) return;

        // Product Sales Chart (Bar)
        const ctxSales = document.getElementById('productSalesChart').getContext('2d');
        productSalesChartInstance = new Chart(ctxSales, {
            type: 'bar',
            data: {
                labels: ['Electronics', 'Accessories', 'Furniture', 'Clothing', 'Others'],
                datasets: [{
                    label: 'Sales ($)',
                    data: [12000, 5000, 3000, 8000, 2000],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Stock Status Chart (Doughnut)
        const ctxStock = document.getElementById('stockStatusChart').getContext('2d');
        stockStatusChartInstance = new Chart(ctxStock, {
            type: 'doughnut',
            data: {
                labels: ['In Stock', 'Low Stock', 'Out of Stock', 'Coming Soon'],
                datasets: [{
                    data: [95, 8, 5, 25],
                    backgroundColor: [
                        '#28a745', // Green
                        '#ffc107', // Yellow
                        '#dc3545',  // Red
                        '#0000FF'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                animation: {
                    animateScale: true,
                    animateRotate: true,
                    duration: 2000
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Add New Product Logic
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductForm = document.getElementById('addProductForm');
    const productModalEl = document.getElementById('addProductModal');
    let productModal;

    if (productModalEl) {
        productModal = new bootstrap.Modal(productModalEl);
    }

    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            productModal.show();
        });
    }

    if (addProductForm) {
        addProductForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get Values
            const name = document.getElementById('productName').value;
            const category = document.getElementById('productCategory').value;
            const price = parseFloat(document.getElementById('productPrice').value).toFixed(2);
            const stock = parseInt(document.getElementById('productStock').value);
            const status = stock > 10 ? 'In Stock' : (stock > 0 ? 'Low Stock' : 'Out of Stock');
            const statusClass = stock > 10 ? 'active' : (stock > 0 ? 'pending' : 'pending'); // Using pending for out/low stock for now red/yellow

            // Add to Table
            const tableBody = document.querySelector('#products-section table tbody');
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${Math.floor(1000 + Math.random() * 9000)}</td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <div style="width: 30px; height: 30px; background: #beddf7ff; border-radius: 4px;"></div>
                        <span>${name}</span>
                    </div>
                </td>
                <td>${category}</td>
                <td>$${price}</td>
                <td>${stock}</td>
                <td><span class="status ${statusClass}">${status}</span></td>
                <td>
                    <button class="btn btn-sm btn-light"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-sm btn-light text-danger"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tableBody.appendChild(newRow);

            // Update Total Products Count
            const totalProductsCard = document.querySelector('#products-section .card-value');
            if (totalProductsCard) {
                totalProductsCard.textContent = parseInt(totalProductsCard.textContent) + 1;
            }

            // Update Charts
            if (productSalesChartInstance) {
                // Determine Data Index just by simple logic or random for demo
                // const categoryIndex = productSalesChartInstance.data.labels.indexOf(category);
                // if (categoryIndex > -1) {
                //      productSalesChartInstance.data.datasets[0].data[categoryIndex] += parseFloat(price);
                // }
                // For demo visual effect, let's just increment the category bar somewhat randomly or based on price
                const catIndex = productSalesChartInstance.data.labels.indexOf(category);
                if (catIndex !== -1) {
                    productSalesChartInstance.data.datasets[0].data[catIndex] += parseFloat(price);
                }
                productSalesChartInstance.update();
            }

            if (stockStatusChartInstance) {
                if (stock > 10) { // In Stock
                    stockStatusChartInstance.data.datasets[0].data[0]++;
                } else if (stock > 0) { // Low Stock
                    stockStatusChartInstance.data.datasets[0].data[1]++;
                } else { // Out of Stock
                    stockStatusChartInstance.data.datasets[0].data[2]++;
                }
                stockStatusChartInstance.update();
            }

            // Close Modal & Reset
            productModal.hide();
            addProductForm.reset();
        });
    }

    // Customer Section Logic
    const customersData = [
        { name: "Michael Scott", email: "michael@dundermifflin.com", role: "Manager", spent: "$12,500", avatar: "https://ui-avatars.com/api/?name=Michael+Scott&background=0D8ABC&color=fff", status: "VIP" },
        { name: "Dwight Schrute", email: "dwight@farms.com", role: "Sales", spent: "$450", avatar: "https://ui-avatars.com/api/?name=Dwight+Schrute&background=ffc107&color=fff", status: "New" },
        { name: "Jim Halpert", email: "jim@dundermifflin.com", role: "Sales", spent: "$8,200", avatar: "https://ui-avatars.com/api/?name=Jim+Halpert&background=28a745&color=fff", status: "Active" },
        { name: "Pam Beesly", email: "pam@art.com", role: "Admin", spent: "$1,200", avatar: "https://ui-avatars.com/api/?name=Pam+Beesly&background=dc3545&color=fff", status: "Active" },
        { name: "Ryan Howard", email: "ryan@temp.com", role: "Temp", spent: "$0", avatar: "https://ui-avatars.com/api/?name=Ryan+Howard&background=6c757d&color=fff", status: "Inactive" },
        { name: "Kelly Kapoor", email: "kelly@customer.com", role: "Support", spent: "$5,600", avatar: "https://ui-avatars.com/api/?name=Kelly+Kapoor&background=E83E8C&color=fff", status: "VIP" },
        { name: "Stanley Hudson", email: "stanley@crosswords.com", role: "Sales", spent: "$9,100", avatar: "https://ui-avatars.com/api/?name=Stanley+Hudson&background=343a40&color=fff", status: "Active" },
        { name: "Phyllis Lapin", email: "phyllis@vanceref.com", role: "Sales", spent: "$7,300", avatar: "https://ui-avatars.com/api/?name=Phyllis+Lapin&background=6610f2&color=fff", status: "VIP" }
    ];

    function renderCustomers() {
        const grid = document.getElementById('customerGrid');
        if (!grid || grid.children.length > 0) return; // Prevent re-render

        customersData.forEach((customer, index) => {
            const card = document.createElement('div');
            card.className = 'customer-card';
            card.style.animationDelay = `${index * 0.1}s`; // Staggered animation

            // Set border color based on status
            let borderColor = '#28a745';
            if (customer.status === 'VIP') borderColor = '#0D8ABC';
            if (customer.status === 'Inactive') borderColor = '#6c757d';
            card.style.borderTopColor = borderColor;

            card.innerHTML = `
                <img src="${customer.avatar}" alt="${customer.name}" class="customer-avatar">
                <div class="customer-name">${customer.name}</div>
                <div class="customer-email">${customer.email}</div>
                <div class="badge rounded-pill bg-light text-dark mb-3">${customer.role}</div>
                
                <div class="customer-stats">
                    <div class="stat-item">
                        <span class="stat-value">${customer.spent}</span>
                        <span class="stat-label">Total Spent</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${customer.status}</span>
                        <span class="stat-label">Status</span>
                    </div>
                </div>

                <button class="contact-btn">View Profile</button>
            `;
            grid.appendChild(card);
        });
    }


    // Calendar Logic
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let selectedDate = null;
    let events = {}; // Format: { "YYYY-MM-DD": [{title, time}] }

    function renderCalendar(month, year) {
        const calendarContainer = document.getElementById('calendar');
        if (!calendarContainer) return;

        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        // Header
        let html = `
            <div class="calendar-header">
                 <button id="prevMonth" class="btn btn-sm btn-light"><i class="fa-solid fa-chevron-left"></i></button>
                 <h3>${months[month]} ${year}</h3>
                 <button id="nextMonth" class="btn btn-sm btn-light"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
            <div class="calendar-days-header">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>
            <div class="calendar-grid-days">
        `;

        // Empty cells for days before the 1st
        for (let i = 0; i < firstDay; i++) {
            html += `<div class="day-cell empty"></div>`;
        }

        // Day cells
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isSelected = selectedDate === dateStr;
            const hasEvent = events[dateStr] && events[dateStr].length > 0;

            html += `<div class="day-cell ${isToday ? 'current-day' : ''} ${isSelected ? 'selected-day' : ''} ${hasEvent ? 'has-event' : ''}" data-date="${dateStr}">${i}</div>`;
        }

        html += `</div>`;
        calendarContainer.innerHTML = html;

        // Attach Navigation Listeners
        document.getElementById('prevMonth').addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) { currentMonth = 11; currentYear--; }
            renderCalendar(currentMonth, currentYear);
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) { currentMonth = 0; currentYear++; }
            renderCalendar(currentMonth, currentYear);
        });

        // Attach Day Click Listeners
        document.querySelectorAll('.day-cell:not(.empty)').forEach(cell => {
            cell.addEventListener('click', () => {
                selectedDate = cell.getAttribute('data-date');
                renderCalendar(currentMonth, currentYear); // Re-render to update selection style
                updateEventPanel();
            });
        });
    }

    // Password Toggle Logic
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');

    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Find the input field associated with this toggle button
            // Assuming structure: <input> <span class="toggle-password">
            const passwordInput = btn.previousElementSibling;

            if (passwordInput) {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);

                // Toggle Icon
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-eye');
                    icon.classList.toggle('fa-eye-slash');
                }
            }
        });
    });

    // Event Panel Logic
    function updateEventPanel() {
        const header = document.getElementById('selectedDateHeader');
        const list = document.getElementById('eventsList');

        if (!selectedDate) {
            header.textContent = "Select a date";
            list.innerHTML = '<p class="text-muted small">Click a date to view/add events.</p>';
            return;
        }

        // Format Date for Header
        const dateObj = new Date(selectedDate);
        header.textContent = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

        // Show Events
        const dayEvents = events[selectedDate] || [];
        if (dayEvents.length === 0) {
            list.innerHTML = '<p class="text-muted small" style="color:var(--color-primary);"?>No events scheduled.</p>';
        } else {
            list.innerHTML = dayEvents.map((e, index) => `
                <div class="alert alert-light border d-flex justify-content-between align-items-center p-2 mb-2">
                    <div>
                        <div style="font-weight: bold; font-size: 0.9rem;">${e.title}</div>
                        <div style="font-size: 0.8rem; color: #666;">${e.time}</div>
                    </div>
                </div>
            `).join('');
        }
    }

    // Add Event Listener
    const addEventBtn = document.getElementById('addEventBtn');
    if (addEventBtn) {
        addEventBtn.addEventListener('click', () => {
            if (!selectedDate) {
                alert("Please select a date first.");
                return;
            }
            const title = document.getElementById('eventTitle').value;
            const time = document.getElementById('eventTime').value;

            if (title && time) {
                if (!events[selectedDate]) events[selectedDate] = [];
                events[selectedDate].push({ title, time });

                // Clear inputs
                document.getElementById('eventTitle').value = '';
                document.getElementById('eventTime').value = '';

                // Refresh UI
                updateEventPanel();
                renderCalendar(currentMonth, currentYear); // Updates the dot indicator
            }
        });
    }

    // Nested Menu Toggle
    const submenuTriggers = document.querySelectorAll('.has-submenu > div');
    submenuTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent triggering parent menu actions

            const parentLi = trigger.parentElement;
            const submenu = parentLi.querySelector('.submenu');

            // Toggle open class
            parentLi.classList.toggle('open');
            submenu.classList.toggle('open');
        });
    });

});

// Basic Login Form Submission
const basicLoginForm = document.getElementById('basic-login-form');
if (basicLoginForm) {
    basicLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simple validation or simulation
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email && password) {
            // Determine destination based on screen size or just default
            const sections = document.querySelectorAll('.section-content');
            const menuItems = document.querySelectorAll('.menu-item');

            alert(`Login Successful! Welcome back.`);

            // Redirect to dashboard (simulate)
            // Hide login, show dashboard
            sections.forEach(section => section.classList.add('d-none'));
            document.getElementById('dashboard-section').classList.remove('d-none');

            // Update sidebar active state
            menuItems.forEach(i => i.classList.remove('active'));
            document.querySelector('[data-target="dashboard"]').classList.add('active');
        } else {
            alert('Please enter both email and password.');
        }
    });
}




/* Table & Pagination Logic */
const tableData = {
    'table-basic': Array.from({ length: 15 }, (_, i) => ({ id: i + 1, first: `First${i}`, last: `Last${i}`, user: `@user${i}` })),
    'table-striped': Array.from({ length: 18 }, (_, i) => ({ id: 100 + i, product: `Product ${i}`, category: ['Electronics', 'Home', 'Garden'][i % 3], price: `$${(i * 10.5).toFixed(2)}` })),
    'table-bordered': Array.from({ length: 12 }, (_, i) => ({ invoice: `INV-${2000 + i}`, client: `Client ${i}`, date: `2024-01-${(i % 30) + 1}`, amount: `$${(i * 100).toFixed(2)}` })),
    'table-dark': Array.from({ length: 10 }, (_, i) => ({ task: `Task ${i}`, team: ['Alpha', 'Beta', 'Gamma'][i % 3], progress: `${Math.floor(Math.random() * 100)}%`, status: ['Active', 'Pending', 'Done'][i % 3] })),
    'table-hover': Array.from({ length: 20 }, (_, i) => ({ ticket: `#${5000 + i}`, subject: `Issue ${i}`, priority: ['High', 'Medium', 'Low'][i % 3], status: ['Open', 'Closed', 'In Progress'][i % 3] })),
    'table-js-client': [
        { id: 'CL-001', company: 'Tech Solutions', contact: 'Alice Johnson', country: 'USA' },
        { id: 'CL-002', company: 'Green Earth', contact: 'Bob Smith', country: 'Canada' },
        { id: 'CL-003', company: 'Innovate Ltd', contact: 'Charlie Brown', country: 'UK' },
        { id: 'CL-004', company: 'SoftSystems', contact: 'David Lee', country: 'Japan' },
        { id: 'CL-005', company: 'Alpha Corp', contact: 'Eva Green', country: 'Germany' },
        { id: 'CL-006', company: 'Beta Inc', contact: 'Frank White', country: 'France' },
        { id: 'CL-007', company: 'Gamma Group', contact: 'Grace Hall', country: 'Italy' },
        { id: 'CL-008', company: 'Delta Ops', contact: 'Hank Hill', country: 'USA' },
        { id: 'CL-009', company: 'Epsilon Arts', contact: 'Ivy Rose', country: 'Spain' },
        { id: 'CL-010', company: 'Omega Tech', contact: 'Jack King', country: 'Brazil' },
        { id: 'CL-011', company: 'Zeta Zones', contact: 'Karen Clark', country: 'Australia' },
        { id: 'CL-012', company: 'Theta Things', contact: 'Leo Scott', country: 'Mexico' }
    ]
};

const itemsPerPage = 5;
const currentPages = {
    'table-basic': 1,
    'table-striped': 1,
    'table-bordered': 1,
    'table-dark': 1,
    'table-hover': 1,
    'table-js-client': 1
};

function initTables() {
    // Render all tables initially
    Object.keys(tableData).forEach(tableId => {
        renderTable(tableId, currentPages[tableId]);
        renderPagination(tableId);
    });
}

function renderTable(tableId, page) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    if (!tableBody) return;
    tableBody.innerHTML = '';

    const data = tableData[tableId];
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = data.slice(start, end);

    const hasCheckbox = ['table-basic', 'table-hover'].includes(tableId);

    pageData.forEach(row => {
        const tr = document.createElement('tr');

        // Add Checkbox Cell
        if (hasCheckbox) {
            const tdCheckbox = document.createElement('td');
            tdCheckbox.innerHTML = `<input type="checkbox" class="form-check-input">`;
            tr.appendChild(tdCheckbox);
        }

        Object.values(row).forEach(val => {
            const td = document.createElement('td');
            td.textContent = val;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

function renderPagination(tableId) {
    const pagination = document.getElementById(tableId.replace('table', 'pagination'));
    if (!pagination) return;
    pagination.innerHTML = '';

    const data = tableData[tableId];
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentPage = currentPages[tableId];

    // Prev
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#">Previous</a>`;
    prevLi.onclick = (e) => { e.preventDefault(); changePage(tableId, currentPage - 1); };
    pagination.appendChild(prevLi);

    // Numbers display logic (simple: show all)
    // For better UX with many pages, we might want to truncate, but for now simple is fine.
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.onclick = (e) => { e.preventDefault(); changePage(tableId, i); };
        pagination.appendChild(li);
    }

    // Next
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#">Next</a>`;
    nextLi.onclick = (e) => { e.preventDefault(); changePage(tableId, currentPage + 1); };
    pagination.appendChild(nextLi);
}

function changePage(tableId, newPage) {
    const data = tableData[tableId];
    const totalPages = Math.ceil(data.length / itemsPerPage);
    if (newPage < 1 || newPage > totalPages) return;

    currentPages[tableId] = newPage;
    renderTable(tableId, newPage);
    renderPagination(tableId);
}



// ================= EMAIL MODULE =================

// elements
const emailItems = document.querySelectorAll('.email-item');
const emailList = document.querySelector('.email-list-wrapper');
const emailPreview = document.querySelector('.email-preview-wrapper');

// preview content
const previewSubject = document.getElementById('preview-subject');
const previewMeta = document.getElementById('preview-meta');
const previewBody = document.getElementById('preview-body');

// email click
emailItems.forEach(email => {
    email.addEventListener('click', () => {

        // active state
        emailItems.forEach(item => item.classList.remove('active'));
        email.classList.add('active');

        // read data
        const sender = email.dataset.sender;
        const subject = email.dataset.subject;
        const date = email.dataset.date;
        const body = email.dataset.body;

        // update preview
        previewSubject.textContent = subject;
        previewMeta.textContent = `From: ${sender} · ${date}`;
        previewBody.textContent = body;

        // toggle view (Gmail behavior)
        emailList.classList.add('preview-hidden');
        emailPreview.classList.remove('preview-hidden');
    });
});


// Initialize Tooltips (Safe check)
document.addEventListener('DOMContentLoaded', () => {
    // Re-initialize tooltips if not already done (some might be double init but safe)
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    // Unified Dropdown Logic via Delegation
    const dropdownMap = {
        'shortcutTrigger': 'shortcutDropdown',
        'notificationTrigger': 'notificationDropdown',
        'profileTrigger': 'profileDropdown'
    };

    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('#shortcutTrigger, #notificationTrigger, #profileTrigger');
        const menuClick = e.target.closest('.navbar-dropdown');

        // If clicking inside a open menu, do nothing (allow interaction)
        if (menuClick) return;

        // If clicking a trigger
        if (trigger) {
            // Prevent default only if necessary, but here we just toggle
            // e.stopPropagation(); // Not needed with this logic structure

            const targetMenuId = dropdownMap[trigger.id];
            const targetMenu = document.getElementById(targetMenuId);

            // Close others
            Object.values(dropdownMap).forEach(menuId => {
                if (menuId !== targetMenuId) {
                    const el = document.getElementById(menuId);
                    if (el) el.classList.remove('show');
                }
            });

            // Toggle current
            if (targetMenu) {
                targetMenu.classList.toggle('show');
            }
            return;
        }

        // If clicking outside (not trigger, not menu) -> Close All
        Object.values(dropdownMap).forEach(menuId => {
            const el = document.getElementById(menuId);
            if (el) el.classList.remove('show');
        });
    });
});