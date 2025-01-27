import { LoginModel, LoginResponse } from "./types/LoginModel";
import { PendingUser } from "./types/PendingUser";
import { RegisterModel } from "./types/RegisterModel";
import { Faculty } from "./types/Faculty";
import { Room } from "./types/Room";
import { Reservation } from "./types/Reservation";

const localAPIurl = "http://localhost:5000";
const remoteAPIurl =
  "https://applicationapi-app-2025011600373.delightfulbush-856d5b3f.uksouth.azurecontainerapps.io";

const usedUrl = localAPIurl;

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

  const response = await fetch(`${usedUrl}/api/auth/register`, {
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
  const response = await fetch(`${usedUrl}/api/auth/login`, {
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
  const response = await fetch(`${usedUrl}/api/admin/pending-users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch pending users");
  }

  return await response.json();
}

export async function approveUser(userId: string): Promise<void> {
  const response = await fetch(`${usedUrl}/api/admin/approve-user/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to approve user");
  }
}

export async function addFaculty(faculty: Omit<Faculty, "id">): Promise<void> {
  const token = sessionStorage.getItem("token");
  console.log("Token sent:", token); // Log the token being sent
  const response = await fetch(`${usedUrl}/api/faculties/addFaculty`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Include the token in the request
    },
    body: JSON.stringify(faculty),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add faculty");
  }
}

export async function fetchFaculties(): Promise<Faculty[]> {
  const response = await fetch(`${usedUrl}/api/faculties/getFaculties`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });

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
    `${usedUrl}/api/faculties/updateFaculty/${facultyId}`,
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
    `${usedUrl}/api/faculties/deleteFaculty/${facultyId}`,
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

export async function fetchRooms(facultyId: number): Promise<Room[]> {
  const response = await fetch(
    `${usedUrl}/api/rooms/getRoomsByFaculty/${facultyId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch rooms");
  }

  return await response.json();
}

export async function addRoom(room: Omit<Room, "id">): Promise<void> {
  const response = await fetch(`${usedUrl}/api/rooms/addRoom`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: JSON.stringify(room),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add room");
  }
}

export async function deleteRoom(roomId: number): Promise<void> {
  const response = await fetch(`${usedUrl}/api/rooms/deleteRoom/${roomId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete room");
  }
}

export async function editRoom(
  roomId: number,
  updatedRoom: Omit<Room, "id">
): Promise<void> {
  const response = await fetch(`${usedUrl}/api/rooms/updateRoom/${roomId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: JSON.stringify(updatedRoom),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update room");
  }
}

export async function fetchUnavailableSlots(
  roomId: number,
  date: Date
): Promise<string[]> {
  const response = await fetch(
    `${usedUrl}/api/rooms/getUnavailableSlots/${roomId}/${date.toISOString()}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch unavailable slots");
  }
  return await response.json();
}

export async function reserveRoom(
  roomId: number,
  date: Date,
  timeSlot: string
): Promise<void> {
  const response = await fetch(`${usedUrl}/api/rooms/reserveRoom`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: JSON.stringify({ roomId, date, timeSlot }),
  });
  if (!response.ok) {
    throw new Error("Failed to reserve room");
  }
}

export async function fetchUserReservations(): Promise<Reservation[]> {
  const response = await fetch(`${usedUrl}/api/user/reservations`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch user reservations");
  }

  return await response.json();
}

// Fetch a specific reservation by ID
export async function fetchReservationById(
  reservationId: number
): Promise<Reservation> {
  const response = await fetch(
    `${usedUrl}/api/user/reservations/${reservationId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch reservation by ID");
  }

  return await response.json();
}

// Cancel a reservation by ID
export async function cancelReservation(reservationId: number): Promise<void> {
  const response = await fetch(
    `${usedUrl}/api/user/reservations/${reservationId}`,
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
    throw new Error(errorData.message || "Failed to cancel reservation");
  }
}

export async function fetchAllReservations(): Promise<Reservation[]> {
  const response = await fetch(`${usedUrl}/api/admin/reservations`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch all reservations");
  }

  return await response.json();
}
