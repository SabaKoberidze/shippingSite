import { H3Event } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event: H3Event) => {
    const client = await serverSupabaseClient(event)
    
    const productId = event.context.params?.id as string | undefined

    if (!productId) {
        return { error: 'Product ID is required' }
    }

    try {
        const { error } = await client
            .from('Products')
            .delete()
            .eq('id', productId)

        if (error) throw error

        return { success: true }
    } catch (err: unknown) {
        if (err instanceof Error) {
            return { error: err.message }
        } else {
            return { error: 'An unexpected error occurred' }
        }
    }
})
