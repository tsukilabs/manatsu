import { Octokit } from '@octokit/core';

export async function github(token: string, version: string) {
  const octokit = new Octokit({ auth: token });

  await octokit.request('POST /repos/{owner}/{repo}/releases', {
    tag_name: `v${version}`,
    name: `v${version}`,
    draft: false,
    prerelease: true,
    generate_release_notes: true,
    owner: 'manatsujs',
    repo: 'manatsu',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
      accept: 'application/vnd.github+json'
    }
  });
}
