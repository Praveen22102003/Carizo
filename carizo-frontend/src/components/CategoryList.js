import React from "react";
import "../styles/CategoryList.css";

const CategoryList = ({ categories, onDelete, onEdit }) => {
  const isAdmin = localStorage.getItem("role") === "ROLE_ADMIN";
  const loggedInUserId = localStorage.getItem("userId"); // make sure this is stored at login

  const deleteCategory = (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    fetch(`/api/categories/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        if (res.ok) {
          if (onDelete) onDelete(); // refresh from parent
        } else {
          res.text().then(text => alert(text || "Failed to delete category"));
        }
      })
      .catch(() => alert("Failed to delete category"));
  };

  if (!categories || categories.length === 0) return <p>No categories available.</p>;

  return (
    <div className="category-list-container">
      <h2>Category List</h2>
      <table className="category-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.name}</td>
              {isAdmin && (
                <td>
                  {/* Show edit/delete only if current user is creator */}
                  {cat.createdBy && cat.createdBy.id.toString() === loggedInUserId ? (
                    <>
                      <button className="edit-btn" onClick={() => onEdit?.(cat)}>Edit</button>
                      <button className="delete-btn" onClick={() => deleteCategory(cat.id)}>Delete</button>
                    </>
                  ) : (
                    <em>No permissions</em>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
