export function formatPrice(price: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
    .format(price / 100)
    .replace('R$', '')
}

export function formatPriceToRegister(price: string) {
  const priceNumbers = price.replace(/[^0-9]/g, '')
  const match = price.match(/(\d+,\d+)/)

  return match
    ? Number(match[0].replace(',', '.')) * 100
    : Number(priceNumbers) * 100
}
