import { OrderItem } from '@/entities/order'

function getPercentValue(value: number, percent: number) {
    return Math.floor((value / 100) * percent)
}

export function getItemsPriceAndComissions(
    items: OrderItem[],
    discount: number | null,
    comission: number
) {
    let total = 0
    let discountedTotal = undefined
    let storeComission = 0
    let employeeComission = 0
    let toComission = 0

    items.forEach(item => {
        total += item.unitPrice * item.quantity

        if (item.employeeComission) {
            const subtotal = item.unitPrice * item.quantity

            storeComission += getPercentValue(
                subtotal,
                100 - item.employeeComission
            )
            employeeComission += getPercentValue(
                subtotal,
                item.employeeComission
            )
        } else {
            toComission += item.unitPrice * item.quantity
        }
    })

    if (discount) {
        const discountValue = (total / 100) * discount
        discountedTotal = total - Math.round(discountValue)
    }

    storeComission += getPercentValue(toComission, 100 - comission)
    employeeComission += getPercentValue(toComission, comission)

    return { total, discountedTotal, storeComission, employeeComission }
}
