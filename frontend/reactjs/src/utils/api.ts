import { LoginModel, LoginResponse } from "./types/LoginModel";
import { PendingUser } from "./types/PendingUser";
import { RegisterModel } from "./types/RegisterModel";
import { Faculty } from "./types/Faculty";

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

export async function addFaculty(faculty: Omit<Faculty, "id">): Promise<void> {
  const token = sessionStorage.getItem("token");
  console.log("Token sent:", token); // Log the token being sent
  const response = await fetch(
    `http://localhost:5000/api/faculties/addFaculty`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the request
      },
      body: JSON.stringify(faculty),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add faculty");
  }
}

export async function fetchFaculties(): Promise<Faculty[]> {
  const response = await fetch(
    `http://localhost:5000/api/faculties/getFaculties`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch faculties");
  }

  return await response.json();
}

export async function editFaculty(
  facultyId: number,
  updatedFaculty: Omit<Faculty, "id">
): Promise<void> {
  const response = await fetch(
    `http://localhost:5000/api/faculties/updateFaculty/${facultyId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedFaculty),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update faculty");
  }
}

export async function deleteFaculty(facultyId: number): Promise<void> {
  const response = await fetch(
    `http://localhost:5000/api/faculties/deleteFaculty/${facultyId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete faculty");
  }
}
