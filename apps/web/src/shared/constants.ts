import TonSvgIcon from "@web/assets/crypto/TonSvgIcon";
import TetherSvgIcon from "@web/assets/crypto/TetherSvgIcon";
import TronSvgIcon from "@web/assets/crypto/TronSvgIcon";
import EthereumSvgIcon from "@web/assets/crypto/EthereumSvgIcon";
import BnbSvgIcon from "@web/assets/crypto/BnbSvgIcon";
import BtcSvgIcon from "@web/assets/crypto/BtcSvgIcon";
import SolSvgIcon from "@web/assets/crypto/SolSvgIcon";

export const LANGUAGES = {
  en: { name: "🇺🇸 English", locale: "en-US", code: "en" },
  ru: { name: "🇷🇺 Русский", locale: "ru-RU", code: "ru" },
  // uk: { name: "🇺🇦 Українська", locale: "uk", code: "uk" },
  // uz: { name: "🇺🇿 Ўзбек", locale: "uz", code: "uz" },
  // fa: { name: "🇮🇷 فارسی", locale: "fa", code: "fa" },
  // tr: { name: "🇹🇷 Türkçe", locale: "tr", code: "tr" },
  // es: { name: "🇪🇸 Español", locale: "es-ES", code: "es" },
  // de: { name: "🇩🇪 Deutsch", locale: "de-DE", code: "de" },
  // hi: { name: "🇮🇳 हिंदी", locale: "hi-IN", code: "hi" },
  // fr: { name: "🇫🇷 Français", locale: "fr-FR", code: "fr" },
  // kr: { name: "🇰🇷 한국어", locale: "ko-KR", code: "kr" },
};

export const CURRENCIES = {
  TON: {
    name: "TON",
    symbol: "TON",
    icon: "https://ton.org/download/ton_symbol.svg",
  },
  USD: {
    name: "USD",
    symbol: "$",
    icon: "https://raw.githubusercontent.com/HatScripts/circle-flags/6452fa836a38e8e46b0d1833d3e83dbcef194d6b/flags/us.svg",
  },
  EUR: {
    name: "EUR",
    symbol: "€",
    icon: "https://raw.githubusercontent.com/HatScripts/circle-flags/6452fa836a38e8e46b0d1833d3e83dbcef194d6b/flags/european_union.svg",
  },
  RUB: {
    name: "RUB",
    symbol: "₽",
    icon: "https://raw.githubusercontent.com/HatScripts/circle-flags/6452fa836a38e8e46b0d1833d3e83dbcef194d6b/flags/ru.svg",
  },
  UAH: {
    name: "UAH",
    symbol: "₴",
    icon: "https://raw.githubusercontent.com/HatScripts/circle-flags/6452fa836a38e8e46b0d1833d3e83dbcef194d6b/flags/ua.svg",
  },
  AZN: {
    name: "AZN",
    symbol: "₼",
    icon: "https://raw.githubusercontent.com/HatScripts/circle-flags/6452fa836a38e8e46b0d1833d3e83dbcef194d6b/flags/az.svg",
  },
  UZS: {
    name: "UZS",
    symbol: "soʻm",
    icon: "https://raw.githubusercontent.com/HatScripts/circle-flags/6452fa836a38e8e46b0d1833d3e83dbcef194d6b/flags/uz.svg",
  },
  KZT: {
    name: "KZT",
    symbol: "₸",
    icon: "https://raw.githubusercontent.com/HatScripts/circle-flags/6452fa836a38e8e46b0d1833d3e83dbcef194d6b/flags/kz.svg",
  },
};

export type CryptoNetwork = {
  name: string;
  code: string;
  gatewayCode: string;
  addressFormat: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>> | null;
  withMemo: boolean;
  minDepositAmount: number;
  minWithdrawAmount: number;
  withdrawFee: number;
};

export type CryptoCurrency = {
  name: string;
  ticker: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  networks: Record<string, CryptoNetwork>;
};

type CryptoCurrencies = Record<string, CryptoCurrency>;

