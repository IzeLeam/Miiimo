import { RoomClient } from "@/components/room/RoomClient";

interface RoomPageProps {
  params: Promise<{ code: string }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { code } = await params;

  return <RoomClient code={code.toUpperCase()} />;
}

export function generateMetadata() {
  return {
    title: "Miiimo - Clipboard Room",
    description: "Share text instantly between devices",
  };
}
