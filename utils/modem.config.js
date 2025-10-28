import ModemPay from "modem-pay";

export const modemPay = new ModemPay(import.meta.env.VITE_MODEM_PAY_API_KEY);
