module.exports = {
    validation: {
        notEmpty: (field) => `${field} không được để trống.`,
        isEnum: (field, values) => `${field} phải thuộc một trong các giá trị sau: ${values.join(', ')}.`,
        isPositiveNumber: (field) => `${field} phải là một số dương.`,
        orderNotFound: 'Đơn hàng không tồn tại.',
    },
    success: {
        orderCreated: 'Đơn hàng đã được tạo thành công.',
        orderUpdated: 'Đơn hàng đã được cập nhật thành công.',
        orderDeleted: 'Đơn hàng đã được xóa thành công.',
    },
    error: {
        creatingOrder: 'Đã xảy ra lỗi khi tạo đơn hàng.',
        updatingOrder: 'Đã xảy ra lỗi khi cập nhật đơn hàng.',
        deletingOrder: 'Đã xảy ra lỗi khi xóa đơn hàng.',
        fetchingOrders: 'Đã xảy ra lỗi khi lấy danh sách đơn hàng.',
        fetchingOrder: 'Đã xảy ra lỗi khi lấy thông tin đơn hàng.',
    },
};
