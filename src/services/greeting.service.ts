import type { CreateGreetingPayload, GreetingResponse, Greetings, UpdateGreetingPayload } from "../types/greeting.types";
import { api } from "./api";

// 1. Get All Greetings
export async function getAllGreetings(): Promise<GreetingResponse[]> {
  const res = await api.get<GreetingResponse[]>("/greetings");
  return res.data;
}

// 2. Get Greeting By ID
export async function getGreetingById(id: string): Promise<GreetingResponse> {
  const res = await api.get<GreetingResponse>(`/greetings/${id}`);
  return res.data;
}

// 3. Create Greeting (Multipart Form Data)
export async function createGreeting(payload: CreateGreetingPayload,onProgress?: (percent: number) => void): Promise<Greetings> {
  const formData = new FormData();
  formData.append("guestName", payload.guestName);
  formData.append("photo", payload.photo);
  formData.append("audio", payload.audio);

  const res = await api.post<Greetings>("/greetings", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 60000,
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (onProgress) onProgress(percentCompleted);
      }
    },
  });
  return res.data;
}

// 4. Update Greeting By ID
export async function updateGreeting(id: string, payload: UpdateGreetingPayload): Promise<GreetingResponse> {
  const formData = new FormData();
  if (payload.guestName) formData.append("guestName", payload.guestName);
  if (payload.photo) formData.append("photo", payload.photo);
  if (payload.audio) formData.append("audio", payload.audio);

  const res = await api.put<GreetingResponse>(`/greetings/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

// 5. Delete Greeting By ID
export async function deleteGreetingById(id: string): Promise<void> {
  const res = await api.delete(`/greetings/${id}`);
  return res.data;
}