import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Items from "./pages/Items";        
import ItemDetail from "./pages/ItemDetail"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/items" />} /> 
        <Route path="/items" element={<Items />} />
        <Route path="/items/:id" element={<ItemDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;