import { supabase } from '@/lib/supabase'

// ─── Auth Service (Supabase Auth) ──────────────────────────────────────────

export const authService = {
  /**
   * Đăng ký bằng email + password
   */
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw new Error(error.message)
    return data
  },

  /**
   * Đăng nhập bằng email + password
   */
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw new Error(error.message)
    return data
  },

  /**
   * Đăng xuất
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  },

  /**
   * Lấy session hiện tại
   */
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw new Error(error.message)
    return data.session
  },

  /**
   * Lấy user hiện tại
   */
  getUser: async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) throw new Error(error.message)
    return user
  },
}
