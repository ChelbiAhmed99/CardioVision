import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const FLASK_URL = process.env.FLASK_API_URL || "http://127.0.0.1:8080";
console.log(chalk.cyan(`\n🔍 Connectivity Test: ${FLASK_URL}`));

try {
    const url = new URL(FLASK_URL);
    const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: '/health', // Assuming a health check or index exists
        method: 'GET',
        timeout: 5000
    };

    console.log(chalk.dim(`Checking ${options.hostname}:${options.port}...`));

    const req = http.request(options, (res) => {
        console.log(chalk.green(`✅ Success! Received status: ${res.statusCode}`));
        process.exit(0);
    });

    req.on('error', (err) => {
        console.error(chalk.red('\n❌ Connection Failed!'));
        console.error(`${chalk.bold('Error Code:')} ${err.code}`);
        console.error(`${chalk.bold('Message:')}    ${err.message}`);

        if (err.code === 'ENOTFOUND') {
            console.log(chalk.yellow('\n💡 Troubleshooting Tip:'));
            console.log(`DNS resolution failed for "${err.hostname}".`);
            console.log(`If on Railway, ensure the target service has a valid Internal Domain.`);
            console.log(`Current URL set in .env: ${FLASK_URL}`);
        }
        process.exit(1);
    });

    req.on('timeout', () => {
        console.error(chalk.red('\n❌ Connection Timed Out after 5s'));
        req.destroy();
        process.exit(1);
    });

    req.end();
} catch (err) {
    console.error(chalk.red(`\n❌ Invalid URL: ${FLASK_URL}`));
    console.error(err.message);
    process.exit(1);
}
