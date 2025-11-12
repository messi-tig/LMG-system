<template>
  <div class="users-page container">
    <h1>{{ $t('users.title') }}</h1>

    <div v-if="loading" class="status">{{ $t('users.loading') }}</div>
    <div v-else-if="error" class="status error">{{ error }}</div>
    <div v-else>
      <table class="users-table">
        <thead>
          <tr>
            <th>{{ $t('users.name') }}</th>
            <th>{{ $t('users.email') }}</th>
            <th>{{ $t('users.role') }}</th>
            <th>{{ $t('users.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role || 'User' }}</td>
            <td>
              <button class="btn" @click="viewUser(user)">{{ $t('users.view') }}</button>
              <button class="btn delete" @click="deleteUser(user._id)">{{ $t('users.delete') }}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <HelpModal v-if="showHelp" @close="showHelp = false" />
    <button class="help-btn" @click="showHelp = true">{{ $t('help.title') }}</button>
  </div>
</template>

<script>
import HelpModal from '@/components/HelpModal.vue'

const API_URL = 'http://localhost:3000/admin'

export default {
  name: 'Users',
  components: { HelpModal },
  data() {
    return {
      users: [],
      loading: false,
      error: null,
      showHelp: false
    }
  },
  methods: {
    async fetchUsers() {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API_URL}/users`)
        if (!res.ok) throw new Error('Failed to fetch users')
        const data = await res.json()
        this.users = data
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    viewUser(user) {
      alert(`User: ${user.name}\nEmail: ${user.email}`)
    },
    async deleteUser(id) {
      if (!confirm(this.$t('users.confirmDelete'))) return
      try {
        const res = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error('Failed to delete user')
        this.users = this.users.filter(u => u._id !== id)
      } catch (err) {
        alert(err.message)
      }
    }
  },
  mounted() {
    this.fetchUsers()
  }
}
</script>

<style scoped>
.container {
  padding: 2rem;
}

h1 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--background-secondary);
  border-radius: 10px;
  overflow: hidden;
}

.users-table th,
.users-table td {
  padding: 0.8rem;
  border-bottom: 1px solid var(--border-color);
  text-align: left;
}

.status {
  margin: 1rem 0;
  font-weight: 500;
}

.status.error {
  color: red;
}

.btn {
  margin-right: 0.5rem;
  padding: 0.4rem 0.8rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s;
}

.btn.delete {
  background: crimson;
}

.btn:hover {
  opacity: 0.8;
}

.help-btn {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
</style>
