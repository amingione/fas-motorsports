import { createClient } from '@sanity/client'

const sanityClient = createClient({
  projectId: 'your_project_id', // replace with your actual project ID
  dataset: 'production',        // or whatever dataset you use
  apiVersion: '2023-01-01',     // use a fixed date for consistency
  useCdn: false,                // set to true for public data, false if using private token
  token: process.env.SANITY_API_TOKEN, // optional, only if accessing private data
})

export default sanityClient