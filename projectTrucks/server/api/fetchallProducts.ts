// server/api/fetchUserProducts.ts

import { H3Event } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event: H3Event) => {
    const client = await serverSupabaseClient(event)
    
    // Extract pagination parameters from query
    const page = parseInt(event.context.query.page as string) || 1
    const limit = parseInt(event.context.query.limit as string) || 20

    const offset = (page - 1) * limit

    try {
        const { data, error } = await client
            .from('Products')
            .select('*')
            .range(offset, offset + limit - 1) // Fetch records with pagination

        if (error) throw error

        let products: Product[] = data
        const sanitizedData = products.map(({ user_id, ...rest }) => rest);
    
        return { data: sanitizedData }
    } catch (err: unknown) {
        if (err instanceof Error) {
            return { error: err.message }
        } else {
            return { error: 'An unexpected error occurred' }
        }
    }
})

type Product = {
    id: number,
    name: string,
    price: number,
    description: string,
    created_at: number,
    user_id: string
}
