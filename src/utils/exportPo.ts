export interface PODetails {
  poNumber: string;
  buyerName: string;
  buyerEmail: string;
  vendorName: string;
  vendorEmail: string;
  item: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  deliveryDays: number;
  warrantyMonths: number;
  orderDate: string;
  deliveryDate: string;
}

export function generatePONumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 3).toUpperCase();
  return `PO-${timestamp}-${random}`;
}

export function createPOPreview(details: PODetails): string {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + details.deliveryDays);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Purchase Order - ${details.poNumber}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: white;
          color: #333;
        }
        .header {
          border-bottom: 3px solid #ff6f61;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .po-number {
          font-size: 24px;
          font-weight: bold;
          color: #ff6f61;
        }
        .date {
          color: #666;
          font-size: 14px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section h3 {
          color: #ff6f61;
          border-bottom: 1px solid #eee;
          padding-bottom: 5px;
        }
        .two-column {
          display: flex;
          gap: 40px;
        }
        .column {
          flex: 1;
        }
        .item-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        .item-table th,
        .item-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        .item-table th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        .total-row {
          font-weight: bold;
          background-color: #f9f9f9;
        }
        .terms {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-top: 20px;
        }
        .signature-section {
          margin-top: 40px;
          display: flex;
          justify-content: space-between;
        }
        .signature-box {
          width: 200px;
          border-top: 1px solid #333;
          padding-top: 5px;
          text-align: center;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="po-number">Purchase Order #${details.poNumber}</div>
        <div class="date">Order Date: ${details.orderDate}</div>
      </div>
      
      <div class="section">
        <div class="two-column">
          <div class="column">
            <h3>Bill To:</h3>
            <p><strong>${details.buyerName}</strong><br>
            ${details.buyerEmail}</p>
          </div>
          <div class="column">
            <h3>Ship To:</h3>
            <p><strong>${details.vendorName}</strong><br>
            ${details.vendorEmail}</p>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h3>Items</h3>
        <table class="item-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${details.item}</td>
              <td>${details.quantity}</td>
              <td>$${details.unitPrice.toFixed(2)}</td>
              <td>$${details.totalPrice.toFixed(2)}</td>
            </tr>
            <tr class="total-row">
              <td colspan="3"><strong>Total</strong></td>
              <td><strong>$${details.totalPrice.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="terms">
        <h3>Terms & Conditions</h3>
        <ul>
          <li><strong>Delivery:</strong> ${details.deliveryDays} days from order date (by ${deliveryDate.toLocaleDateString()})</li>
          <li><strong>Warranty:</strong> ${details.warrantyMonths} months from delivery date</li>
          <li><strong>Payment:</strong> Net 30 days from delivery</li>
          <li><strong>Compliance:</strong> All items must meet specified quality standards</li>
        </ul>
      </div>
      
      <div class="signature-section">
        <div class="signature-box">
          <div>Buyer Signature</div>
          <div style="margin-top: 20px;">Date: _______________</div>
        </div>
        <div class="signature-box">
          <div>Vendor Signature</div>
          <div style="margin-top: 20px;">Date: _______________</div>
        </div>
      </div>
      
      <div class="no-print" style="margin-top: 40px; text-align: center;">
        <button onclick="window.print()" style="
          background: #ff6f61;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
        ">Print PO</button>
      </div>
    </body>
    </html>
  `;
}

export function downloadPO(details: PODetails) {
  const html = createPOPreview(details);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `PO-${details.poNumber}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
