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
