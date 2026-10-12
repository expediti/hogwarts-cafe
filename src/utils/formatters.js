// Utility functions for Hogwarts Cafe

/**
 * Format numbers as Indian Rupee currency (e.g. ₹1,250.00)
 */
export function formatINR(amount) {
  const numeric = Number(amount) || 0;
  return '₹' + numeric.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format date string to traditional English display (e.g. "12 Oct 2026")
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format time to 12-hour AM/PM format (e.g. "07:30 PM")
 */
export function formatTime(timeStr) {
  if (!timeStr) return '';
  // Check if it's already HH:mm
  if (/^\d{2}:\d{2}$/.test(timeStr)) {
    const [hours, mins] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const h12 = hours % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${period}`;
  }
  const date = new Date(timeStr);
  if (!isNaN(date.getTime())) {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }
  return timeStr;
}

/**
 * Generate sequential order number (e.g. HWC-0001)
 */
export function generateNextOrderNumber(existingOrders = []) {
  let maxId = 0;
  existingOrders.forEach((o) => {
    if (o.orderNumber && o.orderNumber.startsWith('HWC-')) {
      const num = parseInt(o.orderNumber.replace('HWC-', ''), 10);
      if (!isNaN(num) && num > maxId) {
        maxId = num;
      }
    }
  });
  const next = maxId + 1;
  return `HWC-${next.toString().padStart(4, '0')}`;
}

/**
 * Check if two time ranges on the same date overlap
 * timeStr: "HH:mm" (24-hour)
 * durationMins: duration in minutes
 */
export function checkReservationOverlap(dateA, timeA, durationA, dateB, timeB, durationB) {
  if (dateA !== dateB) return false;
  
  const toMinutes = (t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const startA = toMinutes(timeA);
  const endA = startA + durationA;

  const startB = toMinutes(timeB);
  const endB = startB + durationB;

  // They overlap if startA < endB and endA > startB
  return startA < endB && endA > startB;
}

/**
 * Resize image locally to maintain small size in localStorage
 */
export function resizeImage(file, maxWidth = 480, maxHeight = 480, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Export orders array to CSV and trigger browser download
 */
export function exportOrdersToCSV(orders = []) {
  if (!orders.length) {
    alert('No orders to export.');
    return;
  }

  const headers = ['Order Number', 'Date', 'Time', 'Customer', 'Table', 'Items Count', 'Subtotal (INR)', 'Discount (INR)', 'GST Tax (INR)', 'Grand Total (INR)', 'Payment Method', 'Payment Status', 'Order Status'];
  
  const rows = orders.map((o) => [
    o.orderNumber,
    o.date,
    o.time,
    `"${(o.customerName || 'Walk-in').replace(/"/g, '""')}"`,
    o.tableNumber,
    o.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
    o.subtotal?.toFixed(2) || '0.00',
    o.discount?.toFixed(2) || '0.00',
    o.tax?.toFixed(2) || '0.00',
    o.total?.toFixed(2) || '0.00',
    o.paymentMethod || 'Cash',
    o.paymentStatus || 'Paid',
    o.status || 'Completed',
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `hogwarts_cafe_orders_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export full cafe backup to JSON
 */
export function exportFullDataJSON(data) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `hogwarts_cafe_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
