export type APIResponse<T, ErrorResponse> = {
  code: number;
  status: string;
  metadata?: APIMetadata;
  data: T;
  errors: ErrorResponse;
};

export type Color = {
  name: string;
  hex: string;
};

export type RefreshedToken = {
  session_id: string;
  access_token: string;
  access_token_expires_at: string;
  refresh_token: string;
  refresh_token_expires_at: string;
};

export type WikisColors = {
  paletteTitle: string;
  colors: Color[];
};

export type APIMetadata = {
  offset: number | null;
  limit: number | null;
  page_count: number;
  total_count: number;
};

export type CheckoutItem = {
  sku: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

export type UploadResponse = {
  id: string;
  size: number;
  file_name: string;
  image_url: string;
  content_type: string;
  uploaded_at: string;
};

export type LoginResponse = {
  session_id: string;
  access_token: string;
  access_token_expires_at: string;
  refresh_token: string;
  refresh_token_expires_at: string;
  user: User;
};

export type UpdateProfileError = {
  message?: string;
  name?: string[];
  phone?: string[];
  gender?: string[];
  birthdate?: string[];
};

export type ProductError = {
  message?: string;
  name?: string[];
  description?: string[];
  category?: string[];
  dimension?: string[];
  weight?: string[];
  available?: string[];
  featured?: string[];
  customizable?: string[];
  stock?: string[];
  price?: string[];
  selections?: string[];
  variant?: string[];
  model?: string[];
  images?: string[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  birthdate?: string;
  profile_picture?: {
    name: string;
    url: string;
    uploaded_at: string;
  };
  gender?: string;
  created_at: string;
  password_changed_at?: string;
};

export type Admin = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  profile_picture?: {
    name: string;
    url: string;
    uploaded_at: string;
  } | null;
  created_at: string;
};

export type UploadImageRequest = {
  upload_id: string;
};

export type Option = {
  value: string;
  hex_code?: string;
};

export type VariantSelection = {
  name: string;
  options: Option[];
};

export type Variant = {
  sku: string;
  stock?: number;
  variant_name?: string;
  price: number;
};

export type CreateProductRequest =
  | CreatePreOrderProduct
  | CreateReadyStockProduct;

export type CreateReadyStockProduct = {
  name: string;
  description: string;
  category: string;
  dimension: {
    length: number;
    width: number;
    height: number;
    unit: "cm" | "dm";
  };
  weight: {
    value: number;
    unit: "kg" | "gr";
  };
  available: boolean;
  featured: boolean;
  customizable: false;
  price: number;
  stock: number;
  images: UploadImageRequest[];
  model: {
    upload_id: string;
  };
};

export type CreatePreOrderProduct = {
  name: string;
  description: string;
  category: string;
  dimension: {
    length: number;
    width: number;
    height: number;
    unit: "cm" | "dm";
  };
  weight: {
    value: number;
    unit: "kg" | "gr";
  };
  available: boolean;
  featured: boolean;
  customizable: true;
  images: UploadImageRequest[];
  model: {
    upload_id: string;
  };
  selections: VariantSelection[];
  variants: Required<Omit<Variant, "sku" | "stock">>[];
};

export type ProductSoldStat = {
  month: string;
  total_product_sold: number;
};

export type RegisterRequest = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
};

export type RegisterError = {
  message?: string;
  name?: string[];
  email?: string[];
  phone?: string[];
  password?: string[];
  confirm_password?: string[];
};

export type RegisterAdminError = {
  message?: string;
  name?: string[];
  email?: string[];
  phone?: string[];
  password?: string[];
};

export type ChangePasswordError = {
  message?: string;
  password?: string[];
  confirm_password?: string[];
};

export type CreateAddressError = {
  message?: string;
  contact_name?: string[];
  contact_phone?: string[];
  full_address?: string[];
  area_id?: string[];
  province?: string[];
  city?: string[];
  district?: string[];
  postal_code?: string[];
  note?: string[];
  is_primary?: string[];
  location?: string[];
};

