export ARM_CLIENT_ID="*********************************************"
export ARM_CLIENT_SECRET="*********************************************"
export ARM_SUBSCRIPTION_ID="*********************************************"
export ARM_TENANT_ID="*********************************************"
export ARM_ACCESS_KEY="*********************************************"

echo "Variables exported!"

terraform -chdir=deploy init

echo ''
echo 'DONE'
echo ''