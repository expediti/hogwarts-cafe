import React, { useState } from 'react';
import { CafeProvider, useCafe } from './context/CafeContext';
import CustomerMenuPage from './pages/CustomerMenuPage';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import FooterCredits from './components/FooterCredits';
import ReceiptModal from './components/ReceiptModal';
import ToastContainer from './components/ToastContainer';

import OverviewPage from './pages/OverviewPage';
import OrdersPage from './pages/OrdersPage';
import ReservationsPage from './pages/ReservationsPage';
import FloorPlanPage from './pages/FloorPlanPage';
import MenuPage from './pages/MenuPage';
import InventoryPage from './pages/InventoryPage';
import CustomersPage from './pages/CustomersPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

import { Utensils, ArrowLeft, ShieldCheck } from 'lucide-react';

import './styles/theme.css';
import './styles/app.css';

function MainApp() {
  const { currentView } = useCafe();
  // By default, the homepage is the customer-facing wizarding dining menu!
  const [isStaffPortal, setIsStaffPortal] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const renderAdminView = () => {
    switch (currentView) {
      case 'overview':
        return <OverviewPage />;
      case 'orders':
        return <OrdersPage />;
      case 'reservations':
        return <ReservationsPage />;
      case 'floorplan':
        return <FloorPlanPage />;
      case 'menu':
        return <MenuPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'customers':
        return <CustomersPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <>
      {!isStaffPortal ? (
        /* ==========================================================================
           MAIN USER HOMEPAGE: HOGWARTS CAFE DINING EXPERIENCE & 2-CARDS MENU
           ========================================================================== */
        <div className="customer-app-wrapper">
          <CustomerMenuPage onOpenAdmin={() => setIsStaffPortal(true)} />
          <FooterCredits />
        </div>
      ) : (
        /* ==========================================================================
           STAFF & OPERATIONS PORTAL (FULL ADMIN SYSTEM)
           ========================================================================== */
        <div className="app-container">
          {/* Permanent desktop / collapsible mobile sidebar */}
          <Sidebar mobileOpen={mobileNavOpen} setMobileOpen={setMobileNavOpen} />

          {/* Main Content Area */}
          <div className="main-content">
            {/* Top Bar Switcher to return to Customer Menu */}
            <div className="admin-return-strip no-print">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} className="text-brass" />
                <strong>CAFÉ OPERATIONS & MANAGER SYSTEM</strong>
              </div>
              <button
                className="btn btn-brass btn-sm"
                onClick={() => setIsStaffPortal(false)}
                id="btn-return-to-menu"
              >
                <ArrowLeft size={14} /> Back to Customer Menu
              </button>
            </div>

            <TopBar onOpenMobileNav={() => setMobileNavOpen(true)} />
            <main className="view-wrapper">
              {renderAdminView()}
            </main>
            <FooterCredits />
          </div>
        </div>
      )}

      {/* Global Overlays: Printable Receipt Modal & Toasts */}
      <ReceiptModal />
      <ToastContainer />
    </>
  );
}

export default function App() {
  return (
    <CafeProvider>
      <MainApp />
    </CafeProvider>
  );
}
