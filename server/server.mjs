import express from 'express';
import axios from 'axios'; // If you're using Axios
import dotenv from 'dotenv';

dotenv.config();


const app = express();
app.use(express.static('public')); // Serve files from 'public'

const PORT = 3000;

app.get('/api/github/:username', async (req, res) => {
  const username = req.params.username;

  try {
    // Fetch user data from GitHub API using Axios
    const userResponse = await axios.get(`https://api.github.com/users/${username}`, {
      headers: { Authorization: `token ${process.env.GITHUB_API_TOKEN}` }
    });

    if (userResponse.status !== 200) {
      return res.status(404).json({ error: 'GitHub user not found' });
    }

    const userData = userResponse.data;

    // Fetch repositories from GitHub API using Axios
    const reposResponse = await axios.get(userData.repos_url, {
      headers: { Authorization: `token ${process.env.GITHUB_API_TOKEN}` }
    });

    if (reposResponse.status !== 200) {
      return res.status(404).json({ error: 'Repositories not found' });
    }

    const reposData = reposResponse.data;

    // Respond with user and repo data
    res.json({ userData, reposData });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
