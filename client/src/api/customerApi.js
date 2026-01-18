import axios from "../utils/axiosInstance";

export const registerCustomer = async (formData) => {
  try {
    const { data } = await axios.post("/customer", formData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getCustomer = async () => {
  try {
    const { data } = await axios.get("/customer");
    return data;
  } catch (error) {
    throw error
  }
}

export const updateCustomer = async (id, data) => {
  try {
    console.log(id,data)
    const { datas } = await axios.put(`/customer/${id}`, data);
    return datas;
  } catch (error) {
    throw error
  }
}
export const deleteCustomer = async (id) => {
  try {
    console.log(id)
    const { data } = await axios.delete(`/customer/${id}`);
    return data;
  } catch (error) {
    throw error
  }
}