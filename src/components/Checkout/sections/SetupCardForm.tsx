import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import SlideInFromBottomToTop from "@/shared/SlideIn";
import { useUser } from '@/hooks/useUser';
import { useState } from 'react';
import { createSetupIntent } from '@/actions/store-actions';
import { addOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { BiLoader } from 'react-icons/bi';

export const SetupCardForm: React.FC<{ onComplete: () => void; }> = ({
    onComplete
}) => {
    const { user } = useUser();

    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null | undefined>();

    const [isOpen, setOpen] = useState<boolean>(false);


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        try {
            const response = await createSetupIntent(user?.email, `${user?.first_name} ${user?.last_name}`);

            if (response.error) {
                setError(response.error.message);
                setLoading(false);
                return;
            }

            const result = await stripe.confirmCardSetup(response.client_secret, {
                payment_method: {
                    card: elements.getElement(CardElement) as any,
                },
            });

            if (result.error) {
                setError(result.error.message);
            } else {
                // Card setup succeeded
                console.log('SetupIntent succeeded:', result.setupIntent);
                setOpen(false);
                onComplete();
            }
        } catch (error) {
            setError((error as Error).message);
        }

        setLoading(false);
    };

    return (
        <>
            <div className="rounded-md py-1.5 px-3 cursor-pointer border border-solid flex justify-between items-center transition-all duration-300">
                <button
                    type="button"
                    className="w-full text-center btn btn-outline btn-sm flex items-center gap-1"
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    Add New Card
                    <IonIcon icon={addOutline} />
                </button>
            </div>

            <SlideInFromBottomToTop isOpen={isOpen} onClose={() => setOpen(false)} height={'60%'} title="Add New Card">
                <form onSubmit={handleSubmit} className="my-3 w-full px-4">
                    <CardElement options={{
                        hidePostalCode: true,
                    }} />
                    <button type="submit" disabled={!stripe || loading}
                        className="btn btn-primary btn-block disabled:opacity-50 disabled:animate-pulse mt-3 flex items-center gap-1"
                    >
                        {loading ? "Processing..." : "Add Card"}
                        {loading && <BiLoader className="animate-spin text-sm" />}
                        {!loading && <IonIcon icon={addOutline} />}
                    </button>
                    {error && <div className="toast-box toast-bottom bg-danger text-center show !bottom-0">
                        <div className="text text-center w-full">
                            {error}
                        </div>
                    </div>}
                </form>
            </SlideInFromBottomToTop>
        </>
    );
};
