import Joi from "joi";

const productModalValidator = (data) => {
  data.subCategory =
    data.subCategory && data.subCategory._id
      ? data.subCategory._id
      : data.subCategory;

  const schema = Joi.object().keys({
    subCategory: Joi.string().required(),
    brand: Joi.string().required(),
    collectionInfo: Joi.string().required(),
    supplier: Joi.string().required(),
    productName: Joi.string().required(),
    path: Joi.string().required(),
    origin: Joi.string().required(),
    material: Joi.string().required(),
    style: Joi.string().required(),
  });

  return schema
    .messages({
      //   "string.base": `"a" should be a type of 'text'`,
      //   "string.min": `"a" should have a minimum length of {#limit}`,
      "string.empty": `Không được để trống`,
      "any.required": `Bắt buộc phải nhập`,
    })
    .validate(data, { abortEarly: false, allowUnknown: true });
};

const colorModalValidator = (data) => {
  data.price = String(data.price);
  // data.priceImport = String(data.priceImport);
  data.product =
    data.product && data.product._id ? data.product._id : data.product;
  const schema = Joi.object().keys({
    product: Joi.string().required(),
    colorName: Joi.string().required(),
    hex: Joi.string().required(),
    price: Joi.string()
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.pattern.base": "Là các ký tự số",
      }),
    // priceImport: Joi.string()
    //   .pattern(/^[0-9]+$/)
    //   .required()
    //   .messages({
    //     "string.pattern.base": "Là các ký tự số",
    //   }),
  });

  return schema
    .messages({
      //   "string.base": `"a" should be a type of 'text'`,
      //   "string.min": `"a" should have a minimum length of {#limit}`,
      "string.empty": `Không được để trống`,
      "any.required": `Bắt buộc phải nhập`,
    })
    .validate(data, { abortEarly: false, allowUnknown: true });
};

const sizeModalValidator = (data) => {
  data.quantity = String(data.quantity);

  const schema = Joi.object().keys({
    color: Joi.string().required(),
    sizeName: Joi.string().required(),
    quantity: Joi.string()
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.pattern.base": "Là các ký tự số",
      }),
  });

  return schema
    .messages({
      //   "string.base": `"a" should be a type of 'text'`,
      //   "string.min": `"a" should have a minimum length of {#limit}`,
      "string.empty": `Không được để trống`,
      "any.required": `Bắt buộc phải nhập`,
    })
    .validate(data, { abortEarly: false, allowUnknown: true });
};

const colorImageModalValidator = (data) => {
  const schema = Joi.object().keys({
    color: Joi.string().required(),
    picture: Joi.string().required(),
  });

  return schema
    .messages({
      //   "string.base": `"a" should be a type of 'text'`,
      //   "string.min": `"a" should have a minimum length of {#limit}`,
      "string.empty": `Không được để trống`,
      "any.required": `Bắt buộc phải nhập`,
    })
    .validate(data, { abortEarly: false, allowUnknown: true });
};

const discountModalValidator = (data) => {
  data.value = String(data.value);
  data.symbol = String(data.symbol);

  const schema = Joi.object().keys({
    color: Joi.string().required(),
    discountName: Joi.string().required(),
    value: Joi.string()
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.pattern.base": "Là các ký tự số",
      }),
    symbol: Joi.string()
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.pattern.base": "Là các ký tự số",
      }),
  });

  return schema
    .messages({
      //   "string.base": `"a" should be a type of 'text'`,
      //   "string.min": `"a" should have a minimum length of {#limit}`,
      "string.empty": `Không được để trống`,
      "any.required": `Bắt buộc phải nhập`,
    })
    .validate(data, { abortEarly: false, allowUnknown: true });
};

const invoiceModalValidator = (data) => {
  data.paid = String(data.paid);
  data.total = String(data.total);

  const schema = Joi.object().keys({
    staff: Joi.string().required(),
    total: Joi.string()
      .required()
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.pattern.base": "Là các ký tự số",
      }),
    paid: Joi.string()
      .required()
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.pattern.base": "Là các ký tự số",
      }),
  });

  return schema
    .messages({
      //   "string.base": `"a" should be a type of 'text'`,
      //   "string.min": `"a" should have a minimum length of {#limit}`,
      "string.empty": `Không được để trống`,
      "any.required": `Bắt buộc phải nhập`,
    })
    .validate(data, { abortEarly: false, allowUnknown: true });
};

const invoiceDetailModalValidator = (data) => {
  data.priceImport = String(data.priceImport);
  data.quantity = String(data.quantity);
  data.product =
    data.product && data.product._id ? data.product._id : data.product;
  data.color = data.color && data.color._id ? data.color._id : data.color;
  data.size = data.size && data.size._id ? data.size._id : data.size;

  const schema = Joi.object().keys({
    // invoice: Joi.string().required(),
    product: Joi.string().required(),
    color: Joi.string().required(),
    size: Joi.string().required(),
    priceImport: Joi.string()
      .required()
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.pattern.base": "Là các ký tự số",
      }),
    quantity: Joi.string()
      .required()
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.pattern.base": "Là các ký tự số",
      }),
  });

  return schema
    .messages({
      //   "string.base": `"a" should be a type of 'text'`,
      //   "string.min": `"a" should have a minimum length of {#limit}`,
      "string.empty": `Không được để trống`,
      "any.required": `Bắt buộc phải nhập`,
    })
    .validate(data, { abortEarly: false, allowUnknown: true });
};

