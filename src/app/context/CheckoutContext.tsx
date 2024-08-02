import { useUser } from '@/hooks/useUser';
import { UserSchema } from '@/zod-schemas/billing-form';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CheckoutContextProps {
    shippingInfo: UserSchema;
    setShippingInfo: React.Dispatch<React.SetStateAction<UserSchema>>;
    editShippingInfo: boolean;
    setEditShippingInfo: React.Dispatch<React.SetStateAction<boolean>>;
    isShippingInfoValid: () => boolean;
}

const CheckoutContext = createContext<CheckoutContextProps | undefined>(undefined);

export const useCheckout = () => {
    const context = useContext(CheckoutContext);
    if (!context) {
        throw new Error('useCheckout must be used within a CheckoutProvider');
    }
    return context;
};

const CheckoutProvider: React.FC<{ children: ReactNode; }> = ({ children }) => {
    const { user } = useUser();

    const [shippingInfo, setShippingInfo] = useState<UserSchema>({
        first_name: user.first_name,
        last_name: user.last_name,
        // email: user.email,
        phone: user.billing_info?.phone || '',
        address_1: user.billing_info?.address_1 || '',
        address_2: user.billing_info?.address_2,
        city: user.billing_info?.city || '',
        state: user.billing_info?.state || '',
        postcode: user.billing_info?.postcode || '',
        country: user.billing_info?.country || '',
    });

    const isShippingInfoValid = (): boolean => {
        // check if the required fields are filled
        const requiredFields = ['first_name', 'last_name', 'phone', 'address_1', 'city', 'postcode', 'country'];

        for (const field of requiredFields) {
            if (!shippingInfo[field as keyof UserSchema]) {
                return false;
            }
        }

        return true;
    };

    const hasDefaultShippingInfo = (): boolean => {
        // check if the required fields are filled
        const requiredFields = ['first_name', 'last_name', 'phone', 'address_1', 'city', 'postcode', 'country'];

        for (const field of requiredFields) {
            if (!shippingInfo[field as keyof UserSchema]) {
                return false;
            }
        }

        return true;
    };

    const [editShippingInfo, setEditShippingInfo] = useState<boolean>(!hasDefaultShippingInfo());

    return (
        <CheckoutContext.Provider value={{
            shippingInfo,
            setShippingInfo,
            editShippingInfo,
            setEditShippingInfo,
            isShippingInfoValid
        }}>
            {children}
        </CheckoutContext.Provider>
    );
};

export default CheckoutProvider;