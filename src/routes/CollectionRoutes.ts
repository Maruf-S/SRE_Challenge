import { Router } from 'express';
import CollectionController from '../controllers/CollectionController';
import { asyncMiddleware } from '../middlewares/asyncHandler';
import userAuth from '../middlewares/userAuth';
import { CollectionsValidator } from '../validators/collectionsValidator';

class CollectionRoutes {
  router = Router();
  collectionController = new CollectionController();
  collectionValidator = new CollectionsValidator();
  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    /**
     * @swagger
     * /api/collections/:
     *   get:
     *     security:
     *        - bearerAuth: []
     *     summary: Get All Collections With The Tasks and SubTasks
     *     tags: [Collections]
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Collections
     */
    this.router
      .route('/')
      .get(
        userAuth,
        asyncMiddleware(this.collectionController.getCollectionsWithTasks)
      );

    /**
     * @swagger
     * /api/collections/favorite:
     *   post:
     *     security:
     *        - bearerAuth: []
     *     summary: Favorite A collection
     *     tags: [Collections]
     *     requestBody:
     *      required: true
     *      content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  required:
     *                      - collectionId
     *                      - favorite
     *                  properties:
     *                      collectionId:
     *                          type: string
     *                      favorite:
     *                          type: boolean
     *     responses:
     *       401:
     *         description: Unauthorized
     *       201:
     *         description: Status changed successfuly
     */
    this.router
      .route('/favorite')
      .post(
        userAuth,
        this.collectionValidator.validateFavorite(),
        asyncMiddleware(this.collectionController.favoriteCollection)
      );
  }
}
export default new CollectionRoutes().router;
