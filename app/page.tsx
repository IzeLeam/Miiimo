import { redirect } from "next/navigation";
import { createRoom } from "@/lib/room";

export default async function Home() {
  const room = await createRoom();
  redirect(`/${room.code}`);
}

