import { serverSupabaseClient } from '#supabase/server'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const user = await serverSupabaseUser(event)
    if(user){
        try{
            const { data, error } = await client
                        .from('Products')
                        .select('*')
                        .eq('user_id', user.id)
            return {
                data
            }
        }catch(err){
            return err
        }
    }
    else{
        return 'user not found'
    }
  })