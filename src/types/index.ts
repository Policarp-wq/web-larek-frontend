type ProductItem = {
    id: string,
    description: string,
    image: string, 
    title: string,
    category: "string",
    price?: number
}

type Order = {
    payment: "online" | "offline",
    email: string,
    phone: string,
    address: string,
    total: number,
    items: string[]
}

type SuccessOrder = {
    id: string,
    total: number
}
