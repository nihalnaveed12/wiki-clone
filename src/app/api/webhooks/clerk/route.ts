import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUser, updateUser, deleteUser } from '@/lib/actions/user.actions';

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET to your environment variables');
    }

    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occurred -- no svix headers', {
            status: 400,
        });
    }

    // Get the body
    const payload = await req.text();

    // Create a new Svix instance with your secret
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
        evt = wh.verify(payload, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occurred', {
            status: 400,
        });
    }

    // Handle the webhook
    const eventType = evt.type;

    if (eventType === 'user.created') {
        const { id, email_addresses, first_name, last_name, username, image_url } = evt.data;

        try {
            const user = await createUser({
                clerkId: id,
                email: email_addresses[0].email_address,
                firstName: first_name || '',
                lastName: last_name || '',
                username: username || '',
                photo: image_url || '',
            });

            console.log('User created successfully:', user);
        } catch (error) {
            console.error('Error creating user:', error);
            return new Response('Error creating user', { status: 500 });
        }
    }

    if (eventType === 'user.updated') {
        const { id, first_name, last_name, username, image_url } = evt.data;

        try {
            const user = await updateUser({
                clerkId: id,
                firstName: first_name || '',
                lastName: last_name || '',
                username: username || '',
                photo: image_url || '',
            });

            console.log('User updated successfully:', user);
        } catch (error) {
            console.error('Error updating user:', error);
            return new Response('Error updating user', { status: 500 });
        }
    }

    if (eventType === 'user.deleted') {
        const { id } = evt.data;

        try {
            await deleteUser(id!);
            console.log('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            return new Response('Error deleting user', { status: 500 });
        }
    }

    return new Response('Webhook processed successfully', { status: 200 });
}