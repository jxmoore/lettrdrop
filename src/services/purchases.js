import { Capacitor } from '@capacitor/core';
import { updateProfile } from './auth';

// ---- RevenueCat setup ----
// The SDK is only usable on native (iOS/Android). In the browser we fall back
// to mock behaviour so `npm run dev` keeps working without a device.

let Purchases = null;
const isNative = Capacitor.isNativePlatform();

/**
 * Initialise RevenueCat. Call once at app start (main.jsx).
 *
 * Replace the placeholder key below with your real RevenueCat Public API Key.
 * You'll have two keys — one per platform — but RevenueCat's configure()
 * accepts a single key and selects the right store automatically.
 *
 * @see https://www.revenuecat.com/docs/getting-started/configuring-sdk
 */
const RC_API_KEY = '__YOUR_REVENUECAT_PUBLIC_API_KEY__';

export async function initPurchases() {
  if (!isNative) {
    console.log('[purchases] Running in browser — RevenueCat disabled.');
    return;
  }

  try {
    const mod = await import('@revenuecat/purchases-capacitor');
    Purchases = mod.Purchases;
    await Purchases.configure({ apiKey: RC_API_KEY });
    console.log('[purchases] RevenueCat configured.');
  } catch (err) {
    console.error('[purchases] Failed to initialise RevenueCat:', err.message);
  }
}

/**
 * Identify the current user so RevenueCat ties purchases to them.
 * Call after login / session restore when you have a userId.
 */
export async function identifyUser(userId) {
  if (!Purchases) return;
  try {
    await Purchases.logIn({ appUserID: userId });
  } catch (err) {
    console.error('[purchases] logIn failed:', err.message);
  }
}

/**
 * Log out the RevenueCat user (call on sign-out).
 */
export async function logOutPurchases() {
  if (!Purchases) return;
  try {
    await Purchases.logOut();
  } catch (err) {
    console.error('[purchases] logOut failed:', err.message);
  }
}

// ---- Entitlement helpers ----

const ENTITLEMENT_ID = 'premium'; // must match RevenueCat dashboard

/**
 * Check whether the current user has an active "premium" entitlement.
 * Returns true/false. Safe to call on web (always returns false).
 */
export async function checkPremiumEntitlement() {
  if (!Purchases) return false;
  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    return !!customerInfo.entitlements.active[ENTITLEMENT_ID];
  } catch (err) {
    console.error('[purchases] getCustomerInfo failed:', err.message);
    return false;
  }
}

// ---- Purchase flow ----

const PRODUCT_ID = 'lettrdrop_premium'; // must match App Store Connect / Play Console

/**
 * Fetch the available offerings from RevenueCat.
 * Returns the "current" offering's available packages, or [] on web / error.
 */
export async function getOfferings() {
  if (!Purchases) return [];
  try {
    const { offerings } = await Purchases.getOfferings();
    return offerings.current?.availablePackages ?? [];
  } catch (err) {
    console.error('[purchases] getOfferings failed:', err.message);
    return [];
  }
}

/**
 * Purchase the premium package.
 *
 * @param {string} userId - Supabase user id (for server-side flag).
 * @returns {{ success: boolean, error?: string }}
 */
export async function purchasePremium(userId) {
  if (!Purchases) {
    return { success: false, error: 'Purchases not available (running in browser?).' };
  }

  try {
    // Grab the first package from the current offering
    const packages = await getOfferings();
    const pkg = packages.find((p) => p.product.identifier === PRODUCT_ID) || packages[0];
    if (!pkg) return { success: false, error: 'No packages available.' };

    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });

    if (customerInfo.entitlements.active[ENTITLEMENT_ID]) {
      // Receipt is validated server-side by RevenueCat — safe to flip the flag.
      await updateProfile(userId, { is_premium: true }).catch((err) =>
        console.error('[purchases] Supabase profile update failed:', err.message),
      );
      return { success: true };
    }

    return { success: false, error: 'Purchase completed but entitlement not active.' };
  } catch (err) {
    // User cancelled = code 1, not a real error
    if (err.code === '1' || err.code === 1) {
      return { success: false, error: 'cancelled' };
    }
    console.error('[purchases] purchasePremium failed:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Restore previous purchases (e.g. reinstall / new device).
 *
 * @param {string} userId - Supabase user id (for server-side flag).
 * @returns {{ success: boolean, error?: string }}
 */
export async function restorePurchases(userId) {
  if (!Purchases) {
    return { success: false, error: 'Purchases not available (running in browser?).' };
  }

  try {
    const { customerInfo } = await Purchases.restorePurchases();

    if (customerInfo.entitlements.active[ENTITLEMENT_ID]) {
      await updateProfile(userId, { is_premium: true }).catch((err) =>
        console.error('[purchases] Supabase profile update failed:', err.message),
      );
      return { success: true };
    }

    return { success: false, error: 'No active premium entitlement found.' };
  } catch (err) {
    console.error('[purchases] restorePurchases failed:', err.message);
    return { success: false, error: err.message };
  }
}
