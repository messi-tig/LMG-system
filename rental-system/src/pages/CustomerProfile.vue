<template> 
  <div class="customer-profile">
    <h2>My Profile</h2>

    <!-- Loading / Error -->
    <div v-if="loading" class="loading">Loading profile...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Profile Info -->
    <form v-if="!loading && profile" @submit.prevent="updateProfile">
      <!-- Profile Image -->
      <div class="profile-section">
        <img
          v-if="imageToShow"
          :src="imageToShow"
          alt="Profile"
          class="profile-img"
          @error="handleImageError"
        />
        <input
          v-if="isEditing"
          type="file"
          accept="image/*"
          @change="handleFileUpload"
        />
      </div>

      <!-- Text Fields -->
      <div class="form-group">
        <label>Full Name</label>
        <input
          v-model="form.fullName"
          :disabled="!isEditing"
          placeholder="Enter full name"
        />

        <label>Email</label>
        <input
          v-model="form.email"
          type="email"
          :disabled="!isEditing"
          placeholder="Enter email"
        />

        <label>Phone Number</label>
        <input
          v-model="form.phonenumber"
          :disabled="!isEditing"
          placeholder="Enter phone number"
        />

        <label>Address</label>
        <input
          v-model="form.address"
          :disabled="!isEditing"
          placeholder="Enter address"
        />
      </div>

      <!-- Buttons -->
      <div class="button-group">
        <button
          v-if="!isEditing"
          type="button"
          class="edit-btn"
          @click="enableEditing"
        >
          Edit
        </button>

        <div v-else>
          <button type="submit" class="save-btn" :disabled="updating">
            {{ updating ? "Saving..." : "Save" }}
          </button>
          <button type="button" class="cancel-btn" @click="cancelEdit">
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const backendUrl = "http://localhost:3000"; // Adjust as needed
const token = localStorage.getItem("token");

const profile = ref(null);
const form = ref({
  fullName: "",
  email: "",
  phonenumber: "",
  address: "",
});
const loading = ref(true);
const updating = ref(false);
const error = ref(null);
const isEditing = ref(false);
const previewUrl = ref(null);
const selectedFile = ref(null);
const defaultProfile = "/default-avatar.png"; // fallback in /public

// ===========================================================
// 🟢 Fetch Profile
// ===========================================================
onMounted(fetchProfile);

async function fetchProfile() {
  loading.value = true;
  error.value = null;

  try {
    const res = await fetch(`${backendUrl}/customer/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    profile.value = data;

    form.value.fullName = data.fullName || "";
    form.value.email = data.email || "";
    form.value.phonenumber = data.phonenumber || "";
    form.value.address = data.address || "";
  } catch (err) {
    console.error("❌ Fetch profile error:", err);
    error.value = "Failed to load profile.";
  } finally {
    loading.value = false;
  }
}

// ===========================================================
// ✏️ Edit Controls
// ===========================================================
function enableEditing() {
  isEditing.value = true;
}
function cancelEdit() {
  isEditing.value = false;
  previewUrl.value = null;
  selectedFile.value = null;
  if (profile.value) {
    form.value.fullName = profile.value.fullName;
    form.value.email = profile.value.email;
    form.value.phonenumber = profile.value.phonenumber;
    form.value.address = profile.value.address;
  }
}

// ===========================================================
// 🖼️ File Upload + Preview
// ===========================================================
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
}

// ===========================================================
// 🔄 Update Profile
// ===========================================================
async function updateProfile() {
  updating.value = true;
  error.value = null;

  try {
    const formData = new FormData();
    formData.append("fullName", form.value.fullName);
    formData.append("email", form.value.email);
    formData.append("phonenumber", form.value.phonenumber);
    formData.append("address", form.value.address);
    if (selectedFile.value) {
      formData.append("profileImage", selectedFile.value);
    }

    const res = await fetch(`${backendUrl}/customer/profile?lang=en`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = await res.json();

    profile.value = result.updatedCustomer;

    if (result.updatedCustomer?.profileImage) {
      profile.value.profileImage = `${result.updatedCustomer.profileImage}?t=${Date.now()}`;
    }

    isEditing.value = false;
    previewUrl.value = null;
    selectedFile.value = null;

    alert("Profile updated successfully!");
  } catch (err) {
    console.error("❌ Update profile error:", err);
    error.value = "Failed to update profile.";
  } finally {
    updating.value = false;
  }
}

// ===========================================================
// ☁️ CLOUD IMAGE RETRIEVAL (exact logic as AvailableProperties)
// ===========================================================
function formatImageUrl(path) {
  if (!path) return "";

  // ✅ If full cloud or remote URL
  if (path.startsWith("https://res.cloudinary.com") || path.startsWith("http")) {
    return path;
  }

  // 🚫 Otherwise, fallback to local backend URL (if image stored locally)
  return `${backendUrl}/${path.replace(/^\//, "")}`;
}

// ===========================================================
// 🖼️ Computed Image to Display
// ===========================================================
const imageToShow = computed(() => {
  if (previewUrl.value) return previewUrl.value; // local preview
  if (profile.value?.profileImage) return formatImageUrl(profile.value.profileImage);
  return defaultProfile;
});

// ===========================================================
// ⚠️ Handle broken image
// ===========================================================
function handleImageError(event) {
  console.warn("⚠️ Profile image failed to load, fallback applied.");
  event.target.src = defaultProfile;
}
</script>

<style scoped>
.customer-profile {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}
.profile-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ddd;
  margin-bottom: 0.5rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.button-group {
  margin-top: 1rem;
  display: flex;
  gap: 10px;
}
button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}
.edit-btn {
  background: #007bff;
  color: white;
}
.save-btn {
  background: #28a745;
  color: white;
}
.cancel-btn {
  background: #dc3545;
  color: white;
}
.loading {
  color: #555;
}
.error {
  color: red;
}
</style>
