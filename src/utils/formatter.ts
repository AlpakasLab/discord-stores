export function numberToMoney(value: number): string {
    return (
        value?.toLocaleString('pt-br', {
            style: 'currency',
            currency: 'USD',
            currencyDisplay: 'symbol'
        }) || ''
    )
}