const ordersModalValidator = (data) => {
  data.total = String(data.total);
  data.status = String(data.status);
  data.payment = String(data.payment);
  data.paid = String(data.paid);

  const schema = Joi.object().keys({
    total: Joi.string()
      .required()
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.pattern.base": "Là các ký tự số",
      }),
    status: Joi.string()
      .required()
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.pattern.base": "Là các ký tự số",
      }),
    payment: Joi.string()
      .required()
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.pattern.base": "Là các ký tự số",
      }),
    paid: Joi.string()
      .required()
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.pattern.base": "Là các ký tự số",
      }),
  });

  return schema
    .messages({
      //   "string.base": `"a" should be a type of 'text'`,
      //   "string.min": `"a" should have a minimum length of {#limit}`,
      "string.empty": `Không được để trống`,
      "any.required": `Bắt buộc phải nhập`,
    })
    .validate(data, { abortEarly: false, allowUnknown: true });
};

const ordersDetailModalValidator = (data) => {
  data.price = String(data.price);
  data.quantity = String(data.quantity);
  data.product =
    data.product && data.product._id ? data.product._id : data.product;
  data.color = data.color && data.color._id ? data.color._id : data.color;
  data.size = data.size && data.size._id ? data.size._id : data.size;

  const schema = Joi.object().keys({
    // invoice: Joi.string().required(),
    product: Joi.string().required(),
    color: Joi.string().required(),
    size: Joi.string().required(),
    price: Joi.string()
      .required()
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.pattern.base": "Là các ký tự số",
      }),
    quantity: Joi.string()
      .required()
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.pattern.base": "Là các ký tự số",
      }),
  });

  return schema
    .messages({
      //   "string.base": `"a" should be a type of 'text'`,
      //   "string.min": `"a" should have a minimum length of {#limit}`,
      "string.empty": `Không được để trống`,
      "any.required": `Bắt buộc phải nhập`,
    })
    .validate(data, { abortEarly: false, allowUnknown: true });
};

const categoryModalValidator = (data) => {
  const schema = Joi.object().keys({
    categoryName: Joi.string().required(),
    path: Joi.string().required(),
  });

  return schema
    .messages({
      //   "string.base": `"a" should be a type of 'text'`,
      //   "string.min": `"a" should have a minimum length of {#limit}`,
      "string.empty": `Không được để trống`,
      "any.required": `Bắt buộc phải nhập`,
    })
    .validate(data, { abortEarly: false, allowUnknown: true });
};

const subCategoryModalValidator = (data) => {
  //check category is object? -> type: string
  // if (data.category) {
  data.category =
    data.category && data.category._id ? data.category._id : data.category;
  // }

  const schema = Joi.object().keys({
    category: Joi.string().required(),
    subCategoryName: Joi.string()
      .pattern(/^\d+$/, { invert: true })
      .min(3)
      .max(100)
      .required(),
    path: Joi.string().required(),
  });

  return schema
    .messages({
      //   "string.base": `"a" should be a type of 'text'`,
      //   "string.min": `"a" should have a minimum length of {#limit}`,
      "string.empty": `Không được để trống`,
      "any.required": `Bắt buộc phải nhập`,
    })
    .validate(data, { abortEarly: false, allowUnknown: true });
};

const slideModalValidator = (data) => {
  const schema = Joi.object().keys({
    // slideName: Joi.string().required(),
    picture: Joi.string().required(),
  });

  return schema
    .messages({
      //   "string.base": `"a" should be a type of 'text'`,
      //   "string.min": `"a" should have a minimum length of {#limit}`,
      "string.empty": `Không được để trống`,
      "any.required": `Bắt buộc phải nhập`,
    })
    .validate(data, { abortEarly: false, allowUnknown: true });
};

const brandModalValidator = (data) => {
  const schema = Joi.object().keys({
    brandName: Joi.string().required(),
  });

  return schema
    .messages({
      //   "string.base": `"a" should be a type of 'text'`,
      //   "string.min": `"a" should have a minimum length of {#limit}`,
      "string.empty": `Không được để trống`,
      "any.required": `Bắt buộc phải nhập`,
    })
    .validate(data, { abortEarly: false, allowUnknown: true });
};

const supplierModalValidator = (data) => {
  const schema = Joi.object().keys({
    supplierName: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.pattern.base": "Số điện thoại là các ký tự số",
        "string.length": "Số điện thoại có 10 ký tự",
      }),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .messages({
        "string.email": "Email không hợp lệ",
      }),
  });

  return schema
    .messages({
      //   "string.base": `"a" should be a type of 'text'`,
      //   "string.min": `"a" should have a minimum length of {#limit}`,
      "string.empty": `Không được để trống`,
      "any.required": `Bắt buộc phải nhập`,
    })
    .validate(data, { abortEarly: false, allowUnknown: true });
};

