#!/bin/bash
#
# Download all images from the old norgehouse.com CMS
#
# The old site stores images at /uploads/{uuid}.jpg
# This script crawls all known project/gallery pages, extracts image URLs,
# downloads them, and organizes by category.
#
# Usage: bash scripts/download-old-images.sh
#
# Run from the norgehouse/ directory on YOUR LOCAL MACHINE
# (the old site blocks automated access from cloud servers)

set -euo pipefail

SITE="https://norgehouse.com"
OUT_DIR="./old-site-images"
LOCALES=("en")

mkdir -p "$OUT_DIR"/{projects,galleries,pages,news,other}

echo "=== Norge House Image Downloader ==="
echo ""

# Known project slugs from Google index
PROJECTS=(
  house-25 house-70 house-79 house-80 house-85 house-86
  house-88 house-99 house-114 house-124 house-125 house-127
  house-219 house-225
)

# Known gallery slugs
GALLERIES=(house-123 house-127 house-cst-bk)

# Pages to crawl
PAGES=(
  "/en/home/"
  "/en/about-us/"
  "/en/about-us/montage/"
  "/en/production/"
  "/en/projects"
  "/en/galleries"
)

# Function to extract image URLs from an HTML page
extract_images() {
  local url="$1"
  echo "  Crawling: $url"
  curl -sL "$url" 2>/dev/null | \
    grep -oP '(?:src|data-src|srcset)="[^"]*(/uploads/[^"]+\.(?:jpg|jpeg|png|webp))[^"]*"' | \
    grep -oP '/uploads/[^"]+\.(?:jpg|jpeg|png|webp)' | \
    sort -u || true
}

# Collect all image URLs
ALL_URLS_FILE=$(mktemp)

echo "--- Crawling project pages ---"
for slug in "${PROJECTS[@]}"; do
  imgs=$(extract_images "$SITE/en/projects/view/$slug/")
  for img in $imgs; do
    echo "projects|$img" >> "$ALL_URLS_FILE"
  done
done

echo ""
echo "--- Crawling gallery pages ---"
for slug in "${GALLERIES[@]}"; do
  imgs=$(extract_images "$SITE/en/galleries/$slug/")
  for img in $imgs; do
    echo "galleries|$img" >> "$ALL_URLS_FILE"
  done
done

echo ""
echo "--- Crawling main pages ---"
for page in "${PAGES[@]}"; do
  imgs=$(extract_images "$SITE$page")
  for img in $imgs; do
    echo "pages|$img" >> "$ALL_URLS_FILE"
  done
done

echo ""
echo "--- Crawling news ---"
NEWS_SLUGS=(
  "completely-finished-house-project"
  "holiday-apartment-with-swimming-pool-and-stylish-decor-in-the-jungle-of-mexico"
  "soulful-interiors-of-small-house-on-the-shore-of-lake-ontario"
  "light-and-elegant-modern-design-of-spacious-mississippi-home"
  "doze-of-inspiration-by-maisons-du-monde"
)
for slug in "${NEWS_SLUGS[@]}"; do
  imgs=$(extract_images "$SITE/en/news/view/$slug/")
  for img in $imgs; do
    echo "news|$img" >> "$ALL_URLS_FILE"
  done
done

# Deduplicate and download
echo ""
echo "=== Downloading images ==="

TOTAL=0
OK=0
FAIL=0

# Process unique URLs
sort -u "$ALL_URLS_FILE" | while IFS='|' read -r category img_path; do
  filename=$(basename "$img_path")
  dest="$OUT_DIR/$category/$filename"

  if [ -f "$dest" ]; then
    echo "  [SKIP] Already exists: $dest"
    continue
  fi

  TOTAL=$((TOTAL + 1))
  if curl -sL -o "$dest" "$SITE$img_path" 2>/dev/null; then
    # Check if we got a real image (not an error page)
    filetype=$(file -b --mime-type "$dest" 2>/dev/null || echo "unknown")
    if [[ "$filetype" == image/* ]]; then
      OK=$((OK + 1))
      echo "  [OK] $img_path → $dest"
    else
      rm -f "$dest"
      FAIL=$((FAIL + 1))
      echo "  [FAIL] $img_path (not an image: $filetype)"
    fi
  else
    FAIL=$((FAIL + 1))
    echo "  [FAIL] $img_path"
  fi
done

rm -f "$ALL_URLS_FILE"

echo ""
echo "=== Done ==="
echo "Images saved to: $OUT_DIR/"
echo ""
echo "Next steps:"
echo "  1. Review downloaded images in $OUT_DIR/"
echo "  2. Start the new site: docker compose -f docker-compose.local.yml up --build"
echo "  3. Open http://localhost/admin → Media → Upload images"
echo "  4. Assign images to projects, pages, and news in the CMS"
