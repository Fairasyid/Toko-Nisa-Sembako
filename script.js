// --- Navbar Scroll Effect ---
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// --- Scroll Reveal Animation ---
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
// Trigger once on load
revealOnScroll();

// --- Payment Modal Logic ---
const modalOverlay = document.getElementById('paymentModal');
const paymentForm = document.getElementById('paymentForm');
const successMessage = document.getElementById('successMessage');
const modalProductName = document.getElementById('modalProductName');
const modalProductPrice = document.getElementById('modalProductPrice');
const modalTotalPrice = document.getElementById('modalTotalPrice');
const successProduct = document.getElementById('successProduct');
const btnSubmit = document.querySelector('.btn-submit');
const btnText = document.querySelector('.btn-text');
const loader = document.querySelector('.loader');

// Format Currency
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

// Open Modal
const openPayment = (productName, price) => {
    // Reset Form
    paymentForm.reset();
    paymentForm.classList.remove('hidden');
    successMessage.classList.add('hidden');
    btnSubmit.disabled = false;
    btnText.classList.remove('hidden');
    loader.classList.add('hidden');

    // Set Data
    modalProductName.textContent = productName;
    modalProductPrice.textContent = formatRupiah(price);
    modalTotalPrice.textContent = formatRupiah(price + 10000); // Admin/Shipping mock fee

    // For success message
    successProduct.textContent = productName;

    // Show Modal
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling underneath
};

// Close Modal
const closePayment = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
};

// Handle Form Submit
paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Show Loading
    btnText.classList.add('hidden');
    loader.classList.remove('hidden');
    btnSubmit.disabled = true;

    // Simulate API Call / Processing (1.5 seconds)
    setTimeout(() => {
        paymentForm.classList.add('hidden');
        successMessage.classList.remove('hidden');
    }, 1500);
});

// --- Cart Logic ---
let cart = [];

const cartBtn = document.getElementById('cartBtn');
const cartBadge = document.getElementById('cartBadge');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalPriceEl = document.getElementById('cartTotalPrice');
const checkoutBtn = document.querySelector('.btn-checkout');

// Toggle Cart Sidebar
cartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

window.closeCart = () => {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
};

// Add to Cart Function
window.addToCart = (id, name, price, image) => {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }

    updateCartIcon();
    renderCart();

    // Pulse animation for badge
    cartBadge.classList.remove('pulse-badge');
    void cartBadge.offsetWidth; // Trigger reflow
    cartBadge.classList.add('pulse-badge');
};

// Update Cart Icon Badge
const updateCartIcon = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
};

// Render Cart Items
const renderCart = () => {
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Keranjang Anda masih kosong.</div>';
        cartTotalPriceEl.textContent = 'Rp 0';
        checkoutBtn.disabled = true;
        return;
    }

    let totalPrice = 0;

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;

        const itemEl = document.createElement('div');
        itemEl.classList.add('cart-item');
        itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${formatRupiah(item.price)}</div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})"><i class="fa-solid fa-trash"></i></button>
        `;
        cartItemsContainer.appendChild(itemEl);
    });

    cartTotalPriceEl.textContent = formatRupiah(totalPrice);
    checkoutBtn.disabled = false;
};

// Update Quantity
window.updateQty = (id, change) => {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCartIcon();
            renderCart();
        }
    }
};

// Remove from Cart
window.removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    updateCartIcon();
    renderCart();
};

// Checkout Integration
window.openPaymentFromCart = () => {
    closeCart();

    // Calculate total
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemNames = cart.map(item => `${item.quantity}x ${item.name}`).join(', ');

    // Reset Form
    paymentForm.reset();
    paymentForm.classList.remove('hidden');
    successMessage.classList.add('hidden');
    btnSubmit.disabled = false;
    btnText.classList.remove('hidden');
    loader.classList.add('hidden');

    // Set Data
    modalProductName.textContent = `${cart.length} Jenis Produk`;
    modalProductPrice.textContent = formatRupiah(totalPrice);
    modalTotalPrice.textContent = formatRupiah(totalPrice + 10000); // Admin/Shipping mock fee

    // For success message
    successProduct.textContent = itemNames;

    // Show Modal
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
};

// --- Contact Form Handling ---
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('.btn-submit');
        const originalText = btn.innerHTML;

        // Form Data
        const formData = new FormData(contactForm);

        // Change button text to indicate loading
        btn.innerHTML = 'Mengirim... <i class="fa-solid fa-spinner fa-spin" style="margin-left: 8px;"></i>';
        btn.disabled = true;

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                alert('Terima kasih! Pesan Anda telah berhasil dikirim ke bimaardi0398@gmail.com. Kami akan membalasnya segera.');
                contactForm.reset();
            } else {
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    alert(data["errors"].map(error => error["message"]).join(", "));
                } else {
                    alert('Maaf, terjadi kesalahan saat mengirim pesan. Silakan coba lagi nanti.');
                }
            }
        } catch (error) {
            alert('Maaf, terjadi masalah koneksi. Silakan periksa koneksi internet Anda.');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });
}
