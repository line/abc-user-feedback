const fs = require("fs").promises;
const path = require("path");
const glob = require("glob");

async function mergeCss(type = "base") {
  try {
    const sourcePath = path.resolve(process.cwd(), `dist/${type}`);
    const outputPath = path.resolve(process.cwd(), `dist/${type}.css`);

    // 출력 디렉토리 확인 및 생성
    const outputDir = path.dirname(outputPath);
    await fs.mkdir(outputDir, { recursive: true });

    // CSS 파일 검색
    const cssFiles = glob.sync(path.join(sourcePath, "*.css"));

    if (cssFiles.length === 0) {
      console.log(`No CSS files found in ${sourcePath} with pattern *.css`);
      return;
    }

    // 모든 CSS 내용을 담을 배열
    const cssContents = [];

    // 각 파일의 내용 읽기
    for (const file of cssFiles) {
      const content = await fs.readFile(file, "utf8");
      cssContents.push(`/* ${path.basename(file)} */`);
      cssContents.push(content);
    }

    // CSS 내용 병합
    const mergedCss = cssContents.join("\n\n");

    // 병합된 CSS 저장
    await fs.writeFile(outputPath, mergedCss);

    // console.log(`Merged CSS saved to: ${outputPath}`);
  } catch (error) {
    console.error("CSS merging failed:", error);
    process.exit(1);
  }
}

module.exports = mergeCss;
