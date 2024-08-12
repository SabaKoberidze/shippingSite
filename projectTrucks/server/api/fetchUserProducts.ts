import { serverSupabaseClient } from '#supabase/server'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const user = await serverSupabaseUser(event)
    
    if (user) {
        try {
            const { data, error } = await client
                        .from('Products')
                        .select('*')
                        .eq('user_id', user.id)

            if (data) {
                let products: Product[] = data
                const sanitizedData = products.map(({ user_id, ...rest }) => rest);
            
                return { data: sanitizedData }
            } else {
                return error
            }
        } catch (err) {
            return err
        }
    } else {
        return 'user not found'
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
