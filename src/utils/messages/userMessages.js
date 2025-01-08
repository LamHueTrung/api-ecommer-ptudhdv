module.exports = {
    validation: {
        notEmpty: (field) => `${field} không được để trống.`,
        isEmail: 'Email không hợp lệ.',
        isPassword: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái, số và ký tự đặc biệt.',
        userNotFound: 'Người dùng không tồn tại.',
        emailExists: 'Email đã được sử dụng bởi người dùng khác.',
    },
    success: {
        userCreated: 'Người dùng đã được tạo thành công.',
        userUpdated: 'Người dùng đã được cập nhật thành công.',
        userDeleted: 'Người dùng đã được xóa thành công.',
        userFetched: 'Danh sách người dùng đã được lấy thành công.',
    },
    error: {
        creatingUser: 'Đã xảy ra lỗi khi tạo người dùng.',
        updatingUser: 'Đã xảy ra lỗi khi cập nhật người dùng.',
        deletingUser: 'Đã xảy ra lỗi khi xóa người dùng.',
        fetchingUsers: 'Đã xảy ra lỗi khi lấy danh sách người dùng.',
        fetchingUser: 'Đã xảy ra lỗi khi lấy danh sách người dùng.',
    },
};
