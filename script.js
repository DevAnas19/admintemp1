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
    const togglePasswordBtn = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('exampleInputPassword1');

    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Toggle Icon
            const icon = togglePasswordBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    }

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
