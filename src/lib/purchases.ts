import Purchases, {
  PurchasesPackage,
  CustomerInfo,
  LOG_LEVEL,
} from 'react-native-purchases';
import { Platform } from 'react-native';

const REVENUECAT_IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || '';
const REVENUECAT_ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || '';

export const isPurchasesConfigured = Boolean(
  Platform.OS === 'ios' ? REVENUECAT_IOS_KEY : REVENUECAT_ANDROID_KEY
);

// Entitlement ID configured in RevenueCat dashboard
const PRO_ENTITLEMENT = 'pro';

export async function initPurchases(): Promise<void> {
  if (!isPurchasesConfigured) return;

  const apiKey = Platform.OS === 'ios' ? REVENUECAT_IOS_KEY : REVENUECAT_ANDROID_KEY;

  Purchases.configure({ apiKey });

  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }
}

export async function checkProStatus(): Promise<boolean> {
  if (!isPurchasesConfigured) return false;

  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[PRO_ENTITLEMENT] !== undefined;
  } catch {
    return false;
  }
}

export async function getOfferings(): Promise<PurchasesPackage[]> {
  if (!isPurchasesConfigured) return [];

  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current) {
      return offerings.current.availablePackages;
    }
    return [];
  } catch {
    return [];
  }
}

export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<{ success: boolean; error?: string }> {
  if (!isPurchasesConfigured) {
    return { success: false, error: 'Compras nao configuradas' };
  }

  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const isPro = customerInfo.entitlements.active[PRO_ENTITLEMENT] !== undefined;
    return { success: isPro };
  } catch (e: any) {
    if (e.userCancelled) {
      return { success: false, error: 'Compra cancelada' };
    }
    return { success: false, error: 'Erro ao processar compra. Tenta novamente.' };
  }
}

export async function restorePurchases(): Promise<boolean> {
  if (!isPurchasesConfigured) return false;

  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo.entitlements.active[PRO_ENTITLEMENT] !== undefined;
  } catch {
    return false;
  }
}

// Identify user for cross-device sync
export async function identifyUser(userId: string): Promise<void> {
  if (!isPurchasesConfigured) return;
  try {
    await Purchases.logIn(userId);
  } catch {
    // Silent fail - purchases still work anonymously
  }
}
