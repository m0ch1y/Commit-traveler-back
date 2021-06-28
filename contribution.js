const { graphql } = require("@octokit/graphql");
const config = require('./config');
const init = async ()=>{
	const { repository } = await graphql(
	`
		{
		repository(owner: "octokit", name: "graphql.js") {
			issues(last: 3) {
			edges {
				node {
				title
				}
			}
			}
		}
		}
	`,
	{
		headers: {
		authorization: `token ${config.ACCESS_TOKEN}`,
		},
	}
	);
	console.log(repository.issues.edges);

}
init();