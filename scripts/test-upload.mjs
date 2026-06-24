import { createHmac } from 'crypto';

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const HOST = process.env.TEST_HOST || 'http://localhost:3002';

function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function createAdminToken() {
  if (!ADMIN_SECRET) {
    throw new Error('ADMIN_SECRET environment variable is required to create admin token');
  }
  const payloadObj = { role: 'admin', exp: Date.now() + 24 * 60 * 60 * 1000 };
  const payload = base64url(JSON.stringify(payloadObj));
  const signature = createHmac('sha256', ADMIN_SECRET).update(payload).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${payload}.${signature}`;
}

async function run() {
  try {
    const token = createAdminToken();

    console.log(`Posting to ${HOST}/api/admin/upload`);

    // fetch a placeholder image
    const imgRes = await fetch('https://picsum.photos/800/800');
    const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await imgRes.arrayBuffer();

    const file = new Blob([arrayBuffer], { type: contentType });
    const form = new FormData();
    form.append('file', file, 'test.jpg');

    const res = await fetch(`${HOST}/api/admin/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });

    const body = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', body);
  } catch (err) {
    console.error('Upload test failed:', err);
    process.exit(1);
  }
}

run();
