<template>
  <div class="add-property-page">
    <div class="form-container animate-fadeIn auth-card">
      
      <!-- Sticky Title -->
      <h2 class="title">{{ t('addProperty.title') }}</h2>

      <!-- Scrollable Form Content -->
      <div class="form-scrollable">
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
          <div class="grid pricing-grid">
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
              <img v-for="(img, index) in previewImages" :key="index" :src="img" class="image-thumb" />
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
    images.value.forEach((img) => formData.append("images", img));

    const response = await axios.post("https://lmgtech-4.onrender.com/merchant/properties", formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });

    success.value = response.data.message || t('addProperty.successMessage');
    form.value = { name:"", description:"", category:"", rentalPriceperhour:0, rentalPriceperday:0, rentalPriceperweek:0, rentalPricepermonth:0, rentalPriceperyear:0, numberOfProperty:1 };
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
.add-property-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f2fe, #eff6ff);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Inter', sans-serif;
  padding: 1rem;
}

.form-container {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin: 1rem 0;
  color: #1e3a8a;
  flex-shrink: 0;
}

/* Scrollable form */
.form-scrollable {
  overflow-y: auto;
  padding: 1rem 2rem;
}

/* Other styles same as before */
.form-group { margin-bottom: 1rem; }
.form-label { font-weight:600; margin-bottom:0.4rem; display:block; color:#374151; }
.form-input, .form-input-file {
  width: 100%;
  border:1px solid #d1d5db;
  border-radius:10px;
  padding:0.75rem 1rem;
  font-size:0.95rem;
  background-color:#f9fafb;
  transition: all 0.25s ease;
}
.form-input:focus, .form-input-file:focus {
  border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.2); outline:none; background:#fff;
}
.form-input-file { border-style:dashed; cursor:pointer; }

.image-preview { display: flex; flex-wrap: wrap; gap:0.5rem; margin-top:0.5rem; }
.image-thumb { width:5.5rem; height:5.5rem; object-fit:cover; border-radius:12px; border:1px solid #e5e7eb; box-shadow:0 2px 6px rgba(0,0,0,0.05); transition: transform 0.2s; }
.image-thumb:hover { transform: scale(1.05); }

.pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px,1fr)); gap:1rem; }

.btn-submit { width: 100%; background: linear-gradient(90deg, #2563eb, #1d4ed8); color:#fff; font-weight:600; padding:12px; border-radius:10px; border:none; font-size:1rem; transition: all 0.3s ease; box-shadow:0 4px 10px rgba(37,99,235,0.3); margin-top:1rem; }
.btn-submit:hover:not(:disabled){ transform: translateY(-2px); box-shadow:0 6px 15px rgba(37,99,235,0.35);}
.btn-submit:disabled{ opacity:0.6; cursor:not-allowed;}

.loading-spinner { border: 3px solid rgba(255,255,255,0.3); border-top:3px solid white; border-radius:50%; width:18px; height:18px; display:inline-block; margin-right:8px; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .form-container { padding:1rem; border-radius:16px; max-height: 95vh; }
  .title { font-size:1.5rem; }
  .pricing-grid { grid-template-columns: repeat(auto-fit,minmax(100px,1fr)); }
  .image-thumb { width:4.5rem; height:4.5rem; }
  .btn-submit { font-size:0.95rem; padding:10px; }
}
</style>
