import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import apicache from 'apicache';
import rateLimit from 'express-rate-limit';

import { errorLogger, validateToken } from './middleware';
import musicians from './musicians';
import schema from './schema';

const app = express();

// MIDDLEWARE
// Adding logging
app.use(morgan('dev'));

// Add sane default security settings
app.use(helmet());

// Handle JSON
app.use(express.json());

// Configure rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// Configure caching
const cache = apicache.middleware;

// Routes
const router = express.Router();

router.get('/', cache('30 minutes'), (req, res) => {
  req.apicacheGroup = 'all';
  res.json(musicians);
});

router.get('/:id', cache('30 minutes'), (req, res, next) => {
  try {
    const ID = req.params.id;
    req.apicacheGroup = ID;

    if (musicians[ID]) {
      res.status(200).send(musicians[ID]);
    } else {
      // If feel like this should be 404
      res.status(400).send({
        errorMessage: 'Musician does not exist',
      });
    }
  } catch (e) {
    next(new Error('Bad GET Request'));
  }
});

router.put('/:id', validateToken, (req, res, next) => {
  try {
    const ID = req.params.id;

    // Update in memory, if it exists
    if (musicians[ID]) {
      // Merge update with existing musician data
      const update = schema.validateSync({
        ...musicians[ID],
        ...req.body,
      });

      musicians[ID] = update;
    } else {
      musicians[ID] = schema.validateSync(req.body);
    }

    // Clear all cache
    apicache.clear(ID);
    apicache.clear('all');

    res.send({
      id: ID,
    });
  } catch (e) {
    next(new Error(`Bad PUT request: ${e.message}`));
  }
});

// Catch all errors
// Allows for reusable error responses
router.use(errorLogger);

app.use('/musicians', apiLimiter, router);

export default app;
