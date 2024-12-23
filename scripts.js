document.addEventListener('DOMContentLoaded', () => {
    const products = [
        { name: 'Product 1', prices: { S: 10, M: 12, L: 14 }, discount: 0.1, sizes: ['S', 'M', 'L'], image: 'images/product1.jpg' },
        { name: 'Product 2', prices: { S: 20, M: 22, L: 24 }, discount: 0.2, sizes: ['S', 'M', 'L'], image: 'images/product2.jpg' },
        { name: 'Product 3', prices: { S: 30, M: 32, L: 34 }, discount: 0.15, sizes: ['S', 'M', 'L'], image: 'images/product3.jpg' },
        { name: 'Product 4', prices: { S: 40, M: 42, L: 44 }, discount: 0.25, sizes: ['S', 'M', 'L'], image: 'images/product4.jpg' },
        { name: 'Product 5', prices: { S: 50, M: 52, L: 54 }, discount: 0.1, sizes: ['S', 'M', 'L'], image: 'images/product5.jpg' },
        { name: 'Product 6', prices: { S: 60, M: 62, L: 64 }, discount: 0.2, sizes: ['S', 'M', 'L'], image: 'images/product6.jpg' },
        { name: 'Product 7', prices: { S: 70, M: 72, L: 74 }, discount: 0.15, sizes: ['S', 'M', 'L'], image: 'images/product7.jpg' },
        { name: 'Product 8', prices: { S: 80, M: 82, L: 84 }, discount: 0.25, sizes: ['S', 'M', 'L'], image: 'images/product8.jpg' },
        { name: 'Product 9', prices: { S: 90, M: 92, L: 94 }, discount: 0.1, sizes: ['S', 'M', 'L'], image: 'images/product9.jpg' },
        { name: 'Product 10', prices: { S: 100, M: 102, L: 104 }, discount: 0.2, sizes: ['S', 'M', 'L'], image: 'images/product10.jpg' }
    ];

    const productContainer = document.getElementById('product-container');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const itemTotal = item.discountedPrice * item.quantity;
            total += itemTotal;
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-details">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <p>${item.name} - ${item.size}</p>
                    <p>Quantity: <input type="number" value="${item.quantity}" min="1" data-name="${item.name}" data-size="${item.size}"></p>
                    <p>Price: $${item.discountedPrice.toFixed(2)}</p>
                    <p>Total: $${itemTotal.toFixed(2)}</p>
                </div>
                <button class="remove-item" data-name="${item.name}" data-size="${item.size}">&times;</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function addToCart(product, size, quantity) {
        const existingItem = cart.find(item => item.name === product.name && item.size === size);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            const price = product.prices[size];
            const discountedPrice = price - (price * product.discount);
            cart.push({ ...product, size, quantity, discountedPrice });
        }
        updateCart();
    }

    productContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const productCard = event.target.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const product = products.find(p => p.name === productName);
            const size = productCard.querySelector('select').value;
            const quantity = parseInt(productCard.querySelector('input[type="number"]').value, 10);
            addToCart(product, size, quantity);
        }
    });

    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item')) {
            const name = event.target.dataset.name;
            const size = event.target.dataset.size;
            cart = cart.filter(item => !(item.name === name && item.size === size));
            updateCart();
        }
    });

    cartItemsContainer.addEventListener('input', (event) => {
        if (event.target.type === 'number') {
            const name = event.target.dataset.name;
            const size = event.target.dataset.size;
            const quantity = parseInt(event.target.value, 10);
            const item = cart.find(item => item.name === name && item.size === size);
            if (item) {
                item.quantity = quantity;
                updateCart();
            }
        }
    });

    checkoutButton.addEventListener('click', () => {
        window.location.href = 'checkout.html';
    });

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: <span class="original-price">$${product.prices.S}</span> <span class="discounted-price">$${(product.prices.S - (product.prices.S * product.discount)).toFixed(2)}</span></p>
            <label for="size-${product.name}">Size:</label>
            <select id="size-${product.name}">
                ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
            </select>
            <label for="quantity-${product.name}">Quantity:</label>
            <input type="number" id="quantity-${product.name}" value="1" min="1">
            <button>Add to Cart</button>
        `;
        productContainer.appendChild(productCard);

        productCard.querySelector('select').addEventListener('change', (event) => {
            const selectedSize = event.target.value;
            const price = product.prices[selectedSize];
            const discountedPrice = price - (price * product.discount);
            productCard.querySelector('.original-price').textContent = `$${price}`;
            productCard.querySelector('.discounted-price').textContent = `$${discountedPrice.toFixed(2)}`;
        });
    });

    updateCart();
});