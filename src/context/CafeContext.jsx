import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_SETTINGS,
  INITIAL_TABLES,
  INITIAL_MENU,
  INITIAL_INVENTORY,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_RESERVATIONS
} from '../data/initialData';
import {
  generateNextOrderNumber,
  checkReservationOverlap
} from '../utils/formatters';

const STORAGE_KEY = 'HOGWARTS_CAFE_STORAGE_V1';

const CafeContext = createContext(null);

export function CafeProvider({ children }) {
  // Load or initialize state from localStorage
  const [isLoaded, setIsLoaded] = useState(false);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [tables, setTables] = useState(INITIAL_TABLES);
  const [menu, setMenu] = useState(INITIAL_MENU);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);

  // Active view navigation
  const [currentView, setCurrentView] = useState('overview');

  // Receipt modal state (for immediate printing / viewing after checkout or from order list)
  const [activeReceiptOrder, setActiveReceiptOrder] = useState(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.tables) setTables(parsed.tables);
        if (parsed.menu) setMenu(parsed.menu);
        if (parsed.inventory) setInventory(parsed.inventory);
        if (parsed.customers) setCustomers(parsed.customers);
        if (parsed.orders) setOrders(parsed.orders);
        if (parsed.reservations) setReservations(parsed.reservations);
      }
    } catch (err) {
      console.error('Failed to load Hogwarts Cafe data from localStorage:', err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. Persist to LocalStorage whenever state changes (only after initial load)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const payload = {
        settings,
        tables,
        menu,
        inventory,
        customers,
        orders,
        reservations
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
      addToast('Storage quota warning: unable to save recent state.', 'error');
    }
  }, [isLoaded, settings, tables, menu, inventory, customers, orders, reservations]);

  // Inventory Helper: deduct ingredients for order items
  const deductInventoryForOrder = (orderItems) => {
    const lowStockAlerts = [];
    setInventory((prevInv) => {
      const updated = prevInv.map((ing) => ({ ...ing }));

      orderItems.forEach((orderItem) => {
        const menuItem = menu.find((m) => m.id === orderItem.id || m.name === orderItem.name);
        if (menuItem && menuItem.ingredientsUsed) {
          menuItem.ingredientsUsed.forEach((recipeIng) => {
            const matchIndex = updated.findIndex((i) => i.id === recipeIng.id);
            if (matchIndex >= 0) {
              const deductAmount = recipeIng.amount * orderItem.quantity;
              const newStock = Math.max(0, Number((updated[matchIndex].currentStock - deductAmount).toFixed(3)));
              updated[matchIndex].currentStock = newStock;

              if (newStock <= updated[matchIndex].minStock) {
                lowStockAlerts.push(updated[matchIndex].name);
              }
            }
          });
        }
      });

      return updated;
    });

    if (lowStockAlerts.length > 0) {
      const uniqueNames = [...new Set(lowStockAlerts)];
      addToast(`Low stock notice: ${uniqueNames.join(', ')} reached minimum threshold!`, 'warning');
    }
  };

  // Customer sync helper: update customer metrics upon order completion
  const syncCustomerSpend = (customerName, customerPhone, totalAmount) => {
    if (!customerName || customerName.toLowerCase() === 'walk-in guest') return;

    setCustomers((prevCustomers) => {
      const todayStr = new Date().toISOString().split('T')[0];
      const existingIndex = prevCustomers.findIndex(
        (c) => (customerPhone && c.phone === customerPhone) || c.name.toLowerCase() === customerName.toLowerCase()
      );

      if (existingIndex >= 0) {
        const existing = prevCustomers[existingIndex];
        const newCount = (existing.visitCount || 0) + 1;
        const newSpend = (existing.totalSpending || 0) + totalAmount;
        let newTag = existing.tag || 'Returning';
        if (newSpend >= 5000 || newCount >= 8) newTag = 'VIP Regular';

        const updated = [...prevCustomers];
        updated[existingIndex] = {
          ...existing,
          visitCount: newCount,
          totalSpending: Number(newSpend.toFixed(2)),
          lastVisit: todayStr,
          tag: newTag
        };
        return updated;
      } else {
        // Add as a new customer
        const newCust = {
          id: `cust-${Date.now()}`,
          name: customerName,
          phone: customerPhone || '+91 90000 00000',
          visitCount: 1,
          totalSpending: Number(totalAmount.toFixed(2)),
          lastVisit: todayStr,
          tag: 'New Customer',
          notes: 'First order recorded via POS.'
        };
        return [newCust, ...prevCustomers];
      }
    });
  };

  // ORDERS MANAGEMENT
  const createOrder = (orderData) => {
    const nextOrderNum = generateNextOrderNumber(orders);
    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: nextOrderNum,
      date: orderData.date || new Date().toISOString().split('T')[0],
      time: orderData.time || new Date().toTimeString().slice(0, 5),
      customerName: orderData.customerName || 'Walk-in Guest',
      customerPhone: orderData.customerPhone || '',
      tableNumber: orderData.tableNumber || 'Takeaway',
      items: orderData.items || [],
      subtotal: Number(orderData.subtotal) || 0,
      discount: Number(orderData.discount) || 0,
      tax: Number(orderData.tax) || 0,
      total: Number(orderData.total) || 0,
      paymentMethod: orderData.paymentMethod || 'Cash',
      paymentStatus: orderData.paymentStatus || 'Paid',
      status: orderData.status || 'Pending',
      instructions: orderData.instructions || ''
    };

    setOrders((prev) => [newOrder, ...prev]);

    // If assigned to a table, update table status to Occupied
    if (newOrder.tableNumber && newOrder.tableNumber !== 'Takeaway') {
      setTables((prev) =>
        prev.map((t) => {
          if (t.number === newOrder.tableNumber) {
            return {
              ...t,
              status: 'Occupied',
              currentOrderId: newOrder.orderNumber,
              occupants: {
                name: newOrder.customerName,
                partySize: newOrder.items.reduce((acc, i) => acc + i.quantity, 0),
                seatedAt: newOrder.time
              }
            };
          }
          return t;
        })
      );
    }

    // If order was created directly as Completed, deduct inventory & sync customer
    if (newOrder.status === 'Completed') {
      deductInventoryForOrder(newOrder.items);
      syncCustomerSpend(newOrder.customerName, newOrder.customerPhone, newOrder.total);
    }

    addToast(`Order ${newOrder.orderNumber} placed successfully!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) => {
        if (o.id === orderId || o.orderNumber === orderId) {
          const oldStatus = o.status;
          const updated = { ...o, status: newStatus };

          // If transition to Completed, deduct inventory and sync customer if not done
          if (newStatus === 'Completed' && oldStatus !== 'Completed') {
            deductInventoryForOrder(o.items);
            syncCustomerSpend(o.customerName, o.customerPhone, o.total);
            updated.paymentStatus = 'Paid';

            // Check if table can now be marked Cleaning
            if (o.tableNumber && o.tableNumber !== 'Takeaway') {
              setTables((prevTables) =>
                prevTables.map((t) =>
                  t.number === o.tableNumber ? { ...t, status: 'Cleaning', currentOrderId: null, occupants: null } : t
                )
              );
            }
          }

          if (newStatus === 'Cancelled' && o.tableNumber && o.tableNumber !== 'Takeaway') {
            setTables((prevTables) =>
              prevTables.map((t) =>
                t.number === o.tableNumber ? { ...t, status: 'Available', currentOrderId: null, occupants: null } : t
              )
            );
          }

          return updated;
        }
        return o;
      })
    );
    addToast(`Order status updated to ${newStatus}.`, 'info');
  };

  const cancelOrder = (orderId) => {
    updateOrderStatus(orderId, 'Cancelled');
  };

  // TABLE MANAGEMENT
  const updateTableStatus = (tableId, newStatus, extraData = {}) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === tableId || t.number === tableId) {
          return {
            ...t,
            status: newStatus,
            ...(newStatus === 'Available' ? { currentOrderId: null, occupants: null, reservationId: null } : {}),
            ...extraData
          };
        }
        return t;
      })
    );
    addToast(`Table ${tableId} is now marked ${newStatus}.`, 'info');
  };

  const seatGuestsAtTable = (tableId, customerName, partySize, reservationId = null) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === tableId || t.number === tableId) {
          return {
            ...t,
            status: 'Occupied',
            reservationId: reservationId || t.reservationId,
            occupants: {
              name: customerName,
              partySize: Number(partySize),
              seatedAt: new Date().toTimeString().slice(0, 5)
            }
          };
        }
        return t;
      })
    );

    // If attached to a reservation, update reservation status to Seated
    if (reservationId) {
      setReservations((prev) =>
        prev.map((r) => (r.id === reservationId ? { ...r, status: 'Seated' } : r))
      );
    }

    addToast(`Seated ${customerName} (party of ${partySize}) at table ${tableId}.`, 'success');
  };

  // RESERVATION CONFLICT CHECKING
  const checkTableConflict = (tableId, date, time, duration = 90, excludeResId = null) => {
    const table = tables.find((t) => t.id === tableId || t.number === tableId);
    if (!table) return { hasConflict: true, reason: 'Invalid table selection.' };

    const activeReservations = reservations.filter((r) => {
      if (excludeResId && r.id === excludeResId) return false;
      if (r.status === 'Cancelled' || r.status === 'Completed' || r.status === 'No-show') return false;
      return (r.tableId === table.id || r.tableNumber === table.number) && r.date === date;
    });

    for (const r of activeReservations) {
      const overlap = checkReservationOverlap(
        date,
        time,
        Number(duration),
        r.date,
        r.time,
        Number(r.duration || settings.defaultReservationDuration || 90)
      );
      if (overlap) {
        return {
          hasConflict: true,
          reason: `Table ${table.number} is already booked by ${r.customerName} at ${r.time} (${r.duration || 90}m).`
        };
      }
    }

    return { hasConflict: false };
  };

  const createReservation = (resData) => {
    // Conflict check
    if (resData.tableId) {
      const conflict = checkTableConflict(
        resData.tableId,
        resData.date,
        resData.time,
        resData.duration || settings.defaultReservationDuration,
        null
      );
      if (conflict.hasConflict) {
        addToast(conflict.reason, 'error');
        return { success: false, reason: conflict.reason };
      }
    }

    const tableObj = tables.find((t) => t.id === resData.tableId || t.number === resData.tableId);
    const newRes = {
      id: `RES-${Date.now().toString().slice(-4)}`,
      customerName: resData.customerName,
      phone: resData.phone,
      guests: Number(resData.guests),
      date: resData.date,
      time: resData.time,
      duration: Number(resData.duration || settings.defaultReservationDuration || 90),
      section: resData.section || (tableObj ? tableObj.area : 'The Great Hall'),
      tableId: tableObj ? tableObj.id : resData.tableId,
      tableNumber: tableObj ? tableObj.number : resData.tableId,
      status: 'Confirmed',
      notes: resData.notes || ''
    };

    setReservations((prev) => [newRes, ...prev]);

    // If reservation is for today within 2 hours, mark table Reserved
    const todayStr = new Date().toISOString().split('T')[0];
    if (newRes.date === todayStr && tableObj && tableObj.status === 'Available') {
      updateTableStatus(tableObj.id, 'Reserved', { reservationId: newRes.id });
    }

    addToast(`Reservation confirmed for ${newRes.customerName} at Table ${newRes.tableNumber}!`, 'success');
    return { success: true, reservation: newRes };
  };

  const updateReservation = (resId, updatedFields) => {
    // Check conflicts if table, date, or time changed
    if (updatedFields.tableId && updatedFields.date && updatedFields.time) {
      const conflict = checkTableConflict(
        updatedFields.tableId,
        updatedFields.date,
        updatedFields.time,
        updatedFields.duration || settings.defaultReservationDuration,
        resId
      );
      if (conflict.hasConflict) {
        addToast(conflict.reason, 'error');
        return { success: false, reason: conflict.reason };
      }
    }

    setReservations((prev) =>
      prev.map((r) => {
        if (r.id === resId) {
          const tableObj = tables.find((t) => t.id === updatedFields.tableId || t.number === updatedFields.tableId);
          return {
            ...r,
            ...updatedFields,
            tableNumber: tableObj ? tableObj.number : (updatedFields.tableNumber || r.tableNumber)
          };
        }
        return r;
      })
    );

    addToast(`Reservation ${resId} updated successfully.`, 'info');
    return { success: true };
  };

  const cancelReservation = (resId) => {
    setReservations((prev) =>
      prev.map((r) => {
        if (r.id === resId) {
          // If table was marked reserved, free it up
          if (r.tableId) {
            setTables((tbls) =>
              tbls.map((t) => (t.id === r.tableId && t.status === 'Reserved' ? { ...t, status: 'Available', reservationId: null } : t))
            );
          }
          return { ...r, status: 'Cancelled' };
        }
        return r;
      })
    );
    addToast(`Reservation cancelled.`, 'info');
  };

  // MENU MANAGEMENT
  const addMenuItem = (itemData) => {
    const newItem = {
      id: `m-${Date.now()}`,
      name: itemData.name,
      category: itemData.category || 'Enchanted Coffee',
      price: Number(itemData.price) || 0,
      isVeg: Boolean(itemData.isVeg),
      prepTime: itemData.prepTime || '5 mins',
      available: itemData.available !== undefined ? itemData.available : true,
      description: itemData.description || '',
      image: itemData.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
      ingredientsUsed: itemData.ingredientsUsed || []
    };

    setMenu((prev) => [newItem, ...prev]);
    addToast(`Dish "${newItem.name}" added to menu.`, 'success');
  };

  const updateMenuItem = (itemId, updatedData) => {
    setMenu((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, ...updatedData, price: Number(updatedData.price || item.price) } : item))
    );
    addToast('Menu item updated successfully.', 'info');
  };

  const deleteMenuItem = (itemId) => {
    setMenu((prev) => prev.filter((item) => item.id !== itemId));
    addToast('Dish removed from menu.', 'info');
  };

  // INVENTORY MANAGEMENT
  const addInventoryItem = (itemData) => {
    const newItem = {
      id: `ing-${Date.now()}`,
      name: itemData.name,
      unit: itemData.unit || 'kg',
      currentStock: Number(itemData.currentStock) || 0,
      minStock: Number(itemData.minStock) || 0,
      costPerUnit: Number(itemData.costPerUnit) || 0,
      supplier: itemData.supplier || 'Local Wizarding Supplier'
    };
    setInventory((prev) => [...prev, newItem]);
    addToast(`Ingredient "${newItem.name}" added.`, 'success');
  };

  const updateInventoryStock = (ingId, adjustment, isAddition = true, notes = '') => {
    setInventory((prev) =>
      prev.map((ing) => {
        if (ing.id === ingId) {
          const delta = Number(adjustment);
          let newStock = isAddition ? ing.currentStock + delta : ing.currentStock - delta;
          if (newStock < 0) {
            newStock = 0;
            addToast(`Warning: ${ing.name} stock cannot go negative. Set to 0.`, 'warning');
          }
          return { ...ing, currentStock: Number(newStock.toFixed(3)) };
        }
        return ing;
      })
    );
    addToast(`Stock adjusted for ingredient.`, 'info');
  };

  const updateInventoryDetails = (ingId, fields) => {
    setInventory((prev) =>
      prev.map((ing) => (ing.id === ingId ? { ...ing, ...fields } : ing))
    );
    addToast('Ingredient details updated.', 'info');
  };

  // CUSTOMER MANAGEMENT
  const addCustomer = (customerData) => {
    const newCust = {
      id: `cust-${Date.now()}`,
      name: customerData.name,
      phone: customerData.phone,
      visitCount: Number(customerData.visitCount) || 1,
      totalSpending: Number(customerData.totalSpending) || 0,
      lastVisit: customerData.lastVisit || new Date().toISOString().split('T')[0],
      tag: customerData.tag || 'New Customer',
      notes: customerData.notes || ''
    };
    setCustomers((prev) => [newCust, ...prev]);
    addToast(`Customer record for ${newCust.name} created.`, 'success');
  };

  const updateCustomer = (custId, fields) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === custId ? { ...c, ...fields } : c))
    );
    addToast('Customer record updated.', 'info');
  };

  // SETTINGS & SYSTEM UTILITIES
  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addToast('Café settings updated successfully.', 'success');
  };

  const resetDemonstrationData = () => {
    setSettings(INITIAL_SETTINGS);
    setTables(INITIAL_TABLES);
    setMenu(INITIAL_MENU);
    setInventory(INITIAL_INVENTORY);
    setCustomers(INITIAL_CUSTOMERS);
    setOrders(INITIAL_ORDERS);
    setReservations(INITIAL_RESERVATIONS);
    localStorage.removeItem(STORAGE_KEY);
    addToast('Hogwarts Cafe demonstration data reset to original defaults.', 'info');
  };

  const clearAllData = () => {
    setOrders([]);
    setReservations([]);
    setCustomers([]);
    setTables(INITIAL_TABLES.map((t) => ({ ...t, status: 'Available', currentOrderId: null, occupants: null, reservationId: null })));
    setInventory(INITIAL_INVENTORY.map((i) => ({ ...i, currentStock: 0 })));
    localStorage.removeItem(STORAGE_KEY);
    addToast('All operational records cleared.', 'warning');
  };

  const importDataFromJSON = (importedObj) => {
    try {
      if (importedObj.settings) setSettings(importedObj.settings);
      if (importedObj.tables) setTables(importedObj.tables);
      if (importedObj.menu) setMenu(importedObj.menu);
      if (importedObj.inventory) setInventory(importedObj.inventory);
      if (importedObj.customers) setCustomers(importedObj.customers);
      if (importedObj.orders) setOrders(importedObj.orders);
      if (importedObj.reservations) setReservations(importedObj.reservations);
      addToast('Backup restored successfully!', 'success');
    } catch (e) {
      addToast('Error importing JSON data. Please verify the file structure.', 'error');
    }
  };

  const value = {
    settings,
    updateSettings,
    tables,
    updateTableStatus,
    seatGuestsAtTable,
    menu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    inventory,
    addInventoryItem,
    updateInventoryStock,
    updateInventoryDetails,
    customers,
    addCustomer,
    updateCustomer,
    orders,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    reservations,
    createReservation,
    updateReservation,
    cancelReservation,
    checkTableConflict,
    currentView,
    setCurrentView,
    activeReceiptOrder,
    setActiveReceiptOrder,
    toasts,
    addToast,
    removeToast,
    resetDemonstrationData,
    clearAllData,
    importDataFromJSON
  };

  return <CafeContext.Provider value={value}>{children}</CafeContext.Provider>;
}

export function useCafe() {
  const context = useContext(CafeContext);
  if (!context) {
    throw new Error('useCafe must be used within a CafeProvider');
  }
  return context;
}
