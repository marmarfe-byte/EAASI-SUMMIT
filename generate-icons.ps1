<#
  Icon + hero-logo generator, built from the real EAASI Partners Summit 2026
  logo (../../EAASI_Summit_26_Logo_Square.png — supplied by the user).
  Produces:
    - assets/eaasi-logo.png   (auto-cropped, transparent bg, used in Home hero)
    - icons/icon-192.png / icon-512.png (white bg, logo centered, maskable-safe)
#>
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$sourcePath = Join-Path $root "..\..\EAASI_Summit_26_Logo_Square.png"
$source = [System.Drawing.Bitmap]::FromFile($sourcePath)

function Get-BoundingBox($bmp, [int]$threshold = 250) {
  $minX = $bmp.Width; $maxX = 0; $minY = $bmp.Height; $maxY = 0
  $stepX = [Math]::Max(1, [int]($bmp.Width / 400))
  $stepY = [Math]::Max(1, [int]($bmp.Height / 400))
  for ($y = 0; $y -lt $bmp.Height; $y += $stepY) {
    for ($x = 0; $x -lt $bmp.Width; $x += $stepX) {
      $p = $bmp.GetPixel($x, $y)
      if ($p.R -lt $threshold -or $p.G -lt $threshold -or $p.B -lt $threshold) {
        if ($x -lt $minX) { $minX = $x }
        if ($x -gt $maxX) { $maxX = $x }
        if ($y -lt $minY) { $minY = $y }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }
  # pad by one scan step so we don't clip anti-aliased edges
  $minX = [Math]::Max(0, $minX - $stepX * 2)
  $minY = [Math]::Max(0, $minY - $stepY * 2)
  $maxX = [Math]::Min($bmp.Width - 1, $maxX + $stepX * 2)
  $maxY = [Math]::Min($bmp.Height - 1, $maxY + $stepY * 2)
  return @{ X = $minX; Y = $minY; Width = ($maxX - $minX); Height = ($maxY - $minY) }
}

$box = Get-BoundingBox $source
$cropRect = New-Object System.Drawing.Rectangle $box.X, $box.Y, $box.Width, $box.Height
$cropped = New-Object System.Drawing.Bitmap $box.Width, $box.Height
$g = [System.Drawing.Graphics]::FromImage($cropped)
$g.DrawImage($source, (New-Object System.Drawing.Rectangle 0, 0, $box.Width, $box.Height), $cropRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

# Make near-white pixels transparent so the logo drops cleanly onto dark backgrounds
$transparent = New-Object System.Drawing.Bitmap $cropped.Width, $cropped.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
for ($y = 0; $y -lt $cropped.Height; $y++) {
  for ($x = 0; $x -lt $cropped.Width; $x++) {
    $p = $cropped.GetPixel($x, $y)
    if ($p.R -gt 248 -and $p.G -gt 248 -and $p.B -gt 248) {
      $transparent.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
    } else {
      $transparent.SetPixel($x, $y, $p)
    }
  }
}

$assetsDir = Join-Path $root "assets"
New-Item -ItemType Directory -Force -Path $assetsDir | Out-Null
$transparent.Save((Join-Path $assetsDir "eaasi-logo.png"), [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Saved assets/eaasi-logo.png ($($transparent.Width)x$($transparent.Height), transparent bg)"

function New-AppIcon([int]$Size, [string]$OutPath) {
  $canvas = New-Object System.Drawing.Bitmap $Size, $Size
  $gr = [System.Drawing.Graphics]::FromImage($canvas)
  $gr.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $gr.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $gr.Clear([System.Drawing.Color]::White)

  # Fit cropped (opaque) logo within ~76% safe zone, centered
  $maxDim = $Size * 0.76
  $scale = [Math]::Min($maxDim / $cropped.Width, $maxDim / $cropped.Height)
  $w = $cropped.Width * $scale
  $h = $cropped.Height * $scale
  $x = ($Size - $w) / 2
  $y = ($Size - $h) / 2
  $gr.DrawImage($cropped, $x, $y, $w, $h)

  $canvas.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $gr.Dispose(); $canvas.Dispose()
}

$iconsDir = Join-Path $root "icons"
New-AppIcon -Size 192 -OutPath (Join-Path $iconsDir "icon-192.png")
New-AppIcon -Size 512 -OutPath (Join-Path $iconsDir "icon-512.png")
Write-Output "Icons regenerated from real EAASI logo."

$source.Dispose(); $cropped.Dispose(); $transparent.Dispose()
