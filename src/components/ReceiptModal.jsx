import React from 'react';
import { useCafe } from '../context/CafeContext';
import { formatINR, formatDate, formatTime } from '../utils/formatters';
import { Printer, X, Sparkles, CheckCircle } from 'lucide-react';

export default function ReceiptModal() {
  const { activeReceiptOrder, setActiveReceiptOrder, settings } = useCafe();

  if (!activeReceiptOrder) return null;

  const order = activeReceiptOrder;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay no-print-backdrop" onClick={() => setActiveReceiptOrder(null)}>
      <div className="receipt-modal-wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="receipt-actions no-print">
          <button className="btn btn-brass btn-sm" onClick={handlePrint} id="print-receipt-btn">
            <Printer size={15} /> Print Receipt
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveReceiptOrder(null)}>
            <X size={15} /> Close
          </button>
        </div>

        {/* Printable Receipt Card */}
        <div className="printable-receipt" id="printable-bill">
          <div className="receipt-header">
            <div className="receipt-crest">
              <span className="crest-initials">HC</span>
            </div>
            <h2 className="receipt-title">{settings.cafeName || 'HOGWARTS CAFE'}</h2>
            <p className="receipt-subtitle">{settings.brandSubtitle || "The Wizarding World's Dining Room"}</p>
            <p className="receipt-address">{settings.address}</p>
            <p className="receipt-meta-line">Tel: {settings.phone} • GSTIN: 27AAACH0974K1ZM</p>
          </div>

          <div className="receipt-divider-dashed"></div>

          <div className="receipt-order-meta">
            <div className="meta-row">
              <span className="meta-lbl">ORDER INVOICE:</span>
              <strong className="meta-val">{order.orderNumber}</strong>
            </div>
            <div className="meta-row">
              <span className="meta-lbl">DATE & TIME:</span>
              <span className="meta-val">{formatDate(order.date)} {formatTime(order.time)}</span>
            </div>
            <div className="meta-row">
              <span className="meta-lbl">TABLE / SEAT:</span>
              <strong className="meta-val">{order.tableNumber || 'Takeaway'}</strong>
            </div>
            <div className="meta-row">
              <span className="meta-lbl">GUEST NAME:</span>
              <span className="meta-val">{order.customerName || 'Walk-in Guest'}</span>
            </div>
            {order.customerPhone && (
              <div className="meta-row">
                <span className="meta-lbl">CONTACT:</span>
                <span className="meta-val">{order.customerPhone}</span>
              </div>
            )}
            <div className="meta-row">
              <span className="meta-lbl">PAYMENT MODE:</span>
              <span className="meta-val tag-mode">{order.paymentMethod} ({order.paymentStatus || 'Paid'})</span>
            </div>
          </div>

          <div className="receipt-divider-dashed"></div>

          {/* Line Items */}
          <table className="receipt-items-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>ITEM</th>
                <th style={{ textAlign: 'center' }}>QTY</th>
                <th style={{ textAlign: 'right' }}>RATE</th>
                <th style={{ textAlign: 'right' }}>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, idx) => (
                <tr key={idx}>
                  <td className="item-name-cell">
                    {item.name}
                  </td>
                  <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'right' }}>₹{item.price}</td>
                  <td style={{ textAlign: 'right' }}>₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="receipt-divider-dashed"></div>

          {/* Calculations */}
          <div className="receipt-calc-box">
            <div className="calc-row">
              <span>Subtotal:</span>
              <span>{formatINR(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="calc-row discount-row">
                <span>Discount Applied:</span>
                <span>-{formatINR(order.discount)}</span>
              </div>
            )}
            <div className="calc-row">
              <span>GST ({settings.gstPercent}%):</span>
              <span>{formatINR(order.tax)}</span>
            </div>
            <div className="receipt-divider-solid"></div>
            <div className="calc-row total-row">
              <strong>GRAND TOTAL:</strong>
              <strong className="grand-amount">{formatINR(order.total)}</strong>
            </div>
          </div>

          {order.instructions && (
            <div className="receipt-notes">
              <small>Special Instructions: {order.instructions}</small>
            </div>
          )}

          <div className="receipt-footer">
            <p className="footer-flourish">✦ ✦ ✦</p>
            <p className="footer-tagline">“{settings.tagline}”</p>
            <p className="footer-message">{settings.receiptFooter}</p>
            <div className="barcode-mock">
              <span>||| | | |||| | ||| || |||| | ||| |||| |</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
