import { useQuery, useMutation } from "@tanstack/react-query";

interface WebhookParams {
  session?: string | null;
  currency?: string | null;
  amount?: number;
  trx_id?: string;
  round_id?: string;
}

export const useMobuleWebhook = (params: WebhookParams) => {
  const { session, currency } = params;

  // Check session
  const checkSession = useQuery<{
    id_player: string;
    balance: number;
  }>({
    queryKey: ["mobule", "check.session", session, currency],
    queryFn: async () => {
      if (!session) return { balance: 0 };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CENTRAL_API}/api/mobule/check.session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session,
            "game.provider": "tonza",
            currency: currency || "USD",
          }),
        }
      );

      const data = (await response.json())?.response;

      if (data.status === 200) {
        return data.response;
      } else {
        return { balance: 0 };
      }
    },
    enabled: !!session,
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  // Check balance
  const checkBalance = useQuery({
    queryKey: ["mobule", "check.balance", session, currency],
    queryFn: async () => {
      if (!session) return { balance: 0 };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CENTRAL_API}/api/mobule/check.balance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session,
            "game.provider": "tonza",
            currency: currency || "USD",
          }),
        }
      );

      const data = await response.json();

      if (data.status === 200) {
        return data.response;
      } else {
        return { balance: 0 };
      }
    },
    enabled: !!session,
    refetchInterval: 5000,
  });

  // Withdraw bet
  const withdrawBet = useMutation({
    mutationFn: async ({
      amount,
      round_id,
      trx_id,
    }: {
      amount: number;
      round_id: string;
      trx_id: string;
    }) => {
      if (!session) throw new Error("No session");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CENTRAL_API}/api/mobule/withdraw.bet`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session,
            "game.provider": "tonza",
            currency: currency || "USD",
            amount,
            round_id,
            trx_id,
          }),
        }
      );

      const data = await response.json();
      return data.response;
    },
  });

  // Deposit win
  const depositWin = useMutation({
    mutationFn: async ({
      amount,
      round_id,
      trx_id,
    }: {
      amount: number;
      round_id: string;
      trx_id: string;
    }) => {
      if (!session) throw new Error("No session");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CENTRAL_API}/api/mobule/deposit.win`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session,
            "game.provider": "tonza",
            currency: currency || "USD",
            amount,
            round_id,
            trx_id,
          }),
        }
      );

      const data = await response.json();
      return data.response;
    },
  });

  // Cancel transaction
  const cancelTransaction = useMutation({
    mutationFn: async ({ trx_id }: { trx_id: string }) => {
      if (!session) throw new Error("No session");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CENTRAL_API}/api/mobule/trx.cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session,
            "game.provider": "tonza",
            currency: currency || "USD",
            trx_id,
          }),
        }
      );

      const data = await response.json();
      return data.response;
    },
  });

  // Complete transaction
  const completeTransaction = useMutation({
    mutationFn: async ({ trx_id }: { trx_id: string }) => {
      if (!session) throw new Error("No session");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CENTRAL_API}/api/mobule/trx.complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session,
            "game.provider": "tonza",
            currency: currency || "USD",
            trx_id,
          }),
        }
      );

      const data = await response.json();
      return data.response;
    },
  });

  return {
    checkSession,
    checkBalance,
    withdrawBet,
    depositWin,
    cancelTransaction,
    completeTransaction,
  };
};
