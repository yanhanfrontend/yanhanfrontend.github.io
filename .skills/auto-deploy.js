export default {
  name: 'auto-deploy',
  async run() {
    const { execSync } = require('child_process')

    console.log('▶️ 执行 musices.cjs')
    execSync('node D:\\yanhanfrontend.github.io\\public\\musices.cjs', { stdio: 'inherit' })

    console.log('⏳ 等待10秒')
    await new Promise(r => setTimeout(r, 10000))

    console.log('📦 git add .')
    execSync('git add .', { stdio: 'inherit' })

    console.log('✅ git commit')
    execSync('git commit -m "ci: auto deploy"', { stdio: 'inherit' })

    console.log('⬇️ git pull')
    execSync('git pull', { stdio: 'inherit' })

    console.log('⬆️ git push')
    execSync('git push', { stdio: 'inherit' })

    console.log('🎉 全部完成！')
  }
}