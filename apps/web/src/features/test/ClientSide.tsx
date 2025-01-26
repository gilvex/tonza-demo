"use client";

import { trpc } from "@web/app/trpc";
import { useEffect, useState } from "react";

export default function ClientSide() {
  const [greeting, setGreeting] = useState("Loading...");
  useEffect(() => {
    trpc.users.getUserById
      .query({ userId: `Tom` })
      .then(({ name }) => setGreeting(name));
  }, []);
  return <p>I am client side: {greeting}</p>;
}
