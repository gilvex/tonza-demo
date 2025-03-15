import React from "react";
import Image from "next/image";
import { Button } from "@web/components/ui/button";
import { ArrowLeft, ChevronDown, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface NavigationBarProps {
  balance: number; // e.g. 1293.02
  onBack?: (router: AppRouterInstance) => void;
  onAddFunds: () => void;
}

export function NavigationBar({
  balance,
  onBack,
  onAddFunds,
}: NavigationBarProps) {
  const router = useRouter();
  // Split integer and fractional parts for styling (adjust as needed)
  const integerPart = Math.floor(balance);
  const fractionalPart = (balance % 1).toFixed(2).substring(2);

  return (
    <div id="nav" className="flex items-center justify-between w-full">
      <Button
        className="rounded-full size-10 max-w-36 max-h-36"
        size="icon"
        variant="secondary"
        onClick={() => onBack ? onBack(router) : router.back}
      >
        <ArrowLeft />
      </Button>

      <div className="border-[#1B265C] border rounded-full p-2 flex justify-start items-center gap-2 w-fit text-[3vw] sm:text-lg lg:w-60 max-w-[300px]">
        <Image
          src="/ton.svg"
          alt="ton"
          width={128}
          height={128}
          className="size-8 max-w-32 max-h-32"
        />
        <div className="flex justify-center items-center">
          <p className="font-bold">{integerPart}</p>
          <p className="font-bold text-[#858CAB]">.{fractionalPart}</p>
          <ChevronDown className="text-[#858CAB]" />
        </div>
        <div className="grow flex justify-end">
          <Button
            size="icon"
            className="rounded-full from-[#24ACFB] to-[#078CEA] bg-gradient-to-b max-w-8 max-h-8"
            onClick={onAddFunds}
          >
            <Plus className="text-white min-w-6 min-h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
