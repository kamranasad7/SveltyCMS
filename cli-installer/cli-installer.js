import { intro, outro, isCancel, cancel } from '@clack/prompts';
import pc from 'picocolors';

// Components
import { startOrInstallPrompt } from './startOrInstallPrompt.js';
import { configurationPrompt } from './configuration.js';
import { startProcess } from './startProcess.js';

export const Title = () => {
	// Clear the terminal
	console.clear();
	// Welcome message
	return intro(`${pc.bgRed(pc.white(pc.bold(' Welcome to SveltyCMS CLI installer! ')))}`);
};

// Define more prompts here for different configuration sections
export const cancelOperation = async () => {
	cancel('Operation cancelled.');
	console.clear();
	await main(); // Restart the configuration process
	return;
};

export async function main() {
	// Start installer
	const projectStart = await startOrInstallPrompt();

	if (isCancel(projectStart)) {
		cancelOperation();
	}

	// Handle user input
	if (projectStart === 'install') {
		const projectConfigure = await configurationPrompt();

		if (isCancel(projectConfigure)) {
			cancelOperation();
		}
	} else if (projectStart === 'start') {
		const projectstartProcess = await startProcess();

		if (isCancel(projectstartProcess)) {
			cancelOperation();
		}
	} else if (projectStart === 'exit') {
		outro('Thank you for using SveltyCMS CLI Installer.');
		process.exit(0);
	} else {
		console.log('Invalid choice.');
	}
}

// Render the main function
main();