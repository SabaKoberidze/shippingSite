import { serverSupabaseClient } from '#supabase/server';
import { serverSupabaseUser } from '#supabase/server';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    const user = await serverSupabaseUser(event);

    const form = new IncomingForm();

    // Wrap form.parse in a Promise
    const parseForm = () =>
        new Promise<{ fields: any; files: any }>((resolve, reject) => {
            form.parse(event.node.req, (err, fields, files) => {
                if (err) return reject(err);
                resolve({ fields, files });
            });
        });

    try {
        const { fields, files } = await parseForm();

        if (!user) {
            throw new Error('User not found');
        }

        const name = fields.name ? fields.name[0] : '';
        const price = fields.price ? parseFloat(fields.price[0]) : 0;
        const description = fields.description ? fields.description[0] : '';
        const forSale = fields.forSale ? fields.forSale == 'true' : false
        console.log(forSale)
        if (!name || !description || isNaN(price)) {
            throw new Error('Invalid input data');
        }

        const productData:any = {
            name,
            price,
            description,
            user_id: user.id,
            forSale
        };

        const { data, error } = await client
            .from('Products')
            .insert(productData)
            .select();

        if (error) {
            throw new Error('Error inserting the data');
        }
        const product: {id: number} = data[0]
        const productId = data && data.length ? product.id : null;
        if (!productId) {
            throw new Error('Failed to retrieve product ID');
        }

        const imageUrls: string[] = [];

        for (const fileKey in files) {
            const fileArray = files[fileKey];
            const fileList = Array.isArray(fileArray) ? fileArray : [fileArray];

            for (const file of fileList) {
                const filePath = file.filepath;
                try {
                    const publicURL = await uploadFile(filePath, productId, client, user);
                    if (publicURL) {
                        imageUrls.push(publicURL);
                    }
                } catch (uploadError) {
                    console.error('Error uploading file:', uploadError);
                }
            }
        }

        // Update the product with image URLs
        const { error: updateError } = await client
            .from('Products')
            .update({ image_urls: imageUrls } as never)
            .eq('id', productId)
            .select();

        if (updateError) {
            console.error('Error updating product with image URLs:', updateError);
            throw new Error(updateError.message);
        }

        return {
            success: true,
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            success: false,
            error: error
        };
    }
});

const uploadFile = async (filePath: string, productId: any, client: any, user:any) => {
    const fileName = path.basename(filePath);
    const fileBuffer = fs.readFileSync(filePath);

    try {
        const { data, error } = await client.storage
            .from('product-images')
            .upload(`products/${productId}/${fileName}`, fileBuffer, {
                cacheControl: '3600',
                upsert: false,
                contentType: 'image/jpeg',
            });

        if (error) {
            console.error('Upload error:', error);
            throw new Error(error.message);
        }
        const fileStoragePath = `products/${productId}/${fileName}`
        const res = await client.storage
            .from('product-images')
            .getPublicUrl(fileStoragePath);

        if (res.error) {
            console.error('Error getting public URL:', res.error);
            throw new Error(res.error.message);
        }

        addMetaData(fileStoragePath, client, user)

        return res.data.publicUrl;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};
async function addMetaData(fileStoragePath:string, client:any, user: any) {
    const metadata = {
        user_id: user.id,
        file_path: fileStoragePath
    }
    const { data, error } = await client
        .from('file_metadata')
        .insert(metadata)               
        .select()
    console.log(data)
    console.log(error)
}

