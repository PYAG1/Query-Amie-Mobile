import { getItem } from "@/lib/helpers";
import axios from "axios";
type SignUpType = {
  email: string;
  full_name: string;
  username: string;
  password: string;
};

type userDetails = {
  accessToken: string;
  userId: string;
};

let token: string;
const fetchUserDetails = async (): Promise<void> => {
  const user = await getItem("userDetails");
  if (user) {
    const parsedUser: userDetails = JSON.parse(user);
    token = parsedUser?.accessToken;
    console.log(parsedUser);
  } else {
    console.log("No user details found");
  }
};

fetchUserDetails();

export const apiInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

apiInstance.interceptors.request.use(
  (config) => {
    if (!token) {
      throw new Error("User token is missing. Please log in.");
    }

    if (!config.headers) {
      config.headers = {};
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const signUp = async (data: SignUpType) => {
  return await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/signup`, data);
};

export const signIn = async (data: FormData) => {
  const response = await axios.post(
    `${process.env.EXPO_PUBLIC_API_URL}/login`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
export const UploadDocuments = async (formData: FormData) => {
  const response = await apiInstance.post("/upload_documents/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  });

  return response.data;
};

export function  Chat(){
  return apiInstance.post(`${process.env.EXPO_PUBLIC_API_URL}/chat`)
}