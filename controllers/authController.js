import supabase from '../config/supabase.js';

const authController = {
  // Get user profile
  getProfile: async (req, res) => {
    try {
      const { user_id } = req.user;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user_id)
        .single();

      if (error) throw error;

      res.json({
        success: true,
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const { user_id } = req.user;
      const { name, email } = req.body;

      const { data, error } = await supabase
        .from('profiles')
        .update({ name, email, updated_at: new Date() })
        .eq('id', user_id)
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

export default authController;