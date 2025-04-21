import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { IoCopy } from "react-icons/io5";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@web/components/ui/select";
import {
  CRYPTO_CURRENCIES,
  CryptoCurrency,
  CryptoNetwork,
} from "@web/shared/constants";
import QRCode from "react-qr-code";
import { cn } from "@web/lib/utils";

const TopUpTab: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = React.useState<{
    key: string;
    data: CryptoCurrency;
  }>({
    key: "TON",
    data: CRYPTO_CURRENCIES.TON,
  });
  const [selectedNetwork, setSelectedNetwork] = React.useState<{
    key: string;
    data: CryptoNetwork;
  }>({
    key: Object.entries(selectedCurrency.data.networks)[0][0],
    data: Object.entries(selectedCurrency.data.networks)[0][1],
  });

  return (
    <motion.div className="overflow-clip">
      <div className="px-1 sm:px-4 flex flex-col gap-3 mt-2 max-h-[65vh] overflow-auto">
        <p className="text-sm font-bold">Выберите валюту</p>
        <Select
          onValueChange={(value) => {
            setSelectedCurrency({
              key: value,
              data: CRYPTO_CURRENCIES[value],
            });
            // Select the first network by default
            setSelectedNetwork({
              key: Object.entries(CRYPTO_CURRENCIES[value].networks)[0][0],
              data: Object.entries(CRYPTO_CURRENCIES[value].networks)[0][1],
            });
          }}
          value={selectedCurrency.key}
        >
          <SelectTrigger className="bg-tg-section border-none py-5">
            <SelectValue placeholder="Выбери валюту" />
          </SelectTrigger>
          <SelectContent className="bg-tg-section border-none">
            {Object.entries(CRYPTO_CURRENCIES).map(([key, currency]) => (
              <SelectItem key={currency.name} value={key}>
                <div className="flex items-center gap-2">
                  <currency.icon className="size-5" />{" "}
                  <div className="text-sm/6 text-white">
                    {currency.name} - {currency.ticker}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <AnimatePresence mode="wait">
          {Object.keys(selectedCurrency.data.networks).length > 1 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-col gap-3"
            >
              <p className="text-sm font-bold">Выберите сеть</p>
              <Select
                key={selectedNetwork.key}
                onValueChange={(value) =>
                  setSelectedNetwork({
                    key: value,
                    data: selectedCurrency.data.networks[value],
                  })
                }
                value={selectedNetwork.key}
              >
                <SelectTrigger className="bg-tg-section border-none py-5">
                  <SelectValue placeholder="Выбери валюту" />
                </SelectTrigger>
                <SelectContent className="bg-tg-section border-none">
                  {Object.entries(selectedCurrency.data.networks).map(
                    ([key, network]) => (
                      <SelectItem key={network.name} value={key}>
                        <div className="flex items-center gap-2">
                          {selectedCurrency.data.icon && (
                            <selectedCurrency.data.icon
                              className={"w-5 h-5 min-w-5 min-h-5"}
                            />
                          )}
                          {network.icon && (
                            <network.icon
                              className={"-ml-4 mt-2.5 w-3 h-3 min-w-3 min-h-3"}
                            />
                          )}
                          <div className="text-sm/6 text-white">
                            {network.name}
                          </div>
                        </div>
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </motion.div>
          )}
        </AnimatePresence>
        <p className="text-sm font-bold">Ваш адресс для депозита</p>
        <button className="bg-tg-section px-3 py-3 text-xs flex items-center justify-between rounded-md text-white font-bold">
          <p className="truncate">UQBwk95lChj5mgevHIm84DsTJKOD3CKyL0QxbaqS2PA26_6C</p>
          <IoCopy
            className={"w-5 h-5 opacity-80 active:opacity-50 cursor-pointer"}
          />
        </button>
        <div
          className={cn(
            false ? "filter blur" : "",
            "relative bg-white p-2 rounded-lg w-fit self-center mt-4"
          )}
        >
          <QRCode
            value={"UQBwk95lChj5mgevHIm84DsTJKOD3CKyL0QxbaqS2PA26_6C"}
            size={150}
            onClick={() => {}}
          />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold">Минимальная сумма для депозита</p>
          <p className="truncate text-xl font-bold text-white mt-2">
            {(1).toLocaleString([], {
              minimumFractionDigits: 0,
              maximumFractionDigits: 4,
            })}{" "}
            {selectedCurrency.data.ticker}
          </p>
          <p className="opacity-50 text-sm/6">
            Отправляйте только {selectedCurrency.data.name} (
            {selectedCurrency.data.ticker}) на этот адрес
          </p>
          <p className="opacity-50 text-sm/6">
            Суммы ниже минимальной <b>НЕ</b> будут зачислены и <b>НЕ</b>{" "}
            возвращаются
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TopUpTab;
