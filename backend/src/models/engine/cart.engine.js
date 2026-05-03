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

// Calculate final cart total price from item prices and quantities and discounts
export const calculateCartTotalPrice = (items, hasStampDiscount = false, dailySpecialDishIds = []) => {
    const validation = validateCart(items);
    
    const DISCOUNT_PERCENT = 10;

    if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
    }

    let totalPrice = 0;
    let dailySpecialDiscount = 0;
    let stampDiscount = 0;
    let totalDiscount = 0;

    for (const item of items) {
        let itemPrice = Number(item.price) * Number(item.quantity);

        const isDailySpecialDish = dailySpecialDishIds.includes(item.dish_id);

        if (isDailySpecialDish) {
            const itemDailySpecialDiscount = itemPrice * DISCOUNT_PERCENT / 100;
            dailySpecialDiscount += itemDailySpecialDiscount;
            itemPrice -= itemDailySpecialDiscount;
        }

        totalPrice += itemPrice;
    }

    stampDiscount = hasStampDiscount ? totalPrice * DISCOUNT_PERCENT / 100 : 0;
    
    totalDiscount = dailySpecialDiscount + stampDiscount;
    totalPrice = totalPrice - stampDiscount;

    return {
        totalPrice: totalPrice,
        discount: totalDiscount,
    };
};
