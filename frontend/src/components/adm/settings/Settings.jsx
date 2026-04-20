export default function Settings() {
	return (
		<section class="admin-main" id="page-settings">
                    <h2 class="admin-section-title">Settings</h2>
                    <p class="admin-placeholder-text">Restaurant configuration and preferences.</p>
                    <div class="admin-form-group">
                        <label class="input-field">
                            <span class="input-field__label">Restaurant Name</span>
                            <input class="input-field__input" type="text" placeholder="Mursu"/>
                        </label>
                        <label class="input-field">
                            <span class="input-field__label">Address</span>
                            <input class="input-field__input" type="text" placeholder="Kaivokatu 1, Tampere"/>
                        </label>
                        <label class="input-field">
                            <span class="input-field__label">Opening Hours</span>
                            <input class="input-field__input" type="text" placeholder="11:00 – 22:00"/>
                        </label>
                        <button class="btn" type="button">Save Settings</button>
                    </div>
                </section>
	);
}
