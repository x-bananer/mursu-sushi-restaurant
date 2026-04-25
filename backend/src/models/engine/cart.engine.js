// Validate cart items before total price calculation
export const validateCart = (items) => {
    const errors = [];

    if (!Array.isArray(items)) {
        errors.push('items must be an array');
    } else {
        for (const item of items) {
            const quantity = Number(item.quantity);
            const price = Number(item.price);

            if (Number.isNaN(quantity) || quantity <= 0) {
                errors.push('quantity must be greater than 0');
            }

            if (Number.isNaN(price) || price <= 0) {
                errors.push('item price must be a valid number');
            }
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};

// Calculate final cart total price from item prices and quantities
export const calculateCartTotalPrice = (items) => {
    const validation = validateCart(items);

    if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
    }

    let totalPrice = 0;

    for (const item of items) {
        totalPrice += Number(item.price) * Number(item.quantity);
    }

    // TODO: add 10% stamp discount when user.repository is ready
    // TODO: add 10% daily special discount when dish.repository is ready

    return totalPrice;
};
