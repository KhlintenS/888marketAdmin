import supabase from "@/lib/config/supabase";

export const uploadImages = async (images: any[], bucket: string) => {
  const uploadedUrls: string[] = [];
  console.log("images", images);

  for (const image of images) {
    try {
      const url = await uploadImage(image?.file, bucket);
      uploadedUrls.push(url);
    } catch (error) {
      console.error(`❌ Failed to upload ${image.name}:`, error);
      // You can choose to skip or push null
      // uploadedUrls.push(null);
    }
  }

  return uploadedUrls;
};

export const uploadImage = async (
  file: any,
  bucket: string
): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const filePath = `bucket/${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${fileExt}`;

  try {
    const { error } = await supabase.storage
      .from(bucket) // 🔁 Replace with your actual bucket name
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return publicUrl;
  } catch (err) {
    console.error("Upload error:", err);
    throw err;
  }
};

export const deleteImage = async (imgUrl: string, bucket: string) => {
  // Remove the URL prefix to get the path
  const baseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL +
    "/storage/v1/object/public/" +
    bucket +
    "/";
  console.log("Deleting image with URL:", imgUrl);
  const filePath = imgUrl.replace(baseUrl, "");
  console.log("Deleting image at path:", filePath);

  try {
    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Delete image error:", err);
    throw err;
  }
};
