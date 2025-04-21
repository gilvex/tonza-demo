export function formatCurrency(value: number, currencyCode: string, locale: string) {
  const options = {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  } as const;

  // Форматируем числовое значение в соответствии с заданной локалью и валютой
  return new Intl.NumberFormat(locale, options).format(value);

  // Пример
  // new Intl.NumberFormat("de-DE", {style:"currency", currency:"EUR"}).format(324429.435)
}

