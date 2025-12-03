import supabase from '../config/supabase.js';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    req.user = {
      user_id: user.id,
      email: user.email
    };

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export default authMiddleware;