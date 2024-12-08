document.getElementById('search-btn').addEventListener('click', async () => {
  const username = document.getElementById('username').value.trim();
  if (!username) {
    alert('Please enter a GitHub username.');
    return;
  }

  try {
    // Use Axios to fetch GitHub data (user data and repositories)
    const userResponse = await axios.get(`https://api.github.com/users/${username}`);
    const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos`);
    
    const userData = userResponse.data;
    const reposData = reposResponse.data;

    // Calculate contributions
    let totalContributions = 0;
    for (const repo of reposData) {
      const contributorsResponse = await axios.get(`https://api.github.com/repos/${username}/${repo.name}/contributors`);
      const contributors = contributorsResponse.data;
      const userContribution = contributors.find(contributor => contributor.login === username);
      if (userContribution) {
        totalContributions += userContribution.contributions;
      }
    }
    
    // Ranking logic
    const score = (totalContributions * 0.7) + (userData.followers * 0.3);
    const maxPossibleScore = 10000; // Example maximum score
    const rankPercentage = Math.min((score / maxPossibleScore) * 100, 100);

    // Rank categories
    let rankCategory = '';
    if (rankPercentage >= 80) rankCategory = 'Gold';
    else if (rankPercentage >= 60) rankCategory = 'Silver';
    else if (rankPercentage >= 40) rankCategory = 'Bronze';
    else rankCategory = 'Beginner';

    // Display result
    const resultSection = document.getElementById('result');
    resultSection.innerHTML = `
      <img src="${userData.avatar_url}" alt="Avatar" width="100">
      <h2>${userData.name || 'No Name Provided'}</h2>
      <p>${userData.bio || 'No Bio Available'}</p>
      <p>Followers: ${userData.followers} | Total Contributions: ${totalContributions}</p>
      <h3>Rank: ${rankCategory} (${rankPercentage.toFixed(2)}%)</h3>
    `;

    // Show the result section
    resultSection.style.display = 'block';
  } catch (error) {
    const resultSection = document.getElementById('result');
    resultSection.innerHTML = `<p style="color:red;">${error.message}</p>`;
    
    // Show the result section in case of error
    resultSection.style.display = 'block';
  }
});
