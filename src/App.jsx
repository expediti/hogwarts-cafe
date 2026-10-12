import React, { useState } from 'react';
import { CafeProvider, useCafe } from './context/CafeContext';
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

import './styles/theme.css';
import './styles/app.css';

function MainApp() {
  const { currentView } = useCafe();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const renderCurrentView = () => {
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
    <div className="app-container">
      {/* Permanent desktop / collapsible mobile sidebar */}
      <Sidebar mobileOpen={mobileNavOpen} setMobileOpen={setMobileNavOpen} />

      {/* Main Content Area */}
      <div className="main-content">
        <TopBar onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="view-wrapper">
          {renderCurrentView()}
        </main>
        <FooterCredits />
      </div>

      {/* Overlays: Printable Receipt Modal & Toasts */}
      <ReceiptModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <CafeProvider>
      <MainApp />
    </CafeProvider>
  );
}
