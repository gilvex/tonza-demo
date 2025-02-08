import { trpc } from "@web/app/trpc";
import { Button } from "@web/components/ui/button";
import ClientSide from "@web/features/test/ClientSide";
import Link from "next/link";

export default async function Home() {
  const user = await trpc.users.getUserById.query({ userId: "Tom" });
  return (
    <div className="p-4 flex flex-col gap-4">
      {user.name}
      <ClientSide />
      <Button>Test</Button>
      <Link href="/games/mines" className="w-full">
        <Button className="w-full">To Mines</Button>
      </Link>
    </div>
  );
}
