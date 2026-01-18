export const validateCustomer = (data) => {
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const phoneRegex = /^[0-9]{10}$/;

  if (!data.email) {
    return "Email is required";
  }

  if (!gmailRegex.test(data.email)) {
    return "Please enter a valid Gmail address";
  }

  if (!data.phone) {
    return "Phone number is required";
  }

  if (!phoneRegex.test(data.phone)) {
    return "Phone number must contain exactly 10 digits";
  }

  return null; // valid
};
