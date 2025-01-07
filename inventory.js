document.addEventListener('DOMContentLoaded', function () {
    const productForm = document.getElementById('productForm');
    const productTableBody = document.getElementById('productTable').getElementsByTagName('tbody')[0];

    function loadProducts() {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        productTableBody.innerHTML = '';
        products.forEach((product, index) => {
            const row = productTableBody.insertRow();
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.quantity}</td>
                <td>
                    <button onclick="editProduct(${index})" class="btn btn-warning btn-sm">تعديل</button>
                    <button onclick="deleteProduct(${index})" class="btn btn-danger btn-sm">حذف</button>
                </td>
            `;
        });
    }

    function addProduct(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const price = parseFloat(document.getElementById('price').value);
        const quantity = parseInt(document.getElementById('quantity').value);
        const products = JSON.parse(localStorage.getItem('products')) || [];
        products.push({ name, price, quantity });
        localStorage.setItem('products', JSON.stringify(products));
        loadProducts();
        productForm.reset();
    }

    window.editProduct = function (index) {
        const products = JSON.parse(localStorage.getItem('products'));
        const product = products[index];
        const newName = prompt('تعديل اسم المنتج:', product.name);
        const newPrice = prompt('تعديل سعر المنتج:', product.price);
        const newQuantity = prompt('تعديل الكمية:', product.quantity);
    
        if (newName && newPrice && newQuantity) {
            products[index] = { name: newName, price: parseFloat(newPrice), quantity: parseInt(newQuantity) };
            localStorage.setItem('products', JSON.stringify(products));
            loadProducts();
        }
    };
    

    window.deleteProduct = function (index) {
        if (confirm('هل أنت متأكد أنك تريد حذف هذا المنتج؟')) {
            const products = JSON.parse(localStorage.getItem('products'));
            products.splice(index, 1);
            localStorage.setItem('products', JSON.stringify(products));
            loadProducts();
        }
    };
    
    productForm.addEventListener('submit', addProduct);
    loadProducts();
});
