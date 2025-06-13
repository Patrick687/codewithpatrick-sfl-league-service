import { BelongsToGetAssociationMixin, DataTypes, Model } from 'sequelize';
import sequelize from '../config/dbConfig';
import { LeagueInvitation as ILeagueInvitation } from '../types/LeagueServiceCoreEntities';
import League from './LeagueModel';
import { UUID } from 'crypto';

interface LeagueInvitationCreationAttributes extends Omit<ILeagueInvitation, 'id' | 'createdAt'> { }

class LeagueInvitationModel extends Model<ILeagueInvitation, LeagueInvitationCreationAttributes> implements ILeagueInvitation {
    public id!: UUID;
    public leagueId!: UUID;
    public invitedBy!: UUID;
    public invitedEmail!: string;
    public status!: 'pending' | 'accepted' | 'rejected' | 'expired';
    public expiresAt!: Date;
    public readonly createdAt!: Date;

    public getLeague!: BelongsToGetAssociationMixin<League>;
}

LeagueInvitationModel.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    leagueId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: League,
            key: 'id',
        },
    },
    invitedBy: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    invitedEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'expired'),
        defaultValue: 'pending',
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'LeagueInvitation',
    tableName: 'league_invitations',
    timestamps: true,
    updatedAt: false,
});

export default LeagueInvitationModel;