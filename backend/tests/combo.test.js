const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
const SESSION_ID = process.env.SESSION_ID || `combo-flow-${Date.now()}`;

const validIngredients = [
	{ ingredient_id: 1, quantity: 1, position: 1 },
	{ ingredient_id: 12, quantity: 1, position: 2 },
	{ ingredient_id: 21, quantity: 1, position: 3 },
];

const invalidIngredients = [
	{ ingredient_id: 12, quantity: 1, position: 1 },
	{ ingredient_id: 1, quantity: 1, position: 2 },
	{ ingredient_id: 21, quantity: 1, position: 3 },
];

async function request(path, options = {}) {
	const response = await fetch(`${API_BASE_URL}${path}`, options);
	const text = await response.text();

	let body = null;
	try {
		body = text ? JSON.parse(text) : null;
	} catch {
		body = { raw: text };
	}

	return { response, body };
}

async function run() {
	console.log(`API_BASE_URL: ${API_BASE_URL}`);
	console.log(`SESSION_ID: ${SESSION_ID}`);

	console.log('1) Loading combo ingredients...');
	const ingredientsRes = await request('/dishes/combo/ingredients');
	if (!ingredientsRes.response.ok) {
		throw new Error(`GET /dishes/combo/ingredients failed: ${ingredientsRes.response.status}`);
	}
	if (
		!Array.isArray(ingredientsRes.body?.ingredients) ||
		ingredientsRes.body.ingredients.length === 0
	) {
		throw new Error('Ingredients payload is invalid.');
	}
	console.log(JSON.stringify(ingredientsRes.body, null, 2));
	console.log('Ingredients loaded. ✅');

	console.log('2) Previewing valid combo...');
	const validPreviewRes = await request('/dishes/combo/preview', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ ingredients: validIngredients }),
	});
	if (!validPreviewRes.response.ok) {
		throw new Error(
			`POST /dishes/combo/preview (valid) failed: ${validPreviewRes.response.status}`
		);
	}
	if (!validPreviewRes.body?.combo || Number(validPreviewRes.body.combo.total_price) <= 0) {
		throw new Error('Valid combo preview payload is invalid.');
	}
	console.log(JSON.stringify(validPreviewRes.body, null, 2));
	console.log('Valid combo preview passed. ✅');

	console.log('3) Previewing invalid combo...');
	const invalidPreviewRes = await request('/dishes/combo/preview', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ ingredients: invalidIngredients }),
	});
	if (invalidPreviewRes.response.ok) {
		throw new Error('Invalid combo preview should fail, but returned success.');
	}
	if (typeof invalidPreviewRes.body?.message !== 'string') {
		throw new Error('Invalid combo preview error payload is invalid.');
	}
	console.log(JSON.stringify(invalidPreviewRes.body, null, 2));
	console.log('Invalid combo preview rejected. ✅');

	console.log('4) Creating combo in cart...');
	const createRes = await request('/dishes/combo/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-session-id': SESSION_ID,
		},
		body: JSON.stringify({ ingredients: validIngredients }),
	});
	if (!createRes.response.ok) {
		throw new Error(`POST /dishes/combo/create failed: ${createRes.response.status}`);
	}
	if (
		!createRes.body?.cart ||
		!Array.isArray(createRes.body.cart.items) ||
		createRes.body.cart.items.length === 0
	) {
		throw new Error('Create combo response payload is invalid.');
	}
	console.log(JSON.stringify(createRes.body, null, 2));
	console.log('Combo added to cart. ✅');

	console.log('5) Verifying cart...');
	const cartRes = await request('/cart', {
		headers: { 'x-session-id': SESSION_ID },
	});
	if (!cartRes.response.ok) {
		throw new Error(`GET /cart failed: ${cartRes.response.status}`);
	}
	if (!cartRes.body?.cart || !Array.isArray(cartRes.body.cart.items)) {
		throw new Error('Cart payload is invalid.');
	}
	const hasCustomItem = cartRes.body.cart.items.some((item) => Number(item.type?.id) === 2);
	if (!hasCustomItem) {
		throw new Error('Custom combo item not found in cart.');
	}
	console.log(JSON.stringify(cartRes.body, null, 2));
	console.log('Cart contains custom combo. ✅');

	console.log('Combo flow integration test passed. ✅');
}

run().catch((error) => {
	console.error(error.message);
	process.exitCode = 1;
});
