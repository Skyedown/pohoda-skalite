import React, { Suspense, lazy, useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import { LocaleProvider, useLocale } from './i18n/LocaleContext';
import { ALL_LEGAL_ROUTES } from './legal/paths';
import Header from './sections/Header/Header';
import PizzaMain from './views/PizzaMain/PizzaMain';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import FloatingCart from './components/shared/FloatingCart/FloatingCart';
import FloatingCall from './components/shared/FloatingCall/FloatingCall';
import OrderingStatusBanner from './components/shared/OrderingStatusBanner/OrderingStatusBanner';
import CookieConsent from './components/shared/CookieConsent/CookieConsent';
import { setDefaultConsent, initGA, trackPageView } from './utils/analytics';
import './styles/global.less';

// Everything but the menu loads on demand so the first page stays small.
const PizzaCart = lazy(() => import('./views/PizzaCart/PizzaCart'));
const ThankYou = lazy(() => import('./views/ThankYou/ThankYou'));
const PrivacyPolicy = lazy(() => import('./views/PrivacyPolicy/PrivacyPolicy'));
const Terms = lazy(() => import('./views/Terms/Terms'));
const AdminPanel = lazy(() => import('./views/AdminPanel/AdminPanel'));
const AdminAnalytics = lazy(
  () => import('./views/AdminAnalytics/AdminAnalytics'),
);
const AdminOrderSettings = lazy(
  () => import('./views/AdminOrderSettings/AdminOrderSettings'),
);
const AdminDeliveryAreas = lazy(
  () => import('./views/AdminDeliveryAreas/AdminDeliveryAreas'),
);
const AdminProductRestrictions = lazy(
  () => import('./views/AdminProductRestrictions/AdminProductRestrictions'),
);
const AdminUsers = lazy(() => import('./views/AdminUsers/AdminUsers'));
const AdminOrders = lazy(() => import('./views/AdminOrders/AdminOrders'));

const PageTracker: React.FC = () => {
  const location = useLocation();
  const { locale } = useLocale();

  useEffect(() => {
    if (localStorage.getItem('cookie-consent') === 'accepted') {
      initGA(locale);
    }
  }, [locale]);

  useEffect(() => {
    trackPageView(location.pathname + location.search, locale);
  }, [location, locale]);

  return null;
};

/** The admin lives on the Slovak domain only; the Polish site redirects home. */
const AdminArea: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { locale } = useLocale();

  if (locale !== 'sk') {
    return <Navigate to="/" replace />;
  }

  return <ProtectedRoute>{children}</ProtectedRoute>;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="app">
      {!isAdminPage && <Header isStatic={isAdminPage} />}
      {!isAdminPage && (
        <OrderingStatusBanner onVisibilityChange={setIsBannerVisible} />
      )}
      <main>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<PizzaMain />} />
            <Route path="/cart" element={<PizzaCart />} />
            <Route path="/thank-you" element={<ThankYou />} />
            {ALL_LEGAL_ROUTES.privacy.map((path) => (
              <Route key={path} path={path} element={<PrivacyPolicy />} />
            ))}
            {ALL_LEGAL_ROUTES.terms.map((path) => (
              <Route key={path} path={path} element={<Terms />} />
            ))}
            <Route
              path="/admin"
              element={
                <AdminArea>
                  <AdminPanel />
                </AdminArea>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <AdminArea>
                  <AdminAnalytics />
                </AdminArea>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AdminArea>
                  <AdminOrderSettings />
                </AdminArea>
              }
            />
            <Route
              path="/admin/delivery"
              element={
                <AdminArea>
                  <AdminDeliveryAreas />
                </AdminArea>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminArea>
                  <AdminProductRestrictions />
                </AdminArea>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminArea>
                  <AdminOrders />
                </AdminArea>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminArea>
                  <AdminUsers />
                </AdminArea>
              }
            />
          </Routes>
        </Suspense>
      </main>
      {!isAdminPage && (
        <>
          <FloatingCart bannerVisible={isBannerVisible} />
          <FloatingCall bannerVisible={isBannerVisible} />
        </>
      )}
      <CookieConsent />
    </div>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    setDefaultConsent();
  }, []);

  return (
    <HelmetProvider>
      <LocaleProvider>
        <CartProvider>
          <Router>
            <PageTracker />
            <AppContent />
          </Router>
        </CartProvider>
      </LocaleProvider>
    </HelmetProvider>
  );
};

export default App;
