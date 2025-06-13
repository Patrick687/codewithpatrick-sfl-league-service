export interface League {
  id: string;
  name: string;
  description: string | null;
  creatorId: string;
  seasonNumber: number;
//   settings: LeagueSettings;
//   status: 'draft' | 'active' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface LeagueSettings {
  maxMembers: number;
  isPrivate: boolean;
  inviteCode?: string;
  //scoringRules: ScoringRules;
}

// export interface ScoringRules {
//   correctPick: number;
//   incorrectPick: number;
//   bonusPoints?: {
//     perfectWeek?: number;
//     streakBonus?: number;
//   };
// }

export interface LeagueMembership {
  id: string;
  leagueId: string;
  userId: string;
  role: 'creator' | 'admin' | 'member';
  joinedAt: Date;
  status: 'active' | 'inactive';
}

export interface LeagueInvitation {
  id: string;
  leagueId: string;
  invitedBy: string;
  invitedEmail: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  expiresAt: Date;
  createdAt: Date;
}

export interface CreateLeagueRequest {
  name: string;
  description?: string;
  seasonNumber: number;
//   settings: {
//     isPrivate: boolean;
//     // scoringRules: ScoringRules;
//   };
}

export interface JoinLeagueRequest {
  inviteCode?: string;
}

export interface InviteUserRequest {
  email: string;
}