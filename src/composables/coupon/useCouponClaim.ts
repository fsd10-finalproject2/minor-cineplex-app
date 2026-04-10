import { computed, ref, watch, type ComputedRef } from 'vue'
import { post } from '@/services/api/http'

interface UseCouponClaimOptions {
  couponId: ComputedRef<number>
  initialHasCoupon: ComputedRef<boolean>
  isLoggedIn: ComputedRef<boolean>
  onRequireLogin: () => void
  onLoginHandled: () => void
  onClaimSuccess?: () => void
}

export function useCouponClaim(options: UseCouponClaimOptions) {
  const isSavingCoupon = ref(false)
  const hasCoupon = ref(options.initialHasCoupon.value)
  const pendingSaveAfterLogin = ref(false)

  const isGetCoupon = computed(() => hasCoupon.value)

  function markCouponAsClaimed() {
    hasCoupon.value = true
  }

  async function claimCoupon() {
    if (isSavingCoupon.value || hasCoupon.value) {
      return
    }

    try {
      isSavingCoupon.value = true
      await post(`/user/me/coupons/${options.couponId.value}`, {})
      hasCoupon.value = true
      options.onClaimSuccess?.()
    } catch (error) {
      console.error(`Failed to save coupon id=${options.couponId.value}`, error)
    } finally {
      isSavingCoupon.value = false
    }
  }

  async function onGetCouponClick(e?: MouseEvent) {
    e?.stopPropagation()

    if (isSavingCoupon.value) {
      return
    }

    if (!options.isLoggedIn.value) {
      pendingSaveAfterLogin.value = true
      options.onRequireLogin()
      return
    }

    pendingSaveAfterLogin.value = false
    await claimCoupon()
  }

  watch(options.initialHasCoupon, (nextHasCoupon) => {
    hasCoupon.value = nextHasCoupon
  })

  watch(options.isLoggedIn, (loggedIn) => {
    if (!loggedIn) {
      return
    }

    options.onLoginHandled()

    if (pendingSaveAfterLogin.value && !hasCoupon.value && !isSavingCoupon.value) {
      void onGetCouponClick()
    }
  })

  return {
    isSavingCoupon,
    hasCoupon,
    isGetCoupon,
    markCouponAsClaimed,
    onGetCouponClick,
  }
}
