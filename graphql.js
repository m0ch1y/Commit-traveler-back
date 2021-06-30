let { graphql } = require("@octokit/graphql");
const config = require('./config');
/*
graphql = graphql.defaults({
  headers: {
    authorization: `token ${config.ACCESS_TOKEN_WEB}`,
  },
});
*/
const getCommitCount = async (token, user_name) => {
  const QUERY = `
  {
    user(login: "${user_name}") {
      id
      contributionsCollection {
        totalCommitContributions
      }
    }
  }
  `;
  PARAMS = {
    headers: {
      authorization: `token ${token}`,
    },
  }
  try {
    const { user: { contributionsCollection: { totalCommitContributions } } } = await graphql(QUERY, PARAMS);
    //console.log(totalCommitContributions);
    console.log(totalCommitContributions);
    return totalCommitContributions;
  } catch (err) {
    console.error(err.message);
  }
}
exports.getCommitCount = getCommitCount;