const collectionModalValidator = (data) => {
  const schema = Joi.object().keys({
    collectionName: Joi.string().required(),
    path: Joi.string().required(),
  });

  return schema
    .messages({
      //   "string.base": `"a" should be a type of 'text'`,
      //   "string.min": `"a" should have a minimum length of {#limit}`,
      "string.empty": `Không được để trống`,
      "any.required": `Bắt buộc phải nhập`,
    })
    .validate(data, { abortEarly: false, allowUnknown: true });
};

const collectionImageModalValidator = (data) => {
  const schema = Joi.object().keys({
    collectionInfo: Joi.string().required(),
    picture: Joi.string().required(),
  });

  return schema
    .messages({
      //   "string.base": `"a" should be a type of 'text'`,
      //   "string.min": `"a" should have a minimum length of {#limit}`,
      "string.empty": `Không được để trống`,
      "any.required": `Bắt buộc phải nhập`,
    })
    .validate(data, { abortEarly: false, allowUnknown: true });
};

const lookbookModalValidator = (data) => {
  data.collectionInfo =
    data.collectionInfo && data.collectionInfo._id
      ? data.collectionInfo._id
      : data.collectionInfo;
  // }
  const schema = Joi.object().keys({
    lookbookName: Joi.string().required(),
    collectionInfo: Joi.string().required(),
  });

  return schema
    .messages({
      //   "string.base": `"a" should be a type of 'text'`,
      //   "string.min": `"a" should have a minimum length of {#limit}`,
      "string.empty": `Không được để trống`,
      "any.required": `Bắt buộc phải nhập`,
    })
    .validate(data, { abortEarly: false, allowUnknown: true });
};

const lookbookImageModalValidator = (data) => {
  const schema = Joi.object().keys({
    lookbook: Joi.string().required(),
    picture: Joi.string().required(),
  });

  return schema
    .messages({
      //   "string.base": `"a" should be a type of 'text'`,
      //   "string.min": `"a" should have a minimum length of {#limit}`,
      "string.empty": `Không được để trống`,
      "any.required": `Bắt buộc phải nhập`,
    })
    .validate(data, { abortEarly: false, allowUnknown: true });
};

const customerModalValidator = (data) => {
  const schema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().min(3).required().messages({
      "string.min": "Mật khẩu ít nhất 3 ký tự",
      // "string.max": "Mật khẩu nhiều nhất 15 ký tự",
    }),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .messages({
        "string.email": "Email không hợp lệ",
      }),
    password_confirmation: Joi.string()
      .equal(Joi.ref("password")) // not empty because this line
      .label("password_confirmation")
      .messages({ "any.only": "Nhập lại mật khẩu chưa chính xác" })
      .required(),
    customerName: Joi.string().required(),
    phone: Joi.string().required(),
  });

  return schema
    .messages({
      //   "string.base": `"a" should be a type of 'text'`,
      //   "string.min": `"a" should have a minimum length of {#limit}`,
      "string.empty": `Không được để trống`,
      "any.required": `Bắt buộc phải nhập`,
    })
    .validate(data, { abortEarly: false, allowUnknown: true });
};

const staffModalValidator = (data) => {
  data.role = String(data.role);

  const schema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().min(3).required().messages({
      "string.min": "Mật khẩu ít nhất 3 ký tự",
      // "string.max": "Mật khẩu nhiều nhất 30 ký tự",
    }),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .messages({
        "string.email": "Email không hợp lệ",
      }),
    staffName: Joi.string().required(),
    phone: Joi.string().required(),
    role: Joi.string().required(),
  });

  return schema
    .messages({
      //   "string.base": `"a" should be a type of 'text'`,
      //   "string.min": `"a" should have a minimum length of {#limit}`,
      "string.empty": `Không được để trống`,
      "any.required": `Bắt buộc phải nhập`,
    })
    .validate(data, { abortEarly: false, allowUnknown: true });
};

const userModalValidator = (data) => {
  const schema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  return schema
    .messages({
      //   "string.base": `"a" should be a type of 'text'`,
      //   "string.min": `"a" should have a minimum length of {#limit}`,
      "string.empty": `Không được để trống`,
      "any.required": `Bắt buộc phải nhập`,
    })
    .validate(data, { abortEarly: false, allowUnknown: true });
};

export {
  productModalValidator,
  colorModalValidator,
  colorImageModalValidator,
  sizeModalValidator,
  discountModalValidator,
  categoryModalValidator,
  subCategoryModalValidator,
  slideModalValidator,
  brandModalValidator,
  supplierModalValidator,
  collectionModalValidator,
  collectionImageModalValidator,
  invoiceModalValidator,
  invoiceDetailModalValidator,
  ordersModalValidator,
  ordersDetailModalValidator,
  customerModalValidator,
  staffModalValidator,
  userModalValidator,
  lookbookModalValidator,
  lookbookImageModalValidator,
};
