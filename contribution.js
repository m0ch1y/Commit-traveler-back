let { graphql } = require("@octokit/graphql");
const config = require('./config');
graphql = graphql.defaults({
  headers: {
    authorization: `token ${config.ACCESS_TOKEN_WEB}`,
  },
});
const user_name = "kajikentaro";
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
async function main() {
  try {
    const {user:{contributionsCollection:{totalCommitContributions}}} = await graphql(QUERY);
    console.log(totalCommitContributions);
  } catch (err) {
    console.error(err.message);
  }
}

main();