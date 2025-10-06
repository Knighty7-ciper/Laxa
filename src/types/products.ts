export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    category: string;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface Order {
    id: string;
    clientId: string;
    items: CartItem[];
    total: number;
    status: 'pending' | 'shipped' | 'delivered';
    createdAt: Date;
}
