document.addEventListener('DOMContentLoaded', function () {
    const transactionForm = document.getElementById('transactionForm');
    const transactionProductSelect = document.getElementById('transactionProduct');
    const cartList = document.getElementById('cartList');
    const cart = [];

    function loadProducts() {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        transactionProductSelect.innerHTML = '';
        products.forEach((product, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = product.name;
            transactionProductSelect.appendChild(option);
        });
    }

    function addToCart() {
        const productIndex = parseInt(transactionProductSelect.value);
        const transactionQuantity = parseInt(document.getElementById('transactionQuantity').value);
        const transactionType = document.getElementById('transactionType').value;
        const products = JSON.parse(localStorage.getItem('products'));
        const product = products[productIndex];

        cart.push({ product, quantity: transactionQuantity, type: transactionType });
        updateCartList();
        transactionForm.reset();
    }

    function updateCartList() {
        cartList.innerHTML = '';
        cart.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.textContent = `${item.product.name} - ${item.quantity} قطعة (${item.type === 'sell' ? 'بيع' : 'شراء'})`;
            const removeButton = document.createElement('button');
            removeButton.className = 'btn btn-danger btn-sm';
            removeButton.textContent = 'إزالة';
            removeButton.onclick = function () {
                cart.splice(index, 1);
                updateCartList();
            };
            listItem.appendChild(removeButton);
            cartList.appendChild(listItem);
        });
    }

    // function completeTransaction() {
    //     const customerName = document.getElementById('customerName').value.trim();
    //     if (customerName === '') {
    //         alert('يرجى إدخال اسم العميل');
    //         return;
    //     }

    //     let customers = JSON.parse(localStorage.getItem('customers')) || [];
    //     customers.push({ name: customerName, invoices: [] });
        
    //     localStorage.setItem('customers', JSON.stringify(customers));
    
    
    //     const products = JSON.parse(localStorage.getItem('products'));
    //     const customer = customers.find(c => c.name === customerName);
    //     const currentDate = new Date().toLocaleString();
    //     const items = [];
    //     let invoiceDetails = `
    //         <style>
    //             body { font-family: Arial, sans-serif; direction: rtl;}
    //             h2 { text-align: center; }
    //             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    //             th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
    //             th { background-color: #f2f2f2; }
    //             p { margin: 10px 0; }
    //         </style>
    //         <h2>فاتورة ${cart[0].type === 'sell' ? 'مبيعات' : 'مشتريات'}</h2>
    //         <p><strong>اسم العميل:</strong> ${customerName}</p>
    //         <p><strong>التاريخ:</strong> ${currentDate}</p>
    //         <table>
    //             <tr>
    //                 <th>المنتج</th>
    //                 <th>الكمية</th>
    //                 <th>السعر الإجمالي (ج.م)</th>
    //             </tr>
    //     `;
    
    //     let totalAmount = 0;
    
    //     cart.forEach(item => {
    //         const product = products.find(p => p.name === item.product.name);
    //         const itemTotalPrice = item.product.price * item.quantity;
    //         totalAmount += itemTotalPrice;
    
    //         if (item.type === 'sell') {
    //             if (product.quantity >= item.quantity) {
    //                 product.quantity -= item.quantity;
    //             } else {
    //                 alert(`كمية غير كافية للمنتج: ${product.name}`);
    //                 return;
    //             }
    //         } else if (item.type === 'buy') {
    //             product.quantity += item.quantity;
    //         }
    //         items.push({
    //             name: item.product.name,
    //             quantity: item.quantity,
    //             totalPrice: itemTotalPrice
    //         });
    
    //         invoiceDetails += `
    //             <tr>
    //                 <td>${item.product.name}</td>
    //                 <td>${item.quantity}</td>
    //                 <td>${itemTotalPrice}</td>
    //             </tr>
    //         `;
    //     });
    
    //     invoiceDetails += `
    //         <tr>
    //             <td colspan="2"><strong>السعر الإجمالي</strong></td>
    //             <td><strong>${totalAmount}</strong></td>
    //         </tr>
    //         </table>
    //     `;

    //     customer.invoices.push({
    //         type: cart[0].type === 'sell' ? 'بيع' : 'شراء',
    //         date: currentDate,
    //         total: totalAmount,
    //         items: items
    //     });
    //     localStorage.setItem('products', JSON.stringify(products));
    //     cart.length = 0;
    //     updateCartList();
    //     loadProducts();
    
    //     const invoiceWindow = window.open('', 'Invoice', 'width=600,height=400');
    //     invoiceWindow.document.write(invoiceDetails);
    //     invoiceWindow.document.close();
    // }
    
    function completeTransaction() {
        const customerName = document.getElementById('customerName').value.trim();
        if (customerName === '') {
            alert('يرجى إدخال اسم العميل');
            return;
        }
    
        // استرجاع العملاء من localStorage أو تعيين مصفوفة فارغة إذا لم توجد
        let customers = JSON.parse(localStorage.getItem('customers')) || [];
        
        // البحث عن العميل في قائمة العملاء
        let customer = customers.find(c => c.name === customerName);
    
        // إذا لم يتم العثور على العميل، يتم إضافته
        if (!customer) {
            customer = { name: customerName, invoices: [] };
            customers.push(customer);
            localStorage.setItem('customers', JSON.stringify(customers)); // تحديث localStorage
        }
    
        // استرجاع المنتجات من localStorage أو تعيين مصفوفة فارغة إذا لم توجد
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const currentDate = new Date().toLocaleDateString();;
        const items = [];
        let invoiceDetails = `
            <style>
                body { font-family: Arial, sans-serif; direction: rtl;}
                h2 { text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
                th { background-color: #f2f2f2; }
                p { margin: 10px 0; }
            </style>
            <h2>فاتورة ${cart[0].type === 'sell' ? 'مبيعات' : 'مشتريات'}</h2>
            <p><strong>اسم العميل:</strong> ${customerName}</p>
            <p><strong>التاريخ:</strong> ${currentDate}</p>
            <table>
                <tr>
                    <th>المنتج</th>
                    <th>الكمية</th>
                    <th>السعر الإجمالي (ج.م)</th>
                </tr>
        `;
    
        let totalAmount = 0;
    
        // تحقق من أن cart ليس فارغًا
        if (!Array.isArray(cart) || cart.length === 0) {
            alert('سلة المشتريات فارغة');
            return;
        }
    
        cart.forEach(item => {
            const product = products.find(p => p.name === item.product.name);
    
            if (!product) {
                alert(`المنتج ${item.product.name} غير موجود في المخزون.`);
                return;
            }
    
            const itemTotalPrice = item.product.price * item.quantity;
            totalAmount += itemTotalPrice;
    
            if (item.type === 'sell') {
                if (product.quantity >= item.quantity) {
                    product.quantity -= item.quantity;
                } else {
                    alert(`كمية غير كافية للمنتج: ${product.name}`);
                    return;
                }
            } else if (item.type === 'buy') {
                product.quantity += item.quantity;
            }
    
            items.push({
                name: item.product.name,
                quantity: item.quantity,
                totalPrice: itemTotalPrice
            });
    
            invoiceDetails += `
                <tr>
                    <td>${item.product.name}</td>
                    <td>${item.quantity}</td>
                    <td>${itemTotalPrice}</td>
                </tr>
            `;
        });
    
        invoiceDetails += `
            <tr>
                <td colspan="2"><strong>السعر الإجمالي</strong></td>
                <td><strong>${totalAmount}</strong></td>
            </tr>
            </table>
        `;
    
        // إضافة الفاتورة للعميل
        customer.invoices.push({
            type: cart[0].type === 'sell' ? 'بيع' : 'شراء',
            date: currentDate,
            total: totalAmount,
            items: items
        });
    
        // تحديث البيانات في localStorage
        localStorage.setItem('products', JSON.stringify(products));
        localStorage.setItem('customers', JSON.stringify(customers));
    
        // إفراغ سلة المشتريات
        cart.length = 0;
        updateCartList();
        loadProducts();
    
        // فتح نافذة لعرض الفاتورة
        const invoiceWindow = window.open('', 'Invoice', 'width=600,height=400');
        invoiceWindow.document.write(invoiceDetails);
        invoiceWindow.document.close();
    }
    
    
    document.getElementById('addToCart').addEventListener('click', addToCart);
    document.getElementById('completeTransaction').addEventListener('click', completeTransaction);
    loadProducts();
});
