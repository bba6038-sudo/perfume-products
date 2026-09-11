const perfumesContainer = document.querySelector('#perfumesContainer');
const API_URL = 'https://6a9de8f32f89be7fb70d832c.mockapi.io/perfums';

async function loadPerfumes() {
    try {
        const response = await fetch('https://6a9de8f32f89be7fb70d832c.mockapi.io/perfums');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const perfumeProducts = data.filter(item => item.name && item.price);

        displayPerfumes(perfumeProducts);

    } catch (error) {
        console.error('Error loading perfume products:', error);
    }
}

function displayPerfumes(perfumes) {
    if (!perfumesContainer) return;
    perfumesContainer.innerHTML = '';

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    perfumes.forEach(perfume => {
        const existingCartItem = cart.find(item => item.id === perfume.id);
        const initialQuantity = existingCartItem ? existingCartItem.quantity : 0;

        const perfumeCard = document.createElement('div');
        perfumeCard.className = 'product-card group relative flex flex-col bg-shell border border-line rounded-xl p-3 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden';

        perfumeCard.innerHTML = `
            <button onclick="deleteProduct('${perfume.id}')"
                    aria-label="Delete product"
                    class="absolute top-3 right-3 p-2 bg-white/90 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-all duration-200 shadow-sm hover:shadow active:scale-95 z-20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </button>

            <div class="relative w-full aspect-square rounded-md overflow-hidden mb-4 flex items-center justify-center bg-white/50 p-4">
                <img src="${perfume.image}" alt="${perfume.name}" class="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
            </div>

            <div class="flex flex-col flex-grow">
                <span class="text-xs font-medium text-taupe uppercase tracking-wider mb-1">${perfume.category}</span>
                <h3 class="text-base font-semibold text-ink mb-2 line-clamp-1">${perfume.name}</h3>

                <div class="flex items-center flex-wrap justify-between mt-auto pt-2 border-t border-line/40">
                    <p class="product-price text-lg font-bold text-gold">$${perfume.price}</p>
                    <button id="add-to-cart-${perfume.id}" class="add-to-cart w-8 h-8 rounded-full hover:bg-gold hover:text-white border border-line flex items-center justify-center text-ink hover:text-white active:scale-90 transition-all duration-200">
                        <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" /></svg>
                    </button>
                </div>

                <div class="action-container mt-3">
                    <button class="quickAddBtn w-full py-2 text-xs font-semibold text-ink border border-line rounded-lg hover:bg-gold hover:text-white hover:border-gold transition-all duration-300 ${initialQuantity > 0 ? 'hidden' : ''}">
                        Add to Cart
                    </button>

                    <div class="counterBox flex items-center justify-between border border-gold rounded-lg p-1 bg-white/80 ${initialQuantity > 0 ? '' : 'hidden'}">
                        <button class="minusBtn w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gold hover:text-white rounded-md font-bold transition-all text-sm">-</button>
                        <span class="quantityVal font-bold text-sm text-ink px-2">${initialQuantity || 1}</span>
                        <button class="plusBtn w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gold hover:text-white rounded-md font-bold transition-all text-sm">+</button>
                    </div>
                </div>
            </div>
        `;

        const quickAddBtn = perfumeCard.querySelector('.quickAddBtn');
        const counterBox = perfumeCard.querySelector('.counterBox');
        const minusBtn = perfumeCard.querySelector('.minusBtn');
        const plusBtn = perfumeCard.querySelector('.plusBtn');
        const quantityVal = perfumeCard.querySelector('.quantityVal');
        const addToCartBtn = perfumeCard.querySelector('.add-to-cart');

        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const isInWishlist = wishlist.some(item => item.id === perfume.id);

        if (isInWishlist) {
            addToCartBtn.classList.add('text-red-500', 'scale-110');
            addToCartBtn.classList.remove('text-gray-400');
        } else {
            addToCartBtn.classList.add('text-gray-400');
            addToCartBtn.classList.remove('text-red-500', 'scale-110');
        }
        addToCartBtn.classList.add('transition-all', 'duration-300', 'ease-in-out');

        addToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            let currentWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            const index = currentWishlist.findIndex(item => item.id === perfume.id);
            if (index > -1) {
                currentWishlist.splice(index, 1);
                addToCartBtn.classList.remove('text-red-500', 'scale-110');
                addToCartBtn.classList.add('text-gray-400');
            } else {
                currentWishlist.push(perfume);
                addToCartBtn.classList.remove('text-gray-400');
                addToCartBtn.classList.add('text-red-500', 'scale-125');

                setTimeout(() => {
                    addToCartBtn.classList.remove('scale-125');
                    addToCartBtn.classList.add('scale-110');
                }, 150);
            }
            localStorage.setItem('wishlist', JSON.stringify(currentWishlist));

            if (typeof renderBottomCheckoutBar === 'function') renderBottomCheckoutBar();
            addToCartBtn.blur();
        });

        quickAddBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleAddToCart(perfume);
            showAddStatus('Added to Cart');

            quickAddBtn.classList.add('hidden');
            counterBox.classList.remove('hidden');
            quantityVal.textContent = 1;

            if (typeof renderBottomCheckoutBar === 'function') renderBottomCheckoutBar();
        });

        plusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
            let item = currentCart.find(i => i.id === perfume.id);

            if (item) {
                item.quantity += 1;
                item.totalPrice = item.quantity * parseFloat(perfume.price);
                quantityVal.textContent = item.quantity;

                localStorage.setItem('cart', JSON.stringify(currentCart));
                if (typeof renderBottomCheckoutBar === 'function') renderBottomCheckoutBar();
            }
        });

        minusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
            let item = currentCart.find(i => i.id === perfume.id);

            if (item) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                    item.totalPrice = item.quantity * parseFloat(perfume.price);
                    quantityVal.textContent = item.quantity;
                } else {
                    currentCart = currentCart.filter(i => i.id !== perfume.id);
                    counterBox.classList.add('hidden');
                    quickAddBtn.classList.remove('hidden');
                }

                localStorage.setItem('cart', JSON.stringify(currentCart));
                if (typeof renderBottomCheckoutBar === 'function') renderBottomCheckoutBar();
            }
        });

        perfumesContainer.appendChild(perfumeCard);
    });
}

function handleAddToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
        existingProduct.totalPrice = existingProduct.quantity * parseFloat(product.price);
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            image: product.image,
            category: product.category,
            quantity: 1,
            totalPrice: parseFloat(product.price),
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

async function deleteProduct(productId) {
    if (!confirm) return;

    try {
        const response = await fetch(`${API_URL}/${productId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            loadPerfumes();
        } else {
            console.error('Error deleting product:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const showAddStatus = (message = 'Added to Cart') => {
    const toast = document.createElement('div');
    toast.className = `
        custom-toast fixed left-1/2 -translate-x-1/2 z-[9999] 
        bottom-20 lg:bottom-20
        flex items-center gap-3.5
        bg-gradient-to-br from-[#f5ead9] to-[#ecd9bd]
        text-[#4a3a28]
        px-4 py-3 sm:pl-5 sm:pr-6 sm:py-3.5 rounded-2xl
        shadow-[0_12px_35px_rgba(0,0,0,0.18)]
        ring-1 ring-[#c9a876]/40
        backdrop-blur-md
        w-max max-w-[90vw] whitespace-nowrap
        translate-y-8 opacity-0 scale-95
        transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        pointer-events-none
    `.replace(/\s+/g, ' ').trim();

    toast.innerHTML = `
        <div class="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#a9793f]/10 flex-shrink-0">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-[#a9793f]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 2a1 1 0 000 2h.5v1.5a2.5 2.5 0 00-1.5 1.34C6.5 7.2 6 8.1 6 9v9a3 3 0 003 3h6a3 3 0 003-3V9c0-.9-.5-1.8-1-2.16A2.5 2.5 0 0015.5 5.5V4H16a1 1 0 100-2H9zm1.5 4h3v.5a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5V6z"/>
            </svg>
        </div>
        <div class="flex flex-col gap-0.5 min-w-0">
            <span class="text-[13px] sm:text-[14px] font-semibold tracking-wide leading-none truncate">${message}</span>
            <span class="text-[10px] sm:text-[11px] text-[#8a7357] tracking-wider leading-none mt-0.5 truncate">Thank you for your trust</span>
        </div>
        <div class="w-px h-7 sm:h-8 bg-[#c9a876]/30 mx-0.5 flex-shrink-0"></div>
        <svg class="w-4 h-4 text-[#c9a876] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-8', 'opacity-0', 'scale-95');
    });

    setTimeout(() => {
        toast.classList.add('translate-y-8', 'opacity-0', 'scale-95');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
};

function renderBottomCheckoutBar(phoneNumber = "9647783156631") {
    let bottomBarContainer = document.querySelector('#bottomCheckoutBar');
    
    if (!bottomBarContainer) {
        bottomBarContainer = document.createElement('div');
        bottomBarContainer.id = 'bottomCheckoutBar';
        document.body.appendChild(bottomBarContainer);
    }

    bottomBarContainer.innerHTML = '';

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) return;

    const grandTotal = cart.reduce((total, item) => {
        const itemPrice = parseFloat(item.price) || 0;
        const itemQty = parseInt(item.quantity) || 1;
        return total + (itemPrice * itemQty);
    }, 0);

    let messageText = "Hello, I would like to complete my order for the following perfumes:\n\n";
    cart.forEach((item, index) => {
        const itemTotal = (parseFloat(item.price) * parseInt(item.quantity)).toFixed(2);
        messageText += `${index + 1}. *${item.name}*\n`;
        messageText += `   • Quantity: ${item.quantity}\n`;
        messageText += `   • Price: $${itemTotal}\n\n`;
    });
    messageText += `*Grand Total:* $${grandTotal.toFixed(2)}`;

    const encodedMessage = encodeURIComponent(messageText);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    const mainWrapper = document.createElement('div');
    mainWrapper.className = "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50 flex items-center justify-between gap-4";

    const priceBox = document.createElement('div');
    priceBox.className = "flex flex-col";

    const priceLabel = document.createElement('span');
    priceLabel.className = "text-xs text-gray-500";
    priceLabel.textContent = "Grand Total";

    const priceAmount = document.createElement('span');
    priceAmount.className = "text-xl font-bold text-emerald-600";
    priceAmount.textContent = `$${grandTotal.toFixed(2)}`;

    priceBox.appendChild(priceLabel);
    priceBox.appendChild(priceAmount);

    const whatsappButton = document.createElement('a');
    whatsappButton.href = whatsappURL;
    whatsappButton.target = "_blank";
    whatsappButton.rel = "noopener noreferrer";
    whatsappButton.className = "flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all active:scale-95";

    const whatsappIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    whatsappIcon.setAttribute("class", "w-5 h-5 fill-current");
    whatsappIcon.setAttribute("viewBox", "0 0 24 24");
    whatsappIcon.innerHTML = `<path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>`;

    const buttonText = document.createElement('span');
    buttonText.textContent = "Checkout via WhatsApp ";
    buttonText.className = "text-xs";

    whatsappButton.appendChild(whatsappIcon);
    whatsappButton.appendChild(buttonText);

    whatsappButton.addEventListener('click', () => {
        localStorage.removeItem('cart');
        localStorage.removeItem('quantity');
        bottomBarContainer.innerHTML = '';
    });

    mainWrapper.appendChild(priceBox);
    mainWrapper.appendChild(whatsappButton);

    bottomBarContainer.appendChild(mainWrapper);

    document.body.appendChild(bottomBarContainer);
}

async function subscribe() {
    const SUBSCRIBERS_API_URL = 'https://6a9de8f32f89be7fb70d832c.mockapi.io/subscribers';
    const perfumeForm = document.getElementById('userForm');
    const userEmail = document.getElementById('userEmail');
    const userSubmit = document.getElementById('userSubmit');

    if (!perfumeForm) return;

    perfumeForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const emailValue = userEmail ? userEmail.value.trim() : '';

        if (userEmail) userEmail.disabled = true;
        if (userSubmit) {
            userSubmit.disabled = true;
            userSubmit.textContent = 'Subscribing...';
        }

        try {
            const response = await fetch(SUBSCRIBERS_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: emailValue,
                    type: 'subscriber',
                    subscribedAt: new Date().toISOString()
                }),
            });

            if (response.ok) {
                if (typeof showAddStatus === 'function') {
                    showAddStatus('Subscribed successfully!');
                } else {
                    alert('Subscribed successfully!');
                }
                perfumeForm.reset();
            } else {
                if (typeof showAddStatus === 'function') {
                    showAddStatus('Failed to subscribe. Please try again.');
                }
            }
        } catch (error) {
            console.error('Subscription Error:', error);
            if (typeof showAddStatus === 'function') {
                showAddStatus('Connection error. Please try again.');
            }
        } finally {
            setTimeout(() => {
                if (userSubmit) {
                    userSubmit.textContent = 'Subscribe';
                    userSubmit.disabled = false;
                }
                if (userEmail) userEmail.disabled = false;
            }, 2000);
        }
    });
}

