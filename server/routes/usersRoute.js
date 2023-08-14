const {
    login,
    register,
    getAllUsers,
    setAvatar,
  } = require("../controller/usersController");
  
  const router = require("express").Router();
  
  router.post("/login", login);
  router.post("/register", register);
  router.post("/setavatar/:id", setAvatar);
  router.get('/allusers/:id', getAllUsers);
 
  
  module.exports = router;