import _ from 'lodash'

export const posts = _.times(100, (i) => ({
  nick: `cool-idea-nick-${i + 1}`,
  name: `Posts ${i + 1}`,
  description: `Description of post ${i + 1}...`,
  text: _.times(100, (j) => `<p>Text paragraph ${j} of post ${i + 1}...</p>`).join(''),
}))
