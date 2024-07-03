import { StoreProductCart } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
    cart: StoreProductCart[];
    totalItems: number;
    totalPrice: number;
}

// Define the interface of the actions that can be performed in the Cart
interface Actions {
    addToCart: (Item: StoreProductCart) => void;
    removeFromCart: (Id: number) => void;
}

const INITIAL_STATE: State = {
    cart: [],
    totalItems: 0,
    totalPrice: 0,
};

export const useCartStore = create(persist<State & Actions>(
    (set, get) => ({
        ...INITIAL_STATE,
        addToCart: (Item: StoreProductCart) => {
            const { cart } = get();
            const existingItem = cart.find((i) => i.id === Item.id && i.variationId === Item.variationId);

            console.log("existingItem", Item);

            if (existingItem) {
                existingItem.qty += Item.qty;
            } else {
                set((state) => ({
                    cart: [...state.cart, Item],
                    totalItems: state.totalItems + 1,
                    totalPrice: state.totalPrice + (Item.price * Item.qty),
                }));
            }
        },
        removeFromCart: (Id: number) => {
            const { cart } = get();

            const item = cart.find((i) => i.id === Id);
            if (item) {
                set((state) => ({
                    cart: state.cart.filter((i) => i.id !== Id),
                    totalItems: state.totalItems - item.qty,
                    totalPrice: state.totalPrice - (item.price * item.qty),
                }));
            }
        },
    }),
    {
        name: "cart-storage",
    }
));