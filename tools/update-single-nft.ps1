# Update single NFT metadata
param(
    [string]$MintAddress,
    [string]$Tier,
    [string]$Rarity,
    [double]$Multiplier = 2.0,
    [int]$DesignNumber = 0
)

$body = @{
    mintAddress = $MintAddress
    tier = $Tier
    rarity = $Rarity
    multiplier = $Multiplier
    design_number = $DesignNumber
} | ConvertTo-Json

Write-Host "`n🔄 Обновляю NFT метаданные...`n"
Write-Host "Mint Address: $MintAddress"
Write-Host "Tier: $Tier, Rarity: $Rarity`n"

try {
    $response = Invoke-RestMethod -Uri "https://api.solanatamagotchi.com/api/update-nft-metadata-wrapper.php" -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop -TimeoutSec 180
    
    Write-Host "`n✅ УСПЕХ! Метаданные обновлены!`n"
    Write-Host "Transaction Signature: $($response.transactionSignature)"
    Write-Host "Explorer URL: $($response.explorerUrl)"
    Write-Host "Solscan URL: $($response.solscanUrl)"
    Write-Host "`nImage URL: $($response.imageUrl)"
    Write-Host "`n⏳ Подожди 1-2 минуты и обнови страницу Explorer`n"
} catch {
    Write-Host "`n❌ ОШИБКА:`n"
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "`nResponse Body:`n$responseBody"
    }
}

