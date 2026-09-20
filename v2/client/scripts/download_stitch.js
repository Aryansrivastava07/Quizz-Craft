const fs = require('fs');
const path = require('path');

const screens = [
  {
    id: "6ba6aff37b1e457db92128ad17292c19",
    name: "screen-1-cosmic-parallax",
    title: "QuizzCraft - Subtle Cosmic Parallax Experience",
    screenshot: "https://lh3.googleusercontent.com/aida/AEtjO1XnvZsOiW9fos9Lsja0LRpgt5jGVawW06J9vhrAAfwgHUp_ZJRGW9PiZvOd_xn6mK5YBGZbXQ__cjEtyszz4IYikJTGBwNbwUFtunN9v0SHnHaHBBTm5993nHtGV-xLIa6ObyrZvpLAeqcXUNISTYRMulECYEXWvJUZUxqqpCZpA23VoHpkZgY-JVNaeN7wSX7fOKEeIyGpj_POjgjhmgYQV2m08NGfeO6RvzlhwEZbGaoaCCBa7Slm5hk",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1YWNkYzU5OGY1ZWUwMmQzYzYwZDA3MTVjODgyEgsSBxDsxcfEkwoYAZIBIwoKcHJvamVjdF9pZBIVQhM0MzkxOTg0NTc3NTg5ODM5ODQ1&filename=&opi=89354086"
  },
  {
    id: "8a55273d5ab14f22bf706efd54fe4e0d",
    name: "screen-2-active-quiz",
    title: "QuizzCraft - Active Quiz Platform (Full Screen)",
    screenshot: "https://lh3.googleusercontent.com/aida/AEtjO1VkrFP7yuS3TDPnM9awVVL8mRibKhiiob0HGhhN7sQv91nJbFq4-BwWuXto9UeyUNRds2qPiAcJ4ydm2_d-q7SWo-lbWGQxPkwXY-xjeXsfzJu927d0er9i32qn_vrvH5rV0mveqx95h0VB-S2UDgXkXOGBPl_zBZRdesNwYjRt9ZJrk_bDTkguSxIx7ghLQ71ksE47W1ver8owJCIPOxYRjF2JdThmbSzxrCzwyK_yinEufR8AKmHl9kU",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1YWQ0YmVkYzJiNmQwMzM4NTg2OWFkMzk2Y2NhEgsSBxDsxcfEkwoYAZIBIwoKcHJvamVjdF9pZBIVQhM0MzkxOTg0NTc3NTg5ODM5ODQ1&filename=&opi=89354086"
  },
  {
    id: "940f6cad00544f7294ae9f12bd6b590b",
    name: "screen-3-join-quiz",
    title: "QuizzCraft - Join Quiz (Auth-Gated Cosmic Portal)",
    screenshot: "https://lh3.googleusercontent.com/aida/AEtjO1VZHWJM7UDwpV4RHIHHjyaR_6tYKKebZHaVRmgaLDyiJc-Sg3Q0nQyZ6AT0tvAYP9Pp-n3wfxCi04ygZvdQgRfN9v2eVe8gJf5Zzj8QVg94bkDff9rz5clFac5cX5O1faRQM0w2VC_-mr6JUqP3amFNVCLJJwpuXxYo6OxRKHRVDV_zkwpxP-RRYRZm_aCSyKxQQsyYt0HCOZp2Ezw2yjKTGJUzjday_JANQuT-qBzS8hYalnzbGQ8_Zg0",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1YWQ0ZjdiNzkwMTUwMzM4NTg2OWFkMzk2Y2NhEgsSBxDsxcfEkwoYAZIBIwoKcHJvamVjdF9pZBIVQhM0MzkxOTg0NTc3NTg5ODM5ODQ1&filename=&opi=89354086"
  },
  {
    id: "9cc3626aa568464aa667e53643a22614",
    name: "screen-4-auth",
    title: "QuizzCraft - Sign In & Sign Up (Magnetic Space Effect)",
    screenshot: "https://lh3.googleusercontent.com/aida/AEtjO1VtlTpArEZrx2vi-PfA0Mmv7Kiye2SpOT9qgNCRVAIApEJhIAwBBFDqgnwZOxsZ9XRUKbNABad_S2FG9nWv8zeHhDvyKW6XXqMuuzW8_ArCotAPDxzc6wxFU8ZQUffI_pqTu6aMGOB60K6aJRQqa6QYurl13neggeg3WBH0O5BMLXgmZp2oqPJBtEKsmXIOzOmjy11cx373WB8xJOr3kaTYfIV7584QSyvskk_5L34lnzcRbbns_P6mCZA",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1YWQ0OWE1ZWE3ZjQwOTM0Zjc3NzcwM2M4NDBkEgsSBxDsxcfEkwoYAZIBIwoKcHJvamVjdF9pZBIVQhM0MzkxOTg0NTc3NTg5ODM5ODQ1&filename=&opi=89354086"
  },
  {
    id: "a711a15128ab4b1db39e58bbe272e9e4",
    name: "screen-5-results-leaderboard",
    title: "QuizzCraft - Quiz Results & Cosmic Leaderboard",
    screenshot: "https://lh3.googleusercontent.com/aida/AEtjO1VG0Et1tlL-qqJVEA6VB8kvzmTx7YU8RhMYmPCbaRGznw_hJ9t-h6eUR2UFEeNSfnFOo9ql6CpG8T8f5QODGRA24E_t_A8567YdQAJ_YSoU1VKohWBcQtLPes6FW8BnpzURkVE4H_fx_hxkifhK3eh9vB7nuV3cacOOAdUcDs6eK5x4a_vwMAdmlZvTkQ0HB9bllHMHLqfnC4XZoVIETLs3qvw1z0zOOZqrqhnX7Syvaxi9wcieYau-lzk",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1YWQ1MDI5ZjkyNGEwMjJkNmFmNDJkMTIzMmFiEgsSBxDsxcfEkwoYAZIBIwoKcHJvamVjdF9pZBIVQhM0MzkxOTg0NTc3NTg5ODM5ODQ1&filename=&opi=89354086"
  },
  {
    id: "ae2aaaa162374f2b8d588faaa17ba31a",
    name: "screen-6-cosmic-portal-3d",
    title: "Sleek modern 3D render of an ethereal floating cosmic knowledge portal...",
    screenshot: "https://lh3.googleusercontent.com/aida/AEtjO1Xm1rd1b1gpmTRnKNVUQPjGyGc5Imgd73N0ImtUD-hLuuVc1QmzUxxzVxIEdQtRM_-8OMZA-eMGAhF8Z3TEsVyD3mtL3idcE48-e6p_cQ5K__8J1SbRokPjNe1JyHJSb8ueX4fXRh7QktRcOjxF459qYAh1Xplc2fxbzl_kMFLuUemC9fNZwK23O86Da5Ul_xuNzDb9c34Rn_8or0UnizQFWeg-hEOj9iNMsbFubJUzpr0PhwoMCPY7fw",
    html: null
  },
  {
    id: "b3be8104fa1f47979ab0ad2203f73e37",
    name: "screen-7-deploy-schedule",
    title: "QuizzCraft - Deploy & Schedule Quiz (Cosmic Space)",
    screenshot: "https://lh3.googleusercontent.com/aida/AEtjO1WX2h2emeUc4GIZyImYtqY798lZBnhb3gVh0tkqCeBpf_eBZXJa_KGOJiX99hbtkuERrdujz2_-luTB6z3kIt4TGZly3L4lXRrsfJGK2wEoIMv-cNAmlPjTkPB0ElJId3EED9H2l0KYhV_ybgykFE__4gX3GINob0mGO4ltBv1CandvO7dmQFhbs7YaRMBpq-RphCNJXs2sTtJ2Zc3MAQjmjOPdHLsxjI6uGuzmmRflgfugGua0OUpi6j4",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1YWQ0Zjg2NTM2OWYwN2M0ZWViYzgwM2I0ZGMyEgsSBxDsxcfEkwoYAZIBIwoKcHJvamVjdF9pZBIVQhM0MzkxOTg0NTc3NTg5ODM5ODQ1&filename=&opi=89354086"
  },
  {
    id: "bcbd82c22d7a4e22919b53511256611a",
    name: "screen-8-creator-review-editor",
    title: "QuizzCraft - Creator Quiz Review & Editor (Cosmic Space)",
    screenshot: "https://lh3.googleusercontent.com/aida/AEtjO1U4fIbQaBWKT2_Uma8DWDfhoBJz0d4pZ6cKU2UyEAQwdIKoDCxH-ooB3sO9qggDFHIpEANEnJ_L0G-saS4lWzlb5MioJmyJzXitltxTLKyArvGOoEHYnD6x5NFwFZVI0CTNeHRATnofPAioMkQXKWdfNleRKqdT1tfLu7YKbi-Jz3Va6Vwgdu5ZZ5aSxB4TrYkV4TVTHCxzrDyTpG_Da5v7YTIdsvsIoHt9hR8q8UzrsjbPfsQdS0OAnwk",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1YWQ0ZGQxNTA0MGMwNzNhZmIxODY4MjE1OGM1EgsSBxDsxcfEkwoYAZIBIwoKcHJvamVjdF9pZBIVQhM0MzkxOTg0NTc3NTg5ODM5ODQ1&filename=&opi=89354086"
  },
  {
    id: "dc3b9a645cc7400d961126313c320e1b",
    name: "screen-9-create-quiz",
    title: "QuizzCraft - Create Your Quiz (Cosmic Space)",
    screenshot: "https://lh3.googleusercontent.com/aida/AEtjO1XreEzH5W5Rh7AGbOWLI7i7bII_VeF5NNbNbGWmjEYRKnpsq8KfjmncczDdCnJYF1-33k3X_e3Wae9EL_s78zuI9xdE9vGCmyebjYD6nJpcK9FnZSOtX4Z3CFUMMMzv15fBYZ1o8lK03cp3e-gL0By6TABRz6VD7TZy4DbUjKzjKoy96Dcep2QnTzLG6vR4rMUkgeupWXOk-qGdHhot8ZGAZKV4weXgY8KPax_LPJTK12Oj4a8Hbn_d8g",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1YWQ0NzM3MTExNzAwMzMyYzkyMTEzMmZhMzI2EgsSBxDsxcfEkwoYAZIBIwoKcHJvamVjdF9pZBIVQhM0MzkxOTg0NTc3NTg5ODM5ODQ1&filename=&opi=89354086"
  }
];

