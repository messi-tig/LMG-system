<template>
  <MainLayout>
    <div class="profile-page">
      <h1>{{ $t('profile.title') }}</h1>

      <form class="profile-card" @submit.prevent="updateProfile">
        <!-- Profile Picture Preview & Upload -->
        <div class="image-upload">
          <img
            v-if="previewImage"
            :src="previewImage"
            class="profile-image"
            alt="Profile Picture"
          />
          <input type="file" @change="onFileChange" accept="image/*" />
        </div>

        <!-- Editable Fields -->
        <div class="form-group">
          <label>{{ $t('profile.fullName') }}</label>
          <input v-model="merchant.fullName" type="text" />
        </div>

        <div class="form-group">
          <label>{{ $t('profile.email') }}</label>
          <input v-model="merchant.email" type="email" />
        </div>

        <div class="form-group">
          <label>{{ $t('profile.phone') }}</label>
          <input v-model="merchant.phonenumber" type="text" />
        </div>

        <div class="form-group">
          <label>{{ $t('profile.accountNumber') }}</label>
          <input v-model="merchant.acountnumber" type="text" />
        </div>

        <div class="form-group">
          <label>{{ $t('profile.businessName') }}</label>
          <input v-model="merchant.businessName" type="text" />
        </div>

        <div class="form-group">
          <label>{{ $t('profile.address') }}</label>
          <input v-model="merchant.address" type="text" />
        </div>

        <button type="submit">{{ $t('profile.updateButton') }}</button>
      </form>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { merchantStore, setMerchantProfile } from '@/store/merchantStore';

const merchant = ref({
  fullName: '',
  email: '',
  phonenumber: '',
  acountnumber: '',
  businessName: '',
  address: '',
  profilePicture: ''
});

const selectedFile = ref(null);
const previewImage = ref('');

// Build full image URL
const imageUrl = (file) => `https://lmgtech-4.onrender.com/uploads/${file}`;

// Fetch profile on mount
onMounted(async () => {
  try {
    const lang = localStorage.getItem('lang') || 'en';
    const res = await api.get(`/merchant/operations/profile?lang=${lang}`);
    merchant.value = res.data.profile;

    // Update preview image
    if (merchant.value.profilePicture) {
      previewImage.value = imageUrl(merchant.value.profilePicture);
    }

    // Update global store
    setMerchantProfile(res.data.profile);
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
  }
});

// Handle file selection
const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedFile.value = file;
    previewImage.value = URL.createObjectURL(file);
  }
};

// Submit updated profile
const updateProfile = async () => {
  try {
    const lang = localStorage.getItem('lang') || 'en';
    const formData = new FormData();
    formData.append('fullName', merchant.value.fullName);
    formData.append('email', merchant.value.email);
    formData.append('phonenumber', merchant.value.phonenumber);
    formData.append('acountnumber', merchant.value.acountnumber);
    formData.append('businessName', merchant.value.businessName);
    formData.append('address', merchant.value.address);

    if (selectedFile.value) {
      formData.append('profilePictureFile', selectedFile.value);
    }

    const res = await api.patch(`/merchant/operations/profile?lang=${lang}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    merchant.value = res.data.profile;
    if (merchant.value.profilePicture) {
      previewImage.value = imageUrl(merchant.value.profilePicture);
    }

    // Update global store so navbar image updates
    setMerchantProfile(res.data.profile);

    alert('✅ Profile updated successfully!');
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    alert('❌ Failed to update profile.');
  }
};
</script>

<style scoped>
.profile-page {
  padding: 2rem;
}

.profile-page h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
}

.profile-card {
  max-width: 500px;
  margin: 0 auto;
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.image-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.profile-image {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0.5rem;
  border: 2px solid #4caf50;
}

/* Responsive file input */
.image-upload input[type="file"] {
  display: block;
  margin: 0.5rem auto;
  max-width: 100%;
  width: 90%;
  font-size: 0.9rem;
  cursor: pointer;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 0.4rem;
}

input {
  padding: 0.5rem 0.7rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
}

button {
  padding: 0.75rem;
  background-color: #4caf50;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover {
  background-color: #45a049;
}

/* Small screens */
@media (max-width: 600px) {
  .profile-card {
    padding: 1.5rem;
  }
  
  .profile-page h1 {
    font-size: 1.5rem;
  }
  
  input {
    font-size: 0.9rem;
  }
  
  button {
    font-size: 0.9rem;
    padding: 0.65rem;
  }
  
  .image-upload input[type="file"] {
    width: 80%;
    font-size: 0.85rem;
  }
  
  .profile-image {
    width: 100px;
    height: 100px;
  }
}

</style>
