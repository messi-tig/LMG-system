<template>
  <div class="wrap">
    <h1 class="heading">{{ $t('bookingList.title') }}</h1>

    <div class="controls">
      <input v-model="search" :placeholder="$t('bookings.searchPlaceholder')" class="input" />
      <select v-model="statusFilter" class="input">
        <option value="">{{ $t('bookings.statusFilter.all') }}</option>
        <option value="PENDING">Pending</option>
        <option value="ACCEPTED">Accepted</option>
        <option value="DECLINED">Declined</option>
        <option value="CONFIRMED">Confirmed</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
      <button @click="fetchBookings" class="btn">{{ $t('bookings.refresh') }}</button>
    </div>

    <div v-if="loading" class="meta">{{ $t('bookings.loading') }}</div>
    <div v-if="error" class="error">{{ error }}</div>

    <!-- TABLE VIEW FOR DESKTOP -->
    <div v-if="!loading && bookings.length" class="table-wrap desktop-table">
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>{{ $t('bookings.table.property') }}</th>
            <th>{{ $t('bookings.table.merchant') }}</th>
            <th>{{ $t('bookings.table.dates') }}</th>
            <th>{{ $t('bookings.table.payment') }}</th>
            <th>{{ $t('bookings.table.status') }}</th>
            <th>{{ $t('bookings.table.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(b, idx) in filteredBookings" :key="getId(b)">
            <td class="cell">{{ idx + 1 }}</td>
            <td class="cell">
              <div class="prop">
                <img v-if="b.imageUrls?.length" :src="b.imageUrls[0]" class="thumb" />
                <div>
                  <div class="prop-name">{{ b.propertyName || b.assetName || $t('bookings.table.na') }}</div>
                  <div class="small">{{ $t('merchantList.category') || 'Category' }}: {{ b.category || $t('bookings.table.na') }}</div>
                </div>
              </div>
            </td>
            <td class="cell">
              <div>{{ b.merchant?.name || b.businessName || $t('bookings.table.na') }}</div>
              <div class="small">{{ b.merchant?.email || b.merchantEmail || '' }}</div>
            </td>
            <td class="cell">
              <div>{{ formatDate(b.startDate) }}</div>
              <div class="small">→ {{ formatDate(b.endDate) }}</div>
            </td>
            <td class="cell">
              <a v-if="b.paymentProofPath && b.paymentProofPath !== 'no payment proven'" :href="b.paymentProofPath" target="_blank">
                {{ $t('bookings.table.viewPayment') }}
              </a>
              <span v-else>{{ $t('bookings.table.na') }}</span>
            </td>
            <td class="cell">
              <select v-model="b.status" @change="onStatusChange(b)" class="input-small">
                <option value="PENDING">Pending</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="DECLINED">Declined</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </td>
            <td class="cell actions-cell">
              <button @click="openUpdate(b)" class="btn">{{ $t('bookings.table.update') }}</button>
              <button @click="confirmDelete(b)" class="btn-danger">{{ $t('bookings.table.delete') }}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MOBILE CARD VIEW -->
    <div v-if="!loading && bookings.length" class="mobile-cards">
      <div v-for="b in filteredBookings" :key="getId(b)" class="card">
        <div class="card-header">
          <img v-if="b.imageUrls?.length" :src="b.imageUrls[0]" class="thumb" />
          <div>
            <div class="prop-name">{{ b.propertyName || b.assetName || $t('bookings.table.na') }}</div>
            <div class="small">{{ $t('merchantList.category') || 'Category' }}: {{ b.category || $t('bookings.table.na') }}</div>
          </div>
        </div>
        <div class="card-body">
          <div><strong>{{ $t('bookings.table.merchant') }}:</strong> {{ b.merchant?.name || b.businessName || $t('bookings.table.na') }}</div>
          <div class="small">{{ b.merchant?.email || b.merchantEmail || '' }}</div>
          <div><strong>{{ $t('bookings.table.dates') }}:</strong> {{ formatDate(b.startDate) }} → {{ formatDate(b.endDate) }}</div>
          <div><strong>{{ $t('bookings.table.payment') }}:</strong>
            <a v-if="b.paymentProofPath && b.paymentProofPath !== 'no payment proven'" :href="b.paymentProofPath" target="_blank">
              {{ $t('bookings.table.viewPayment') }}
            </a>
            <span v-else>{{ $t('bookings.table.na') }}</span>
          </div>
          <div><strong>{{ $t('bookings.table.status') }}:</strong>
            <select v-model="b.status" @change="onStatusChange(b)" class="input-small">
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="DECLINED">Declined</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div class="card-actions">
            <button @click="openUpdate(b)" class="btn">{{ $t('bookings.table.update') }}</button>
            <button @click="confirmDelete(b)" class="btn-danger">{{ $t('bookings.table.delete') }}</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading && !bookings.length" class="meta">{{ $t('bookings.noBookings') }}</div>

    <!-- UPDATE MODAL -->
    <div v-if="showUpdateForm" class="modal-overlay" @click.self="cancelUpdate">
      <div class="modal">
        <h3>{{ $t('bookings.updateBooking') }}</h3>
        <div class="form-group">
          <label>{{ $t('bookings.table.status') }}</label>
          <select v-model="updateBooking.status" class="input-small">
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="DECLINED">Declined</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div class="form-group">
          <label>{{ $t('bookings.table.dates') }}</label>
          <div class="date-group">
            <input type="date" v-model="updateBooking.startDate" class="input" />
            <span>→</span>
            <input type="date" v-model="updateBooking.endDate" class="input" />
          </div>
        </div>
        <div class="form-group">
          <label>{{ $t('bookings.table.paymentProof') }}</label>
          <input type="text" v-model="updateBooking.paymentProofPath" class="input" placeholder="Payment URL or path" />
        </div>
        <div class="form-actions">
          <button @click="submitUpdate" class="btn">{{ $t('bookings.update') }}</button>
          <button @click="cancelUpdate" class="btn-danger">{{ $t('bookings.cancel') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllBookings, updateBookingByAdmin, deleteBookingByAdmin } from '@/utils/booking.js';

export default {
  name: 'BookingList',
  data() {
    return {
      bookings: [],
      loading: false,
      error: null,
      search: '',
      statusFilter: '',
      updateBooking: null,
      showUpdateForm: false
    };
  },
  computed: {
    filteredBookings() {
      const q = this.search.trim().toLowerCase();
      return this.bookings.filter(b => {
        const name = (b.propertyName || b.assetName || '').toString().toLowerCase();
        const statusMatch = this.statusFilter ? (b.status === this.statusFilter) : true;
        const searchMatch = q ? name.includes(q) : true;
        return statusMatch && searchMatch;
      });
    },
  },
  methods: {
    getId(item) { return item._id || item.bookingId || item.id || null; },
    formatDate(dateStr) { return dateStr ? new Date(dateStr).toLocaleDateString() : this.$t('bookings.table.na'); },
    async fetchBookings() {
      this.loading = true;
      this.error = null;
      try {
        const res = await getAllBookings();
        let payload = res?.data;
        if (Array.isArray(payload)) this.bookings = payload;
        else if (payload && Array.isArray(payload.bookings)) this.bookings = payload.bookings;
        else if (payload && payload.data && Array.isArray(payload.data.bookings)) this.bookings = payload.data.bookings;
        else this.bookings = Array.isArray(payload) ? payload : (payload?.bookings || payload?.data?.bookings || []);

        this.bookings = this.bookings.map(b => ({
          ...b,
          _id: b.bookingId || b._id || b.id,
          status: b.status || 'PENDING',
          _previousStatus: b.status || 'PENDING',
        }));
      } catch (err) {
        console.error('Fetch bookings error:', err);
        this.error = err?.response?.data?.message || err.message || this.$t('bookings.updateFailed');
        this.bookings = [];
      } finally { this.loading = false; }
    },
    async onStatusChange(booking) {
      const id = this.getId(booking);
      if (!id) return alert(this.$t('bookings.alerts.missingId'));
      const previousStatus = booking._previousStatus || 'PENDING';
      try {
        await updateBookingByAdmin(id, { status: booking.status });
        booking._previousStatus = booking.status;
        alert(this.$t('bookings.alerts.statusUpdated'));
      } catch (err) {
        console.error('Error updating booking:', err);
        alert(err?.response?.data?.message || this.$t('bookings.alerts.updateFailed'));
        booking.status = previousStatus;
      }
    },
    confirmDelete(booking) {
      const bookingId = this.getId(booking);
      if (!bookingId) return alert(this.$t('bookings.alerts.missingId'));
      if (!confirm(this.$t('bookings.alerts.deleteConfirm'))) return;
      this.removeBooking(bookingId);
    },
    async removeBooking(bookingId) {
      try {
        await deleteBookingByAdmin(bookingId);
        this.bookings = this.bookings.filter(b => this.getId(b) !== bookingId);
        alert(this.$t('bookings.alerts.statusUpdated'));
      } catch (err) {
        console.error('Error deleting booking:', err);
        alert(err?.response?.data?.message || this.$t('bookings.alerts.deleteFailed'));
      }
    },
    openUpdate(booking) {
      this.updateBooking = { ...booking };
      this.showUpdateForm = true;
    },
    async submitUpdate() {
      if (!this.updateBooking) return;
      const id = this.getId(this.updateBooking);
      try {
        await updateBookingByAdmin(id, {
          status: this.updateBooking.status,
          startDate: this.updateBooking.startDate,
          endDate: this.updateBooking.endDate,
          paymentProofPath: this.updateBooking.paymentProofPath,
        });
        const index = this.bookings.findIndex(b => this.getId(b) === id);
        if (index !== -1) this.bookings[index] = { ...this.bookings[index], ...this.updateBooking };
        alert(this.$t('bookings.alerts.statusUpdated'));
        this.showUpdateForm = false;
        this.updateBooking = null;
      } catch (err) {
        console.error('Update booking error:', err);
        alert(err?.response?.data?.message || this.$t('bookings.alerts.updateFailed'));
      }
    },
    cancelUpdate() {
      this.showUpdateForm = false;
      this.updateBooking = null;
    }
  },
  mounted() { this.fetchBookings(); },
};
</script>
<style scoped>.wrap {
  max-width: 1100px;
  margin: 24px auto;
  padding: 16px;
  font-family: Arial, sans-serif;
}

.heading {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 14px;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.input {
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  min-width: 140px;
  flex: 1 1 auto;
}

.input-small {
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.btn {
  padding: 8px 12px;
  background: #2b7cff;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  flex: 0 0 auto;
}

.btn-danger {
  padding: 6px 10px;
  background: #e74c3c;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
}

.btn:hover, .btn-danger:hover {
  opacity: 0.95;
}

.meta {
  margin: 10px 0;
  color: #666;
}

.error {
  color: #b00020;
  margin: 10px 0;
  font-weight: 600;
}

/* Table styles */
.table-wrap {
  overflow-x: auto;
  border: 1px solid #e6e6e6;
  border-radius: 6px;
  background: #fff;
}

.table {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
}

.table th, .table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.prop {
  display: flex;
  gap: 10px;
  align-items: center;
}

.thumb {
  width: 60px;
  height: 48px;
  object-fit: cover;
  border-radius: 6px;
}

.prop-name {
  font-weight: 600;
}

.small {
  font-size: 12px;
  color: #666;
}

.actions-cell {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

/* Mobile card view */
.mobile-cards {
  display: none;
}

.card {
  border: 1px solid #e6e6e6;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
  background: #fff;
}

.card-header {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
}

.card-actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 6px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 12px;
}

.modal {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 100%;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

.modal h3 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.date-group {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.form-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 12px;
}

/* ======================
   MOBILE RESPONSIVENESS
====================== */
@media (max-width: 768px) {
  .desktop-table {
    display: none;
  }

  .mobile-cards {
    display: block;
  }

  .controls {
    flex-direction: column;
    gap: 10px;
  }

  .input, .input-small {
    width: 100%;
  }

  /* Buttons in card actions on mobile */
  .card-actions button {
    flex: 0 0 auto;       /* prevent oversize */
    max-width: 140px;     /* reasonable width */
    padding: 6px 8px;     /* smaller padding */
    font-size: 13px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .card-body {
    font-size: 13px;
  }

  .modal {
    width: 95%;
  }
}

/* Extra small screens */
@media (max-width: 480px) {
  .card-actions button {
    flex: 1 1 100%;       /* stack buttons vertically */
    max-width: 100%;
  }
}

</style>