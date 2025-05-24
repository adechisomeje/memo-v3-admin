import { axiosClient } from ".";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type Vendor = {
  _id: string;
  businessName: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

type Product = {
  _id: string;
  name: string;
  images: string[];
  productType: string;
};

type ProductDetails = {
  size: string;
  flavours: string[];
  topping: string;
  layers: number;
};

type DeliveryAddress = {
  address: string;
  city: string;
  state: string;
  country: string;
};

type Order = {
  _id: string;
  user: User;
  vendor: Vendor;
  product: Product;
  productCategory: string;
  productDetails: ProductDetails;
  amount: number;
  deliveryAddress: DeliveryAddress;
  deliveryDate: string;
  recipientName: string;
  recipientPhone: string;
  note: string;
  status: string;
  additionalProducts: [];
  deliveryFee: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  paymentReference: string;
};

type OrdersResponse = {
  statusCode: number;
  data: Order[];
  total: number;
  page: number;
  limit: number;
  message: string;
};

export async function getAllOrders(page: number = 1) {
  const response = await axiosClient.get<OrdersResponse>(
    `/admin/orders?page=${page}`
  );
  return response.data;
}
