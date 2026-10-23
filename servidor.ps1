$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
} catch {
    Write-Host "El puerto $port ya está en uso o no se pudo abrir. Abriendo navegador..." -ForegroundColor Yellow
    Start-Process "http://localhost:$port"
    exit
}

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  Servidor local iniciado con éxito" -ForegroundColor Green
Write-Host "  Dirección: http://localhost:$port" -ForegroundColor Cyan
Write-Host "  (El vídeo de YouTube se reproducirá integrado aquí)" -ForegroundColor White
Write-Host "  Cierra esta ventana negra cuando termines de ver la web." -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Green

Start-Process "http://localhost:$port"

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".webp" = "image/webp"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

$root = $PSScriptRoot

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $relPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($relPath)) {
            $relPath = "index.html"
        }

        $localFile = Join-Path $root $relPath

        if (Test-Path $localFile -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($localFile).ToLower()
            $mime = "application/octet-stream"
            if ($mimeTypes.ContainsKey($ext)) {
                $mime = $mimeTypes[$ext]
            }
            $bytes = [System.IO.File]::ReadAllBytes($localFile)
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 No Encontrado")
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.OutputStream.Close()
    } catch {
        # Listener detenido
    }
}
