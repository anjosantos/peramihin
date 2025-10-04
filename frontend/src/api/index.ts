const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

import { type Expense } from "@/types";

const getAccessToken = () => {
  const sessionStoragKeys = Object.keys(sessionStorage);
  const oidcKey =
    sessionStoragKeys.find((key) =>
      key.startsWith("oidc.user:https://cognito-idp.")
    ) || "";
  const oidcContext = JSON.parse(sessionStorage.getItem(oidcKey) || "{}");
  const accessToken = oidcContext?.access_token;
  return accessToken;
};

export const deleteAccessToken = () => {
  const sessionStoragKeys = Object.keys(sessionStorage);
  const oidcKey =
    sessionStoragKeys.find((key) =>
      key.startsWith("oidc.user:https://cognito-idp.")
    ) || "";
  sessionStorage.removeItem(oidcKey);
};

export const getExpenses = async () => {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  return response.json();
};

export const getExpense = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  return response.json();
};

export const createExpense = async (expense: Expense) => {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify(expense),
  });
  return response.json();
};

export const updateExpense = async (id: string, expense: Expense) => {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify(expense),
  });
  return response.json();
};

export const deleteExpense = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  return response.json();
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch(`${API_BASE_URL}/expenses/upload`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  return response.json();
};
