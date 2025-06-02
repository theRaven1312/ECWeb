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

    // Check if coupon is expired and update if necessary
    if (
        coupon &&
        coupon.endDate &&
        new Date(coupon.endDate) < new Date() &&
        coupon.isActive
    ) {
        coupon.isActive = false;
        await coupon.save();
    }

    return coupon;
};

// Helper function to check and update expired coupons
const updateExpiredCoupons = async () => {
    const now = new Date();
    await Coupon.updateMany(
        {
            endDate: {$lt: now},
            isActive: true,
        },
        {isActive: false}
    );
};

const getAllCoupons = async () => {
    // Get all coupons and check for expired ones
    const coupons = await Coupon.find();

    // Update expired coupons to inactive
    const now = new Date();
    const expiredCoupons = coupons.filter(
        (coupon) =>
            coupon.endDate &&
            new Date(coupon.endDate) < now &&
            coupon.isActive === true
    );

    // Bulk update expired coupons to inactive
    if (expiredCoupons.length > 0) {
        const expiredIds = expiredCoupons.map((coupon) => coupon._id);
        await Coupon.updateMany({_id: {$in: expiredIds}}, {isActive: false});

        // Refetch coupons to get updated data
        return await Coupon.find();
    }

    return coupons;
};

export default {
    createCoupon,
    updateCoupon,
    getCouponById,
    getAllCoupons,
    deleteCoupon,
    updateExpiredCoupons,
};
