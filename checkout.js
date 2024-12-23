document.addEventListener('DOMContentLoaded', () => {
    const orderSummary = document.getElementById('order-summary');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const loggedInUser = localStorage.getItem('loggedInUser') || 'Unknown User';

    function displayOrderSummary() {
        orderSummary.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const itemTotal = item.discountedPrice * item.quantity;
            total += itemTotal;
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <p>${item.name} - ${item.size}</p>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: $${item.discountedPrice.toFixed(2)}</p>
                <p>Total: $${itemTotal.toFixed(2)}</p>
            `;
            orderSummary.appendChild(orderItem);
        });
        const orderTotal = document.createElement('div');
        orderTotal.className = 'order-total';
        orderTotal.innerHTML = `<p>Total: $${total.toFixed(2)}</p>`;
        orderSummary.appendChild(orderTotal);
    }

    function downloadExcel(cart, customerDetails) {
        const wb = XLSX.utils.book_new();
        const wsData = [
            ['Product Name', 'Size', 'Quantity', 'Price', 'Total'],
            ...cart.map(item => [
                item.name,
                item.size,
                item.quantity,
                item.discountedPrice.toFixed(2),
                (item.discountedPrice * item.quantity).toFixed(2)
            ]),
            [],
            ['Customer Details'],
            ['Name', customerDetails.name],
            ['Mobile', customerDetails.mobile],
            ['Address', customerDetails.address],
            ['Logged In User', loggedInUser]
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Order Summary');
        XLSX.writeFile(wb, 'order_summary.xlsx');
    }

    function saveToGoogleSheet(cart, customerDetails) {
        const scriptURL = '1vbMWTCGZzBLmF4HcyQMbewVI5hwKpLwMIO6kEy0ZKBI';
        const formData = new FormData();
        formData.append('cart', JSON.stringify(cart));
        formData.append('customerDetails', JSON.stringify(customerDetails));
        formData.append('loggedInUser', loggedInUser);

        fetch(scriptURL, { method: 'POST', body: formData })
            .then(response => console.log('Success!', response))
            .catch(error => console.error('Error!', error.message));
    }

    document.getElementById('customer-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const customerDetails = {
            name: document.getElementById('customer-name').value,
            mobile: document.getElementById('customer-mobile').value,
            address: document.getElementById('customer-address').value
        };
        downloadExcel(cart, customerDetails);
        saveToGoogleSheet(cart, customerDetails);
        alert('Order placed successfully!');
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    });

    displayOrderSummary();
});