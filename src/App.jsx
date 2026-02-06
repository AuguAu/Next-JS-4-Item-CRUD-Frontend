import { Routes, Route, Navigate } from "react-router-dom";
import Items from "./pages/Items";        
import ItemDetail from "./pages/ItemDetail";  
import Users from "./pages/UserManagement";
import UserDetail from "./pages/UserDetail";

function App() {
  return (

    <Routes>
      <Route path="/" element={<Navigate to="/users" />} /> 
      <Route path="/users" element={<Users />} />
      <Route path="/users/:id" element={<UserDetail />} />
      
      {/* <Route path="/items" element={<Items />} /> */}
      {/* <Route path="/items/:id" element={<ItemDetail />} /> */}
    </Routes>

  );
}

export default App;