loadPerfumes();
renderBottomCheckoutBar();
subscribe();

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileNav.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!mobileNav.contains(e.target) && !menuToggle.contains(e.target)) {
                mobileNav.classList.add('hidden');
            }
        });
    }
});
let isArabic = false;

window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'ar,en',
        autoDisplay: false
    }, 'google_translate_element');
};

function hideGoogleElements() {
    const googleIframe = document.querySelector('.goog-te-banner-frame, iframe.goog-te-banner-frame');
    if (googleIframe) {
        googleIframe.style.setProperty('display', 'none', 'important');
        googleIframe.style.setProperty('visibility', 'hidden', 'important');
    }

    document.body.style.setProperty('top', '0px', 'important');
    document.body.style.setProperty('margin-top', '0px', 'important');
    document.documentElement.style.setProperty('top', '0px', 'important');
    document.body.style.setProperty('position', 'static', 'important');

    const skiptranslateElements = document.querySelectorAll('.skiptranslate, .goog-logo-link');
    skiptranslateElements.forEach(el => {
        el.style.setProperty('display', 'none', 'important');
    });
}

function toggleTranslation() {
    const googleSelect = document.querySelector('.goog-te-combo');

    if (googleSelect) {
        const targetLang = isArabic ? 'en' : 'ar';
        googleSelect.value = targetLang;
        googleSelect.dispatchEvent(new Event('change'));

        document.documentElement.dir = targetLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = targetLang;

        const langSpan = document.getElementById('lang-text');
        if (langSpan) {
            langSpan.textContent = targetLang === 'ar' ? 'English' : 'العربية';
        }

        isArabic = !isArabic;

        hideGoogleElements();
    } else {
        setTimeout(toggleTranslation, 100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const translateBtn = document.getElementById('btn-translate-ar');
    if (translateBtn) {
        translateBtn.addEventListener('click', toggleTranslation);
    }

    const googleScript = document.createElement('script');
    googleScript.type = 'text/javascript';
    googleScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(googleScript);

    
    const bodyObserver = new MutationObserver(() => {
        if (document.body.style.top !== '0px' || document.body.style.marginTop !== '0px') {
            hideGoogleElements();
        }
    });

     
    bodyObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ['style']
    });
});

