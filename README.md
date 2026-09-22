# Rosier — mobile app

React Native (Expo SDK 57 + Expo Router) shopping app for rosierfoods.com, with Rosier Coins.

## Run it on your phone

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** (Android) or the Camera app (iPhone). Your phone and laptop need to be on the same Wi-Fi.

## What's inside

| Screen | File |
| --- | --- |
| 3 intro slides (Rosier, Bilona, Coins) | `src/app/onboarding.tsx` |
| Home | `src/app/(tabs)/home.tsx` |
| Shop / categories | `src/app/(tabs)/shop.tsx`, `src/app/collection/[id].tsx` |
| Product page | `src/app/product/[handle].tsx` |
| Cart + checkout | `src/app/(tabs)/cart.tsx` |
| Rosier Coins | `src/app/(tabs)/coins.tsx`, `src/app/coin-history.tsx` |
| Profile, side menu | `src/app/(tabs)/profile.tsx`, `src/components/SideMenu.tsx` |
| Benefits Club, Our Story, Help, Blog, Gifting, Orders, Wishlist, Search, Notifications, Account | `src/app/*.tsx` |

Light and dark mode are both built in (Profile → Appearance).

## Products and prices

- Products are loaded live from `https://www.rosierfoods.com/products.json` every time the app opens. New launches appear automatically.
- `src/data/catalog.json` is a snapshot of 50 products (taken 23 Sept 2026). The app falls back to it when offline.
- Offer prices come from each product's `badge_✨ Flat X% OFF` tag. This assumes the same % is applied automatically at checkout. If it isn't, the app will show a lower price than checkout.

## Checkout

"Checkout" opens Shopify checkout in an in-app browser, with the selected items already in the cart (`/cart/{variant}:{qty}`). Payment, addresses and shipping are all handled by Shopify.

## Rosier Coins — setup needed

All coin rules live in **`src/config/coins.ts`**. Change the numbers there and the whole app updates.

Current defaults:

- Earn 5 coins per ₹100 spent
- 250 welcome coins
- Coins unlock 7 days after an order
- Vouchers: ₹50 / ₹100 / ₹250 / ₹500 for 250 / 500 / 1,250 / 2,500 coins

**Before launch:**

1. In Shopify admin, create the discount codes `ROSIERCOINS50`, `ROSIERCOINS100`, `ROSIERCOINS250` and `ROSIERCOINS500`, with a minimum order of ₹499. The app passes the code to checkout automatically.
2. Right now, coin balances and orders are stored on the phone only (AsyncStorage). For production, move them to a backend:
   - A Shopify `orders/paid` webhook credits coins.
   - Each redemption creates a one-time code.
   - Customer login uses Shopify Customer Accounts.

   Screens don't need to change for this. Only `src/store/shop.ts` needs updating.

## Build for the stores

```bash
npx eas-cli@latest build --platform android   # or ios
```

App IDs are `com.rosierfoods.app` (see `app.json`).
