$token = "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"
$url = "https://$($token)@github.com/Laurst2710/AG_Number1.git"
git remote set-url origin $url
git add .
git commit -m "AG: Sincronizare automata structura completa"
git push origin main
