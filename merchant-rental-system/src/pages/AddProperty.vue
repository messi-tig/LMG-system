<template>
  <div class="add-property-page">
    <div class="form-container animate-fadeIn auth-card">
      <h2 class="title">{{ t('addProperty.title') }}</h2>

      <!-- Error Message -->
      <div v-if="error" class="alert error animate-fadeIn">{{ error }}</div>

      <!-- Success Message -->
      <div v-if="success" class="alert success animate-fadeIn">{{ success }}</div>

      <form @submit.prevent="submitProperty" class="property-form">
        <!-- Property Name -->
        <div class="form-group">
          <label class="form-label">{{ t('addProperty.propertyName') }}</label>
          <input v-model="form.name" type="text" :placeholder="t('addProperty.propertyName')" required class="form-input" />
        </div>

        <!-- Description -->
        <div class="form-group">
          <label class="form-label">{{ t('addProperty.description') }}</label>
          <textarea v-model="form.description" :placeholder="t('addProperty.description')" required class="form-input"></textarea>
        </div>

        <!-- Category -->
        <div class="form-group">
          <label class="form-label">{{ t('addProperty.category') }}</label>
          <select v-model="form.category" required class="form-input">
            <option disabled value="">{{ t('addProperty.category') }}</option>
            <option value="EventSupply">{{ t('addProperty.categoryOptions.eventSupply') }}</option>
            <option value="ConstructionEquipment">{{ t('addProperty.categoryOptions.constructionEquipment') }}</option>
            <option value="HealthcareMedical">{{ t('addProperty.categoryOptions.healthcareMedical') }}</option>
            <option value="Other">{{ t('addProperty.categoryOptions.other') }}</option>
          </select>
        </div>

        <!-- Pricing Grid -->
        <div class="grid">
          <div>
            <label class="form-label">{{ t('addProperty.hourlyPrice') }}</label>
            <input v-model.number="form.rentalPriceperhour" type="number" min="0" placeholder="0" class="form-input" />
          </div>
          <div>
            <label class="form-label">{{ t('addProperty.dailyPrice') }}</label>
            <input v-model.number="form.rentalPriceperday" type="number" min="0" placeholder="0" class="form-input" />
          </div>
          <div>
            <label class="form-label">{{ t('addProperty.weeklyPrice') }}</label>
            <input v-model.number="form.rentalPriceperweek" type="number" min="0" placeholder="0" class="form-input" />
          </div>
          <div>
            <label class="form-label">{{ t('addProperty.monthlyPrice') }}</label>
            <input v-model.number="form.rentalPricepermonth" type="number" min="0" placeholder="0" class="form-input" />
          </div>
          <div>
            <label class="form-label">{{ t('addProperty.yearlyPrice') }}</label>
            <input v-model.number="form.rentalPriceperyear" type="number" min="0" placeholder="0" class="form-input" />
          </div>
        </div>

        <!-- Number of Properties -->
        <div class="form-group">
          <label class="form-label">{{ t('addProperty.numberOfProperties') }}</label>
          <input v-model.number="form.numberOfProperty" type="number" min="1" required class="form-input" />
        </div>

        <!-- Image Upload -->
        <div class="form-group">
          <label class="form-label">{{ t('addProperty.uploadImages') }}</label>
          <input type="file" multiple accept="image/*" @change="handleImageUpload" class="form-input-file" />
          <div v-if="previewImages.length" class="image-preview animate-fadeIn">
            <img v-for="(img, index) in previewImages" :key="index" :src="img" class="w-28 h-28 object-cover rounded-xl border border-gray-200 shadow-sm hover:scale-105 transition-transform duration-200" />
          </div>
        </div>

        <!-- Submit Button -->
        <button type="submit" :disabled="loading" class="btn-submit">
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? t('addProperty.submitting') : t('addProperty.createButton') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();

const form = ref({
  name: "",
  description: "",
  category: "",
  rentalPriceperhour: 0,
  rentalPriceperday: 0,
  rentalPriceperweek: 0,
  rentalPricepermonth: 0,
  rentalPriceperyear: 0,
  numberOfProperty: 1,
});

const images = ref([]);
const previewImages = ref([]);
const error = ref("");
const success = ref("");
const loading = ref(false);

const handleImageUpload = (e) => {
  images.value = Array.from(e.target.files);
  previewImages.value = images.value.map((file) => URL.createObjectURL(file));
};

const submitProperty = async () => {
  error.value = "";
  success.value = "";
  loading.value = true;

  try {
    const token = localStorage.getItem("merchantToken");
    if (!token) throw new Error("No token found. Please log in again.");

    const formData = new FormData();
    Object.entries(form.value).forEach(([key, val]) => formData.append(key, val));

    // ✅ MATCH backend field name exactly: 'images'
    images.value.forEach((img) => formData.append("images", img));

    const response = await axios.post("http://localhost:3000/merchant/properties", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    success.value = response.data.message || t('addProperty.successMessage');
    form.value = {
      name: "",
      description: "",
      category: "",
      rentalPriceperhour: 0,
      rentalPriceperday: 0,
      rentalPriceperweek: 0,
      rentalPricepermonth: 0,
      rentalPriceperyear: 0,
      numberOfProperty: 1,
    };
    images.value = [];
    previewImages.value = [];
  } catch (err) {
    error.value = err.response?.data?.message || t('addProperty.errorMessage');
  } finally {
    loading.value = false;
  }
};
</script>


<style scoped>
/* ===== Background ===== */
.add-property-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f2fe, #eff6ff);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Inter', sans-serif;
  padding: 2rem;
}

/* ===== Animations ===== */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn { animation: fadeIn 0.5s ease-in-out; }

/* ===== Card ===== */
.auth-card {
  transition: all 0.3s ease;
}
.auth-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

/* ===== Form Container ===== */
.form-container {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

/* ===== Title ===== */
.title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  color: #1e3a8a;
  margin-bottom: 1.5rem;
}

/* ===== Alerts ===== */
.alert {
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-weight: 500;
  text-align: center;
}
.alert.error {
  background-color: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}
.alert.success {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

/* ===== Inputs ===== */
.form-label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.4rem;
  display: block;
}
.form-input,
.form-input-file {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  background-color: #f9fafb;
  transition: all 0.25s ease;
}
.form-input:focus,
.form-input-file:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  background-color: #fff;
  outline: none;
}
.form-input-file {
  border-style: dashed;
  cursor: pointer;
}

/* ===== Image Preview ===== */
.image-preview img {
  transition: transform 0.2s ease;
}
.image-preview img:hover {
  transform: scale(1.05);
}

/* ===== Button ===== */
.btn-submit {
  width: 100%;
  background: linear-gradient(90deg, #2563eb, #1d4ed8);
  color: #fff;
  font-weight: 600;
  padding: 12px;
  border-radius: 10px;
  border: none;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
}
.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(37, 99, 235, 0.35);
}
.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ===== Loading Spinner ===== */
.loading-spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: inline-block;
  margin-right: 8px;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
