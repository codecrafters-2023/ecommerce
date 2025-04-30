import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import NotoSans from "@fontsource/noto-sans";


const configurePDF = async () => {
    const doc = new jsPDF();

    // Add Noto Sans font
    const font = await fetch(NotoSans).then(res => res.arrayBuffer());
    doc.addFileToVFS("NotoSans.ttf", arrayBufferToBase64(font));
    doc.addFont("NotoSans.ttf", "NotoSans", "normal");

    return doc;
};

const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};

const formatCurrency = (amount) => {
    // Convert to number and handle invalid values
    const numericAmount = Number(amount) || 0;
    return `₹${numericAmount.toFixed(2)}`;
};

const generateInvoice = async (order) => {
    const doc = await configurePDF();

    // Add logo
    const img = new Image();
    img.src = '/logo.png'; // Your logo path
    doc.addImage(img, 'PNG', 160, 10, 30, 30);

    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('FarFoo Enterprises', 15, 20);

    // Invoice Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice #: ${order._id}`, 15, 40);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 15, 48);

    // Billing Info
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 15, 65);
    doc.setFont('helvetica', 'normal');
    doc.text(order.shippingAddress.name, 15, 73);
    doc.text(order.shippingAddress.address, 15, 81);
    doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}`, 15, 89);

    // Items Table
    autoTable(doc, {
        startY: 100,
        head: [['Product', 'Qty', 'Unit Price', 'Total']],
        body: order.items.map(item => [
            item.name,
            item.quantity,
            formatCurrency(item.price),
            formatCurrency(item.price * item.quantity)
        ]),
        styles: { fontSize: 10 },
        headStyles: {
            fillColor: [41, 128, 185], // Blue header
            textColor: 255 // White text
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245] // Gray alternate rows
        }
    });

    // Total
    doc.setFont('helvetica', 'bold');
    doc.text(`Grand Total: ${formatCurrency(order.totalAmount.toFixed(2))}`, 150, doc.autoTable.previous.finalY + 10);

    // Footer
    doc.setFontSize(10);
    doc.text('Thank you for your business!', 15, 280);
    doc.text('Terms: Payment due within 15 days', 15, 285);

    doc.save(`invoice-${order._id}.pdf`);
};


export default generateInvoice;