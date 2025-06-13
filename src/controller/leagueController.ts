import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { CreateLeagueRequest, JoinLeagueRequest, InviteUserRequest } from '../types/LeagueServiceCoreEntities';
import { Op } from 'sequelize';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import LeagueModel from '../models/LeagueModel';
import LeagueMembershipModel from '../models/LeagueMembershipModel';
import leagueSettings from '../config/leagueSettings';

export class LeagueController {
    // Create a new league
    async createLeague(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { name, description, seasonNumber }: CreateLeagueRequest = req.body;
            const creatorId = req.user!.id;

            // Generate invite code if private
            //   const inviteCode = settings.isPrivate ? 
            //     Math.random().toString(36).substring(2, 8).toUpperCase() : undefined;

            const league = await LeagueModel.create({
                name,
                seasonNumber,
                description,
                creatorId,
            });

            const leagueMembership = await league.createMembership({
                userId: creatorId,
                role: 'creator',
                joinedAt: new Date(),
                status: 'active',
                leagueId: league.id,
            });

            res.status(201).json({
                message: 'League created successfully',
                league,
            });

        } catch (error) {
            console.error('Error creating league:', error);
            res.status(500).json({ error: 'Failed to create league' });
        }
    }

    // Get user's leagues
    async getUserLeagues(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;

            const memberships = await LeagueMembershipModel.findAll({
                where: {
                    userId,
                    status: 'active',
                }
            });

            const leagueResponse: {
                league: LeagueModel;
                userRole: LeagueMembershipModel['role'];
            }[] = [];
            for (const membership of memberships) {
                const league = await membership.getLeague();
                leagueResponse.push({
                    league: league,
                    userRole: membership.role,
                });
            }


            res.json({ leagueResponse });
        } catch (error) {
            console.error('Error fetching user leagues:', error);
            res.status(500).json({ error: 'Failed to fetch leagues' });
        }
    }

    // Get league details
    async getLeague(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user!.id;

            const league = await LeagueModel.findByPk(id);
            if (!league) {
                res.status(404).json({ error: 'League not found' });
                return;
            }

            const userMembership = (await league.getMemberships()).find(m => m.userId === userId);

            if (!userMembership) {
                res.status(403).json({ error: 'Access denied. You are not a member of this league.' });
                return;
            }

            res.json({
                league: {
                    ...league.toJSON(),
                    userRole: userMembership.role,
                },
            });
        } catch (error) {
            console.error('Error fetching league:', error);
            res.status(500).json({ error: 'Failed to fetch league' });
        }
    }

    // Join a league
    async joinLeague(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { inviteCode }: JoinLeagueRequest = req.body;
            const userId = req.user!.id;

            const league = await LeagueModel.findByPk(id);

            if (!league) {
                res.status(404).json({ error: 'League not found' });
                return;
            }
            const leagueMemberships = await league.getMemberships();

            // Check if already a member
            const existingMembership = leagueMemberships.find(m => m.userId === userId);

            if (existingMembership) {
                res.status(400).json({ error: 'You are already a member of this league' });
                return;
            }

            // Check capacity
            if (leagueMemberships && leagueMemberships.length >= leagueSettings.maxLeagueSize) {
                res.status(400).json({ error: 'League is full' });
                return;
            }

            // Check invite code for private leagues
            // if (league.settings.isPrivate) {
            //     if (!inviteCode || inviteCode !== league.settings.inviteCode) {
            //         res.status(400).json({ error: 'Invalid invite code' });
            //         return;
            //     }
            // }

            // Add user to league

            await league.createMembership({
                userId,
                role: 'member',
                joinedAt: new Date(),
                status: 'active',
                leagueId: league.id,
            });

            res.json({ message: 'Successfully joined the league' });
        } catch (error) {
            console.error('Error joining league:', error);
            res.status(500).json({ error: 'Failed to join league' });
        }
    }

    // Get league members
    async getLeagueMembers(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user!.id;

            // Verify user is a member
            const userMembership = await LeagueMembershipModel.findOne({
                where: { leagueId: id, userId, status: 'active' },
            });

            if (!userMembership) {
                res.status(403).json({ error: 'Access denied' });
                return;
            }

            const memberships = await LeagueMembershipModel.findAll({
                where: { leagueId: id, status: 'active' },
                attributes: ['id', 'userId', 'role', 'joinedAt'],
                order: [['joinedAt', 'ASC']],
            });

            res.json({ members: memberships });
        } catch (error) {
            console.error('Error fetching league members:', error);
            res.status(500).json({ error: 'Failed to fetch league members' });
        }
    }
}