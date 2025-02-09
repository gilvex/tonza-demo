import { initData } from "@telegram-apps/sdk-react";

export function useTelegramUser() {
    return initData.user();
}