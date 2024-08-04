'use client';
import { useQuery } from '@tanstack/react-query';

import { UserOrderData } from '@/types/store';
import { formatPostDate } from '@/utils/dateUtils';
import clsx from 'clsx';
import { FIXED_SHIPPING_COST } from '@/actions/api';
import { memo } from 'react';
import { getUserOrders } from '@/api-functions/store';

const UserOrders = () => {
    const { data, isFetching } = useQuery({
        queryKey: ['user-orders'],
        queryFn: () => getUserOrders(),
        retry: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retryOnMount: false,
    });

    if (isFetching) return <div>Loading...</div>;

    return (
        <div className="tab-pane fade" id="panels-tab2" role="tabpanel">
            <div className="section mt-2">
                <div className="row">
                    <div className="wide-block p-0">
                        {data && data.data?.map((order, i: number) => (
                            <OrderCard key={i} {...order} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ORDER_STATUS_COLORS = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    refunded: "bg-red-100 text-red-800",
    processed: "bg-green-100 text-green-800",
};

const OrderCard: React.FC<UserOrderData> = ({ ...order }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-3 mb-2">
            <div className="flex justify-between items-center mb-2">
                <div className="text-lg font-bold">Order #DL-{order.id}</div>
                <div className="text-sm text-gray-500">{formatPostDate(order.order_date)}</div>
            </div>
            <div className="mb-2">
                {order.items.map((item, i) => (
                    <div key={i} className="flex items-center space-x-4 mb-2">
                        <img src={item.thumbnail} alt={item.title} className="w-12 h-12 rounded-md object-cover" />
                        <div>
                            <div className="text-gray-900">{item.title}</div>
                            <div className="text-gray-500">x {item.qty}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between items-start w-full">
                {/* order totals */}
                <div className="flex flex-col">
                    <div className="flex items-center space-x-4">
                        <div className="text-gray-900 min-w-20">Shipping</div>
                        <div className="text-gray-500 text-sm">£{FIXED_SHIPPING_COST}</div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-gray-900 min-w-20">Total</div>
                        <div className="text-gray-500 text-sm">{order.order_meta.order_total}</div>
                    </div>
                </div>

                <div className="text-right">
                    <span className={clsx(
                        "inline-block bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded",
                        `${ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS]}`
                    )}>
                        {order.status}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default memo(UserOrders);