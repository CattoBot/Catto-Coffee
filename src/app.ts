import './lib/setup';
import app from './lib/client';

const main = async () => {
	try {
		app.logger.info('Logging in');
		await app.login();
		app.logger.info('logged in');
	} catch (error) {
		app.logger.fatal(error);
		await app.destroy();
		process.exit(1);
	}
};

void main();
