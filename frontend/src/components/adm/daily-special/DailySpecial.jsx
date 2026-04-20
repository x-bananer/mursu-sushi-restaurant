import './daily-special.css';

export default function DailySpecial() {
	return (
		<section class="admin-main" id="page-daily-special">
                    <h2 class="admin-section-title">Daily Special</h2>
                    <p class="admin-placeholder-text">Set today's featured dish and promotional pricing.</p>
                    <div class="admin-form-group">
                        <label class="input-field">
                            <span class="input-field__label">Special Name</span>
                            <input class="input-field__input" type="text" placeholder="E.g. Dragon Roll Omakase"/>
                        </label>
                        <label class="input-field">
                            <span class="input-field__label">Description</span>
                            <input class="input-field__input" type="text" placeholder="Short description of the special"/>
                        </label>
                        <label class="input-field">
                            <span class="input-field__label">Price (€)</span>
                            <input class="input-field__input" type="text" placeholder="0.00"/>
                        </label>
                        <button class="btn" type="button">Save Special</button>
                    </div>
                </section>
	);
}
