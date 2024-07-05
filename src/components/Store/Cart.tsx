'use client';
import { FIXED_SHIPPING_COST } from '@/app/(protected)/checkout/page';
import { useCartStore } from '@/hooks/useCartStore';
import { StoreQtyButton } from '@/shared/StoreQtyButton';
import { IonIcon } from '@ionic/react';
import { closeCircle } from 'ionicons/icons';
import Link from 'next/link';

export const Cart: React.FC = () => {
    const { cart, removeFromCart, totalItems, totalPrice, updateQty } = useCartStore();
    const isHydrated = useCartStore.persist.hasHydrated();

    if (!isHydrated) {
        return (
            <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
                <h1 className="text-4xl font-extrabold mb-2">Loading...</h1>
            </main>
        );
    }

    if (totalItems === 0) {
        return (
            <div className="section mt-2">
                <div className="card cart-item mb-2">
                    <div className="card-body">
                        <h3 className="text-center">Your cart is empty</h3>

                        <div className="text-center">
                            <Link href={'/store'} className="btn btn-primary btn-sm">Start Shopping</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="section mt-2">
                <div className="card cart-item mb-2">
                    {cart.map((item) => (
                        <div className="card-body" key={item.id}>
                            <div className="in">
                                <img src={item.thumbnail} alt="product" className="imaged" />
                                <div className="text">
                                    <Link href={`/store/product/${item.id.split('-')[0]}`}>
                                        <h3 className="title">{item.title}</h3>
                                    </Link>
                                    <p className="detail">{item.variationLabel}</p>
                                    <strong className="price">
                                        £{item.price * item.qty}
                                    </strong>
                                </div>
                            </div>
                            <div className="cart-item-footer">
                                <StoreQtyButton
                                    defaultQty={item.qty}
                                    size='sm'
                                    onQtyChange={(qty) => {
                                        updateQty(item.id, qty);
                                    }}
                                />

                                <button onClick={() => {
                                    removeFromCart(item.id);
                                }}
                                    className="btn btn-outline-primary btn-sm">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="section">
                <a href="#" className="btn btn-sm btn-text-secondary btn-block" data-bs-toggle="offcanvas" data-bs-target="#actionSheetDiscount">
                    Have a discount code?
                </a>
            </div>

            <div className="offcanvas offcanvas-bottom action-sheet" tabIndex={-1} id="actionSheetDiscount">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title">Enter Discount Code</h5>
                </div>
                <div className="offcanvas-body">
                    <div className="action-sheet-content">
                        <form>
                            <div className="form-group basic">
                                <div className="input-wrapper">
                                    <label className="form-label" htmlFor="discount1">Discount Code</label>
                                    <input type="text" className="form-control" id="discount1" placeholder="Enter your discount code" />
                                    <i className="clear-input">
                                        <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle"></IonIcon>
                                    </i>
                                </div>
                            </div>

                            <div className="form-group basic">
                                <button type="button" className="btn btn-primary btn-block" data-bs-dismiss="offcanvas">Apply
                                    Discount</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="section mt-2 mb-2">
                <div className="card">
                    <ul className="listview flush transparent simple-listview">
                        <li>Subtotal <span className="text-muted">£{totalPrice}</span></li>
                        <li>Shipping <span className="text-muted">£{FIXED_SHIPPING_COST}</span></li>
                        <li>Total<span className="text-primary font-weight-bold">£{totalPrice + FIXED_SHIPPING_COST}</span></li>
                    </ul>
                </div>
            </div>

            <div className="section mb-2">
                <Link href="/checkout" className="btn btn-primary btn-block">Order Now</Link>
            </div>
        </>
    );
};