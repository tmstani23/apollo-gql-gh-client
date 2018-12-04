import ApolloClient, {gql} from 'apollo-boost';
import 'cross-fetch/polyfill';
import 'dotenv/config';


const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  request: operation => {
      operation.setContext({
      headers: {
        authorization: `Bearer ${process.env.YOUR_GITHUB_PERSONAL_ACCESS_TOKEN}`,
      },
    });
  },
});

const GET_REPOSITORIES_OF_ORGANIZATION = gql`
  query first($organization: String!) {
    organization(login: $organization) {
      name
      url
      repositories(first: 5 orderBy: {direction: DESC, field: STARGAZERS}) {
        edges {
          node {
            name
            url
          }  
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;
const GET_REPOSITORIES_OF_ORGANIZATION_PAGINATED = gql`
query second($organization: String! $cursor: String) {
  organization(login: $organization) {
    name
    url
    repositories(first: 10 after:$cursor orderBy: {direction: DESC, field: STARGAZERS}) {
      edges {
        node {
          name
          url
        }  
      }
      pageInfo {
      	endCursor
        hasNextPage
      }
    }
  }
}
`;
const ADD_STAR = gql`
  mutation AddStar($repositoryId: ID!) {
    addStar(input: {starrableId: $repositoryId }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`
const REMOVE_STAR = gql`
  mutation AddStar($repositoryId: ID!) {
    removeStar(input: {starrableId: $repositoryId }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`

let cursor = "";
// client
//   .query({
//     query: GET_REPOSITORIES_OF_ORGANIZATION,
//     variables: {
//       organization: 'the-road-to-learn-react'
//     },
//   })
//   .then((result) => cursor = result.data.organization.repositories.pageInfo.endCursor)

// client  
//   .query({
//     query: GET_REPOSITORIES_OF_ORGANIZATION_PAGINATED,
//     variables: {
//       organization: 'the-road-to-learn-react',
//       cursor: "NQ"
//     },
//   })
//   .then((result) => console.log(JSON.stringify(result.data.organization.repositories, null, 4)))
  
//Add Star Mutation request:
client
  .mutate({
    mutation: ADD_STAR,
    variables: {
      repositoryId: 'MDEwOlJlcG9zaXRvcnk2MzM1MjkwNw==',
    }
  })
  .then(result => console.log(JSON.stringify(result, null, 6)));
//Remove Star Mutation
  client
  .mutate({
    mutation: REMOVE_STAR,
    variables: {
      repositoryId: 'MDEwOlJlcG9zaXRvcnk2MzM1MjkwNw==',
    }
  })
  .then(result => console.log(JSON.stringify(result, null, 6)));
 



