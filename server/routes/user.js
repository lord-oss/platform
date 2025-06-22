router.get('/profile', authMiddleware, async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] }
  });
  res.json(user);
});