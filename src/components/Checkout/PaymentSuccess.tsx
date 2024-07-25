"use client";

import { getOrder, getPaymentIntent } from "@/actions/store-actions";
import { useCartStore } from "@/hooks/useCartStore";
import { IonIcon } from "@ionic/react";
import { refreshCircle, reload } from "ionicons/icons";
import { useEffect, useState } from "react";
import Stripe from "stripe";
import { Loader } from "../Loader";
import { useQuery } from "@tanstack/react-query";
import { convertToCurrency } from "@/utils/utils";
import { OrderData } from "@/types/store";
import { formatEventDate } from "@/utils/dateUtils";
import clsx from "clsx";
interface PaymentSuccessProps {
    payment_intent: string;
    order_id: number;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
    payment_intent,
    order_id,
}) => {
    const { clearCart } = useCartStore();

    const { data, isFetching, refetch, error } = useQuery<OrderData, Error>({
        queryKey: ["order", order_id],
        queryFn: () => getOrder(order_id),
        retry: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    useEffect(() => {
        if (!payment_intent) {
            return;
        }

        clearCart();
        // setLoading(true);
        // getPaymentIntent(payment_intent)
        //     .then((data) => {
        //         setStripeData(data);
        //         setLoading(false);
        //     })
        //     .catch((error) => {
        //         setError(error.message);
        //         setLoading(false);
        //     });
    }, [payment_intent]);

    return (
        <div className="flex flex-col p-1 space-y-4 h-screen">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline">{error.message}</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer">
                        <IonIcon icon={reload} onClick={() => refetch()} />
                    </span>
                </div>
            )}

            {isFetching && <Loader transulcent />}

            {((data && data.data) && data.success) && (
                <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="px-6 py-4">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Order Confirmation</h2>
                        <div className="text-gray-600 flex flex-col gap-y-2">
                            <div className="flex items-center justify-between">
                                <span>Order ID:</span> <span className="font-semibold">DL-{data.data.id}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Order Date:</span> <span className="font-semibold">{formatEventDate(data.data.order_date)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Order Status:</span> <span className="font-semibold">{data.data.status}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Order Total:</span> <span className="font-semibold">{data.data.order_meta.order_total}</span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 px-6 py-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Shipping Information</h3>
                        <div className="text-gray-600 flex flex-col">
                            <span>{data.data.billing.first_name} {data.data.billing.last_name}</span>
                            <span>{data.data.billing.address_1}, {data.data.billing.address_2}</span>
                            <span>{data.data.billing.city}, {data.data.billing.state} {data.data.billing.postcode}</span>
                            <span>{data.data.billing.country}</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 px-6 py-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Order Items</h3>
                        <div className="space-y-4">
                            {data.data.items.map((item, index) => (
                                <div key={index} className={clsx(
                                    "flex justify-between items-center py-2",
                                    index !== data.data!.items.length - 1 ? "border-b border-gray-200" : ""
                                )}>
                                    <div className="flex items-start">
                                        <img src={item.thumbnail} className="w-12 h-12 object-cover rounded-lg" alt={item.title} />
                                        <div className="ml-4">
                                            <h4 className="font-semibold text-gray-800" dangerouslySetInnerHTML={{ __html: item.title }} />
                                            <p className="text-gray-500">{item.qty} x {convertToCurrency(item.price)}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-800">{convertToCurrency(item.qty * item.price)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};