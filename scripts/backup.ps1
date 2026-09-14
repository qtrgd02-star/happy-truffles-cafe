# Backup Script for Happy Truffles Cafe
# Run this daily via Windows Task Scheduler or cron

$backupDir = "backups"
$date = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = Join-Path $backupDir "backup_$date.zip"

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

$itemsToBackup = @(
    "data",
    "app/menu-data.ts",
    "app/api/admin/settings/route.ts"
)

Compress-Archive -Path $itemsToBackup -DestinationPath $backupFile -Force

Write-Host "Backup created: $backupFile"

# Keep only last 30 backups
$backups = Get-ChildItem $backupDir -Filter "backup_*.zip" | Sort-Object LastWriteTime -Descending
if ($backups.Count -gt 30) {
    $backups | Select-Object -Skip 30 | Remove-Item
    Write-Host "Old backups cleaned up"
}