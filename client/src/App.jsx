import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CustomersListing from './pages/CustomersListing';
import CustomerDetails from './pages/CustomerDetails';
import AddCustomer from './pages/AddCustomer';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      
      {/* Layout wraps all dashboard/CRM pages */}
      <Route element={<Layout />}>
        {/* Public dashboard */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Protected routes that require authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path="/customers" element={<CustomersListing />} />
          <Route path="/customers/add" element={<AddCustomer />} />
          <Route path="/customers/:id" element={<CustomerDetails />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
