#!/usr/bin/env node

/**
 * ClickSprout v1.0 - Vercel Deployment Check
 * Comprehensive verification script for Vercel deployment readiness
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 ClickSprout v1.0 - Vercel Deployment Check');
console.log('=' .repeat(50));

let allChecks = true;

// Check 1: Verify package.json exists and has required scripts
console.log('\n1. Checking package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('   ✅ package.json exists');
  
  const requiredScripts = ['dev', 'build', 'start'];
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`   ✅ Script "${script}" exists`);
    } else {
      console.log(`   ❌ Script "${script}" missing`);
      allChecks = false;
    }
  });
} catch (error) {
  console.log('   ❌ package.json not found or invalid');
  allChecks = false;
}

// Check 2: Verify Next.js configuration
console.log('\n2. Checking Next.js configuration...');
try {
  if (fs.existsSync('next.config.js')) {
    console.log('   ✅ next.config.js exists');
  } else {
    console.log('   ❌ next.config.js missing');
    allChecks = false;
  }
} catch (error) {
  console.log('   ❌ Error checking next.config.js');
  allChecks = false;
}

// Check 3: Verify Vercel configuration
console.log('\n3. Checking Vercel configuration...');
try {
  if (fs.existsSync('vercel.json')) {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    console.log('   ✅ vercel.json exists');
    
    // Check for conflicting properties
    if (vercelConfig.builds && vercelConfig.functions) {
      console.log('   ❌ Conflicting "builds" and "functions" properties detected');
      allChecks = false;
    } else {
      console.log('   ✅ No conflicting properties in vercel.json');
    }
  } else {
    console.log('   ⚠️  vercel.json not found (optional)');
  }
} catch (error) {
  console.log('   ❌ Error checking vercel.json');
  allChecks = false;
}

// Check 4: Verify environment configuration
console.log('\n4. Checking environment configuration...');
try {
  if (fs.existsSync('.env.example')) {
    console.log('   ✅ .env.example exists');
  } else {
    console.log('   ❌ .env.example missing');
    allChecks = false;
  }
  
  if (fs.existsSync('.env.local')) {
    console.log('   ✅ .env.local exists (local development)');
  } else {
    console.log('   ⚠️  .env.local not found (create for local development)');
  }
} catch (error) {
  console.log('   ❌ Error checking environment files');
  allChecks = false;
}

// Check 5: Verify key directories exist
console.log('\n5. Checking project structure...');
const requiredDirs = ['src', 'src/app', 'src/components', 'src/lib', 'public'];
requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`   ✅ Directory "${dir}" exists`);
  } else {
    console.log(`   ❌ Directory "${dir}" missing`);
    allChecks = false;
  }
});

// Check 6: Verify API routes exist
console.log('\n6. Checking API routes...');
const apiDir = 'src/app/api';
if (fs.existsSync(apiDir)) {
  console.log('   ✅ API directory exists');
  const apiRoutes = fs.readdirSync(apiDir);
  console.log(`   ✅ Found ${apiRoutes.length} API routes`);
} else {
  console.log('   ❌ API directory missing');
  allChecks = false;
}

// Check 7: Test build process
console.log('\n7. Testing build process...');
try {
  console.log('   🔄 Running production build...');
  execSync('npm run build', { stdio: 'pipe' });
  console.log('   ✅ Production build successful');
} catch (error) {
  console.log('   ❌ Production build failed');
  console.log('   Error:', error.message);
  allChecks = false;
}

// Check 8: Verify TypeScript compilation
console.log('\n8. Checking TypeScript...');
try {
  if (fs.existsSync('tsconfig.json')) {
    console.log('   ✅ tsconfig.json exists');
    console.log('   🔄 Running TypeScript check...');
    execSync('npm run type-check', { stdio: 'pipe' });
    console.log('   ✅ TypeScript check passed');
  } else {
    console.log('   ⚠️  tsconfig.json not found');
  }
} catch (error) {
  console.log('   ❌ TypeScript check failed');
  console.log('   Error:', error.message);
  allChecks = false;
}

// Check 9: Verify .gitignore
console.log('\n9. Checking .gitignore...');
try {
  if (fs.existsSync('.gitignore')) {
    const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
    const requiredIgnores = ['.env.local', 'node_modules', '.next'];
    let allIgnoresPresent = true;
    
    requiredIgnores.forEach(ignore => {
      if (gitignoreContent.includes(ignore)) {
        console.log(`   ✅ "${ignore}" is ignored`);
      } else {
        console.log(`   ❌ "${ignore}" not in .gitignore`);
        allIgnoresPresent = false;
      }
    });
    
    if (allIgnoresPresent) {
      console.log('   ✅ .gitignore properly configured');
    } else {
      allChecks = false;
    }
  } else {
    console.log('   ❌ .gitignore missing');
    allChecks = false;
  }
} catch (error) {
  console.log('   ❌ Error checking .gitignore');
  allChecks = false;
}

// Final summary
console.log('\n' + '=' .repeat(50));
console.log('🎯 DEPLOYMENT READINESS SUMMARY');
console.log('=' .repeat(50));

if (allChecks) {
  console.log('✅ ALL CHECKS PASSED!');
  console.log('🚀 Your project is ready for Vercel deployment!');
  console.log('\nNext steps:');
  console.log('1. Push your code to GitHub');
  console.log('2. Connect your GitHub repository to Vercel');
  console.log('3. Configure environment variables in Vercel');
  console.log('4. Deploy!');
} else {
  console.log('❌ SOME CHECKS FAILED');
  console.log('🔧 Please fix the issues above before deploying');
}

console.log('\n📚 For detailed deployment instructions, see:');
console.log('   - README.md');
console.log('   - PRODUCTION_DEPLOYMENT_GUIDE.md');
console.log('   - GITHUB_EXPORT_GUIDE.md');

process.exit(allChecks ? 0 : 1);
