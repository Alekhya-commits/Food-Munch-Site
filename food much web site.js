// --- SCROLL RESTORATION RESET (Forces page to start at the top on reload) ---
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
    // --- SAFE STORAGE HELPERS (Guards against disabled cookies/localStorage errors) ---
    const safeStorage = {
        getItem(key, defaultValue) {
            try {
                return localStorage.getItem(key) || defaultValue;
            } catch (e) {
                return defaultValue;
            }
        },
        setItem(key, value) {
            try {
                localStorage.setItem(key, value);
            } catch (e) {
                // Fallback silently
            }
        }
    };

    // --- STATE MANAGEMENT ---
    let cart = [];
    try {
        cart = JSON.parse(safeStorage.getItem('food_munch_cart', '[]')) || [];
    } catch(e) {
        cart = [];
    }
    const savedTheme = safeStorage.getItem('food_munch_theme', 'light');

    // --- DOM ELEMENTS ---
    const htmlEl = document.documentElement;
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
    const cartCountBadges = document.querySelectorAll('.cart-count-badge');
    const cartItemsContainer = document.getElementById('cartItemsList');
    const cartTotalAmountEl = document.getElementById('cartTotalAmount');
    const checkoutForm = document.getElementById('checkoutForm');
    const newsletterForm = document.getElementById('newsletterForm');
    const backToTopBtn = document.getElementById('backToTop');

    // --- THEME INITIALIZATION ---
    htmlEl.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlEl.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlEl.setAttribute('data-theme', newTheme);
            safeStorage.setItem('food_munch_theme', newTheme);
            updateThemeIcon(newTheme);
            showToast(`Switched to ${newTheme} mode!`, 'info');
        });
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
            themeIcon.style.color = '#F59E0B';
        } else {
            themeIcon.className = 'fas fa-moon';
            themeIcon.style.color = '#475569';
        }
    }

    // --- TOAST NOTIFICATIONS (Premium UX) ---
    function showToast(message, type = 'success') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            container.style.zIndex = '1100';
            document.body.appendChild(container);
        }

        const toastEl = document.createElement('div');
        toastEl.className = `custom-toast show-toast ${type}`;
        
        let iconClass = 'fa-check-circle';
        if (type === 'info') iconClass = 'fa-info-circle';
        if (type === 'warning') iconClass = 'fa-exclamation-triangle';
        if (type === 'danger') iconClass = 'fa-times-circle';

        toastEl.innerHTML = `
            <div class="toast-body d-flex align-items-center">
                <i class="fas ${iconClass} me-2 toast-icon"></i>
                <span class="toast-text">${message}</span>
            </div>
        `;
        
        container.appendChild(toastEl);

        setTimeout(() => {
            toastEl.classList.remove('show-toast');
            toastEl.classList.add('hide-toast');
            setTimeout(() => {
                toastEl.remove();
                if (container.children.length === 0) {
                    container.remove();
                }
            }, 300);
        }, 3000);
    }

    // --- SHOPPING CART LOGIC ---
    function updateCartUI() {
        const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountBadges.forEach(badge => {
            badge.textContent = totalItemsCount;
            if (totalItemsCount > 0) {
                badge.style.display = 'inline-block';
                badge.classList.add('badge-pop');
                setTimeout(() => badge.classList.remove('badge-pop'), 300);
            } else {
                badge.style.display = 'none';
            }
        });

        if (cartItemsContainer) {
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="text-center py-5">
                        <i class="fas fa-shopping-basket fa-3x text-muted mb-3"></i>
                        <p class="text-muted">Your cart is currently empty.</p>
                    </div>
                `;
                if (cartTotalAmountEl) cartTotalAmountEl.textContent = '$0.00';
            } else {
                let html = '';
                let totalAmount = 0;
                cart.forEach((item, index) => {
                    const itemTotal = item.price * item.quantity;
                    totalAmount += itemTotal;
                    html += `
                        <div class="cart-item d-flex align-items-center justify-content-between py-3 border-bottom">
                            <div class="d-flex align-items-center">
                                <img src="${item.img}" class="cart-item-thumb rounded me-3" alt="${item.name}">
                                <div>
                                    <h6 class="mb-0 item-title">${item.name}</h6>
                                    <small class="text-muted font-monospace">$${item.price.toFixed(2)} each</small>
                                </div>
                            </div>
                            <div class="d-flex align-items-center">
                                <div class="quantity-control d-flex align-items-center me-3">
                                    <button class="btn btn-sm btn-outline-secondary btn-qty-minus" data-index="${index}">-</button>
                                    <span class="mx-2 px-2 font-monospace fw-bold">${item.quantity}</span>
                                    <button class="btn btn-sm btn-outline-secondary btn-qty-plus" data-index="${index}">+</button>
                                </div>
                                <span class="fw-bold font-monospace me-3">$${itemTotal.toFixed(2)}</span>
                                <button class="btn btn-sm btn-link text-danger btn-remove" data-index="${index}">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    `;
                });
                cartItemsContainer.innerHTML = html;
                if (cartTotalAmountEl) {
                    cartTotalAmountEl.textContent = `$${totalAmount.toFixed(2)}`;
                }

                // Add quantity & remove event listeners
                document.querySelectorAll('.btn-qty-minus').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const index = parseInt(e.currentTarget.getAttribute('data-index'));
                        if (cart[index].quantity > 1) {
                            cart[index].quantity--;
                        } else {
                            cart.splice(index, 1);
                        }
                        saveCart();
                        updateCartUI();
                    });
                });

                document.querySelectorAll('.btn-qty-plus').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const index = parseInt(e.currentTarget.getAttribute('data-index'));
                        cart[index].quantity++;
                        saveCart();
                        updateCartUI();
                    });
                });

                document.querySelectorAll('.btn-remove').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const index = parseInt(e.currentTarget.getAttribute('data-index'));
                        const removedName = cart[index].name;
                        cart.splice(index, 1);
                        saveCart();
                        updateCartUI();
                        showToast(`Removed ${removedName} from cart.`, 'warning');
                    });
                });
            }
        }
    }

    function saveCart() {
        safeStorage.setItem('food_munch_cart', JSON.stringify(cart));
    }

    function addToCart(id, name, price, img) {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name, price, img, quantity: 1 });
        }
        saveCart();
        updateCartUI();
        showToast(`${name} added to cart!`, 'success');
    }

    // Set up click listeners for Add to Cart buttons
    document.body.addEventListener('click', (e) => {
        const addToCartBtn = e.target.closest('.add-to-cart-btn');
        if (addToCartBtn) {
            e.preventDefault();
            const id = addToCartBtn.getAttribute('data-id');
            const name = addToCartBtn.getAttribute('data-name');
            const price = parseFloat(addToCartBtn.getAttribute('data-price'));
            const img = addToCartBtn.getAttribute('data-img');
            addToCart(id, name, price, img);
        }
    });

    // Initialize UI
    updateCartUI();

    // --- CHECKOUT FORM SUBMISSION ---
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Check form validity
            if (!checkoutForm.checkValidity()) {
                e.stopPropagation();
                checkoutForm.classList.add('was-validated');
                return;
            }

            const name = document.getElementById('checkoutName').value;
            const phone = document.getElementById('checkoutPhone').value;
            const address = document.getElementById('checkoutAddress').value;
            
            // Success Mock checkout
            showToast(`Thank you ${name}! Your order has been placed successfully.`, 'success');
            
            // Reset state
            cart = [];
            saveCart();
            updateCartUI();
            checkoutForm.reset();
            checkoutForm.classList.remove('was-validated');

            // Hide Modal
            const cartModalEl = document.getElementById('cartModal');
            if (cartModalEl) {
                const modalInstance = bootstrap.Modal.getInstance(cartModalEl);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }
        });
    }

    // --- NEWSLETTER FORM SUBMISSION ---
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletterEmail');
            if (emailInput.checkValidity()) {
                showToast(`Awesome! You have successfully subscribed with ${emailInput.value}.`, 'success');
                newsletterForm.reset();
                newsletterForm.classList.remove('was-validated');
            } else {
                newsletterForm.classList.add('was-validated');
            }
        });
    }

    // --- BACK TO TOP BUTTON ---
    window.addEventListener('scroll', () => {
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- SMOOTH ANCHOR LINK SCROLLING ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const targetEl = document.querySelector(href);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // If it's a mobile nav link, close the navbar drawer
                const navbarCollapse = document.getElementById('navbarNavAltMarkup');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse, { toggle: false });
                    bsCollapse.hide();
                }
            }
        });
    });
});
