export default function MenuEdit() {
	return (
        <section class="admin-page" id="page-menu-editor">
                    <h2 class="admin-section-title">Menu Editor</h2>
                    <p class="admin-placeholder-text">Edit menu items, prices, and availability.</p>
                    <div class="admin-table">
                        <div class="admin-table__head">
                            <span>Item</span>
                            <span>Category</span>
                            <span>Price</span>
                            <span>Status</span>
                        </div>
                        <div class="admin-table__row">
                            <span>Obsidian Roll</span><span>Rolls</span><span>€18.00</span>
                            <span class="badge">Available</span>
                        </div>
                        <div class="admin-table__row">
                            <span>Bone Sashimi</span><span>Sashimi</span><span>€24.00</span>
                            <span class="badge">Available</span>
                        </div>
                        <div class="admin-table__row">
                            <span>Sake Sashimi</span><span>Sashimi</span><span>€16.00</span>
                            <span class="badge">Available</span>
                        </div>
                        <div class="admin-table__row">
                            <span>Unagi Kabayaki</span><span>Mains</span><span>€22.00</span>
                            <span class="badge">Available</span>
                        </div>
                        <div class="admin-table__row">
                            <span>Ebi Tempura Roll</span><span>Rolls</span><span>€14.50</span>
                            <span class="badge">Available</span>
                        </div>
                        <div class="admin-table__row">
                            <span>Miso Soup</span><span>Sides</span><span>€5.00</span>
                            <span class="badge">Available</span>
                        </div>
                    </div>
                </section>
	);
}
