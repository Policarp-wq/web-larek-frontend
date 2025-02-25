export const сategoryType = {
    ['софт-скил']: 'soft',
    ['хард-скил']: 'hard',
    ['другое']: 'other',
    ['кнопка']: 'button',
    ['дополнительное']: 'additional',
}

export type ProductItem = {
    id: string,
    description: string,
    image: string, 
    title: string,
    category: "string",
    price?: number
}

export type OrderDeliveryInfo = {
    payment: "online" | "cash",
    address: string,
}

export type ContactInfo = {
    phone: string,
    email: string,
}

export type BasketInfo = {
    total: number,
    items: string[]
}

export type Order = {
    payment: "online" | "cash",
    email: string,
    phone: string,
    address: string,
    total: number,
    items: string[]
}

export type SuccessOrder = {
    id: string,
    total: number
}

