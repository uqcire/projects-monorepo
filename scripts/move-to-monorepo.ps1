# Monorepo 转换脚本 - 移动项目到 packages/apps/ 目录

Write-Host "🚀 开始移动项目到标准 monorepo 结构..." -ForegroundColor Green

# 确保 packages/apps 目录存在
if (!(Test-Path "packages/apps")) {
    New-Item -ItemType Directory -Force -Path "packages/apps"
    Write-Host "✅ 创建 packages/apps 目录" -ForegroundColor Green
}

# 要移动的项目列表
$projects = @("dflm", "basketball-score", "cirq", "gcn-website", "site-template")

foreach ($project in $projects) {
    $sourcePath = "./$project"
    $destPath = "./packages/apps/$project"

    if (Test-Path $sourcePath) {
        Write-Host "📦 移动 $project..." -ForegroundColor Yellow

        # 移动整个目录
        Move-Item -Path $sourcePath -Destination $destPath -Force

        Write-Host "✅ $project 已移动到 $destPath" -ForegroundColor Green
    } else {
        Write-Host "⚠️  $project 目录不存在，跳过" -ForegroundColor Red
    }
}

Write-Host "🎉 项目移动完成！" -ForegroundColor Green
Write-Host "📁 新的项目结构：" -ForegroundColor Cyan
Write-Host "packages/" -ForegroundColor White
Write-Host "├── apps/" -ForegroundColor White
foreach ($project in $projects) {
    Write-Host "│   ├── $project/" -ForegroundColor White
}
Write-Host "├── dependency-versions/" -ForegroundColor White
Write-Host "├── tailwind-config/" -ForegroundColor White
Write-Host "└── vite-config/" -ForegroundColor White
