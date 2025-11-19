param(
  [int]$Port = 8000,
  [string]$Root = (Get-Location).Path
)

$ErrorActionPreference = 'Stop'

function Get-MimeType($path) {
  switch ([IO.Path]::GetExtension($path).ToLower()) {
    '.html' { 'text/html; charset=utf-8' }
    '.js'   { 'application/javascript; charset=utf-8' }
    '.css'  { 'text/css; charset=utf-8' }
    '.svg'  { 'image/svg+xml' }
    '.json' { 'application/json; charset=utf-8' }
    '.png'  { 'image/png' }
    '.jpg'  { 'image/jpeg' }
    default { 'application/octet-stream' }
  }
}

$prefix = "http://localhost:$Port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Output "Server running at $prefix"
Write-Output "Serving $Root"

while ($true) {
  $context = $listener.GetContext()
  $req = $context.Request
  $res = $context.Response
  try {
    $path = $req.Url.AbsolutePath.TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($path)) { $path = 'index.html' }
    $full = Join-Path $Root $path
    if (-not (Test-Path $full)) {
      $res.StatusCode = 404
      $buf = [Text.Encoding]::UTF8.GetBytes('Not Found')
      $res.OutputStream.Write($buf, 0, $buf.Length)
      $res.Close()
      continue
    }
    $bytes = [IO.File]::ReadAllBytes($full)
    $res.ContentType = Get-MimeType $full
    $res.ContentLength64 = $bytes.Length
    $res.AddHeader('Cache-Control', 'no-cache')
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
    $res.Close()
  } catch {
    try { $res.StatusCode = 500; $buf = [Text.Encoding]::UTF8.GetBytes('Server Error'); $res.OutputStream.Write($buf,0,$buf.Length); $res.Close() } catch {}
  }
}

