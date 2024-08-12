import { serverSupabaseClient } from '#supabase/server'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const user = await serverSupabaseUser(event)
    const body = await readBody(event)
    if(user){
        body.user_id = user.id
        try{
            await client
            .from('Products')
            .insert(body)
        } catch(err){
            return err
        }
    }
    else{
        return 'user not found'
    }
  })