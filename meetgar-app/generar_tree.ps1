$exclude = @("node_modules", ".git", ".next", ".vscode", ".env.local")
$maxDepth = 2

function Show-Tree($path, $prefix = "", $depth = 0) {
    if ($depth -gt $maxDepth) { return }

    $items = Get-ChildItem -Path $path -Force | Where-Object {
        -not ($exclude -contains $_.Name)
    }

    foreach ($item in $items) {
        Write-Output "$prefix$item"
        if ($item.PSIsContainer) {
            Show-Tree "$($item.FullName)" "$prefix  " ($depth + 1)
        }
    }
}

Show-Tree "." | Out-File -Encoding UTF8 -FilePath ".\estructura_reducida.txt"
Write-Host "✅ Archivo generado: estructura_reducida.txt"
