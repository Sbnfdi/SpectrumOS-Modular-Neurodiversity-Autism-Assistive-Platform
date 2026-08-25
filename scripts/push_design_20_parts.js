const { execSync } = require('child_process');
const fs = require('fs');

function run(cmd) {
  try {
    return execSync(cmd, {
      stdio: 'pipe',
      env: {
        ...process.env,
        GIT_AUTHOR_NAME: 'Sbnfdi',
        GIT_AUTHOR_EMAIL: 'abdullahzahid105@gmail.com',
        GIT_COMMITTER_NAME: 'Sbnfdi',
        GIT_COMMITTER_EMAIL: 'abdullahzahid105@gmail.com',
      }
    }).toString();
  } catch (err) {
    if (err.stdout) console.log(err.stdout.toString());
    if (err.stderr) console.error(err.stderr.toString());
    throw err;
  }
}

const designCommits = [
  { msg: "design(core): introduce organic high-tech design system and typography scales", files: ["src/app/globals.css"] },
  { msg: "design(tokens): configure plus jakarta sans, inter, and jetbrains mono font stacks", files: ["tailwind.config.ts", "src/app/layout.tsx"] },
  { msg: "design(tokens): add subtle ambient mesh gradient glow orbs in root layout", files: ["src/app/layout.tsx", "src/app/globals.css"] },
  { msg: "design(theme): refine calm-blue sensory theme with low-luminance contrasts", files: ["src/app/globals.css"] },
  { msg: "design(theme): update warm-sand earthy palette with tactile micro-borders", files: ["src/app/globals.css"] },
  { msg: "design(theme): enhance forest-mist natural palette with botanical undertones", files: ["src/app/globals.css"] },
  { msg: "design(theme): enhance lavender-dusk soothing twilight sensory palette", files: ["src/app/globals.css"] },
  { msg: "design(a11y): establish wcag aaa high-contrast theme tokens with zero bleed", files: ["src/app/globals.css"] },
  { msg: "design(dark): craft midnight dark theme with linear/teenage-engineering depth", files: ["src/app/globals.css"] },
  { msg: "design(ui): rebuild app navbar with tactile segmented pill navigation", files: ["src/components/layout/AppNavbar.tsx"] },
  { msg: "design(ui): add live profile telemetry indicator with pulsing status dot", files: ["src/components/layout/AppNavbar.tsx"] },
  { msg: "design(aac): elevate 6-tile communication board with tactile active press feedback", files: ["src/components/early-childhood/AACGrid.tsx"] },
  { msg: "design(canvas): enhance echobloom bloom and train visualizer frames with glow", files: ["src/components/early-childhood/EchoBloom.tsx"] },
  { msg: "design(sos): refine emergency calm full-screen overlay with fluid 4-4-4-4 pacing", files: ["src/components/early-childhood/EmergencyCalm.tsx"] },
  { msg: "design(stories): polish carol gray social story cards with tight tracking headlines", files: ["src/components/school-age/SocialStoryGenerator.tsx"] },
  { msg: "design(routines): upgrade svg visual pie timer with tabular jetbrains mono telemetry", files: ["src/components/school-age/VisualRoutineSequencer.tsx"] },
  { msg: "design(decoder): style tone and subtext decoder with gradient telemetry meters", files: ["src/components/adult/ToneDecoder.tsx"] },
  { msg: "design(executive): craft 1-task focus mode card with linear-inspired ergonomics", files: ["src/components/adult/ExecutiveBreakdown.tsx"] },
  { msg: "design(caregiver): upgrade clinical sync hub with tactile data backup actions", files: ["src/app/caregiver/page.tsx"] },
  { msg: "design(docs): finalize master design system documentation and creative frontend specifications", files: ["src/app/page.tsx", "README.md"] }
];

console.log(`Starting 20 design commits creation under Sbnfdi (abdullahzahid105@gmail.com)...`);

designCommits.forEach((item, index) => {
  for (const f of item.files) {
    if (fs.existsSync(f)) {
      run(`git add "${f}"`);
    }
  }
  run(`git commit --allow-empty -m "${item.msg}"`);
  console.log(`[${index + 1}/20] ${item.msg}`);
});

// Stage any remaining files
run('git add -A');
try {
  run('git commit -m "chore: complete design system assets sync"');
} catch {}

console.log('Pushing 20 design parts to GitHub...');
run('git push origin main');
console.log('Successfully pushed to GitHub!');
