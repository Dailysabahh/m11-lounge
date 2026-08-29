import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, "public/menu/source");
const outDir = path.join(root, "public/menu/products");
const brandDir = path.join(root, "public/brand");

fs.mkdirSync(outDir, { recursive: true });

async function copyAs(srcName, destName) {
  const src = path.join(sourceDir, srcName);
  const dest = path.join(outDir, destName);
  await sharp(src).jpeg({ quality: 90 }).toFile(dest);
  console.log("copied", destName);
}

async function crop(srcPath, destName, region) {
  const dest = path.join(outDir, destName);
  await sharp(srcPath).extract(region).jpeg({ quality: 90 }).toFile(dest);
  console.log("cropped", destName, region);
}

const seafood = path.join(sourceDir, "Seafood platter.jpg");
const sides = path.join(sourceDir, "Sides.jpg");
const shisha = path.join(brandDir, "shisha-menu.png");

const seafoodMeta = await sharp(seafood).metadata();
const sidesMeta = await sharp(sides).metadata();
const shishaMeta = await sharp(shisha).metadata();

console.log("seafood", seafoodMeta.width, seafoodMeta.height);
console.log("sides", sidesMeta.width, sidesMeta.height);
console.log("shisha", shishaMeta.width, shishaMeta.height);

// Seafood platter: header + 3 stacked rows + footer
{
  const w = seafoodMeta.width;
  const h = seafoodMeta.height;
  const header = Math.round(h * 0.09);
  const footer = Math.round(h * 0.075);
  const usable = h - header - footer;
  const rowH = Math.floor(usable / 3);
  const names = ["ocean-fire.jpg", "royal-feast.jpg", "street-king.jpg"];
  for (let i = 0; i < 3; i++) {
    await crop(seafood, names[i], {
      left: 0,
      top: header + i * rowH,
      width: w,
      height: i === 2 ? h - footer - (header + i * rowH) : rowH,
    });
  }
}

// Sides: title bar + 3x3 gold cards
{
  const w = sidesMeta.width;
  const h = sidesMeta.height;
  const header = Math.round(h * 0.13);
  const padX = Math.round(w * 0.025);
  const padY = Math.round(h * 0.02);
  const gridW = w - padX * 2;
  const gridH = h - header - padY;
  const cellW = Math.floor(gridW / 3);
  const cellH = Math.floor(gridH / 3);
  const inset = 6;
  const names = [
    "french-fries.jpg",
    "coleslaw.jpg",
    "garden-salad.jpg",
    "sauce.jpg",
    "dipping-sauce.jpg",
    "jollof-rice.jpg",
    "fried-plantain.jpg",
    "fried-yam.jpg",
    "steamed-vegetables.jpg",
  ];
  let n = 0;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      await crop(sides, names[n++], {
        left: padX + c * cellW + inset,
        top: header + r * cellH + inset,
        width: cellW - inset * 2,
        height: cellH - inset * 2,
      });
    }
  }
}

// Shisha flyer: left card grid (2 cols x 4 rows), skip empty 8th
{
  const rows = [
    { top: 338, height: 168 },
    { top: 518, height: 168 },
    { top: 698, height: 148 },
    { top: 852, height: 78 },
  ];
  const cols = [
    { left: 18, width: 412 },
    { left: 438, width: 300 },
  ];
  const names = [
    "shisha-classic-pot.jpg",
    "shisha-after-dark.jpg",
    "shisha-platinum.jpg",
    "shisha-smoke-away.jpg",
    "shisha-signature.jpg",
    "shisha-private-reserve.jpg",
    "shisha-arabian-night.jpg",
  ];
  for (let i = 0; i < 7; i++) {
    const r = Math.floor(i / 2);
    const c = i % 2;
    await crop(shisha, names[i], {
      left: cols[c].left,
      top: rows[r].top,
      width: cols[c].width,
      height: rows[r].height,
    });
  }
  await sharp(shisha)
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, "shisha-banner.jpg"));
}

await copyAs("Meat platter.jpg", "meat-platter.jpg");
await copyAs("Seafood splender.jpg", "seafood-splender.jpg");
await copyAs("Spaghetti Bolognese.jpg", "spaghetti-bolognese.jpg");
await copyAs("Chinese fried rice.jpg", "chinese-fried-rice.jpg");
await copyAs("Sea food okro.jpg", "seafood-okro.jpg");
await copyAs("Semo & Egusi soup.jpg", "semo-egusi.jpg");
await copyAs("Poundo Ham.jpg", "poundo-ham.jpg");

// Combo platter: diptych of meat + seafood splendor
{
  const left = sharp(path.join(sourceDir, "Meat platter.jpg")).resize(640, 720, {
    fit: "cover",
  });
  const right = sharp(path.join(sourceDir, "Seafood splender.jpg")).resize(
    640,
    720,
    { fit: "cover" },
  );
  const leftBuf = await left.toBuffer();
  const rightBuf = await right.toBuffer();
  await sharp({
    create: {
      width: 1280,
      height: 720,
      channels: 3,
      background: { r: 5, g: 5, b: 5 },
    },
  })
    .composite([
      { input: leftBuf, left: 0, top: 0 },
      { input: rightBuf, left: 640, top: 0 },
    ])
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, "combo-platter.jpg"));
  console.log("created combo-platter.jpg");
}

console.log("done");
