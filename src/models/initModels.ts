import LeagueModel from './LeagueModel';
import LeagueMembershipModel from './LeagueMembershipModel';
import LeagueInvitationModel from './LeagueInvitationModel';

// Define associations
LeagueModel.hasMany(LeagueMembershipModel, { foreignKey: 'leagueId', as: 'memberships' });
LeagueModel.hasMany(LeagueInvitationModel, { foreignKey: 'leagueId', as: 'invitations' });

LeagueMembershipModel.belongsTo(LeagueModel, { foreignKey: 'leagueId', as: 'league' });
LeagueInvitationModel.belongsTo(LeagueModel, { foreignKey: 'leagueId', as: 'league' });

export {
  LeagueModel,
  LeagueMembershipModel,
  LeagueInvitationModel,
};