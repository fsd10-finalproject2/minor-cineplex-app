import { get } from '@/services/api/http'
import type { CouponCardItem } from '@/types/coupon'
import type { CouponPageResponse, CouponResponseItem } from '@/types/promotions'
import { computed, ref, watch, type Ref } from 'vue'

/** ขนาดหน้าเริ่มต้นสำหรับบล็อก Special Coupons บน landing */
export const SPECIAL_COUPONS_PAGE_SIZE = 4

export interface UseSpecialCouponsOptions {
  /** จำนวนรายการต่อหน้า (ส่งไปเป็น `limitItems`) — default เท่า `SPECIAL_COUPONS_PAGE_SIZE` */
  pageSize?: number
  /** เมื่อส่งมา จะดึงตามหน้านี้และอัปเดต `totalPages` จาก API เมื่อเปลี่ยนหน้า */
  currentPage?: Ref<number>
  /** ชื่อ partner สำหรับส่งเป็น query `partnerName` — ถ้าไม่ส่ง/ว่าง = ไม่กรอง */
  partnerName?: Ref<string | undefined>
}

function mapCouponResponseToCardItem(item: CouponResponseItem): CouponCardItem {
  const rawTerms = item.couponTermsConditions?.trim()
  const termsAndConditions = rawTerms
    ? rawTerms.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    : []
  const hasCoupon =
    typeof (item as { hasCoupon?: unknown }).hasCoupon === 'boolean'
      ? ((item as { hasCoupon?: boolean }).hasCoupon ?? false)
      : false

  return {
    id: item.id,
    title: item.couponName ?? '-',
    description: item.couponDescription ?? '-',
    startDate: item.startDate ?? '-',
    expiresAt: item.expiresAt ?? '-',
    redemptionStartAt: item.redemptionStartAt ?? '-',
    redemptionExpiresAt: item.redemptionExpiresAt ?? '-',
    termsAndConditions,
    image: item.couponsImgUrl ?? '',
    hasCoupon,
  }
}

export function useSpecialCoupons(options?: UseSpecialCouponsOptions) {
  const pageSize = options?.pageSize ?? SPECIAL_COUPONS_PAGE_SIZE
  const currentPageRef = options?.currentPage
  const partnerNameRef = options?.partnerName

  const isLoading = ref(true)
  const specialCoupons = ref<CouponCardItem[]>([])
  const totalPages = ref(1)

  const displayedCoupons = computed(() => {
    if (currentPageRef) {
      return specialCoupons.value
    }
    return specialCoupons.value.slice(0, pageSize)
  })

  async function load() {
    const pageNum = currentPageRef?.value ?? 1
    const partnerName = partnerNameRef?.value?.trim()
    isLoading.value = true
    try {
      const params = new URLSearchParams({
        page: String(pageNum),
        limitItems: String(pageSize),
      })
      if (partnerName) {
        params.append('partnerName', partnerName)
      }
      const response = await get<CouponPageResponse>(`/promotions?${params.toString()}`)
      specialCoupons.value = (response.data ?? []).map(mapCouponResponseToCardItem)

      if (currentPageRef) {
        const tp = response.totalPage ?? 0
        totalPages.value = tp > 0 ? tp : 1
        if (response.currentPage != null && response.currentPage !== pageNum) {
          currentPageRef.value = response.currentPage
        }
      }
    } catch (err) {
      console.error('Failed to fetch GET /promotions', err)
      specialCoupons.value = []
      if (currentPageRef) {
        totalPages.value = 1
      }
    } finally {
      isLoading.value = false
    }
  }

  if (currentPageRef && partnerNameRef) {
    watch([currentPageRef, partnerNameRef], () => {
      void load()
    }, { immediate: true })
  } else if (currentPageRef) {
    watch(
      currentPageRef,
      () => {
        void load()
      },
      { immediate: true },
    )
  } else if (partnerNameRef) {
    watch(partnerNameRef, () => {
      void load()
    }, { immediate: true })
  } else {
    void load()
  }

  return {
    isLoading,
    displayedCoupons,
    totalPages,
    load,
  }
}
