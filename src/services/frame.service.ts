import type { FrameItem } from "../types/frame.types";
import { api } from "./api";

export async function getAllFrames(): Promise<FrameItem[]> {
  const res = await api.get<FrameItem[]>("/frames");
  return res.data;
}