import { reactive } from 'vue';

export const merchantStore = reactive({
  profile: {
    fullName: '',
    email: '',
    phonenumber: '',
    acountnumber: '',
    businessName: '',
    address: '',
    profilePicture: ''
  }
});

// Helper to update the store
export function setMerchantProfile(data) {
  merchantStore.profile = { ...data };
}
