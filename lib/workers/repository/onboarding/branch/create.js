const { getOnboardingConfig } = require('./config');
const { detectSemanticCommits } = require('../../init/semantic');

async function createOnboardingBranch(config) {
  logger.debug('createOnboardingBranch()');
  const contents = await getOnboardingConfig(config);
  logger.info('Creating onboarding branch');
  let commitMessage;
  // istanbul ignore if
  if (await detectSemanticCommits(config)) {
    commitMessage = config.semanticCommitType;
    if (config.semanticCommitScope && config.semanticCommitScope !== 'deps') {
      commitMessage += `(${config.semanticCommitScope})`;
    }
    commitMessage += ': ';
    commitMessage += 'add renovate.json';
  } else {
    commitMessage = 'Add renovate.json';
  }
  await platform.commitFilesToBranch(
    `renovate/configure`,
    [
      {
        name: 'renovate.json',
        contents,
      },
    ],
    commitMessage
  );
}

module.exports = {
  getOnboardingConfig,
  createOnboardingBranch,
};
