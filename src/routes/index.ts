import { Router } from 'express';
import { LeagueController } from '../controller/leagueController';
import { authenticate } from '../middleware/authMiddleware';
import { validateCreateLeague } from '../validators';
import { validateLeagueParams } from '../validators/requests/validateLeagueParams';

const router = Router();
const leagueController = new LeagueController();

/**
 * @swagger
 * components:
 *   schemas:
 *     League:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         creatorId:
 *           type: string
 *           format: uuid
 *         settings:
 *           type: object
 *         status:
 *           type: string
 *           enum: [draft, active, completed]
 */

/**
 * @swagger
 * /leagues:
 *   post:
 *     summary: Create a new league
 *     tags: [Leagues]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - settings
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               settings:
 *                 type: object
 *     responses:
 *       201:
 *         description: League created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, validateCreateLeague, leagueController.createLeague.bind(leagueController));

/**
 * @swagger
 * /leagues:
 *   get:
 *     summary: Get user's leagues
 *     tags: [Leagues]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's leagues
 */
router.get('/', authenticate, leagueController.getUserLeagues.bind(leagueController));

/**
 * @swagger
 * /leagues/{id}:
 *   get:
 *     summary: Get league details
 *     tags: [Leagues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: League details
 *       404:
 *         description: League not found
 */
router.get('/:id', authenticate, validateLeagueParams, leagueController.getLeague.bind(leagueController));

/**
 * @swagger
 * /leagues/{id}/join:
 *   post:
 *     summary: Join a league
 *     tags: [Leagues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inviteCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully joined league
 */
router.post('/:id/join', authenticate, validateLeagueParams, leagueController.joinLeague.bind(leagueController));

/**
 * @swagger
 * /leagues/{id}/members:
 *   get:
 *     summary: Get league members
 *     tags: [Leagues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of league members
 */
router.get('/:id/members', authenticate, validateLeagueParams, leagueController.getLeagueMembers.bind(leagueController));

export default router;