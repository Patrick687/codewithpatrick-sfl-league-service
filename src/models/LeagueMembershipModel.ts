import { BelongsToGetAssociationMixin, DataTypes, Model } from 'sequelize';
import sequelize from '../config/dbConfig';
import { LeagueMembership as ILeagueMembership } from '../types/LeagueServiceCoreEntities';
import League from './LeagueModel';
import { UUID } from 'crypto';

interface LeagueMembershipCreationAttributes extends Omit<ILeagueMembership, 'id' | 'createdAt' | 'updatedAt'> {}

class LeagueMembershipModel extends Model<ILeagueMembership, LeagueMembershipCreationAttributes> implements ILeagueMembership {
    public id!: UUID;
    public userId!: UUID;
    public leagueId!: UUID;
    public role!: 'creator' | 'admin' | 'member';
    public joinedAt!: Date;
    public status!: 'active' | 'inactive';

    public getLeague!: BelongsToGetAssociationMixin<League>;
}

LeagueMembershipModel.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    leagueId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: League,
            key: 'id',
        },
    },
    role: {
        type: DataTypes.ENUM('creator', 'admin', 'member'),
        allowNull: false,
    },
    joinedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
    },
}, {
    sequelize,
    modelName: 'LeagueMembership',
    tableName: 'league_memberships',
    timestamps: true,
})

export default LeagueMembershipModel;