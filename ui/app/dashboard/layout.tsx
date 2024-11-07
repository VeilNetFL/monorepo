"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Inbox, Sparkles, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Client",
    url: "/dashboard/client",
    icon: Home,
  },
  {
    title: "Worker",
    url: "/dashboard/worker",
    icon: Inbox,
  },
];


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  // TODO: Remove this mock wallet and use the actual wallet from the store
  const wallet = "0x1234567890";
  const connectWallet = () => {
    console.log("Connect Wallet");
  };

  const truncatedWallet = wallet?.slice(0, 6) + "..." + wallet?.slice(-6);
  const [balance, setBalance] = useState(0.001);

  return (
    <>
      <div className="mx-auto h-screen pt-4 md:w-[72vw] xl:w-[60vw]">
        <header className="flex items-center justify-between bg-background py-1 shadow-sm">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-display text-lg">VeilNet</span>
            </Link>
            <nav className="hidden items-center gap-2 md:flex">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  className={cn(
                    "flex items-center text-sm rounded-full gap-2 px-4 py-2",
                    activeIndex === index
                      ? "bg-accent text-accent-foreground border-b-2 border-r"
                      : "text-muted-foreground",
                  )}
                  onClick={() => {
                    setActiveIndex(index);
                    router.push(item.url);
                  }}
                >
                  {item.title}
                </button>
              ))}
            </nav>
          </div>

          {wallet ? (
            <div className="flex flex-row gap-1">
              <span className="text-sm ">Balance : {balance} NEAR</span>
              <Separator className="w-[2px]" orientation="vertical" />
              <span className="text-sm text-muted-foreground">
                {truncatedWallet}
              </span>
            </div>
          ) : (
            <Button onClick={connectWallet}>Connect Wallet</Button>
          )}
        </header>
        <div className="mt-8 flex w-full flex-col gap-8">{children}</div>
      </div>
    </>
  );
};

export default DashboardLayout;
