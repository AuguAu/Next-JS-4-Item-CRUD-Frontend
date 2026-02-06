import { useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function UserDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const firstnameRef = useRef();
  const lastnameRef = useRef();

  async function loadUser() {
    try {
      const response = await fetch(`http://localhost:3000/api/user/${id}`);
      const data = await response.json();
      
    if (response.ok) {
      usernameRef.current.value = data.username || "";
      emailRef.current.value = data.email || "";
      passwordRef.current.value = ""; 
      firstnameRef.current.value = data.firstname || "";
      lastnameRef.current.value = data.lastname || "";
      }
    } catch (err) {
      alert("Error loading user data");
    }
  }

  async function onUpdate() {
    const body = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      firstname: firstnameRef.current.value,
      lastname: lastnameRef.current.value,
    };

    try {
      const response = await fetch(`http://localhost:3000/api/user/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        alert("User updated successfully!");
        navigate("/users"); 
      }
    } catch (err) {
      alert("Update failed");
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  const containerStyle = { padding: "40px", fontFamily: "Arial", backgroundColor: "#1e1e1e", color: "#fff", minHeight: "100vh", display: "flex", justifyContent: "center" };
  const cardStyle = { backgroundColor: "#2d2d2d", padding: "30px", borderRadius: "10px", width: "100%", maxWidth: "500px", border: "1px solid #444" };
  const inputGroup = { marginBottom: "15px" };
  const labelStyle = { display: "block", marginBottom: "5px", color: "#ccc" };
  const inputStyle = { width: "100%", padding: "10px", borderRadius: "5px", border: "none", backgroundColor: "#fff", color: "#000", boxSizing: "border-box" };
  const btnSave = { padding: "10px 20px", backgroundColor: "#22c55e", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", marginRight: "10px" };
  const btnCancel = { padding: "10px 20px", backgroundColor: "#444", color: "#fff", border: "1px solid #666", borderRadius: "5px", textDecoration: "none", display: "inline-block" };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ borderBottom: "1px solid #555", paddingBottom: "15px" }}>Edit User</h2>
        <p style={{ fontSize: "12px", color: "#888" }}>User ID: {id}</p>

        <div style={inputGroup}>
          <label style={labelStyle}>Username</label>
          <input type="text" ref={usernameRef} style={inputStyle} />
        </div>

        <div style={inputGroup}>
          <label style={labelStyle}>Email</label>
          <input type="email" ref={emailRef} style={inputStyle} />
        </div>

        <div style={inputGroup}>
          <label style={labelStyle}>Password</label>
          <input type="text" ref={passwordRef} style={inputStyle} />
        </div>

        <div style={inputGroup}>
          <label style={labelStyle}>First Name</label>
          <input type="text" ref={firstnameRef} style={inputStyle} />
        </div>

        <div style={inputGroup}>
          <label style={labelStyle}>Last Name</label>
          <input type="text" ref={lastnameRef} style={inputStyle} />
        </div>

        <div style={{ marginTop: "20px" }}>
          <button onClick={onUpdate} style={btnSave}>Save Changes</button>
          <Link to="/users" style={btnCancel}>Cancel</Link>
        </div>
      </div>
    </div>
  );
}