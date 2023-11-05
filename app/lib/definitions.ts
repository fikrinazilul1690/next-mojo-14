export type APIResponse<T, ErrorResponse> = {
  code: number;
  status: string;
  metadata?: APIMetadata;
  data: T;
  errors: ErrorResponse;
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
  uploaded_at: Date;
};

export type LoginResponse = {
  session_id: string;
  access_token: string;
  access_token_expires_at: string;
  refresh_token: string;
  refresh_token_expires_at: string;
  user: User;
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
  variant_name: string;
  price: number;
};

export type CreateProductRequest = {
  name?: string;
  description?: string;
  category?: string;
  dimension?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: 'cm' | 'dm';
  };
  weight?: {
    value?: number;
    unit?: 'kg' | 'gr';
  };
  available?: boolean;
  featured?: boolean;
  customizable?: boolean;
  price?: number;
  stock?: number;
  images?: UploadImageRequest[];
  model?: {
    upload_id?: string;
  };
  selections?: VariantSelection[];
  variants?: Variant[];
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
  gross_amount: number;
  expery_time: string;
  created_at: string;
};

export type Bank = 'bca' | 'bni' | 'permata' | 'bri';

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
