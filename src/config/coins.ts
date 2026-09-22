/**
 * Rosier Coins rules — change these numbers in one place and the whole app
 * (product cards, cart, coins page copy, checkout) follows.
 */
export const COINS = {
  /** Coins earned per ₹1 spent (0.05 = 5 coins for every ₹100). */
  earnPerRupee: 0.05,
  /** Coins for writing a review. */
  reviewBonus: 50,
  /** Coins for a successful referral. */
  referralBonus: 500,
  /** Welcome coins given on first launch. */
  welcomeBonus: 250,
  /** Days after an order when pending coins become usable. */
  pendingDays: 7,
  /** Minimum cart value to use a coin voucher. */
  minCartForVoucher: 499,
  /**
   * Vouchers people can unlock with coins. `code` must exist as a discount
   * code in Shopify admin (Discounts → Create discount code).
   */
  vouchers: [
    { id: 'v50', value: 50, cost: 250, code: 'ROSIERCOINS50', tint: 'copper' },
    { id: 'v100', value: 100, cost: 500, code: 'ROSIERCOINS100', tint: 'brown' },
    { id: 'v250', value: 250, cost: 1250, code: 'ROSIERCOINS250', tint: 'green' },
    { id: 'v500', value: 500, cost: 2500, code: 'ROSIERCOINS500', tint: 'deep' },
  ] as const,
};

export type Voucher = (typeof COINS.vouchers)[number];

export const coinsForAmount = (rupees: number) => Math.floor(rupees * COINS.earnPerRupee);
