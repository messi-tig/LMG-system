// src/store/merchantStore.js
import { reactive } from 'vue';

export const merchantStore = reactive({
  _id: '',
  fullName: '',
  email: '',
  phonenumber: '',
  acountnumber: '',
  businessName: '',
  address: '',
  profilePictureUrl: '', // Cloudinary URL
});

export function setMerchantProfile(profile) {
  merchantStore._id = profile.id;
  merchantStore.fullName = profile.fullName;
  merchantStore.email = profile.email;
  merchantStore.phonenumber = profile.phonenumber;
  merchantStore.acountnumber = profile.acountnumber;
  merchantStore.businessName = profile.businessName;
  merchantStore.address = profile.address;
  merchantStore.profilePictureUrl = profile.profilePictureUrl || '';
}
