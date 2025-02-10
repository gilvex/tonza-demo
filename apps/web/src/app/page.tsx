import { Button } from "@web/components/ui/button";
import { MineButton } from "@web/features/games/mines";
import { cn } from "@web/lib/utils";
import { ArrowLeft, ChevronDown, Plus } from "lucide-react";
import Image from "next/image";

export default async function Page() {
  return (
    <div className="p-4 flex flex-col gap-4 items-center">
      <div id="nav" className="flex items-center justify-between w-full">
        <Button className="rounded-full" size="icon" variant="secondary">
          <ArrowLeft />
        </Button>

        <div className="border-[#1B265C] border rounded-full p-2 flex justify-start gap-2 w-48 lg:w-60">
          <Image
            src="/ton.png"
            alt="ton"
            width={128}
            height={128}
            className="size-8"
          />
          <div className="flex justify-center items-center">
            <p className="font-bold">1 293</p>
            <p className="font-bold text-[#858CAB]">.02</p>
            <ChevronDown className="text-[#858CAB]" />
          </div>
          <div className="grow flex justify-end">
            <Button
              size="icon"
              className="rounded-full from-[#24ACFB] to-[#078CEA] bg-gradient-to-b max-w-8 max-h-8"
            >
              <Plus className="text-white min-w-6 min-h-6" />
            </Button>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "from-[#09122F] from-70% to-[#1b60eba2] bg-gradient-to-b w-full rounded-2xl p-5 flex flex-col gap-4 max-w-[500px]",
          "transition-all text-base md:text-lg lg:text-xl xl:text-2xl"
        )}
      >
        <div className="flex justify-center items-center">
          <div className="font-bold border border-[#1B265C] rounded-lg py-1.5 px-2 w-fit ">
            1.13x
          </div>
          <div className="bg-[#1B265C] h-0.5 w-full" />
          <div className="font-bold border border-[#1B265C] rounded-lg py-1.5 px-2 w-fit ">
            1.60x
          </div>
          <div className="bg-[#1B265C] h-0.5 w-full" />
          <div className="font-bold border border-[#1B265C] rounded-lg py-1.5 px-2 w-fit ">
            2.0x
          </div>
          <div className="bg-[#1B265C] h-0.5 w-full" />
          <div className="font-bold border border-[#1B265C] rounded-lg py-1.5 px-2 w-fit ">
            3.0x
          </div>
          <div className="bg-[#1B265C] h-0.5 w-full" />
          <div className="font-bold border border-[#1B265C] rounded-lg py-1.5 px-2 w-fit ">
            4.0x
          </div>
          <div className="bg-[#1B265C] h-0.5 w-full" />
          <div className="font-bold border border-[#1B265C] rounded-lg py-1.5 px-2 w-fit ">
            5.0x
          </div>
        </div>
        <div className="bg-[#01021E] size-full aspect-square rounded-2xl max-h-[500px] p-4 grid grid-cols-5 gap-2">
          {Array.from({ length: 25 }).map((_, i) => (
            <MineButton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// // import { trpc } from "@web/app/trpc";
// import { Button } from "@web/components/ui/button";
// import { ModeToggle } from "@web/features/core/root/component/ThemeModeToggle";
// import ClientSide from "@web/features/test/ClientSide";
// import Link from "next/link";

// // export default async function Home() {
// //   // const user = await trpc.users.getUserById.query({ userId: "Tom" });
// //   return (
// //     <div className="p-4 flex flex-col gap-4">
// //       {/* {user.email} */}
// //       <ModeToggle />
// //       <ClientSide />
// //       <Button>Test</Button>
// //       <Link href="/games/mines" className="w-full">
// //         <Button className="w-full">To Mines</Button>
// //       </Link>
// //     </div>
// //   );
// // }
