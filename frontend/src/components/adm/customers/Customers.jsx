import './customers.css';
export default function Customers() {
	return (
                <section class="admin-main" id="page-customers">
                    <h2 class="admin-section-title">Customers</h2>
                    <p class="admin-placeholder-text">Registered customer accounts and order history.</p>
                    <div class="admin-table">
                        <div class="admin-table__head">
                            <span>Name</span>
                            <span>Email</span>
                            <span>Orders</span>
                            <span>Total Spent</span>
                        </div>
                        <div class="admin-table__row">
                            <span>Matti K.</span><span>matti@example.fi</span><span>12</span><span>€284.00</span>
                        </div>
                        <div class="admin-table__row">
                            <span>Anna S.</span><span>anna@example.fi</span><span>8</span><span>€196.50</span>
                        </div>
                        <div class="admin-table__row">
                            <span>Juha L.</span><span>juha@example.fi</span><span>5</span><span>€121.00</span>
                        </div>
                    </div>
                </section>
	);
}
