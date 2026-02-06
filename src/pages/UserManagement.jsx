import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]); // แก้ชื่อตัวแปรให้สื่อความหมาย (setItems -> setUsers)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const firstnameRef = useRef();
  const lastnameRef = useRef();

  async function loadUsers(targetPage = 1) {
    try {
      const response = await fetch(`http://localhost:3000/api/user?page=${targetPage}&limit=5`);
      const data = await response.json();
      setUsers(data.users); // ใช้ setUsers
      setTotalPages(data.totalPages);
      setPage(targetPage);
    } catch (err) { alert("Loading users failed"); }
  }

  async function onUserSave() {
    const uri = "http://localhost:3000/api/user";
    const body = {
        username: usernameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
        firstname: firstnameRef.current.value,
        lastname: lastnameRef.current.value,
    };

    if(!body.username || !body.email || !body.password || !body.firstname || !body.lastname) {
        alert("Please fill all fields"); 
        return;
    }

    await fetch(uri, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    // เคลียร์ค่าในช่อง
    usernameRef.current.value = "";
    emailRef.current.value = "";
    passwordRef.current.value = "";
    firstnameRef.current.value = "";
    lastnameRef.current.value = "";
    loadUsers(page); 
  }

  async function deleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
        const response = await fetch(`http://localhost:3000/api/user/${id}`, { method: "DELETE" });
        if (response.ok) loadUsers(page);
        else alert("Delete failed");
    } catch (err) { alert("Error deleting user"); }
  }

  useEffect(() => { loadUsers(1); }, []);

  // Styles (เหมือนเดิม)
  const containerStyle = { fontFamily: "Arial, sans-serif", backgroundColor: "#1e1e1e", color: "#ffffff", minHeight: "100vh", width: "100%", paddingTop: "50px", boxSizing: "border-box" };
  const contentStyle = { width: "100%", maxWidth: "1000px", margin: "0 auto", padding: "0 20px" }; // ขยายความกว้างนิดนึง
  const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "20px", border: "1px solid #555" };
  const thStyle = { backgroundColor: "#333", color: "#fff", padding: "12px", border: "1px solid #555", textAlign: "left", fontWeight: "bold" };
  const tdStyle = { padding: "12px", border: "1px solid #555", color: "#fff" };
  const inputStyle = { padding: "8px", border: "none", borderRadius: "4px", width: "90%", backgroundColor: "#ffffff", color: "#000000" };
  const btnBase = { padding: "6px 12px", cursor: "pointer", borderRadius: "4px", border: "none", fontSize: "14px", margin: "0 5px", fontWeight: "bold" };
  const btnEdit = { ...btnBase, backgroundColor: "#3b82f6", color: "white", textDecoration: "none", display: "inline-block" };
  const btnDelete = { ...btnBase, backgroundColor: "#ef4444", color: "white" };
  const btnAdd = { ...btnBase, backgroundColor: "#22c55e", color: "white" };
  const btnPage = { ...btnBase, backgroundColor: "#444", color: "#fff", border: "1px solid #666" };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        
        <h2 style={{ borderBottom: "1px solid #555", paddingBottom: "10px", marginTop: 0 }}>User Management</h2>
        
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Username</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Password</th>
              <th style={thStyle}>First Name</th>
              <th style={thStyle}>Last Name</th>
              <th style={{...thStyle, textAlign: "center", width: "150px"}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#1e1e1e" : "#2d2d2d" }}>
                <td style={tdStyle}>{user.username}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>{user.password}</td>
                <td style={tdStyle}>{user.firstname}</td>
                <td style={tdStyle}>{user.lastname}</td>
                <td style={{...tdStyle, textAlign: "center"}}>
                  <Link to={`/users/${user._id}`} style={btnEdit}>Edit</Link>
                  <button onClick={() => deleteUser(user._id)} style={btnDelete}>Delete</button>
                </td>
              </tr>
            ))}

            {/* ส่วน Add New User - แก้ไขช่อง Input ให้ถูกต้องและครบ 5 ช่อง */}
            <tr style={{ backgroundColor: "#333", borderTop: "2px solid #666" }}>
              <td style={tdStyle}>
                  <input type="text" ref={usernameRef} placeholder="Username" style={inputStyle} />
              </td>
              <td style={tdStyle}>
                  <input type="email" ref={emailRef} placeholder="Email" style={inputStyle} />
              </td>
              <td style={tdStyle}>
                  <input type="text" ref={passwordRef} placeholder="Password" style={inputStyle} />
              </td>
              <td style={tdStyle}>
                  <input type="text" ref={firstnameRef} placeholder="First Name" style={inputStyle} />
              </td>
              <td style={tdStyle}>
                  <input type="text" ref={lastnameRef} placeholder="Last Name" style={inputStyle} />
              </td>
              <td style={{...tdStyle, textAlign: "center"}}>
                  <button onClick={onUserSave} style={btnAdd}>+ Add</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
          <button disabled={page === 1} onClick={() => loadUsers(page - 1)} style={btnPage}> &lt; Previous </button>
          <span style={{ fontWeight: "bold", color: "#fff" }}>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => loadUsers(page + 1)} style={btnPage}> Next &gt; </button>
        </div>

      </div>
    </div>
  );
}