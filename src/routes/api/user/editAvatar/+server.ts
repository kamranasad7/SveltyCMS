// Import dependencies
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import to from 'await-to-js';
import { Buffer } from 'buffer';
import { User } from '$lib/models/user-model';
import sharp from 'sharp';

// Define a function to handle HTTP POST requests
export const POST: RequestHandler = async ({ request, locals }) => {
	// Extract form data from the request body
	const formData = await request.formData();

	// Check if the "dataurl" field is present in the form data
	if (!formData.has('dataurl')) {
		return json(
			{ message: 'No file provided' },
			{
				status: 400
			}
		);
	}

	// Validate user credentials and get user information from the session
	const { user } = await locals.validateUser();

	// Extract the base64-encoded image data from the "dataurl" field
	const dataUrl = formData.get('dataurl') as string;
	const parts = dataUrl.split(';');
	const mimType = parts[0].split(':')[1];
	const imageData = parts[1].split(',')[1];

	// Convert the base64-encoded image data to a buffer
	const buffer = Buffer.from(imageData, 'base64');

	// Resize the image to 200x200 pixels using the sharp library
	const [err, b64data] = await to(sharp(buffer).resize(200, 200).toBuffer());
	if (err) {
		return json(
			{ message: 'Could not resize image' },
			{
				status: 500
			}
		);
	}

	// Generate a data URL for the resized image
	const resizedDataUrl = `data:${mimType};base64,${b64data.toString('base64')}`;

	// Update the user's avatar field in the MongoDB database
	await User.findOneAndUpdate(
		{
			_id: user?.userId
		},
		{
			avatar: resizedDataUrl
		}
	);

	// Return a JSON response with a success message and the URL of the resized image
	return json(
		{ message: 'Uploaded avatar successfully', resizedDataUrl },
		{
			status: 200
		}
	);
};