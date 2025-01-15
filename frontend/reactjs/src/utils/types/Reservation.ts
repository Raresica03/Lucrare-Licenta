export interface Reservation {
    id: number;
    date: string;
    timeSlot: string;
    roomName: string;
    roomType: string;
    facultyName: string;
    user?: {
      firstName: string;
      lastName: string;
      email?: string;
    };
  }
  