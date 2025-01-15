export interface Room {
  id: number;
  name: string;
  description: string;
  facultyId: number;
  roomType: "Laboratory" | "Seminar" | "Course";
}
