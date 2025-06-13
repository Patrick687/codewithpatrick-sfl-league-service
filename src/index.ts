import './models/initModels';
import { connectToDatabase } from "./config/dbConfig";
import express from 'express';
import serviceConfig from './config/serviceConfig';
import helmet from 'helmet';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerOptions from './config/swagger';
import swaggerUi from 'swagger-ui-express';
import leagueRoutes from './routes/index';

const app = express();
const port = serviceConfig.SERVER_PORT;

app.use(helmet());
app.use(cors());
app.use(express.json());

const specs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Debug endpoint to see the generated OpenAPI spec
app.get('/api-spec', (req, res) => {
    res.json(specs);
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'league-service',
        timestamp: new Date().toISOString(),
    });
});

app.use('/leagues', leagueRoutes);

async function startService() {
    try {
        await connectToDatabase();
        app.listen(port, () => {
            console.log(`🚀 League Service running on port ${port}`);
            console.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
        });
    } catch(error) {
        console.error('❌ Failed to start league service:', error);
        process.exit(1);
    }
}

startService();