export type SelectionProduct = {
  name: string;
  options: Option[];
};

export type FileResponse = {
  id: string;
  name: string;
  order?: number;
  url: string;
  uploaded_at: string;
};

export type Category = {
  name: string;
};

export type Product = {
  id: number;
  name: string;
  description?: string;
  category: string;
  dimension: {
    width: number;
    length: number;
    height: number;
    unit: string;
  };
  weight: {
    value: number;
    unit: string;
  };
  available: boolean;
  featured: boolean;
  customizable: boolean;
  min_price?: number;
  selections?: SelectionProduct[];
  variant: Variant[];
  images: FileResponse[];
  model?: FileResponse;
};

export type ProductFilter = {
  featured?: boolean;
  customizable?: boolean;
  available?: boolean;
  category?: string;
  offset?: number;
  limit?: number;
  search?: string;
};

export type CustomerAddress = {
  id: number;
  label: string;
  is_primary: boolean;
  contact_name: string;
  contact_phone: string;
  address: string;
  area_id: string;
  province: string;
  city: string;
  district: string;
  postal_code: string;
  note?: string;
};

export type ListAddresses = Array<CustomerAddress>;

export type StoreInformation = {
  name: string;
  phone: string;
  email: string;
  owner: string;
  address: {
    full_address: string;
    area_id: string;
    province: string;
    city: string;
    distruct: string;
    postal_code: string;
    address_note: string;
  };
};

export type Item = {
  sku: string;
  quantity: number;
};

export type PricingRatePayload = {
  address_id: number;
  items: Array<Item>;
};

export type Location = {
  area_id: string;
  name: string;
  province: string;
  city: string;
  district: string;
  postal_code: string;
};

export type ListLocation = Array<Location>;

export type Pricing = {
  company: string;
  courier_name: string;
  courier_code: string;
  courier_service_name: string;
  courier_service_code: string;
  type: string;
  description: string;
  duration: string;
  shipment_duration_range: string;
  shipment_duration_unit: string;
  service_type: string;
  shipping_type: string;
  price: number;
};

export type RateResponse = {
  pricing: Array<Pricing>;
};

export type CartItem = {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  available: boolean;
  image: {
    id: string;
    name: string;
    order: number;
    url: string;
    uploaded_at: string;
  };
  created_at: string;
};

export type DetailPayment = {
  id: string;
  order_id: string;
  status: string;
  type: string;
  bank: string;
  va_number: string;
  order_items: OrderItems;
  courier_company: string;
  shipping_cost: number;
  gross_amount: number;
  expiry_time: string;
  created_at: string;
};

export type OrderItems = Array<OrderItem>;

export type OrderItem = {
  product_sku: string;
  product_name: string;
  product_weight: {
    value: number;
    unit: string;
  };
  product_price: number;
  customizable: boolean;
  quantity: number;
  total_price: number;
};

export type OrderInfo = {
  id: string;
  buyyer: {
    name: string;
    email: string;
    phone: string;
  };
  status: string;
  destination: {
    address: string;
    province: string;
    city: string;
    district: string;
    postal_code: string;
  };
  courier: {
    company_name: string;
    service_type: string;
    tracking_id: string;
  };
  order_items: {
    name: string;
    price: number;
    image: string;
    weight: {
      value: number;
      unit: string;
    };
    customizable: boolean;
    quantity: number;
    total_price: number;
    item_status_history: History[];
  }[];
  total_quantity: number;
  total_weight: {
    value: number;
    unit: string;
  };
  total_product_price: number;
  shipping_cost: number;
  total_cost: number;
  order_history?: History[];
  created_at: string;
  updated_at: null | string;
};

export type History = {
  status: string;
  note: string;
  updated_at: string;
};

export type Bank = "bca" | "bni" | "permata" | "bri";

export type WishlistItem = {
  sku: string;
  name: string;
  price: number;
  available: boolean;
  image: {
    id: string;
    name: string;
    order: number;
    url: string;
    uploaded_at: string;
  };
  created_at: string;
};
