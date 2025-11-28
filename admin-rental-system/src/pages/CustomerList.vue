<template>
  <div class="container">
    <!-- Header / Stats -->
    <div class="header">
      <h2>👥 {{ t('customer.listTitle') }}</h2>
      <button class="btn btn-refresh" @click="fetchCustomers">
        🔄 {{ t('actions.refresh') }}
      </button>
    </div>

    <!-- Search -->
    <div class="search-container">
      <input
        v-model="searchQuery"
        :placeholder="t('customer.searchPlaceholder')"
        class="search-input"
      />
    </div>

    <!-- Customer Table (desktop) -->
    <div class="table-wrapper desktop-table">
      <table class="customer-table">
        <thead>
          <tr>
            <th>{{ t('customer.name') }}</th>
            <th>{{ t('customer.email') }}</th>
            <th>{{ t('customer.phone') }}</th>
            <th>{{ t('customer.address') }}</th>
            <th>{{ t('customer.status') }}</th>
            <th>{{ t('actions.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in filteredCustomers" :key="customer.id">
            <td>{{ customer.fullName }}</td>
            <td>{{ customer.email }}</td>
            <td>{{ customer.phonenumber }}</td>
            <td>{{ customer.address }}</td>
            <td>
              <span :class="['status', customer.isActive ? 'active' : 'suspended']">
                {{ customer.isActive ? t('customer.active') : t('customer.suspended') }}
              </span>
            </td>
            <td class="actions">
              <button :class="['btn', customer.isActive ? 'btn-warning' : 'btn-success']"
                      @click="openConfirm(customer, 'toggle')">
                {{ customer.isActive ? t('actions.suspend') : t('actions.unsuspend') }}
              </button>
              <button class="btn btn-edit" @click="openEditModal(customer)">
                {{ t('actions.edit') }}
              </button>
              <button class="btn btn-danger" @click="openConfirm(customer, 'delete')">
                {{ t('actions.delete') }}
              </button>
            </td>
          </tr>
          <tr v-if="!filteredCustomers.length">
            <td colspan="6" class="empty-state">
              {{ t('customer.empty') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Card View -->
    <div class="mobile-cards">
      <div v-for="customer in filteredCustomers" :key="customer.id" class="card">
        <div class="card-header">
          <div class="name">{{ customer.fullName }}</div>
          <div class="status" :class="customer.isActive ? 'active' : 'suspended'">
            {{ customer.isActive ? t('customer.active') : t('customer.suspended') }}
          </div>
        </div>
        <div class="card-body">
          <div><strong>{{ t('customer.email') }}:</strong> {{ customer.email }}</div>
          <div><strong>{{ t('customer.phone') }}:</strong> {{ customer.phonenumber }}</div>
          <div><strong>{{ t('customer.address') }}:</strong> {{ customer.address }}</div>
          <div class="card-actions">
            <button :class="['btn', customer.isActive ? 'btn-warning' : 'btn-success']"
                    @click="openConfirm(customer, 'toggle')">
              {{ customer.isActive ? t('actions.suspend') : t('actions.unsuspend') }}
            </button>
            <button class="btn btn-edit" @click="openEditModal(customer)">
              {{ t('actions.edit') }}
            </button>
            <button class="btn btn-danger" @click="openConfirm(customer, 'delete')">
              {{ t('actions.delete') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Dialog -->
    <div v-if="showConfirm" class="modal-backdrop">
      <div class="modal">
        <h3>{{ confirmActionType === 'delete' ? 'Confirm Deletion' : 'Confirm Status Change' }}</h3>
        <p>
          Are you sure you want to
          {{ confirmActionType === 'delete' ? 'delete' : selectedCustomer?.isActive ? 'suspend' : 'unsuspend' }}
          <strong>{{ selectedCustomer?.fullName }}</strong>?
        </p>
        <div class="modal-actions">
          <button class="btn btn-cancel" @click="showConfirm=false">Cancel</button>
          <button class="btn btn-confirm" @click="confirmAction">Confirm</button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-backdrop">
      <div class="modal">
        <h3>Edit Customer</h3>
        <form @submit.prevent="submitEdit">
          <label>Full Name</label>
          <input v-model="editCustomerData.fullName" required />

          <label>Email</label>
          <input v-model="editCustomerData.email" type="email" required />

          <label>Phone</label>
          <input v-model="editCustomerData.phonenumber" required />

          <label>Address</label>
          <input v-model="editCustomerData.address" required />

          <div class="modal-actions">
            <button type="button" class="btn btn-cancel" @click="showEditModal=false">Cancel</button>
            <button type="submit" class="btn btn-confirm">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const customers = ref([])
const searchQuery = ref('')

const showConfirm = ref(false)
const selectedCustomer = ref(null)
const confirmActionType = ref('')

const showEditModal = ref(false)
const editCustomerData = ref({})

const token = localStorage.getItem('adminToken')

const fetchCustomers = async () => {
  try {
    const { data } = await axios.get('https://lmgtech-4.onrender.com/customer/all', {
      headers: { Authorization: `Bearer ${token}` },
    })
    customers.value = data.customers || []
  } catch (err) {
    console.error(err)
    alert('Failed to fetch customers.')
  }
}

const filteredCustomers = computed(() => {
  if (!searchQuery.value.trim()) return customers.value
  return customers.value.filter(
    c =>
      (c.fullName || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const openConfirm = (customer, actionType) => {
  selectedCustomer.value = customer
  confirmActionType.value = actionType
  showConfirm.value = true
}

const confirmAction = async () => {
  if (!selectedCustomer.value) return
  try {
    if (confirmActionType.value === 'delete') {
      await axios.delete(`https://lmgtech-4.onrender.com/customer/${selectedCustomer.value.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      customers.value = customers.value.filter(c => c.id !== selectedCustomer.value.id)
      alert('Customer deleted!')
    } else if (confirmActionType.value === 'toggle') {
      const updatedStatus = { isActive: !selectedCustomer.value.isActive }
      await axios.patch(`https://lmgtech-4.onrender.com/customer/${selectedCustomer.value.id}`, updatedStatus, {
        headers: { Authorization: `Bearer ${token}` },
      })
      selectedCustomer.value.isActive = !selectedCustomer.value.isActive
      alert('Status updated!')
    }
  } catch (err) {
    console.error(err)
    alert('Operation failed.')
  }
  showConfirm.value = false
  selectedCustomer.value = null
}

const openEditModal = (customer) => {
  editCustomerData.value = { ...customer }
  showEditModal.value = true
}

const submitEdit = async () => {
  try {
    const { id, fullName, email, phonenumber, address } = editCustomerData.value
    const updated = { fullName, email, phonenumber, address }
    await axios.patch(`https://lmgtech-4.onrender.com/customer/${id}`, updated, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const index = customers.value.findIndex(c => c.id === id)
    if (index !== -1) customers.value[index] = { ...customers.value[index], ...updated }
    alert('Customer updated!')
    showEditModal.value = false
  } catch (err) {
    console.error(err)
    alert('Failed to update customer.')
  }
}

onMounted(fetchCustomers)
</script>

<style scoped>
/* General Container */
.container {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;
  background-color: #f9fafb;
  color: #111827;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* Buttons */
.btn {
  cursor: pointer;
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  transition: 0.2s;
}
.btn:hover { opacity: 0.9; }
.btn-refresh { background-color: #2563eb; color: #fff; }
.btn-edit { background-color: #2563eb; color: #fff; }
.btn-success { background-color: #16a34a; color: #fff; }
.btn-warning { background-color: #facc15; color: #111827; }
.btn-danger { background-color: #dc2626; color: #fff; }
.btn-cancel { background-color: #f3f4f6; color: #111827; }
.btn-confirm { background-color: #dc2626; color: #fff; }

/* Search */
.search-container { margin-bottom: 20px; }
.search-input {
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
}
.search-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
}

/* Table */
.table-wrapper { overflow-x: auto; }
.customer-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}
.customer-table th, .customer-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}
.customer-table th { background-color: #f3f4f6; font-weight: 700; }
.customer-table tr:hover { background-color: #f9fafb; }
.status {
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
}
.status.active { background-color: #d1fae5; color: #065f46; }
.status.suspended { background-color: #fee2e2; color: #991b1b; }

/* Empty state */
.empty-state {
  text-align: center;
  padding: 20px;
  color: #6b7280;
}

/* Modals */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}
.modal {
  background-color: #fff;
  color: #111827;
  padding: 24px;
  border-radius: 16px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}
.modal h3 { font-size: 18px; font-weight: 700; margin-bottom: 16px; }
.modal p { margin-bottom: 20px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; }

/* Mobile Cards */
.mobile-cards { display: none; }
.card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  padding: 12px;
  margin-bottom: 12px;
}
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.card-body { display: flex; flex-direction: column; gap: 6px; font-size: 14px; }
.card-actions { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }

/* Responsive */
@media (max-width: 768px) {
  .desktop-table { display: none; }
  .mobile-cards { display: block; }
  .btn { width: 100%; }
  .card-header { flex-direction: column; align-items: flex-start; }
}
</style>