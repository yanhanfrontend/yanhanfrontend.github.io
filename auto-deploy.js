#!/usr/bin/env node

/**
 * Auto-deploy script
 * Replicates the functionality of the auto-deploy skill
 */

import { execSync } from 'child_process';

async function run() {
  console.log('▶️ 执行 musices.cjs');
  execSync('node public\\musices.cjs', { stdio: 'inherit' });

  console.log('📦 git add .');
  execSync('git add .', { stdio: 'inherit' });

  console.log('✅ git commit');
  execSync('git commit -m "ci: auto deploy"', { stdio: 'inherit' });

  console.log('⬇️ git pull');
  execSync('git pull', { stdio: 'inherit' });

  console.log('⬆️ git push');
  execSync('git push', { stdio: 'inherit' });

  console.log('🎉 全部完成！');
}

run().catch(err => {
  console.error('❌ 执行失败:', err);
  process.exit(1);
});
