<template>
  <div class="property-list-page">
    <h1 class="page-title">{{ $t('properties.title') }}</h1>

    <!-- Loading -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <p>{{ $t('properties.loading') }}</p>
    </div>

    <!-- Property Grid -->
    <div v-else-if="properties.length" class="properties-grid">
      <div v-for="prop in properties" :key="prop.id" class="property-card">
        <img
          :src="prop.imageUrls[0] || placeholderImage"
          @error="(e) => e.target.src = placeholderImage"
          class="property-image"
        />
        <div class="property-info">
          <h2>{{ prop.name }}</h2>
          <p><strong>{{ $t('properties.category') }}:</strong> {{ prop.category }}</p>
          <p><strong>{{ $t('properties.status') }}:</strong> {{ $t(`properties.${prop.status}`) }}</p>
          <p><strong>{{ $t('properties.dailyPrice') }}:</strong> {{ prop.rentalPrice.perDay }}</p>

          <div class="actions">
            <button @click="openDetails(prop)" class="details-btn">
              {{ $t('properties.viewDetails') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- No Properties -->
    <div v-else class="no-data">
      {{ $t('properties.noProperties') }}
    </div>

    <!-- Details Modal -->
    <div v-if="selectedProperty" class="modal-overlay">
      <div class="modal">
        <h2>{{ selectedProperty.name }}</h2>
        <img
          :src="selectedProperty.imageUrls[0] || placeholderImage"
          @error="(e) => e.target.src = placeholderImage"
          class="modal-img"
        />

        <!-- Details -->
        <div class="details-section">
          <p><strong>{{ $t('properties.category') }}:</strong> {{ selectedProperty.category }}</p>
          <p><strong>{{ $t('properties.description') }}:</strong> {{ selectedProperty.description }}</p>
          <p><strong>{{ $t('properties.status') }}:</strong> {{ $t(`properties.${selectedProperty.status}`) }}</p>

          <div class="prices">
            <h3>{{ $t('properties.prices') }}:</h3>
            <ul>
              <li>{{ $t('properties.hourly') }}: {{ selectedProperty.rentalPrice.perHour }}</li>
              <li>{{ $t('properties.daily') }}: {{ selectedProperty.rentalPrice.perDay }}</li>
              <li>{{ $t('properties.weekly') }}: {{ selectedProperty.rentalPrice.perWeek }}</li>
              <li>{{ $t('properties.monthly') }}: {{ selectedProperty.rentalPrice.perMonth }}</li>
              <li>{{ $t('properties.yearly') }}: {{ selectedProperty.rentalPrice.perYear }}</li>
            </ul>
          </div>
        </div>

        <!-- Edit Mode -->
        <div v-if="editing" class="edit-section">
          <form @submit.prevent="saveEdit">
            <label>{{ $t('properties.name') }}:</label>
            <input v-model="editForm.name" required />

            <label>{{ $t('properties.category') }}:</label>
            <input v-model="editForm.category" required />

            <label>{{ $t('properties.description') }}:</label>
            <textarea v-model="editForm.description"></textarea>

            <label>{{ $t('properties.status') }}:</label>
            <select v-model="editForm.status">
              <option value="available">{{ $t('properties.available') }}</option>
              <option value="rented">{{ $t('properties.rented') }}</option>
              <option value="maintenance">{{ $t('properties.maintenance') }}</option>
            </select>

            <div class="price-inputs">
              <label>{{ $t('properties.hourly') }}:</label>
              <input type="number" v-model.number="editForm.rentalPrice.perHour" min="0" />

              <label>{{ $t('properties.daily') }}:</label>
              <input type="number" v-model.number="editForm.rentalPrice.perDay" min="0" />

              <label>{{ $t('properties.weekly') }}:</label>
              <input type="number" v-model.number="editForm.rentalPrice.perWeek" min="0" />

              <label>{{ $t('properties.monthly') }}:</label>
              <input type="number" v-model.number="editForm.rentalPrice.perMonth" min="0" />

              <label>{{ $t('properties.yearly') }}:</label>
              <input type="number" v-model.number="editForm.rentalPrice.perYear" min="0" />
            </div>

            <div class="modal-actions">
              <button type="submit" class="save-btn" :disabled="saving">
                <span v-if="saving" class="spinner small"></span>
                <span v-else>{{ $t('properties.save') }}</span>
              </button>
              <button type="button" class="close-btn" @click="cancelEdit">
                {{ $t('properties.cancel') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Default Actions -->
        <div v-else class="modal-actions">
          <button @click="startEdit" class="edit-btn">{{ $t('properties.edit') }}</button>
          <button
            @click="deleteProperty(selectedProperty.id)"
            class="delete-btn"
            :disabled="deleting"
          >
            <span v-if="deleting" class="spinner small"></span>
            <span v-else>{{ $t('properties.delete') }}</span>
          </button>
          <button @click="closeDetails" class="close-btn">{{ $t('properties.close') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/merchant'
const CLOUD_BASE_URL = import.meta.env.VITE_CLOUD_URL || 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload'
const token = localStorage.getItem('merchantToken')
const lang = 'en' // can also make reactive or dynamic from i18n

// State
const properties = ref([])
const loading = ref(true)
const selectedProperty = ref(null)
const editing = ref(false)
const saving = ref(false)
const deleting = ref(false)
const editForm = ref({})
const placeholderImage = 'https://via.placeholder.com/400x250.png?text=No+Image'

// Helper to normalize image URLs
const getImageUrl = (url) => {
  if (!url) return placeholderImage
  if (url.startsWith('http')) return url
  return `${CLOUD_BASE_URL}/${url.replace(/\\/g, '/')}`
}

// Fetch properties from backend
const fetchProperties = async () => {
  loading.value = true
  try {
    const res = await axios.get(`${API_BASE_URL}/operations/properties`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { lang }
    })
    properties.value = (res.data.properties || []).map(p => ({
      ...p,
      imageUrls: (p.imageUrls || []).map(getImageUrl),
      rentalPrice: {
        perHour: p.rentalPrice?.perHour || 0,
        perDay: p.rentalPrice?.perDay || 0,
        perWeek: p.rentalPrice?.perWeek || 0,
        perMonth: p.rentalPrice?.perMonth || 0,
        perYear: p.rentalPrice?.perYear || 0
      }
    }))
  } catch (err) {
    console.error('❌ Error fetching properties:', err.response?.data || err.message)
  } finally {
    loading.value = false
  }
}

// Modal controls
const openDetails = (prop) => { selectedProperty.value = prop; editing.value = false }
const closeDetails = () => { selectedProperty.value = null }
const startEdit = () => {
  editing.value = true
  editForm.value = { ...selectedProperty.value, rentalPrice: { ...selectedProperty.value.rentalPrice } }
}
const cancelEdit = () => { editing.value = false }

// Save edited property
const saveEdit = async () => {
  saving.value = true
  try {
    await axios.patch(`${API_BASE_URL}/operations/properties/${editForm.value.id}`, editForm.value, {
      headers: { Authorization: `Bearer ${token}` },
      params: { lang }
    })
    await fetchProperties()
    selectedProperty.value = properties.value.find(p => p.id === editForm.value.id)
    editing.value = false
  } catch (err) {
    console.error('Failed to update property:', err.response?.data || err.message)
  } finally {
    saving.value = false
  }
}

// Delete property
const deleteProperty = async (id) => {
  if (!confirm('Are you sure you want to delete this property?')) return
  deleting.value = true
  try {
    await axios.delete(`${API_BASE_URL}/operations/properties/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { lang }
    })
    properties.value = properties.value.filter(p => p.id !== id)
    selectedProperty.value = null
  } catch (err) {
    console.error('Failed to delete property:', err.response?.data || err.message)
  } finally {
    deleting.value = false
  }
}

onMounted(fetchProperties)
</script>

<style scoped>
.property-list-page { padding: 2rem; font-family: 'Inter', sans-serif; }
.page-title { font-size: 1.8rem; color: #1e3a8a; font-weight: 700; margin-bottom: 1rem; }
.properties-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
.property-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 16px rgba(0,0,0,0.08); transition: transform 0.2s ease; }
.property-card:hover { transform: translateY(-4px); }
.property-image { width: 100%; height: 180px; object-fit: cover; }
.property-info { padding: 1rem; }
.actions { margin-top: 0.6rem; }
.details-btn { background-color: #2563eb; color: white; padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; }
.details-btn:hover { opacity: 0.9; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; z-index: 50; }
.modal { background: white; padding: 1.5rem; border-radius: 10px; width: 460px; max-height: 90vh; overflow-y: auto; }
.modal-img { width: 100%; border-radius: 8px; margin: 1rem 0; }
.details-section { margin-bottom: 1rem; }
.prices ul { list-style-type: disc; margin-left: 1.2rem; }
.modal-actions { display: flex; justify-content: space-between; margin-top: 1rem; }
button { cursor: pointer; border: none; padding: 0.5rem 0.8rem; border-radius: 6px; font-weight: 600; }
.edit-btn { background-color: #16a34a; color: white; }
.delete-btn { background-color: #ef4444; color: white; }
.close-btn { background-color: #6b7280; color: white; }
.save-btn { background-color: #2563eb; color: white; }
.spinner { border: 3px solid #ddd; border-top: 3px solid #2563eb; border-radius: 50%; width: 22px; height: 22px; animation: spin 0.8s linear infinite; }
.spinner.small { width: 16px; height: 16px; border-width: 2px; }
@keyframes spin { to { transform: rotate(360deg); } }
.loading-overlay { display: flex; flex-direction: column; align-items: center; justify-content: center; }
</style>
