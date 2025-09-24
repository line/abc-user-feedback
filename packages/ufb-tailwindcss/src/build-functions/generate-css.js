const fs = require("fs").promises;
const path = require("path");
const postcss = require("postcss");
const glob = require("glob");
/**
 * PostCSS를 사용하여 CSS 파일들을 처리하는 함수
 * 명령어 `postcss --config src/components src/components/*.css --base src --dir dist`와 동일한 기능을 수행합니다.
 */
async function generateCss(type) {
  try {
    // 설정 파일 로드
    const configPath = path.resolve(process.cwd(), `src/${type}`);
    const configFile = require(path.join(configPath, "postcss.config.js"));

    // 플러그인 초기화
    const plugins = configFile.plugins || [];

    // PostCSS 프로세서 생성
    const processor = postcss(plugins);
    const cssFiles = glob.sync(`src/${type}/*.css`);
    // 기본 경로
    const baseDir = path.resolve(process.cwd(), "src");
    const outputDir = path.resolve(process.cwd(), "dist");

    // 디렉토리가 없으면 생성
    fs.mkdir(outputDir, { recursive: true });

    // 각 파일 처리
    for (const file of cssFiles) {
      const css = await fs.readFile(file, "utf8");

      const relativePath = path.relative(baseDir, file);
      const outputPath = path.join(outputDir, relativePath);

      // 출력 디렉토리 확인
      const outputFileDir = path.dirname(outputPath);
      fs.mkdir(outputFileDir, { recursive: true });

      // PostCSS 처리
      const result = await processor.process(css, {
        from: file,
        to: outputPath,
        map: { inline: false },
      });

      // 처리된 CSS 저장
      await fs.writeFile(outputPath, result.css);
      // console.log(`Generated: ${outputPath}`);
    }

    // console.log("CSS generation completed successfully.");
  } catch (error) {
    console.error("CSS generation failed:", error);
    process.exit(1);
  }
}

module.exports = generateCss;
