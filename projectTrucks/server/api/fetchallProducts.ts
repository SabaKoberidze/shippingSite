// server/api/fetchUserProducts.ts

import { H3Event } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event: H3Event) => {
    const client = await serverSupabaseClient(event)
    // Extract pagination parameters from query
    const url = new URL(event.node.req.url || '', `http://${event.node.req.headers.host}`)
    const params = new URLSearchParams(url.search)

    const page = parseInt(params.get('page') || '1', 10)
    const limit = parseInt(params.get('limit') || '20', 10)
    
    console.log('Page:', page, 'Limit:', limit)

    const offset = (page - 1) * limit

    try {
        const { data, error } = await client
            .from('Products')
            .select('*')
            .range(offset, offset + limit - 1) // Fetch records with pagination
        console.log(data)
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
