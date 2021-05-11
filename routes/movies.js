const router = require('express').Router();

const { validateCreateMovie, validateDeleteMovie } = require('../middlewares/validatons');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', validateCreateMovie, createMovie);
router.delete('/:_id', validateDeleteMovie, deleteMovie);

module.exports = router;
