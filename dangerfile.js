import { danger, warn, fail} from "danger";
// const githubToken = process.env.DANGER_GITHUB_API_TOKEN;

const reviewLargePR = () => {
    const bigPRThreshold = 1000;
    if (
        danger.github.pr.additions + danger.github.pr.deletions >
        bigPRThreshold
    ) {
        warn (
            `:exclamation: Pull Request size seems relatively large. If Pull Request contains multiple changes, split them into smaller Pull Requests`
        );
    }
};

const ensurePRHasAssignee = () => {
    //Always ensure that we assign someone
    if (danger.github.pr.assignee == null) {
        fail (
            "Please assign someone to merge this PR"
        );
    }
};

reviewLargePR();
ensurePRHasAssignee();