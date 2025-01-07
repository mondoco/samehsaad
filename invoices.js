function loadInvoices() {
    // التأكد من وجود بيانات العملاء في localStorage
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    
    // التأكد من أن العملاء موجودين ولديهم فواتير
    if (customers.length === 0) {
        document.getElementById('invoicesContainer').innerHTML = '<p>لا توجد فواتير حالياً.</p>';
        return;
    }

    const invoicesContainer = document.getElementById('invoicesContainer');
    invoicesContainer.innerHTML = ''; // تنظيف الحاوية قبل إضافة البيانات الجديدة
    function removeOldInvoices() {
        const sixMonthsAgo = Date.now() - (6 * 30 * 24 * 60 * 60 * 1000); // 6 أشهر بالـ milliseconds
        const customers = JSON.parse(localStorage.getItem('customers')) || [];
    
        customers.forEach(customer => {
            customer.invoices = customer.invoices.filter(invoice => {
                return invoice.date >= sixMonthsAgo; // الاحتفاظ فقط بالفواتير التي لم تمض عليها 6 أشهر
            });
        });
    
        // إعادة حفظ البيانات بعد التصفية
        localStorage.setItem('customers', JSON.stringify(customers));
    }
    removeOldInvoices();    
    customers.forEach(customer => {
        // ترتيب الفواتير بناءً على التاريخ من الأحدث إلى الأقدم
        customer.invoices.sort((a, b) => new Date(b.date) - new Date(a.date));
        customer.invoices.forEach(invoice => {
            const invoiceElement = document.createElement('div');
            invoiceElement.classList.add('invoice');
            invoiceElement.innerHTML = `
                <style>
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                </style>
                <h2>فاتورة ${invoice.type}</h2>
                <p><strong>اسم العميل:</strong> ${customer.name}</p>
                <p><strong>التاريخ:</strong> ${invoice.date}</p>
                <p><strong>السعر الإجمالي:</strong> ${invoice.total} ج.م</p>
                <table>
                    <tr>
                        <th>المنتج</th>
                        <th>الكمية</th>
                        <th>السعر الإجمالي (ج.م)</th>
                    </tr>
                    ${invoice.items.map(item => ` 
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>${item.totalPrice}</td>
                        </tr>
                    `).join('')}
                </table>
            `;
            invoicesContainer.appendChild(invoiceElement);
        });
    });
}

window.onload = loadInvoices;

