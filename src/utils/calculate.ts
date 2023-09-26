import { OrderItem } from '@/entities/order'

export function getItemsPriceAndComissions(
    items: OrderItem[],
    discount: number | null,
    comission: number
) {
    let total = 0
    let storeComission = 0
    let employeeComission = 0
    let discountedTotal = undefined

    items.forEach(item => {
        total += item.unitPrice * item.quantity
    })

    if (discount) {
        const discountValue = (total / 100) * discount
        discountedTotal = total - Math.round(discountValue)
    }

    if (discountedTotal) {
        storeComission = Math.floor((discountedTotal / 100) * (100 - comission))
        employeeComission = Math.floor((discountedTotal / 100) * comission)
    } else {
        storeComission = Math.floor((total / 100) * (100 - comission))
        employeeComission = Math.floor((total / 100) * comission)
    }

    return { total, discountedTotal, storeComission, employeeComission }
}
