module.exports = {
    validation: {
        notEmpty: (field) => `${field} không được để trống.`,
        isPositiveNumber: (field) => `${field} phải là một số dương.`,
        isEnum: (field, values) => `${field} phải thuộc một trong các giá trị sau: ${values.join(', ')}.`,
        paymentNotFound: 'Thanh toán không tồn tại.',
        invalidMethod: (field) => `${field} phải là một trong các giá trị: cash, card.`,
        invalidStatus: (field) => `${field} phải là một trong các giá trị sau: pending, completed, failed.`,
    },
    success: {
        paymentCreated: 'Thanh toán đã được tạo thành công.',
        paymentUpdated: 'Thanh toán đã được cập nhật thành công.',
        paymentDeleted: 'Thanh toán đã được xóa thành công.',
    },
    error: {
        creatingPayment: 'Đã xảy ra lỗi khi tạo thanh toán.',
        updatingPayment: 'Đã xảy ra lỗi khi cập nhật thanh toán.',
        deletingPayment: 'Đã xảy ra lỗi khi xóa thanh toán.',
        fetchingPayments: 'Đã xảy ra lỗi khi lấy danh sách thanh toán.',
        fetchingPayment: 'Đã xảy ra lỗi khi lấy thông tin thanh toán.',
    },
};
