const core = require("@actions/core");
const github = require("@actions/github");

function updatePR({
  token,
  title,
  placement,
  skip_if_found,
  pull_number,
  owner,
  repo,
}) {
  const octokit = github.getOctokit(token);

  const baseBranch = github.context.payload.pull_request.base.ref;

  if (skip_if_found === true) {
    if (title.indexOf(baseBranch) !== -1) {
      core.info(`Skipping PR: ${title}`);
      return;
    }
  }

  const options = {
    owner: owner,
    repo: repo,
    pull_number: pull_number,
  };

  let placementInTitle;
  switch (placement) {
    case "suffix":
      placementInTitle = "suffix";
      options["title"] = `${title} [${baseBranch}]`;
      break;
    case "prefix":
    default:
      placementInTitle = "prefix";
      options["title"] = `[${baseBranch}] ${title}`;
  }

  return octokit.rest.pulls.update(options);
}

async function run() {
  try {
    const token = process.env["GITHUB_TOKEN"];
    if (!token) {
      core.setFailed("Requires: GITHUB_TOKEN");
      return;
    }

    if (github.context.eventName !== "pull_request") {
      core.info(
        `Skipping PR: this isn't a pull_request event for us to handle`
      );
      core.info(
        `Tip: if you think this is a mistake, did you make sure to run this action in a 'pull_request' event?`
      );
      return;
    }

    if (github.context.payload.action !== "opened") {
      core.info(
        `Skipping PR: this PR was already updated with a base branch label`
      );
      return;
    }

    const placement = core.getInput("placement", { required: false });
    const skip_if_found = core.getInput("skip_if_found", { required: false });
    const title = github.context.payload.pull_request.title;
    const pull_number = github.context.payload.pull_request.number;
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;

    await updatePR({
      token,
      title,
      skip_if_found,
      placement,
      pull_number,
      owner,
      repo,
    });
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();
