import { H3Event } from 'h3';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event: H3Event) => {
    const client = await serverSupabaseClient(event);
    const bucketName = 'product-images';
    const productId = event.context.params?.id as string | undefined;
    const user = await serverSupabaseUser(event);

    if (!user) {
        return { error: 'User not authenticated' };
    }

    if (!productId) {
        return { error: 'Product ID is required' };
    }

    try {
        const { data: product, error: fetchError } = await client
            .from('Products')
            .select('image_urls')
            .eq('id', productId)
            .single();

        if (fetchError) throw fetchError;
        if (product && Array.isArray(product.image_urls)) {
            const urls: string[] = product.image_urls;

            for (const url of urls) {
                const startIndex = url.indexOf('product-images/') + 'product-images/'.length;
                const filePath = url.substring(startIndex);

                // Verify the user has permission to delete this file
                const { data: metadata, error: metaError } = await client
                    .from('file_metadata')
                    .select('*')
                    .eq('file_path', filePath)
                    .eq('user_id', user.id)
                    .single();
                if (metaError || !metadata) {
                    console.error('Permission denied or file not found:', metaError);
                    continue;
                }

                // Delete the file from the storage
                const { data, error: deleteError } = await client
                    .storage
                    .from(bucketName)
                    .remove([filePath]);

                if (deleteError) {
                    console.error('Error deleting file:', deleteError);
                } else {
                    console.log('Deleted file:', filePath);
                    // Delete the corresponding metadata
                    const { error: metaDeleteError } = await client
                        .from('file_metadata')
                        .delete()
                        .eq('file_path', filePath)
                        .eq('user_id', user.id);

                    if (metaDeleteError) {
                        console.error('Error deleting metadata:', metaDeleteError);
                    } else {
                        console.log('Deleted metadata for file:', filePath);
                    }
                }
            }
        } else {
            console.log('No image URLs found or image_urls is not an array.');
        }

        const { error: deleteProductError } = await client
            .from('Products')
            .delete()
            .eq('id', productId);

        if (deleteProductError) throw deleteProductError;
        return { success: true };
    } catch (err) {
        console.error('Error:', err);
        return { error: 'An error occurred during deletion' };
    }
});
