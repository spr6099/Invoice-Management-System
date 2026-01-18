import axios from "../utils/axiosInstance";


export const registerUser = async (formData) => {
  try {
    const { data } = await axios.post("/user/register", formData);
    return data;
  } catch (error) {
    throw error;
  }
};
export const loginUser = async (formData) => {
  try {
    // console.log(formData)
    const { data } = await axios.post("/user/login", formData);
    return data;
  } catch (error) {
    throw error;
  }
};


