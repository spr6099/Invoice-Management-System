import axios from "../utils/axiosInstance";

export const addItem = async (items) => {
  try {
    const { data } = await axios.post("/items", items);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getItems = async () => {
  try {
    const { data } = await axios.get("/items");
    return data;
  } catch (error) {
    throw error
  }
}

export const updateItems = async (id, data) => {
  try {
    const { datas } = await axios.put(`/items/${id}`, data);
    return datas;
  } catch (error) {
    throw error
  }
}
export const deleteItems = async (id) => {
  try {
    const { data } = await axios.delete(`/items/${id}`);
    return data;
  } catch (error) {
    throw error
  }
}