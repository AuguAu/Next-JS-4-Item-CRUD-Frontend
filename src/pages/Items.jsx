import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Items() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  const itemNameRef = useRef();
  const itemCategoryRef = useRef();
  const itemPriceRef = useRef();

  async function loadItems(targetPage = 1) {
    try {
      const response = await fetch(`http://localhost:3000/api/item?page=${targetPage}&limit=5`);
      const data = await response.json();
      setItems(data.items);
      setTotalPages(data.totalPages);
      setPage(targetPage);
    } catch (err) { alert("Loading items failed"); }
  }

  async function onItemSave() {
    const uri = "http://localhost:3000/api/item";
    const body = {
      name: itemNameRef.current.value,
      category: itemCategoryRef.current.value,
      price: itemPriceRef.current.value
    };
    if(!body.name || !body.price) {alert("Please fill name and price"); return;}
    await fetch(uri, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    itemNameRef.current.value = "";
    itemPriceRef.current.value = "";
    loadItems(page); 
  }

  async function deleteItem(id) {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
        const response = await fetch(`http://localhost:3000/api/item/${id}`, { method: "DELETE" });
        if (response.ok) loadItems(page);
        else alert("Delete failed");
    } catch (err) { alert("Error deleting item"); }
  }

  useEffect(() => { loadItems(1); }, []);

const containerStyle = {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#1e1e1e", 
    color: "#ffffff",
    minHeight: "100vh",
    width: "100%",              
    paddingTop: "50px",        
    boxSizing: "border-box"    
  };

  const contentStyle = {
    width: "100%",
    maxWidth: "900px",        
    margin: "0 auto",          
    padding: "0 20px"         
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    border: "1px solid #555"
  };

  const thStyle = {
    backgroundColor: "#333",
    color: "#fff",
    padding: "12px",
    border: "1px solid #555",
    textAlign: "left",
    fontWeight: "bold"
  };

  const tdStyle = { padding: "12px", border: "1px solid #555", color: "#fff" };

  const inputStyle = {
    padding: "8px", border: "none", borderRadius: "4px", width: "90%",
    backgroundColor: "#ffffff", color: "#000000"
  };

  const btnBase = { padding: "6px 12px", cursor: "pointer", borderRadius: "4px", border: "none", fontSize: "14px", margin: "0 5px", fontWeight: "bold" };
  const btnEdit = { ...btnBase, backgroundColor: "#3b82f6", color: "white", textDecoration: "none", display: "inline-block" };
  const btnDelete = { ...btnBase, backgroundColor: "#ef4444", color: "white" };
  const btnAdd = { ...btnBase, backgroundColor: "#22c55e", color: "white" };
  const btnPage = { ...btnBase, backgroundColor: "#444", color: "#fff", border: "1px solid #666" };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        
        <h2 style={{ borderBottom: "1px solid #555", paddingBottom: "10px", marginTop: 0 }}>Items List</h2>
        
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Status</th>
              <th style={{...thStyle, textAlign: "center", width: "200px"}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#1e1e1e" : "#2d2d2d" }}>
                <td style={tdStyle}>{item.itemName || item.name}</td>
                <td style={tdStyle}>{item.itemCategory || item.category}</td>
                <td style={tdStyle}>{parseFloat(item.itemPrice || item.price).toFixed(2)}</td>
                <td style={tdStyle}>{item.status || "ACTIVE"}</td>      
                <td style={{...tdStyle, textAlign: "center"}}>
                  <Link to={`/items/${item._id}`} style={btnEdit}>Edit</Link>
                  <button onClick={() => deleteItem(item._id)} style={btnDelete}>Delete</button>
                </td>
              </tr>
            ))}

            <tr style={{ backgroundColor: "#333", borderTop: "2px solid #666" }}>
              <td style={tdStyle}><input type="text" ref={itemNameRef} placeholder="New Item Name" style={inputStyle} /></td>
              <td style={tdStyle}>
                <select ref={itemCategoryRef} style={inputStyle}>
                  <option>Stationary</option>
                  <option>Kitchenware</option>
                  <option>Appliance</option>
                </select>
              </td>
              <td style={tdStyle}><input type="number" ref={itemPriceRef} placeholder="Price" style={inputStyle} /></td>
              <td style={tdStyle}>-</td>
              <td style={{...tdStyle, textAlign: "center"}}><button onClick={onItemSave} style={btnAdd}>+ Add New</button></td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
          <button disabled={page === 1} onClick={() => loadItems(page - 1)} style={btnPage}> &lt; Previous </button>
          <span style={{ fontWeight: "bold", color: "#fff" }}>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => loadItems(page + 1)} style={btnPage}> Next &gt; </button>
        </div>

      </div>
    </div>
  );
}