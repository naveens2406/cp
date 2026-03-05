# Kill the process
Stop-Process -Id 12464 -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start new server
Set-Location "D:\cp1\Sunlight-Offset-Printers-main\backend"
npm start
