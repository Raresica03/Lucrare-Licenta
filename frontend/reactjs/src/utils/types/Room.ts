export interface Room {
  id: number;
  name: string;
  description: string;
  facultyId: number;
  roomType: "Laborator" | "Seminar" | "Curs";
}
