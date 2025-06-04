import Coupon from "../models/coupon.model.js";

const createCoupon = async (couponData) => {
    const coupon = new Coupon(couponData);
    return await coupon.save();
};

const updateCoupon = async (id, couponData) => {
    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(id, couponData, {
            new: true,
            runValidators: true,
        });
        return updatedCoupon;
    } catch (error) {
        throw new Error("Error updating coupon: " + error.message);
    }
};

const deleteCoupon = async (id) => {
    try {
        const deletedCoupon = await Coupon.findByIdAndDelete(id);
        return deletedCoupon;
    } catch (error) {
        throw new Error("Error deleting coupon: " + error.message);
    }
};

const getCouponById = async (id) => {
    const coupon = await Coupon.findById(id);

    if (coupon) {
        // Kiểm tra expired date
        if (
            coupon.endDate &&
            new Date(coupon.endDate) < new Date() &&
            coupon.isActive
        ) {
            coupon.isActive = false;
            await coupon.save();
        }

        // Kiểm tra usageLimit
        if (coupon.usageLimit === 0 && coupon.isActive) {
            coupon.isActive = false;
            await coupon.save();
        }
    }

    return coupon;
};

const getAllCoupons = async () => {
    const coupons = await Coupon.find();

    const now = new Date();
    const expiredCoupons = coupons.filter(
        (coupon) =>
            coupon.endDate &&
            new Date(coupon.endDate) < now &&
            coupon.isActive === true
    );

    // Tìm coupons có usageLimit = 0
    const usageLimitExpiredCoupons = coupons.filter(
        (coupon) => coupon.usageLimit === 0 && coupon.isActive === true
    );

    // Update expired coupons
    if (expiredCoupons.length > 0) {
        const expiredIds = expiredCoupons.map((coupon) => coupon._id);
        await Coupon.updateMany({_id: {$in: expiredIds}}, {isActive: false});
    }

    // Update usage limit expired coupons
    if (usageLimitExpiredCoupons.length > 0) {
        const usageLimitExpiredIds = usageLimitExpiredCoupons.map(
            (coupon) => coupon._id
        );
        await Coupon.updateMany(
            {_id: {$in: usageLimitExpiredIds}},
            {isActive: false}
        );
    }

    // Return updated coupons nếu có thay đổi
    if (expiredCoupons.length > 0 || usageLimitExpiredCoupons.length > 0) {
        return await Coupon.find();
    }

    return coupons;
};

const applyCoupon = async (userId, couponCode, cartTotal) => {
    const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
    });

    if (!coupon) {
        throw new Error("Invalid or inactive coupon code");
    }

    if (coupon.endDate && new Date() > coupon.endDate) {
        throw new Error("Coupon expired");
    }

    if (coupon.usageLimit === 0) {
        throw new Error("Coupon usage limit reached");
    }

    if (cartTotal < coupon.minPurchaseAmount) {
        throw new Error(`Minimum amount required: ${coupon.minPurchaseAmount}`);
    }

    if (coupon.usedBy.includes(userId))
        throw new Error("You already used this coupon");

    coupon.usedBy.push(userId);
    await coupon.save();

    let discountPrice = 0;

    if (coupon.discountType === "percentage") {
        discountPrice = (coupon.discountValue / 100) * cartTotal;
        if (
            coupon.maxDiscountAmount &&
            discountPrice > coupon.maxDiscountAmount
        ) {
            discountPrice = coupon.maxDiscountAmount;
        }
    } else if (coupon.discountType === "fixed") {
        discountPrice = coupon.discountValue;
        if (
            coupon.maxDiscountAmount &&
            discountPrice > coupon.maxDiscountAmount
        ) {
            discountPrice = coupon.maxDiscountAmount;
        }
    }

    const discountName =
        coupon.discountType === "percentage"
            ? `${coupon.discountValue}%`
            : `${coupon.discountValue}$`;
    const finalTotal = Math.max(cartTotal - discountPrice, 0);
    return {
        discountPrice,
        finalTotal,
        appliedCoupon: coupon.code,
        discountName,
    };
};

const useCoupon = async (couponCode) => {
    const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
    });

    if (!coupon) {
        throw new Error("Invalid or inactive coupon code");
    }

    if (coupon.usageLimit === 0) {
        throw new Error("Coupon usage limit reached");
    }

    // Giảm usageLimit nếu có giá trị
    if (coupon.usageLimit > 0) {
        coupon.usageLimit -= 1;

        // Nếu usageLimit = 0 sau khi giảm, set isActive = false
        if (coupon.usageLimit === 0) {
            coupon.isActive = false;
        }

        await coupon.save();
    }

    return coupon;
};

export default {
    createCoupon,
    updateCoupon,
    getCouponById,
    getAllCoupons,
    deleteCoupon,
    applyCoupon,
    useCoupon,
};
