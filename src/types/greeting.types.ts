// Response DTO dari Spring Boot
export interface GreetingResponse {
  guestName: string;
  photoUrl: string;
  audioUrl: string;
  tgl: string; // e.g. "30 Jul 2026"
  jam: string; // e.g. "22:15"
}

export interface Greetings{
  id:string;
  photoUrl:string;
  audioUrl:string;
  createdAt:string;
}

// Payload Form untuk kirim Ucapan Baru (Multipart)
export interface CreateGreetingPayload {
  guestName: string;
  photo: File;
  audio: Blob;
}

// Payload Form untuk Update Ucapan
export interface UpdateGreetingPayload {
  guestName?: string;
  photo?: File | null;
  audio?: File | Blob | null;
}