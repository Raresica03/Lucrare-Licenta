import { LoginModel, LoginResponse } from "./types/LoginModel";
import { PendingUser } from "./types/PendingUser";
import { RegisterModel } from "./types/RegisterModel";

export async function registerUser(
  registerModel: RegisterModel
): Promise<void> {
  const formData = new FormData();
  formData.append("FirstName", registerModel.firstName);
  formData.append("LastName", registerModel.lastName);
  formData.append("Email", registerModel.email);
  formData.append("Password", registerModel.password);
  formData.append("ConfirmPassword", registerModel.confirmPassword);
  formData.append("Role", registerModel.role);
  formData.append("CardImage", registerModel.cardImage);

  const response = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Registration failed");
  }
}

export async function loginUser(
  loginModel: LoginModel
): Promise<LoginResponse> {
  const response = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginModel),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  return await response.json();
}

export async function fetchPendingUsers(): Promise<PendingUser[]> {
  const response = await fetch(
    "http://localhost:5000/api/admin/pending-users",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch pending users");
  }

  return await response.json();
}

export async function approveUser(userId: string): Promise<void> {
  const response = await fetch(
    `http://localhost:5000/api/admin/approve-user/${userId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to approve user");
  }
}