export const CRYPTO_CURRENCIES: CryptoCurrencies = {
  TON: {
    name: "Toncoin",
    ticker: "TON",
    icon: TonSvgIcon,
    networks: {
      TON: {
        name: "Toncoin",
        code: "TON",
        gatewayCode: "TON",
        addressFormat: "^(UQ|EF|UF|EQ)[A-Za-z0-9-_]{46}$",
        icon: TonSvgIcon,
        withMemo: false,
        minDepositAmount: 1,
        minWithdrawAmount: 1,
        withdrawFee: 0.3,
      },
    },
  },
  BTC: {
    name: "Bitcoin",
    ticker: "BTC",
    icon: BtcSvgIcon,
    networks: {
      BTC: {
        name: "Bitcoin",
        code: "BTC",
        gatewayCode: "BTC",
        addressFormat:
          "^([13][a-km-zA-HJ-NP-Z1-9]{25,34})|^(bc1([qpzry9x8gf2tvdw0s3jn54khce6mua7l]{39}|[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{59}))$",
        icon: null,
        withMemo: false,
        minDepositAmount: 0.0005,
        minWithdrawAmount: 0.0005,
        withdrawFee: 0.0001,
      },
    },
  },
  ETH: {
    name: "Ethereum",
    ticker: "ETH",
    icon: EthereumSvgIcon,
    networks: {
      ERC20: {
        name: "Ethereum (ERC20)",
        code: "ERC20",
        gatewayCode: "ETH",
        addressFormat: "^(?:0x)?[0-9a-fA-F]{40}$",
        icon: null,
        withMemo: false,
        minDepositAmount: 0.01,
        minWithdrawAmount: 0.01,
        withdrawFee: 0.001,
      },
    },
  },
  USDT: {
    name: "Tether",
    ticker: "USDT",
    icon: TetherSvgIcon,
    networks: {
      TRC20: {
        name: "Tron (TRC20)",
        code: "TRC20",
        gatewayCode: "USDTTRC",
        addressFormat: "^T[A-Za-z1-9]{33}$",
        icon: TronSvgIcon,
        withMemo: false,
        minDepositAmount: 10,
        minWithdrawAmount: 3.5,
        withdrawFee: 3,
      },
      // TON: {
      //   name: "TON",
      //   code: "TON",
      //   gatewayCode: "USDTTON",
      //   addressFormat: "^(UQ|EF|UF|EQ)[A-Za-z0-9-_]{46}$",
      //   icon: TonSvgIcon,
      //   withMemo: true,
      //   minDepositAmount: 10,
      //   minWithdrawAmount: 3.5,
      //   withdrawFee: 1,
      // },
      ERC20: {
        name: "Ethereum (ERC20)",
        code: "ERC20",
        gatewayCode: "USDT",
        addressFormat: "^0x[a-fA-F0-9]{40}$",
        icon: EthereumSvgIcon,
        withMemo: false,
        minDepositAmount: 50,
        minWithdrawAmount: 10,
        withdrawFee: 3,
      },
      BEP20: {
        name: "Binance Chain (BEP20)",
        code: "BEP20",
        gatewayCode: "USDTBEP",
        addressFormat: "^0x[a-fA-F0-9]{40}$",
        icon: BnbSvgIcon,
        withMemo: false,
        minDepositAmount: 10,
        minWithdrawAmount: 3.5,
        withdrawFee: 3,
      },
    },
  },
  TRON: {
    name: "Tron",
    ticker: "TRX",
    icon: TronSvgIcon,
    networks: {
      TRC20: {
        name: "Tron (TRC20)",
        code: "TRC20",
        gatewayCode: "TRX",
        addressFormat: "^[T][a-km-zA-HJ-NP-Z1-9]{25,34}$",
        icon: null,
        withMemo: false,
        minDepositAmount: 20,
        minWithdrawAmount: 20,
        withdrawFee: 2,
      },
    },
  },
  BNB: {
    name: "Binance Coin",
    ticker: "BNB",
    icon: BnbSvgIcon,
    networks: {
      BEP20: {
        name: "Binance Chain (BEP20)",
        code: "BEP20",
        gatewayCode: "BNB20",
        addressFormat: "^(?:0x)?[0-9a-fA-F]{40}$",
        icon: null,
        withMemo: false,
        minDepositAmount: 0.01,
        minWithdrawAmount: 0.1,
        withdrawFee: 0.01,
      },
    },
  },
  SOL: {
    name: "Solana",
    ticker: "SOL",
    icon: SolSvgIcon,
    networks: {
      SOL: {
        name: "Solana",
        code: "SOL",
        gatewayCode: "SOL",
        addressFormat: "^([1-9A-HJ-NP-Za-km-z]{44})$",
        icon: null,
        withMemo: false,
        minDepositAmount: 0.1,
        minWithdrawAmount: 0.1,
        withdrawFee: 0.01,
      },
    },
  },
};
