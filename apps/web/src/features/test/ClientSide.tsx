"use client";

// import { trpc } from "@web/app/trpc";
// import { useEffect, useState } from "react";
import { useTelegramUser } from "../core/root/hooks/useTelegramUser";
import Image from "next/image";

export default function ClientSide() {
  const user = useTelegramUser();
  // const [greeting, setGreeting] = useState("Loading...");
  // const [error, setError] = useState("");
  
  // useEffect(() => {
  //   trpc.users.getUserById
  //     .query({ userId: `Tom2` })
  //     .then(({ name }) => setGreeting(name))
  //     .catch(err => {
  //       console.log(err);
  //       setError(JSON.stringify(err));
  //     });

  //     fetch('https://example.com/test').then(console.log)
  // }, []);
  return <div>
    <Image className="rounded-full" src={user?.photo_url ?? "favicon.ico"} alt="avatar" width={64} height={64} />
    <p>{user?.username} {user?.is_premium ? "yes" : "no"}, I am client side</p>
    {/* <p>{error}</p> */}
  </div>;
}
