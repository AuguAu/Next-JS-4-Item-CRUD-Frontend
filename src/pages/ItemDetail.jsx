import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const itemNameRef = useRef();
  const itemCategoryRef = useRef();
  const itemPriceRef = useRef();

  async function loadItem() {
    try {
      const uri = `http://localhost:3000/api/item/${id}`;
      const response = await fetch(uri);
      if (!response.ok) throw new Error("Item not found");
      const data = await response.json();
      
      if (itemNameRef.current) itemNameRef.current.value = data.itemName || data.name;
      if (itemCategoryRef.current) itemCategoryRef.current.value = data.itemCategory || data.category;
      if (itemPriceRef.current) itemPriceRef.current.value = data.itemPrice || data.price;
    } catch (err) { alert("Error loading item: " + err.message); }
  }

  async function onUpdate() {
    const uri = `http://localhost:3000/api/item/${id}`;
    const body = {
      name: itemNameRef.current.value,
      category: itemCategoryRef.current.value,
      price: itemPriceRef.current.value
    };
    try {
      const result = await fetch(uri, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (result.ok) { alert("Updated successfully!"); navigate("/items"); } 
      else { alert("Update failed"); }
    } catch (err) { alert("Error updating: " + err.message); }
  }

  useEffect(() => { loadItem(); }, []);

  const containerStyle = {
    padding: "40px",
    fontFamily: "Arial, sans-serif",
    color: "#ffffff",          
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  };

  const cardStyle = {
    backgroundColor: "#2d2d2d", 
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.5)",
    width: "100%",
    maxWidth: "500px",
    border: "1px solid #444"
  };

  const inputGroup = { marginBottom: "20px" };
  
  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
    color: "#ccc"
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#ffffff",
    color: "#000000",          
    fontSize: "16px",
    boxSizing: "border-box" 
  };

  const btnUpdate = {
    padding: "10px 20px",
    backgroundColor: "#22c55e", 
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    marginRight: "10px"
  };

  const linkBack = {
    textDecoration: "none",
    color: "#fff",
    fontSize: "16px",
    padding: "10px 20px",
    border: "1px solid #666",
    borderRadius: "5px",
    backgroundColor: "#444"
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ borderBottom: "1px solid #555", paddingBottom: "15px", marginTop: 0 }}>Edit Item</h2>
        <p style={{ color: "#888", fontSize: "12px", marginBottom: "20px" }}>Item ID: {id}</p>

        <div style={inputGroup}>
            <label style={labelStyle}>Name</label>
            <input type="text" ref={itemNameRef} style={inputStyle} />
        </div>

        <div style={inputGroup}>
            <label style={labelStyle}>Category</label>
            <select ref={itemCategoryRef} style={inputStyle}>
                <option>Stationary</option>
                <option>Kitchenware</option>
                <option>Appliance</option>
            </select>
        </div>

        <div style={inputGroup}>
            <label style={labelStyle}>Price</label>
            <input type="number" ref={itemPriceRef} style={inputStyle} />
        </div>

        <div style={{ marginTop: "30px", textAlign: "right" }}>
            <button onClick={onUpdate} style={btnUpdate}>Save Changes</button>
            <Link to="/items" style={linkBack}>Cancel</Link>
        </div>
      </div>
    </div>
  );
}