# Monitoring Script for Happy Truffles Cafe
# Checks site health and sends alerts

$siteUrl = "http://localhost:3000"
$logFile = "logs/monitor.log"

if (-not (Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" | Out-Null
}

function Test-SiteHealth {
    param([string]$url)
    
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            return @{ healthy = $true; status = $response.StatusCode }
        }
        return @{ healthy = $false; status = $response.StatusCode }
    }
    catch {
        return @{ healthy = $false; status = $_.Exception.Message }
    }
}

$health = Test-SiteHealth -url $siteUrl
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

$logEntry = "[$timestamp] Site: $siteUrl | Status: $($health.status) | Healthy: $($health.healthy)"
Add-Content -Path $logFile -Value $logEntry

if (-not $health.healthy) {
    Write-Host "ALERT: Site is down!"
    # Send notification (email/SMS) here
    # Example: send-alert.ps1 -message "Site is down"
}
else {
    Write-Host "Site is healthy"
}