async function downloadFile(url, destPath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
  console.log(`Saved: ${destPath} (${buffer.length} bytes)`);
}

async function main() {
  const stitchRawScreenshots = path.join(__dirname, '..', 'stitch_raw', 'screenshots');
  const stitchRawHtml = path.join(__dirname, '..', 'stitch_raw', 'html');
  const publicStitch = path.join(__dirname, '..', 'public', 'stitch');

  fs.mkdirSync(stitchRawScreenshots, { recursive: true });
  fs.mkdirSync(stitchRawHtml, { recursive: true });
  fs.mkdirSync(publicStitch, { recursive: true });

  for (const s of screens) {
    console.log(`Downloading ${s.name} (${s.title})...`);
    
    // Download screenshot to both stitch_raw/screenshots and public/stitch
    if (s.screenshot) {
      const ext = 'png';
      const rawScreenshotPath = path.join(stitchRawScreenshots, `${s.name}.${ext}`);
      const publicScreenshotPath = path.join(publicStitch, `${s.name}.${ext}`);
      await downloadFile(s.screenshot, rawScreenshotPath);
      fs.copyFileSync(rawScreenshotPath, publicScreenshotPath);
    }

    // Download HTML
    if (s.html) {
      const rawHtmlPath = path.join(stitchRawHtml, `${s.name}.html`);
      await downloadFile(s.html, rawHtmlPath);
    }
  }
  console.log('All downloads completed!');
}

main().catch(console.error);
