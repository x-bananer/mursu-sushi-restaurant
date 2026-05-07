import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CartContent from "../../../components/customer/cart/cart-content/CartContent";

export default function Cart() {
	const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
	const stripePromise = loadStripe(
		import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
	);

	return (
		<Elements stripe={stripePromise}>
			<CartContent />
		</Elements>
	);
}
