module.exports = {
    validation: {
        notEmpty: (field) => `${field} không được để trống.`,
        isPositiveNumber: (field) => `${field} phải là một số dương.`,
        maxLength: (field, max) => `${field} không được vượt quá ${max} ký tự.`,
        reviewNotFound: 'Đánh giá không tồn tại.',
    },
    success: {
        reviewCreated: 'Đánh giá đã được tạo thành công.',
        reviewDeleted: 'Đánh giá đã được xóa thành công.',
    },
    error: {
        creatingReview: 'Đã xảy ra lỗi khi tạo đánh giá.',
        deletingReview: 'Đã xảy ra lỗi khi xóa đánh giá.',
        fetchingReviews: 'Đã xảy ra lỗi khi lấy danh sách đánh giá.',
    },
};
