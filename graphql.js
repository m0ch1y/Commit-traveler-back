let { graphql } = require("@octokit/graphql");
const config = require('./config');
/*
graphql = graphql.defaults({
  headers: {
    authorization: `token ${config.ACCESS_TOKEN_WEB}`,
  },
});
*/
const ACCESS_TOKEN = "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";
const getCommitRepos = async (token, user_name) => {
  const QUERY = `
{
  user(login: "${user_name}") {
    contributionsCollection {
      commitContributionsByRepository(maxRepositories: 3) {
        repository {
          name
          owner {
            ... on User {
              login
            }
          }
        }
      }
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
    const { user: { contributionsCollection: { commitContributionsByRepository: repos } } } = await graphql(QUERY, PARAMS);
    ans = [];
    for (let r of repos) {
      ans.push({ name: r.repository.name, login: r.repository.owner.login });
    }
    return ans;
  } catch (err) {
    console.error(err.message);
    return [];
  }
}
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
    return [];
  }
}
const getCommitLanguage = async (token, user_name) => {
  let ans = [];
  const repos = await getCommitRepos(token, user_name);
  for (let r of repos) {

    const QUERY = `
{
  repository(name: "${r.name}", owner: "${r.login}") {
    languages(first: 3) {
      nodes {
        name
        color
      }
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
      //const { user: { contributionsCollection: { commitContributionsByRepository: repos} } } = await graphql(QUERY, PARAMS);
      const { repository: { languages: { nodes } } } = await graphql(QUERY, PARAMS);
      ans = ans.concat(nodes);
    } catch (err) {
      console.error(err.message);
    }
  }
  ans = removeDuplicates(ans);
  for (let i = 0; i < ans.length; i++){
    ans.color = ans.color ? ans.color : "#666";
  }
  return ans;
}
var removeDuplicates = function(object) {
    var result = [], comparisons = [], key, comparison;
 
    for (key in object) {
        comparison = JSON.stringify(object[key]);
 
        if (comparisons.indexOf(comparison) === -1) {
            result.push(object[key]);
        }
 
        comparisons.push(comparison);
    }
 
    return result;
};
exports.getCommitCount = getCommitCount;
exports.getCommitLanguage = getCommitLanguage;