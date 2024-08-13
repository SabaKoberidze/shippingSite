import { H3Event } from 'h3';
import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event: H3Event) => {
    const client = await serverSupabaseClient(event);

    const productId = event.context.params?.id as string | undefined;

    if (!productId) {
        return { error: 'Product ID is required' };
    }

    try {
        // Step 1: Retrieve image URLs before deletion
        const { data: product, error: fetchError } = await client
            .from('Products')
            .select('image_urls')
            .eq('id', productId)
            .single();

        if (fetchError) throw fetchError;

        // Step 2: Delete images from storage
        if (product && product.image_urls) {
            for (const imageUrl of product.image_urls) {
                const filePath = imageUrl.replace(`${process.env.SUPABASE_URL}/storage/v1/object/public/`, '');
                const { error: deleteImageError } = await client
                    .storage
                    .from('product-images')
                    .remove([filePath]);

                if (deleteImageError) {
                    console.error('Error deleting image:', deleteImageError);
                    throw deleteImageError;
                }
            }
        }

        // Step 3: Delete the product from the database
        const { error: deleteError } = await client
            .from('Products')
            .delete()
            .eq('id', productId);

        if (deleteError) throw deleteError;

        return { success: true };
    } catch (err: unknown) {
        if (err instanceof Error) {
            return { error: err.message };
        } else {
            return { error: 'An unexpected error occurred' };
        }
    }
});
//todo