<template>
  <div class="user-list">
    <h2>Users</h2>
    <UserSearch @search="onSearch" />
  <button class="add-btn" @click="openAdd">{{ $t('add_user') }}</button>
  <div v-if="filtered.length===0">{{ $t('no_users') }}</div>
    <div class="cards">
      <UserCard
        v-for="user in filtered"
        :key="user.id"
        :user="user"
        @edit="openEdit"
        @delete="onDelete"
        @click="openProfile(user)"
      />
    </div>
    <Modal v-model="showForm">
      <UserForm :modelValue="editUser" @save="onSave" @cancel="closeForm" />
    </Modal>
    <Modal v-model="showProfile">
      <UserProfile :user="profileUser" @close="closeProfile" />
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import UserCard from './UserCard.vue'
import UserForm from './UserForm.vue'
import UserSearch from './UserSearch.vue'
import UserProfile from './UserProfile.vue'
import Modal from '../Common/Modal.vue'

const users = ref([
  { id: 1, name: 'Alice Martin', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob Chen', email: 'bob@example.com', role: 'Moderator' },
])
const query = ref('')
const showForm = ref(false)
const editUser = ref(null)
const showProfile = ref(false)
const profileUser = ref(null)

const filtered = computed(() => {
  if (!query.value) return users.value
  return users.value.filter(u =>
    u.name.toLowerCase().includes(query.value.toLowerCase()) ||
    u.email.toLowerCase().includes(query.value.toLowerCase())
  )
})

function onSearch(q) {
  query.value = q
}
function openAdd() {
  editUser.value = null
  showForm.value = true
}
function openEdit(user) {
  editUser.value = { ...user }
  showForm.value = true
}
function onSave(user) {
  if (editUser.value && editUser.value.id) {
    // Edit existing
    const idx = users.value.findIndex(u => u.id === editUser.value.id)
    if (idx !== -1) users.value[idx] = { ...user, id: editUser.value.id }
  } else {
    // Add new
    users.value.push({ ...user, id: Date.now() })
  }
  showForm.value = false
}
function closeForm() {
  showForm.value = false
}
function onDelete(user) {
  users.value = users.value.filter(u => u.id !== user.id)
}
function openProfile(user) {
  profileUser.value = user
  showProfile.value = true
}
function closeProfile() {
  showProfile.value = false
}
</script>

<style scoped>
.user-list { max-width: 900px; margin: 0 auto; }
.user-list .cards{display:flex;gap:1rem;flex-wrap:wrap;margin-top:1rem}
.add-btn{margin:.75rem 0;padding:.5rem 1.2rem;border-radius:8px;background:#4f46e5;color:#fff;border:0;font-weight:600;cursor:pointer}
</style>
