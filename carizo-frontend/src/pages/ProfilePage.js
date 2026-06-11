import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    profileImageUrl: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load user data");
        return res.json();
      })
      .then((data) => setUserData(data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load user data");
      });
  }, [token]);

  const handleUpdate = (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Prepare user JSON payload
    const userPayload = {
      username: userData.username,
      email: userData.email,
    };

    formData.append(
      "user",
      new Blob([JSON.stringify(userPayload)], { type: "application/json" }),
    );

    if (imageFile) formData.append("image", imageFile);

    fetch("/api/auth/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Update failed");
        }
        return res.json();
      })
      .then((data) => {
        // The backend returns { user: {...}, token?: "newToken" }
        const updatedUser = data.user || data; // fallback if no wrapper
        setUserData(updatedUser);

        // If backend sent a new token (email was updated), update it
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        // Update other localStorage user info to keep UI consistent
        localStorage.setItem("username", updatedUser.username);
        localStorage.setItem(
          "profileImage",
          updatedUser.profileImageUrl || "/images/logo.jpg",
        );
        localStorage.setItem("email", updatedUser.email);

        setEditMode(false);
        setImageFile(null);
        alert("Profile updated successfully");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to update profile.");
      });
  };

  return (
    <div className="profile-page">
      <h2>Your Profile</h2>

      <div className="profile-card">
        <img
          className="profile-avatar-large"
          src={userData.profileImageUrl || "/images/logo.jpg"}
          alt="Profile"
        />

        {editMode ? (
          <form onSubmit={handleUpdate} className="profile-form">
            <input
              type="text"
              value={userData.username}
              onChange={(e) =>
                setUserData({ ...userData, username: e.target.value })
              }
              required
            />
            <input
              type="email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
            <button type="submit">Save</button>
            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                setImageFile(null);
              }}
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="profile-info">
            <p>
              <strong>Name:</strong>{" "}
              <span className="profile-field-value">{userData.username}</span>
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <span className="profile-field-value">{userData.email}</span>
              <button className="edit-btn" onClick={() => setEditMode(true)}>
                Edit
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
