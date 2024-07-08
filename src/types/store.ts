export interface StoreProduct {
    id: number;
    title: string;
    images: string[];
    price: string;
    highlight: string;
    link: string;
    thumb: string;
    stock?: number;
    description?: string;
    category?: string;
    short_description?: string;
    variations?: ProductVariations;
}

export interface StoreProductCart {
    id: string;
    title: string;
    price: number;
    qty: number;
    variation?: ProductVariationTypes | null;
    variationId?: number | null;
    thumbnail: string;
    variationLabel?: string;
}

interface ProductVariations {
    attribute_price_combos: {
        id: number;
        price: number;
        attributes: {
            'pa_colour'?: string;
            'pa_item-size'?: string;
        };
        thumbnail: string;
    }[];
    attributes: {
        [key: string]: {
            label: string;
            values: {
                label: string;
                value: string;
                price: number;
            }[];
        };
    };
}

export type ProductVariationTypes = {
    pa_colour?: string;
    'pa_item-size'?: string;
};

export type BillingFieldType = {
    label: string;
    name: string;
    type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'country';
    required?: boolean;
    placeholder?: string;
    options?: {
        label: string;
        value: string;
    }[];
};