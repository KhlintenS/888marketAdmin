import { uploadImages } from "@/utils/image";
import supabase from "../config/supabase";

interface Order {
  title: string;
  description: string;
  price: string;
  currency: string;
  category: { name: string; parent: number };
  categoryId: number;
  city: { name: string; region: string };
  cityId: number;
}

export const getOrders = async (status: string = "All") => {
  try {
    const query = supabase
      .from("orders")
      .select(
        `
          id,
          status,
          created_at,
          detail,
          customer:customers (
            name,
            email,
            img_url
          )
        `
      )
      .order("created_at", { ascending: false });

    const { data, error } =
      status && status.toLowerCase() !== "all"
        ? await query.eq("status", status)
        : await query;

    if (error) throw new Error(error?.message);

    return data;
  } catch (err) {
    console.error("Error fetching Orders:", err);
    throw err;
  }
};

export const createOrder = async (Order: any) => {
  try {
    const {
      name,
      price,
      stock,
      imgs,
      category: { id: category_id },
      subcategory: { id: subcategory_id },
      description,
    } = Order;
    const img_urls = await uploadImages(imgs, "orders");
    const { data, error } = await supabase.from("Orders").insert([
      {
        name,
        price,
        stock,
        img_urls,
        category_id,
        subcategory_id,
        description,
      },
    ]);
    if (error) throw new Error(error.message);
    return data;
  } catch (err: any) {
    console.error(err.message);
  }
};

export const deleteOrder = async (id: string) => {
  try {
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) throw new Error(error?.message);
    return true;
  } catch (err) {
    console.error("Error deleting Order:", err);
    return false;
  }
};

export const updateOrder = async (Order: any) => {
  try {
    const {
      id,
      name,
      price,
      stock,
      imgs,
      category: { id: category_id },
      subcategory: { id: subcategory_id },
      description,
    } = Order;
    const img_urls = await uploadImages(imgs, "orders");
    const { data, error } = await supabase
      .from("orders")
      .update({
        name,
        price,
        stock,
        img_urls,
        category_id,
        subcategory_id,
        description,
      })
      .eq("id", id);
    if (error) throw new Error(error?.message);
    return data;
  } catch (err) {
    console.error("Error updating order:", err);
    return false;
  }
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  const { error } = await supabase
    .from("orders")
    .update({ status: status.toLowerCase() })
    .eq("id", orderId);
  if (error) throw new Error(error.message);
  return true;
};
// };

// export const updateOrderStatus = async (orderId: number, status: string) => {
//   const { error } = await supabase
//     .from("orders")
//     .update({ status: status.toLowerCase() })
//     .eq("id", orderId);
//   if (error) throw new Error(error.message);
//   return true;
// };
