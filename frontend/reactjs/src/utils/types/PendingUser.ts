export interface PendingUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string; // Add role to represent the user's requested role
  cardImage: string | null; // Add this property to hold the base64 image string
}
