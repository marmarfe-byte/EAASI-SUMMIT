param(
  [int]$Port = 5500,
  [string]$Root = $PSScriptRoot
)

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")

$lanIp = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
  $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" -and $_.PrefixOrigin -ne "WellKnown"
} | Select-Object -First 1 -ExpandProperty IPAddress)

$lanBound = $false
if ($lanIp) {
  $listener.Prefixes.Add("http://$($lanIp):$Port/")
}

try {
  $listener.Start()
  if ($lanIp) { $lanBound = $true }
} catch {
  Write-Output "Could not bind LAN address (needs admin / URL ACL) - retrying with localhost only."
  Write-Output "To enable phone access without running as admin, run once in an elevated PowerShell:"
  Write-Output "  netsh http add urlacl url=http://$($lanIp):$Port/ user=Everyone"
  $listener = New-Object System.Net.HttpListener
  $listener.Prefixes.Add("http://localhost:$Port/")
  $listener.Start()
}

Write-Output "Serving $Root"
Write-Output "  Local:   http://localhost:$Port/"
if ($lanBound) { Write-Output "  Network: http://$($lanIp):$Port/  <- open this on your phone (same Wi-Fi)" }

$mime = @{
  ".html"        = "text/html; charset=utf-8"
  ".js"          = "application/javascript; charset=utf-8"
  ".json"        = "application/json; charset=utf-8"
  ".css"         = "text/css; charset=utf-8"
  ".png"         = "image/png"
  ".svg"         = "image/svg+xml"
  ".ico"         = "image/x-icon"
  ".webmanifest" = "application/manifest+json"
  ".avif"        = "image/avif"
}

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $request = $context.Request
  $response = $context.Response
  try {
    $path = $request.Url.AbsolutePath
    if ($path -eq "/") { $path = "/index.html" }
    $relative = $path.TrimStart('/') -replace '/', '\'
    $filePath = Join-Path $Root $relative
    if (Test-Path $filePath -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
      $contentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($filePath)
      $response.ContentType = $contentType
      $response.ContentLength64 = $bytes.Length
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $response.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
      $response.OutputStream.Write($msg, 0, $msg.Length)
    }
  } catch {
    $response.StatusCode = 500
  } finally {
    $response.OutputStream.Close()
  }
}
