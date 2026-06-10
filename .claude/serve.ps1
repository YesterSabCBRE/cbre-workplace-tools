$port = 3000
$root = Join-Path $PSScriptRoot "..\site"
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Serving $root on http://localhost:$port"
$mime = @{
  '.html'= 'text/html; charset=utf-8'; '.css'= 'text/css'; '.js'= 'application/javascript'
  '.json'= 'application/json'; '.png'= 'image/png'; '.svg'= 'image/svg+xml'
  '.ico'=  'image/x-icon'; '.woff2'= 'font/woff2'; '.xlsx'= 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  try {
    $rel = $ctx.Request.Url.LocalPath -replace '^/cbre-workplace-tools',''
    $rel = $rel.TrimStart('/')
    if ($rel -eq '') { $rel = 'index.html' }
    $file = Join-Path $root $rel
    if (Test-Path $file -PathType Leaf) {
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $ext   = [System.IO.Path]::GetExtension($file)
      $ctx.Response.ContentType     = if ($mime[$ext]) { $mime[$ext] } else { 'application/octet-stream' }
      $ctx.Response.ContentLength64 = $bytes.LongLength
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $body = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found')
      $ctx.Response.StatusCode      = 404
      $ctx.Response.ContentType     = 'text/plain'
      $ctx.Response.ContentLength64 = $body.LongLength
      $ctx.Response.OutputStream.Write($body, 0, $body.Length)
    }
  } catch { }
  finally {
    try { $ctx.Response.OutputStream.Close() } catch { }
    try { $ctx.Response.Close() } catch { }
  }
}
