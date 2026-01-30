import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        calculators: resolve(__dirname, 'calculators.html'),
        about: resolve(__dirname, 'about.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html'),
        calcTotal: resolve(__dirname, 'calculators/total-study-cost.html'),
        calcRoi: resolve(__dirname, 'calculators/degree-roi-payback.html'),
        calcPath: resolve(__dirname, 'calculators/path-comparison.html'),
        calcStudyVsWork: resolve(__dirname, 'calculators/study-vs-work-now.html'),
        calcLoan: resolve(__dirname, 'calculators/student-loan-payoff.html'),
        articleTotal: resolve(__dirname, 'articles/total-study-cost.html'),
        articleRoi: resolve(__dirname, 'articles/degree-roi-payback.html'),
        articlePath: resolve(__dirname, 'articles/path-comparison.html'),
        articleStudyVsWork: resolve(__dirname, 'articles/study-vs-work-now.html'),
        articleLoan: resolve(__dirname, 'articles/student-loan-payoff.html')
      }
    }
  }
});
