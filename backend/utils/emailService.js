// import nodemailer from 'nodemailer';
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false  // Important for local development
    }
});

const sendOrderConfirmation = async (order, recipientEmail, isAdmin = false) => {
    const mailOptions = {
        from: `"FarFoo" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: isAdmin ? 'New Order Received' : 'Order Confirmation',
        html: generateEmailTemplate(order, isAdmin)
    };

    await transporter.sendMail(mailOptions);
};

const generateEmailTemplate = (order, isAdmin) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            * { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; }
            .container { max-width: 600px; margin: 20px auto; padding: 40px; background: #f7fafc; border-radius: 16px; }
            .header { text-align: center; padding-bottom: 30px; border-bottom: 2px solid #e2e8f0; margin-bottom: 30px; }
            .logo { font-size: 24px; color: #2d3748; font-weight: 700; margin-bottom: 15px; }
            .badge { background: #48bb78; color: white; padding: 8px 20px; border-radius: 20px; display: inline-block; }
            .order-table { width: 100%; border-collapse: collapse; margin: 25px 0; }
            .order-table th { text-align: left; padding: 12px; background: #edf2f7; }
            .order-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
            .total-row { background: #f7fafc; font-weight: 600; }
            .button { display: inline-block; padding: 12px 30px; background: #4299e1; color: white; text-decoration: none; border-radius: 8px; }
            .footer { margin-top: 40px; text-align: center; color: #718096; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">FarFoo Store</div>
                <div class="badge">Order Confirmed</div>
                <h1 style="margin: 20px 0; color: #2d3748;">Thank you for your order!</h1>
            </div>

            <table class="order-table">
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
                ${order.items.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>₹${(item.price).toFixed(2)}</td>
                </tr>
                `).join('')}
                <tr class="total-row">
                    <td colspan="2">Total</td>
                    <td>₹${order.totalAmount.toFixed(2)}</td>
                </tr>
            </table>

            <div style="background: white; padding: 20px; border-radius: 12px;">
                <h3 style="margin-top: 0;">Shipping Details</h3>
                <p>${order.shippingAddress.name}</p>
                <p>${order.shippingAddress.address}</p>
                <p>${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zip}</p>
                <p>📞 ${order.shippingAddress.phone}</p>
            </div>

            ${!isAdmin ? `
            <div style="text-align: center; margin-top: 40px;">
                <a href="${process.env.STORE_URL}/orders/${order._id}" class="button">
                    Track Your Order
                </a>
            </div>
            ` : ''}

            <div class="footer">
                <p>Need help? Contact our support team at support@farfoo.com</p>
                <p>© ${new Date().getFullYear()} FarFoo Store. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};
module.exports = { sendOrderConfirmation };


// ${isAdmin ?
//     `<p><a href="${process.env.ADMIN_DASHBOARD_URL}/orders/${order._id}">
//   View order in dashboard
// </a></p>` :
//     `<p>Track your order: <a href="${process.env.STORE_URL}/orders/${order._id}">
//   View Order Status
// </a></p>`
// }