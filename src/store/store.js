import { create } from "zustand";

export const useEmployeeStore = create((set) => ({
  employeeSelected: "",
  employee: {
    id: "",
    name: "",
    gender: "",
    address: "",
    phone: "",
    birth: "",
    position: "",
    admission: "",
    sector: "",
    wage: "",
    profileImgUrl: "",
    pdfUrl: "",
    history: [],
    dismiss: false,
  },
  setEmployee: (data) =>
    set((state) => ({ employee: { ...state.employee, ...data } })),
  setEmployeeSelected: (data) => set(() => ({ employeeSelected: data })),
}));
