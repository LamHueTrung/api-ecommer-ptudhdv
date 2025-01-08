module.exports = {
    validation: {
        notEmpty: (fieldName) => `${fieldName} không được để trống.`,
        notNull: (fieldName) => `${fieldName} không được là null.`,
        greaterThan: (fieldName, minValue) => `${fieldName} phải lớn hơn ${minValue}.`,
        maxLength: (fieldName, maxLength) => `${fieldName} không được vượt quá ${maxLength} ký tự.`,
        invalidEmail: 'Địa chỉ email không hợp lệ.',
        invalidPhoneNumber: 'Số điện thoại không hợp lệ.',
        invalidFileType: (fieldName, allowedTypes) =>
            `${fieldName} phải là một trong các định dạng: ${allowedTypes}.`,
        invalidDate: (fieldName) => `${fieldName} phải là một ngày hợp lệ.`,
        maxFileSize: (fieldName, maxSizeMB) =>
            `${fieldName} không được vượt quá ${maxSizeMB} MB.`,
        invalidEnum: (fieldName) =>
            `${fieldName} không thuộc danh sách các giá trị hợp lệ.`,
        arrayNotEmpty: (fieldName) => `${fieldName} không được là một mảng rỗng.`,
        isPositiveNumber: (fieldName) =>
            `${fieldName} phải là một số dương.`,
        invalidDurationFormat: (fieldName) =>
            `${fieldName} phải ở định dạng hh:mm:ss hoặc mm:ss.`,
        invalidDurationValue: (fieldName) =>
            `${fieldName} phải có thời lượng lớn hơn 0.`,
        containsVietnamese: 'Chuỗi không được chứa ký tự tiếng Việt.',
        requiredField: (fieldName) => `${fieldName} là bắt buộc.`,
        equals: (fieldName) => `${fieldName} không khớp.`,
        invalidUrl: (fieldName) => `${fieldName} phải là một URL hợp lệ.`,
    },
};
