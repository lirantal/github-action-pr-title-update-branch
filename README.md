# github-action-pr-title-update-branch

A GitHub Action that updates the PR title with information about the base branch it wants to merge to

## Inputs

### `placement`

Where to place the branch name

Not required.

### `skip_if_found`

Skip update if base branch string is found in the title

Not required.

## Example usage

Note the event trigger on `pull_request.

```yaml
on: [pull_request]

jobs:
  pr_meta:
    runs-on: ubuntu-latest
    name: A job that updates the Pull Request title with a base branch label
    steps:
      - name: Update the Pull Request title with a base branch label
        uses: lirantal/github-action-pr-title-update-branch@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
