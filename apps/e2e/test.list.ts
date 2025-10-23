import { test } from '@playwright/test';

import createChannel from './scenarios/create-channel.spec';
import createFeedbackWithImage from './scenarios/create-feedback-with-image.spec';
import createFeedback from './scenarios/create-feedback.spec';
import createIssue from './scenarios/create-issue.spec';
import createProject from './scenarios/create-project.spec';
import searchFeedback from './scenarios/search-feedback.spec';

test.describe('test suites', () => {
  createProject();
  createChannel();
  createFeedback();
  createFeedbackWithImage();
  createIssue();
  searchFeedback();
});
