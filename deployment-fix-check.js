#!/usr/bin/env node

/**
 * ClickSprout v1.0 - Quick Deployment Fix Verification
 * Verifies that all deployment blockers have been resolved
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔧 ClickSprout v1.0 - Deployment Fix Verification');
console.log('=' .repeat(50));

let allFixed = true;

// Check 1: Verify no empty API routes
console.log('\n1. Checking for empty API routes...');
try {
  const apiDir = 'src/app/api';
  
  function checkEmptyFiles(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    let emptyFiles = [];
    
    for (const item of items) {
      const fullPath = `${dir}/${item.name}`;
      if (item.isDirectory()) {
        emptyFiles = emptyFiles.concat(checkEmptyFiles(fullPath));
      } else if (item.isFile() && item.name.endsWith('.ts')) {
        const stats = fs.statSync(fullPath);
        if (stats.size === 0) {
          emptyFiles.push(fullPath);
        }
      }
    }
    return emptyFiles;
  }
  
  const emptyFiles = checkEmptyFiles(apiDir);
  if (emptyFiles.length === 0) {
    console.log('   ✅ No empty API route files found');
  } else {
    console.log('   ❌ Found empty API route files:');
    emptyFiles.forEach(file => console.log(`       - ${file}`));
    allFixed = false;
  }
} catch (error) {
  console.log('   ❌ Error checking API routes:', error.message);
  allFixed = false;
}

// Check 2: Verify vercel.json is valid
console.log('\n2. Checking vercel.json configuration...');
try {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  
  if (vercelConfig.framework === 'nextjs') {
    console.log('   ✅ Framework correctly set to nextjs');
  } else {
    console.log('   ⚠️  Framework not explicitly set (should be auto-detected)');
  }
  
  if (vercelConfig.functions && !vercelConfig.builds) {
    console.log('   ✅ Functions configured without conflicting builds property');
  } else if (vercelConfig.builds && vercelConfig.functions) {
    console.log('   ❌ Conflicting builds and functions properties');
    allFixed = false;
  } else {
    console.log('   ✅ No conflicting properties');
  }
} catch (error) {
  console.log('   ❌ Error reading vercel.json:', error.message);
  allFixed = false;
}

// Check 3: Test production build
console.log('\n3. Testing production build...');
try {
  console.log('   🔄 Running build...');
  execSync('npm run build', { stdio: 'pipe' });
  console.log('   ✅ Production build successful');
} catch (error) {
  console.log('   ❌ Build failed:', error.message);
  allFixed = false;
}

// Check 4: Verify git status
console.log('\n4. Checking git status...');
try {
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  if (gitStatus.trim() === '') {
    console.log('   ✅ All changes committed');
  } else {
    console.log('   ⚠️  Uncommitted changes found:');
    console.log(gitStatus);
  }
} catch (error) {
  console.log('   ❌ Error checking git status:', error.message);
}

// Check 5: Verify repository connection
console.log('\n5. Checking repository connection...');
try {
  const remotes = execSync('git remote -v', { encoding: 'utf8' });
  if (remotes.includes('kennon69/clicksprout-v10')) {
    console.log('   ✅ Repository correctly connected to kennon69/clicksprout-v10');
  } else {
    console.log('   ❌ Repository not connected to expected remote');
    console.log(remotes);
    allFixed = false;
  }
} catch (error) {
  console.log('   ❌ Error checking git remotes:', error.message);
  allFixed = false;
}

// Final summary
console.log('\n' + '=' .repeat(50));
console.log('🎯 DEPLOYMENT FIX VERIFICATION RESULTS');
console.log('=' .repeat(50));

if (allFixed) {
  console.log('✅ ALL ISSUES FIXED!');
  console.log('🚀 Ready for Vercel deployment!');
  console.log('\n📋 NEXT STEPS:');
  console.log('1. Go to Vercel Dashboard: https://vercel.com/dashboard');
  console.log('2. Find your project: clicksprout-v10');
  console.log('3. Click "Redeploy" or trigger new deployment');
  console.log('4. Or import fresh: https://vercel.com/new');
  console.log('\n🔗 Repository: https://github.com/kennon69/clicksprout-v10');
} else {
  console.log('❌ SOME ISSUES REMAIN');
  console.log('🔧 Please address the issues above before deploying');
}

console.log('\n📚 See VERCEL_DEPLOYMENT_FIX.md for detailed instructions');

process.exit(allFixed ? 0 : 1);
