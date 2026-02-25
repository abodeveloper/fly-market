import { create } from 'zustand';

const useCartStore = create((set) => ({
  // The cart states will be handled by React Query to sync with backend
  // We keep this file strictly if lightweight client-side checks are needed,
  // but currently the Cart is 100% server driven.
}));

export default useCartStore;
