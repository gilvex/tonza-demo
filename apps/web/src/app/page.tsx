import { trpc } from "@web/app/trpc";
import ClientSide from "@web/features/test/ClientSide";

export default async function Home() {
  const user = await trpc.users.getUserById.query({ userId: "Tom" });
  return (
    <div>
      {user.name}
      <ClientSide />
    </div>
  );
}
