import { Navigate } from 'react-router-dom';

/** Full inventory lives on Profile — redirect for nav compatibility */
export default function Inventory() {
  return <Navigate to="/profile#rewards" replace />;
}
