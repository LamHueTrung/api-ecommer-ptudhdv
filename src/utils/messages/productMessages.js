module.exports = {
    validation: {
        notEmpty: (field) => `${field} không được để trống.`,
        isPositiveNumber: (field) => `${field} phải là một số dương.`,
        productNotFound: 'Sản phẩm không tồn tại.',
    },
    success: {
        productCreated: 'Sản phẩm đã được tạo thành công.',
        productUpdated: 'Sản phẩm đã được cập nhật thành công.',
        productDeleted: 'Sản phẩm đã được xóa thành công.',
    },
    error: {
        creatingProduct: 'Đã xảy ra lỗi khi tạo sản phẩm.',
        updatingProduct: 'Đã xảy ra lỗi khi cập nhật sản phẩm.',
        deletingProduct: 'Đã xảy ra lỗi khi xóa sản phẩm.',
        fetchingProducts: 'Đã xảy ra lỗi khi lấy danh sách sản phẩm.',
        fetchingProduct: 'Đã xảy ra lỗi khi lấy thông tin sản phẩm.',
    },
};
