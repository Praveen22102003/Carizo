import React, { useState, useEffect } from "react";
import "../styles/AddCategory.css";
import "../styles/AddCategory.css";

const AddCategory = ({ categoryToEdit, onSave, onCancel }) => {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  const isAdmin = localStorage.getItem("role") === "ROLE_ADMIN";

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setImagePreviewUrl(categoryToEdit.imageUrl || "");
    } else {
      setName("");
      setImagePreviewUrl("");
      setImageFile(null);
    }
  }, [categoryToEdit]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Category name is required");
      return;
    }

    // Use FormData for image upload
    const formData = new FormData();
    if (categoryToEdit?.id) {
      formData.append("id", categoryToEdit.id);
    }
    formData.append("name", name.trim());
    if (imageFile) {
      formData.append("image", imageFile);
    }
    

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
          // NOTE: No 'Content-Type' header here for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to save category");
      }

      await response.json();
      alert(`Category ${categoryToEdit ? "updated" : "added"} successfully!`);
      setName("");
      setImageFile(null);
      setImagePreviewUrl("");
      onSave(); // Refresh or close form callback
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isAdmin) {
    return (
      <div className="add-category-container">
        <p className="access-denied">Access Denied: Only admins can manage categories.</p>
        <button onClick={onCancel}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="add-category-container">
      <h2>{categoryToEdit ? "Edit Category" : "Add Category"}</h2>
      <form onSubmit={handleSubmit} className="add-category-form" encType="multipart/form-data">
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <label htmlFor="imageUpload">
          {imagePreviewUrl ? (
            <img src={imagePreviewUrl} alt="Category Preview" />
          ) : (
            <div>Upload Image</div>
          )}
        </label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageChange}
        />

        <div className="buttons">
          <button type="submit">{categoryToEdit ? "Update" : "Add"}</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
