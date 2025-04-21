"use client";

import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@web/components/ui/drawer";
import { motion } from "motion/react";
import Tabs, { Tab } from "@web/components/ui/tabs";
import TopUpTab from "./tabs/TopUpTab";
import WithdrawTab from "./tabs/WithdrawTab";
import { formatCurrency } from "@web/shared/currency";
import { ToncoinOutline } from "@web/assets/crypto/ToncoinIcon";
import { Spinner } from "@telegram-apps/telegram-ui";

type WalletModalProps = {
  isOpen?: boolean;
  onClose?: (open: boolean) => void;
  children?: React.ReactNode;
};

const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerTrigger asChild>
        {children ?? (
          <button className="text-white" onClick={() => onClose?.(false)}>
            Open Wallet
          </button>
        )}
      </DrawerTrigger>
      <DrawerContent className="p-4 bg-tg-secondary text-white transition-all">
        <DrawerHeader className="flex justify-between items-center">
          <DrawerTitle>Ваш кошелёк</DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ paddingTop: 16, paddingBottom: 16 }}
            animate={{ paddingTop: 32, paddingBottom: 32 }}
            transition={{ delay: 0.1 }}
            className="px-3 bg-tg-section rounded-lg flex justify-center items-center relative overflow-clip"
          >
            <span className="text-xl font-bold flex items-center">
              {formatCurrency(0.0, "TON", "ru")}
            </span>
            <span
              className={
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 text-[154px] font-bold"
              }
            >
              <ToncoinOutline width={154} height={154} />
            </span>
          </motion.div>

          <Tabs>
            <Tab label="Top-up">
              <TopUpTab />
            </Tab>
            <Tab label="Withdraw">
              <WithdrawTab />
            </Tab>
            <Tab label="History">
              <div className="w-full flex justify-center py-[20vh]">
                <Spinner size="l" />
              </div>
            </Tab>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default WalletModal;
