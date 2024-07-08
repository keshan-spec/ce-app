//https://hackernoon.com/how-to-build-a-shopping-cart-with-nextjs-and-zustand-state-management-with-typescript
import { StoreProductCart } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
    cart: StoreProductCart[];
    totalItems: number;
    totalPrice: number;
    loading: boolean;
    stripeIntent: string;
    setStripeIntent: (intent: string) => void;
}

// Define the interface of the actions that can be performed in the Cart
interface Actions {
    addToCart: (Item: StoreProductCart) => Promise<boolean>;
    removeFromCart: (Id: string) => void;
    updateQty: (Id: string, qty: number) => void;
    clearCart: () => void;
    setStripeIntent: (intent: string) => void;
}

const INITIAL_STATE: State = {
    cart: [],
    totalItems: 0,
    totalPrice: 0,
    loading: false,
    stripeIntent: "",
    setStripeIntent: () => { },
};

export const useCartStore = create(persist<State & Actions>(
    (set, get) => ({
        ...INITIAL_STATE,
        addToCart: async (Item: StoreProductCart) => {
            set({ loading: true });

            const { cart } = get();
            const existingItem = cart.find((i) => i.id === Item.id && i.variationId === Item.variationId);

            if (existingItem) {
                existingItem.qty += Item.qty;
            } else {
                set((state) => ({
                    cart: [...state.cart, Item],
                    totalItems: state.totalItems + 1,
                    totalPrice: state.totalPrice + (Item.price * Item.qty),
                }));
            }

            // Wait for 1 second to simulate a network request
            await wait(1000);

            set({ loading: false });
            return true;
        },
        removeFromCart: (Id: string) => {
            const { cart } = get();

            const items = cart.filter((i) => i.id === Id);
            const itemCount = cart.filter((i) => i.id === Id).length;
            const totalPrice = items.reduce((acc, item) => {
                return acc + (item.price * item.qty);
            }, 0);

            console.log("item", items, "totalPrice", totalPrice);

            if (items.length > 0) {
                set((state) => ({
                    cart: state.cart.filter((i) => i.id !== Id),
                    totalItems: state.totalItems - itemCount,
                    totalPrice: state.totalPrice - totalPrice,
                }));
            }
        },
        updateQty: (Id: string, qty: number) => {
            set((state) => ({
                cart: state.cart.map((i) => {
                    if (i.id === Id) {
                        i.qty = qty;
                    }

                    return i;
                }),
                totalPrice: state.cart.reduce((acc, item) => {
                    return acc + (item.price * item.qty);
                }, 0),
            }));
        },
        clearCart: () => {
            set(INITIAL_STATE);
        },
        setStripeIntent: (intent: string) => {
            set({ stripeIntent: intent });
        },
    }),
    {
        name: "cart-storage",
    }
));

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
