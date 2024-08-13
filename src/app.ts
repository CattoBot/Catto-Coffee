import './lib/setup';
import { ApplicationClient } from './app/client';

const main = async () => {
	const client = new ApplicationClient();
	try {
		client.logger.info('Logging in');
		await client.login();
		client.logger.info('Logged in');
	} catch (error) {
		client.logger.fatal(error);
		await client.destroy();
		process.exit(1);
	}
}

void main()