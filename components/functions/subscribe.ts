import { Handler } from '@netlify/functions'
import Mailchimp from 'mailchimp-api-v3'

const mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY)
const audienceId = process.env.MAILCHIMP_AUDIENCE_ID

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { email } = JSON.parse(event.body || '{}')

    if (!email) {
      return { statusCode: 400, body: 'Email is required' }
    }

    await mailchimp.post(`/lists/${audienceId}/members`, {
      email_address: email,
      status: 'subscribed',
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Subscription successful' }),
    }
  } catch (error) {
    console.error('Subscription error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error subscribing to the newsletter' }),
    }
  }
}