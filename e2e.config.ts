import type { E2EConfig } from 'e2e';
import { web } from '@e2e-dev/web';
import { gateway } from 'ai';

export default {
  // The Vercel AI Gateway reads AI_GATEWAY_API_KEY, or the OIDC token of a linked Vercel project.
  agents: {
    default: {
      model: gateway(process.env.E2E_MODEL ?? 'openai/gpt-6-luna-fast'),
      system: 'You are a thorough QA agent. Verify every outcome.',
      context: 'Invoice Command is a free invoice builder. The homepage is an editor form with a live invoice preview beside it.',
    },
  },
  targets: [{
    engine: web(),
    app: {
      url: process.env.APP_URL ?? 'http://localhost:3005',
      command: {
        executable: 'npm',
        args: ['run', 'dev'],
        reuseExisting: true,
        log: '.e2e/logs/app.log',
        startupTimeout: 120_000,
      },
    },
  }],
} satisfies E2EConfig;
