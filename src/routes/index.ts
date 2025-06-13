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
 *     LeagueResponse:
 *       type: object
 *       properties:
 *         leagueResponse:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               league:
 *                 $ref: '#/components/schemas/League'
 *               userRole:
 *                 type: string
 *                 enum: [creator, member]
 *     LeagueMember:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         role:
 *           type: string
 *           enum: [creator, member]
 *         joinedAt:
 *           type: string
 *           format: date-time
 *     CreateLeagueRequest:
 *       type: object
 *       required:
 *         - name
 *         - settings
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *         description:
 *           type: string
 *           maxLength: 500
 *         settings:
 *           type: object
 *           properties:
 *             maxPlayers:
 *               type: integer
 *               minimum: 2
 *               maximum: 20
 *             scoring:
 *               type: string
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *         details:
 *           type: array
 *           items:
 *             type: object
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
 *             $ref: '#/components/schemas/CreateLeagueRequest'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeagueResponse'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/League'
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LeagueMember'
 */
router.get('/:id/members', authenticate, validateLeagueParams, leagueController.getLeagueMembers.bind(leagueController));

export default router;