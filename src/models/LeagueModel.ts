
import { DataTypes, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyRemoveAssociationMixin, Model, Optional } from 'sequelize';
import { League as ILeague } from '../types/LeagueServiceCoreEntities';
import sequelize from '../config/dbConfig';
import LeagueMembershipModel from './LeagueMembershipModel';
import LeagueInvitationModel from './LeagueInvitationModel';
import { UUID } from 'crypto';

interface LeagueCreationAttributes extends Optional<ILeague, 'id' | 'updatedAt' | 'createdAt'> {}

class LeagueModel extends Model<ILeague, LeagueCreationAttributes> implements ILeague {
    public id!: UUID;
    public name!: string;
    public description!: string | null;
    public creatorId!: UUID;
    public seasonNumber!: number;
    public createdAt!: Date;
    public updatedAt!: Date;

    public getMemberships!: HasManyGetAssociationsMixin<LeagueMembershipModel>;
    public createMembership!: HasManyCreateAssociationMixin<Omit<LeagueMembershipModel, 'leagueId'>>;
    public removeMembership!: HasManyRemoveAssociationMixin<LeagueCreationAttributes, string> //TODO What should this be
    public getInvitations!: HasManyGetAssociationsMixin<LeagueInvitationModel>;
    public createInvitation!: HasManyCreateAssociationMixin<LeagueInvitationModel>;
    public removeInvitation!: HasManyRemoveAssociationMixin<LeagueInvitationModel, string>;
}

LeagueModel.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        creatorId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        seasonNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,   
        },
    },
    {
        sequelize,
        modelName: 'League',
        tableName: 'leagues',
        timestamps: true,
    }
);

export default LeagueModel;