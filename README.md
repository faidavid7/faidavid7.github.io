# Cheng-Han Chiang 江承瀚 — Personal Website

江承瀚的個人學術網站（中 / EN 雙語、深 / 淺色模式），純 HTML / CSS / JS、無 build step，部署在 GitHub Pages：<https://faidavid7.github.io/>

## 下載
按綠色 `Code` → `Download ZIP` 下載整個專案。

## 解壓縮
把 `.zip` 解壓縮到任意位置，會得到一個 `faidavid7.github.io/` 資料夾。

## 選擇資料夾
在瀏覽器打開該資料夾裡的 `index.html` 即可預覽；或在該資料夾執行：

```bash
python -m http.server 8000   # 然後開 http://localhost:8000
```

## 結構
| 檔案 | 用途 |
|---|---|
| `index.html` | 全部內容（中英文以 `<span class="zh">` / `<span class="en">` 成對撰寫） |
| `styles.css` | 版面、深淺色主題（CSS 變數）、時間線樣式 |
| `scripts.js` | 主題 / 語言切換、研究方格、時間線拖曳與連動 |
| `assets/` | 照片與各單位 logo |

## 更新網站
改完檔案後 `git commit` + `git push`，GitHub Pages 約 1 分鐘內自動更新。

## 授權
程式碼採用 Apache License 2.0，詳見 [LICENSE](LICENSE)。照片與各機構 logo 版權屬於原權利人，不在授權範圍內。
