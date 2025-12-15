# Redimensiona todas as imagens WebP em public/images para 1920x1080 (16:9)
# Usa a libwebp já incluída no repositório.

$ErrorActionPreference = 'Stop'

# Caminhos base
$repoRoot = Split-Path -Parent $PSScriptRoot
$imagesRoot = Join-Path $repoRoot 'public/images'
$webpBin = Join-Path $repoRoot 'scripts/libwebp-1.6.0-windows-x64/libwebp-1.6.0-windows-x64/bin/img2webp.exe'

if (!(Test-Path $webpBin)) {
  Write-Error "img2webp.exe não encontrado em: $webpBin"
}

if (!(Test-Path $imagesRoot)) {
  Write-Error "Pasta de imagens não encontrada: $imagesRoot"
}

$files = Get-ChildItem -Path $imagesRoot -Recurse -Filter '*.webp'

if (-not $files) {
  Write-Host "Nenhum arquivo .webp encontrado em $imagesRoot" -ForegroundColor Yellow
  return
}

Write-Host "Encontrados" $files.Count "arquivos .webp. Redimensionando para 1920x1080..." -ForegroundColor Cyan

foreach ($file in $files) {
  $in  = $file.FullName
  $tmp = "$in.tmp.webp"

  Write-Host "Processando: $in" -ForegroundColor Gray

  # -resize 1920 1080 força o tamanho exato 1920x1080.
  # Isso pode distorcer um pouco imagens com outro aspecto.
  & $webpBin -quiet -resize 1920 1080 "$in" -o "$tmp"

  if ($LASTEXITCODE -ne 0 -or -not (Test-Path $tmp)) {
    Write-Warning "Falha ao converter $in (código $LASTEXITCODE)"
    if (Test-Path $tmp) { Remove-Item $tmp -ErrorAction SilentlyContinue }
    continue
  }

  # Sobrescreve o original de forma atômica
  Move-Item -Force "$tmp" "$in"
}

Write-Host "Redimensionamento concluído." -ForegroundColor Green
