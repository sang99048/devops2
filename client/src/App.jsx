import CreateInvoice from "./pages/CreateInvoice"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ListInvoice from "./pages/ListInvoice";
import BillDetail from "./pages/BillDetail";
import { useState } from "react";
import UpdateInvoice from "./pages/Update";

const App = () => {
  const [setSelectedBill] = useState(null);

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateInvoice />} />
        <Route path="/list" element={<ListInvoice onViewBill={handleViewBill} />} />
        <Route path="/bill/:id" element={<BillDetail />} />
        <Route path="/edit/:id" element={<UpdateInvoice />} />
      </Routes>
    </Router>
  )
}

export default App