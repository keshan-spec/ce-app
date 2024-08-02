import { updateBillingInfo } from "@/actions/profile-actions";
import { useCheckout } from "@/app/context/CheckoutContext";
import { BillingFieldType } from "@/types/store";
import { UserSchema, userSchema } from "@/zod-schemas/billing-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IonIcon } from "@ionic/react";
import { closeCircle } from "ionicons/icons";
import { SubmitHandler, useForm } from "react-hook-form";

const fields: BillingFieldType[] = [
    { label: "First Name", type: "text", name: "first_name", placeholder: "Enter your first name", required: true },
    { label: "Last Name", type: "text", name: "last_name", placeholder: "Enter your last name", required: true },
    // { label: "Email", type: "email", name: "email", placeholder: "Enter your email", required: true },
    { label: "Phone", type: "tel", name: "phone", placeholder: "Enter your phone number", required: true },
    { label: "Address Line 1", type: "text", name: "address_1", placeholder: "Enter your address", required: true },
    { label: "Address Line 2", type: "text", name: "address_2", placeholder: "Enter your address" },
    { label: "City", type: "text", name: "city", placeholder: "Enter your city", required: true },
    { label: "County", type: "text", name: "state", placeholder: "Enter your county" },
    { label: "Postcode", type: "text", name: "postcode", placeholder: "Enter your postcode", required: true },
    {
        label: "Country", type: "select", name: "country", placeholder: "Select your country", required: true, options: [
            { label: "United Kingdom", value: "GB" },
            { label: "United States", value: "US" },
            { label: "Canada", value: "CA" },
            { label: "Ireland", value: "IE" },
        ]
    }
];

const ShippingForm = () => {
    const { shippingInfo, setShippingInfo, setEditShippingInfo, isShippingInfoValid } = useCheckout();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UserSchema>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            first_name: shippingInfo.first_name,
            last_name: shippingInfo.last_name,
            // email: shippingInfo.email,
            phone: shippingInfo?.phone,
            address_1: shippingInfo?.address_1,
            address_2: shippingInfo?.address_2,
            city: shippingInfo?.city,
            state: shippingInfo?.state,
            postcode: shippingInfo?.postcode,
            country: shippingInfo?.country || '',
        }
    });

    const onSubmit: SubmitHandler<UserSchema> = async (data) => {
        setShippingInfo(data);
        try {
            const response = await updateBillingInfo(data);
            setEditShippingInfo(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col items-center w-full'>
            <div className="section full mb-2 w-full">
                <div className="px-3 pb-1 pt-1">
                    {fields.map((field, idx) => (
                        <div className="form-group basic" key={idx}>
                            <div className="input-wrapper">
                                <label className="form-label">
                                    {field.label}
                                    {field.required && <span className="text-danger ml-0.5">*</span>}
                                </label>
                                {field.type === "select" ? (
                                    <select
                                        className={`form-control ${errors[field.name as keyof UserSchema] ? 'border-red-500' : ''}`}
                                        {...register(field.name as keyof UserSchema)}
                                    >
                                        <option disabled value="">
                                            {field.placeholder}
                                        </option>
                                        {field.options?.map((option, idx) => (
                                            <option key={idx} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type}
                                        className={`form-control ${errors[field.name as keyof UserSchema] ? '!border-b !border-red-500' : ''}`}
                                        placeholder={field.placeholder}
                                        {...register(field.name as keyof UserSchema)}
                                    />
                                )}

                                {errors[field.name as keyof UserSchema] && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors[field.name as keyof UserSchema]?.message}
                                    </p>
                                )}
                                <i className="clear-input">
                                    <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle"></IonIcon>
                                </i>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="fixed bottom-1 bg-white flex items-center justify-between w-full gap-2 px-3">
                <button
                    type="button"
                    className="btn btn-danger w-full"
                    onClick={() => setEditShippingInfo(false)}
                    disabled={isSubmitting || !isShippingInfoValid()}
                >
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
};

export default ShippingForm;