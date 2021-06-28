let { graphql } = require("@octokit/graphql");
const config = require('./config');
graphql = graphql.defaults({
  headers: {
    authorization: `token ${config.ACCESS_TOKEN_WEB}`,
  },
});

const getCommitCount = async (user_name)=>{
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
  try {
    const {user:{contributionsCollection:{totalCommitContributions}}} = await graphql(QUERY);
    console.log(totalCommitContributions);
  } catch (err) {
    console.error(err.message);
  }
}
exports.getCommitCount = getCommitCount;