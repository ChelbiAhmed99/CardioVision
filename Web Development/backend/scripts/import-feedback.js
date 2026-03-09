import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Feedback from '../models/sql/feedback.model.js';
import sequelize from '../db/db.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CSV is in the root of CardioVision, which is two levels up from this script
// Wait, based on list_dir, CSV is at /home/choubi/Desktop/CardioVision/Fillout Form 1 results.csv
// Web Portal is at /home/choubi/Desktop/CardioVision/Web Portal
// Script is at /home/choubi/Desktop/CardioVision/Web Portal/backend/scripts/import-feedback.js
const csvPath = path.resolve(__dirname, '../../../Fillout Form 1 results.csv');

async function importFeedback() {
    try {
        await sequelize.sync();
        const data = fs.readFileSync(csvPath, 'utf8');
        const lines = data.split('\n');

        // Skip header
        const rows = lines.slice(1).filter(line => line.trim() !== '');

        let importedCount = 0;

        for (const row of rows) {
            // Very basic CSV parser to handle quotes
            const columns = [];
            let current = '';
            let inQuotes = false;

            for (let i = 0; i < row.length; i++) {
                if (row[i] === '"') {
                    inQuotes = !inQuotes;
                } else if (row[i] === ',' && !inQuotes) {
                    columns.push(current);
                    current = '';
                } else {
                    current += row[i];
                }
            }
            columns.push(current);

            if (columns.length < 14) continue;

            const [
                submissionId,
                lastUpdated,
                submissionStarted,
                status,
                currentStep,
                profile,
                experienceLevel,
                familiarityEF,
                familiarityGLS,
                usefulness,
                easeOfUse,
                interestInUse,
                suggestions,
                email
            ] = columns;

            await Feedback.upsert({
                submissionId,
                lastUpdated,
                profile,
                experienceLevel,
                familiarityEF,
                familiarityGLS,
                usefulness: usefulness?.trim(),
                easeOfUse: easeOfUse?.trim(),
                interestInUse: interestInUse?.trim(),
                suggestions,
                email
            });
            importedCount++;
        }

        console.log(`Successfully imported ${importedCount} feedback entries.`);
        process.exit(0);
    } catch (error) {
        console.error('Error importing feedback:', error);
        process.exit(1);
    }
}

importFeedback();
